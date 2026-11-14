import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import DashboardNav from '@/Components/DashboardNav';
import CampaignCard from '@/Components/CampaignCard';
import { useLanguage } from '@/Context/LanguageContext';
import { Bookmark } from 'lucide-react';

export default function Saved({ savedCampaigns }: { savedCampaigns: any }) {
    const { t } = useLanguage();

    return (
        <MainLayout>
            <Head title="Saved Campaigns - FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{t('savedCampaigns')}</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Campaigns you bookmarked for later</p>
                </div>

                <DashboardNav />

                {savedCampaigns.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {savedCampaigns.data.map((sc: any) => (
                            <CampaignCard key={sc.id} campaign={{ ...sc.campaign, is_saved: true }} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-xs text-gray-400 space-y-3">
                        <Bookmark className="w-10 h-10 mx-auto text-gray-300" />
                        <p>No saved campaigns yet. Click the bookmark icon on any campaign to save it here!</p>
                        <Link href="/explore" className="inline-block px-4 py-2 bg-brand-500 text-white font-bold rounded-xl">
                            {t('exploreCampaigns')}
                        </Link>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

