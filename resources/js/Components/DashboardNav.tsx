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
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200 text-xs font-bold scrollbar-none">
            {links.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact ? url === item.href : url.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
                            isActive
                                ? 'bg-brand-500 text-white shadow-xs'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}

