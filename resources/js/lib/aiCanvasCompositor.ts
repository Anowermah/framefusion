/**
 * Client-Side Instant Canvas Compositor for AI Studio & Chatbot
 * Combines User Photo, Frame Template, Slot Coordinates, and Custom Text
 */

export interface SlotConfig {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    shape?: 'circle' | 'rectangle';
    rotation?: number;
}

export interface TextConfig {
    name?: string;
    designation?: string;
    font?: string;
    color?: string;
    size?: number;
    x?: number;
    y?: number;
}

export interface CompositeParams {
    frameUrl: string;
    userImage: string | File;
    slotConfig?: SlotConfig;
    textConfig?: TextConfig;
    outputSize?: number; // default 1080
}

/**
 * Load an image from URL or File safely into an HTMLImageElement
 */
function loadImage(source: string | File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => resolve(img);
        img.onerror = (err) => reject(new Error('Failed to load image: ' + err));

        if (source instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(source);
        } else {
            img.src = source;
        }
    });
}

/**
 * Composite the photo, frame, and text into a high-res DataURL
 */
export async function compositeFramePhoto({
    frameUrl,
    userImage,
    slotConfig,
    textConfig,
    outputSize = 1080,
}: CompositeParams): Promise<string> {
    const [frameImg, userImg] = await Promise.all([
        loadImage(frameUrl),
        loadImage(userImage),
    ]);

    // Setup canvas
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Canvas 2D context is not available');
    }

    // Default slot: centered square or circular slot
    const slotX = (slotConfig?.x ?? 0.1) * outputSize;
    const slotY = (slotConfig?.y ?? 0.1) * outputSize;
    const slotW = (slotConfig?.width ?? 0.8) * outputSize;
    const slotH = (slotConfig?.height ?? 0.8) * outputSize;
    const shape = slotConfig?.shape || 'rectangle';

    ctx.save();

    // 1. Clip slot area if shape is circle
    if (shape === 'circle') {
        const centerX = slotX + slotW / 2;
        const centerY = slotY + slotH / 2;
        const radius = Math.min(slotW, slotH) / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
    } else {
        // Rectangle clipping
        ctx.beginPath();
        ctx.rect(slotX, slotY, slotW, slotH);
        ctx.closePath();
        ctx.clip();
    }

    // 2. Draw user photo to cover slot with aspect-fill centering
    const photoRatio = userImg.width / userImg.height;
    const slotRatio = slotW / slotH;

    let drawW = slotW;
    let drawH = slotH;
    let drawX = slotX;
    let drawY = slotY;

    if (photoRatio > slotRatio) {
        drawW = slotH * photoRatio;
        drawX = slotX - (drawW - slotW) / 2;
    } else {
        drawH = slotW / photoRatio;
        drawY = slotY - (drawH - slotH) / 2;
    }

    ctx.drawImage(userImg, drawX, drawY, drawW, drawH);
    ctx.restore();

    // 3. Draw Frame Overlay on Top
    ctx.drawImage(frameImg, 0, 0, outputSize, outputSize);

    // 4. Draw Custom Text if provided (e.g. User Name / Title)
    if (textConfig?.name && textConfig.name.trim()) {
        ctx.save();
        const fontSize = Math.round(outputSize * (textConfig.size ? textConfig.size / 1000 : 0.042));
        const fontFam = textConfig.font || 'Hind Siliguri, sans-serif';
        ctx.font = `bold ${fontSize}px ${fontFam}`;
        ctx.fillStyle = textConfig.color || '#1e293b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add subtle shadow for legibility over any background
        ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1;

        const textX = (textConfig.x ?? 0.5) * outputSize;
        const textY = (textConfig.y ?? 0.88) * outputSize;

        ctx.fillText(textConfig.name.trim(), textX, textY);

        // Subtitle / Designation
        if (textConfig.designation && textConfig.designation.trim()) {
            const subFontSize = Math.round(fontSize * 0.75);
            ctx.font = `600 ${subFontSize}px ${fontFam}`;
            ctx.fillStyle = '#475569';
            ctx.fillText(textConfig.designation.trim(), textX, textY + fontSize * 1.25);
        }

        ctx.restore();
    }

    return canvas.toDataURL('image/png', 0.95);
}
