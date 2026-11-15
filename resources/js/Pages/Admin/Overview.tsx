import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AdminNav from '@/Components/AdminNav';
import { Users, Layers, Image as ImageIcon, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

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
        { 
            label: 'Total Users', 
            value: stats.totalUsers, 
            icon: Users, 
            containerClass: 'bg-blue-50 border-blue-100/80 text-blue-600',
            fillClass: 'fill-blue-100'
        },
        { 
            label: 'Active Campaigns', 
            value: stats.totalCampaigns, 
            icon: Layers, 
            containerClass: 'bg-purple-50 border-purple-100/80 text-purple-600',
            fillClass: 'fill-purple-100'
        },
        { 
            label: 'Photos Generated', 
            value: stats.totalPhotos, 
            icon: ImageIcon, 
            containerClass: 'bg-emerald-50 border-emerald-100/80 text-emerald-600',
            fillClass: 'fill-emerald-100'
        },
        { 
            label: 'Pending Reports', 
            value: stats.pendingReports, 
            icon: ShieldAlert, 
            containerClass: 'bg-rose-50 border-rose-100/80 text-rose-600',
            fillClass: 'fill-rose-100'
        },
    ];

    return (
        <MainLayout>
            <Head title="Admin Overview - FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60 uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                            <span>Administrator Console</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">System Overview</h1>
                    </div>
                </div>

                <AdminNav />

                {/* Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {statCards.map((sc, i) => {
                        const Icon = sc.icon;
                        return (
                            <div key={i} className="p-5 bg-white rounded-3xl border border-gray-100 shadow-xs flex items-center gap-4 hover:shadow-card-hover transition-all">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${sc.containerClass}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">{sc.label}</span>
                                    <div className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5 tracking-tight">{sc.value}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Grid of Recent Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Campaigns */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h2 className="text-sm font-extrabold text-gray-900">Recent Campaigns</h2>
                            <Link href="/admin/campaigns" className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                                <span>View all</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {recentCampaigns.map((c) => (
                                <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img src={c.frame_url} alt="" className="w-9 h-9 rounded-xl object-contain bg-gray-50 border border-gray-100 p-0.5 shrink-0" />
                                        <div className="min-w-0">
                                            <span className="font-bold text-gray-900 block truncate max-w-xs">{c.title}</span>
                                            <span className="text-[10px] text-gray-400">By {c.creator?.name || 'Creator'}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-700 shrink-0 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100">
                                        {c.supporters_count} supporters
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Users */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h2 className="text-sm font-extrabold text-gray-900">Recent Users</h2>
                            <Link href="/admin/users" className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                                <span>View all</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {recentUsers.map((u) => (
                                <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                                    <div>
                                        <span className="font-bold text-gray-900 block">{u.name}</span>
                                        <span className="text-[10px] text-gray-400">{u.email}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
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
