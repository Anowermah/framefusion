import React from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AdminNav from '@/Components/AdminNav';
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

export default function AdminReports({ reports }: { reports: any }) {
    const handleStatus = (id: number, status: string) => {
        router.post(`/admin/reports/${id}/status`, { status }, { preserveScroll: true });
    };

    return (
        <MainLayout>
            <Head title="Content Reports - Admin FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Content Moderation & Reports</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Review reported campaigns and protect community safety</p>
                </div>

                <AdminNav />

                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                    {reports.data && reports.data.length > 0 ? (
                        <>
                            {/* MOBILE VIEW FOR REPORTS */}
                            <div className="block sm:hidden divide-y divide-slate-100">
                                {reports.data.map((r: any) => (
                                    <div key={r.id} className="p-4 space-y-2.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <span className="font-bold text-slate-900 text-xs block truncate">
                                                    {r.campaign?.title || 'Untitled Campaign'}
                                                </span>
                                                <span className="text-[11px] text-slate-400 block mt-0.5">
                                                    Reported by: <span className="text-slate-600">{r.reporter?.name || 'Anonymous'}</span>
                                                </span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                                r.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-700'
                                            }`}>
                                                {r.status}
                                            </span>
                                        </div>

                                        <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100 text-xs text-rose-700">
                                            <span className="font-semibold block text-[10px] text-rose-500 uppercase tracking-wider mb-0.5">Reason</span>
                                            {r.reason}
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-1">
                                            <button
                                                onClick={() => handleStatus(r.id, 'resolved')}
                                                className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
                                            >
                                                Resolve
                                            </button>
                                            <button
                                                onClick={() => handleStatus(r.id, 'dismissed')}
                                                className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
                                            >
                                                Dismiss
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
                                            <th className="p-3">Campaign</th>
                                            <th className="p-3">Reason</th>
                                            <th className="p-3">Reporter</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {reports.data.map((r: any) => (
                                            <tr key={r.id} className="hover:bg-slate-50/50">
                                                <td className="p-3 font-bold text-slate-900">{r.campaign?.title}</td>
                                                <td className="p-3 font-medium text-rose-600">{r.reason}</td>
                                                <td className="p-3 text-slate-500">{r.reporter?.name || 'Anonymous'}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        r.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-700'
                                                    }`}>
                                                        {r.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleStatus(r.id, 'resolved')}
                                                        className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all"
                                                    >
                                                        Resolve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatus(r.id, 'dismissed')}
                                                        className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
                                                    >
                                                        Dismiss
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="p-12 text-center text-xs text-slate-400">
                            <ShieldAlert className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                            <p className="font-medium text-slate-500">No reports currently pending review. All clean!</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

