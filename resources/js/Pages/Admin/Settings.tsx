import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AdminNav from '@/Components/AdminNav';
import { Save, Check } from 'lucide-react';

export default function AdminSettings({ settings }: { settings: any }) {
    const [siteName, setSiteName] = useState(settings.site_name || 'FrameFusion');
    const [siteTagline, setSiteTagline] = useState(settings.site_tagline || 'Create. Customize. Celebrate.');
    const [primaryColor, setPrimaryColor] = useState(settings.primary_color || '#635BFF');
    const [contactEmail, setContactEmail] = useState(settings.contact_email || 'support@framefusion.io');
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/settings', {
            site_name: siteName,
            site_tagline: siteTagline,
            primary_color: primaryColor,
            contact_email: contactEmail,
        }, {
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        });
    };

    return (
        <MainLayout>
            <Head title="Website Settings - Admin FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Website Settings</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Configure platform branding, metadata, and operational parameters</p>
                </div>

                <AdminNav />

                <div className="max-w-2xl bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                        <div className="space-y-1">
                            <label className="font-bold text-gray-700">Platform Name</label>
                            <input
                                type="text"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-gray-200"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="font-bold text-gray-700">Tagline</label>
                            <input
                                type="text"
                                value={siteTagline}
                                onChange={(e) => setSiteTagline(e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-gray-200"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="font-bold text-gray-700">Primary Brand Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                />
                                <span className="font-mono text-gray-600">{primaryColor}</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="font-bold text-gray-700">Support / Contact Email</label>
                            <input
                                type="email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-gray-200"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition-all"
                            >
                                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                <span>{saved ? 'Saved!' : 'Save Settings'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}

