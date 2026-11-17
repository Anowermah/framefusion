import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import MobileBottomNav from '@/Components/MobileBottomNav';
import AiChatWidget from '@/Components/AiChatWidget';
import { Megaphone, X } from 'lucide-react';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { platform_settings } = usePage().props as any;
    const { url } = usePage();
    const [bannerDismissed, setBannerDismissed] = useState(false);

    const hasAnnouncement = platform_settings?.announcement_enabled && platform_settings?.announcement_text && !bannerDismissed;
    const isAiStudioPage = url.startsWith('/ai-studio');
    const isEditorPage = url.includes('/editor');

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F9FC] font-sans antialiased text-[#171923] w-full max-w-full min-w-0">
            {/* Sticky Top Header (Pinned at top on mobile and desktop) */}
            <div className="sticky top-0 z-40 w-full shrink-0">
                {hasAnnouncement && (
                    <aside 
                        aria-label="Announcement"
                        className="bg-gradient-to-r from-purple-700 via-brand-600 to-indigo-700 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between shadow-xs"
                    >
                        <div className="flex-1 flex items-center justify-center gap-2 text-center">
                            <Megaphone className="w-3.5 h-3.5 animate-bounce shrink-0 text-amber-300" />
                            <span>{platform_settings.announcement_text}</span>
                        </div>
                        <button
                            onClick={() => setBannerDismissed(true)}
                            className="p-1 hover:bg-white/20 rounded-md transition-colors shrink-0 ml-2"
                            title="Dismiss announcement"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </aside>
                )}

                <Navbar />
            </div>

            <main className="flex-1 w-full max-w-full min-w-0">
                {children}
            </main>
            <Footer />
            <MobileBottomNav />
            {!isAiStudioPage && !isEditorPage && <AiChatWidget />}
        </div>
    );
}
