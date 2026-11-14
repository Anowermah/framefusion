import React from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useLanguage } from '@/Context/LanguageContext';
import { Heart, Globe } from 'lucide-react';

export default function Footer() {
    const { language, setLanguage, t } = useLanguage();

    return (
        <footer className="bg-white border-t border-gray-100 mt-20 pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-100">
                    {/* Brand Info */}
                    <div className="lg:col-span-2 space-y-4">
                        <ApplicationLogo size="lg" showTagline={true} />
                        <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
                            {t('footerAbout')}
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                Crafted with <Heart className="w-3.5 h-3.5 text-accent fill-accent" /> for creators everywhere.
                            </span>
                        </div>
                    </div>

                    {/* Explore Column */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t('explore')}</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/explore" className="hover:text-brand-500 transition-colors">{t('exploreCampaigns')}</Link></li>
                            <li><Link href="/trending" className="hover:text-brand-500 transition-colors">{t('trending')}</Link></li>
                            <li><Link href="/categories" className="hover:text-brand-500 transition-colors">{t('categories')}</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-brand-500 transition-colors">{t('howItWorks')}</Link></li>
                        </ul>
                    </div>

                    {/* Quick links */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t('quickLinks')}</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/campaigns/create" className="hover:text-brand-500 transition-colors">{t('createCampaign')}</Link></li>
                            <li><Link href="/dashboard" className="hover:text-brand-500 transition-colors">{t('dashboard')}</Link></li>
                            <li><Link href="/about" className="hover:text-brand-500 transition-colors">{t('aboutUs')}</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-500 transition-colors">{t('contactUs')}</Link></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t('legal')}</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/privacy" className="hover:text-brand-500 transition-colors">{t('privacyPolicy')}</Link></li>
                            <li><Link href="/terms" className="hover:text-brand-500 transition-colors">{t('termsOfService')}</Link></li>
                        </ul>

                        <div className="pt-4">
                            <span className="text-xs font-semibold text-gray-700 block mb-2">Language / ভাষা</span>
                            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-xs">
                                <button
                                    onClick={() => setLanguage('en')}
                                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                                        language === 'en' ? 'bg-white shadow-xs text-brand-600 font-bold' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => setLanguage('bn')}
                                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                                        language === 'bn' ? 'bg-white shadow-xs text-brand-600 font-bold' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    বাংলা
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
                    <p>© {new Date().getFullYear()} FrameFusion. {t('allRightsReserved')}</p>
                    <p className="text-gray-400">High-Performance Campaign & Twibbon Platform</p>
                </div>
            </div>
        </footer>
    );
}

