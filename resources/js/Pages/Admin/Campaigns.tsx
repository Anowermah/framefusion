import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AdminNav from '@/Components/AdminNav';
import { Star, Flame, Trash2, Eye } from 'lucide-react';

export default function AdminCampaigns({ campaigns }: { campaigns: any }) {
    const handleToggleFeature = (id: number) => {
        router.post(`/admin/campaigns/${id}/feature`, {}, { preserveScroll: true });
    };

    const handleToggleTrending = (id: number) => {
        router.post(`/admin/campaigns/${id}/trending`, {}, { preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this campaign as an admin?')) {
            router.delete(`/admin/campaigns/${id}`, { preserveScroll: true });
        }
    };

    return (
        <MainLayout>
            <Head title="Manage Campaigns - Admin FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Campaign Management</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Control campaign featured tags, trending status, and community curation</p>
                </div>

                <AdminNav />

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="p-3">Campaign</th>
                                    <th className="p-3">Creator</th>
                                    <th className="p-3">Supporters</th>
                                    <th className="p-3">Badges</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {campaigns.data.map((c: any) => (
                                    <tr key={c.id} className="hover:bg-gray-50/50">
                                        <td className="p-3 flex items-center gap-3">
                                            <img src={c.frame_url} alt="" className="w-10 h-10 rounded-lg object-contain bg-gray-50 border p-0.5" />
                                            <div>
                                                <span className="font-bold text-gray-900 block max-w-xs truncate">{c.title}</span>
                                                <span className="text-[10px] text-gray-400 font-mono">/campaigns/{c.slug}</span>
                                            </div>
                                        </td>
                                        <td className="p-3">{c.creator?.name}</td>
                                        <td className="p-3 font-bold text-gray-900">{c.supporters_count.toLocaleString()}</td>
                                        <td className="p-3 space-x-1.5">
                                            <button
                                                onClick={() => handleToggleFeature(c.id)}
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    c.is_featured ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'
                                                }`}
                                            >
                                                ★ Featured
                                            </button>
                                            <button
                                                onClick={() => handleToggleTrending(c.id)}
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    c.is_trending ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'
                                                }`}
                                            >
                                                🔥 Trending
                                            </button>
                                        </td>
                                        <td className="p-3 text-right space-x-1">
                                            <Link
                                                href={`/campaigns/${c.slug}`}
                                                className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg inline-block"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

