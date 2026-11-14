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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Content Moderation & Reports</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Review reported campaigns and protect community safety</p>
                </div>

                <AdminNav />

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
                    {reports.data.length > 0 ? (
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="p-3">Campaign</th>
                                    <th className="p-3">Reason</th>
                                    <th className="p-3">Reporter</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reports.data.map((r: any) => (
                                    <tr key={r.id}>
                                        <td className="p-3 font-bold text-gray-900">{r.campaign?.title}</td>
                                        <td className="p-3 font-medium text-red-600">{r.reason}</td>
                                        <td className="p-3 text-gray-500">{r.reporter?.name || 'Anonymous'}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                r.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right space-x-2">
                                            <button
                                                onClick={() => handleStatus(r.id, 'resolved')}
                                                className="text-xs font-bold text-green-600 hover:underline"
                                            >
                                                Resolve
                                            </button>
                                            <button
                                                onClick={() => handleStatus(r.id, 'dismissed')}
                                                className="text-xs font-bold text-gray-400 hover:underline"
                                            >
                                                Dismiss
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-xs text-gray-400">
                            <ShieldAlert className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                            <p>No reports currently pending review. All clean!</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

