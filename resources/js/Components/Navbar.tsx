import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useLanguage } from '@/Context/LanguageContext';
import { 
    Search, Sparkles, Globe, Menu, X, User, 
    LayoutDashboard, Image, Bookmark, Settings, 
    ShieldCheck, LogOut, ChevronDown, Plus, Layers,
    Flame, Compass, HelpCircle
} from 'lucide-react';

interface NavbarProps {
    onSearchClick?: () => void;
}

export default function Navbar({ onSearchClick }: NavbarProps) {
    const { auth } = usePage().props as any;
    const { url } = usePage();
    const user = auth?.user;
    const { language, setLanguage, t } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const isSuperAdmin = user?.role === 'super_admin';
    const isAdmin = ['admin', 'super_admin'].includes(user?.role);

    // Active route helper
    const isLinkActive = (path: string) => {
        if (path === '/') return url === '/';
        return url.startsWith(path);
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Brand Logo & Desktop Nav */}
                    <div className="flex items-center gap-7">
                        <Link href="/" className="flex items-center active:scale-95 transition-transform shrink-0">
                            <ApplicationLogo size="md" />
                        </Link>

                        {/* Minimal Desktop Capsule Navigation */}
                        <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/50">
                            <Link 
                                href="/explore" 
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all ${
                                    isLinkActive('/explore') 
                                        ? 'bg-slate-900 text-white shadow-xs' 
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                                }`}
                            >
                                {t('explore')}
                            </Link>
                            <Link 
                                href="/categories" 
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all ${
                                    isLinkActive('/categories') 
                                        ? 'bg-slate-900 text-white shadow-xs' 
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                                }`}
                            >
                                {t('categories')}
                            </Link>
                            <Link 
                                href="/trending" 
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all ${
                                    isLinkActive('/trending') 
                                        ? 'bg-slate-900 text-white shadow-xs' 
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                                }`}
                            >
                                {t('trending')}
                            </Link>
                            <Link 
                                href="/how-it-works" 
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all ${
                                    isLinkActive('/how-it-works') 
                                        ? 'bg-slate-900 text-white shadow-xs' 
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                                }`}
                            >
                                {t('howItWorks')}
                            </Link>
                        </nav>
                    </div>

                    {/* Right Side Desktop Controls */}
                    <div className="hidden md:flex items-center gap-2.5">
                        {/* Minimalist Search Pill with ⌘K Keycap */}
                        <Link
                            href="/explore"
                            className="group flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60 text-xs text-slate-400 transition-all hover:border-slate-300"
                            title={t('searchPlaceholder')}
                        >
                            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition-colors" />
                            <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-800 transition-colors">
                                {language === 'bn' ? 'ফ্রেম খুঁজুন...' : 'Search frames...'}
                            </span>
                            <kbd className="text-[9px] font-mono font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                                ⌘K
                            </kbd>
                        </Link>

                        {/* Segmented 1-Click Language Switcher Pill */}
                        <div className="bg-slate-100/90 p-0.5 rounded-full flex items-center border border-slate-200/60 text-[11px] font-bold">
                            <button
                                onClick={() => setLanguage('bn')}
                                className={`px-2.5 py-1 rounded-full transition-all ${
                                    language === 'bn'
                                        ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                বাং
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-2.5 py-1 rounded-full transition-all ${
                                    language === 'en'
                                        ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                EN
                            </button>
                        </div>

                        {/* Ultra-Premium Create Campaign CTA */}
                        <Link
                            href={user ? "/campaigns/create" : "/login?redirect=/campaigns/create"}
                            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-extrabold text-white bg-linear-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-full shadow-sm shadow-violet-500/25 active:scale-95 transition-all"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                            <span>{t('createCampaign')}</span>
                        </Link>

                        {/* User Authentication state */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200/80 hover:border-violet-300 hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    <div className="w-7 h-7 rounded-full bg-linear-to-tr from-violet-500 to-indigo-600 text-white font-extrabold flex items-center justify-center text-xs overflow-hidden shadow-xs ring-2 ring-violet-100">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate">
                                        {user.name.split(' ')[0]}
                                    </span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {userDropdownOpen && (
                                    <div 
                                        className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                                        onClick={() => setUserDropdownOpen(false)}
                                    >
                                        {/* User Brief Card */}
                                        <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 mb-1">
                                            <p className="text-xs font-extrabold text-slate-900 truncate">{user.name}</p>
                                            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                                            {isSuperAdmin ? (
                                                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-200 rounded-full">
                                                    👑 Super Admin
                                                </span>
                                            ) : isAdmin ? (
                                                <span className="inline-block mt-1.5 px-2 py-0.5 text-[9px] font-black bg-purple-100 text-purple-700 rounded-full">
                                                    Admin
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="space-y-0.5 text-xs font-semibold">
                                            <Link
                                                href="/dashboard"
                                                className="flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-colors"
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                    <LayoutDashboard className="w-3.5 h-3.5" />
                                                </div>
                                                <span>{t('dashboard')}</span>
                                            </Link>
                                            <Link
                                                href="/dashboard/campaigns"
                                                className="flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-colors"
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                                    <Plus className="w-3.5 h-3.5" />
                                                </div>
                                                <span>{t('myCampaigns')}</span>
                                            </Link>
                                            <Link
                                                href="/dashboard/photos"
                                                className="flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-colors"
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <Image className="w-3.5 h-3.5" />
                                                </div>
                                                <span>{t('myPhotos')}</span>
                                            </Link>
                                            <Link
                                                href="/dashboard/saved"
                                                className="flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-colors"
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                                                    <Bookmark className="w-3.5 h-3.5" />
                                                </div>
                                                <span>{t('savedCampaigns')}</span>
                                            </Link>

                                            {isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    className="flex items-center gap-2.5 px-3 py-2 text-purple-700 font-bold bg-purple-50/70 hover:bg-purple-100 rounded-xl transition-colors"
                                                >
                                                    <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span>{t('adminPanel')}</span>
                                                </Link>
                                            )}

                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl transition-colors"
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                                                    <Settings className="w-3.5 h-3.5" />
                                                </div>
                                                <span>{t('profileSettings')}</span>
                                            </Link>
                                        </div>

                                        <div className="border-t border-slate-100 pt-1 mt-1">
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                                                    <LogOut className="w-3.5 h-3.5" />
                                                </div>
                                                <span>{t('logout')}</span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <Link
                                    href="/login"
                                    className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-violet-600 rounded-full hover:bg-slate-100 transition-colors"
                                >
                                    {t('login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-1.5 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-all"
                                >
                                    {t('register')}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile App Bar Controls (bKash/MyGP style) */}
                    <div className="flex md:hidden items-center gap-2">
                        {/* Quick Search */}
                        <Link
                            href="/explore"
                            className="p-1.5 text-slate-500 hover:text-violet-600 active:scale-90 transition-transform"
                            title={t('searchPlaceholder')}
                        >
                            <Search className="w-4 h-4" />
                        </Link>

                        {/* Segmented 1-Click Language Switcher Pill */}
                        <div className="bg-slate-100 p-0.5 rounded-full flex items-center border border-slate-200/60 text-[10px] font-bold">
                            <button
                                onClick={() => setLanguage('bn')}
                                className={`px-2 py-0.5 rounded-full transition-all ${
                                    language === 'bn' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-500'
                                }`}
                            >
                                বাং
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-2 py-0.5 rounded-full transition-all ${
                                    language === 'en' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-500'
                                }`}
                            >
                                EN
                            </button>
                        </div>

                        {/* Quick Avatar / Login */}
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="w-7 h-7 rounded-full bg-linear-to-tr from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden shadow-xs ring-2 ring-violet-100 active:scale-90 transition-transform"
                            >
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="px-3 py-1 text-xs font-bold text-white bg-linear-to-r from-violet-600 to-indigo-600 rounded-full shadow-xs active:scale-95 transition-all"
                            >
                                {t('login')}
                            </Link>
                        )}

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-1.5 text-slate-700 hover:text-violet-600 rounded-lg active:scale-90 transition-transform"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-xl">
                    <nav className="flex flex-col space-y-1 text-xs font-bold text-slate-800">
                        <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-xl hover:bg-slate-50 flex items-center gap-2">
                            <Compass className="w-4 h-4 text-violet-600" />
                            <span>{t('explore')}</span>
                        </Link>
                        <Link href="/categories" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-xl hover:bg-slate-50 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-purple-600" />
                            <span>{t('categories')}</span>
                        </Link>
                        <Link href="/trending" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-xl hover:bg-slate-50 flex items-center gap-2">
                            <Flame className="w-4 h-4 text-amber-500" />
                            <span>{t('trending')}</span>
                        </Link>
                        <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-xl hover:bg-slate-50 flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-blue-500" />
                            <span>{t('howItWorks')}</span>
                        </Link>
                        <Link 
                            href={user ? "/campaigns/create" : "/login?redirect=/campaigns/create"} 
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-2.5 px-3 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 text-white font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-violet-500/25"
                        >
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>{t('createCampaign')}</span>
                        </Link>
                    </nav>

                    <div className="pt-2 border-t border-slate-100">
                        {user ? (
                            <div className="space-y-1 text-xs font-semibold">
                                <div className="px-3 py-1 text-[11px] text-slate-400">
                                    Signed in as <strong className="text-slate-800">{user.name}</strong>
                                </div>
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl hover:bg-slate-50">{t('dashboard')}</Link>
                                <Link href="/dashboard/campaigns" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl hover:bg-slate-50">{t('myCampaigns')}</Link>
                                <Link href="/dashboard/photos" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl hover:bg-slate-50">{t('myPhotos')}</Link>
                                {isAdmin && (
                                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-xl text-purple-700 bg-purple-50 font-bold">{t('adminPanel')}</Link>
                                )}
                                <Link href="/logout" method="post" as="button" className="w-full text-left py-2 px-3 text-red-600 rounded-xl hover:bg-red-50 font-bold">
                                    {t('logout')}
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-2 text-center text-xs font-bold border border-slate-200 rounded-xl">
                                    {t('login')}
                                </Link>
                                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="py-2 text-center text-xs font-bold bg-slate-900 text-white rounded-xl">
                                    {t('register')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
