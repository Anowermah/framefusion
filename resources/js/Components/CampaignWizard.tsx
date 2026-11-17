import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useLanguage } from '@/Context/LanguageContext';
import { 
    Layers, Image as ImageIcon, FileText, Sliders, 
    Eye, CheckCircle2, Upload, ArrowRight, ArrowLeft, 
    Sparkles, AlertCircle, Info, Type, Gift, Award, Calendar
} from 'lucide-react';
import SlotConfigurator, { DEFAULT_SLOTS_CONFIG, SlotsConfig } from './SlotConfigurator';

interface CategoryItem {
    id: number;
    name: string;
    name_bn?: string;
    slug: string;
}

interface CampaignWizardProps {
    categories: CategoryItem[];
}

export default function CampaignWizard({ categories }: CampaignWizardProps) {
    const { language, t } = useLanguage();
    const [step, setStep] = useState(1);

    // Form State
    const [campaignType, setCampaignType] = useState<'frame' | 'custom_text' | 'event_notice' | 'greeting_card' | 'sticker_badge' | 'background'>('frame');
    const [frameFile, setFrameFile] = useState<File | null>(null);
    const [framePreviewUrl, setFramePreviewUrl] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [titleBn, setTitleBn] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionBn, setDescriptionBn] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>(categories[0]?.id || '');
    const [tags, setTags] = useState('');
    const [captionTemplate, setCaptionTemplate] = useState('');
    const [actionLinkUrl, setActionLinkUrl] = useState('');
    const [actionLinkText, setActionLinkText] = useState('');
    const [extraFrames, setExtraFrames] = useState<File[]>([]);
    const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');

    // Photo Area & Slots Config
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '9:16'>('1:1');
    const [defaultZoom, setDefaultZoom] = useState(1);
    const [slotsConfig, setSlotsConfig] = useState<SlotsConfig>(DEFAULT_SLOTS_CONFIG);

    // Submission & Errors
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Auto slug generator from title
    const handleTitleChange = (val: string) => {
        setTitle(val);
        const generatedSlug = val
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/[\s_-]+/g, '-');
        setSlug(generatedSlug);
    };

    // File Upload Handler
    const handleFrameFile = (file: File) => {
        if (!file.type.includes('png') && !file.type.includes('webp')) {
            alert('Please upload a transparent PNG or WebP file for best overlay results.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File exceeds 10MB limit.');
            return;
        }

        setFrameFile(file);
        const url = URL.createObjectURL(file);
        setFramePreviewUrl(url);
    };

    // Validation per step
    const canProceed = () => {
        if (step === 1) return true;
        if (step === 2) return !!frameFile;
        if (step === 3) return title.trim().length > 3 && slug.trim().length > 2 && !!categoryId;
        if (step === 4) return true;
        if (step === 5) return true;
        return true;
    };

    // Submit handler
    const handleSubmit = (status: 'published' | 'draft') => {
        if (!frameFile || !title || !slug) {
            alert('Please fill out all required fields.');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('campaign_type', campaignType);
        formData.append('frame_file', frameFile);
        formData.append('title', title);
        formData.append('title_bn', titleBn);
        formData.append('slug', slug);
        formData.append('description', description);
        formData.append('description_bn', descriptionBn);
        formData.append('category_id', String(categoryId));
        formData.append('tags', tags);
        formData.append('caption_template', captionTemplate);
        formData.append('action_link_url', actionLinkUrl);
        formData.append('action_link_text', actionLinkText);
        extraFrames.forEach(f => {
            formData.append('extra_frames[]', f);
        });
        formData.append('visibility', visibility);
        formData.append('status', status);
        formData.append('aspect_ratio', aspectRatio);
        formData.append('default_zoom', String(defaultZoom));
        if (campaignType === 'event_notice') {
            formData.append('slots_config', JSON.stringify(slotsConfig));
        }

        router.post('/campaigns', formData, {
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: (errs) => {
                setErrors(errs);
                setIsSubmitting(false);
            },
        });
    };

    const stepsList = [
        { num: 1, label: t('step1'), icon: Layers },
        { num: 2, label: t('step2'), icon: ImageIcon },
        { num: 3, label: t('step3'), icon: FileText },
        { num: 4, label: t('step4'), icon: Sliders },
        { num: 5, label: t('step5'), icon: Eye },
        { num: 6, label: t('step6'), icon: CheckCircle2 },
    ];

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-card p-3.5 sm:p-10 space-y-6 sm:space-y-8">
            {/* Step Wizard Progress Bar */}
            <div className="border-b border-gray-100 pb-5 sm:pb-6">
                <div className="flex items-center justify-between">
                    {stepsList.map((s, idx) => {
                        const Icon = s.icon;
                        const isCurrent = step === s.num;
                        const isCompleted = step > s.num;
                        return (
                            <div key={s.num} className="flex-1 flex flex-col items-center relative">
                                <button
                                    onClick={() => isCompleted && setStep(s.num)}
                                    disabled={!isCompleted && !isCurrent}
                                    className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all z-10 ${
                                        isCompleted
                                            ? 'bg-green-500 text-white'
                                            : isCurrent
                                            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 ring-2 sm:ring-4 ring-brand-100'
                                            : 'bg-gray-100 text-gray-400'
                                    }`}
                                >
                                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                                <span className={`text-[11px] font-semibold mt-2 hidden sm:block ${isCurrent ? 'text-brand-600' : 'text-gray-400'}`}>
                                    {s.label}
                                </span>

                                {/* Connecting Line */}
                                {idx < stepsList.length - 1 && (
                                    <div 
                                        className={`absolute top-3.5 sm:top-5 left-1/2 w-full h-[2px] -z-0 ${
                                            step > s.num ? 'bg-green-500' : 'bg-gray-100'
                                        }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* STEP 1: CAMPAIGN TYPE */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">{t('step1')}</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            {language === 'bn' 
                                ? 'আপনার ফ্রেমের ধরণ নির্বাচন করুন (সাধারণ ফ্রেম অথবা কাস্টম নাম/বার্তা যুক্ত অ্যাডভান্সড ফ্রেম)' 
                                : 'Select how supporters will interact and composite their photos with your design'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* 1. Classic Frame */}
                        <div
                            onClick={() => setCampaignType('frame')}
                            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                                campaignType === 'frame'
                                    ? 'border-brand-500 bg-brand-50/40 shadow-xs ring-2 ring-brand-100'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center mb-3 shadow-xs">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">{t('frameTwibbon')}</h3>
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                    {t('frameTwibbonDesc')}
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-brand-600">
                                <span>{language === 'bn' ? 'স্ট্যান্ডার্ড কাটআউট' : 'Standard Cutout'}</span>
                            </div>
                        </div>

                        {/* 2. Custom Text & Name Badge (Advanced) */}
                        <div
                            onClick={() => setCampaignType('custom_text')}
                            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                                campaignType === 'custom_text'
                                    ? 'border-violet-600 bg-violet-50/40 shadow-xs ring-2 ring-violet-100'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-violet-100 text-violet-700 border border-violet-200">
                                {language === 'bn' ? 'অ্যাডভান্সড' : 'Advanced'}
                            </span>
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center mb-3 shadow-xs">
                                    <Type className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">{t('customTextType')}</h3>
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                    {t('customTextTypeDesc')}
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-violet-600">
                                <span>{language === 'bn' ? 'ইন্টারেক্টিভ নাম ও টেক্সট' : 'Interactive Custom Text'}</span>
                            </div>
                        </div>

                        {/* 3. Event & Notice Poster (Juma'ar Khutbah, Mahfil, Seminars) */}
                        <div
                            onClick={() => setCampaignType('event_notice')}
                            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                                campaignType === 'event_notice'
                                    ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-2 ring-blue-100'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200">
                                {language === 'bn' ? 'পোস্টার ও খুতবা' : 'Event Poster'}
                            </span>
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-3 shadow-xs">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">{t('eventNoticeType')}</h3>
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                    {t('eventNoticeTypeDesc')}
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-blue-600">
                                <span>{language === 'bn' ? 'তারিখ, সময়, স্থান, নাম ও নোটিশ' : 'Date, Time, Venue, Name & Notice'}</span>
                            </div>
                        </div>

                        {/* 4. Greeting & Festival Card (Advanced) */}
                        <div
                            onClick={() => setCampaignType('greeting_card')}
                            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                                campaignType === 'greeting_card'
                                    ? 'border-rose-500 bg-rose-50/40 shadow-xs ring-2 ring-rose-100'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                                {language === 'bn' ? 'উৎসব ও কার্ড' : 'Festive'}
                            </span>
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mb-3 shadow-xs">
                                    <Gift className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">{t('greetingCardType')}</h3>
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                    {t('greetingCardTypeDesc')}
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-rose-600">
                                <span>{language === 'bn' ? 'শুভেচ্ছা বার্তা' : 'Wishes & Greeting'}</span>
                            </div>
                        </div>

                        {/* 4. Supporter Badge & Seal */}
                        <div
                            onClick={() => setCampaignType('sticker_badge')}
                            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                                campaignType === 'sticker_badge'
                                    ? 'border-emerald-500 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-100'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-3 shadow-xs">
                                    <Award className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">{t('stickerBadgeType')}</h3>
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                    {t('stickerBadgeTypeDesc')}
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-emerald-600">
                                <span>{language === 'bn' ? 'সিল ও ক্রেস্ট' : 'Seal & Badge'}</span>
                            </div>
                        </div>

                        {/* 5. Background Canvas */}
                        <div
                            onClick={() => setCampaignType('background')}
                            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                                campaignType === 'background'
                                    ? 'border-amber-500 bg-amber-50/40 shadow-xs ring-2 ring-amber-100'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mb-3 shadow-xs">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">{t('backgroundTwibbon')}</h3>
                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                    {t('backgroundTwibbonDesc')}
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-amber-600">
                                <span>{language === 'bn' ? 'ব্যাকড্রপ আর্টওয়ার্ক' : 'Backdrop Canvas'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: UPLOAD DESIGN */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">{t('step2')}</h2>
                        <p className="text-xs text-gray-500 mt-1">{t('uploadFrameHint')}</p>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center hover:border-brand-400 transition-colors bg-gray-50/50">
                        {framePreviewUrl ? (
                            <div className="space-y-4">
                                <div 
                                    className="max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden border border-gray-200 p-2 shadow-sm"
                                    style={{
                                        backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                                        backgroundSize: '16px 16px',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                >
                                    <img src={framePreviewUrl} alt="Frame Preview" className="w-full h-full object-contain" />
                                </div>
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 rounded-xl cursor-pointer">
                                    <Upload className="w-4 h-4" />
                                    <span>Change Frame File</span>
                                    <input
                                        type="file"
                                        accept="image/png,image/webp"
                                        className="hidden"
                                        onChange={(e) => e.target.files?.[0] && handleFrameFile(e.target.files[0])}
                                    />
                                </label>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center cursor-pointer py-8">
                                <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900">{t('uploadFrameTitle')}</h3>
                                <p className="text-xs text-gray-500 max-w-sm mt-1">{t('uploadFrameHint')}</p>
                                <span className="mt-4 px-5 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand-600">
                                    Browse Files
                                </span>
                                <input
                                    type="file"
                                    accept="image/png,image/webp"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && handleFrameFile(e.target.files[0])}
                                />
                            </label>
                        )}
                    </div>

                    {framePreviewUrl && (
                        <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <span className="text-xs font-bold text-slate-900 block">
                                        {language === 'bn' ? 'অতিরিক্ত ফ্রেম ভেরিয়েশন (ঐচ্ছিক)' : 'Add Extra Frame Variations (Optional)'}
                                    </span>
                                    <span className="text-[11px] text-slate-500">
                                        {language === 'bn' ? 'স্পিকার/অংশগ্রহণকারী বা বিভিন্ন রঙের বিকল্প যোগ করুন' : 'Provide variations like Male/Female, Speaker/Attendee, or colors'}
                                    </span>
                                </div>
                                <label className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs shrink-0">
                                    + Add Variation
                                    <input
                                        type="file"
                                        accept="image/png,image/webp"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                const newFiles = Array.from(e.target.files).slice(0, 4);
                                                setExtraFrames(prev => [...prev, ...newFiles].slice(0, 4));
                                            }
                                        }}
                                    />
                                </label>
                            </div>

                            {extraFrames.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap pt-1">
                                    {extraFrames.map((f, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-violet-200 text-xs font-medium text-slate-700 shadow-2xs">
                                            <span>Variation #{idx + 2}: {f.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => setExtraFrames(prev => prev.filter((_, i) => i !== idx))}
                                                className="text-red-500 hover:text-red-700 font-bold ml-1"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* STEP 3: CAMPAIGN DETAILS */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">{t('step3')}</h2>
                        <p className="text-xs text-gray-500 mt-1">Provide clear details to help people discover and support your cause</p>
                    </div>

                    <div className="space-y-4">
                        {/* Title (English) */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700">{t('titleLabel')} (English) *</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="e.g. 55th National Independence Day"
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                            />
                        </div>

                        {/* Title (Bengali) */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700">{t('titleLabel')} (বাংলা - ঐচ্ছিক)</label>
                            <input
                                type="text"
                                value={titleBn}
                                onChange={(e) => setTitleBn(e.target.value)}
                                placeholder="যেমন: মহান স্বাধীনতা দিবস ২০২৬"
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-bengali"
                            />
                        </div>

                        {/* Slug */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700">{t('slugLabel')} *</label>
                            <div className="flex items-center">
                                <span className="px-3 py-2.5 text-xs text-gray-500 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl select-none">
                                    /campaigns/
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="independence-day-2026"
                                    className="flex-1 px-4 py-2.5 text-sm rounded-r-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700">{t('categoryLabel')} *</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(Number(e.target.value))}
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                            >
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {language === 'bn' && c.name_bn ? c.name_bn : c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description (English) */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700">{t('descriptionLabel')} (English)</label>
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Tell supporters why they should join your campaign..."
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                            />
                        </div>

                        {/* Description (Bengali) */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700">{t('descriptionLabel')} (বাংলা - ঐচ্ছিক)</label>
                            <textarea
                                rows={3}
                                value={descriptionBn}
                                onChange={(e) => setDescriptionBn(e.target.value)}
                                placeholder="ক্যাম্পেইনের বার্তা লিখুন..."
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-bengali"
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700">{t('tagsLabel')}</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="independence, celebration, bangladesh"
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                            />
                        </div>

                        {/* Smart Caption & Auto-Hashtags Template (Twibbonize Feature) */}
                        <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100 space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-800 block">
                                    {language === 'bn' ? 'স্মার্ট সোশ্যাল ক্যাপশন ও হ্যাশট্যাগ (ঐচ্ছিক)' : 'Smart Social Caption Template (Optional)'}
                                </label>
                                <span className="text-[11px] text-slate-500 block">
                                    {language === 'bn' ? 'সমর্থকরা ফ্রেম ডাউনলোড করে ১-ক্লিকে এই ক্যাপশনটি সোশ্যাল মিডিয়ায় শেয়ার করতে পারবে' : 'Supporters can 1-click copy this preset caption & hashtags when sharing their photo'}
                                </span>
                                <textarea
                                    rows={2}
                                    value={captionTemplate}
                                    onChange={(e) => setCaptionTemplate(e.target.value)}
                                    placeholder={language === 'bn' ? 'যেমন: আমি এই ক্যাম্পেইনকে সমর্থন করছি! আপনার ছবি তৈরি করুন... #FrameFusion' : 'e.g. I support this campaign! Frame your photo at... #FrameFusion #Twibbon'}
                                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-violet-200 bg-white focus:ring-2 focus:ring-brand-500"
                                />
                            </div>

                            {/* External Action / Donation / RSVP Link */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-800">
                                        {language === 'bn' ? 'অ্যাকশন লিংক URL (ঐচ্ছিক)' : 'External Action Link URL (Optional)'}
                                    </label>
                                    <input
                                        type="url"
                                        value={actionLinkUrl}
                                        onChange={(e) => setActionLinkUrl(e.target.value)}
                                        placeholder="https://example.com/donate"
                                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-violet-200 bg-white"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-800">
                                        {language === 'bn' ? 'বাটন লেবেল' : 'Button Label'}
                                    </label>
                                    <input
                                        type="text"
                                        value={actionLinkText}
                                        onChange={(e) => setActionLinkText(e.target.value)}
                                        placeholder={language === 'bn' ? 'যেমন: অনুদান দিন / রেজিস্ট্রেশন' : 'e.g. Donate Now / Register'}
                                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-violet-200 bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: PLACEMENT SETTINGS */}
            {step === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">{t('step4')}</h2>
                        <p className="text-xs text-gray-500 mt-1">Configure default canvas proportions and initial photo zoom</p>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 block">{t('aspectRatio')}</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: '1:1', label: '1:1 Square (1080×1080)', desc: 'Best for avatars & profile pictures' },
                                    { id: '4:5', label: '4:5 Portrait (1080×1350)', desc: 'Optimized for Instagram & Facebook feeds' },
                                    { id: '9:16', label: '9:16 Story (1080×1920)', desc: 'Full screen story & TikTok' },
                                ].map((ratio) => (
                                    <button
                                        key={ratio.id}
                                        type="button"
                                        onClick={() => setAspectRatio(ratio.id as any)}
                                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                                            aspectRatio === ratio.id
                                                ? 'border-brand-500 bg-brand-50 text-brand-700'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                        }`}
                                    >
                                        <div className="font-bold text-sm">{ratio.label}</div>
                                        <div className="text-[11px] text-gray-500 mt-1">{ratio.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-700">
                                <span>Default Initial Zoom</span>
                                <span>{Math.round(defaultZoom * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={defaultZoom}
                                onChange={(e) => setDefaultZoom(parseFloat(e.target.value))}
                                className="w-full accent-brand-500"
                            />
                        </div>

                        {(campaignType === 'custom_text' || campaignType === 'greeting_card') && (
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100/80 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div className="text-xs">
                                    <span className="font-bold text-violet-900 block">
                                        {language === 'bn' ? 'অ্যাডভান্সড কাস্টম টেক্সট সক্রিয়' : 'Advanced Interactive Text Active'}
                                    </span>
                                    <span className="text-violet-700/80 mt-0.5 block leading-relaxed">
                                        {language === 'bn' 
                                            ? 'সাপোর্টাররা ফটো স্টুডিওতে তাদের নিজের নাম, পদবী, জেলা বা শুভেচ্ছা বার্তা লিখে ফ্রেমের সাথে অ্যাডজাস্ট করে ডাউনলোড করতে পারবেন।'
                                            : 'Supporters will be able to type and customize their own name, designation, district, or personal message directly on this frame.'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {campaignType === 'event_notice' && (
                            <div className="pt-6 border-t border-gray-100">
                                <SlotConfigurator
                                    frameUrl={framePreviewUrl || ''}
                                    config={slotsConfig}
                                    onChange={(newConf) => setSlotsConfig(newConf)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 5: PREVIEW */}
            {step === 5 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">{t('step5')}</h2>
                        <p className="text-xs text-gray-500 mt-1">Review your campaign frame before publishing to the community</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                        <div 
                            className="w-64 h-64 rounded-2xl overflow-hidden border-2 border-brand-200 relative p-2 shadow-lg"
                            style={{
                                backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                                backgroundSize: '16px 16px',
                                backgroundColor: '#F8FAFC',
                            }}
                        >
                            {framePreviewUrl && (
                                <img src={framePreviewUrl} alt="Frame" className="w-full h-full object-contain" />
                            )}
                        </div>

                        <div className="space-y-3 flex-1 text-sm">
                            <div>
                                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Title</span>
                                <h3 className="text-lg font-extrabold text-gray-900">{title}</h3>
                                {titleBn && <p className="text-sm text-gray-600 font-bengali">{titleBn}</p>}
                            </div>

                            <div>
                                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">URL</span>
                                <p className="text-xs text-brand-600 font-mono">/campaigns/{slug}</p>
                            </div>

                            {description && (
                                <div>
                                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Description</span>
                                    <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 6: PUBLISH */}
            {step === 6 && (
                <div className="space-y-6 text-center py-6 animate-in fade-in duration-200">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <Sparkles className="w-8 h-8" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Ready to Launch!</h2>
                        <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                            Your campaign is prepared. You can publish it immediately to make it live for the world or save as draft.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto pt-4">
                        <button
                            type="button"
                            onClick={() => handleSubmit('published')}
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-6 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-md shadow-brand-500/25 active:scale-95 transition-all text-xs"
                        >
                            {isSubmitting ? 'Publishing...' : t('publishButton')}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSubmit('draft')}
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all text-xs"
                        >
                            {t('saveDraftButton')}
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Wizard Navigation Buttons */}
            <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
                {step > 1 ? (
                    <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Previous</span>
                    </button>
                ) : <div />}

                {step < 6 && (
                    <button
                        type="button"
                        onClick={() => setStep(step + 1)}
                        disabled={!canProceed()}
                        className={`flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all ${
                            canProceed()
                                ? 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/25 active:scale-95'
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        <span>Next Step</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

