import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AdminNav from '@/Components/AdminNav';
import { PlusCircle, Layers } from 'lucide-react';

export default function AdminCategories({ categories }: { categories: any[] }) {
    const [name, setName] = useState('');
    const [nameBn, setNameBn] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/categories', {
            name,
            name_bn: nameBn,
            slug,
            description,
        }, {
            onSuccess: () => {
                setName('');
                setNameBn('');
                setSlug('');
                setDescription('');
            }
        });
    };

    return (
        <MainLayout>
            <Head title="Categories - Admin FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Category Management</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Manage categories and directory taxonomies</p>
                </div>

                <AdminNav />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Category Form */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
                        <h2 className="text-base font-bold text-gray-900">Add New Category</h2>
                        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                            <div className="space-y-1">
                                <label className="font-bold text-gray-700">Category Name (English)</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                                    }}
                                    className="w-full p-2 rounded-xl border border-gray-200"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-bold text-gray-700">Category Name (বাংলা)</label>
                                <input
                                    type="text"
                                    value={nameBn}
                                    onChange={(e) => setNameBn(e.target.value)}
                                    className="w-full p-2 rounded-xl border border-gray-200 font-bengali"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-bold text-gray-700">Slug</label>
                                <input
                                    type="text"
                                    required
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full p-2 rounded-xl border border-gray-200"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-bold text-gray-700">Description</label>
                                <textarea
                                    rows={2}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-2 rounded-xl border border-gray-200"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all"
                            >
                                Create Category
                            </button>
                        </form>
                    </div>

                    {/* Category List */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Slug</th>
                                    <th className="p-3">Campaigns</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.map((c) => (
                                    <tr key={c.id}>
                                        <td className="p-3 font-bold text-gray-900">
                                            {c.name} {c.name_bn && <span className="font-normal text-gray-400 font-bengali">({c.name_bn})</span>}
                                        </td>
                                        <td className="p-3 font-mono text-gray-500">{c.slug}</td>
                                        <td className="p-3 font-bold">{c.campaigns_count ?? 0}</td>
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

