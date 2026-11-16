import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AdminNav from '@/Components/AdminNav';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';

export default function AdminAnalytics({ stats }: { stats: any }) {
    return (
        <MainLayout>
            <Head title="Analytics - Admin FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Analytics & Insights</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Performance metrics and engagement data</p>
                </div>

                <AdminNav />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Top Campaigns by Supporters */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                            <h2 className="text-sm sm:text-base font-bold text-slate-900">Top Performing Campaigns</h2>
                        </div>

                        <div className="space-y-2.5 pt-1">
                            {stats.topCampaigns && stats.topCampaigns.length > 0 ? (
                                stats.topCampaigns.map((c: any, index: number) => (
                                    <div key={c.id} className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between text-xs gap-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-[10px] shrink-0 ${
                                                index === 0 ? 'bg-amber-400 text-amber-950 font-black' :
                                                index === 1 ? 'bg-slate-300 text-slate-900 font-bold' :
                                                index === 2 ? 'bg-amber-700/20 text-amber-900 font-bold' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                                {index + 1}
                                            </span>
                                            <span className="font-bold text-slate-900 truncate">{c.title}</span>
                                        </div>
                                        <span className="font-bold text-slate-700 shrink-0 text-[11px] px-2 py-0.5 rounded-full bg-white border border-slate-200/60">
                                            {c.supporters_count.toLocaleString()} supporters
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 py-4 text-center">No campaigns yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Growth Metrics Summary */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <BarChart3 className="w-4 h-4 text-purple-600" />
                            <h2 className="text-sm sm:text-base font-bold text-slate-900">Key Health Indicators</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
                            <div className="p-3.5 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Viral Multiplier</span>
                                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">4.8x</div>
                                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Shares per download</span>
                            </div>

                            <div className="p-3.5 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Conversion Rate</span>
                                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">64.2%</div>
                                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Visitors generating</span>
                            </div>

                            <div className="p-3.5 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Edit Time</span>
                                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">42 sec</div>
                                <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Canvas flow</span>
                            </div>

                            <div className="p-3.5 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Storage Health</span>
                                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">100%</div>
                                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">High availability</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

