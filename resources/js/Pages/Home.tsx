import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CampaignCard, { CampaignData } from '@/Components/CampaignCard';
import { useLanguage } from '@/Context/LanguageContext';
import {
    Search, Sparkles, Flame, Star, ArrowRight,
    Upload, Sliders, Download, CheckCircle, Shield,
    Users, HeartHandshake, Flag, GraduationCap, Cpu,
    Trophy, Briefcase, ChevronRight
} from 'lucide-react';

interface CategoryData {
    id: number;
    name: string;
    name_bn?: string;
    slug: string;
    icon: string;
    campaigns_count?: number;
}

interface HomeProps {
    categories: CategoryData[];
    trendingCampaigns: CampaignData[];
    featuredCampaigns: CampaignData[];
    recentCampaigns: CampaignData[];
    stats: {
        totalSupporters: number;
        totalCampaigns: number;
    };
}

export default function Home({
    categories = [],
    trendingCampaigns = [],
    featuredCampaigns = [],
    recentCampaigns = [],
    stats,
}: HomeProps) {
    const { language, t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.visit(`/explore?search=${encodeURIComponent(searchTerm)}&category=${selectedCategory}`);
    };

    const getCategoryIcon = (iconName: string) => {
        switch (iconName) {
            case 'Flag': return <Flag className="w-5 h-5 text-red-500" />;
            case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-blue-500" />;
            case 'Cpu': return <Cpu className="w-5 h-5 text-purple-500" />;
            case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-emerald-500" />;
            case 'Trophy': return <Trophy className="w-5 h-5 text-amber-500" />;
            default: return <Briefcase className="w-5 h-5 text-brand-500" />;
        }
    };

    return (
        <MainLayout>
            <Head title="Visual Campaign Platform" />

            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-linear-to-b from-brand-50/60 via-white to-[#F8F9FC]">
                {/* Decorative background glows */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-linear-to-tr from-brand-500/10 via-purple-500/10 to-accent/10 blur-3xl -z-10 rounded-full" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Hero Text */}
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/70 text-brand-700 text-xs font-bold border border-brand-200">
                                <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
                                <span>{t('trustedBy')}</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
                                {t('heroTitle')}
                            </h1>

                            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                                {t('heroSubtitle')}
                            </p>

                            {/* Hero Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                                <Link
                                    href="/explore"
                                    className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-2xl shadow-lg shadow-brand-500/25 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                                >
                                    <span>{t('exploreCampaigns')}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <Link
                                    href="/campaigns/create"
                                    className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-gray-800 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl shadow-xs transition-all text-center"
                                >
                                    {t('startCampaign')}
                                </Link>
                            </div>

                            {/* Trust badges */}
                            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <span>100% Free to Use</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <span>Ultra HD PNG Downloads</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <span>No App Install Needed</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual Collage */}
                        <div className="lg:col-span-5 relative flex items-center justify-center">
                            <div className="relative w-full max-w-[420px] aspect-square">
                                {/* Sample Floating Twibbon Cards Collage */}
                                <div className="absolute top-0 right-4 w-52 sm:w-60 aspect-square rounded-3xl bg-white p-3 shadow-2xl border border-gray-100 rotate-6 hover:rotate-0 transition-transform duration-300 z-20">
                                    <div
                                        className="w-full h-full rounded-2xl overflow-hidden relative"
                                        style={{
                                            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                                            backgroundSize: '12px 12px',
                                        }}
                                    >
                                        <img
                                            src="/storage/frames/bangladesh-independence.png"
                                            alt="Independence Day"
                                            className="w-full h-full object-contain filter drop-shadow-md"
                                        />
                                    </div>
                                    <div className="absolute -bottom-3 -left-3 bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-100 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                        <Flame className="w-3.5 h-3.5 fill-emerald-500" />
                                        14.2k Supporters
                                    </div>
                                </div>

                                <div className="absolute bottom-2 left-4 w-52 sm:w-60 aspect-square rounded-3xl bg-white p-3 shadow-2xl border border-gray-100 -rotate-6 hover:rotate-0 transition-transform duration-300 z-10">
                                    <div
                                        className="w-full h-full rounded-2xl overflow-hidden relative"
                                        style={{
                                            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                                            backgroundSize: '12px 12px',
                                        }}
                                    >
                                        <img
                                            src="/storage/frames/graduation-2026.png"
                                            alt="Graduation Pride"
                                            className="w-full h-full object-contain filter drop-shadow-md"
                                        />
                                    </div>
                                    <div className="absolute -top-3 -right-3 bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-100 text-[11px] font-bold text-brand-600 flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 fill-brand-500" />
                                        Featured Campaign
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEARCH & DISCOVERY BAR */}
            <section className="max-w-5xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-30">
                <form
                    onSubmit={handleSearchSubmit}
                    className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-2 sm:p-3 flex flex-col sm:flex-row items-center gap-2"
                >
                    <div className="flex-1 flex items-center gap-3 px-3 w-full">
                        <Search className="w-5 h-5 text-gray-400 shrink-0" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('searchPlaceholder')}
                            className="w-full border-0 focus:ring-0 text-sm text-gray-800 placeholder-gray-400 py-2.5"
                        />
                    </div>

                    <div className="h-8 w-[1px] bg-gray-200 hidden sm:block" />

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full sm:w-48 border-0 bg-transparent text-xs font-semibold text-gray-700 py-2.5 focus:ring-0 cursor-pointer"
                    >
                        <option value="">{t('allCategories')}</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.slug}>
                                {language === 'bn' && c.name_bn ? c.name_bn : c.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
                    >
                        {t('explore')}
                    </button>
                </form>
            </section>

            {/* CATEGORIES DIRECTORY SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900">{t('categories')}</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Explore campaigns by themes and interests</p>
                    </div>
                    <Link href="/categories" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                        <span>{t('viewAll')}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/explore?category=${cat.slug}`}
                            className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-brand-300 shadow-xs hover:shadow-card-hover transition-all text-center flex flex-col items-center group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-brand-50 flex items-center justify-center mb-3 transition-colors">
                                {getCategoryIcon(cat.icon)}
                            </div>
                            <h3 className="text-xs font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                                {language === 'bn' && cat.name_bn ? cat.name_bn : cat.name}
                            </h3>
                            <span className="text-[10px] text-gray-400 mt-0.5">
                                {cat.campaigns_count ?? 1} campaigns
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* SECTION 1: TRENDING CAMPAIGNS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-1 rounded-lg bg-amber-100 text-amber-600">
                                <Flame className="w-4 h-4 fill-amber-500" />
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900">{t('trendingSection')}</h2>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{t('trendingDesc')}</p>
                    </div>

                    <Link href="/trending" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                        <span>{t('viewAll')}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingCampaigns.map((camp) => (
                        <CampaignCard key={camp.id} campaign={camp} />
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="bg-white py-16 border-y border-gray-100 my-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                            Simple & Fast
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">How FrameFusion Works</h2>
                        <p className="text-sm text-gray-500">
                            Three simple steps to create, personalize, and share high-impact visual campaigns
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {/* Step 1 */}
                        <div className="p-6 rounded-3xl bg-[#F8F9FC] border border-gray-100 space-y-4">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-500 text-white font-black text-lg flex items-center justify-center shadow-md shadow-brand-500/25">
                                1
                            </div>
                            <h3 className="text-base font-bold text-gray-900">Choose a Campaign</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Explore trending national events, university graduations, sports, and cultural festivals.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="p-6 rounded-3xl bg-[#F8F9FC] border border-gray-100 space-y-4">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500 text-white font-black text-lg flex items-center justify-center shadow-md shadow-purple-500/25">
                                2
                            </div>
                            <h3 className="text-base font-bold text-gray-900">Upload & Position Photo</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Upload your photo, scale, zoom, rotate, and adjust brightness to fit perfectly under the transparent frame.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="p-6 rounded-3xl bg-[#F8F9FC] border border-gray-100 space-y-4">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-accent text-white font-black text-lg flex items-center justify-center shadow-md shadow-accent/25">
                                3
                            </div>
                            <h3 className="text-base font-bold text-gray-900">Download & Share</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Export in crisp PNG, JPG, or WebP. Set as your social profile picture and inspire others.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: FEATURED CAMPAIGNS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-1 rounded-lg bg-purple-100 text-purple-600">
                                <Star className="w-4 h-4 fill-purple-500" />
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900">{t('featuredSection')}</h2>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{t('featuredDesc')}</p>
                    </div>

                    <Link href="/explore?sort=featured" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                        <span>{t('viewAll')}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredCampaigns.map((camp) => (
                        <CampaignCard key={camp.id} campaign={camp} />
                    ))}
                </div>
            </section>

            {/* CTA SECTION FOR CREATORS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-brand-600 via-brand-500 to-purple-600 p-8 sm:p-14 text-white shadow-xl">
                    <div className="relative z-10 max-w-xl space-y-4">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase">
                            Empowering Organizations & Creators
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                            Start Your Own Viral Visual Campaign Today
                        </h2>
                        <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
                            Upload your organization or event frame in transparent PNG, get a unique custom link, and mobilize thousands of supporters in minutes.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/campaigns/create"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-brand-600 font-extrabold text-xs rounded-xl shadow-lg hover:bg-gray-50 active:scale-95 transition-all"
                            >
                                <span>{t('createCampaign')}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

