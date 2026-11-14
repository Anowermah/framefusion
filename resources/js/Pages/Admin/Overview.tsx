import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AdminNav from '@/Components/AdminNav';
import { Users, Layers, Image as ImageIcon, ShieldAlert, Heart, ExternalLink } from 'lucide-react';

interface AdminOverviewProps {
    stats: {
        totalUsers: number;
        totalCampaigns: number;
        totalPhotos: number;
        pendingReports: number;
        totalSupporters: number;
    };
    recentUsers: any[];
    recentCampaigns: any[];
    recentReports: any[];
}

export default function Overview({ stats, recentUsers = [], recentCampaigns = [], recentReports = [] }: AdminOverviewProps) {
    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600 bg-blue-50' },
        { label: 'Total Campaigns', value: stats.totalCampaigns, icon: Layers, color: 'text-purple-600 bg-purple-50' },
        { label: 'Total Photos Generated', value: stats.totalPhotos, icon: ImageIcon, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Pending Reports', value: stats.pendingReports, icon: ShieldAlert, color: 'text-red-600 bg-red-50' },
    ];

    return (
        <MainLayout>
            <Head title="Admin Overview - FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 uppercase tracking-wider mb-1">
                            Administrator Console
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">System Overview</h1>
                    </div>
                </div>

                <AdminNav />

                {/* Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {statCards.map((sc, i) => {
                        const Icon = sc.icon;
                        return (
                            <div key={i} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${sc.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{sc.label}</span>
                                    <div className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">{sc.value}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Grid of Recent Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Campaigns */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-900">Recent Campaigns</h2>
                            <Link href="/admin/campaigns" className="text-xs font-bold text-purple-600 hover:underline">
                                View all
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {recentCampaigns.map((c) => (
                                <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2.5">
                                        <img src={c.frame_url} alt="" className="w-8 h-8 rounded-lg object-contain bg-gray-50 border p-0.5" />
                                        <div>
                                            <span className="font-bold text-gray-900 block max-w-xs truncate">{c.title}</span>
                                            <span className="text-[10px] text-gray-400">By {c.creator?.name}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">{c.supporters_count} supporters</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Users */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-900">Recent Users</h2>
                            <Link href="/admin/users" className="text-xs font-bold text-purple-600 hover:underline">
                                View all
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {recentUsers.map((u) => (
                                <div key={u.id} className="py-2.5 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="font-bold text-gray-900 block">{u.name}</span>
                                        <span className="text-[10px] text-gray-400">{u.email}</span>
                                    </div>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 font-bold text-[10px] rounded-full uppercase">
                                        {u.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

