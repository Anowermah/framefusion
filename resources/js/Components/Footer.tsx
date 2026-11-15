import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useLanguage } from '@/Context/LanguageContext';
import { Heart, Globe, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    const { platform_settings } = usePage().props as any;
    const { language, setLanguage, t } = useLanguage();

    const siteName = platform_settings?.site_name || 'FrameFusion';
    const footerText = platform_settings?.footer_text || `${siteName}. All rights reserved. High-Performance Campaign & Twibbon Platform.`;

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

                        {/* Social Links from Database */}
                        <div className="flex items-center gap-3 pt-2">
                            {platform_settings?.social_facebook && (
                                <a 
                                    href={platform_settings.social_facebook} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                    title="Facebook"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </a>
                            )}
                            {platform_settings?.social_twitter && (
                                <a 
                                    href={platform_settings.social_twitter} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                                    title="X (Twitter)"
                                >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </a>
                            )}
                            {platform_settings?.social_instagram && (
                                <a 
                                    href={platform_settings.social_instagram} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                                    title="Instagram"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                </a>
                            )}
                            {platform_settings?.social_youtube && (
                                <a 
                                    href={platform_settings.social_youtube} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    title="YouTube"
                                >
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                </a>
                            )}
                        </div>

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
                    <p>© {new Date().getFullYear()} {footerText}</p>
                    <p className="text-gray-400">High-Performance Campaign & Twibbon Platform</p>
                </div>
            </div>
        </footer>
    );
}
