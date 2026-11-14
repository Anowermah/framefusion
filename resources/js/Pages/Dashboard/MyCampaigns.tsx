import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import DashboardNav from '@/Components/DashboardNav';
import { useLanguage } from '@/Context/LanguageContext';
import { PlusCircle, ExternalLink, Trash2, Eye, Power } from 'lucide-react';

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

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
                    {campaigns.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-gray-600">
                                <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <tr>
                                        <th className="p-4">Campaign</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">Supporters</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {campaigns.data.map((c: any) => (
                                        <tr key={c.id} className="hover:bg-gray-50/50">
                                            <td className="p-4 flex items-center gap-3">
                                                <img src={c.frame_url} alt={c.title} className="w-12 h-12 rounded-xl object-contain bg-gray-50 border border-gray-100 p-0.5" />
                                                <div>
                                                    <span className="font-bold text-gray-900 block max-w-xs truncate">{c.title}</span>
                                                    <span className="text-[10px] text-gray-400 font-mono">/campaigns/{c.slug}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-0.5 bg-gray-100 rounded-md font-medium text-[11px]">
                                                    {c.category?.name || 'General'}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold text-gray-900">
                                                {c.supporters_count.toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                    c.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right space-x-1">
                                                <Link
                                                    href={`/campaigns/${c.slug}`}
                                                    className="p-1.5 text-gray-500 hover:text-brand-600 rounded-lg inline-block"
                                                    title="View Public Page"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleToggleStatus(c.id)}
                                                    className="p-1.5 text-gray-500 hover:text-amber-600 rounded-lg"
                                                    title="Toggle Status (Publish/Draft)"
                                                >
                                                    <Power className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c.id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg"
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

