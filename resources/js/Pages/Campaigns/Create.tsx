import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CampaignWizard from '@/Components/CampaignWizard';
import { useLanguage } from '@/Context/LanguageContext';

interface CreateCampaignProps {
    categories: any[];
}

export default function Create({ categories }: CreateCampaignProps) {
    const { t } = useLanguage();

    return (
        <MainLayout>
            <Head title="Create New Campaign" />
            <div className="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 pb-28 sm:pb-12">
                <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                        Campaign Studio
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        {t('createCampaign')}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Launch your photo frame campaign in simple steps and mobilize your community
                    </p>
                </div>

                <CampaignWizard categories={categories} />
            </div>
        </MainLayout>
    );
}

