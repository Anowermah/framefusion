import React from 'react';
import { usePage } from '@inertiajs/react';

interface LogoProps {
    className?: string;
    showTagline?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function ApplicationLogo({ className = '', showTagline = false, size = 'md' }: LogoProps) {
    const { platform_settings } = (usePage?.()?.props || {}) as any;
    const siteName = platform_settings?.site_name || 'FrameFusion';
    const siteTagline = platform_settings?.site_tagline || 'Create • Customize • Celebrate';
    const siteLogo = platform_settings?.site_logo;

    const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
    const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

    return (
        <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
            {siteLogo ? (
                <img src={siteLogo} alt={siteName} style={{ height: iconSize }} className="object-contain" />
            ) : (
                <div className="relative flex items-center justify-center">
                    <svg
                        width={iconSize}
                        height={iconSize}
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="drop-shadow-sm transition-transform hover:scale-105 duration-200"
                    >
                        <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#brandGrad)" />
                        <rect x="11" y="11" width="26" height="26" rx="8" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="6 3" />
                        <circle cx="24" cy="24" r="6" fill="#FFFFFF" />
                        <circle cx="34" cy="14" r="3" fill="#FF6B8A" />
                        <defs>
                            <linearGradient id="brandGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#635BFF" />
                                <stop offset="0.6" stopColor="#8B5CF6" />
                                <stop offset="1" stopColor="#FF6B8A" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            )}
            <div className="flex flex-col">
                <div className={`flex items-center leading-none ${textSize}`}>
                    {siteName === 'FrameFusion' ? (
                        <>
                            <span className="text-[#171923] dark:text-white font-extrabold tracking-tight">Frame</span>
                            <span className="text-brand-500 font-extrabold">Fusion</span>
                        </>
                    ) : (
                        <span className="text-[#171923] dark:text-white font-extrabold tracking-tight">{siteName}</span>
                    )}
                </div>
                {showTagline && (
                    <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase mt-0.5">
                        {siteTagline}
                    </span>
                )}
            </div>
        </div>
    );
}
