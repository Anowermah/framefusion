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
    const { language, t } = useLanguage();
    const campaignList = campaigns?.data && Array.isArray(campaigns.data) ? campaigns.data : [];

    return (
        <MainLayout>
            <Head title={language === 'bn' ? 'ট্রেন্ডিং ক্যাম্পেইন সমূহ' : 'Trending Campaigns'} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100/80 flex items-center justify-center text-amber-600 shadow-xs shrink-0">
                            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                {t('trendingSection')}
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {t('trendingDesc')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Campaign Grid */}
                {campaignList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {campaignList.map((c) => (
                            <CampaignCard key={c.id} campaign={c} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                            <Flame className="w-6 h-6 fill-amber-400" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-800">
                            {language === 'bn' ? 'কোন ট্রেন্ডিং ফ্রেম পাওয়া যায়নি' : 'No trending campaigns yet'}
                        </h3>
                    </div>
                )}

                {/* Pagination */}
                {campaigns && campaigns.last_page > 1 && Array.isArray(campaigns.links) && (
                    <div className="flex justify-center items-center gap-1.5 pt-6">
                        {campaigns.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${link.active
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
