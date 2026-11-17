import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useLanguage } from '@/Context/LanguageContext';
import { 
    Home, Compass, Plus, Flame, User, 
    ShieldCheck, LayoutDashboard, Users, Layers, 
    Settings, LogOut, Sparkles, Image,
    Bookmark, Globe, ArrowRight, X, ExternalLink
} from 'lucide-react';

export default function MobileBottomNav() {
    const { auth } = usePage().props as any;
    const { url } = usePage();
    const user = auth?.user;
    const { language, setLanguage, t } = useLanguage();
    const [sheetOpen, setSheetOpen] = useState(false);

    const isAdminRoute = url.startsWith('/admin');
    const isEditorRoute = url.includes('/editor');
    const isSuperAdmin = user?.role === 'super_admin';
    const isAdmin = ['admin', 'super_admin'].includes(user?.role);

    // Lock body scroll when bottom sheet is open
    useEffect(() => {
        if (sheetOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [sheetOpen]);

    // Do not show public/admin bottom nav bar in the Photo Studio editor
    if (isEditorRoute) {
        return null;
    }

    // Active link helper
    const isActive = (href: string, exact: boolean = false) => {
        if (exact) return url === href;
        return url.startsWith(href) && (href !== '/' || url === '/');
    };

    return (
        <>
            {/* ============================================================== */}
            {/* FLOATING APP-STYLE DOCKED BOTTOM NAVIGATION (bKash / MyGP Style) */}
            {/* ============================================================== */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-auto">
                {/* Backdrop Blur Container with Safe Area Support */}
                <div className="relative bg-white/95 backdrop-blur-xl border-t border-gray-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-1 sm:px-3 pt-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))]">
                    <div className="flex items-center justify-around h-13 sm:h-14">
                        {isAdminRoute ? (
                            /* =================== ADMIN BOTTOM BAR =================== */
                            <>
                                <Link
                                    href="/admin"
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 min-w-0 ${
                                        isActive('/admin', true)
                                            ? 'text-purple-600 font-black'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    <div className="relative">
                                        <LayoutDashboard className="w-5 h-5" />
                                        {isActive('/admin', true) && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full" />
                                        )}
                                    </div>
                                    <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full font-bold">
                                        Overview
                                    </span>
                                </Link>

                                <Link
                                    href="/admin/users"
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 min-w-0 ${
                                        isActive('/admin/users')
                                            ? 'text-purple-600 font-black'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    <div className="relative">
                                        <Users className="w-5 h-5" />
                                        {isActive('/admin/users') && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full" />
                                        )}
                                    </div>
                                    <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full font-bold">
                                        Users
                                    </span>
                                </Link>

                                <Link
                                    href="/admin/campaigns"
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 min-w-0 ${
                                        isActive('/admin/campaigns')
                                            ? 'text-purple-600 font-black'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    <div className="relative">
                                        <Layers className="w-5 h-5" />
                                        {isActive('/admin/campaigns') && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full" />
                                        )}
                                    </div>
                                    <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full font-bold">
                                        Campaigns
                                    </span>
                                </Link>

                                <Link
                                    href="/admin/settings"
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 min-w-0 ${
                                        isActive('/admin/settings')
                                            ? 'text-purple-600 font-black'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    <div className="relative">
                                        <Settings className="w-5 h-5" />
                                        {isActive('/admin/settings') && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-600 rounded-full" />
                                        )}
                                    </div>
                                    <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full font-bold">
                                        Settings
                                    </span>
                                </Link>

                                <Link
                                    href="/"
                                    className="flex flex-col items-center justify-center flex-1 py-1 text-gray-500 hover:text-brand-600 transition-all active:scale-90 min-w-0"
                                >
                                    <ExternalLink className="w-5 h-5 text-gray-400" />
                                    <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full font-bold">
                                        Site
                                    </span>
                                </Link>
                            </>
                        ) : (
                            /* =================== PUBLIC USER BOTTOM BAR =================== */
                            <>
                                {/* 1. Home Tab */}
                                <Link
                                    href="/"
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 min-w-0 ${
                                        isActive('/', true)
                                            ? 'text-brand-600 font-black'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    <div className="relative">
                                        <Home className="w-5 h-5" />
                                        {isActive('/', true) && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-500 rounded-full" />
                                        )}
                                    </div>
                                    <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full font-bold">
                                        {language === 'bn' ? 'হোম' : 'Home'}
                                    </span>
                                </Link>

                                {/* 2. Explore Tab */}
                                <Link
                                    href="/explore"
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 min-w-0 ${
                                        isActive('/explore')
                                            ? 'text-brand-600 font-black'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    <div className="relative">
                                        <Compass className="w-5 h-5" />
                                        {isActive('/explore') && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-500 rounded-full" />
                                        )}
                                    </div>
                                    <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full font-bold">
                                        {language === 'bn' ? 'এক্সপ্লোর' : 'Explore'}
                                    </span>
                                </Link>

                                {/* 3. CENTER FLOATING ACTION BUTTON (Create Frame / Campaign) */}
                                <div className="flex-1 flex items-center justify-center -mt-5 min-w-0 shrink-0">
                                    <Link
                                        href={user ? "/campaigns/create" : "/login?redirect=/campaigns/create"}
                                        className="relative group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-brand-600 via-brand-500 to-purple-600 text-white shadow-lg shadow-brand-500/35 ring-3 ring-white active:scale-90 transition-transform"
                                        title={t('createCampaign')}
                                    >
                                        <Plus className="w-5 h-5 stroke-[2.5]" />
                                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-white animate-pulse" />
                                    </Link>
                                </div>

                                {/* 4. Trending Tab */}
                                <Link
                                    href="/trending"
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 min-w-0 ${
                                        isActive('/trending')
                                            ? 'text-amber-600 font-black'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    <div className="relative">
                                        <Flame className="w-5 h-5" />
                                        {isActive('/trending') && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                        )}
                                    </div>
                                    <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full font-bold">
                                        {language === 'bn' ? 'ট্রেন্ডিং' : 'Trending'}
                                    </span>
                                </Link>

                                {/* 5. Account / Menu Tab (Triggers App Bottom Sheet) */}
                                <button
                                    type="button"
                                    onClick={() => setSheetOpen(true)}
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 min-w-0 ${
                                        sheetOpen ? 'text-brand-600 font-black' : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    <div className="relative">
                                        {user ? (
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-[10px] overflow-hidden border border-brand-300">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    user.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                        ) : (
                                            <User className="w-5 h-5" />
                                        )}
                                        {isAdmin && (
                                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-purple-600 rounded-full ring-1 ring-white" />
                                        )}
                                    </div>
                                    <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full font-bold">
                                        {user ? (language === 'bn' ? 'অ্যাকাউন্ট' : 'Account') : (language === 'bn' ? 'মেনু' : 'Menu')}
                                    </span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ============================================================== */}
            {/* NATIVE APP BOTTOM SHEET / DRAWER (bKash & Nagad Style Menu)   */}
            {/* High Z-Index z-[100] to sit cleanly ABOVE bottom navigation   */}
            {/* ============================================================== */}
            {sheetOpen && (
                <div className="md:hidden fixed inset-0 z-[100] flex flex-col justify-end">
                    {/* Dark Blurred Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                        onClick={() => setSheetOpen(false)}
                    />

                    {/* Sliding Bottom Sheet Container with Dedicated Header & Scroll Body */}
                    <div className="relative bg-white rounded-t-3xl shadow-2xl z-[102] max-h-[88vh] flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden">
                        
                        {/* Sticky Sheet Header: Drag handle & Title & Close button */}
                        <div className="p-4 pb-2.5 border-b border-gray-100 flex flex-col shrink-0 bg-white">
                            <div className="flex justify-center pb-2 cursor-pointer" onClick={() => setSheetOpen(false)}>
                                <div className="w-12 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                                    {language === 'bn' ? 'মেনু ও সেটিংস' : 'Menu & Navigation'}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSheetOpen(false)}
                                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
                                    title="Close Menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Sheet Content with Ample Bottom Safe Area Padding */}
                        <div className="overflow-y-auto overscroll-contain p-4 sm:p-5 pt-3 space-y-4 pb-14 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))]">
                            {/* User Profile Card (if logged in) */}
                            {user ? (
                                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-brand-50/80 via-white to-purple-50/60 border border-brand-100/80 shadow-xs">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-500 to-purple-600 text-white font-extrabold flex items-center justify-center text-base shadow-md shadow-brand-500/20 overflow-hidden shrink-0">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="text-sm font-black text-gray-900 truncate">{user.name}</h4>
                                                {isSuperAdmin ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-200 rounded-full shrink-0">
                                                        👑 Super
                                                    </span>
                                                ) : isAdmin ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-black bg-purple-100 text-purple-700 border border-purple-200 rounded-full shrink-0">
                                                        Admin
                                                    </span>
                                                ) : null}
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Admin Quick Switch Pill */}
                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setSheetOpen(false)}
                                            className="mt-3 w-full py-2.5 px-3 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-purple-600/30 active:scale-98 transition-transform"
                                        >
                                            <ShieldCheck className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{language === 'bn' ? 'অ্যাডমিন কন্ট্রোল প্যানেল' : 'Admin Control Panel'}</span>
                                            <ArrowRight className="w-3.5 h-3.5 ml-auto shrink-0" />
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                /* Guest Auth Prompt Card */
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 text-white shadow-lg shadow-brand-500/25">
                                    <h4 className="text-sm sm:text-base font-black">
                                        {language === 'bn' ? 'ফ্রেমফিউশনে স্বাগতম! ✨' : 'Welcome to FrameFusion! ✨'}
                                    </h4>
                                    <p className="text-xs text-white/80 mt-1 leading-relaxed">
                                        {language === 'bn' 
                                            ? 'লগইন করে আপনার নিজস্ব ফ্রেম ক্যাম্পেইন তৈরি করুন ও পরিচালনা করুন।' 
                                            : 'Sign in to create, personalize, and share high-impact visual campaigns.'}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 mt-3.5">
                                        <Link
                                            href="/login"
                                            onClick={() => setSheetOpen(false)}
                                            className="py-2.5 px-3 rounded-xl bg-white text-brand-600 font-extrabold text-xs text-center shadow-xs active:scale-95 transition-transform"
                                        >
                                            {t('login')}
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setSheetOpen(false)}
                                            className="py-2.5 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs text-center border border-white/30 active:scale-95 transition-transform"
                                        >
                                            {t('register')}
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* App Quick Service Tiles (MyGP / bKash Style Grid) */}
                            <div>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2 px-1">
                                    {language === 'bn' ? 'প্রধান সার্ভিস ও মেনু' : 'Quick Navigation'}
                                </span>
                                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                                    <Link
                                        href="/explore"
                                        onClick={() => setSheetOpen(false)}
                                        className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-gray-50 hover:bg-brand-50/60 border border-gray-100 text-center transition-all active:scale-95"
                                    >
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-1 shadow-xs">
                                            <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <span className="text-[11px] sm:text-xs font-bold text-gray-800 line-clamp-1">{t('explore')}</span>
                                    </Link>

                                    <Link
                                        href="/categories"
                                        onClick={() => setSheetOpen(false)}
                                        className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-gray-50 hover:bg-brand-50/60 border border-gray-100 text-center transition-all active:scale-95"
                                    >
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1 shadow-xs">
                                            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <span className="text-[11px] sm:text-xs font-bold text-gray-800 line-clamp-1">{t('categories')}</span>
                                    </Link>

                                    <Link
                                        href="/trending"
                                        onClick={() => setSheetOpen(false)}
                                        className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-gray-50 hover:bg-brand-50/60 border border-gray-100 text-center transition-all active:scale-95"
                                    >
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-1 shadow-xs">
                                            <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <span className="text-[11px] sm:text-xs font-bold text-gray-800 line-clamp-1">{t('trending')}</span>
                                    </Link>

                                    {user && (
                                        <>
                                            <Link
                                                href="/dashboard/campaigns"
                                                onClick={() => setSheetOpen(false)}
                                                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-gray-50 hover:bg-brand-50/60 border border-gray-100 text-center transition-all active:scale-95"
                                            >
                                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1 shadow-xs">
                                                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </div>
                                                <span className="text-[11px] sm:text-xs font-bold text-gray-800 line-clamp-1">{t('myCampaigns')}</span>
                                            </Link>

                                            <Link
                                                href="/dashboard/photos"
                                                onClick={() => setSheetOpen(false)}
                                                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-gray-50 hover:bg-brand-50/60 border border-gray-100 text-center transition-all active:scale-95"
                                            >
                                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-1 shadow-xs">
                                                    <Image className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </div>
                                                <span className="text-[11px] sm:text-xs font-bold text-gray-800 line-clamp-1">{t('myPhotos')}</span>
                                            </Link>

                                            <Link
                                                href="/dashboard/saved"
                                                onClick={() => setSheetOpen(false)}
                                                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-gray-50 hover:bg-brand-50/60 border border-gray-100 text-center transition-all active:scale-95"
                                            >
                                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-1 shadow-xs">
                                                    <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </div>
                                                <span className="text-[11px] sm:text-xs font-bold text-gray-800 line-clamp-1">{t('saved')}</span>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* List Actions: Language, Profile, How it works, Logout */}
                            <div className="space-y-1.5 pt-2 border-t border-gray-100">
                                {/* Language Switch Tile */}
                                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-800 block">ভাষা / Language</span>
                                            <span className="text-[10px] text-gray-500">
                                                {language === 'bn' ? 'বাংলা' : 'English'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-gray-200/80 p-0.5 rounded-full text-xs font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setLanguage('bn')}
                                            className={`px-3 py-1 rounded-full text-xs transition-all ${
                                                language === 'bn' ? 'bg-brand-500 text-white shadow-xs font-black' : 'text-gray-700'
                                            }`}
                                        >
                                            বাং
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setLanguage('en')}
                                            className={`px-3 py-1 rounded-full text-xs transition-all ${
                                                language === 'en' ? 'bg-brand-500 text-white shadow-xs font-black' : 'text-gray-700'
                                            }`}
                                        >
                                            EN
                                        </button>
                                    </div>
                                </div>

                                <Link
                                    href="/how-it-works"
                                    onClick={() => setSheetOpen(false)}
                                    className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <span>{t('howItWorks')}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                </Link>

                                {user && (
                                    <Link
                                        href="/profile"
                                        onClick={() => setSheetOpen(false)}
                                        className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                                                <Settings className="w-4 h-4" />
                                            </div>
                                            <span>{t('profileSettings')}</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                    </Link>
                                )}

                                {user && (
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        onClick={() => setSheetOpen(false)}
                                        className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-red-50 text-xs font-bold text-red-600 transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                                <LogOut className="w-4 h-4" />
                                            </div>
                                            <span>{t('logout')}</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-red-400" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
