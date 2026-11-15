import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CampaignCard, { CampaignData } from '@/Components/CampaignCard';
import { useLanguage } from '@/Context/LanguageContext';
import { Flame, Sparkles } from 'lucide-react';

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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                            <Flame className="w-6 h-6 fill-white" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 uppercase tracking-wider mb-1">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>{language === 'bn' ? 'শীর্ষ জনপ্রিয়' : 'Top Trending'}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                {t('trendingSection')}
                            </h1>
                            <p className="text-xs text-gray-500 mt-0.5">
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
                    <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                            <Flame className="w-7 h-7" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800">
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
