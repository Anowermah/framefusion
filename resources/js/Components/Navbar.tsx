import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useLanguage } from '@/Context/LanguageContext';
import { 
    Search, PlusCircle, Globe, Menu, X, User, 
    LayoutDashboard, Image, Bookmark, Settings, 
    ShieldCheck, LogOut, ChevronDown 
} from 'lucide-react';

interface NavbarProps {
    onSearchClick?: () => void;
}

export default function Navbar({ onSearchClick }: NavbarProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const { language, setLanguage, t } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-15 sm:h-18">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center active:scale-95 transition-transform">
                            <ApplicationLogo size="md" />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
                            <Link 
                                href="/explore" 
                                className="transition-colors hover:text-brand-500 py-1"
                            >
                                {t('explore')}
                            </Link>
                            <Link 
                                href="/categories" 
                                className="transition-colors hover:text-brand-500 py-1"
                            >
                                {t('categories')}
                            </Link>
                            <Link 
                                href="/trending" 
                                className="transition-colors hover:text-brand-500 py-1"
                            >
                                {t('trending')}
                            </Link>
                            <Link 
                                href="/how-it-works" 
                                className="transition-colors hover:text-brand-500 py-1"
                            >
                                {t('howItWorks')}
                            </Link>
                        </nav>
                    </div>

                    {/* Right side controls */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Search button / trigger */}
                        <Link
                            href="/explore"
                            className="p-2 text-gray-500 hover:text-brand-500 hover:bg-gray-50 rounded-full transition-colors"
                            title={t('searchPlaceholder')}
                        >
                            <Search className="w-5 h-5" />
                        </Link>

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors"
                            >
                                <Globe className="w-3.5 h-3.5 text-brand-500" />
                                <span>{language === 'en' ? 'EN' : 'বাং'}</span>
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                            </button>

                            {langDropdownOpen && (
                                <div 
                                    className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                                    onClick={() => setLangDropdownOpen(false)}
                                >
                                    <button
                                        onClick={() => setLanguage('en')}
                                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between ${
                                            language === 'en' ? 'bg-brand-50 font-bold text-brand-600' : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>English</span>
                                        <span className="text-[10px] text-gray-400">EN</span>
                                    </button>
                                    <button
                                        onClick={() => setLanguage('bn')}
                                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between font-bengali ${
                                            language === 'bn' ? 'bg-brand-50 font-bold text-brand-600' : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>বাংলা</span>
                                        <span className="text-[10px] text-gray-400">BN</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Create Campaign CTA Button */}
                        <Link
                            href={user ? "/campaigns/create" : "/login?redirect=/campaigns/create"}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-xs transition-all hover:shadow-brand-500/25 active:scale-95"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>{t('createCampaign')}</span>
                        </Link>

                        {/* User Authentication state */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-gray-200 hover:border-brand-300 hover:bg-gray-50 transition-all"
                                >
                                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 font-bold flex items-center justify-center text-xs overflow-hidden">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span className="text-xs font-semibold text-gray-800 max-w-[100px] truncate">
                                        {user.name.split(' ')[0]}
                                    </span>
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                </button>

                                {userDropdownOpen && (
                                    <div 
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                                        onClick={() => setUserDropdownOpen(false)}
                                    >
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                                            {user.role === 'super_admin' ? (
                                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 rounded-full">
                                                    👑 Super Admin
                                                </span>
                                            ) : user.role === 'admin' ? (
                                                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 rounded-full">
                                                    Admin
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/dashboard"
                                                className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-brand-600"
                                            >
                                                <LayoutDashboard className="w-4 h-4 text-gray-400" />
                                                <span>{t('dashboard')}</span>
                                            </Link>
                                            <Link
                                                href="/dashboard/campaigns"
                                                className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-brand-600"
                                            >
                                                <PlusCircle className="w-4 h-4 text-gray-400" />
                                                <span>{t('myCampaigns')}</span>
                                            </Link>
                                            <Link
                                                href="/dashboard/photos"
                                                className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-brand-600"
                                            >
                                                <Image className="w-4 h-4 text-gray-400" />
                                                <span>{t('myPhotos')}</span>
                                            </Link>
                                            <Link
                                                href="/dashboard/saved"
                                                className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-brand-600"
                                            >
                                                <Bookmark className="w-4 h-4 text-gray-400" />
                                                <span>{t('savedCampaigns')}</span>
                                            </Link>

                                            {['admin', 'super_admin'].includes(user.role) && (
                                                <Link
                                                    href="/admin"
                                                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-purple-700 font-semibold bg-purple-50/60 hover:bg-purple-100"
                                                >
                                                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                                                    <span>{t('adminPanel')}</span>
                                                </Link>
                                            )}

                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-brand-600"
                                            >
                                                <Settings className="w-4 h-4 text-gray-400" />
                                                <span>{t('profileSettings')}</span>
                                            </Link>
                                        </div>

                                        <div className="border-t border-gray-100 pt-1">
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="w-4 h-4 text-red-400" />
                                                <span>{t('logout')}</span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-3.5 py-2 text-sm font-semibold text-gray-700 hover:text-brand-600 transition-colors"
                                >
                                    {t('login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-all"
                                >
                                    {t('register')}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile App Bar Controls (bKash/MyGP style) */}
                    <div className="flex md:hidden items-center gap-1.5">
                        {/* Quick Search */}
                        <Link
                            href="/explore"
                            className="p-2 text-gray-500 hover:text-brand-500 active:scale-90 transition-transform"
                            title={t('searchPlaceholder')}
                        >
                            <Search className="w-5 h-5" />
                        </Link>

                        {/* Mobile Language Pill */}
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                            className="px-2.5 py-1 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 rounded-full transition-all border border-gray-200/60"
                        >
                            {language === 'en' ? 'বাং' : 'EN'}
                        </button>

                        {/* Quick Profile Avatar or Menu Button */}
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="w-8 h-8 rounded-full bg-linear-to-tr from-brand-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden shadow-xs ring-2 ring-brand-100 active:scale-90 transition-transform ml-1"
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
                                className="px-3 py-1 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-xs active:scale-95 transition-all ml-1"
                            >
                                {t('login')}
                            </Link>
                        )}

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-1.5 text-gray-700 hover:text-brand-500 rounded-lg active:scale-90 transition-transform ml-0.5"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
                    <nav className="flex flex-col space-y-2 text-sm font-medium text-gray-800">
                        <Link href="/explore" className="py-2 px-3 rounded-lg hover:bg-gray-50">{t('explore')}</Link>
                        <Link href="/categories" className="py-2 px-3 rounded-lg hover:bg-gray-50">{t('categories')}</Link>
                        <Link href="/trending" className="py-2 px-3 rounded-lg hover:bg-gray-50">{t('trending')}</Link>
                        <Link href="/how-it-works" className="py-2 px-3 rounded-lg hover:bg-gray-50">{t('howItWorks')}</Link>
                        <Link 
                            href={user ? "/campaigns/create" : "/login?redirect=/campaigns/create"} 
                            className="py-2.5 px-3 rounded-xl bg-brand-500 text-white font-semibold flex items-center justify-center gap-2"
                        >
                            <PlusCircle className="w-4 h-4" />
                            {t('createCampaign')}
                        </Link>
                    </nav>

                    <div className="pt-3 border-t border-gray-100">
                        {user ? (
                            <div className="space-y-2">
                                <div className="px-3 py-1 text-xs text-gray-500">
                                    Signed in as <span className="font-bold text-gray-800">{user.name}</span>
                                </div>
                                <Link href="/dashboard" className="block py-2 px-3 text-sm rounded-lg hover:bg-gray-50">{t('dashboard')}</Link>
                                <Link href="/dashboard/campaigns" className="block py-2 px-3 text-sm rounded-lg hover:bg-gray-50">{t('myCampaigns')}</Link>
                                <Link href="/dashboard/photos" className="block py-2 px-3 text-sm rounded-lg hover:bg-gray-50">{t('myPhotos')}</Link>
                                {['admin', 'super_admin'].includes(user.role) && (
                                    <Link href="/admin" className="block py-2 px-3 text-sm rounded-lg text-purple-600 bg-purple-50 font-bold">{t('adminPanel')}</Link>
                                )}
                                <Link href="/logout" method="post" as="button" className="w-full text-left py-2 px-3 text-sm text-red-600 rounded-lg hover:bg-red-50">
                                    {t('logout')}
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Link href="/login" className="py-2 text-center text-sm font-semibold border border-gray-200 rounded-xl">
                                    {t('login')}
                                </Link>
                                <Link href="/register" className="py-2 text-center text-sm font-semibold bg-brand-500 text-white rounded-xl">
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

