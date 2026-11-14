import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AdminNav from '@/Components/AdminNav';
import { Search, Shield, UserCheck, UserX } from 'lucide-react';

export default function UsersPage({ users, filters }: { users: any; filters: any }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.visit(`/admin/users?search=${encodeURIComponent(search)}`, { preserveState: true });
    };

    const handleRoleChange = (id: number, role: string) => {
        router.post(`/admin/users/${id}/role`, { role }, { preserveScroll: true });
    };

    const handleToggleStatus = (id: number) => {
        router.post(`/admin/users/${id}/toggle-status`, {}, { preserveScroll: true });
    };

    return (
        <MainLayout>
            <Head title="User Management - Admin FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900">User Management</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Manage registered creators, user roles, and account permissions</p>
                </div>

                <AdminNav />

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
                    <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email, username..."
                            className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-gray-200"
                        />
                        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold">
                            Search
                        </button>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="p-3">User</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.data.map((u: any) => (
                                    <tr key={u.id} className="hover:bg-gray-50/50">
                                        <td className="p-3">
                                            <span className="font-bold text-gray-900 block">{u.name}</span>
                                            <span className="text-[11px] text-gray-400">{u.email}</span>
                                        </td>
                                        <td className="p-3">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className="text-xs p-1 rounded-lg border-gray-200"
                                            >
                                                <option value="user">User</option>
                                                <option value="creator">Creator</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                            }`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <button
                                                onClick={() => handleToggleStatus(u.id)}
                                                className="text-xs font-bold text-gray-500 hover:text-purple-600"
                                            >
                                                {u.status === 'active' ? 'Suspend' : 'Activate'}
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

