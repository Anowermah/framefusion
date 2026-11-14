import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import DashboardNav from '@/Components/DashboardNav';
import { useLanguage } from '@/Context/LanguageContext';
import { Download, ArrowRight, Image as ImageIcon } from 'lucide-react';

export default function MyPhotos({ photos }: { photos: any }) {
    const { t } = useLanguage();

    return (
        <MainLayout>
            <Head title="My Generated Photos - FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{t('myPhotos')}</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Your generated photo download history and saved frames</p>
                </div>

                <DashboardNav />

                {photos.data.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {photos.data.map((item: any) => (
                            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden flex flex-col justify-between group">
                                <div className="aspect-square bg-gray-50 p-2 relative flex items-center justify-center">
                                    <img src={item.image_url} alt="Generated" className="w-full h-full object-contain" />
                                </div>
                                <div className="p-3 border-t border-gray-100 space-y-2">
                                    <h4 className="text-xs font-bold text-gray-900 truncate">{item.campaign?.title}</h4>
                                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                                        <span className="uppercase">{item.format} • {item.quality}</span>
                                        <Link
                                            href={`/campaigns/${item.campaign?.slug}/editor`}
                                            className="text-brand-600 font-bold hover:underline"
                                        >
                                            Edit Again
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-xs text-gray-400 space-y-3">
                        <ImageIcon className="w-10 h-10 mx-auto text-gray-300" />
                        <p>No photos generated yet. Choose a campaign to customize your profile frame!</p>
                        <Link href="/explore" className="inline-block px-4 py-2 bg-brand-500 text-white font-bold rounded-xl">
                            Explore Campaigns
                        </Link>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

