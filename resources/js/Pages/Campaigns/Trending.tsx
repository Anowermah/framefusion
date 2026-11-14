import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CampaignCard, { CampaignData } from '@/Components/CampaignCard';
import { useLanguage } from '@/Context/LanguageContext';
import { Flame } from 'lucide-react';

interface PaginationData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export default function Trending({ campaigns }: { campaigns: PaginationData<CampaignData> }) {
    const { t } = useLanguage();

    return (
        <MainLayout>
            <Head title="Trending Campaigns - FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-600">
                        <Flame className="w-6 h-6 fill-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            {t('trendingSection')}
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {t('trendingDesc')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {campaigns.data.map((c) => (
                        <CampaignCard key={c.id} campaign={c} />
                    ))}
                </div>

                {campaigns.last_page > 1 && (
                    <div className="flex justify-center items-center gap-1.5 pt-6">
                        {campaigns.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    link.active
                                        ? 'bg-brand-500 text-white shadow-xs'
                                        : link.url
                                        ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                        : 'text-gray-300 cursor-not-allowed'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

