import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import DashboardNav from '@/Components/DashboardNav';
import { useLanguage } from '@/Context/LanguageContext';
import { PlusCircle, ExternalLink, Trash2, Eye, Power, Edit } from 'lucide-react';

export default function MyCampaigns({ campaigns }: { campaigns: any }) {
    const { t } = useLanguage();

    const handleToggleStatus = (id: number) => {
        router.post(`/dashboard/campaigns/${id}/toggle-status`, {}, { preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to permanently delete this campaign?')) {
            router.delete(`/dashboard/campaigns/${id}`, { preserveScroll: true });
        }
    };

    return (
        <MainLayout>
            <Head title="My Campaigns - FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{t('myCampaigns')}</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Manage and monitor all your created campaigns</p>
                    </div>

                    <Link
                        href="/campaigns/create"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>{t('createCampaign')}</span>
                    </Link>
                </div>

                <DashboardNav />

                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                    {campaigns.data && campaigns.data.length > 0 ? (
                        <>
                            {/* MOBILE CARD VIEW FOR MY CAMPAIGNS */}
                            <div className="block sm:hidden divide-y divide-slate-100">
                                {campaigns.data.map((c: any) => (
                                    <div key={c.id} className="p-3.5 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <img 
                                                src={c.frame_url} 
                                                alt={c.title} 
                                                className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200/80 p-0.5 shrink-0" 
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className="font-bold text-slate-900 block truncate text-xs">{c.title}</span>
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                                                        c.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {c.status}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-mono truncate block mt-0.5">/campaigns/{c.slug}</span>
                                                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                                                    <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-600">{c.category?.name || 'General'}</span>
                                                    <span>•</span>
                                                    <span className="font-semibold text-slate-700">{c.supporters_count.toLocaleString()} users</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-100">
                                            <Link
                                                href={`/campaigns/${c.slug}`}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl hover:text-brand-600"
                                                title="View Public Page"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>View</span>
                                            </Link>
                                            <Link
                                                href={`/campaigns/${c.id}/edit`}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl hover:text-brand-600"
                                                title="Edit Campaign"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                                <span>Edit</span>
                                            </Link>
                                            <button
                                                onClick={() => handleToggleStatus(c.id)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200/80 rounded-xl hover:bg-amber-100"
                                                title="Toggle Status"
                                            >
                                                <Power className="w-3.5 h-3.5" />
                                                <span>{c.status === 'published' ? 'Unpublish' : 'Publish'}</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200/80 rounded-xl hover:bg-rose-100"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* DESKTOP TABLE VIEW */}
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-600">
                                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="p-4">Campaign</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4">Supporters</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {campaigns.data.map((c: any) => (
                                            <tr key={c.id} className="hover:bg-slate-50/50">
                                                <td className="p-4 flex items-center gap-3">
                                                    <img src={c.frame_url} alt={c.title} className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-100 p-0.5" />
                                                    <div>
                                                        <span className="font-bold text-slate-900 block max-w-xs truncate">{c.title}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono">/campaigns/{c.slug}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="px-2 py-0.5 bg-slate-100 rounded-md font-medium text-[11px]">
                                                        {c.category?.name || 'General'}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-bold text-slate-900">
                                                    {c.supporters_count.toLocaleString()}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                        c.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right space-x-1">
                                                    <Link
                                                        href={`/campaigns/${c.slug}`}
                                                        className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg inline-block"
                                                        title="View Public Page"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/campaigns/${c.id}/edit`}
                                                        className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg inline-block"
                                                        title="Edit Campaign"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleToggleStatus(c.id)}
                                                        className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg"
                                                        title="Toggle Status (Publish/Draft)"
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(c.id)}
                                                        className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="p-12 text-center text-xs text-gray-400 space-y-3">
                            <p>You haven't created any campaigns yet.</p>
                            <Link href="/campaigns/create" className="inline-block px-4 py-2 bg-brand-500 text-white font-bold rounded-xl">
                                Create Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

