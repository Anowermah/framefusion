import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
    };

    return (
        <MainLayout>
            <Head title="Contact Us - FrameFusion" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
                <div className="text-center space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                        Get In Touch
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                        We'd Love to Hear From You
                    </h1>
                    <p className="text-sm text-gray-500 max-w-lg mx-auto">
                        Have inquiries, partnerships, or technical questions? Reach out to our team anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Contact Details */}
                    <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
                        <h3 className="text-base font-bold text-gray-900">Direct Contact</h3>

                        <div className="space-y-4 text-xs text-gray-600">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="font-bold text-gray-900 block">Email Us</span>
                                    <span>support@framefusion.io</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="font-bold text-gray-900 block">Location</span>
                                    <span>Dhaka, Bangladesh</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs">
                        {sent ? (
                            <div className="py-12 text-center space-y-3">
                                <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
                                <h3 className="text-lg font-bold text-gray-900">Message Received!</h3>
                                <p className="text-xs text-gray-500">Thank you for writing to us. Our team will respond shortly.</p>
                                <button
                                    onClick={() => setSent(false)}
                                    className="px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold"
                                >
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-bold text-gray-700">Your Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full p-2.5 rounded-xl border border-gray-200"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-gray-700">Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full p-2.5 rounded-xl border border-gray-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-gray-700">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-gray-200"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-gray-700">Message *</label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-gray-200"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Send Message</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

