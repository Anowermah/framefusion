import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useLanguage } from '@/Context/LanguageContext';
import { 
    Home, Compass, Plus, Flame, User, 
    ShieldCheck, LayoutDashboard, Users, Layers, 
    Settings, LogOut, ChevronUp, Sparkles, Image,
    Bookmark, Globe, ArrowRight, X, ExternalLink
} from 'lucide-react';

export default function MobileBottomNav() {
    const { auth } = usePage().props as any;
    const { url } = usePage();
    const user = auth?.user;
    const { language, setLanguage, t } = useLanguage();
    const [sheetOpen, setSheetOpen] = useState(false);

    const isAdminRoute = url.startsWith('/admin');
    const isSuperAdmin = user?.role === 'super_admin';
    const isAdmin = ['admin', 'super_admin'].includes(user?.role);

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
                {/* Backdrop Blur Container */}
                <div className="relative bg-white/95 backdrop-blur-xl border-t border-gray-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-3 pt-2 pb-safe">
                    {/* Safe area padding helper */}
                    <div className="flex items-center justify-around h-15">
                        {isAdminRoute ? (
                            /* =================== ADMIN BOTTOM BAR =================== */
                            <>
                                <Link
                                    href="/admin"
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
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
                                    <span className="text-[10px] mt-1 tracking-tight">Overview</span>
                                </Link>

                                <Link
                                    href="/admin/users"
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
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
                                    <span className="text-[10px] mt-1 tracking-tight">Users</span>
                                </Link>

                                <Link
                                    href="/admin/campaigns"
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
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
                                    <span className="text-[10px] mt-1 tracking-tight">Campaigns</span>
                                </Link>

                                <Link
                                    href="/admin/settings"
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
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
                                    <span className="text-[10px] mt-1 tracking-tight">Settings</span>
                                </Link>

                                <Link
                                    href="/"
                                    className="flex flex-col items-center justify-center flex-1 py-1 text-gray-500 hover:text-brand-600 transition-all active:scale-90"
                                >
                                    <ExternalLink className="w-5 h-5 text-gray-400" />
                                    <span className="text-[10px] mt-1 tracking-tight">Public Site</span>
                                </Link>
                            </>
                        ) : (
                            /* =================== PUBLIC USER BOTTOM BAR =================== */
                            <>
                                {/* 1. Home Tab */}
                                <Link
                                    href="/"
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
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
                                    <span className="text-[10px] mt-1 tracking-tight">
                                        {language === 'bn' ? 'হোম' : 'Home'}
                                    </span>
                                </Link>

                                {/* 2. Explore Tab */}
                                <Link
                                    href="/explore"
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
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
                                    <span className="text-[10px] mt-1 tracking-tight">
                                        {language === 'bn' ? 'এক্সপ্লোর' : 'Explore'}
                                    </span>
                                </Link>

                                {/* 3. CENTER FLOATING ACTION BUTTON (Create Frame / Campaign) */}
                                <div className="flex-1 flex items-center justify-center -mt-6">
                                    <Link
                                        href={user ? "/campaigns/create" : "/login?redirect=/campaigns/create"}
                                        className="relative group flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-tr from-brand-600 via-brand-500 to-purple-600 text-white shadow-lg shadow-brand-500/40 ring-4 ring-white active:scale-90 transition-transform"
                                        title={t('createCampaign')}
                                    >
                                        <Plus className="w-6 h-6 stroke-[2.5]" />
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full ring-2 ring-white animate-pulse" />
                                    </Link>
                                </div>

                                {/* 4. Trending Tab */}
                                <Link
                                    href="/trending"
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
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
                                    <span className="text-[10px] mt-1 tracking-tight">
                                        {language === 'bn' ? 'ট্রেন্ডিং' : 'Trending'}
                                    </span>
                                </Link>

                                {/* 5. Account / Menu Tab (Triggers App Bottom Sheet) */}
                                <button
                                    onClick={() => setSheetOpen(true)}
                                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-90 ${
                                        sheetOpen ? 'text-brand-600 font-black' : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    <div className="relative">
                                        {user ? (
                                            <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-[10px] overflow-hidden border border-brand-300">
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
                                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-600 rounded-full ring-1 ring-white" />
                                        )}
                                    </div>
                                    <span className="text-[10px] mt-1 tracking-tight">
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
            {/* ============================================================== */}
            {sheetOpen && (
                <div className="md:hidden fixed inset-0 z-60 flex flex-col justify-end">
                    {/* Dark Blurred Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                        onClick={() => setSheetOpen(false)}
                    />

                    {/* Sliding Bottom Sheet Container */}
                    <div className="relative bg-white rounded-t-3xl shadow-2xl p-5 pt-3 z-10 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
                        {/* Pull Bar Handle */}
                        <div className="flex justify-center pb-3">
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                        </div>

                        {/* Sheet Header Close Button */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                                {language === 'bn' ? 'মেনু ও সেটিংস' : 'Menu & Navigation'}
                            </span>
                            <button
                                onClick={() => setSheetOpen(false)}
                                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* User Profile Card (if logged in) */}
                        {user ? (
                            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-brand-50/80 via-white to-purple-50/60 border border-brand-100/80 shadow-xs">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-purple-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-brand-500/20 overflow-hidden shrink-0">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-black text-gray-900 truncate">{user.name}</h4>
                                            {isSuperAdmin ? (
                                                <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-200 rounded-full shrink-0">
                                                    👑 Super Admin
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
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>{language === 'bn' ? 'অ্যাডমিন কন্ট্রোল প্যানেলে প্রবেশ করুন' : 'Open Admin Control Panel'}</span>
                                        <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                                    </Link>
                                )}
                            </div>
                        ) : (
                            /* Guest Auth Prompt Card */
                            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 text-white shadow-lg shadow-brand-500/25">
                                <h4 className="text-base font-black">
                                    {language === 'bn' ? 'ফ্রেমফিউশনে স্বাগতম! ✨' : 'Welcome to FrameFusion! ✨'}
                                </h4>
                                <p className="text-xs text-white/80 mt-1">
                                    {language === 'bn' 
                                        ? 'লগইন করে আপনার নিজস্ব ফ্রেম ক্যাম্পেইন তৈরি করুন ও পরিচালনা করুন।' 
                                        : 'Sign in to create, personalize, and share high-impact visual campaigns.'}
                                </p>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <Link
                                        href="/login"
                                        onClick={() => setSheetOpen(false)}
                                        className="py-2.5 px-4 rounded-xl bg-white text-brand-600 font-extrabold text-xs text-center shadow-xs active:scale-95 transition-transform"
                                    >
                                        {t('login')}
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setSheetOpen(false)}
                                        className="py-2.5 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs text-center border border-white/30 active:scale-95 transition-transform"
                                    >
                                        {t('register')}
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* App Quick Service Tiles (MyGP / bKash Style Grid) */}
                        <div className="mt-5">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2 px-1">
                                {language === 'bn' ? 'প্রধান সার্ভিস ও মেনু' : 'Quick Navigation'}
                            </span>
                            <div className="grid grid-cols-3 gap-2.5">
                                <Link
                                    href="/explore"
                                    onClick={() => setSheetOpen(false)}
                                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-brand-50/60 border border-gray-100 text-center transition-all active:scale-95"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-1.5 shadow-xs">
                                        <Compass className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-800">{t('explore')}</span>
                                </Link>

                                <Link
                                    href="/categories"
                                    onClick={() => setSheetOpen(false)}
                                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-brand-50/60 border border-gray-100 text-center transition-all active:scale-95"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1.5 shadow-xs">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-800">{t('categories')}</span>
                                </Link>

                                <Link
                                    href="/trending"
                                    onClick={() => setSheetOpen(false)}
                                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-brand-50/60 border border-gray-100 text-center transition-all active:scale-95"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-1.5 shadow-xs">
                                        <Flame className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-800">{t('trending')}</span>
                                </Link>

                                {user && (
                                    <>
                                        <Link
                                            href="/dashboard/campaigns"
                                            onClick={() => setSheetOpen(false)}
                                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-brand-50/60 border border-gray-100 text-center transition-all active:scale-95"
                                        >
                                            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5 shadow-xs">
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-800">{t('myCampaigns')}</span>
                                        </Link>

                                        <Link
                                            href="/dashboard/photos"
                                            onClick={() => setSheetOpen(false)}
                                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-brand-50/60 border border-gray-100 text-center transition-all active:scale-95"
                                        >
                                            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5 shadow-xs">
                                                <Image className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-800">{t('myPhotos')}</span>
                                        </Link>

                                        <Link
                                            href="/dashboard/saved"
                                            onClick={() => setSheetOpen(false)}
                                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-brand-50/60 border border-gray-100 text-center transition-all active:scale-95"
                                        >
                                            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-1.5 shadow-xs">
                                                <Bookmark className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-800">{t('saved')}</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* List Actions: Language, Profile, How it works, Logout */}
                        <div className="mt-5 space-y-1.5 pt-3 border-t border-gray-100">
                            {/* Language Switch Tile */}
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-800 block">ভাষা / Language</span>
                                        <span className="text-[10px] text-gray-500">
                                            {language === 'bn' ? 'বর্তমান: বাংলা' : 'Current: English'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center bg-gray-200/80 p-0.5 rounded-xl text-xs font-bold">
                                    <button
                                        onClick={() => setLanguage('bn')}
                                        className={`px-3 py-1.5 rounded-lg transition-all ${
                                            language === 'bn' ? 'bg-brand-500 text-white shadow-xs' : 'text-gray-700'
                                        }`}
                                    >
                                        বাং
                                    </button>
                                    <button
                                        onClick={() => setLanguage('en')}
                                        className={`px-3 py-1.5 rounded-lg transition-all ${
                                            language === 'en' ? 'bg-brand-500 text-white shadow-xs' : 'text-gray-700'
                                        }`}
                                    >
                                        EN
                                    </button>
                                </div>
                            </div>

                            <Link
                                href="/how-it-works"
                                onClick={() => setSheetOpen(false)}
                                className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-xs font-bold text-gray-700"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
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
                                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-xs font-bold text-gray-700"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
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
                                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-red-50 text-xs font-bold text-red-600 transition-colors"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
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
            )}
        </>
    );
}
