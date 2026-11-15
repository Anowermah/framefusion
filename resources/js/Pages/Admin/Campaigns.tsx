import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AdminNav from '@/Components/AdminNav';
import { 
    Star, Flame, Trash2, Eye, Edit, Search, 
    Filter, CheckCircle, Clock, AlertTriangle, XCircle 
} from 'lucide-react';

interface CampaignItem {
    id: number;
    title: string;
    slug: string;
    frame_url: string;
    status: string;
    is_featured: boolean;
    is_trending: boolean;
    supporters_count: number;
    creator?: {
        id: number;
        name: string;
        email: string;
    };
    category?: {
        id: number;
        name: string;
    };
}

export default function AdminCampaigns({ 
    campaigns, 
    categories = [], 
    filters = {} 
}: { 
    campaigns: any; 
    categories: any[]; 
    filters: any; 
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search, status, category_id: categoryId });
    };

    const applyFilters = (newFilters: any) => {
        const query: Record<string, string> = {};
        if (newFilters.search) query.search = newFilters.search;
        if (newFilters.status) query.status = newFilters.status;
        if (newFilters.category_id) query.category_id = newFilters.category_id;

        router.get('/admin/campaigns', query, { preserveState: true, preserveScroll: true });
    };

    const handleStatusChange = (id: number, newStatus: string) => {
        router.post(`/admin/campaigns/${id}/status`, { status: newStatus }, { preserveScroll: true });
    };

    const handleToggleFeature = (id: number) => {
        router.post(`/admin/campaigns/${id}/feature`, {}, { preserveScroll: true });
    };

    const handleToggleTrending = (id: number) => {
        router.post(`/admin/campaigns/${id}/trending`, {}, { preserveScroll: true });
    };

    const handleDelete = (c: CampaignItem) => {
        if (confirm(`Are you sure you want to delete campaign "${c.title}" as an administrator?`)) {
            router.delete(`/admin/campaigns/${c.id}`, { preserveScroll: true });
        }
    };

    const statusBadge = (st: string) => {
        switch (st) {
            case 'published':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">Published</span>;
            case 'pending':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
            case 'draft':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">Draft</span>;
            case 'rejected':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">Rejected</span>;
            default:
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-50 text-gray-500">{st}</span>;
        }
    };

    return (
        <MainLayout>
            <Head title="Manage Campaigns - Admin FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Campaign Curation & Moderation</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Approve, feature, unpublish, and moderate community campaign twibbons</p>
                </div>

                <AdminNav />

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
                    {/* Filters bar */}
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by title or slug..."
                                    className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border border-gray-200"
                                />
                            </div>

                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    applyFilters({ search, status: e.target.value, category_id: categoryId });
                                }}
                                className="text-xs p-2 rounded-xl border-gray-200"
                            >
                                <option value="">All Statuses</option>
                                <option value="published">Published</option>
                                <option value="pending">Pending Approval</option>
                                <option value="draft">Draft</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            <select
                                value={categoryId}
                                onChange={(e) => {
                                    setCategoryId(e.target.value);
                                    applyFilters({ search, status, category_id: e.target.value });
                                }}
                                className="text-xs p-2 rounded-xl border-gray-200"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>

                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all"
                            >
                                Filter
                            </button>
                        </div>

                        <span className="text-xs text-gray-500 font-medium">
                            Total: {campaigns.total ?? campaigns.data?.length ?? 0}
                        </span>
                    </form>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="p-3">Campaign</th>
                                    <th className="p-3">Creator</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Supporters</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Curate</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {campaigns.data?.map((c: CampaignItem) => (
                                    <tr key={c.id} className="hover:bg-gray-50/50">
                                        <td className="p-3 flex items-center gap-3">
                                            <img 
                                                src={c.frame_url} 
                                                alt="" 
                                                className="w-10 h-10 rounded-lg object-contain bg-gray-50 border p-0.5 shrink-0" 
                                            />
                                            <div className="min-w-0 max-w-xs">
                                                <span className="font-bold text-gray-900 block truncate">{c.title}</span>
                                                <span className="text-[10px] text-gray-400 font-mono truncate block">/campaigns/{c.slug}</span>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span className="font-semibold text-gray-800 block">{c.creator?.name || 'Unknown'}</span>
                                            <span className="text-[10px] text-gray-400 block">{c.creator?.email}</span>
                                        </td>
                                        <td className="p-3 font-medium text-gray-700">
                                            {c.category?.name || 'Uncategorized'}
                                        </td>
                                        <td className="p-3 font-bold text-gray-900">
                                            {(c.supporters_count ?? 0).toLocaleString()}
                                        </td>
                                        <td className="p-3">
                                            <select
                                                value={c.status}
                                                onChange={(e) => handleStatusChange(c.id, e.target.value)}
                                                className="text-xs p-1 rounded-lg border-gray-200 font-semibold"
                                            >
                                                <option value="published">Published</option>
                                                <option value="pending">Pending</option>
                                                <option value="draft">Draft</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </td>
                                        <td className="p-3 space-x-1.5 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleFeature(c.id)}
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                                                    c.is_featured ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-400'
                                                }`}
                                            >
                                                ★ Featured
                                            </button>
                                            <button
                                                onClick={() => handleToggleTrending(c.id)}
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                                                    c.is_trending ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-gray-100 text-gray-400'
                                                }`}
                                            >
                                                🔥 Trending
                                            </button>
                                        </td>
                                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                                            <Link
                                                href={`/campaigns/${c.slug}`}
                                                className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg inline-block"
                                                title="View Public Page"
                                                target="_blank"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/campaigns/${c.id}/edit`}
                                                className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg inline-block"
                                                title="Edit Campaign"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(c)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                                                title="Delete Campaign"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {campaigns.links && campaigns.links.length > 3 && (
                        <div className="flex items-center justify-center gap-1 pt-4 border-t border-gray-100">
                            {campaigns.links.map((link: any, idx: number) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                        link.active 
                                            ? 'bg-purple-600 text-white font-bold' 
                                            : link.url 
                                                ? 'text-gray-600 hover:bg-gray-100' 
                                                : 'text-gray-300 pointer-events-none'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
