import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import DashboardNav from '@/Components/DashboardNav';
import { useLanguage } from '@/Context/LanguageContext';
import { Layers, Users, Image as ImageIcon, Bookmark, PlusCircle, ArrowRight } from 'lucide-react';

interface OverviewProps {
    stats: {
        totalCampaigns: number;
        totalSupporters: number;
        generatedPhotos: number;
        savedCampaigns: number;
    };
    recentCampaigns: any[];
    recentGenerated: any[];
}

export default function Overview({ stats, recentCampaigns = [], recentGenerated = [] }: OverviewProps) {
    const { t } = useLanguage();

    const statCards = [
        { label: t('totalCampaigns'), value: stats.totalCampaigns, icon: Layers, color: 'text-brand-600 bg-brand-50' },
        { label: t('totalSupporters'), value: stats.totalSupporters.toLocaleString(), icon: Users, color: 'text-purple-600 bg-purple-50' },
        { label: t('generatedPhotos'), value: stats.generatedPhotos, icon: ImageIcon, color: 'text-emerald-600 bg-emerald-50' },
        { label: t('savedCount'), value: stats.savedCampaigns, icon: Bookmark, color: 'text-amber-600 bg-amber-50' },
    ];

    return (
        <MainLayout>
            <Head title="User Dashboard - FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t('dashboard')}</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Overview of your campaign interactions and activity</p>
                    </div>

                    <Link
                        href="/campaigns/create"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all w-fit"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>{t('createCampaign')}</span>
                    </Link>
                </div>

                {/* Dashboard Subnav */}
                <DashboardNav />

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                    {statCards.map((sc, i) => {
                        const Icon = sc.icon;
                        return (
                            <div key={i} className="p-3.5 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 sm:gap-4 hover:border-slate-300 transition-all">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${sc.color}`}>
                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block truncate">{sc.label}</span>
                                    <div className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight truncate">{sc.value}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Campaigns Section */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h2 className="text-sm sm:text-base font-bold text-slate-900">{t('myCampaigns')}</h2>
                        <Link href="/dashboard/campaigns" className="text-xs font-bold text-purple-600 hover:text-purple-700">
                            {t('viewAll')}
                        </Link>
                    </div>

                    {recentCampaigns.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {recentCampaigns.map((c) => (
                                <div key={c.id} className="py-2.5 sm:py-3 flex items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                                        <img src={c.frame_url} alt={c.title} className="w-9 h-9 rounded-xl object-contain bg-slate-50 border border-slate-100 p-0.5 shrink-0" />
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-slate-900 truncate max-w-[150px] sm:max-w-xs">{c.title}</h4>
                                            <span className="text-[10px] text-slate-400">{c.supporters_count} supporters</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                            c.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {c.status}
                                        </span>
                                        <Link
                                            href={`/campaigns/${c.slug}`}
                                            className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg inline-block"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-xs text-slate-400">
                            You have not created any campaigns yet.{' '}
                            <Link href="/campaigns/create" className="text-purple-600 font-bold hover:underline">
                                Create your first campaign
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

