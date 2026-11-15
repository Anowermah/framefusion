import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Terms({ customContent }: { customContent?: string }) {
    return (
        <MainLayout>
            <Head title="Terms of Service" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
                <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                        Legal Agreement
                    </span>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Terms of Service</h1>
                    <p className="text-xs text-gray-400">Last updated: November 2026</p>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-10 space-y-6 text-sm text-gray-600 leading-relaxed">
                    {customContent ? (
                        <div className="whitespace-pre-wrap leading-relaxed">{customContent}</div>
                    ) : (
                        <>
                            <section className="space-y-2">
                                <h2 className="text-base font-bold text-gray-900">1. Acceptance of Terms</h2>
                                <p>
                                    By accessing or using FrameFusion, you agree to be bound by these terms. If you disagree with any part of these terms, you may not access the service.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h2 className="text-base font-bold text-gray-900">2. Appropriate Content & Respect</h2>
                                <p>
                                    Campaign creators are solely responsible for the images, logos, and frame borders they upload. Hate speech, defamation, copyright infringement, adult material, or political misinformation will result in immediate campaign takedown and account suspension.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h2 className="text-base font-bold text-gray-900">3. Intellectual Property Rights</h2>
                                <p>
                                    You retain full ownership of the artwork and logos you upload. By publishing a campaign on FrameFusion, you grant platform users a non-exclusive license to personalize their profile photos with your frame border.
                                </p>
                            </section>
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
