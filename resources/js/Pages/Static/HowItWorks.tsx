import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useLanguage } from '@/Context/LanguageContext';
import { Layers, Camera, Download, Share2, PlusCircle, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
    const { t } = useLanguage();

    const steps = [
        {
            num: '01',
            title: 'Browse or Create a Campaign',
            desc: 'Find an event, festival, convocation, or social cause that resonates with you. Or design and upload your own transparent PNG frame in 2 minutes.',
            icon: Layers,
            color: 'bg-brand-50 text-brand-600',
        },
        {
            num: '02',
            title: 'Upload & Personalize Your Photo',
            desc: 'Upload a picture from your phone or computer. Use our responsive studio to pan, zoom, rotate, and enhance brightness until you have a flawless fit.',
            icon: Camera,
            color: 'bg-purple-50 text-purple-600',
        },
        {
            num: '03',
            title: 'Download High-Resolution Output',
            desc: 'Export your completed photo in crisp 1080p or 2160p Ultra HD formats (PNG, JPG, or WebP) with zero quality compression.',
            icon: Download,
            color: 'bg-emerald-50 text-emerald-600',
        },
        {
            num: '04',
            title: 'Share Across Social Media',
            desc: 'Update your profile picture on Facebook, Instagram, WhatsApp, LinkedIn, and X to amplify awareness and invite your network to participate.',
            icon: Share2,
            color: 'bg-amber-50 text-amber-600',
        },
    ];

    return (
        <MainLayout>
            <Head title="How It Works" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
                <div className="text-center space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                        Step-by-Step Guide
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                        How FrameFusion Works
                    </h1>
                    <p className="text-sm text-gray-500 max-w-lg mx-auto">
                        Learn how easy it is to participate in viral campaigns or launch your own movement.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {steps.map((st) => {
                        const Icon = st.icon;
                        return (
                            <div key={st.num} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${st.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-2xl font-black text-gray-200">{st.num}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{st.title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{st.desc}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center pt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/explore"
                        className="px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl shadow-xs text-xs"
                    >
                        {t('exploreCampaigns')}
                    </Link>
                    <Link
                        href="/campaigns/create"
                        className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl text-xs"
                    >
                        {t('createCampaign')}
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
}

