import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    ZoomIn, ZoomOut, RotateCw, FlipHorizontal, 
    ChevronUp, ChevronDown, ChevronLeft, ChevronRight, 
    RotateCcw, Download, Sparkles, ExternalLink, RefreshCw, 
    CheckCircle2, Camera, Move, Sliders
} from 'lucide-react';

interface AiFrameMiniStudioProps {
    campaign: any;
    userPhotoFile?: File | null;
    userPhotoUrl?: string | null;
    onPhotoChange?: (file: File) => void;
    language?: 'bn' | 'en';
    compact?: boolean;
    onClose?: () => void;
}

export default function AiFrameMiniStudio({
    campaign,
    userPhotoFile,
    userPhotoUrl,
    onPhotoChange,
    language = 'bn',
    compact = false,
}: AiFrameMiniStudioProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Frame and user photo image elements
    const [frameImg, setFrameImg] = useState<HTMLImageElement | null>(null);
    const [userImg, setUserImg] = useState<HTMLImageElement | null>(null);
    const [frameLoaded, setFrameLoaded] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Positioning and transformation states
    const [zoom, setZoom] = useState<number>(1.0);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [rotation, setRotation] = useState<number>(0);
    const [flipH, setFlipH] = useState<boolean>(false);

    // Custom Name & Title for overlay
    const [nameText, setNameText] = useState<string>('');
    const [titleText, setTitleText] = useState<string>('');

    // Active control tab
    const [activeTab, setActiveTab] = useState<'position' | 'text'>('position');

    // Dragging state
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const frameUrl = campaign?.frame_url || campaign?.thumbnail_url || '';

    // Initialize slot configuration if available
    useEffect(() => {
        let conf = campaign?.slots_config;
        if (typeof conf === 'string') {
            try { conf = JSON.parse(conf); } catch (e) { conf = null; }
        }
        if (conf?.photo_slot) {
            if (typeof conf.photo_slot.zoom === 'number') setZoom(conf.photo_slot.zoom);
            if (typeof conf.photo_slot.x === 'number' && typeof conf.photo_slot.y === 'number') {
                setPosition({ x: conf.photo_slot.x, y: conf.photo_slot.y });
            }
        } else {
            setPosition({ x: 0, y: 0 });
            setZoom(1.0);
        }
    }, [campaign]);

    // Load Frame image
    useEffect(() => {
        if (!frameUrl) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            setFrameImg(img);
            setFrameLoaded(true);
        };
        img.onerror = () => {
            console.error('Failed to load frame image:', frameUrl);
        };
        img.src = frameUrl;
    }, [frameUrl]);

    // Load User photo from File or URL
    useEffect(() => {
        if (userPhotoFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => setUserImg(img);
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(userPhotoFile);
        } else if (userPhotoUrl) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => setUserImg(img);
            img.src = userPhotoUrl;
        }
    }, [userPhotoFile, userPhotoUrl]);

    // Draw canvas logic (supports both live preview canvas and high-res export)
    const renderToCanvas = useCallback((
        targetCanvas: HTMLCanvasElement, 
        width: number, 
        height: number
    ) => {
        const ctx = targetCanvas.getContext('2d');
        if (!ctx) return;

        targetCanvas.width = width;
        targetCanvas.height = height;
        ctx.clearRect(0, 0, width, height);

        const scaleMultiplier = width / 1080;

        // LAYER 1: Draw User Photo underneath
        if (userImg) {
            ctx.save();

            // Center + user drag position
            const centerX = (width / 2) + (position.x * scaleMultiplier);
            const centerY = (height / 2) + (position.y * scaleMultiplier);
            ctx.translate(centerX, centerY);

            // Flip
            if (flipH) {
                ctx.scale(-1, 1);
            }

            // Rotate
            ctx.rotate((rotation * Math.PI) / 180);

            // Scale to fill proportionally with user zoom
            const imgAspect = userImg.width / userImg.height;
            const canvasAspect = width / height;

            let drawW = width;
            let drawH = height;

            if (imgAspect > canvasAspect) {
                drawH = height;
                drawW = height * imgAspect;
            } else {
                drawW = width;
                drawH = width / imgAspect;
            }

            drawW *= zoom;
            drawH *= zoom;

            ctx.drawImage(userImg, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();
        } else {
            // Placeholder when no photo
            ctx.fillStyle = '#F1F5F9';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#94A3B8';
            ctx.font = `bold ${Math.round(18 * scaleMultiplier)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(language === 'bn' ? 'ছবি যুক্ত করুন' : 'Upload Photo', width / 2, height / 2);
        }

        // LAYER 2: Draw Transparent Campaign Frame OVER the photo
        if (frameImg) {
            ctx.drawImage(frameImg, 0, 0, width, height);
        }

        // LAYER 3: Draw Custom Text (Name & Title/Designation)
        if (nameText.trim() || titleText.trim()) {
            ctx.save();
            const fontFam = '"Hind Siliguri", "Noto Sans Bengali", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const baseFontSize = Math.round(width * 0.045);
            const subFontSize = Math.round(width * 0.028);

            const xPos = width * 0.5;
            const yPos = height * 0.88;

            // Draw dark backdrop pill for maximum text readability
            const pText = nameText.trim();
            const sText = titleText.trim();

            ctx.font = `bold ${baseFontSize}px ${fontFam}`;
            const pWidth = pText ? ctx.measureText(pText).width : 0;
            ctx.font = `500 ${subFontSize}px ${fontFam}`;
            const sWidth = sText ? ctx.measureText(sText).width : 0;

            const maxTextW = Math.max(pWidth, sWidth);
            const pillW = Math.min(width * 0.9, maxTextW + baseFontSize * 1.5);
            const pillH = sText ? (baseFontSize + subFontSize + 24 * scaleMultiplier) : (baseFontSize + 16 * scaleMultiplier);

            ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.lineWidth = Math.max(1, 1.5 * scaleMultiplier);

            const rx = xPos - pillW / 2;
            const ry = yPos - pillH / 2;
            const radius = Math.round(pillH / 2);

            ctx.beginPath();
            if (typeof (ctx as any).roundRect === 'function') {
                (ctx as any).roundRect(rx, ry, pillW, pillH, radius);
            } else {
                ctx.rect(rx, ry, pillW, pillH);
            }
            ctx.fill();
            ctx.stroke();

            // Text with shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
            ctx.shadowBlur = Math.round(4 * scaleMultiplier);
            ctx.shadowOffsetY = Math.round(1 * scaleMultiplier);

            if (pText) {
                ctx.font = `bold ${baseFontSize}px ${fontFam}`;
                ctx.fillStyle = '#FFFFFF';
                const pY = sText ? yPos - (subFontSize * 0.5) : yPos;
                ctx.fillText(pText, xPos, pY);
            }

            if (sText) {
                ctx.font = `600 ${subFontSize}px ${fontFam}`;
                ctx.fillStyle = '#FDE68A'; // Elegant gold subtitle
                const sY = yPos + (baseFontSize * 0.65);
                ctx.fillText(sText, xPos, sY);
            }

            ctx.restore();
        }
    }, [userImg, frameImg, position, zoom, rotation, flipH, nameText, titleText, language]);

    // Update Live Preview Canvas on change
    useEffect(() => {
        if (!canvasRef.current) return;
        renderToCanvas(canvasRef.current, 540, 540);
    }, [renderToCanvas]);

    // Mouse / Touch Drag handlers for direct canvas panning
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        setDragStart({ x: e.clientX, y: e.clientY });

        const canvas = canvasRef.current;
        const scale = canvas ? 1080 / canvas.clientWidth : 2.5;
        setPosition(prev => ({
            x: Math.round(prev.x + dx * scale),
            y: Math.round(prev.y + dy * scale),
        }));
    };

    const handleMouseUp = () => setIsDragging(false);

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        const dx = e.touches[0].clientX - dragStart.x;
        const dy = e.touches[0].clientY - dragStart.y;
        setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });

        const canvas = canvasRef.current;
        const scale = canvas ? 1080 / canvas.clientWidth : 2.5;
        setPosition(prev => ({
            x: Math.round(prev.x + dx * scale),
            y: Math.round(prev.y + dy * scale),
        }));
    };

    const handleTouchEnd = () => setIsDragging(false);

    // Directional Nudge buttons (D-Pad)
    const nudge = (dx: number, dy: number) => {
        setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    };

    // Reset position and zoom
    const handleReset = () => {
        setPosition({ x: 0, y: 0 });
        setZoom(1.0);
        setRotation(0);
        setFlipH(false);
    };

    // Download High-Resolution Composite
    const handleDownload = () => {
        setIsExporting(true);
        setTimeout(() => {
            try {
                const exportCanvas = document.createElement('canvas');
                renderToCanvas(exportCanvas, 1080, 1080);

                const dataUrl = exportCanvas.toDataURL('image/png', 1.0);
                const link = document.createElement('a');
                link.download = `${campaign?.slug || 'framefusion'}-framed-photo.png`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (err) {
                console.error('Export failed:', err);
                alert(language === 'bn' ? 'ডাউনলোড করতে সমস্যা হয়েছে।' : 'Failed to download frame.');
            } finally {
                setIsExporting(false);
            }
        }, 100);
    };

    // Open in Full Professional Studio Editor
    const handleOpenFullStudio = () => {
        try {
            if (userImg?.src) {
                sessionStorage.setItem('framefusion_preloaded_photo', userImg.src);
                sessionStorage.setItem('framefusion_preloaded_pos', JSON.stringify({
                    position,
                    zoom,
                    rotation,
                }));
            }
        } catch (e) {
            console.error(e);
        }
        window.location.href = `/campaigns/${campaign.slug}/editor`;
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onPhotoChange) {
            onPhotoChange(file);
        }
    };

    return (
        <div className="w-full bg-white rounded-3xl border border-violet-200/90 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header / Campaign Title Bar */}
            <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 p-3 sm:p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
                    </div>
                    <div className="min-w-0">
                        <span className="text-[10px] sm:text-xs text-violet-200 uppercase tracking-wider font-extrabold block">
                            {language === 'bn' ? 'ফটো পজিশনিং স্টুডিও' : 'Photo Positioning Studio'}
                        </span>
                        <h4 className="text-xs sm:text-sm font-black truncate">
                            {language === 'bn' && campaign?.title_bn ? campaign.title_bn : campaign?.title}
                        </h4>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold transition-all active:scale-95 shrink-0"
                >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'অন্য ছবি' : 'Change'}</span>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* Interactive Live Canvas Area with direct Touch / Drag */}
            <div className="p-3 sm:p-4 bg-slate-50 flex flex-col items-center border-b border-slate-200/80">
                <div className="relative aspect-square w-full max-w-[340px] sm:max-w-[380px] rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-slate-900 select-none touch-none">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="w-full h-full object-contain cursor-grab active:cursor-grabbing block"
                    />

                    {/* Helper Badge: Drag to position */}
                    <div className="absolute top-2.5 left-2.5 pointer-events-none bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-white/20">
                        <Move className="w-3 h-3 text-amber-300 animate-pulse" />
                        <span>{language === 'bn' ? 'ছবিটি টেনে সঠিক স্থানে বসান' : 'Drag to adjust position'}</span>
                    </div>

                    {/* Scale badge bottom right */}
                    <div className="absolute bottom-2.5 right-2.5 pointer-events-none bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-md border border-white/10">
                        {Math.round(zoom * 100)}%
                    </div>
                </div>
            </div>

            {/* Control Panel: Tabs for Position & Text */}
            <div className="p-3 sm:p-4 space-y-3.5 bg-white">
                {/* Tab Switcher */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setActiveTab('position')}
                        className={`py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                            activeTab === 'position'
                                ? 'bg-white text-violet-700 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'পজিশন ও জুম কন্ট্রোল' : 'Position & Zoom'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('text')}
                        className={`py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                            activeTab === 'text'
                                ? 'bg-white text-violet-700 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <span>✍️</span>
                        <span>{language === 'bn' ? 'নাম ও পদবি (ঐচ্ছিক)' : 'Name & Title'}</span>
                    </button>
                </div>

                {activeTab === 'position' ? (
                    <div className="space-y-3">
                        {/* 1. Zoom & Scale Controls */}
                        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                                <span className="flex items-center gap-1">
                                    <ZoomIn className="w-3.5 h-3.5 text-violet-600" />
                                    <span>{language === 'bn' ? 'জুম ও স্কেলিং' : 'Zoom & Scale'}</span>
                                </span>
                                <span className="text-violet-600 font-extrabold">{Math.round(zoom * 100)}%</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setZoom(z => Math.max(0.3, Number((z - 0.1).toFixed(2))))}
                                    className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center shadow-xs shrink-0 active:scale-95"
                                    title="Zoom Out"
                                >
                                    <ZoomOut className="w-3.5 h-3.5" />
                                </button>
                                <input
                                    type="range"
                                    min="0.3"
                                    max="3.0"
                                    step="0.05"
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="flex-1 accent-violet-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                                />
                                <button
                                    type="button"
                                    onClick={() => setZoom(z => Math.min(3.0, Number((z + 0.1).toFixed(2))))}
                                    className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center shadow-xs shrink-0 active:scale-95"
                                    title="Zoom In"
                                >
                                    <ZoomIn className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* 2. D-Pad Directional Pan & Rotation */}
                        <div className="grid grid-cols-2 gap-2.5">
                            {/* Directional Pad */}
                            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center">
                                <span className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                                    {language === 'bn' ? 'সঠিক স্থানে সরান' : 'Move Photo'}
                                </span>
                                <div className="grid grid-cols-3 gap-1 w-28 items-center justify-items-center">
                                    <div></div>
                                    <button
                                        type="button"
                                        onClick={() => nudge(0, -25)}
                                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-violet-50 hover:border-violet-300 text-slate-700 flex items-center justify-center shadow-xs active:scale-90"
                                        title="Move Up"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <div></div>

                                    <button
                                        type="button"
                                        onClick={() => nudge(-25, 0)}
                                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-violet-50 hover:border-violet-300 text-slate-700 flex items-center justify-center shadow-xs active:scale-90"
                                        title="Move Left"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="w-8 h-8 rounded-lg bg-violet-100 hover:bg-violet-200 text-violet-700 flex items-center justify-center shadow-xs active:scale-90"
                                        title="Reset to Center"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => nudge(25, 0)}
                                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-violet-50 hover:border-violet-300 text-slate-700 flex items-center justify-center shadow-xs active:scale-90"
                                        title="Move Right"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>

                                    <div></div>
                                    <button
                                        type="button"
                                        onClick={() => nudge(0, 25)}
                                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-violet-50 hover:border-violet-300 text-slate-700 flex items-center justify-center shadow-xs active:scale-90"
                                        title="Move Down"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    <div></div>
                                </div>
                            </div>

                            {/* Rotation & Flip Controls */}
                            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                                <span className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide text-center">
                                    {language === 'bn' ? 'ঘোরানো ও ফ্লিপ' : 'Rotate & Flip'}
                                </span>
                                <div className="space-y-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setRotation(r => (r + 90) % 360)}
                                        className="w-full py-1.5 px-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                                    >
                                        <RotateCw className="w-3.5 h-3.5 text-violet-600" />
                                        <span>{language === 'bn' ? '৯০° ঘোরান' : 'Rotate 90°'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFlipH(f => !f)}
                                        className={`w-full py-1.5 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 ${
                                            flipH 
                                                ? 'bg-violet-100 border-violet-300 text-violet-800' 
                                                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                                        }`}
                                    >
                                        <FlipHorizontal className="w-3.5 h-3.5 text-violet-600" />
                                        <span>{language === 'bn' ? 'ছবি উল্টান (Flip)' : 'Flip Horizontal'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Text inputs tab */
                    <div className="space-y-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                        <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                {language === 'bn' ? 'আপনার নাম (ফ্রেমে দেখানোর জন্য)' : 'Your Name (Displayed on Frame)'}
                            </label>
                            <input
                                type="text"
                                placeholder={language === 'bn' ? 'যেমন: মোহাম্মদ আরিফুর রহমান' : 'e.g. Md. Arifur Rahman'}
                                value={nameText}
                                onChange={e => setNameText(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                {language === 'bn' ? 'পদবী / শুভেচ্ছা বার্তা' : 'Designation / Message'}
                            </label>
                            <input
                                type="text"
                                placeholder={language === 'bn' ? 'যেমন: সাধারণ সম্পাদক / শুভ জন্মদিন!' : 'e.g. General Secretary / Happy Birthday!'}
                                value={titleText}
                                onChange={e => setTitleText(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white"
                            />
                        </div>
                    </div>
                )}

                {/* Primary Action Buttons: Direct Download + Open in Full Studio */}
                <div className="pt-1 space-y-2">
                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={isExporting}
                        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        <span>
                            {isExporting 
                                ? (language === 'bn' ? 'এইচডি ছবি প্রস্তুত হচ্ছে...' : 'Preparing HD Frame...')
                                : (language === 'bn' ? '📥 ফ্রেম ডাউনলোড করুন (Full HD)' : '📥 Download Framed Photo (HD)')}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={handleOpenFullStudio}
                        className="w-full py-2.5 px-3 bg-slate-100 hover:bg-violet-50 text-slate-700 hover:text-violet-800 font-bold text-xs rounded-xl border border-slate-200/90 hover:border-violet-300 flex items-center justify-center gap-1.5 transition-all active:scale-98"
                    >
                        <ExternalLink className="w-3.5 h-3.5 text-violet-600" />
                        <span>{language === 'bn' ? '🎨 ফুল স্টুডিও এডিটরে ওপেন করুন (Advanced Tools)' : '🎨 Open in Full Studio Editor'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
