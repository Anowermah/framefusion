import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Terms() {
    return (
        <MainLayout>
            <Head title="Terms & Conditions" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
                <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                        Terms of Service
                    </span>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Terms & Conditions</h1>
                    <p className="text-xs text-gray-400">Effective Date: November 2026</p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-10 space-y-6 text-sm text-gray-600 leading-relaxed">
                    <section className="space-y-2">
                        <h2 className="text-base font-bold text-gray-900">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using FrameFusion, you agree to comply with and be bound by these terms. If you do not agree, please refrain from using our visual campaign platform.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-bold text-gray-900">2. Campaign Content & Copyright</h2>
                        <p>
                            Creators retain ownership of the frame designs they upload, but grant FrameFusion a worldwide license to host, display, and facilitate photo compositing for community supporters. You must not upload copyrighted images without appropriate authorization, or material that promotes hate speech, defamation, or illegal activities.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-base font-bold text-gray-900">3. Moderation & Termination</h2>
                        <p>
                            FrameFusion reserves the right to unpublish campaigns or suspend user accounts that violate our community guidelines or receive verified infringement reports.
                        </p>
                    </section>
                </div>
            </div>
        </MainLayout>
    );
}

