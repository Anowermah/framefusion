import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, Users, Layers, Grid, 
    ShieldAlert, Settings, BarChart3, ArrowLeft 
} from 'lucide-react';

export default function AdminNav() {
    const { url } = usePage();

    const links = [
        { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/campaigns', label: 'Campaigns', icon: Layers },
        { href: '/admin/categories', label: 'Categories', icon: Grid },
        { href: '/admin/reports', label: 'Reports & Moderation', icon: ShieldAlert },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
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
                        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all shrink-0 ${
                            isActive
                                ? 'bg-purple-600 text-white shadow-xs'
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

