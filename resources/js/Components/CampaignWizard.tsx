import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useLanguage } from '@/Context/LanguageContext';
import { 
    Layers, Image as ImageIcon, FileText, Sliders, 
    Eye, CheckCircle2, Upload, ArrowRight, ArrowLeft, 
    Sparkles, AlertCircle, Info 
} from 'lucide-react';

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
    const [campaignType, setCampaignType] = useState<'frame' | 'background'>('frame');
    const [frameFile, setFrameFile] = useState<File | null>(null);
    const [framePreviewUrl, setFramePreviewUrl] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [titleBn, setTitleBn] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionBn, setDescriptionBn] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>(categories[0]?.id || '');
    const [tags, setTags] = useState('');
    const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');

    // Photo Area Config
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '9:16'>('1:1');
    const [defaultZoom, setDefaultZoom] = useState(1);

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
        formData.append('visibility', visibility);
        formData.append('status', status);
        formData.append('aspect_ratio', aspectRatio);
        formData.append('default_zoom', String(defaultZoom));

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
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-card p-6 sm:p-10 space-y-8">
            {/* Step Wizard Progress Bar */}
            <div className="border-b border-gray-100 pb-6">
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
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all z-10 ${
                                        isCompleted
                                            ? 'bg-green-500 text-white'
                                            : isCurrent
                                            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 ring-4 ring-brand-100'
                                            : 'bg-gray-100 text-gray-400'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                </button>
                                <span className={`text-[11px] font-semibold mt-2 hidden sm:block ${isCurrent ? 'text-brand-600' : 'text-gray-400'}`}>
                                    {s.label}
                                </span>

                                {/* Connecting Line */}
                                {idx < stepsList.length - 1 && (
                                    <div 
                                        className={`absolute top-5 left-1/2 w-full h-[2px] -z-0 ${
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
                        <p className="text-xs text-gray-500 mt-1">Select how user photos will composite with your design</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                            onClick={() => setCampaignType('frame')}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                                campaignType === 'frame'
                                    ? 'border-brand-500 bg-brand-50/50 shadow-xs'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">{t('frameTwibbon')}</h3>
                            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                                {t('frameTwibbonDesc')}
                            </p>
                        </div>

                        <div
                            onClick={() => setCampaignType('background')}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                                campaignType === 'background'
                                    ? 'border-brand-500 bg-brand-50/50 shadow-xs'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">{t('backgroundTwibbon')}</h3>
                            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                                {t('backgroundTwibbonDesc')}
                            </p>
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

