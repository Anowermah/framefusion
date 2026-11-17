import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useLanguage } from '@/Context/LanguageContext';
import { Heart } from 'lucide-react';

export default function Footer() {
    const { platform_settings } = (usePage?.()?.props || {}) as any;
    const { language, setLanguage, t } = useLanguage();

    const siteName = platform_settings?.site_name || 'FrameFusion';
    const siteTagline = language === 'bn' 
        ? (platform_settings?.site_tagline_bn || 'তৈরি করুন • সাজান • উদযাপন করুন')
        : (platform_settings?.site_tagline || 'Create • Customize • Celebrate');
        
    const footerText = platform_settings?.footer_text || `${siteName}. ${t('allRightsReserved') || 'All rights reserved.'}`;

    // Format WhatsApp Link if provided
    const whatsappRaw = platform_settings?.social_whatsapp;
    const whatsappUrl = whatsappRaw
        ? (whatsappRaw.startsWith('http') ? whatsappRaw : `https://wa.me/${whatsappRaw.replace(/[^0-9]/g, '')}`)
        : null;

    return (
        <footer className="bg-white border-t border-slate-200/70 mt-10 sm:mt-20 w-full">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                
                {/* ============================================================== */}
                {/* 1. MOBILE COMPACT & CONCISE FOOTER (বিকাশ / নগদ স্টাইল সংক্ষিপ্ত ফুটার) */}
                {/* ============================================================== */}
                <div className="block sm:hidden py-6 pb-26 space-y-4 text-center">
                    {/* Logo & Short Tagline */}
                    <div className="flex flex-col items-center justify-center space-y-1">
                        <ApplicationLogo size="sm" showTagline={false} />
                        <p className="text-[11px] font-medium text-slate-400">
                            {siteTagline}
                        </p>
                    </div>

                    {/* Quick Compact Link Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-600">
                        <Link href="/explore" className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all">
                            {t('explore')}
                        </Link>
                        <Link href="/trending" className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all">
                            {t('trending')}
                        </Link>
                        <Link href="/categories" className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all">
                            {t('categories')}
                        </Link>
                        <Link href="/how-it-works" className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all">
                            {t('howItWorks')}
                        </Link>
                        <Link href="/privacy" className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all">
                            {t('privacyPolicy')}
                        </Link>
                        <Link href="/terms" className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all">
                            {t('termsOfService')}
                        </Link>
                        <Link href="/contact" className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all">
                            {t('contactUs')}
                        </Link>
                    </div>

                    {/* Social Icon Pills */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                        {platform_settings?.social_facebook && (
                            <a 
                                href={platform_settings.social_facebook} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-blue-50 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all active:scale-90"
                                title="Facebook"
                            >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>
                        )}
                        {platform_settings?.social_twitter && (
                            <a 
                                href={platform_settings.social_twitter} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white border border-slate-200/70 flex items-center justify-center text-slate-600 transition-all active:scale-90"
                                title="X (Twitter)"
                            >
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            </a>
                        )}
                        {platform_settings?.social_instagram && (
                            <a 
                                href={platform_settings.social_instagram} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-pink-50 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-pink-600 transition-all active:scale-90"
                                title="Instagram"
                            >
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                            </a>
                        )}
                        {platform_settings?.social_youtube && (
                            <a 
                                href={platform_settings.social_youtube} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-50 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-red-600 transition-all active:scale-90"
                                title="YouTube"
                            >
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                            </a>
                        )}
                        {whatsappUrl && (
                            <a 
                                href={whatsappUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-emerald-600 transition-all active:scale-90"
                                title="WhatsApp"
                            >
                                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.02.79.81-2.94-.19-.3A8.2 8.2 0 0 1 3.8 11.91c0-4.54 3.7-8.24 8.25-8.24zm4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.12-.22-.19-.47-.32z"/></svg>
                            </a>
                        )}
                    </div>

                    {/* Mini Language Switcher */}
                    <div className="pt-1 flex items-center justify-center">
                        <div className="inline-flex rounded-full border border-slate-200/80 p-0.5 bg-slate-100 text-xs font-bold">
                            <button
                                type="button"
                                onClick={() => setLanguage('bn')}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] transition-all ${
                                    language === 'bn' 
                                        ? 'bg-white shadow-2xs text-slate-900 font-black' 
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                বাংলা
                            </button>
                            <button
                                type="button"
                                onClick={() => setLanguage('en')}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] transition-all ${
                                    language === 'en' 
                                        ? 'bg-white shadow-2xs text-slate-900 font-black' 
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                English
                            </button>
                        </div>
                    </div>

                    {/* Concise Copyright Bar */}
                    <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-center gap-1">
                        <span>© {new Date().getFullYear()} {siteName}.</span>
                        <span>{t('allRightsReserved') || 'All rights reserved.'}</span>
                    </div>
                </div>

                {/* ============================================================== */}
                {/* 2. DESKTOP RICH MULTI-COLUMN FOOTER                           */}
                {/* ============================================================== */}
                <div className="hidden sm:block pt-14 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-slate-100">
                        {/* Brand Info & Social Presence */}
                        <div className="lg:col-span-5 space-y-4">
                            <ApplicationLogo size="md" showTagline={true} />
                            
                            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed break-words font-normal">
                                {t('footerAbout')}
                            </p>

                            {/* Social Links Row */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                {platform_settings?.social_facebook && (
                                    <a 
                                        href={platform_settings.social_facebook} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="w-8 h-8 rounded-full bg-slate-50 hover:bg-blue-50 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all hover:scale-105 active:scale-95 shadow-2xs"
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
                                        className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200/70 flex items-center justify-center text-slate-600 transition-all hover:scale-105 active:scale-95 shadow-2xs"
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
                                        className="w-8 h-8 rounded-full bg-slate-50 hover:bg-pink-50 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-pink-600 transition-all hover:scale-105 active:scale-95 shadow-2xs"
                                        title="Instagram"
                                    >
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                    </a>
                                )}
                                {platform_settings?.social_youtube && (
                                    <a 
                                        href={platform_settings.social_youtube} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="w-8 h-8 rounded-full bg-slate-50 hover:bg-red-50 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-red-600 transition-all hover:scale-105 active:scale-95 shadow-2xs"
                                        title="YouTube"
                                    >
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                    </a>
                                )}
                                {whatsappUrl && (
                                    <a 
                                        href={whatsappUrl} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="w-8 h-8 rounded-full bg-slate-50 hover:bg-emerald-50 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:text-emerald-600 transition-all hover:scale-105 active:scale-95 shadow-2xs"
                                        title="WhatsApp"
                                    >
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.02.79.81-2.94-.19-.3A8.2 8.2 0 0 1 3.8 11.91c0-4.54 3.7-8.24 8.25-8.24zm4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.12-.22-.19-.47-.32z"/></svg>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Desktop Multi-Column Links */}
                        <div className="lg:col-span-7 grid grid-cols-3 gap-8">
                            {/* Explore Column */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    {t('explore')}
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                                    <li>
                                        <Link href="/explore" className="hover:text-brand-600 transition-colors inline-block py-0.5">
                                            {t('exploreCampaigns')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/trending" className="hover:text-brand-600 transition-colors inline-block py-0.5">
                                            {t('trending')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/categories" className="hover:text-brand-600 transition-colors inline-block py-0.5">
                                            {t('categories')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/how-it-works" className="hover:text-brand-600 transition-colors inline-block py-0.5">
                                            {t('howItWorks')}
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Quick links Column */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    {t('quickLinks')}
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                                    <li>
                                        <Link href="/campaigns/create" className="hover:text-brand-600 transition-colors inline-block py-0.5">
                                            {t('createCampaign')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/dashboard" className="hover:text-brand-600 transition-colors inline-block py-0.5">
                                            {t('dashboard')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/about" className="hover:text-brand-600 transition-colors inline-block py-0.5">
                                            {t('aboutUs')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/contact" className="hover:text-brand-600 transition-colors inline-block py-0.5">
                                            {t('contactUs')}
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Legal & Language Column */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    {t('legal')}
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                                    <li>
                                        <Link href="/privacy" className="hover:text-brand-600 transition-colors inline-block py-0.5">
                                            {t('privacyPolicy')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/terms" className="hover:text-brand-600 transition-colors inline-block py-0.5">
                                            {t('termsOfService')}
                                        </Link>
                                    </li>
                                </ul>

                                {/* Minimal Segmented Language Switcher */}
                                <div className="pt-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                        {language === 'bn' ? 'ভাষা নির্বাচন' : 'Language'}
                                    </span>
                                    <div className="inline-flex rounded-full border border-slate-200/80 p-0.5 bg-slate-100 text-xs font-bold shadow-2xs">
                                        <button
                                            type="button"
                                            onClick={() => setLanguage('bn')}
                                            className={`px-3 py-1 rounded-full text-[11px] transition-all ${
                                                language === 'bn' 
                                                    ? 'bg-white shadow-2xs text-slate-900 font-black' 
                                                    : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                        >
                                            বাংলা
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setLanguage('en')}
                                            className={`px-3 py-1 rounded-full text-[11px] transition-all ${
                                                language === 'en' 
                                                    ? 'bg-white shadow-2xs text-slate-900 font-black' 
                                                    : 'text-slate-500 hover:text-slate-800'
                                            }`}
                                        >
                                            English
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar: Copyright & Craft Credit */}
                    <div className="pt-8 flex flex-row items-center justify-between text-xs text-slate-500">
                        <p className="break-words">
                            © {new Date().getFullYear()} {footerText}
                        </p>
                        
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                            <span>Crafted with</span>
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                            <span>for creators worldwide</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
