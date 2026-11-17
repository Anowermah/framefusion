import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CampaignCard, { CampaignData } from '@/Components/CampaignCard';
import { useLanguage } from '@/Context/LanguageContext';
import { Search, SlidersHorizontal, Sparkles, FolderSearch } from 'lucide-react';

interface CategoryItem {
    id: number;
    name: string;
    name_bn?: string;
    slug: string;
}

interface PaginationData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface ExploreProps {
    campaigns: PaginationData<CampaignData>;
    categories: CategoryItem[];
    filters: {
        search?: string;
        category?: string;
        sort?: string;
    };
}

export default function Explore({ campaigns, categories, filters }: ExploreProps) {
    const { language, t } = useLanguage();
    const safeFilters = (Array.isArray(filters) || !filters) ? {} : filters;
    const [search, setSearch] = useState(typeof safeFilters.search === 'string' ? safeFilters.search : '');
    const [selectedCat, setSelectedCat] = useState(typeof safeFilters.category === 'string' ? safeFilters.category : '');
    const [selectedSort, setSelectedSort] = useState(typeof safeFilters.sort === 'string' ? safeFilters.sort : 'trending');

    const categoryList = Array.isArray(categories) ? categories : [];
    const campaignList = campaigns?.data && Array.isArray(campaigns.data) ? campaigns.data : [];

    const handleApplyFilters = (newCat?: string, newSort?: string, newSearch?: string) => {
        const cat = newCat !== undefined ? newCat : selectedCat;
        const srt = newSort !== undefined ? newSort : selectedSort;
        const q = newSearch !== undefined ? newSearch : search;

        router.get('/explore', {
            search: q || undefined,
            category: cat || undefined,
            sort: srt || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleApplyFilters();
    };

    return (
        <MainLayout>
            <Head title={language === 'bn' ? 'ক্যাম্পেইন এক্সপ্লোর করুন' : 'Explore Campaigns'} />

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 sm:pb-12 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            {t('exploreCampaigns')}
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {language === 'bn' 
                                ? 'হাজারো ট্রেন্ডিং ফটো ফ্রেম ও সোশ্যাল ক্যাম্পেইন অন্বেষণ করুন' 
                                : 'Discover and join thousands of active photo frame campaigns'}
                        </p>
                    </div>

                    {campaigns?.total !== undefined && (
                        <div className="text-xs font-bold text-gray-500 self-start sm:self-auto px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
                            <span className="text-brand-600 font-extrabold">{campaigns.total}</span> {language === 'bn' ? 'টি ফ্রেম' : 'campaigns'}
                        </div>
                    )}
                </div>

                {/* Filter & Search Bar Controls */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4 w-full max-w-full overflow-hidden">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                        {/* Search Input Capsule */}
                        <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 bg-gray-50/80 hover:bg-gray-50 focus-within:bg-white rounded-2xl border border-gray-200/80 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all">
                            <Search className="w-4 h-4 text-gray-400 shrink-0" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t('searchPlaceholder')}
                                className="w-full bg-transparent border-0 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:ring-0 p-0 font-medium"
                            />
                        </div>

                        {/* Controls (Sort + Submit) */}
                        <div className="flex items-center gap-2">
                            <div className="relative flex items-center">
                                <select
                                    value={selectedSort}
                                    onChange={(e) => {
                                        setSelectedSort(e.target.value);
                                        handleApplyFilters(undefined, e.target.value);
                                    }}
                                    className="px-4 py-2.5 bg-gray-50 border border-gray-200/80 text-xs font-semibold text-gray-700 rounded-2xl focus:ring-0 cursor-pointer pr-8 hover:bg-gray-100 transition-colors"
                                >
                                    <option value="trending">{t('sortTrending')}</option>
                                    <option value="supported">{t('sortMostSupported')}</option>
                                    <option value="newest">{t('sortNewest')}</option>
                                    <option value="oldest">{t('sortOldest')}</option>
                                    <option value="featured">{t('sortFeatured')}</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-all active:scale-95 shrink-0"
                            >
                                {t('explore')}
                            </button>
                        </div>
                    </form>

                    {/* Category Filter Pills (Horizontal Scroll) */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs [-webkit-overflow-scrolling:touch]">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedCat('');
                                handleApplyFilters('', undefined);
                            }}
                            className={`px-4 py-2 rounded-full font-bold transition-all shrink-0 text-xs ${selectedCat === ''
                                ? 'bg-brand-500 text-white shadow-xs'
                                : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900'
                                }`}
                        >
                            {t('allCategories')}
                        </button>

                        {categoryList.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                    setSelectedCat(c.slug);
                                    handleApplyFilters(c.slug, undefined);
                                }}
                                className={`px-4 py-2 rounded-full font-bold transition-all shrink-0 text-xs ${selectedCat === c.slug
                                    ? 'bg-brand-500 text-white shadow-xs'
                                    : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900'
                                    }`}
                            >
                                {language === 'bn' && c.name_bn ? c.name_bn : c.name}
                            </button>
                        ))}
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
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 flex items-center justify-center">
                            <FolderSearch className="w-7 h-7 text-gray-400" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800">
                            {language === 'bn' ? 'কোন ক্যাম্পেইন পাওয়া যায়নি' : 'No campaigns found'}
                        </h3>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                            {language === 'bn' 
                                ? 'অন্য কোন সার্চ কি-ওয়ার্ড লিখুন অথবা অন্য ক্যাটাগরি নির্বাচন করুন।'
                                : 'Try adjusting your search terms or selecting another category.'}
                        </p>
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
