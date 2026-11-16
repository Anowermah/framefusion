import React, { useState, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CampaignCard, { CampaignData } from '@/Components/CampaignCard';
import { useLanguage } from '@/Context/LanguageContext';
import { QRCodeCanvas } from 'qrcode.react';
import {
    Users, Eye, Calendar, Share2, Copy,
    Bookmark, Flag, ArrowRight, Camera,
    Check, Sparkles, MessageSquare, ThumbsUp,
    ShieldAlert, X, Heart, Edit, QrCode, Download,
    ExternalLink, BadgeCheck, CheckCircle2, MessageCircle
} from 'lucide-react';

interface CampaignShowProps {
    campaign: CampaignData & {
        description?: string;
        description_bn?: string;
        start_date?: string;
        tags?: string;
        caption_template?: string;
        action_link_url?: string;
        action_link_text?: string;
        og_image_url?: string;
        direct_frame_url?: string;
        canonical_url?: string;
        primary_frame?: {
            aspect_ratio?: string;
        };
        frames?: {
            id: number;
            frame_url: string;
            aspect_ratio?: string;
        }[];
        gallery_posts?: {
            id: number;
            image_url: string;
            caption?: string;
            likes_count: number;
            comments_count: number;
            user: { name: string; avatar_url?: string };
            comments?: { id: number; content: string; user: { name: string } }[];
        }[];
    };
    relatedCampaigns: CampaignData[];
}

export default function Show({ campaign, relatedCampaigns = [] }: CampaignShowProps) {
    const { language, t } = useLanguage();
    const { auth } = usePage().props as any;

    const [saved, setSaved] = useState(campaign.is_saved ?? false);
    const [copied, setCopied] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState('Inappropriate Content');
    const [reportDescription, setReportDescription] = useState('');
    const [reportSuccess, setReportSuccess] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Twibbonize Suite States: Multi-frame, QR modal, Smart captions
    const allFrames = campaign.frames && campaign.frames.length > 0
        ? campaign.frames
        : [{ id: 0, frame_url: campaign.frame_url }];
    const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);
    const activeFrame = allFrames[selectedFrameIndex] || allFrames[0];

    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [captionCopied, setCaptionCopied] = useState(false);
    const qrCanvasRef = useRef<HTMLDivElement>(null);

    const title = language === 'bn' && campaign.title_bn ? campaign.title_bn : campaign.title;
    const description = language === 'bn' && campaign.description_bn ? campaign.description_bn : campaign.description;
    const categoryName = language === 'bn' && campaign.category?.name_bn ? campaign.category.name_bn : campaign.category?.name;

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    const smartCaption = campaign.caption_template ||
        (language === 'bn'
            ? `আমি "${title}" ক্যাম্পেইনকে সমর্থন জানিয়ে আমার ছবি তৈরি করেছি! আপনিও এখনই আপনার ছবি ফ্রেম করুন: ${currentUrl} #FrameFusion #Twibbon`
            : `I just customized my photo in support of "${title}"! Create yours now at: ${currentUrl} #FrameFusion #Campaign #Twibbon`);

    const handleCopyCaption = () => {
        navigator.clipboard.writeText(smartCaption);
        setCaptionCopied(true);
        setTimeout(() => setCaptionCopied(false), 2500);
    };

    const handleDownloadQr = () => {
        const canvas = qrCanvasRef.current?.querySelector('canvas');
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `framefusion-${campaign.slug}-qr.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleNativeShare = () => {
        if (navigator.share) {
            navigator.share({
                title: campaign.title,
                text: campaign.description,
                url: currentUrl,
            }).catch(() => { });
        } else {
            handleCopyLink();
        }
    };

    const handleToggleSave = () => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        fetch(`/campaigns/${campaign.id}/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
            },
        })
            .then(res => res.json())
            .then(data => setSaved(data.saved));
    };

    const handleReportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetch(`/campaigns/${campaign.id}/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
            },
            body: JSON.stringify({
                reason: reportReason,
                description: reportDescription,
            }),
        })
            .then(res => res.json())
            .then(() => {
                setReportSuccess(true);
                setTimeout(() => {
                    setReportSuccess(false);
                    setReportModalOpen(false);
                }, 2000);
            });
    };

    const shareImageUrl = campaign.og_image_url || (typeof window !== 'undefined' ? `${window.location.origin}/campaigns/${campaign.slug}/og-image` : '');

    return (
        <MainLayout>
            <Head>
                <title>{`${title} | ${categoryName ? categoryName + ' | ' : ''}FrameFusion`}</title>
                <meta name="description" content={description || 'Create and customize this campaign photo frame on FrameFusion.'} />
                <meta name="keywords" content={`${campaign.tags || ''}, ${title}, photo frame, twibbon, campaign`} />
                <link rel="canonical" href={campaign.canonical_url || currentUrl} />

                {/* Open Graph / Facebook / WhatsApp */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={`${title} | FrameFusion`} />
                <meta property="og:description" content={description || 'Create and customize this campaign photo frame on FrameFusion.'} />
                <meta property="og:url" content={campaign.canonical_url || currentUrl} />
                <meta property="og:image" content={shareImageUrl} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />

                {/* Twitter / X */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${title} | FrameFusion`} />
                <meta name="twitter:description" content={description || 'Create and customize this campaign photo frame on FrameFusion.'} />
                <meta name="twitter:image" content={shareImageUrl} />
            </Head>

            <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-12 space-y-8 sm:space-y-12">
                {/* Campaign Hero Showcase */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-4 sm:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        {/* Frame Visual Display */}
                        <div className="lg:col-span-5 flex flex-col items-center">
                            <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-linear-to-br from-gray-50 to-gray-100/70 p-4 border border-gray-100 shadow-xl overflow-hidden group">
                                <div
                                    className="w-full h-full rounded-2xl overflow-hidden relative flex items-center justify-center"
                                    style={{
                                        backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                                        backgroundSize: '16px 16px',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                >
                                {!imageError ? (
                                    <img
                                        src={activeFrame.frame_url}
                                        alt={title}
                                        className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                        <Sparkles className="w-12 h-12 text-brand-400 mb-2 animate-pulse" />
                                        <span className="text-sm font-semibold text-gray-700">{title}</span>
                                        <span className="text-xs text-gray-400 mt-1">Official Campaign Frame</span>
                                    </div>
                                )}
                                </div>
                            </div>

                            {/* Multi-Frame Variations Carousel */}
                            {allFrames.length > 1 && (
                                <div className="mt-4 w-full max-w-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                                            {language === 'bn' ? 'ফ্রেম ভেরিয়েশন' : 'Frame Variations'} ({allFrames.length})
                                        </span>
                                        <span className="text-[10px] text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-full">
                                            {selectedFrameIndex + 1} / {allFrames.length}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-none w-full max-w-full">
                                        {allFrames.map((f, idx) => (
                                            <button
                                                key={f.id || idx}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedFrameIndex(idx);
                                                    setImageError(false);
                                                }}
                                                className={`relative w-16 h-16 rounded-2xl border-2 p-1.5 bg-white shrink-0 transition-all ${
                                                    selectedFrameIndex === idx
                                                        ? 'border-brand-600 shadow-md ring-2 ring-brand-100 scale-105'
                                                        : 'border-slate-200 opacity-60 hover:opacity-100'
                                                }`}
                                            >
                                                <img src={f.frame_url} alt="" className="w-full h-full object-contain" />
                                                <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-bold px-1 rounded">
                                                    #{idx + 1}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Campaign Meta & Primary CTA */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    {categoryName && (
                                        <Link
                                            href={`/explore?category=${campaign.category?.slug}`}
                                            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                                        >
                                            {categoryName}
                                        </Link>
                                    )}
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                                        {t('active')}
                                    </span>
                                    {campaign.campaign_type === 'custom_text' && (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-amber-500" />
                                            <span>{language === 'bn' ? 'কাস্টম নাম ও টেক্সট' : 'Custom Text Enabled'}</span>
                                        </span>
                                    )}
                                    {campaign.campaign_type === 'event_notice' && (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-blue-600" />
                                            <span>{language === 'bn' ? 'পোস্টার ও নোটিশ' : 'Poster & Notice'}</span>
                                        </span>
                                    )}
                                    {campaign.campaign_type === 'greeting_card' && (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-rose-500" />
                                            <span>{language === 'bn' ? 'শুভেচ্ছা কার্ড' : 'Greeting Card'}</span>
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight">
                                    {title}
                                </h1>

                                <p className="text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
                                    <span>{t('creator')}:</span>
                                    <span className="text-gray-900 font-bold">{campaign.creator?.name || 'FrameFusion Creator'}</span>
                                    {campaign.creator?.is_verified && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200">
                                            <BadgeCheck className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />
                                            <span>Verified Creator</span>
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Description */}
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                                {description}
                            </p>

                            {/* Stats Chips */}
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gray-50 border border-gray-100/80">
                                    <div className="w-7 h-7 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                                        <Users className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="leading-tight">
                                        <span className="text-[10px] text-gray-400 block font-semibold uppercase">{t('supporters')}</span>
                                        <span className="text-xs font-black text-gray-900">{campaign.supporters_count.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gray-50 border border-gray-100/80">
                                    <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                        <Eye className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="leading-tight">
                                        <span className="text-[10px] text-gray-400 block font-semibold uppercase">{t('views')}</span>
                                        <span className="text-xs font-black text-gray-900">{campaign.views_count.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* MAIN CTA BUTTON: CHOOSE YOUR PHOTO */}
                            <div className="pt-2 flex flex-col sm:flex-row gap-3">
                                <Link
                                    href={`/campaigns/${campaign.slug}/editor${selectedFrameIndex > 0 ? `?frame=${selectedFrameIndex}` : ''}`}
                                    className="flex-1 py-4 px-6 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-brand-500/25 active:scale-95 transition-all text-center flex items-center justify-center gap-2.5"
                                >
                                    <Camera className="w-5 h-5" />
                                    <span>{t('chooseYourPhoto')}</span>
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>

                                {campaign.action_link_url && (
                                    <a
                                        href={campaign.action_link_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shrink-0"
                                    >
                                        <span>{campaign.action_link_text || (language === 'bn' ? 'অফিসিয়াল লিংক' : 'Official Action')}</span>
                                        <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                                    </a>
                                )}

                                <button
                                    onClick={handleToggleSave}
                                    className={`px-5 py-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${saved
                                        ? 'border-brand-500 bg-brand-50 text-brand-600 shadow-xs'
                                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Bookmark className={`w-4 h-4 ${saved ? 'fill-brand-500' : ''}`} />
                                    <span>{saved ? t('saved') : t('saveCampaign')}</span>
                                </button>

                                {auth?.user && (auth.user.id === campaign.creator?.id || auth.user.role === 'admin') && (
                                    <Link
                                        href={`/campaigns/${campaign.id}/edit`}
                                        className="px-5 py-3.5 rounded-2xl border border-brand-200 bg-brand-50/70 hover:bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                                    >
                                        <Edit className="w-4 h-4 text-brand-600" />
                                        <span>Edit</span>
                                    </Link>
                                )}
                            </div>

                            {/* Social Share Bar */}
                            <div className="pt-2 flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-gray-400 mr-1 flex items-center gap-1">
                                    <Share2 className="w-3.5 h-3.5" />
                                    {t('shareCampaign')}:
                                </span>

                                <button
                                    onClick={() => setQrModalOpen(true)}
                                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                                    title="Generate Event QR Code"
                                >
                                    <QrCode className="w-3.5 h-3.5 text-slate-700" />
                                    <span>QR Code</span>
                                </button>

                                <button
                                    onClick={handleCopyLink}
                                    className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/70 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                                    <span>{copied ? t('linkCopied') : t('copyLink')}</span>
                                </button>

                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3.5 py-1.5 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/20 rounded-full text-xs font-semibold active:scale-95 transition-all"
                                >
                                    Facebook
                                </a>

                                <a
                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(campaign.title + ' ' + currentUrl)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3.5 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/20 rounded-full text-xs font-semibold active:scale-95 transition-all"
                                >
                                    WhatsApp
                                </a>

                                <button
                                    onClick={handleNativeShare}
                                    className="px-3.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 border border-brand-200/50 rounded-full text-xs font-semibold active:scale-95 transition-all"
                                >
                                    More
                                </button>

                                <button
                                    onClick={() => setReportModalOpen(true)}
                                    className="ml-auto text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                                >
                                    <Flag className="w-3 h-3" />
                                    <span>{t('reportCampaign')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smart Caption & Auto-Hashtags Engine */}
                <div className="bg-gradient-to-r from-violet-50/70 via-indigo-50/30 to-white rounded-3xl border border-violet-100/90 shadow-card p-5 sm:p-7 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20 shrink-0">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-extrabold text-slate-900">
                                    {language === 'bn' ? 'স্মার্ট সোশ্যাল ক্যাপশন ও হ্যাশট্যাগ' : 'Smart Social Caption & Auto-Hashtags'}
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    {language === 'bn' ? 'কপি করে আপনার ফ্রেম করা ছবির সাথে ফেসবুক, হোয়াটসঅ্যাপে পোস্ট করুন' : '1-click copy & share along with your customized photo on social networks'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <button
                                onClick={handleCopyCaption}
                                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                                    captionCopied
                                        ? 'bg-green-600 text-white shadow-xs'
                                        : 'bg-violet-600 hover:bg-violet-700 text-white shadow-xs'
                                }`}
                            >
                                {captionCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{captionCopied ? (language === 'bn' ? 'কপিকৃত!' : 'Copied!') : (language === 'bn' ? 'ক্যাপশন কপি' : 'Copy Caption')}</span>
                            </button>

                            <a
                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(smartCaption)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-xs font-bold flex items-center gap-1.5 transition-all"
                                title="Share Caption to WhatsApp"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    <div className="p-4 bg-white/90 rounded-2xl border border-violet-100 text-xs text-slate-700 font-mono leading-relaxed select-all shadow-2xs">
                        {smartCaption}
                    </div>
                </div>

                {/* Supporter Gallery Section */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 sm:p-10 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900">{t('supporterGallery')}</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Photos created and shared by community supporters</p>
                        </div>

                        <Link
                            href={`/campaigns/${campaign.slug}/editor`}
                            className="px-4 py-2 bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white rounded-xl text-xs font-bold transition-all"
                        >
                            + Add Your Photo
                        </Link>
                    </div>

                    {campaign.gallery_posts && campaign.gallery_posts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {campaign.gallery_posts.map((post) => (
                                <div key={post.id} className="rounded-2xl border border-gray-100 overflow-hidden bg-gray-50 flex flex-col justify-between">
                                    <img src={post.image_url} alt="Supporter" className="w-full aspect-square object-cover" />
                                    <div className="p-3 text-xs flex items-center justify-between">
                                        <span className="font-bold text-gray-800 truncate">{post.user.name}</span>
                                        <span className="flex items-center gap-1 text-gray-500">
                                            <Heart className="w-3.5 h-3.5 text-accent" />
                                            {post.likes_count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center space-y-3 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <div className="w-12 h-12 mx-auto rounded-full bg-brand-50 text-brand-500 flex items-center justify-center">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <p className="text-xs text-gray-500 max-w-sm mx-auto">{t('noSupportersYet')}</p>
                            <Link
                                href={`/campaigns/${campaign.slug}/editor`}
                                className="inline-block mt-2 px-5 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold hover:bg-brand-600 shadow-xs"
                            >
                                {t('chooseYourPhoto')}
                            </Link>
                        </div>
                    )}
                </div>

                {/* Related Campaigns */}
                {relatedCampaigns.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-gray-900">Similar Campaigns You May Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {relatedCampaigns.map((rc) => (
                                <CampaignCard key={rc.id} campaign={rc} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* REPORT MODAL */}
            {reportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-red-500" />
                                {t('reportCampaign')}
                            </h3>
                            <button onClick={() => setReportModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {reportSuccess ? (
                            <div className="py-6 text-center text-green-600 font-bold text-sm">
                                Thank you! Your report has been submitted to the moderation team.
                            </div>
                        ) : (
                            <form onSubmit={handleReportSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-700">Reason</label>
                                    <select
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        className="w-full text-xs rounded-xl border-gray-200 p-2.5"
                                    >
                                        <option value="Inappropriate Content">Inappropriate Content</option>
                                        <option value="Copyright Infringement">Copyright Infringement</option>
                                        <option value="Misleading Information">Misleading Information</option>
                                        <option value="Spam or Harassment">Spam or Harassment</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-700">Description (Optional)</label>
                                    <textarea
                                        rows={3}
                                        value={reportDescription}
                                        onChange={(e) => setReportDescription(e.target.value)}
                                        placeholder="Please provide additional details..."
                                        className="w-full text-xs rounded-xl border-gray-200 p-2.5"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all"
                                >
                                    Submit Report
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* INSTANT QR CODE GENERATOR MODAL */}
            {qrModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 text-center">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-left">
                                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                                    <QrCode className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-extrabold text-slate-900">Campaign QR Code</h3>
                                    <p className="text-[10px] text-slate-400">Scan to open campaign instantly</p>
                                </div>
                            </div>
                            <button onClick={() => setQrModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Printable QR Code Canvas Card */}
                        <div ref={qrCanvasRef} className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 shadow-inner flex flex-col items-center justify-center space-y-3">
                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 inline-block">
                                <QRCodeCanvas
                                    value={currentUrl || `https://framefusion.atrbd.com/campaigns/${campaign.slug}`}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                            <div className="text-center">
                                <span className="text-xs font-black text-slate-900 block truncate max-w-[220px]">{title}</span>
                                <span className="text-[10px] text-slate-400 font-mono">framefusion.atrbd.com</span>
                            </div>
                        </div>

                        <div className="space-y-2 pt-1">
                            <button
                                onClick={handleDownloadQr}
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download QR Code (PNG)</span>
                            </button>

                            <button
                                onClick={handleCopyLink}
                                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? 'Link Copied!' : 'Copy Campaign Link'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

