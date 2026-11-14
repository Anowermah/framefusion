import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CampaignCard, { CampaignData } from '@/Components/CampaignCard';
import { useLanguage } from '@/Context/LanguageContext';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

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
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCat, setSelectedCat] = useState(filters.category || '');
    const [selectedSort, setSelectedSort] = useState(filters.sort || 'trending');

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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                        {t('exploreCampaigns')}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Discover and join thousands of active photo frame campaigns around the globe
                    </p>
                </div>

                {/* Filter & Search Bar Controls */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                            <Search className="w-4 h-4 text-gray-400 shrink-0" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t('searchPlaceholder')}
                                className="w-full bg-transparent border-0 text-xs text-gray-800 placeholder-gray-400 focus:ring-0 p-0"
                            />
                        </div>

                        {/* Sort Selector */}
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedSort}
                                onChange={(e) => {
                                    setSelectedSort(e.target.value);
                                    handleApplyFilters(undefined, e.target.value);
                                }}
                                className="px-3 py-2 bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 rounded-xl focus:ring-0 cursor-pointer"
                            >
                                <option value="trending">{t('sortTrending')}</option>
                                <option value="supported">{t('sortMostSupported')}</option>
                                <option value="newest">{t('sortNewest')}</option>
                                <option value="oldest">{t('sortOldest')}</option>
                                <option value="featured">{t('sortFeatured')}</option>
                            </select>

                            <button
                                type="submit"
                                className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
                            >
                                {t('explore')}
                            </button>
                        </div>
                    </form>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
                        <button
                            onClick={() => {
                                setSelectedCat('');
                                handleApplyFilters('', undefined);
                            }}
                            className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${selectedCat === ''
                                ? 'bg-brand-500 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {t('allCategories')}
                        </button>

                        {categories.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => {
                                    setSelectedCat(c.slug);
                                    handleApplyFilters(c.slug, undefined);
                                }}
                                className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${selectedCat === c.slug
                                    ? 'bg-brand-500 text-white shadow-xs'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {language === 'bn' && c.name_bn ? c.name_bn : c.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Campaign Grid */}
                {campaigns.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {campaigns.data.map((c) => (
                            <CampaignCard key={c.id} campaign={c} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800">No campaigns found</h3>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                            Try adjusting your search terms or selecting another category.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {campaigns.last_page > 1 && (
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

