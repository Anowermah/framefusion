import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AdminNav from '@/Components/AdminNav';
import { 
    PlusCircle, Layers, Edit2, Trash2, Check, X, 
    ArrowUpDown, Flag, GraduationCap, Cpu, HeartHandshake, 
    Trophy, Briefcase, Sparkles 
} from 'lucide-react';

interface CategoryItem {
    id: number;
    name: string;
    name_bn?: string;
    slug: string;
    icon?: string;
    description?: string;
    order?: number;
    campaigns_count?: number;
}

export default function AdminCategories({ categories = [] }: { categories: CategoryItem[] }) {
    // Form state for creating new category
    const [name, setName] = useState('');
    const [nameBn, setNameBn] = useState('');
    const [slug, setSlug] = useState('');
    const [icon, setIcon] = useState('Briefcase');
    const [order, setOrder] = useState(0);
    const [description, setDescription] = useState('');

    // Editing state
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/categories', {
            name,
            name_bn: nameBn,
            slug,
            icon,
            order,
            description,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setName('');
                setNameBn('');
                setSlug('');
                setIcon('Briefcase');
                setOrder(0);
                setDescription('');
            }
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;

        router.put(`/admin/categories/${editingCategory.id}`, {
            name: editingCategory.name,
            name_bn: editingCategory.name_bn,
            slug: editingCategory.slug,
            icon: editingCategory.icon || 'Briefcase',
            order: editingCategory.order || 0,
            description: editingCategory.description,
        }, {
            preserveScroll: true,
            onSuccess: () => setEditingCategory(null),
        });
    };

    const handleDelete = (category: CategoryItem) => {
        if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
            router.delete(`/admin/categories/${category.id}`, { preserveScroll: true });
        }
    };

    const iconOptions = ['Flag', 'GraduationCap', 'Cpu', 'HeartHandshake', 'Trophy', 'Briefcase', 'Sparkles'];

    return (
        <MainLayout>
            <Head title="Category Management - Admin FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Category Taxonomy Management</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Control campaign categories, icons, Bengali labels, and sequence order</p>
                </div>

                <AdminNav />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Add / Edit Category Form */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h2 className="text-sm sm:text-base font-bold text-slate-900">
                                {editingCategory ? `Edit: ${editingCategory.name}` : 'Add New Category'}
                            </h2>
                            {editingCategory && (
                                <button
                                    onClick={() => setEditingCategory(null)}
                                    className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Cancel</span>
                                </button>
                            )}
                        </div>

                        <form onSubmit={editingCategory ? handleUpdate : handleCreate} className="space-y-3.5 text-xs">
                            <div className="space-y-1">
                                <label className="font-bold text-slate-700">Category Name (English)</label>
                                <input
                                    type="text"
                                    required
                                    value={editingCategory ? editingCategory.name : name}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (editingCategory) {
                                            setEditingCategory({ ...editingCategory, name: val });
                                        } else {
                                            setName(val);
                                            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                                        }
                                    }}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0"
                                    placeholder="e.g. Festivals & Holidays"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-bold text-slate-700">Category Name (বাংলা)</label>
                                <input
                                    type="text"
                                    value={editingCategory ? (editingCategory.name_bn || '') : nameBn}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (editingCategory) {
                                            setEditingCategory({ ...editingCategory, name_bn: val });
                                        } else {
                                            setNameBn(val);
                                        }
                                    }}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bengali focus:border-slate-400 focus:ring-0"
                                    placeholder="যেমন: উৎসব ও দিবস"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-bold text-slate-700">URL Slug</label>
                                <input
                                    type="text"
                                    required
                                    value={editingCategory ? editingCategory.slug : slug}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (editingCategory) {
                                            setEditingCategory({ ...editingCategory, slug: val });
                                        } else {
                                            setSlug(val);
                                        }
                                    }}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] focus:border-slate-400 focus:ring-0"
                                    placeholder="e.g. festivals-holidays"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700">Icon</label>
                                    <select
                                        value={editingCategory ? (editingCategory.icon || 'Briefcase') : icon}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (editingCategory) {
                                                setEditingCategory({ ...editingCategory, icon: val });
                                            } else {
                                                setIcon(val);
                                            }
                                        }}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                                    >
                                        {iconOptions.map(ico => (
                                            <option key={ico} value={ico}>{ico}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-slate-700">Display Order</label>
                                    <input
                                        type="number"
                                        value={editingCategory ? (editingCategory.order ?? 0) : order}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            if (editingCategory) {
                                                setEditingCategory({ ...editingCategory, order: val });
                                            } else {
                                                setOrder(val);
                                            }
                                        }}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="font-bold text-slate-700">Description (Optional)</label>
                                <textarea
                                    rows={2}
                                    value={editingCategory ? (editingCategory.description || '') : description}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (editingCategory) {
                                            setEditingCategory({ ...editingCategory, description: val });
                                        } else {
                                            setDescription(val);
                                        }
                                    }}
                                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-0"
                                    placeholder="Brief summary of campaigns grouped in this category"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-xs active:scale-95"
                            >
                                {editingCategory ? 'Update Category' : 'Create Category'}
                            </button>
                        </form>
                    </div>

                    {/* Category List */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">
                                Total Categories: {categories.length}
                            </span>
                        </div>

                        {/* MOBILE CARDS FOR CATEGORIES */}
                        <div className="block sm:hidden divide-y divide-slate-100">
                            {categories.map((c) => (
                                <div key={c.id} className="p-3.5 space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="font-bold text-slate-900 text-xs">{c.name}</span>
                                                {c.name_bn && (
                                                    <span className="text-slate-400 font-normal font-bengali text-xs">({c.name_bn})</span>
                                                )}
                                                <span className="text-[10px] font-mono text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                                                    #{c.order ?? 0}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">/category/{c.slug}</span>
                                            {c.description && (
                                                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{c.description}</p>
                                            )}
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px] shrink-0 border border-purple-100">
                                            {c.campaigns_count ?? 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-end gap-1 pt-1">
                                        <button
                                            onClick={() => setEditingCategory(c)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-lg hover:text-purple-600"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(c)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-rose-600 bg-rose-50 border border-rose-200/80 rounded-lg hover:bg-rose-100"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* DESKTOP TABLE FOR CATEGORIES */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="p-3">Order</th>
                                        <th className="p-3">Category</th>
                                        <th className="p-3">Slug</th>
                                        <th className="p-3">Campaigns</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {categories.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50/50">
                                            <td className="p-3 font-mono text-slate-400 font-bold">#{c.order ?? 0}</td>
                                            <td className="p-3">
                                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                                    <span>{c.name}</span>
                                                    {c.name_bn && (
                                                        <span className="text-slate-400 font-normal font-bengali">({c.name_bn})</span>
                                                    )}
                                                </div>
                                                {c.description && (
                                                    <p className="text-[11px] text-slate-400 truncate max-w-xs">{c.description}</p>
                                                )}
                                            </td>
                                            <td className="p-3 font-mono text-slate-500 text-[11px]">/category/{c.slug}</td>
                                            <td className="p-3">
                                                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px]">
                                                    {c.campaigns_count ?? 0}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right space-x-1">
                                                <button
                                                    onClick={() => setEditingCategory(c)}
                                                    className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg"
                                                    title="Edit Category"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                                                    title="Delete Category"
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
            </div>
        </MainLayout>
    );
}
