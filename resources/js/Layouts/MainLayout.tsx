import React from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8F9FC] font-sans antialiased text-[#171923]">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}

