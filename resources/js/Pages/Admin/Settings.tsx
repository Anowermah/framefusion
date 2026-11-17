import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import AdminNav from '@/Components/AdminNav';
import { 
    Save, Check, Globe, Layout, Share2, 
    Sliders, Search, FileText, Sparkles, CheckCircle2 
} from 'lucide-react';

export default function AdminSettings({ settings }: { settings: Record<string, any> }) {
    const [formData, setFormData] = useState<Record<string, any>>({
        // Branding & General
        site_name: settings.site_name || 'FrameFusion',
        site_tagline: settings.site_tagline || 'Create. Customize. Celebrate.',
        site_logo: settings.site_logo || '',
        site_favicon: settings.site_favicon || '/favicon.ico',
        primary_color: settings.primary_color || '#635BFF',
        footer_text: settings.footer_text || 'FrameFusion. All rights reserved. High-Performance Campaign & Twibbon Platform.',

        // Hero & Homepage Banner
        hero_badge: settings.hero_badge || '✨ The #1 Campaign Frame Platform',
        hero_title: settings.hero_title || 'Create Stunning Campaign Frames in Seconds',
        hero_subtitle: settings.hero_subtitle || 'Support campaigns, celebrate occasions, and personalize custom photo frames effortlessly.',
        hero_cta_text: settings.hero_cta_text || 'Explore Frames',
        hero_secondary_cta_text: settings.hero_secondary_cta_text || 'Create Campaign',
        announcement_text: settings.announcement_text || '',
        announcement_enabled: !!settings.announcement_enabled,

        // Contact & Social
        contact_email: settings.contact_email || 'support@framefusion.io',
        contact_phone: settings.contact_phone || '+880 1700-000000',
        contact_address: settings.contact_address || 'Dhaka, Bangladesh',
        social_facebook: settings.social_facebook || 'https://facebook.com',
        social_twitter: settings.social_twitter || 'https://x.com',
        social_instagram: settings.social_instagram || 'https://instagram.com',
        social_youtube: settings.social_youtube || 'https://youtube.com',
        social_whatsapp: settings.social_whatsapp || '',

        // Feature Controls
        allow_guest_downloads: settings.allow_guest_downloads !== false,
        require_campaign_approval: !!settings.require_campaign_approval,
        google_login_enabled: settings.google_login_enabled !== false,
        maintenance_mode: !!settings.maintenance_mode,

        // Twibbonize & Advanced Campaign Engine
        enable_campaign_captions: settings.enable_campaign_captions !== false,
        default_campaign_hashtags: settings.default_campaign_hashtags || '#FrameFusion #Campaign #PhotoFrame',
        enable_qr_code_sharing: settings.enable_qr_code_sharing !== false,
        enable_watermark: !!settings.enable_watermark,
        watermark_text: settings.watermark_text || 'FrameFusion',
        watermark_position: settings.watermark_position || 'bottom_right',
        enable_external_action_links: settings.enable_external_action_links !== false,
        allow_multi_frame_campaigns: settings.allow_multi_frame_campaigns !== false,
        max_frames_per_campaign: settings.max_frames_per_campaign || 5,

        // SEO & Analytics
        meta_title: settings.meta_title || 'FrameFusion - Custom Photo Campaign & Twibbon Platform',
        meta_description: settings.meta_description || 'Create, customize, and celebrate visual photo campaigns and twibbons effortlessly.',
        meta_keywords: settings.meta_keywords || 'twibbon, photo frame, campaign, profile frame, photo editor',
        og_default_image: settings.og_default_image || '',
        twitter_handle: settings.twitter_handle || '@FrameFusion',
        google_site_verification: settings.google_site_verification || '',
        google_analytics_id: settings.google_analytics_id || '',
        custom_header_scripts: settings.custom_header_scripts || '',
        custom_footer_scripts: settings.custom_footer_scripts || '',

        // Page Contents
        page_about_content: settings.page_about_content || '',
        page_privacy_content: settings.page_privacy_content || '',
        page_terms_content: settings.page_terms_content || '',

        // AI Studio & Chatbot Controls
        ai_assistant_enabled: settings.ai_assistant_enabled !== false,
        ai_chat_widget_enabled: settings.ai_chat_widget_enabled !== false,
        ai_studio_page_enabled: settings.ai_studio_page_enabled !== false,
        ai_bot_name: settings.ai_bot_name || 'FrameFusion AI',
        ai_bot_name_bn: settings.ai_bot_name_bn || 'ফ্রেমফিউশন এআই',
        ai_welcome_message_bn: settings.ai_welcome_message_bn || 'স্বাগতম! আপনি কী ধরণের ফ্রেম তৈরি বা খুঁজতে চান? আমাকে জানান (যেমন: বিজয় দিবস, জন্মদিন, মাহফিল বা রাজনৈতিক পোস্টার)।',
        ai_welcome_message_en: settings.ai_welcome_message_en || 'Welcome! What kind of campaign frame are you looking for or creating? Tell me (e.g. Victory Day, Birthday, Notice Poster)!',
        ai_suggestions: settings.ai_suggestions || "বিজয় দিবসের ফ্রেম\nজন্মদিনের শুভেচ্ছা ফ্রেম\nমাহফিল নোটিশ পোস্টার\nসাধারণ ফ্রেম",
        gemini_api_key: settings.gemini_api_key || '',
        ai_auto_center_enabled: settings.ai_auto_center_enabled !== false,
    });

    const [activeTab, setActiveTab] = useState<'branding' | 'hero' | 'contact' | 'features' | 'ai' | 'seo' | 'pages'>('branding');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        router.post('/admin/settings', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setSaving(false);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            },
            onError: () => setSaving(false),
        });
    };

    const tabs = [
        { id: 'branding', label: 'Branding & Identity', icon: Globe },
        { id: 'hero', label: 'Hero & Announcement', icon: Layout },
        { id: 'contact', label: 'Contact & Socials', icon: Share2 },
        { id: 'features', label: 'Platform Controls', icon: Sliders },
        { id: 'ai', label: 'AI Studio & Chatbot', icon: Sparkles },
        { id: 'seo', label: 'SEO & Analytics', icon: Search },
        { id: 'pages', label: 'Static Pages Content', icon: FileText },
    ];

    return (
        <MainLayout>
            <Head title="Platform Control & Settings - Admin FrameFusion" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Platform Settings</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Configure system settings and branding options</p>
                    </div>

                    {saved && (
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Saved to database!</span>
                        </div>
                    )}
                </div>

                <AdminNav />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Settings Sidebar Tabs (Horizontal swipe on mobile, vertical sidebar on desktop) */}
                    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-1.5 sm:p-2 lg:p-2.5 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible scrollbar-none [-webkit-overflow-scrolling:touch]">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left shrink-0 active:scale-95 ${
                                        isActive 
                                            ? 'bg-slate-900 text-white shadow-xs font-bold' 
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                >
                                    <Icon className="w-3.5 h-3.5 shrink-0" />
                                    <span className="whitespace-nowrap">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Settings Form Body */}
                    <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-6 lg:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* TAB 1: Branding & Identity */}
                            {activeTab === 'branding' && (
                                <div className="space-y-5">
                                    <div className="border-b border-gray-100 pb-3">
                                        <h3 className="text-base font-bold text-gray-900">Brand Identity & Visuals</h3>
                                        <p className="text-xs text-gray-500">Configure name, logo, favicon, and brand color palette</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Platform Name</label>
                                            <input
                                                type="text"
                                                value={formData.site_name}
                                                onChange={e => handleChange('site_name', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                                placeholder="e.g. FrameFusion"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Brand Tagline</label>
                                            <input
                                                type="text"
                                                value={formData.site_tagline}
                                                onChange={e => handleChange('site_tagline', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                                placeholder="e.g. Create. Customize. Celebrate."
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Favicon URL / Path</label>
                                            <input
                                                type="text"
                                                value={formData.site_favicon}
                                                onChange={e => handleChange('site_favicon', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                                placeholder="/favicon.ico or full image URL"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Custom Logo Image URL (Optional)</label>
                                            <input
                                                type="text"
                                                value={formData.site_logo}
                                                onChange={e => handleChange('site_logo', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                                placeholder="Leave empty to use standard brand logo"
                                            />
                                        </div>

                                        <div className="space-y-1 md:col-span-2">
                                            <label className="font-bold text-gray-700">Primary Brand Accent Color</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={formData.primary_color}
                                                    onChange={e => handleChange('primary_color', e.target.value)}
                                                    className="w-10 h-10 rounded-xl cursor-pointer border-0"
                                                />
                                                <span className="font-mono text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                                                    {formData.primary_color}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-1 md:col-span-2">
                                            <label className="font-bold text-gray-700">Footer Copyright Text</label>
                                            <input
                                                type="text"
                                                value={formData.footer_text}
                                                onChange={e => handleChange('footer_text', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: Hero & Announcement Banner */}
                            {activeTab === 'hero' && (
                                <div className="space-y-5">
                                    <div className="border-b border-gray-100 pb-3">
                                        <h3 className="text-base font-bold text-gray-900">Hero Section & Site Banners</h3>
                                        <p className="text-xs text-gray-500">Control front-page marketing headlines, call-to-actions, and top alert bar</p>
                                    </div>

                                    {/* Announcement Bar Control */}
                                    <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-purple-900">Site-Wide Top Announcement Banner</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.announcement_enabled}
                                                    onChange={e => handleChange('announcement_enabled', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                            </label>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.announcement_text}
                                            onChange={e => handleChange('announcement_text', e.target.value)}
                                            placeholder="e.g. 🎉 Special Ramadan / Victory Day Campaign Frames are now live! Create yours today."
                                            className="w-full p-2.5 rounded-xl border border-purple-200 bg-white text-xs"
                                        />
                                    </div>

                                    <div className="space-y-4 text-xs">
                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Hero Badge Text</label>
                                            <input
                                                type="text"
                                                value={formData.hero_badge}
                                                onChange={e => handleChange('hero_badge', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Hero Main Title / Headline</label>
                                            <input
                                                type="text"
                                                value={formData.hero_title}
                                                onChange={e => handleChange('hero_title', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Hero Subtitle / Description</label>
                                            <textarea
                                                rows={2}
                                                value={formData.hero_subtitle}
                                                onChange={e => handleChange('hero_subtitle', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="font-bold text-gray-700">Primary Button Text</label>
                                                <input
                                                    type="text"
                                                    value={formData.hero_cta_text}
                                                    onChange={e => handleChange('hero_cta_text', e.target.value)}
                                                    className="w-full p-2.5 rounded-xl border border-gray-200"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="font-bold text-gray-700">Secondary Button Text</label>
                                                <input
                                                    type="text"
                                                    value={formData.hero_secondary_cta_text}
                                                    onChange={e => handleChange('hero_secondary_cta_text', e.target.value)}
                                                    className="w-full p-2.5 rounded-xl border border-gray-200"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: Contact & Social Media */}
                            {activeTab === 'contact' && (
                                <div className="space-y-5">
                                    <div className="border-b border-gray-100 pb-3">
                                        <h3 className="text-base font-bold text-gray-900">Contact & Social Links</h3>
                                        <p className="text-xs text-gray-500">Contact details shown in footer and contact page</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Support Email</label>
                                            <input
                                                type="email"
                                                value={formData.contact_email}
                                                onChange={e => handleChange('contact_email', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Phone Number</label>
                                            <input
                                                type="text"
                                                value={formData.contact_phone}
                                                onChange={e => handleChange('contact_phone', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                            />
                                        </div>

                                        <div className="space-y-1 md:col-span-2">
                                            <label className="font-bold text-gray-700">Office Location / Address</label>
                                            <input
                                                type="text"
                                                value={formData.contact_address}
                                                onChange={e => handleChange('contact_address', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Facebook Page URL</label>
                                            <input
                                                type="url"
                                                value={formData.social_facebook}
                                                onChange={e => handleChange('social_facebook', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                                placeholder="https://facebook.com/yourpage"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Twitter / X URL</label>
                                            <input
                                                type="url"
                                                value={formData.social_twitter}
                                                onChange={e => handleChange('social_twitter', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                                placeholder="https://x.com/yourhandle"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Instagram URL</label>
                                            <input
                                                type="url"
                                                value={formData.social_instagram}
                                                onChange={e => handleChange('social_instagram', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                                placeholder="https://instagram.com/yourprofile"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">YouTube URL</label>
                                            <input
                                                type="url"
                                                value={formData.social_youtube}
                                                onChange={e => handleChange('social_youtube', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                                placeholder="https://youtube.com/@channel"
                                            />
                                        </div>

                                        <div className="space-y-1 md:col-span-2">
                                            <label className="font-bold text-gray-700">WhatsApp Contact / Link</label>
                                            <input
                                                type="text"
                                                value={formData.social_whatsapp}
                                                onChange={e => handleChange('social_whatsapp', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                                placeholder="+8801700000000 or https://wa.me/..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: Platform Feature Controls */}
                            {activeTab === 'features' && (
                                <div className="space-y-5">
                                    <div className="border-b border-gray-100 pb-3">
                                        <h3 className="text-base font-bold text-gray-900">Operational & Feature Switches</h3>
                                        <p className="text-xs text-gray-500">Toggle community access, campaign approvals, and security rules</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200/70">
                                            <div>
                                                <span className="text-xs font-bold text-gray-900 block">Allow Guest Photo Downloads</span>
                                                <span className="text-[11px] text-gray-500">Supporters can personalize and download frames without registering an account</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.allow_guest_downloads}
                                                    onChange={e => handleChange('allow_guest_downloads', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200/70">
                                            <div>
                                                <span className="text-xs font-bold text-gray-900 block">Require Admin Campaign Approval</span>
                                                <span className="text-[11px] text-gray-500">When enabled, newly created user campaigns stay in 'Pending' until approved by admin</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.require_campaign_approval}
                                                    onChange={e => handleChange('require_campaign_approval', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200/70">
                                            <div>
                                                <span className="text-xs font-bold text-gray-900 block">Enable Google Social Login</span>
                                                <span className="text-[11px] text-gray-500">Show Google Sign-in on login and registration pages</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.google_login_enabled}
                                                    onChange={e => handleChange('google_login_enabled', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50/60 border border-red-100">
                                            <div>
                                                <span className="text-xs font-bold text-red-900 block">Site Maintenance Mode Notice</span>
                                                <span className="text-[11px] text-red-700">Display a scheduled maintenance notification to all visitors</span>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.maintenance_mode}
                                                    onChange={e => handleChange('maintenance_mode', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                                            </label>
                                        </div>

                                        {/* Twibbonize & Campaign Advanced Features Section */}
                                        <div className="pt-6 border-t border-gray-200/80">
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-violet-100 text-violet-800 rounded-md">
                                                        Twibbonize Suite
                                                    </span>
                                                    <h4 className="text-sm font-extrabold text-gray-900">Advanced Campaign & Sharing Controls</h4>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">Control smart captions, QR code generators, multi-frames, and attribution watermarking</p>
                                            </div>

                                            <div className="space-y-4">
                                                {/* Smart Captions */}
                                                <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50/50 to-indigo-50/50 border border-violet-100/80 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-900 block">Smart Captions & 1-Click Social Sharing</span>
                                                            <span className="text-[11px] text-gray-500">Allow campaign creators to provide default captions & hashtags for supporters to copy</span>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.enable_campaign_captions}
                                                                onChange={e => handleChange('enable_campaign_captions', e.target.checked)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                                        </label>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-[11px] font-bold text-gray-700">Default Global Hashtags</label>
                                                        <input
                                                            type="text"
                                                            value={formData.default_campaign_hashtags}
                                                            onChange={e => handleChange('default_campaign_hashtags', e.target.value)}
                                                            className="w-full p-2 rounded-xl border border-gray-200 text-xs bg-white"
                                                            placeholder="#FrameFusion #Campaign #ProfileFrame"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Instant QR Code Sharing */}
                                                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200/70">
                                                    <div>
                                                        <span className="text-xs font-bold text-gray-900 block">Instant QR Code Generator</span>
                                                        <span className="text-[11px] text-gray-500">Provide high-resolution scannable QR Code download on campaign pages for event posters</span>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.enable_qr_code_sharing}
                                                            onChange={e => handleChange('enable_qr_code_sharing', e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                                    </label>
                                                </div>

                                                {/* Multi-Frame Campaigns */}
                                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-900 block">Allow Multi-Frame Variations per Campaign</span>
                                                            <span className="text-[11px] text-gray-500">Enable creators to upload multiple frame variations (e.g. Speaker/Attendee, Male/Female)</span>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.allow_multi_frame_campaigns}
                                                                onChange={e => handleChange('allow_multi_frame_campaigns', e.target.checked)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                                        </label>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <label className="text-[11px] font-bold text-gray-700 whitespace-nowrap">Max Frames Allowed Per Campaign:</label>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            max={10}
                                                            value={formData.max_frames_per_campaign}
                                                            onChange={e => handleChange('max_frames_per_campaign', parseInt(e.target.value) || 1)}
                                                            className="w-24 p-1.5 rounded-xl border border-gray-200 text-xs bg-white text-center font-bold"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Attribution Watermark */}
                                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-900 block">Canvas Export Watermark</span>
                                                            <span className="text-[11px] text-gray-500">Stamp subtle branding watermark onto generated photos on download</span>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.enable_watermark}
                                                                onChange={e => handleChange('enable_watermark', e.target.checked)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                                        </label>
                                                    </div>

                                                    {formData.enable_watermark && (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                                            <div className="space-y-1">
                                                                <label className="text-[11px] font-bold text-gray-700">Watermark Text</label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.watermark_text}
                                                                    onChange={e => handleChange('watermark_text', e.target.value)}
                                                                    className="w-full p-2 rounded-xl border border-gray-200 text-xs bg-white"
                                                                    placeholder="FrameFusion"
                                                                />
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-[11px] font-bold text-gray-700">Watermark Position</label>
                                                                <select
                                                                    value={formData.watermark_position}
                                                                    onChange={e => handleChange('watermark_position', e.target.value)}
                                                                    className="w-full p-2 rounded-xl border border-gray-200 text-xs bg-white"
                                                                >
                                                                    <option value="bottom_right">Bottom Right Corner</option>
                                                                    <option value="bottom_left">Bottom Left Corner</option>
                                                                    <option value="top_right">Top Right Corner</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* External Action Links */}
                                                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200/70">
                                                    <div>
                                                        <span className="text-xs font-bold text-gray-900 block">External Action Links (Petition, Donation, RSVP)</span>
                                                        <span className="text-[11px] text-gray-500">Allow creators to attach an external donation or registration button to their campaigns</span>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.enable_external_action_links}
                                                            onChange={e => handleChange('enable_external_action_links', e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 5: SEO & Web Analytics */}
                            {activeTab === 'seo' && (
                                <div className="space-y-5">
                                    <div className="border-b border-gray-100 pb-3">
                                        <h3 className="text-base font-bold text-gray-900">SEO & Tracking Analytics</h3>
                                        <p className="text-xs text-gray-500">Search engine optimization meta tags and tracking scripts</p>
                                    </div>

                                    <div className="space-y-4 text-xs">
                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Default Meta Title</label>
                                            <input
                                                type="text"
                                                value={formData.meta_title}
                                                onChange={e => handleChange('meta_title', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Meta Description</label>
                                            <textarea
                                                rows={2}
                                                value={formData.meta_description}
                                                onChange={e => handleChange('meta_description', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Meta Keywords (comma separated)</label>
                                            <input
                                                type="text"
                                                value={formData.meta_keywords}
                                                onChange={e => handleChange('meta_keywords', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="font-bold text-gray-700">Default Share Banner / OG Image URL</label>
                                                <input
                                                    type="text"
                                                    value={formData.og_default_image}
                                                    onChange={e => handleChange('og_default_image', e.target.value)}
                                                    className="w-full p-2.5 rounded-xl border border-gray-200"
                                                    placeholder="https://... or /apple-touch-icon.png"
                                                />
                                                <span className="text-[10px] text-gray-400">Used as feature image when sharing homepage or static pages</span>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="font-bold text-gray-700">Twitter / X Handle</label>
                                                <input
                                                    type="text"
                                                    value={formData.twitter_handle}
                                                    onChange={e => handleChange('twitter_handle', e.target.value)}
                                                    className="w-full p-2.5 rounded-xl border border-gray-200"
                                                    placeholder="@FrameFusion"
                                                />
                                                <span className="text-[10px] text-gray-400">Used for twitter:site and twitter:creator tags</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Google Search Console Verification Token</label>
                                            <input
                                                type="text"
                                                value={formData.google_site_verification}
                                                onChange={e => handleChange('google_site_verification', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200 font-mono text-[11px]"
                                                placeholder="google-site-verification token or code"
                                            />
                                            <span className="text-[10px] text-gray-400">Pasted into &lt;meta name="google-site-verification"&gt;</span>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Google Analytics (GA4) Measurement ID</label>
                                            <input
                                                type="text"
                                                value={formData.google_analytics_id}
                                                onChange={e => handleChange('google_analytics_id', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200 font-mono"
                                                placeholder="G-XXXXXXXXXX"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Custom Header Scripts / HTML (&lt;head&gt;)</label>
                                            <textarea
                                                rows={3}
                                                value={formData.custom_header_scripts}
                                                onChange={e => handleChange('custom_header_scripts', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200 font-mono text-[11px]"
                                                placeholder="<!-- Custom verification tags, pixels, or fonts -->"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Custom Footer Scripts (&lt;/body&gt;)</label>
                                            <textarea
                                                rows={3}
                                                value={formData.custom_footer_scripts}
                                                onChange={e => handleChange('custom_footer_scripts', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200 font-mono text-[11px]"
                                                placeholder="<!-- Live chat widgets, tracking snippets, etc. -->"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: AI Studio & Chatbot Assistant */}
                            {activeTab === 'ai' && (
                                <div className="space-y-6 animate-in fade-in duration-200">
                                    <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-purple-600" />
                                                <span>AI Studio & Conversational Assistant Controls</span>
                                            </h3>
                                            <p className="text-xs text-gray-500">Configure AI chat widget, search suggestions, Gemini API, and auto-frame compositing</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block self-start sm:self-auto ${
                                            formData.ai_assistant_enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                        }`}>
                                            {formData.ai_assistant_enabled ? '● AI System Active' : '○ AI Disabled'}
                                        </span>
                                    </div>

                                    {/* Master Toggles Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Master Switch */}
                                        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col justify-between space-y-2">
                                            <div>
                                                <span className="text-xs font-bold text-purple-900 block">AI System Master Switch</span>
                                                <p className="text-[11px] text-purple-700 mt-0.5">Master toggle to enable or completely disable all AI features site-wide.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer pt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.ai_assistant_enabled}
                                                    onChange={e => handleChange('ai_assistant_enabled', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                <span className="ml-3 text-xs font-bold text-gray-700">
                                                    {formData.ai_assistant_enabled ? 'Enabled (চালু)' : 'Disabled (বন্ধ)'}
                                                </span>
                                            </label>
                                        </div>

                                        {/* Floating Chat Widget Switch */}
                                        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col justify-between space-y-2">
                                            <div>
                                                <span className="text-xs font-bold text-blue-900 block">Floating Chat Bubble</span>
                                                <p className="text-[11px] text-blue-700 mt-0.5">Show/hide floating interactive AI chat icon on all public pages.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer pt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.ai_chat_widget_enabled}
                                                    onChange={e => handleChange('ai_chat_widget_enabled', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                <span className="ml-3 text-xs font-bold text-gray-700">
                                                    {formData.ai_chat_widget_enabled ? 'Active (অন)' : 'Hidden (বন্ধ)'}
                                                </span>
                                            </label>
                                        </div>

                                        {/* Dedicated Page Switch */}
                                        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between space-y-2">
                                            <div>
                                                <span className="text-xs font-bold text-amber-900 block">Dedicated /ai-studio Page</span>
                                                <p className="text-[11px] text-amber-700 mt-0.5">Enable standalone full-screen conversational AI Studio route and nav link.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer pt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.ai_studio_page_enabled}
                                                    onChange={e => handleChange('ai_studio_page_enabled', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                                <span className="ml-3 text-xs font-bold text-gray-700">
                                                    {formData.ai_studio_page_enabled ? 'Accessible (অন)' : 'Disabled (বন্ধ)'}
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Bot Identity & Welcome Messages */}
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Assistant Identity & Messages</h4>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                            <div className="space-y-1">
                                                <label className="font-bold text-gray-700">AI Assistant Name (English)</label>
                                                <input
                                                    type="text"
                                                    value={formData.ai_bot_name}
                                                    onChange={e => handleChange('ai_bot_name', e.target.value)}
                                                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs"
                                                    placeholder="FrameFusion AI"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="font-bold text-gray-700">সহকারীর নাম (বাংলা)</label>
                                                <input
                                                    type="text"
                                                    value={formData.ai_bot_name_bn}
                                                    onChange={e => handleChange('ai_bot_name_bn', e.target.value)}
                                                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs"
                                                    placeholder="ফ্রেমফিউশন এআই"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                            <div className="space-y-1">
                                                <label className="font-bold text-gray-700">স্বাগতম বার্তা (বাংলা)</label>
                                                <textarea
                                                    rows={2}
                                                    value={formData.ai_welcome_message_bn}
                                                    onChange={e => handleChange('ai_welcome_message_bn', e.target.value)}
                                                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="font-bold text-gray-700">Welcome Message (English)</label>
                                                <textarea
                                                    rows={2}
                                                    value={formData.ai_welcome_message_en}
                                                    onChange={e => handleChange('ai_welcome_message_en', e.target.value)}
                                                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1 text-xs">
                                            <label className="font-bold text-gray-700">কুইক সার্চ সাজেশন (এক লাইনে একটি করে প্রম্পট লিখুন)</label>
                                            <textarea
                                                rows={4}
                                                value={formData.ai_suggestions}
                                                onChange={e => handleChange('ai_suggestions', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200 font-mono text-xs"
                                                placeholder="বিজয় দিবসের ফ্রেম&#10;জন্মদিনের শুভেচ্ছা ফ্রেম&#10;মাহফিল নোটিশ পোস্টার"
                                            />
                                            <p className="text-[11px] text-gray-400">এই সাজেশনগুলো চ্যাটবট ওপেন করলে ব্যবহারকারীর সামনে দ্রুত ক্লিকের জন্য ভেসে উঠবে।</p>
                                        </div>
                                    </div>

                                    {/* Gemini API Key & AI Engine Configuration */}
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Gemini API & Intelligent Processing</h4>

                                        <div className="space-y-1 text-xs">
                                            <label className="font-bold text-gray-700 flex items-center justify-between">
                                                <span>Google Gemini API Key (ঐচ্ছিক / Optional)</span>
                                                <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded">Auto Smart Fallback Built-in</span>
                                            </label>
                                            <input
                                                type="password"
                                                value={formData.gemini_api_key}
                                                onChange={e => handleChange('gemini_api_key', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200 font-mono text-xs"
                                                placeholder="AIzaSy..."
                                            />
                                            <p className="text-[11px] text-gray-500 leading-relaxed">
                                                💡 <strong>টিপস:</strong> আপনি যদি Gemini API Key ফাঁকা রাখেন, তবুও সিস্টেমটি স্বয়ংক্রিয়ভাবে আমাদের তৈরি করা হাই-স্পিড বাংলা ও ইংরেজি স্মার্ট অ্যালগরিদম ব্যবহার করে ১০০% ফ্রিতে ও নির্ভুলভাবে ফ্রেম অনুসন্ধান করবে।
                                            </p>
                                        </div>

                                        {/* Auto-Centering Switch */}
                                        <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                                            <div>
                                                <span className="text-xs font-bold text-gray-800 block">AI Auto-Center & Smart Fitting</span>
                                                <p className="text-[11px] text-gray-500">স্বয়ংক্রিয়ভাবে ব্যবহারকারীর আপলোড করা ছবি ফ্রেমের নির্দিষ্ট জায়গায় কেন্দ্রস্থ ও ফিট করে দেবে।</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.ai_auto_center_enabled}
                                                    onChange={e => handleChange('ai_auto_center_enabled', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 6: Static Pages Custom Content */}
                            {activeTab === 'pages' && (
                                <div className="space-y-5">
                                    <div className="border-b border-gray-100 pb-3">
                                        <h3 className="text-base font-bold text-gray-900">Custom Content for Static Pages</h3>
                                        <p className="text-xs text-gray-500">Override default content of About Us, Privacy Policy, and Terms of Service</p>
                                    </div>

                                    <div className="space-y-4 text-xs">
                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">About Us Page Custom Text</label>
                                            <textarea
                                                rows={4}
                                                value={formData.page_about_content}
                                                onChange={e => handleChange('page_about_content', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                                placeholder="Leave empty to use built-in About Us presentation layout."
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Privacy Policy Text</label>
                                            <textarea
                                                rows={5}
                                                value={formData.page_privacy_content}
                                                onChange={e => handleChange('page_privacy_content', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                                placeholder="Leave empty to use default standard privacy clauses."
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-gray-700">Terms of Service Text</label>
                                            <textarea
                                                rows={5}
                                                value={formData.page_terms_content}
                                                onChange={e => handleChange('page_terms_content', e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-gray-200"
                                                placeholder="Leave empty to use default standard service terms."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <span className="text-[11px] text-slate-400 text-center sm:text-left">Changes are saved directly in database settings.</span>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                    <span>{saved ? 'Saved Successfully!' : saving ? 'Saving...' : 'Save Settings'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
