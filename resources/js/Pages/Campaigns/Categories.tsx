import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useLanguage } from '@/Context/LanguageContext';
import { Flag, GraduationCap, Cpu, HeartHandshake, Trophy, Briefcase, ArrowRight } from 'lucide-react';

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

    const getIcon = (icon: string) => {
        switch (icon) {
            case 'Flag': return <Flag className="w-6 h-6 text-red-500" />;
            case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-blue-500" />;
            case 'Cpu': return <Cpu className="w-6 h-6 text-purple-500" />;
            case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-emerald-500" />;
            case 'Trophy': return <Trophy className="w-6 h-6 text-amber-500" />;
            default: return <Briefcase className="w-6 h-6 text-brand-500" />;
        }
    };

    return (
        <MainLayout>
            <Head title="Categories - FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        {t('categories')}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Browse visual campaigns curated across our top categories
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/explore?category=${cat.slug}`}
                            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-card-hover transition-all flex flex-col justify-between group"
                        >
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 group-hover:bg-brand-50 flex items-center justify-center mb-4 transition-colors">
                                    {getIcon(cat.icon)}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                                    {language === 'bn' && cat.name_bn ? cat.name_bn : cat.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                    {language === 'bn' && cat.description_bn ? cat.description_bn : cat.description}
                                </p>
                            </div>

                            <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-brand-600">
                                <span>{cat.campaigns_count ?? 1} campaigns</span>
                                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    <span>Explore</span>
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}

