import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useLanguage } from '@/Context/LanguageContext';
import { Sparkles, Heart, Shield, Users, ArrowRight } from 'lucide-react';

export default function About() {
    const { t } = useLanguage();

    return (
        <MainLayout>
            <Head title="About Us - FrameFusion" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
                <div className="text-center space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                        Our Mission
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
                        Empowering Communities Through Visual Expression
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        FrameFusion was built to revolutionize how people, movements, universities, and causes celebrate milestones and rally community support online.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Effortless Creativity</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            No Photoshop or complex tools required. Anyone can personalize a campaign frame in seconds from any device.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Viral Amplification</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Each supporter's profile picture becomes a beacon for awareness, driving massive social momentum and organic reach.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Privacy & Speed</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            High-speed in-browser canvas rendering guarantees smooth performance without compromising user privacy.
                        </p>
                    </div>
                </div>

                <div className="bg-linear-to-r from-brand-500 to-purple-600 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-black">Join Thousands of Campaign Creators</h2>
                    <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto">
                        Launch your organization or festival campaign in less than two minutes.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/campaigns/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-600 font-bold rounded-xl text-xs hover:bg-gray-50 active:scale-95 transition-all"
                        >
                            <span>{t('createCampaign')}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

