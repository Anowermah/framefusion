import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useLanguage } from '@/Context/LanguageContext';
import { Users, Flame, Star, Sparkles, Bookmark, ArrowRight } from 'lucide-react';

export interface CampaignData {
    id: number;
    title: string;
    title_bn?: string;
    slug: string;
    description?: string;
    description_bn?: string;
    frame_url: string;
    thumbnail_url?: string;
    campaign_type: string;
    is_trending: boolean;
    is_featured: boolean;
    supporters_count: number;
    views_count: number;
    is_saved?: boolean;
    creator?: {
        id: number;
        name: string;
        username?: string;
        avatar_url?: string;
    };
    category?: {
        id: number;
        name: string;
        name_bn?: string;
        slug: string;
    };
}

interface CampaignCardProps {
    campaign: CampaignData;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
    const { language, t } = useLanguage();
    const { auth } = usePage().props as any;
    const [saved, setSaved] = useState(campaign.is_saved ?? false);
    const [saving, setSaving] = useState(false);
    const [imageError, setImageError] = useState(false);

    const title = language === 'bn' && campaign.title_bn ? campaign.title_bn : campaign.title;
    const categoryName = language === 'bn' && campaign.category?.name_bn ? campaign.category.name_bn : campaign.category?.name;

    const handleToggleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        setSaving(true);
        fetch(`/campaigns/${campaign.id}/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
            },
        })
        .then(res => res.json())
        .then(data => {
            setSaved(data.saved);
        })
        .finally(() => setSaving(false));
    };

    return (
        <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
            {/* Thumbnail Preview Area */}
            <div className="relative aspect-square w-full bg-linear-to-br from-gray-50 to-gray-100/70 p-4 flex items-center justify-center overflow-hidden">
                <Link href={`/campaigns/${campaign.slug}`} className="absolute inset-0 p-4 flex items-center justify-center">
                    {/* Subtle checkerboard to indicate transparent PNG capability */}
                    <div 
                        className="absolute inset-0 opacity-15"
                        style={{
                            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                            backgroundSize: '16px 16px'
                        }}
                    />

                    {!imageError ? (
                        <img
                            src={campaign.thumbnail_url || campaign.frame_url}
                            alt={title}
                            className="relative z-10 w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gray-50/80 rounded-xl border border-dashed border-gray-200">
                            <Sparkles className="w-8 h-8 text-brand-400 mb-1 animate-pulse" />
                            <span className="text-xs font-semibold text-gray-700 line-clamp-1">{title}</span>
                            <span className="text-[10px] text-gray-400">Campaign Frame</span>
                        </div>
                    )}
                </Link>

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
                    {campaign.is_trending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-white backdrop-blur-xs shadow-xs">
                            <Flame className="w-3 h-3 fill-white" />
                            <span>Trending</span>
                        </span>
                    )}
                    {campaign.is_featured && !campaign.is_trending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-500/90 text-white backdrop-blur-xs shadow-xs">
                            <Star className="w-3 h-3 fill-white" />
                            <span>Featured</span>
                        </span>
                    )}
                </div>

                {/* Save bookmark button */}
                <button
                    onClick={handleToggleSave}
                    disabled={saving}
                    className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all ${
                        saved 
                            ? 'bg-brand-500 text-white shadow-md' 
                            : 'bg-white/80 text-gray-500 hover:text-brand-500 hover:bg-white shadow-xs'
                    }`}
                    title={saved ? t('saved') : t('saveCampaign')}
                >
                    <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
                </button>
            </div>

            {/* Campaign Information Content */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                    {/* Category */}
                    {categoryName && (
                        <span className="text-[11px] font-bold tracking-wide uppercase text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                            {categoryName}
                        </span>
                    )}

                    {/* Title */}
                    <Link href={`/campaigns/${campaign.slug}`} className="block">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1 leading-snug">
                            {title}
                        </h3>
                    </Link>

                    {/* Creator */}
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {t('creator')}: <span className="text-gray-700 font-medium">{campaign.creator?.name || 'FrameFusion Creator'}</span>
                    </p>
                </div>

                {/* Stats and CTA */}
                <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{campaign.supporters_count.toLocaleString()} {t('supporters')}</span>
                    </div>

                    <Link
                        href={`/campaigns/${campaign.slug}/editor`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-500 hover:text-white rounded-xl transition-all group-hover:bg-brand-500 group-hover:text-white active:scale-95"
                    >
                        <span>{t('joinCampaign')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

