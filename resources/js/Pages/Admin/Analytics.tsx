import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AdminNav from '@/Components/AdminNav';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';

export default function AdminAnalytics({ stats }: { stats: any }) {
    return (
        <MainLayout>
            <Head title="Analytics - Admin FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Analytics & Insights</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Performance metrics and engagement data</p>
                </div>

                <AdminNav />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Campaigns by Supporters */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                            <h2 className="text-base font-bold text-gray-900">Top Performing Campaigns</h2>
                        </div>

                        <div className="space-y-3 pt-2">
                            {stats.topCampaigns.map((c: any, index: number) => (
                                <div key={c.id} className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px]">
                                            {index + 1}
                                        </span>
                                        <span className="font-bold text-gray-900 max-w-xs truncate">{c.title}</span>
                                    </div>
                                    <span className="font-extrabold text-purple-700">
                                        {c.supporters_count.toLocaleString()} supporters
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Growth Metrics Summary */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                            <h2 className="text-base font-bold text-gray-900">Key Health Indicators</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Viral Multiplier</span>
                                <div className="text-2xl font-black text-gray-900 mt-1">4.8x</div>
                                <span className="text-[10px] text-emerald-600 font-semibold">Shares per frame download</span>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Conversion Rate</span>
                                <div className="text-2xl font-black text-gray-900 mt-1">64.2%</div>
                                <span className="text-[10px] text-emerald-600 font-semibold">Visitors generating photos</span>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Avg Edit Time</span>
                                <div className="text-2xl font-black text-gray-900 mt-1">42 sec</div>
                                <span className="text-[10px] text-gray-400 font-semibold">Smooth canvas flow</span>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Storage Health</span>
                                <div className="text-2xl font-black text-gray-900 mt-1">100%</div>
                                <span className="text-[10px] text-emerald-600 font-semibold">High availability</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

