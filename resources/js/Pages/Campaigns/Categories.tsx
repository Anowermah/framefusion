import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useLanguage } from '@/Context/LanguageContext';
import { Flag, GraduationCap, Cpu, HeartHandshake, Trophy, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

interface CategoryItem {
    id: number;
    name: string;
    name_bn?: string;
    slug: string;
    icon: string;
    description?: string;
    description_bn?: string;
    campaigns_count?: number;
}

export default function Categories({ categories }: { categories: CategoryItem[] }) {
    const { language, t } = useLanguage();

    const getIconContainer = (icon: string) => {
        switch (icon) {
            case 'Flag':
                return (
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs group-hover:scale-110 transition-transform duration-300">
                        <Flag className="w-6 h-6 fill-rose-100" />
                    </div>
                );
            case 'GraduationCap':
                return (
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="w-6 h-6 fill-blue-100" />
                    </div>
                );
            case 'Cpu':
                return (
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-xs group-hover:scale-110 transition-transform duration-300">
                        <Cpu className="w-6 h-6 fill-purple-100" />
                    </div>
                );
            case 'HeartHandshake':
                return (
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs group-hover:scale-110 transition-transform duration-300">
                        <HeartHandshake className="w-6 h-6 fill-emerald-100" />
                    </div>
                );
            case 'Trophy':
                return (
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs group-hover:scale-110 transition-transform duration-300">
                        <Trophy className="w-6 h-6 fill-amber-100" />
                    </div>
                );
            default:
                return (
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-xs group-hover:scale-110 transition-transform duration-300">
                        <Briefcase className="w-6 h-6 fill-brand-100" />
                    </div>
                );
        }
    };

    return (
        <MainLayout>
            <Head title={language === 'bn' ? 'ক্যাটাগরি ব্রাউজ করুন' : 'Browse Categories'} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-brand-50 text-brand-600 border border-brand-100 mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                            <span>{language === 'bn' ? 'সকল বিভাগ' : 'All Categories'}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                            {t('categories')}
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {language === 'bn' 
                                ? 'আপনার পছন্দের বিষয় অনুযায়ী ফ্রেম বা ক্যাম্পেইন খুঁজুন' 
                                : 'Explore curated photo frame campaigns by theme and purpose'}
                        </p>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/explore?category=${cat.slug}`}
                            className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-card-hover hover:border-brand-200 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="mb-4">
                                    {getIconContainer(cat.icon)}
                                </div>
                                <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                                    {language === 'bn' && cat.name_bn ? cat.name_bn : cat.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                                    {language === 'bn' && cat.description_bn ? cat.description_bn : cat.description}
                                </p>
                            </div>

                            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500 group-hover:text-brand-600 transition-colors">
                                <span className="px-2.5 py-0.5 rounded-full bg-gray-50 group-hover:bg-brand-50 text-gray-600 group-hover:text-brand-600 text-[11px] font-semibold border border-gray-100 group-hover:border-brand-100 transition-colors">
                                    {cat.campaigns_count ?? 1} {language === 'bn' ? 'টি ফ্রেম' : 'campaigns'}
                                </span>
                                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    <span>{language === 'bn' ? 'দেখুন' : 'Explore'}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
