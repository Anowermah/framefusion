import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CampaignCard, { CampaignData } from '@/Components/CampaignCard';
import { useLanguage } from '@/Context/LanguageContext';
import {
    Users, Eye, Calendar, Share2, Copy,
    Bookmark, Flag, ArrowRight, Camera,
    Check, Sparkles, MessageSquare, ThumbsUp,
    ShieldAlert, X, Heart
} from 'lucide-react';

interface CampaignShowProps {
    campaign: CampaignData & {
        description?: string;
        description_bn?: string;
        start_date?: string;
        tags?: string;
        primary_frame?: {
            aspect_ratio?: string;
        };
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

    const title = language === 'bn' && campaign.title_bn ? campaign.title_bn : campaign.title;
    const description = language === 'bn' && campaign.description_bn ? campaign.description_bn : campaign.description;
    const categoryName = language === 'bn' && campaign.category?.name_bn ? campaign.category.name_bn : campaign.category?.name;

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

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

    return (
        <MainLayout>
            <Head title={title} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
                {/* Campaign Hero Showcase */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 sm:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        {/* Frame Visual Display */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-linear-to-br from-gray-50 to-gray-100/70 p-4 border border-gray-100 shadow-xl overflow-hidden group">
                                <div
                                    className="w-full h-full rounded-2xl overflow-hidden relative flex items-center justify-center"
                                    style={{
                                        backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                                        backgroundSize: '16px 16px',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                >
                                    <img
                                        src={campaign.frame_url}
                                        alt={title}
                                        className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
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
                                </div>

                                <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight">
                                    {title}
                                </h1>

                                <p className="text-xs text-gray-500">
                                    {t('creator')}: <span className="text-gray-900 font-bold">{campaign.creator?.name || 'FrameFusion Creator'}</span>
                                </p>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 leading-relaxed font-normal">
                                {description}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-6 py-3 border-y border-gray-100 text-xs font-semibold text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-brand-500" />
                                    <span><strong className="text-gray-900">{campaign.supporters_count.toLocaleString()}</strong> {t('supporters')}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Eye className="w-4 h-4 text-purple-500" />
                                    <span><strong className="text-gray-900">{campaign.views_count.toLocaleString()}</strong> {t('views')}</span>
                                </div>
                            </div>

                            {/* MAIN CTA BUTTON: CHOOSE YOUR PHOTO */}
                            <div className="pt-2 flex flex-col sm:flex-row gap-3">
                                <Link
                                    href={`/campaigns/${campaign.slug}/editor`}
                                    className="flex-1 py-4 px-8 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-brand-500/25 active:scale-95 transition-all text-center flex items-center justify-center gap-2.5"
                                >
                                    <Camera className="w-5 h-5" />
                                    <span>{t('chooseYourPhoto')}</span>
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>

                                <button
                                    onClick={handleToggleSave}
                                    className={`px-5 py-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${saved
                                        ? 'border-brand-500 bg-brand-50 text-brand-600'
                                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Bookmark className={`w-4 h-4 ${saved ? 'fill-brand-500' : ''}`} />
                                    <span>{saved ? t('saved') : t('saveCampaign')}</span>
                                </button>
                            </div>

                            {/* Social Share Bar */}
                            <div className="pt-3 flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-gray-500 mr-2 flex items-center gap-1">
                                    <Share2 className="w-3.5 h-3.5" />
                                    {t('shareCampaign')}:
                                </span>

                                <button
                                    onClick={handleCopyLink}
                                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                                    <span>{copied ? t('linkCopied') : t('copyLink')}</span>
                                </button>

                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-xl text-xs font-semibold"
                                >
                                    Facebook
                                </a>

                                <a
                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(campaign.title + ' ' + currentUrl)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-xl text-xs font-semibold"
                                >
                                    WhatsApp
                                </a>

                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(campaign.title)}&url=${encodeURIComponent(currentUrl)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 bg-gray-900/10 hover:bg-gray-900/20 text-gray-900 rounded-xl text-xs font-semibold"
                                >
                                    X (Twitter)
                                </a>

                                <button
                                    onClick={handleNativeShare}
                                    className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-xl text-xs font-semibold"
                                >
                                    More...
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
        </MainLayout>
    );
}

