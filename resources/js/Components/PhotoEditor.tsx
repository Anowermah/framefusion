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
import { DEFAULT_SLOTS_CONFIG, SlotsConfig, getShapeBorderRadius } from './SlotConfigurator';

interface CampaignProps {
    id: number;
    title: string;
    title_bn?: string;
    slug: string;
    frame_url: string;
    campaign_type: string;
    caption_template?: string;
    slots_config?: any;
    frames?: {
        id: number;
        frame_url: string;
        aspect_ratio?: string;
        slots_config?: any;
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
    const activeFrame = allFrames[activeFrameIndex];
    const activeFrameUrl = activeFrame?.frame_url || campaign.frame_url;

    // Resolve Dynamic Admin Slots Configuration with Fallback
    const effectiveSlots: SlotsConfig = React.useMemo(() => {
        let conf = activeFrame?.slots_config || campaign.slots_config;
        if (typeof conf === 'string') {
            try {
                conf = JSON.parse(conf);
            } catch (e) {
                conf = null;
            }
        }
        return {
            photo_slot: { ...DEFAULT_SLOTS_CONFIG.photo_slot, ...(conf?.photo_slot || {}) },
            date_slot: { ...DEFAULT_SLOTS_CONFIG.date_slot, ...(conf?.date_slot || {}) },
            time_slot: { ...DEFAULT_SLOTS_CONFIG.time_slot, ...(conf?.time_slot || {}) },
            venue_slot: { ...DEFAULT_SLOTS_CONFIG.venue_slot, ...(conf?.venue_slot || {}) },
            topic_slot: { ...DEFAULT_SLOTS_CONFIG.topic_slot, ...(conf?.topic_slot || {}) },
            badge_slot: { ...DEFAULT_SLOTS_CONFIG.badge_slot, ...(conf?.badge_slot || {}) },
            name_slot: { ...DEFAULT_SLOTS_CONFIG.name_slot, ...(conf?.name_slot || {}) },
        };
    }, [activeFrame, campaign.slots_config]);

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
    const isEventNotice = campaign.campaign_type === 'event_notice';
    const [zoom, setZoom] = useState(isEventNotice ? (effectiveSlots.photo_slot.zoom || 1) : 1);
    const [position, setPosition] = useState(isEventNotice ? { x: effectiveSlots.photo_slot.x, y: effectiveSlots.photo_slot.y } : { x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);

    // Sync position when frame changes in event_notice mode
    useEffect(() => {
        if (isEventNotice && effectiveSlots.photo_slot) {
            setPosition({ x: effectiveSlots.photo_slot.x, y: effectiveSlots.photo_slot.y });
            if (effectiveSlots.photo_slot.zoom) {
                setZoom(effectiveSlots.photo_slot.zoom);
            }
        }
    }, [activeFrameIndex, isEventNotice, effectiveSlots]);

    // Dragging & Pinch Zoom state
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [pinchStartDist, setPinchStartDist] = useState<number | null>(null);
    const [pinchStartZoom, setPinchStartZoom] = useState<number>(1);

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
                // Reset defaults on new image load according to Admin Slot settings
                setZoom(isEventNotice ? (effectiveSlots.photo_slot.zoom || 1) : 1);
                setPosition(isEventNotice ? { x: effectiveSlots.photo_slot.x, y: effectiveSlots.photo_slot.y } : { x: 0, y: 0 });
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

        // LAYER 3B: Event & Notice Poster Dynamic Typography (Admin Controlled Slots)
        if (campaign.campaign_type === 'event_notice') {
            ctx.save();
            ctx.filter = 'none';

            // ZONE 1: Date Slot
            if (effectiveSlots.date_slot.enabled !== false && eventDate.trim()) {
                ctx.save();
                ctx.textAlign = effectiveSlots.date_slot.align || 'center';
                ctx.textBaseline = 'middle';
                const dateX = (effectiveSlots.date_slot.x / 100) * width;
                const dateY = (effectiveSlots.date_slot.y / 100) * height;

                if (effectiveSlots.date_slot.shadow ?? true) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
                    ctx.shadowBlur = Math.round(5 * scaleMultiplier);
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = Math.round(1.5 * scaleMultiplier);
                }

                const dateFontSize = Math.round((effectiveSlots.date_slot.font_size || 18) * scaleMultiplier);
                const dateFont = `"${effectiveSlots.date_slot.font_family || 'Hind Siliguri'}", "Noto Serif Bengali", sans-serif`;
                const dateWeight = effectiveSlots.date_slot.font_weight || 'bold';
                ctx.font = `${dateWeight} ${dateFontSize}px ${dateFont}`;
                ctx.fillStyle = effectiveSlots.date_slot.color || '#FFFFFF';
                ctx.fillText(eventDate.trim(), dateX, dateY);
                ctx.restore();
            }

            // ZONE 1B: Time Slot
            if (effectiveSlots.time_slot.enabled !== false && eventTime.trim()) {
                ctx.save();
                ctx.textAlign = effectiveSlots.time_slot.align || 'center';
                ctx.textBaseline = 'middle';
                const timeX = (effectiveSlots.time_slot.x / 100) * width;
                const timeY = (effectiveSlots.time_slot.y / 100) * height;

                if (effectiveSlots.time_slot.shadow ?? true) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
                    ctx.shadowBlur = Math.round(5 * scaleMultiplier);
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = Math.round(1.5 * scaleMultiplier);
                }

                const timeFontSize = Math.round((effectiveSlots.time_slot.font_size || 15) * scaleMultiplier);
                const timeFont = `"${effectiveSlots.time_slot.font_family || 'Hind Siliguri'}", "Noto Serif Bengali", sans-serif`;
                const timeWeight = effectiveSlots.time_slot.font_weight || '600';
                ctx.font = `${timeWeight} ${timeFontSize}px ${timeFont}`;
                ctx.fillStyle = effectiveSlots.time_slot.color || '#FEF3C7';
                ctx.fillText(eventTime.trim(), timeX, timeY);
                ctx.restore();
            }

            // ZONE 2: Venue Slot
            if (effectiveSlots.venue_slot.enabled !== false && eventVenue.trim()) {
                ctx.save();
                ctx.textAlign = effectiveSlots.venue_slot.align || 'center';
                ctx.textBaseline = 'middle';
                const venueX = (effectiveSlots.venue_slot.x / 100) * width;
                const venueY = (effectiveSlots.venue_slot.y / 100) * height;
                const venueMaxW = ((effectiveSlots.venue_slot.max_width || 41) / 100) * width;

                if (effectiveSlots.venue_slot.shadow) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
                    ctx.shadowBlur = Math.round(4 * scaleMultiplier);
                }

                const venueFontSize = Math.round((effectiveSlots.venue_slot.font_size || 19) * scaleMultiplier);
                const venueFont = `"${effectiveSlots.venue_slot.font_family || 'Hind Siliguri'}", "Noto Serif Bengali", sans-serif`;
                const venueWeight = effectiveSlots.venue_slot.font_weight || 'bold';
                ctx.font = `${venueWeight} ${venueFontSize}px ${venueFont}`;
                ctx.fillStyle = effectiveSlots.venue_slot.color || '#0B2559';
                ctx.fillText(eventVenue.trim(), venueX, venueY, venueMaxW);
                ctx.restore();
            }

            // ZONE 2B: Topic / Notice Slot (with auto word wrap at max_width)
            if (effectiveSlots.topic_slot.enabled !== false && eventTopic.trim()) {
                ctx.save();
                ctx.textAlign = effectiveSlots.topic_slot.align || 'center';
                ctx.textBaseline = 'middle';
                const topicX = (effectiveSlots.topic_slot.x / 100) * width;
                const topicY = (effectiveSlots.topic_slot.y / 100) * height;
                const topicMaxW = ((effectiveSlots.topic_slot.max_width || 41) / 100) * width;

                if (effectiveSlots.topic_slot.shadow) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
                    ctx.shadowBlur = Math.round(4 * scaleMultiplier);
                }

                const topicFontSize = Math.round((effectiveSlots.topic_slot.font_size || 17) * scaleMultiplier);
                const topicFont = `"${effectiveSlots.topic_slot.font_family || 'Hind Siliguri'}", "Noto Serif Bengali", sans-serif`;
                const topicWeight = effectiveSlots.topic_slot.font_weight || '600';
                ctx.font = `${topicWeight} ${topicFontSize}px ${topicFont}`;
                ctx.fillStyle = effectiveSlots.topic_slot.color || '#1E3A8A';
                
                const words = eventTopic.trim().split(' ');
                let line = '';
                const lines: string[] = [];
                for (let n = 0; n < words.length; n++) {
                    const testLine = line + words[n] + ' ';
                    const metrics = ctx.measureText(testLine);
                    if (metrics.width > topicMaxW && n > 0) {
                        lines.push(line.trim());
                        line = words[n] + ' ';
                    } else {
                        line = testLine;
                    }
                }
                lines.push(line.trim());

                const lineHeight = topicFontSize * 1.35;
                const displayLines = lines.slice(0, 3);
                const startY = topicY - ((displayLines.length - 1) * lineHeight) / 2;

                displayLines.forEach((l, i) => {
                    ctx.fillText(l, topicX, startY + (i * lineHeight), topicMaxW);
                });
                ctx.restore();
            }

            // ZONE 3: Designation Badge Slot ("খতীব" / "প্রধান আলোচক")
            if (effectiveSlots.badge_slot.enabled !== false && speakerTitle.trim()) {
                ctx.save();
                ctx.textAlign = effectiveSlots.badge_slot.align || 'center';
                ctx.textBaseline = 'middle';
                const badgeX = (effectiveSlots.badge_slot.x / 100) * width;
                const badgeY = (effectiveSlots.badge_slot.y / 100) * height;

                if (effectiveSlots.badge_slot.shadow ?? true) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
                    ctx.shadowBlur = Math.round(3 * scaleMultiplier);
                    ctx.shadowOffsetY = Math.round(1 * scaleMultiplier);
                }

                const badgeFontSize = Math.round((effectiveSlots.badge_slot.font_size || 17) * scaleMultiplier);
                const badgeFont = `"${effectiveSlots.badge_slot.font_family || 'Anek Bangla'}", "Hind Siliguri", sans-serif`;
                const badgeWeight = effectiveSlots.badge_slot.font_weight || '800';
                ctx.font = `${badgeWeight} ${badgeFontSize}px ${badgeFont}`;
                ctx.fillStyle = effectiveSlots.badge_slot.color || '#FFFFFF';
                ctx.fillText(speakerTitle.trim(), badgeX, badgeY);
                ctx.restore();
            }

            // ZONE 4: Speaker / Supporter Name Slot
            if (effectiveSlots.name_slot.enabled !== false && speakerName.trim()) {
                ctx.save();
                ctx.textAlign = effectiveSlots.name_slot.align || 'center';
                ctx.textBaseline = 'middle';
                const nameX = (effectiveSlots.name_slot.x / 100) * width;
                const nameY = (effectiveSlots.name_slot.y / 100) * height;
                const nameMaxW = ((effectiveSlots.name_slot.max_width || 42) / 100) * width;

                if (effectiveSlots.name_slot.shadow ?? true) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
                    ctx.shadowBlur = Math.round(6 * scaleMultiplier);
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = Math.round(2 * scaleMultiplier);
                }

                const nameFontSize = Math.round((effectiveSlots.name_slot.font_size || 33) * scaleMultiplier);
                const nameFont = `"${effectiveSlots.name_slot.font_family || 'Hind Siliguri'}", "Noto Serif Bengali", sans-serif`;
                const nameWeight = effectiveSlots.name_slot.font_weight || 'bold';
                ctx.font = `${nameWeight} ${nameFontSize}px ${nameFont}`;
                ctx.fillStyle = effectiveSlots.name_slot.color || '#FFFFFF';
                ctx.fillText(speakerName.trim(), nameX, nameY, nameMaxW);
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
        effectiveSlots
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
        if (!userImage) return;
        if (e.touches.length === 2) {
            setIsDragging(false);
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            setPinchStartDist(Math.hypot(dx, dy));
            setPinchStartZoom(zoom);
            return;
        }
        if (e.touches.length === 1) {
            setIsDragging(true);
            const touch = e.touches[0];
            setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (e.touches.length === 2 && pinchStartDist) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const currentDist = Math.hypot(dx, dy);
            const scaleFactor = currentDist / pinchStartDist;
            const newZoom = Math.min(3, Math.max(0.2, pinchStartZoom * scaleFactor));
            setZoom(newZoom);
            return;
        }
        if (!isDragging || e.touches.length === 0) return;
        const touch = e.touches[0];
        setPosition({
            x: touch.clientX - dragStart.x,
            y: touch.clientY - dragStart.y,
        });
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (e.touches.length < 2) {
            setPinchStartDist(null);
        }
        if (e.touches.length === 0) {
            setIsDragging(false);
        }
    };

    // Reset position & zoom
    const handleResetTransform = () => {
        setZoom(isEventNotice ? (effectiveSlots.photo_slot.zoom || 1) : 1);
        setPosition(isEventNotice ? { x: effectiveSlots.photo_slot.x, y: effectiveSlots.photo_slot.y } : { x: 0, y: 0 });
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

    const handleAutoCenter = () => {
        if (isEventNotice && effectiveSlots.photo_slot) {
            setPosition({ x: effectiveSlots.photo_slot.x, y: effectiveSlots.photo_slot.y });
            setZoom(effectiveSlots.photo_slot.zoom || 1);
        } else {
            setPosition({ x: 0, y: 0 });
            setZoom(1);
        }
        setRotation(0);
    };

    const campaignTitle = language === 'bn' && campaign.title_bn ? campaign.title_bn : campaign.title;

    const handleNativeShare = async () => {
        const pageUrl = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: campaignTitle,
                    text: studioCaption,
                    url: pageUrl,
                });
                return;
            } catch (err) {
                // share dismissed
            }
        }
        navigator.clipboard.writeText(studioCaption);
        setCaptionCopied(true);
        setTimeout(() => setCaptionCopied(false), 2500);
    };

    const handleWhatsAppShare = () => {
        const pageUrl = window.location.href;
        const text = encodeURIComponent(`${studioCaption}\n\n${pageUrl}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#F8F9FC] py-4 sm:py-8 px-3 sm:px-6 lg:px-8 pb-32 lg:pb-12">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                {/* Top Bar Header */}
                <div className="flex items-center justify-between gap-3 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <Link
                            href={`/campaigns/${campaign.slug}`}
                            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                            title="Back to Campaign"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="min-w-0">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md inline-block">
                                {t('photoEditor')}
                            </span>
                            <h1 className="text-base sm:text-xl font-extrabold text-slate-900 mt-0.5 truncate max-w-[180px] sm:max-w-md">
                                {campaignTitle}
                            </h1>
                        </div>
                    </div>

                    {/* Desktop Action Buttons in Header */}
                    <div className="hidden sm:flex items-center gap-2.5">
                        <label className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-all border border-slate-200/70">
                            <Upload className="w-4 h-4 text-purple-600" />
                            <span>{userImage ? (language === 'bn' ? 'ছবি পরিবর্তন' : t('changePhoto')) : (language === 'bn' ? 'ছবি আপলোড করুন' : t('uploadPhoto'))}</span>
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
                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-emerald-600/25'
                            }`}
                        >
                            <Download className="w-4 h-4" />
                            <span>{isDownloading ? (language === 'bn' ? 'তৈরি হচ্ছে...' : t('processing')) : (language === 'bn' ? 'ডাউনলোড করুন' : t('downloadImage'))}</span>
                        </button>
                    </div>
                </div>

                {/* Multi-Frame Variations Switcher Ribbon */}
                {allFrames.length > 1 && (
                    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4 overflow-x-auto w-full max-w-full scrollbar-none [-webkit-overflow-scrolling:touch]">
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
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
                                            ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold shadow-xs scale-102'
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
                    {/* LEFT SIDEBAR: Adjustments and controls (On mobile: order-2, below canvas) */}
                    <div className="order-2 lg:order-1 lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-5 w-full">
                        {/* Tabs */}
                        <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 gap-1 overflow-x-auto scrollbar-none [-webkit-overflow-scrolling:touch]">
                            {isEventNotice ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('event')}
                                        className={`flex-1 min-w-[70px] py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                            activeTab === 'event' ? 'bg-white text-purple-700 shadow-xs font-bold' : 'hover:text-slate-900'
                                        }`}
                                    >
                                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                                        <span className="whitespace-nowrap">{language === 'bn' ? 'পোস্টার তথ্য' : 'Poster Info'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('transform')}
                                        className={`flex-1 min-w-[70px] py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                            activeTab === 'transform' ? 'bg-white text-purple-700 shadow-xs font-bold' : 'hover:text-slate-900'
                                        }`}
                                    >
                                        <Move className="w-3.5 h-3.5 shrink-0" />
                                        <span className="whitespace-nowrap">{language === 'bn' ? 'পজিশন' : 'Position'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('filters')}
                                        className={`flex-1 min-w-[70px] py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                            activeTab === 'filters' ? 'bg-white text-purple-700 shadow-xs font-bold' : 'hover:text-slate-900'
                                        }`}
                                    >
                                        <Sliders className="w-3.5 h-3.5 shrink-0" />
                                        <span className="whitespace-nowrap">{language === 'bn' ? 'ফিল্টার' : 'Filters'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('export')}
                                        className={`flex-1 min-w-[70px] py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                            activeTab === 'export' ? 'bg-white text-purple-700 shadow-xs font-bold' : 'hover:text-slate-900'
                                        }`}
                                    >
                                        <Download className="w-3.5 h-3.5 shrink-0" />
                                        <span className="whitespace-nowrap">{language === 'bn' ? 'ডাউনলোড' : 'Export'}</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('transform')}
                                        className={`flex-1 min-w-[65px] py-2 rounded-lg transition-all ${
                                            activeTab === 'transform' ? 'bg-white text-purple-700 shadow-xs font-bold' : 'hover:text-slate-900'
                                        }`}
                                    >
                                        {language === 'bn' ? 'পজিশন' : 'Position'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('text')}
                                        className={`flex-1 min-w-[65px] py-2 rounded-lg transition-all relative ${
                                            activeTab === 'text' ? 'bg-white text-purple-700 shadow-xs font-bold' : 'hover:text-slate-900'
                                        }`}
                                    >
                                        <span>{language === 'bn' ? 'নাম ও লেখা' : 'Text'}</span>
                                        {enableText && primaryText && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 absolute top-1.5 right-1.5" />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('filters')}
                                        className={`flex-1 min-w-[65px] py-2 rounded-lg transition-all ${
                                            activeTab === 'filters' ? 'bg-white text-purple-700 shadow-xs font-bold' : 'hover:text-slate-900'
                                        }`}
                                    >
                                        {language === 'bn' ? 'ফিল্টার' : 'Filters'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('export')}
                                        className={`flex-1 min-w-[65px] py-2 rounded-lg transition-all ${
                                            activeTab === 'export' ? 'bg-white text-purple-700 shadow-xs font-bold' : 'hover:text-slate-900'
                                        }`}
                                    >
                                        {language === 'bn' ? 'ডাউনলোড' : 'Export'}
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
                                    {effectiveSlots.date_slot.enabled !== false && (
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
                                    )}

                                    {/* 2. Time */}
                                    {effectiveSlots.time_slot.enabled !== false && (
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
                                    )}

                                    {/* 3. Venue */}
                                    {effectiveSlots.venue_slot.enabled !== false && (
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
                                    )}

                                    {/* 4. Topic / Notice */}
                                    {effectiveSlots.topic_slot.enabled !== false && (
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
                                    )}

                                    {/* 5. Designation / Badge */}
                                    {effectiveSlots.badge_slot.enabled !== false && (
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                                    <Award className="w-3.5 h-3.5 text-amber-500" />
                                                    <span>{language === 'bn' ? 'পদবি (Designation Badge)' : 'Designation Badge'}</span>
                                                </label>
                                                <span className="text-[10px] text-gray-400">ব্যাজ</span>
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
                                    )}

                                    {/* 6. Speaker / Your Name */}
                                    {effectiveSlots.name_slot.enabled !== false && (
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
                                    )}

                                    {/* Pre-calibrated Admin Typography Badge */}
                                    <div className="pt-2 border-t border-gray-100">
                                        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-2.5 text-blue-900">
                                            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                                            <span className="text-[11px] leading-tight font-medium">
                                                {language === 'bn' 
                                                    ? 'সব লেখার ফন্ট, সাইজ ও কালার ফ্রেমের সাথে শতভাগ নিখুঁতভাবে অ্যাডমিন নির্ধারণ করে দিয়েছেন।' 
                                                    : 'Typography, font size, colors, and layouts are calibrated by the admin.'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 1: Transform & Placement */}
                        {activeTab === 'transform' && (
                            <div className="space-y-6 animate-in fade-in duration-200">
                                {/* Zoom Control */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                                        <span className="flex items-center gap-1.5 font-bold">
                                            <ZoomIn className="w-3.5 h-3.5 text-purple-600" />
                                            <span>{language === 'bn' ? 'জুম ও সাইজ' : t('zoomControls')}</span>
                                        </span>
                                        <span className="text-slate-500 font-mono font-bold text-[11px] bg-slate-100 px-2 py-0.5 rounded">{Math.round(zoom * 100)}%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setZoom(Math.max(0.2, zoom - 0.1))}
                                            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-all shadow-2xs"
                                            title={t('zoomOut')}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="range"
                                            min="0.2"
                                            max="3"
                                            step="0.05"
                                            value={zoom}
                                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                                            className="flex-1 accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                                            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-all shadow-2xs"
                                            title={t('zoomIn')}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Rotation Control */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                                        <span className="flex items-center gap-1.5 font-bold">
                                            <RotateCw className="w-3.5 h-3.5 text-purple-600" />
                                            <span>{language === 'bn' ? 'ঘোরান (রোটেশন)' : t('rotateControls')}</span>
                                        </span>
                                        <span className="text-slate-500 font-mono font-bold text-[11px] bg-slate-100 px-2 py-0.5 rounded">{rotation}°</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setRotation((prev) => (prev - 90) % 360)}
                                            className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                                            <span>-90°</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRotation((prev) => (prev + 90) % 360)}
                                            className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                                        >
                                            <RotateCw className="w-3.5 h-3.5 text-purple-600" />
                                            <span>+90°</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Pan / Direct Dragging Hint + Micro-Pad */}
                                <div className="space-y-2.5 pt-1">
                                    <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-purple-900 flex items-start gap-2">
                                        <Move className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                                        <p className="text-[11px] leading-relaxed">
                                            {language === 'bn' 
                                                ? 'সহজ উপায়: ফ্রেমের ওপর সরাসরি আঙুল বা মাউস দিয়ে ড্র্যাগ করে ছবিটি ইচ্ছেমতো বসান।' 
                                                : 'Drag directly on the canvas to place and position your photo smoothly.'}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <button
                                            type="button"
                                            onClick={handleAutoCenter}
                                            className="flex-1 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200/80 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                                        >
                                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                            <span>{language === 'bn' ? '🎯 অটো ফিট ও সেন্টার' : 'Auto Fit & Center'}</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleResetTransform}
                                            className="py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all shrink-0"
                                            title="Reset"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
                                        </button>
                                    </div>
                                </div>
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

                    {/* CENTER: Main Canvas Workspace (On mobile: order-1, so it displays FIRST at the top!) */}
                    <div className="order-1 lg:order-2 lg:col-span-8 flex flex-col items-center w-full">
                        <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden">
                            {/* Canvas Container with Checkerboard background */}
                            <div 
                                className="relative rounded-2xl overflow-hidden shadow-xl max-w-full touch-none select-none cursor-grab active:cursor-grabbing border-2 sm:border-4 border-white"
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
                                    onTouchEnd={handleTouchEnd}
                                    className="max-h-[380px] sm:max-h-[560px] max-w-full object-contain mx-auto touch-none select-none cursor-move"
                                />

                                {/* Upload Prompt Overlay if no user photo loaded yet */}
                                {!userImage && (
                                    isEventNotice ? (
                                        <label 
                                            style={{
                                                left: `calc(50% + ${(effectiveSlots.photo_slot.x / 1080) * 100}% - ${(effectiveSlots.photo_slot.width || 40.5) / 2}%)`,
                                                top: `calc(50% + ${(effectiveSlots.photo_slot.y / 1080) * 100}% - ${(effectiveSlots.photo_slot.height || 60) / 2}%)`,
                                                width: `${effectiveSlots.photo_slot.width || 40.5}%`,
                                                height: `${effectiveSlots.photo_slot.height || 60}%`,
                                                borderRadius: getShapeBorderRadius(effectiveSlots.photo_slot.shape, effectiveSlots.photo_slot.border_radius),
                                            }}
                                            className="absolute flex flex-col items-center justify-center p-2.5 sm:p-3 text-center cursor-pointer transition-all hover:bg-blue-50/50 border-2 border-dashed border-blue-400 bg-blue-50/40 backdrop-blur-2xs group shadow-inner overflow-hidden"
                                        >
                                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-1.5 shadow-md group-hover:scale-110 transition-transform">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-xs font-black text-blue-950">
                                                {language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Photo'}
                                            </h4>
                                            <p className="text-[10px] text-blue-800 mt-0.5 max-w-[130px] leading-tight hidden sm:block">
                                                {language === 'bn' ? (effectiveSlots.photo_slot.hint || 'ছবি নির্বাচন করতে ক্লিক করুন') : 'Click to select photo for cutout'}
                                            </p>
                                            <span className="mt-1.5 sm:mt-2.5 px-3 py-1 bg-blue-600 text-white rounded-xl text-[10px] font-black shadow-xs group-hover:bg-blue-700">
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
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5 shadow-xs">
                                                <Upload className="w-7 h-7 sm:w-8 sm:h-8" />
                                            </div>
                                            <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                                {language === 'bn' ? 'আপনার ছবি আপলোড করুন' : t('uploadPhoto')}
                                            </h3>
                                            <p className="text-[11px] sm:text-xs text-slate-500 max-w-xs mt-1">
                                                {language === 'bn' ? 'এখানে ট্যাপ করে গ্যালারি থেকে ছবি যোগ করুন' : t('dragDropNotice')}
                                            </p>
                                            <span className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-purple-700">
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

                            {/* Canvas Helper Instruction & Quick Action Bar */}
                            <div className="w-full mt-3 space-y-2">
                                {userImage ? (
                                    <>
                                        <p className="text-[11px] font-medium text-slate-500 flex items-center justify-center gap-1.5 select-none text-center">
                                            <Move className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                            <span>
                                                {language === 'bn'
                                                    ? '👆 ফ্রেমের ওপর আঙুল বা মাউস দিয়ে টেনে ছবি ঠিক জায়গায় বসান'
                                                    : 'Drag your photo with touch or mouse to position it nicely'}
                                            </span>
                                        </p>

                                        {/* Quick Action Toolbar directly under Canvas */}
                                        <div className="p-2 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                                            {/* Auto Fit Button */}
                                            <button
                                                type="button"
                                                onClick={handleAutoCenter}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-700 bg-white hover:bg-purple-50 border border-purple-200/80 rounded-xl transition-all active:scale-95 shadow-2xs"
                                                title="Auto Center & Fit"
                                            >
                                                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                                <span>{language === 'bn' ? '🎯 অটো ফিট' : 'Auto Fit'}</span>
                                            </button>

                                            {/* Quick Zoom */}
                                            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200/80 shadow-2xs">
                                                <button
                                                    type="button"
                                                    onClick={() => setZoom(Math.max(0.2, zoom - 0.1))}
                                                    className="w-6 h-6 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
                                                    title={t('zoomOut')}
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="text-[11px] font-mono font-bold text-slate-700 px-1">
                                                    {Math.round(zoom * 100)}%
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                                                    className="w-6 h-6 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
                                                    title={t('zoomIn')}
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {/* Quick Rotate */}
                                            <button
                                                type="button"
                                                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                                                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-all active:scale-95 shadow-2xs"
                                                title={t('rotateControls')}
                                            >
                                                <RotateCw className="w-3.5 h-3.5 text-purple-600" />
                                                <span>৯০°</span>
                                            </button>

                                            {/* Change Photo */}
                                            <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-xl cursor-pointer transition-all active:scale-95 shadow-2xs">
                                                <Upload className="w-3.5 h-3.5 text-purple-600" />
                                                <span>{language === 'bn' ? 'ছবি পরিবর্তন' : 'Change Photo'}</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                                />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center pt-1">
                                        <label className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-95 shadow-md shadow-purple-600/20">
                                            <Upload className="w-4 h-4" />
                                            <span>{language === 'bn' ? '📷 আপনার ছবি নির্বাচন করুন' : '📷 Select Your Photo'}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================================================== */}
            {/* STICKY MOBILE BOTTOM ACTION DOCK (Always visible at the bottom) */}
            {/* ============================================================== */}
            <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                <div className="max-w-md mx-auto flex items-center gap-2">
                    {!userImage ? (
                        <label className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-purple-600/30 transition-all cursor-pointer">
                            <Upload className="w-5 h-5 stroke-[2.5]" />
                            <span>{language === 'bn' ? '📷 আপনার ছবি নির্বাচন করুন' : '📷 Select Your Photo'}</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                            />
                        </label>
                    ) : (
                        <>
                            <label className="flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs shrink-0 transition-all cursor-pointer border border-slate-200">
                                <Upload className="w-4 h-4 text-purple-600" />
                                <span>{language === 'bn' ? 'পরিবর্তন' : 'Change'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                />
                            </label>

                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 active:scale-95 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
                            >
                                <Download className="w-5 h-5 stroke-[2.5]" />
                                <span>
                                    {isDownloading 
                                        ? (language === 'bn' ? 'তৈরি হচ্ছে...' : 'Processing...') 
                                        : (language === 'bn' ? '📥 ফ্রেমসহ ডাউনলোড করুন' : '📥 Download Final Photo')}
                                </span>
                            </button>
                        </>
                    )}
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

                        {/* Instant Social Share Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                                onClick={handleNativeShare}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                            >
                                <Share2 className="w-4 h-4" />
                                <span>{language === 'bn' ? '📲 শেয়ার করুন' : '📲 Share'}</span>
                            </button>
                            <button
                                onClick={handleWhatsAppShare}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>WhatsApp</span>
                            </button>
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

