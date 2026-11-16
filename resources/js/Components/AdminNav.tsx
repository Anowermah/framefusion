import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, Users, Layers, Grid, 
    ShieldAlert, Settings, BarChart3, ExternalLink 
} from 'lucide-react';

export default function AdminNav() {
    const { url } = usePage();

    const links = [
        { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/campaigns', label: 'Campaigns', icon: Layers },
        { href: '/admin/categories', label: 'Categories', icon: Grid },
        { href: '/admin/reports', label: 'Reports', icon: ShieldAlert },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
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

                <Link
                    href="/"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-slate-100/80 transition-all shrink-0 ml-auto border border-dashed border-slate-200"
                    title="Return to Public Website"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="whitespace-nowrap text-[11px] font-medium hidden sm:inline">Public Site</span>
                </Link>
            </div>
        </div>
    );
}

