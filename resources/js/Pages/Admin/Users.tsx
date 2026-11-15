import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AdminNav from '@/Components/AdminNav';
import { Search, Shield, UserCheck, UserX, Key, Trash2, X } from 'lucide-react';

interface UserItem {
    id: number;
    name: string;
    username?: string;
    email: string;
    role: string;
    status: string;
    campaigns_count?: number;
    generated_photos_count?: number;
    created_at: string;
}

export default function UsersPage({ users, filters = {} }: { users: any; filters: any }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [status, setStatus] = useState(filters.status || '');

    // Reset password modal state
    const [resettingUser, setResettingUser] = useState<UserItem | null>(null);
    const [newPassword, setNewPassword] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search, role, status });
    };

    const applyFilters = (newFilters: any) => {
        const query: Record<string, string> = {};
        if (newFilters.search) query.search = newFilters.search;
        if (newFilters.role) query.role = newFilters.role;
        if (newFilters.status) query.status = newFilters.status;

        router.get('/admin/users', query, { preserveState: true, preserveScroll: true });
    };

    const handleRoleChange = (id: number, newRole: string) => {
        router.post(`/admin/users/${id}/role`, { role: newRole }, { preserveScroll: true });
    };

    const handleToggleStatus = (id: number) => {
        router.post(`/admin/users/${id}/toggle-status`, {}, { preserveScroll: true });
    };

    const handleDeleteUser = (user: UserItem) => {
        if (confirm(`Are you sure you want to permanently delete user "${user.name}" (${user.email})? This action cannot be undone.`)) {
            router.delete(`/admin/users/${user.id}`, { preserveScroll: true });
        }
    };

    const handleResetPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resettingUser || newPassword.length < 8) return;

        router.post(`/admin/users/${resettingUser.id}/reset-password`, {
            password: newPassword,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setResettingUser(null);
                setNewPassword('');
            }
        });
    };

    return (
        <MainLayout>
            <Head title="User Management - Admin FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">User Account Administration</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Control registered accounts, permissions, roles, passwords, and status</p>
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
                                    placeholder="Search by name, email, username..."
                                    className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border border-gray-200"
                                />
                            </div>

                            <select
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    applyFilters({ search, role: e.target.value, status });
                                }}
                                className="text-xs p-2 rounded-xl border-gray-200"
                            >
                                <option value="">All Roles</option>
                                <option value="user">User</option>
                                <option value="creator">Creator</option>
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                            </select>

                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    applyFilters({ search, role, status: e.target.value });
                                }}
                                className="text-xs p-2 rounded-xl border-gray-200"
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                            </select>

                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all"
                            >
                                Search
                            </button>
                        </div>

                        <span className="text-xs text-gray-500 font-medium">
                            Total Users: {users.total ?? users.data?.length ?? 0}
                        </span>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="p-3">User</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Campaigns</th>
                                    <th className="p-3">Photos Made</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.data?.map((u: UserItem) => (
                                    <tr key={u.id} className="hover:bg-gray-50/50">
                                        <td className="p-3">
                                            <span className="font-bold text-gray-900 block">{u.name}</span>
                                            <span className="text-[11px] text-gray-400 block">{u.email}</span>
                                            {u.username && (
                                                <span className="text-[10px] text-purple-600 font-mono">@{u.username}</span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className="text-xs p-1 rounded-lg border-gray-200 font-semibold"
                                            >
                                                <option value="user">User</option>
                                                <option value="creator">Creator</option>
                                                <option value="admin">Admin</option>
                                                <option value="super_admin">Super Admin</option>
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                u.status === 'active' 
                                                    ? 'bg-green-50 text-green-700 border border-green-200' 
                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="p-3 font-semibold text-gray-800">
                                            {u.campaigns_count ?? 0}
                                        </td>
                                        <td className="p-3 font-semibold text-gray-800">
                                            {u.generated_photos_count ?? 0}
                                        </td>
                                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleStatus(u.id)}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                                    u.status === 'active'
                                                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                                                }`}
                                            >
                                                {u.status === 'active' ? 'Suspend' : 'Activate'}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setResettingUser(u);
                                                    setNewPassword('');
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg inline-block"
                                                title="Reset User Password"
                                            >
                                                <Key className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteUser(u)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg inline-block"
                                                title="Delete User"
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
                    {users.links && users.links.length > 3 && (
                        <div className="flex items-center justify-center gap-1 pt-4 border-t border-gray-100">
                            {users.links.map((link: any, idx: number) => (
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

            {/* Reset Password Modal */}
            {resettingUser && (
                <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="text-sm font-bold text-gray-900">Reset Password: {resettingUser.name}</h3>
                            <button onClick={() => setResettingUser(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleResetPasswordSubmit} className="space-y-3 text-xs">
                            <div className="space-y-1">
                                <label className="font-bold text-gray-700">New Password (Min 8 characters)</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new strong password"
                                    className="w-full p-2.5 rounded-xl border border-gray-200"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setResettingUser(null)}
                                    className="px-3.5 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={newPassword.length < 8}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-bold"
                                >
                                    Save New Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
