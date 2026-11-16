import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/Context/LanguageContext';
import { 
    Upload, ZoomIn, ZoomOut, RotateCcw, RotateCw, 
    RefreshCw, Download, Sliders, Move, Sparkles, 
    CheckCircle2, Share2, ArrowLeft, Eye, ShieldCheck,
    Type, Copy, Check, MessageCircle, Layers,
    Calendar, Clock, MapPin, User, Award, FileText,
    Palette, Minus, Plus
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

interface CampaignProps {
    id: number;
    title: string;
    title_bn?: string;
    slug: string;
    frame_url: string;
    campaign_type: string;
    caption_template?: string;
    frames?: {
        id: number;
        frame_url: string;
        aspect_ratio?: string;
    }[];
    category?: {
        name: string;
        name_bn?: string;
    };
    creator?: {
        name: string;
        is_verified?: boolean;
    };
}

interface PhotoEditorProps {
    campaign: CampaignProps;
}

export default function PhotoEditor({ campaign }: PhotoEditorProps) {
    const { language, t } = useLanguage();
    const { platform_settings } = (usePage?.()?.props || {}) as any;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Multi-Frame Variations Support
    const allFrames = campaign.frames && campaign.frames.length > 0
        ? campaign.frames
        : [{ id: 0, frame_url: campaign.frame_url }];

    const initialFrameIdx = typeof window !== 'undefined'
        ? parseInt(new URLSearchParams(window.location.search).get('frame') || '0', 10) || 0
        : 0;
    const [activeFrameIndex, setActiveFrameIndex] = useState(
        initialFrameIdx >= 0 && initialFrameIdx < allFrames.length ? initialFrameIdx : 0
    );
    const activeFrameUrl = allFrames[activeFrameIndex]?.frame_url || campaign.frame_url;

    // Watermark Configuration
    const enableWatermark = !!platform_settings?.enable_watermark;
    const watermarkText = platform_settings?.watermark_text || 'FrameFusion';
    const watermarkPosition = platform_settings?.watermark_position || 'bottom_right';

    // Caption for instant share
    const [captionCopied, setCaptionCopied] = useState(false);
    const pageUrl = typeof window !== 'undefined' ? `${window.location.origin}/campaigns/${campaign.slug}` : '';
    const studioCaption = campaign.caption_template ||
        (language === 'bn'
            ? `আমি "${campaign.title_bn || campaign.title}" ক্যাম্পেইনে অংশ নিয়েছি! আপনিও আপনার ছবি ফ্রেম করুন: ${pageUrl} #FrameFusion #Twibbon`
            : `I just framed my photo for "${campaign.title}"! Create yours now at: ${pageUrl} #FrameFusion #Campaign #Twibbon`);

    // Images state
    const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
    const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
    const [frameLoaded, setFrameLoaded] = useState(false);

    // Transform State
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState(campaign.campaign_type === 'event_notice' ? { x: 260, y: -70 } : { x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);

    // Dragging state
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Filter adjustments
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [grayscale, setGrayscale] = useState(0);
    const [sepia, setSepia] = useState(0);

    // Export configurations
    const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
    const [exportQuality, setExportQuality] = useState<'standard' | 'high'>('standard');
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '9:16'>('1:1');
    const [isDownloading, setIsDownloading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [downloadedImageUrl, setDownloadedImageUrl] = useState<string | null>(null);
    const [shareToGallery, setShareToGallery] = useState(false);

    // Tab view for mobile sidebar
    const isEventNotice = campaign.campaign_type === 'event_notice';
    const [activeTab, setActiveTab] = useState<'transform' | 'text' | 'event' | 'filters' | 'export'>(
        isEventNotice ? 'event' : ((campaign.campaign_type === 'custom_text' || campaign.campaign_type === 'greeting_card') ? 'text' : 'transform')
    );

    // Event & Notice Poster Customization States
    const [eventDate, setEventDate] = useState('২১ নভেম্বর ২০২৬, শুক্রবার');
    const [eventTime, setEventTime] = useState('দুপুর ১:৩০ মিনিট');
    const [eventVenue, setEventVenue] = useState('বায়তুল মোকাররম জাতীয় মসজিদ, ঢাকা');
    const [eventTopic, setEventTopic] = useState('বিষয়: জুম\'আর গুরুত্ব ও তাৎপর্য');
    const [speakerTitle, setSpeakerTitle] = useState('খতীব');
    const [speakerName, setSpeakerName] = useState('মাওলানা মুফতি আব্দুল্লাহ');
    const [eventFontFamily, setEventFontFamily] = useState<'Hind Siliguri' | 'Noto Serif Bengali' | 'Anek Bangla' | 'Inter'>('Hind Siliguri');
    const [eventFontSizeScale, setEventFontSizeScale] = useState(1.0);
    const [eventTextShadow, setEventTextShadow] = useState(true);
    const [eventPrimaryColor, setEventPrimaryColor] = useState('#FFFFFF');
    const [eventCardColor, setEventCardColor] = useState('#0B2559');

    // Custom Text & Advanced Customization States
    const [enableText, setEnableText] = useState(
        campaign.campaign_type === 'custom_text' || campaign.campaign_type === 'greeting_card'
    );
    const [primaryText, setPrimaryText] = useState('');
    const [secondaryText, setSecondaryText] = useState('');
    const [textPosition, setTextPosition] = useState<'bottom' | 'top' | 'center' | 'custom'>('bottom');
    const [textYOffset, setTextYOffset] = useState(86);
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [textShadow, setTextShadow] = useState(true);
    const [textBgStyle, setTextBgStyle] = useState<'dark_pill' | 'gold_ribbon' | 'brand_pill' | 'transparent'>('dark_pill');
    const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>('md');

    // 1. Load Campaign Transparent Frame (supports switching active frame)
    useEffect(() => {
        let isMounted = true;
        setFrameLoaded(false);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = activeFrameUrl;
        img.onload = () => {
            if (isMounted) {
                setFrameImage(img);
                setFrameLoaded(true);
            }
        };
        img.onerror = () => {
            console.warn('CORS or direct overlay load failed, retrying without anonymous crossOrigin...');
            const retryImg = new Image();
            retryImg.onload = () => {
                if (isMounted) {
                    setFrameImage(retryImg);
                    setFrameLoaded(true);
                }
            };
            retryImg.onerror = () => {
                console.error('All attempts to load campaign frame overlay failed.');
            };
            retryImg.src = activeFrameUrl;
        };

        return () => {
            isMounted = false;
        };
    }, [activeFrameUrl]);

    // Handle User Image File Upload
    const handleFileUpload = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (JPG, PNG, WebP).');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setUserImage(img);
                // Reset defaults on new image load
                setZoom(1);
                setPosition(campaign.campaign_type === 'event_notice' ? { x: 260, y: -70 } : { x: 0, y: 0 });
                setRotation(0);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    // 2. Render Canvas Function
    const renderCanvas = useCallback((targetCanvas: HTMLCanvasElement, scaleMultiplier: number = 1) => {
        const ctx = targetCanvas.getContext('2d');
        if (!ctx) return;

        // Base canvas dimensions based on chosen aspect ratio
        let baseW = 1080;
        let baseH = 1080;

        if (aspectRatio === '4:5') {
            baseW = 1080;
            baseH = 1350;
        } else if (aspectRatio === '9:16') {
            baseW = 1080;
            baseH = 1920;
        }

        const width = baseW * scaleMultiplier;
        const height = baseH * scaleMultiplier;

        targetCanvas.width = width;
        targetCanvas.height = height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // LAYER 1: Draw User Photo underneath
        if (userImage) {
            ctx.save();

            // Set Image Filters
            ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%)`;

            // Translate to center + user drag offset
            const centerX = (width / 2) + (position.x * scaleMultiplier);
            const centerY = (height / 2) + (position.y * scaleMultiplier);
            ctx.translate(centerX, centerY);

            // Rotate
            ctx.rotate((rotation * Math.PI) / 180);

            // Scale to fit canvas proportionally with user zoom
            const imageAspect = userImage.width / userImage.height;
            const canvasAspect = width / height;

            let drawW = width;
            let drawH = height;

            if (imageAspect > canvasAspect) {
                drawH = height;
                drawW = height * imageAspect;
            } else {
                drawW = width;
                drawH = width / imageAspect;
            }

            drawW *= zoom;
            drawH *= zoom;

            // Draw image centered at origin
            ctx.drawImage(userImage, -drawW / 2, -drawH / 2, drawW, drawH);

            ctx.restore();
        } else {
            // Draw placeholder pattern if no user photo uploaded yet
            ctx.fillStyle = '#F3F4F6';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#9CA3AF';
            ctx.font = `${Math.round(24 * scaleMultiplier)}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(t('uploadPhoto'), width / 2, height / 2);
        }

        // LAYER 2: Draw Transparent PNG Frame OVER the user photo
        if (frameImage) {
            ctx.save();
            ctx.filter = 'none'; // Never apply photo filters to the official campaign frame!

            // Compute centered frame drawing preserving frame ratio
            if (aspectRatio === '1:1') {
                ctx.drawImage(frameImage, 0, 0, width, height);
            } else {
                // If portrait or story, center the square frame within the canvas
                const frameSize = Math.min(width, height);
                const fx = (width - frameSize) / 2;
                const fy = (height - frameSize) / 2;
                ctx.drawImage(frameImage, fx, fy, frameSize, frameSize);
            }

            ctx.restore();
        }

        // LAYER 3: Draw Custom Text / Supporter Name / Custom Message
        if (enableText && primaryText.trim()) {
            ctx.save();
            ctx.filter = 'none';

            const pText = primaryText.trim();
            const sText = secondaryText.trim();

            // Responsive font sizing based on canvas width
            const sizeMap = {
                sm: { base: width * 0.040, sub: width * 0.026 },
                md: { base: width * 0.052, sub: width * 0.032 },
                lg: { base: width * 0.066, sub: width * 0.040 },
            };
            const currentSize = sizeMap[textSize] || sizeMap.md;
            const baseFontSize = currentSize.base;
            const subFontSize = currentSize.sub;

            // Universal multilingual font stack
            const fontStack = '"Hind Siliguri", "Noto Sans Bengali", "SolaimanLipi", "Inter", -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Calculate Y position
            let yPos = (textYOffset / 100) * height;
            if (textPosition === 'bottom') yPos = height * 0.86;
            if (textPosition === 'top') yPos = height * 0.14;
            if (textPosition === 'center') yPos = height * 0.50;

            const xPos = width / 2;

            // Measure text for background pill / ribbon
            ctx.font = `bold ${Math.round(baseFontSize)}px ${fontStack}`;
            const pMetrics = ctx.measureText(pText);
            ctx.font = `500 ${Math.round(subFontSize)}px ${fontStack}`;
            const sMetrics = sText ? ctx.measureText(sText) : { width: 0 };
            const maxTextWidth = Math.max(pMetrics.width, sMetrics.width);

            const pillPaddingX = baseFontSize * 0.95;
            const pillPaddingY = sText ? baseFontSize * 0.55 : baseFontSize * 0.40;
            const pillW = Math.min(width * 0.88, maxTextWidth + pillPaddingX * 2);
            const pillH = sText ? (baseFontSize + subFontSize + pillPaddingY * 2) : (baseFontSize + pillPaddingY * 2);

            // Draw background pill / ribbon if selected
            if (textBgStyle !== 'transparent') {
                ctx.save();
                const rx = xPos - pillW / 2;
                const ry = yPos - pillH / 2;
                const radius = Math.round(pillH / 2);

                if (textBgStyle === 'dark_pill') {
                    ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
                    ctx.lineWidth = Math.max(1, 1.5 * scaleMultiplier);
                } else if (textBgStyle === 'gold_ribbon') {
                    const grad = ctx.createLinearGradient(rx, ry, rx + pillW, ry + pillH);
                    grad.addColorStop(0, '#B45309');
                    grad.addColorStop(0.5, '#F59E0B');
                    grad.addColorStop(1, '#D97706');
                    ctx.fillStyle = grad;
                    ctx.strokeStyle = '#FDE68A';
                    ctx.lineWidth = Math.max(1, 1.5 * scaleMultiplier);
                } else if (textBgStyle === 'brand_pill') {
                    const grad = ctx.createLinearGradient(rx, ry, rx + pillW, ry + pillH);
                    grad.addColorStop(0, '#635BFF');
                    grad.addColorStop(1, '#8B5CF6');
                    ctx.fillStyle = grad;
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.lineWidth = Math.max(1, 1.5 * scaleMultiplier);
                }

                ctx.beginPath();
                if (typeof ctx.roundRect === 'function') {
                    ctx.roundRect(rx, ry, pillW, pillH, radius);
                } else {
                    ctx.rect(rx, ry, pillW, pillH);
                }
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }

            // High contrast text shadow
            if (textShadow) {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
                ctx.shadowBlur = Math.round(6 * scaleMultiplier);
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = Math.round(2 * scaleMultiplier);
            }

            // Draw Primary Text
            ctx.font = `bold ${Math.round(baseFontSize)}px ${fontStack}`;
            ctx.fillStyle = textColor;
            const primaryY = sText ? yPos - (subFontSize * 0.45) : yPos;
            ctx.fillText(pText, xPos, primaryY);

            // Draw Secondary Subtitle
            if (sText) {
                ctx.font = `600 ${Math.round(subFontSize)}px ${fontStack}`;
                ctx.fillStyle = textBgStyle === 'gold_ribbon' ? '#FEF3C7' : 'rgba(255, 255, 255, 0.9)';
                const secondaryY = yPos + (baseFontSize * 0.7);
                ctx.fillText(sText, xPos, secondaryY);
            }

            ctx.restore();
        }

        // LAYER 3B: Event & Notice Poster Dynamic Typography
        if (campaign.campaign_type === 'event_notice') {
            ctx.save();
            ctx.filter = 'none';

            const fontBase = `"${eventFontFamily}", "Hind Siliguri", "Noto Serif Bengali", "Anek Bangla", sans-serif`;

            // ZONE 1: Date & Time in the blue capsule (Calendar icon area on left)
            if (eventDate.trim() || eventTime.trim()) {
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const capsuleCenterX = width * 0.295;

                if (eventTextShadow) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
                    ctx.shadowBlur = Math.round(5 * scaleMultiplier);
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = Math.round(1.5 * scaleMultiplier);
                }

                // Date line
                if (eventDate.trim()) {
                    const dateFontSize = Math.round(18 * scaleMultiplier * eventFontSizeScale);
                    ctx.font = `bold ${dateFontSize}px ${fontBase}`;
                    ctx.fillStyle = eventPrimaryColor;
                    const dateY = eventTime.trim() ? (height * 0.448) : (height * 0.465);
                    ctx.fillText(eventDate.trim(), capsuleCenterX, dateY);
                }

                // Time line
                if (eventTime.trim()) {
                    const timeFontSize = Math.round(15 * scaleMultiplier * eventFontSizeScale);
                    ctx.font = `600 ${timeFontSize}px ${fontBase}`;
                    ctx.fillStyle = '#FEF3C7'; // Elegant warm gold/cream for time
                    const timeY = eventDate.trim() ? (height * 0.485) : (height * 0.465);
                    ctx.fillText(eventTime.trim(), capsuleCenterX, timeY);
                }
                ctx.restore();
            }

            // ZONE 2: Venue & Topic in the white card
            if (eventVenue.trim() || eventTopic.trim()) {
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const cardCenterX = width * 0.288;
                const cardMaxW = width * 0.41;

                // Venue Line
                if (eventVenue.trim()) {
                    const venueFontSize = Math.round(19 * scaleMultiplier * eventFontSizeScale);
                    ctx.font = `bold ${venueFontSize}px ${fontBase}`;
                    ctx.fillStyle = eventCardColor;
                    const venueY = eventTopic.trim() ? (height * 0.582) : (height * 0.630);
                    ctx.fillText(eventVenue.trim(), cardCenterX, venueY, cardMaxW);
                }

                // Topic / Notice Line (with auto word wrap)
                if (eventTopic.trim()) {
                    const topicFontSize = Math.round(17 * scaleMultiplier * eventFontSizeScale);
                    ctx.font = `600 ${topicFontSize}px ${fontBase}`;
                    ctx.fillStyle = '#1E3A8A';
                    
                    const words = eventTopic.trim().split(' ');
                    let line = '';
                    const lines: string[] = [];
                    for (let n = 0; n < words.length; n++) {
                        const testLine = line + words[n] + ' ';
                        const metrics = ctx.measureText(testLine);
                        if (metrics.width > cardMaxW && n > 0) {
                            lines.push(line.trim());
                            line = words[n] + ' ';
                        } else {
                            line = testLine;
                        }
                    }
                    lines.push(line.trim());

                    const topicStartY = eventVenue.trim() ? (height * 0.648) : (height * 0.615);
                    const lineHeight = topicFontSize * 1.35;
                    lines.slice(0, 2).forEach((l, i) => {
                        ctx.fillText(l, cardCenterX, topicStartY + (i * lineHeight), cardMaxW);
                    });
                }
                ctx.restore();
            }

            // ZONE 3: Designation Orange Badge ("খতীব" / "প্রধান আলোচক")
            if (speakerTitle.trim()) {
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const badgeCenterX = width * 0.528;
                const badgeCenterY = height * 0.772;
                const badgeFontSize = Math.round(17 * scaleMultiplier * eventFontSizeScale);

                if (eventTextShadow) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
                    ctx.shadowBlur = Math.round(3 * scaleMultiplier);
                    ctx.shadowOffsetY = Math.round(1 * scaleMultiplier);
                }

                ctx.font = `bold ${badgeFontSize}px ${fontBase}`;
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText(speakerTitle.trim(), badgeCenterX, badgeCenterY);
                ctx.restore();
            }

            // ZONE 4: Speaker / Supporter Name Ribbon
            if (speakerName.trim()) {
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const nameCenterX = width * 0.755;
                const nameCenterY = height * 0.875;
                const nameFontSize = Math.round(33 * scaleMultiplier * eventFontSizeScale);

                if (eventTextShadow) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
                    ctx.shadowBlur = Math.round(6 * scaleMultiplier);
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = Math.round(2 * scaleMultiplier);
                }

                ctx.font = `bold ${nameFontSize}px ${fontBase}`;
                ctx.fillStyle = eventPrimaryColor;
                ctx.fillText(speakerName.trim(), nameCenterX, nameCenterY, width * 0.42);
                ctx.restore();
            }

            ctx.restore();
        }

        // LAYER 4: Attribution Watermark (Admin Controlled Twibbonize Feature)
        if (enableWatermark && watermarkText) {
            ctx.save();
            const wmFontSize = Math.max(11, Math.round(13 * scaleMultiplier));
            ctx.font = `600 ${wmFontSize}px system-ui, -apple-system, sans-serif`;
            const textMetrics = ctx.measureText(watermarkText);
            const wmPaddingX = Math.round(10 * scaleMultiplier);
            const wmPaddingY = Math.round(5 * scaleMultiplier);
            const wmWidth = textMetrics.width + (wmPaddingX * 2);
            const wmHeight = wmFontSize + (wmPaddingY * 2);

            let wmX = width - wmWidth - Math.round(16 * scaleMultiplier);
            let wmY = height - wmHeight - Math.round(16 * scaleMultiplier);

            if (watermarkPosition === 'bottom_left') {
                wmX = Math.round(16 * scaleMultiplier);
            } else if (watermarkPosition === 'top_right') {
                wmY = Math.round(16 * scaleMultiplier);
            }

            // Translucent rounded capsule
            ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
            ctx.beginPath();
            if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(wmX, wmY, wmWidth, wmHeight, Math.round(6 * scaleMultiplier));
            } else {
                ctx.rect(wmX, wmY, wmWidth, wmHeight);
            }
            ctx.fill();

            // Text
            ctx.fillStyle = '#FFFFFF';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText(watermarkText, wmX + (wmWidth / 2), wmY + (wmHeight / 2) + 1);
            ctx.restore();
        }
    }, [
        userImage, frameImage, zoom, position, rotation, brightness, contrast, 
        saturation, grayscale, sepia, aspectRatio, t,
        enableText, primaryText, secondaryText, textPosition, textYOffset, 
        textColor, textShadow, textBgStyle, textSize,
        enableWatermark, watermarkText, watermarkPosition,
        campaign.campaign_type,
        eventDate, eventTime, eventVenue, eventTopic, speakerTitle, speakerName,
        eventFontFamily, eventFontSizeScale, eventTextShadow, eventPrimaryColor, eventCardColor
    ]);

    // Re-render display canvas whenever adjustments change
    useEffect(() => {
        if (canvasRef.current) {
            renderCanvas(canvasRef.current, 1);
        }
    }, [renderCanvas]);

    // Mouse / Touch Dragging for Panning
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!userImage) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!userImage || e.touches.length === 0) return;
        setIsDragging(true);
        const touch = e.touches[0];
        setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDragging || e.touches.length === 0) return;
        const touch = e.touches[0];
        setPosition({
            x: touch.clientX - dragStart.x,
            y: touch.clientY - dragStart.y,
        });
    };

    // Reset position & zoom
    const handleResetTransform = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
        setRotation(0);
    };

    // Reset filters
    const handleResetFilters = () => {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setGrayscale(0);
        setSepia(0);
    };

    // Download & Export Handler
    const handleDownload = () => {
        setIsDownloading(true);

        try {
            // Create offscreen export canvas
            const exportCanvas = document.createElement('canvas');
            const multiplier = exportQuality === 'high' ? 2 : 1;
            renderCanvas(exportCanvas, multiplier);

            const mimeType = exportFormat === 'png' ? 'image/png' : exportFormat === 'webp' ? 'image/webp' : 'image/jpeg';
            const qualityValue = exportFormat === 'png' ? 1.0 : 0.95;

            exportCanvas.toBlob((blob) => {
                if (!blob) {
                    setIsDownloading(false);
                    return;
                }

                const url = URL.createObjectURL(blob);
                setDownloadedImageUrl(url);

                // Auto download file
                const link = document.createElement('a');
                link.download = `framefusion-${campaign.slug}.${exportFormat}`;
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Confetti fireworks!
                confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#635BFF', '#8B5CF6', '#FF6B8A', '#10B981', '#F59E0B'],
                });

                // Post supporter count increment to backend
                fetch(`/campaigns/${campaign.id}/generate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                    },
                    body: JSON.stringify({
                        format: exportFormat,
                        quality: exportQuality,
                    }),
                });

                setIsDownloading(false);
                setShowSuccessModal(true);
            }, mimeType, qualityValue);
        } catch (err) {
            console.error('Export failed:', err);
            setIsDownloading(false);
        }
    };

    const campaignTitle = language === 'bn' && campaign.title_bn ? campaign.title_bn : campaign.title;

    return (
        <div className="min-h-screen bg-[#F8F9FC] py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Top Bar Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/campaigns/${campaign.slug}`}
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                            title="Back to Campaign"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                                    {t('photoEditor')}
                                </span>
                            </div>
                            <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 mt-0.5 truncate max-w-md">
                                {campaignTitle}
                            </h1>
                        </div>
                    </div>

                    {/* Quick Action in Header */}
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer transition-all">
                            <Upload className="w-4 h-4 text-brand-500" />
                            <span>{userImage ? t('changePhoto') : t('uploadPhoto')}</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                            />
                        </label>

                        <button
                            onClick={handleDownload}
                            disabled={isDownloading || !userImage}
                            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all ${
                                !userImage 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-brand-500 hover:bg-brand-600 active:scale-95 shadow-brand-500/25'
                            }`}
                        >
                            <Download className="w-4 h-4" />
                            <span>{isDownloading ? t('processing') : t('downloadImage')}</span>
                        </button>
                    </div>
                </div>

                {/* Multi-Frame Variations Switcher Ribbon */}
                {allFrames.length > 1 && (
                    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between gap-4 overflow-x-auto w-full max-w-full scrollbar-none">
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="w-7 h-7 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                                <Layers className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-800">
                                {language === 'bn' ? 'ফ্রেম ভেরিয়েশন নির্বাচন করুন:' : 'Select Frame Variation:'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {allFrames.map((f, idx) => (
                                <button
                                    key={f.id || idx}
                                    type="button"
                                    onClick={() => setActiveFrameIndex(idx)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all ${
                                        activeFrameIndex === idx
                                            ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold shadow-xs scale-102'
                                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    <img src={f.frame_url} alt="" className="w-6 h-6 object-contain" />
                                    <span className="text-xs font-bold">Variation #{idx + 1}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Workspace Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEFT SIDEBAR: Adjustments and controls */}
                    <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-6">
                        {/* Tabs */}
                        <div className="flex p-1 bg-gray-100 rounded-xl text-xs font-bold text-gray-600 gap-1">
                            {isEventNotice ? (
                                <>
                                    <button
                                        onClick={() => setActiveTab('event')}
                                        className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                            activeTab === 'event' ? 'bg-white text-blue-600 shadow-xs font-black' : 'hover:text-gray-900'
                                        }`}
                                    >
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{language === 'bn' ? 'পোস্টার তথ্য' : 'Poster Info'}</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('transform')}
                                        className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                            activeTab === 'transform' ? 'bg-white text-brand-600 shadow-xs' : 'hover:text-gray-900'
                                        }`}
                                    >
                                        <Move className="w-3.5 h-3.5" />
                                        <span>{language === 'bn' ? 'পজিশন' : 'Position'}</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('filters')}
                                        className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                            activeTab === 'filters' ? 'bg-white text-brand-600 shadow-xs' : 'hover:text-gray-900'
                                        }`}
                                    >
                                        <Sliders className="w-3.5 h-3.5" />
                                        <span>{t('filters')}</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('export')}
                                        className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                            activeTab === 'export' ? 'bg-white text-brand-600 shadow-xs' : 'hover:text-gray-900'
                                        }`}
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>{t('exportSettings')}</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setActiveTab('transform')}
                                        className={`flex-1 py-2 rounded-lg transition-all ${
                                            activeTab === 'transform' ? 'bg-white text-brand-600 shadow-xs' : 'hover:text-gray-900'
                                        }`}
                                    >
                                        {language === 'bn' ? 'পজিশন' : 'Position'}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('text')}
                                        className={`flex-1 py-2 rounded-lg transition-all relative ${
                                            activeTab === 'text' ? 'bg-white text-brand-600 shadow-xs' : 'hover:text-gray-900'
                                        }`}
                                    >
                                        <span>{language === 'bn' ? 'নাম/টেক্সট' : 'Text'}</span>
                                        {enableText && primaryText && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 absolute top-1.5 right-1.5" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('filters')}
                                        className={`flex-1 py-2 rounded-lg transition-all ${
                                            activeTab === 'filters' ? 'bg-white text-brand-600 shadow-xs' : 'hover:text-gray-900'
                                        }`}
                                    >
                                        {t('filters')}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('export')}
                                        className={`flex-1 py-2 rounded-lg transition-all ${
                                            activeTab === 'export' ? 'bg-white text-brand-600 shadow-xs' : 'hover:text-gray-900'
                                        }`}
                                    >
                                        {t('exportSettings')}
                                    </button>
                                </>
                            )}
                        </div>

                        {/* TAB: Event & Notice Poster Customizer */}
                        {activeTab === 'event' && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                {/* Header / Instructions */}
                                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-blue-950">
                                            {language === 'bn' ? 'ইভেন্ট ও নোটিশ পোস্টার স্টুডিও' : 'Event & Notice Poster Studio'}
                                        </h4>
                                        <p className="text-[11px] text-blue-700 leading-relaxed mt-0.5">
                                            {language === 'bn' 
                                                ? 'তারিখ, সময়, স্থান, আলোচ্য বিষয়, পদবি ও নিজের নাম পরিবর্তন করে প্রিমিয়াম পোস্টার তৈরি করুন।'
                                                : 'Update date, time, venue, topic, designation, and name with real-time live preview.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-3.5">
                                    {/* 1. Date */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                            <span>{language === 'bn' ? 'তারিখ (Date)' : 'Event Date'}</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={eventDate}
                                            onChange={(e) => setEventDate(e.target.value)}
                                            placeholder="যেমন: ২১ নভেম্বর ২০২৬, শুক্রবার"
                                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                        />
                                    </div>

                                    {/* 2. Time */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                                            <span>{language === 'bn' ? 'সময় (Time)' : 'Event Time'}</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={eventTime}
                                            onChange={(e) => setEventTime(e.target.value)}
                                            placeholder="যেমন: দুপুর ১:৩০ মিনিট"
                                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                        />
                                    </div>

                                    {/* 3. Venue */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                            <span>{language === 'bn' ? 'স্থান / মসজিদ / ভেন্যু' : 'Venue / Mosque / Location'}</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={eventVenue}
                                            onChange={(e) => setEventVenue(e.target.value)}
                                            placeholder="যেমন: বায়তুল মোকাররম জাতীয় মসজিদ, ঢাকা"
                                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                        />
                                    </div>

                                    {/* 4. Topic / Notice */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>{language === 'bn' ? 'বিষয় / নোটিশ বিবরণ' : 'Topic / Notice Details'}</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={eventTopic}
                                            onChange={(e) => setEventTopic(e.target.value)}
                                            placeholder="যেমন: বিষয়: জুম'আর গুরুত্ব ও তাৎপর্য"
                                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                        />
                                    </div>

                                    {/* 5. Designation / Badge */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                                <Award className="w-3.5 h-3.5 text-amber-500" />
                                                <span>{language === 'bn' ? 'পদবি (Designation Badge)' : 'Designation Badge'}</span>
                                            </label>
                                            <span className="text-[10px] text-gray-400">কমলারঙা ব্যাজ</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={speakerTitle}
                                            onChange={(e) => setSpeakerTitle(e.target.value)}
                                            placeholder="যেমন: খতীব"
                                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold text-amber-700 bg-amber-50/40"
                                            maxLength={25}
                                        />
                                        {/* Quick Badge Suggestions */}
                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                            {['খতীব', 'প্রধান আলোচক', 'বিশেষ মেহমান', 'সভাপতি', 'আমন্ত্রিত অতিথি'].map((b) => (
                                                <button
                                                    key={b}
                                                    type="button"
                                                    onClick={() => setSpeakerTitle(b)}
                                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                                                        speakerTitle === b
                                                            ? 'bg-amber-500 text-white shadow-xs'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-800'
                                                    }`}
                                                >
                                                    {b}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 6. Speaker / Your Name */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-indigo-600" />
                                            <span>{language === 'bn' ? 'বক্তা বা আপনার নাম (Name)' : 'Speaker / Your Name'}</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={speakerName}
                                            onChange={(e) => setSpeakerName(e.target.value)}
                                            placeholder="যেমন: মাওলানা মুফতি আব্দুল্লাহ"
                                            className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-black text-gray-900"
                                            maxLength={40}
                                        />
                                    </div>

                                    {/* 7. Bangla Premium Typography Selector */}
                                    <div className="pt-2 border-t border-gray-100 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                                <Type className="w-3.5 h-3.5 text-blue-600" />
                                                <span>{language === 'bn' ? 'বাংলা প্রিমিয়াম ফন্ট স্টাইল' : 'Bangla Premium Typography'}</span>
                                            </label>
                                            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                {eventFontFamily}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { id: 'Hind Siliguri', name: 'হিন্দ শিলিগুড়ি', sub: 'স্পষ্ট ও স্ট্যান্ডার্ড', font: '"Hind Siliguri", sans-serif' },
                                                { id: 'Noto Serif Bengali', name: 'নোটো সেরিফ', sub: 'ক্লাসিক ও মার্জিত', font: '"Noto Serif Bengali", serif' },
                                                { id: 'Anek Bangla', name: 'অনেকা বাংলা', sub: 'আধুনিক ও স্টাইলিশ', font: '"Anek Bangla", sans-serif' },
                                                { id: 'Inter', name: 'সিম্পল সান্স', sub: 'English / Clean', font: 'Inter, sans-serif' },
                                            ].map((f) => (
                                                <button
                                                    key={f.id}
                                                    type="button"
                                                    onClick={() => setEventFontFamily(f.id as any)}
                                                    className={`p-2.5 rounded-xl border text-left transition-all ${
                                                        eventFontFamily === f.id
                                                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100 shadow-xs'
                                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                                    }`}
                                                >
                                                    <span 
                                                        className="block text-xs font-bold text-gray-900" 
                                                        style={{ fontFamily: f.font }}
                                                    >
                                                        {f.name}
                                                    </span>
                                                    <span className="block text-[10px] text-gray-400 mt-0.5">
                                                        {f.sub}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 8. Font Size Scaling (লেখা ছোট / বড় করার কন্ট্রোল) */}
                                    <div className="pt-2 border-t border-gray-100 space-y-2">
                                        <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                                            <span className="flex items-center gap-1.5">
                                                <span>{language === 'bn' ? 'লেখা ছোট / বড় করুন (Font Size)' : 'Text Size Scale'}</span>
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                                    {Math.round(eventFontSizeScale * 100)}%
                                                </span>
                                                {eventFontSizeScale !== 1.0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setEventFontSizeScale(1.0)}
                                                        className="text-[10px] text-gray-400 hover:text-gray-700 underline"
                                                    >
                                                        Reset
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            {/* A- (Smaller) */}
                                            <button
                                                type="button"
                                                onClick={() => setEventFontSizeScale(s => Math.max(0.70, +(s - 0.05).toFixed(2)))}
                                                className="px-2.5 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-black text-gray-700 flex items-center gap-1 shrink-0"
                                                title="ছোট করুন"
                                            >
                                                <Minus className="w-3 h-3" />
                                                <span>A-</span>
                                            </button>

                                            {/* Slider */}
                                            <input
                                                type="range"
                                                min="0.70"
                                                max="1.35"
                                                step="0.05"
                                                value={eventFontSizeScale}
                                                onChange={(e) => setEventFontSizeScale(parseFloat(e.target.value))}
                                                className="flex-1 accent-blue-600 cursor-pointer"
                                            />

                                            {/* A+ (Larger) */}
                                            <button
                                                type="button"
                                                onClick={() => setEventFontSizeScale(s => Math.min(1.35, +(s + 0.05).toFixed(2)))}
                                                className="px-2.5 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-black text-gray-700 flex items-center gap-1 shrink-0"
                                                title="বড় করুন"
                                            >
                                                <Plus className="w-3 h-3" />
                                                <span>A+</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* 9. Text Shadow & Readability */}
                                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-bold text-gray-800 block">
                                                {language === 'bn' ? 'লেখার স্পষ্ট ছায়া (Shadow)' : 'Drop Shadow'}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {language === 'bn' ? 'ব্যাকগ্রাউন্ডে লেখা স্পষ্ট ফুটিয়ে তোলে' : 'Enhances contrast over image'}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setEventTextShadow(!eventTextShadow)}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                                eventTextShadow ? 'bg-blue-600' : 'bg-gray-200'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                                    eventTextShadow ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 1: Transform & Placement */}
                        {activeTab === 'transform' && (
                            <div className="space-y-6 animate-in fade-in duration-200">
                                {/* Zoom Control */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                                        <span className="flex items-center gap-1.5">
                                            <ZoomIn className="w-3.5 h-3.5 text-brand-500" />
                                            {t('zoomControls')}
                                        </span>
                                        <span className="text-gray-500">{Math.round(zoom * 100)}%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setZoom(Math.max(0.2, zoom - 0.1))}
                                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
                                            title={t('zoomOut')}
                                        >
                                            <ZoomOut className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="range"
                                            min="0.2"
                                            max="3"
                                            step="0.05"
                                            value={zoom}
                                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                                            className="flex-1 accent-brand-500 cursor-pointer"
                                        />
                                        <button
                                            onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
                                            title={t('zoomIn')}
                                        >
                                            <ZoomIn className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Rotation Control */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                                        <span className="flex items-center gap-1.5">
                                            <RotateCw className="w-3.5 h-3.5 text-brand-500" />
                                            {t('rotateControls')}
                                        </span>
                                        <span className="text-gray-500">{rotation}°</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setRotation((prev) => (prev - 90) % 360)}
                                            className="flex-1 py-1.5 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            -90°
                                        </button>
                                        <button
                                            onClick={() => setRotation((prev) => (prev + 90) % 360)}
                                            className="flex-1 py-1.5 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5"
                                        >
                                            <RotateCw className="w-3.5 h-3.5" />
                                            +90°
                                        </button>
                                    </div>
                                    <input
                                        type="range"
                                        min="-180"
                                        max="180"
                                        value={rotation}
                                        onChange={(e) => setRotation(parseInt(e.target.value))}
                                        className="w-full accent-brand-500 cursor-pointer mt-1"
                                    />
                                </div>

                                {/* Pan / Position pad */}
                                <div className="space-y-2">
                                    <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <Move className="w-3.5 h-3.5 text-brand-500" />
                                        {t('positionControls')} (or drag on canvas)
                                    </span>
                                    <div className="grid grid-cols-3 gap-1.5 max-w-[180px] mx-auto pt-1">
                                        <div />
                                        <button
                                            onClick={() => setPosition(p => ({ ...p, y: p.y - 15 }))}
                                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-center"
                                        >
                                            ↑
                                        </button>
                                        <div />
                                        <button
                                            onClick={() => setPosition(p => ({ ...p, x: p.x - 15 }))}
                                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-center"
                                        >
                                            ←
                                        </button>
                                        <button
                                            onClick={handleResetTransform}
                                            className="p-2 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg text-[10px] font-bold text-center flex items-center justify-center"
                                            title={t('resetAdjustments')}
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => setPosition(p => ({ ...p, x: p.x + 15 }))}
                                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-center"
                                        >
                                            →
                                        </button>
                                        <div />
                                        <button
                                            onClick={() => setPosition(p => ({ ...p, y: p.y + 15 }))}
                                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-center"
                                        >
                                            ↓
                                        </button>
                                        <div />
                                    </div>
                                </div>

                                <button
                                    onClick={handleResetTransform}
                                    className="w-full py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    {t('resetAdjustments')}
                                </button>
                            </div>
                        )}

                        {/* TAB 2: Custom Text & Name Badge */}
                        {activeTab === 'text' && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                {/* Toggle Custom Text */}
                                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div>
                                        <span className="text-xs font-bold text-gray-900 block">
                                            {language === 'bn' ? 'ফ্রেমে নাম বা লেখা যোগ করুন' : 'Add Name / Text to Frame'}
                                        </span>
                                        <span className="text-[10px] text-gray-500">
                                            {language === 'bn' ? 'নিজের নাম বা বার্তা যুক্ত করে ফ্রেম পারসোনালাইজ করুন' : 'Personalize frame with your custom name or message'}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setEnableText(!enableText)}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                            enableText ? 'bg-brand-500' : 'bg-gray-200'
                                        }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                                enableText ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {enableText && (
                                    <div className="space-y-4 pt-1">
                                        {/* Primary Text (Name) */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-700 block">
                                                {language === 'bn' ? 'আপনার নাম বা মূল লেখা' : 'Your Name / Main Text'}
                                            </label>
                                            <input
                                                type="text"
                                                value={primaryText}
                                                onChange={(e) => setPrimaryText(e.target.value)}
                                                placeholder={language === 'bn' ? 'যেমন: মোহাম্মদ আনোয়ার' : 'e.g. John Doe / Eid Mubarak'}
                                                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium"
                                                maxLength={45}
                                            />
                                        </div>

                                        {/* Secondary Text (Designation / District / Slogan) */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-700 block">
                                                {language === 'bn' ? 'পদবী / জেলা / বার্তা (ঐচ্ছিক)' : 'Designation / Slogan (Optional)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={secondaryText}
                                                onChange={(e) => setSecondaryText(e.target.value)}
                                                placeholder={language === 'bn' ? 'যেমন: সদস্য, ঢাকা মহানগর' : 'e.g. Supporter, Dhaka'}
                                                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium"
                                                maxLength={55}
                                            />
                                        </div>

                                        {/* Ribbon / Badge Style */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-700 block">
                                                {language === 'bn' ? 'রিবন বা ব্যাজ স্টাইল' : 'Ribbon / Badge Style'}
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { id: 'dark_pill', label: language === 'bn' ? 'ডার্ক গ্লাস' : 'Dark Glass', dot: 'bg-slate-900' },
                                                    { id: 'gold_ribbon', label: language === 'bn' ? 'গোল্ডেন রিবন' : 'Gold Ribbon', dot: 'bg-amber-500' },
                                                    { id: 'brand_pill', label: language === 'bn' ? 'ভায়োলেট' : 'Violet Brand', dot: 'bg-brand-500' },
                                                    { id: 'transparent', label: language === 'bn' ? 'ক্লিন শ্যাডো' : 'Clean Text', dot: 'bg-gray-300' },
                                                ].map((s) => (
                                                    <button
                                                        key={s.id}
                                                        type="button"
                                                        onClick={() => setTextBgStyle(s.id as any)}
                                                        className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                                                            textBgStyle === s.id
                                                                ? 'border-brand-500 bg-brand-50/50 text-brand-700 font-bold shadow-xs'
                                                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                                        }`}
                                                    >
                                                        <span className={`w-3 h-3 rounded-full shrink-0 ${s.dot}`} />
                                                        <span className="truncate">{s.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Position Presets + Y-Offset Slider */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                                                <span>{language === 'bn' ? 'অবস্থান নির্বাচন' : 'Position'}</span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setTextPosition('bottom'); setTextYOffset(86); }}
                                                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                                                            textPosition === 'bottom' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {language === 'bn' ? 'নিচে' : 'Bottom'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setTextPosition('top'); setTextYOffset(14); }}
                                                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                                                            textPosition === 'top' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {language === 'bn' ? 'উপরে' : 'Top'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setTextPosition('center'); setTextYOffset(50); }}
                                                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                                                            textPosition === 'center' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {language === 'bn' ? 'মাঝে' : 'Center'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Fine-tune Vertical Slider */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[11px] text-gray-400">
                                                    <span>{language === 'bn' ? 'সূক্ষ্ম অবস্থান সামঞ্জস্য' : 'Fine-tune Y-Offset'}</span>
                                                    <span>{textYOffset}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="10"
                                                    max="92"
                                                    step="1"
                                                    value={textYOffset}
                                                    onChange={(e) => {
                                                        setTextYOffset(parseInt(e.target.value));
                                                        setTextPosition('custom');
                                                    }}
                                                    className="w-full accent-brand-500 cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        {/* Text Size */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-700 block">
                                                {language === 'bn' ? 'লেখার সাইজ' : 'Font Size'}
                                            </label>
                                            <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                                                {[
                                                    { id: 'sm', label: language === 'bn' ? 'ছোট' : 'Small' },
                                                    { id: 'md', label: language === 'bn' ? 'মাঝারি' : 'Medium' },
                                                    { id: 'lg', label: language === 'bn' ? 'বড়' : 'Large' },
                                                ].map((sz) => (
                                                    <button
                                                        key={sz.id}
                                                        type="button"
                                                        onClick={() => setTextSize(sz.id as any)}
                                                        className={`py-1.5 rounded-xl border text-center transition-all ${
                                                            textSize === sz.id
                                                                ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold'
                                                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                                        }`}
                                                    >
                                                        {sz.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: Image Filters */}
                        {activeTab === 'filters' && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                {/* Brightness */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-gray-700">
                                        <span>{t('brightness')}</span>
                                        <span className="text-gray-500">{brightness}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50"
                                        max="150"
                                        value={brightness}
                                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                                        className="w-full accent-brand-500 cursor-pointer"
                                    />
                                </div>

                                {/* Contrast */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-gray-700">
                                        <span>{t('contrast')}</span>
                                        <span className="text-gray-500">{contrast}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50"
                                        max="150"
                                        value={contrast}
                                        onChange={(e) => setContrast(parseInt(e.target.value))}
                                        className="w-full accent-brand-500 cursor-pointer"
                                    />
                                </div>

                                {/* Saturation */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-gray-700">
                                        <span>{t('saturation')}</span>
                                        <span className="text-gray-500">{saturation}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={saturation}
                                        onChange={(e) => setSaturation(parseInt(e.target.value))}
                                        className="w-full accent-brand-500 cursor-pointer"
                                    />
                                </div>

                                {/* Grayscale */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-gray-700">
                                        <span>{t('grayscale')}</span>
                                        <span className="text-gray-500">{grayscale}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={grayscale}
                                        onChange={(e) => setGrayscale(parseInt(e.target.value))}
                                        className="w-full accent-brand-500 cursor-pointer"
                                    />
                                </div>

                                {/* Sepia */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-gray-700">
                                        <span>{t('sepia')}</span>
                                        <span className="text-gray-500">{sepia}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={sepia}
                                        onChange={(e) => setSepia(parseInt(e.target.value))}
                                        className="w-full accent-brand-500 cursor-pointer"
                                    />
                                </div>

                                <button
                                    onClick={handleResetFilters}
                                    className="w-full py-2 mt-2 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    {t('resetFilters')}
                                </button>
                            </div>
                        )}

                        {/* TAB 3: Export Settings */}
                        {activeTab === 'export' && (
                            <div className="space-y-5 animate-in fade-in duration-200">
                                {/* Aspect Ratio */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 block">{t('aspectRatio')}</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => setAspectRatio('1:1')}
                                            className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                                                aspectRatio === '1:1' ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                            }`}
                                        >
                                            <span className="block text-sm">1:1</span>
                                            <span className="text-[10px] text-gray-500 font-normal">Square</span>
                                        </button>
                                        <button
                                            onClick={() => setAspectRatio('4:5')}
                                            className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                                                aspectRatio === '4:5' ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                            }`}
                                        >
                                            <span className="block text-sm">4:5</span>
                                            <span className="text-[10px] text-gray-500 font-normal">Portrait</span>
                                        </button>
                                        <button
                                            onClick={() => setAspectRatio('9:16')}
                                            className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                                                aspectRatio === '9:16' ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                            }`}
                                        >
                                            <span className="block text-sm">9:16</span>
                                            <span className="text-[10px] text-gray-500 font-normal">Story</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Format */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 block">{t('fileFormat')}</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                                            <button
                                                key={fmt}
                                                onClick={() => setExportFormat(fmt)}
                                                className={`py-2 rounded-xl border text-xs font-bold uppercase transition-all ${
                                                    exportFormat === fmt ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {fmt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quality */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 block">{t('resolution')}</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setExportQuality('standard')}
                                            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                                exportQuality === 'standard' ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="block font-bold">Standard</span>
                                            <span className="text-[10px] text-gray-500">1080px (Fast)</span>
                                        </button>
                                        <button
                                            onClick={() => setExportQuality('high')}
                                            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                                exportQuality === 'high' ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="block font-bold">Ultra HD 2X</span>
                                            <span className="text-[10px] text-gray-500">2160px (Crisp)</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CENTER: Main Canvas Workspace */}
                    <div className="lg:col-span-8 flex flex-col items-center">
                        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-xs p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden">
                            {/* Canvas Container with Checkerboard background */}
                            <div 
                                className="relative rounded-2xl overflow-hidden shadow-xl max-w-full touch-none select-none cursor-grab active:cursor-grabbing border-4 border-white"
                                style={{
                                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                                    backgroundSize: '16px 16px',
                                    backgroundColor: '#F8FAFC',
                                }}
                            >
                                <canvas
                                    ref={canvasRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleMouseUp}
                                    className="max-h-[560px] max-w-full object-contain mx-auto"
                                />

                                {/* Upload Prompt Overlay if no user photo loaded yet */}
                                {!userImage && (
                                    isEventNotice ? (
                                        <label className="absolute top-[13%] right-[3.5%] w-[40.5%] h-[60%] flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all hover:bg-blue-50/50 rounded-t-[120px] rounded-b-2xl border-2 border-dashed border-blue-400 bg-blue-50/30 backdrop-blur-2xs group shadow-inner">
                                            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-xs font-black text-blue-950">
                                                {language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Photo'}
                                            </h4>
                                            <p className="text-[10px] text-blue-800 mt-0.5 max-w-[130px] leading-tight">
                                                {language === 'bn' ? 'খিলানের মাঝে বসাতে ছবি নির্বাচন করুন' : 'Click to select photo for cutout'}
                                            </p>
                                            <span className="mt-2.5 px-3 py-1 bg-blue-600 text-white rounded-xl text-[10px] font-black shadow-xs group-hover:bg-blue-700">
                                                Select Photo
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                            />
                                        </label>
                                    ) : (
                                        <label className="absolute inset-0 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all hover:bg-white/60">
                                            <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-3 shadow-xs">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-base font-bold text-gray-900">{t('uploadPhoto')}</h3>
                                            <p className="text-xs text-gray-500 max-w-xs mt-1">
                                                {t('dragDropNotice')}
                                            </p>
                                            <span className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand-600">
                                                Select Photo
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                            />
                                        </label>
                                    )
                                )}
                            </div>

                            {/* Canvas Helper Instruction */}
                            {userImage && (
                                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5 select-none text-center">
                                    <Move className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                                    <span>
                                        {isEventNotice
                                            ? (language === 'bn' 
                                                ? 'ছবিটি মাউস বা আঙুল দিয়ে ড্র্যাগ করে ডানের খিলান/মেহরাবের মাঝে সুন্দরভাবে বসান।' 
                                                : 'Drag your photo to center it inside the arch cutout. Use Zoom and Rotate to fit.')
                                            : (language === 'bn'
                                                ? 'ফ্রেমের মাঝে ছবি বসাতে ড্র্যাগ করুন। পজিশন ও জুম কন্ট্রোল ব্যবহার করুন।'
                                                : 'Drag your photo inside the frame to adjust position. Zoom and rotate from the controls.')
                                        }
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* DOWNLOAD SUCCESS MODAL */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-xs">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-gray-900">{t('successTitle')}</h2>
                            <p className="text-sm text-gray-500 mt-1">{t('successSubtitle')}</p>
                        </div>

                        {/* Preview of downloaded photo */}
                        {downloadedImageUrl && (
                            <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md">
                                <img src={downloadedImageUrl} alt="Generated" className="w-full h-full object-contain" />
                            </div>
                        )}

                        {/* 1-Click Social Caption Box */}
                        <div className="p-3.5 bg-violet-50/70 rounded-2xl border border-violet-100 text-left space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-violet-900 flex items-center gap-1.5">
                                    <MessageCircle className="w-3.5 h-3.5 text-violet-600" />
                                    <span>{language === 'bn' ? 'পোস্ট করার ক্যাপশন' : 'Share with Caption'}</span>
                                </span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(studioCaption);
                                        setCaptionCopied(true);
                                        setTimeout(() => setCaptionCopied(false), 2500);
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                        captionCopied ? 'bg-green-600 text-white' : 'bg-violet-600 text-white hover:bg-violet-700'
                                    }`}
                                >
                                    {captionCopied ? (language === 'bn' ? 'কপিকৃত!' : 'Copied!') : (language === 'bn' ? 'কপি' : 'Copy')}
                                </button>
                            </div>
                            <p className="text-[11px] text-slate-600 font-mono line-clamp-2 select-all">
                                {studioCaption}
                            </p>
                        </div>

                        <div className="space-y-3 pt-2">
                            <button
                                onClick={handleDownload}
                                className="w-full py-3 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md transition-all active:scale-95"
                            >
                                {t('downloadAgain')}
                            </button>

                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-3 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                            >
                                {t('createAnother')}
                            </button>

                            <Link
                                href={`/campaigns/${campaign.slug}`}
                                className="block text-xs font-semibold text-brand-600 hover:underline pt-1"
                            >
                                {t('campaignDetails')}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

