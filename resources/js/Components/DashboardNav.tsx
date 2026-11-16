import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useLanguage } from '@/Context/LanguageContext';
import { LayoutDashboard, PlusCircle, Image, Bookmark, Settings } from 'lucide-react';

export default function DashboardNav() {
    const { url } = usePage();
    const { t } = useLanguage();

    const links = [
        { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard, exact: true },
        { href: '/dashboard/campaigns', label: t('myCampaigns'), icon: PlusCircle },
        { href: '/dashboard/photos', label: t('myPhotos'), icon: Image },
        { href: '/dashboard/saved', label: t('savedCampaigns'), icon: Bookmark },
        { href: '/profile', label: t('profileSettings'), icon: Settings },
    ];

    return (
        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs w-full max-w-full overflow-hidden">
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-0.5 text-xs font-semibold scroll-smooth [-webkit-overflow-scrolling:touch]">
                {links.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact ? url === item.href : url.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl transition-all shrink-0 active:scale-95 ${
                                isActive
                                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                            }`}
                        >
                            <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="whitespace-nowrap">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

