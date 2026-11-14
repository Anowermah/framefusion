import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/Context/LanguageContext';
import { 
    Upload, ZoomIn, ZoomOut, RotateCcw, RotateCw, 
    RefreshCw, Download, Sliders, Move, Sparkles, 
    CheckCircle2, Share2, ArrowLeft, Eye, ShieldCheck
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface CampaignProps {
    id: number;
    title: string;
    title_bn?: string;
    slug: string;
    frame_url: string;
    campaign_type: string;
    category?: {
        name: string;
        name_bn?: string;
    };
    creator?: {
        name: string;
    };
}

interface PhotoEditorProps {
    campaign: CampaignProps;
}

export default function PhotoEditor({ campaign }: PhotoEditorProps) {
    const { language, t } = useLanguage();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Images state
    const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
    const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
    const [frameLoaded, setFrameLoaded] = useState(false);

    // Transform State
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
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
    const [activeTab, setActiveTab] = useState<'transform' | 'filters' | 'export'>('transform');

    // 1. Load Campaign Transparent Frame
    useEffect(() => {
        let isMounted = true;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = campaign.frame_url;
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
            retryImg.src = campaign.frame_url;
        };

        return () => {
            isMounted = false;
        };
    }, [campaign.frame_url]);

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
                setPosition({ x: 0, y: 0 });
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
    }, [userImage, frameImage, zoom, position, rotation, brightness, contrast, saturation, grayscale, sepia, aspectRatio, t]);

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

                {/* Workspace Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEFT SIDEBAR: Adjustments and controls */}
                    <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-6">
                        {/* Tabs */}
                        <div className="flex p-1 bg-gray-100 rounded-xl text-xs font-bold text-gray-600">
                            <button
                                onClick={() => setActiveTab('transform')}
                                className={`flex-1 py-2 rounded-lg transition-all ${
                                    activeTab === 'transform' ? 'bg-white text-brand-600 shadow-xs' : 'hover:text-gray-900'
                                }`}
                            >
                                {t('zoomControls')}
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
                        </div>

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

                        {/* TAB 2: Image Filters */}
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
                                )}
                            </div>

                            {/* Canvas Helper Instruction */}
                            {userImage && (
                                <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5 select-none">
                                    <Move className="w-3.5 h-3.5" />
                                    <span>Drag your photo inside the frame to adjust position. Zoom and rotate from the controls.</span>
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

