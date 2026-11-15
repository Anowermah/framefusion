import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useLanguage } from '@/Context/LanguageContext';
import { 
    Layers, Image as ImageIcon, FileText, Sliders, 
    Upload, ArrowLeft, CheckCircle2, AlertCircle, Save 
} from 'lucide-react';

interface CategoryItem {
    id: number;
    name: string;
    name_bn?: string;
    slug: string;
}

interface CampaignEditProps {
    campaign: {
        id: number;
        title: string;
        title_bn?: string;
        slug: string;
        category_id: number;
        description?: string;
        description_bn?: string;
        frame_url: string;
        thumbnail_url?: string;
        campaign_type?: string;
        visibility: 'public' | 'unlisted' | 'private';
        status: 'published' | 'draft';
        tags?: string;
        primary_frame?: {
            aspect_ratio?: string;
            photo_area_config?: {
                zoom?: number;
            };
        };
    };
    categories: CategoryItem[];
}

export default function Edit({ campaign, categories }: CampaignEditProps) {
    const { language, t } = useLanguage();
    const { errors: serverErrors } = usePage().props as any;

    // Form State
    const [title, setTitle] = useState(campaign.title || '');
    const [titleBn, setTitleBn] = useState(campaign.title_bn || '');
    const [slug, setSlug] = useState(campaign.slug || '');
    const [categoryId, setCategoryId] = useState<number>(campaign.category_id || categories[0]?.id || 1);
    const [description, setDescription] = useState(campaign.description || '');
    const [descriptionBn, setDescriptionBn] = useState(campaign.description_bn || '');
    const [tags, setTags] = useState(campaign.tags || '');
    const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>(campaign.visibility || 'public');
    const [status, setStatus] = useState<'published' | 'draft'>(campaign.status || 'published');
    const [campaignType, setCampaignType] = useState<string>(campaign.campaign_type || 'frame');
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '9:16'>(
        (campaign.primary_frame?.aspect_ratio as any) || '1:1'
    );
    const [defaultZoom, setDefaultZoom] = useState<number>(
        campaign.primary_frame?.photo_area_config?.zoom || 1
    );

    // Frame replacement file
    const [frameFile, setFrameFile] = useState<File | null>(null);
    const initialFrame = campaign.frame_url ? (campaign.frame_url.startsWith('http') || campaign.frame_url.startsWith('/') ? campaign.frame_url : '/' + campaign.frame_url) : '';
    const [previewUrl, setPreviewUrl] = useState<string>(initialFrame);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFrameChange = (file: File) => {
        if (!file.type.includes('png') && !file.type.includes('webp')) {
            alert('Please upload a transparent PNG or WebP image.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('File exceeds 10MB limit.');
            return;
        }

        setFrameFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const formData = new FormData();
        formData.append('title', title);
        formData.append('title_bn', titleBn);
        formData.append('slug', slug);
        formData.append('category_id', String(categoryId));
        formData.append('campaign_type', campaignType);
        formData.append('description', description);
        formData.append('description_bn', descriptionBn);
        formData.append('tags', tags);
        formData.append('visibility', visibility);
        formData.append('status', status);
        formData.append('aspect_ratio', aspectRatio);
        formData.append('default_zoom', String(defaultZoom));

        if (frameFile) {
            formData.append('frame_file', frameFile);
        }

        router.post(`/campaigns/${campaign.id}`, formData, {
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: (errs) => {
                setErrors(errs);
                setIsSubmitting(false);
            },
        });
    };

    return (
        <MainLayout>
            <Head title={`Edit Campaign | ${campaign.title}`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
                {/* Header with Back button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/campaigns/${campaign.slug}`}
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                            title="Back to Campaign"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                                Edit Campaign
                            </span>
                            <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">
                                {campaign.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/campaigns/${campaign.slug}`}
                            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-60"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Information */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
                        <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                            <FileText className="w-5 h-5 text-brand-500" />
                            <span>Basic Details</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Campaign Title (English) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                />
                                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Campaign Title (বাংলা)
                                </label>
                                <input
                                    type="text"
                                    value={titleBn}
                                    onChange={(e) => setTitleBn(e.target.value)}
                                    placeholder="ক্যাম্পেইনের বাংলা শিরোনাম"
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    URL Slug *
                                </label>
                                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
                                    <span className="px-3 text-xs text-gray-400 font-mono">/campaigns/</span>
                                    <input
                                        type="text"
                                        required
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="w-full py-2.5 pr-3 text-sm bg-transparent border-0 focus:ring-0"
                                    />
                                </div>
                                {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Category *
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(Number(e.target.value))}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {language === 'bn' && cat.name_bn ? cat.name_bn : cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Campaign Type Selector */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                {language === 'bn' ? 'ক্যাম্পেইনের ধরণ (Campaign Type)' : 'Campaign Type'}
                            </label>
                            <select
                                value={campaignType}
                                onChange={(e) => setCampaignType(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                            >
                                <option value="frame">{language === 'bn' ? 'ক্লাসিক ফ্রেম টুইবন (স্বচ্ছ কাটআউট)' : 'Classic Frame Twibbon (Standard Cutout)'}</option>
                                <option value="custom_text">{language === 'bn' ? 'কাস্টম নাম ও লেখা ফ্রেম (অ্যাডভান্সড টেক্সট)' : 'Name & Custom Text Frame (Advanced)'}</option>
                                <option value="greeting_card">{language === 'bn' ? 'শুভেচ্ছা ও উৎসব কার্ড (উৎসব ও কার্ড)' : 'Greeting & Celebration Card (Festive)'}</option>
                                <option value="sticker_badge">{language === 'bn' ? 'ক্যাম্পেইন সিল ও ব্যাজ (লোগো/সিল)' : 'Supporter Seal & Badge'}</option>
                                <option value="background">{language === 'bn' ? 'ব্যাকগ্রাউন্ড ক্যানভাস' : 'Background Canvas'}</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Description (English)
                                </label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Description (বাংলা)
                                </label>
                                <textarea
                                    rows={3}
                                    value={descriptionBn}
                                    onChange={(e) => setDescriptionBn(e.target.value)}
                                    placeholder="ক্যাম্পেইনের বিস্তারিত বিবরণ"
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="independence, bangladesh, celebrate"
                                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                            />
                        </div>
                    </div>

                    {/* Frame Visual / Replace Frame */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
                        <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                            <ImageIcon className="w-5 h-5 text-brand-500" />
                            <span>Campaign Frame Overlay</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                            {/* Current Preview */}
                            <div className="sm:col-span-4 flex flex-col items-center">
                                <div 
                                    className="w-40 h-40 rounded-2xl border border-gray-200 p-2 flex items-center justify-center relative overflow-hidden bg-white shadow-xs"
                                    style={{
                                        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                                        backgroundSize: '12px 12px'
                                    }}
                                >
                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            alt=""
                                            className="w-full h-full object-contain filter drop-shadow-sm"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLElement).style.display = 'none';
                                            }}
                                        />
                                    )}
                                </div>
                                <span className="text-[11px] text-gray-500 font-semibold mt-2">
                                    {frameFile ? 'New Frame Selected' : 'Current Frame'}
                                </span>
                            </div>

                            {/* Upload Replacement */}
                            <div className="sm:col-span-8 space-y-3">
                                <p className="text-xs text-gray-600">
                                    Want to replace this campaign frame? Upload a high-resolution transparent PNG or WebP (1080x1080 recommended, max 10MB).
                                </p>

                                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 hover:border-brand-400 rounded-2xl bg-gray-50/50 hover:bg-brand-50/20 cursor-pointer transition-all">
                                    <Upload className="w-6 h-6 text-brand-500 mb-1" />
                                    <span className="text-xs font-bold text-gray-700">Click to choose a replacement PNG frame</span>
                                    <span className="text-[10px] text-gray-400">Leaves existing frame unchanged if no file chosen</span>
                                    <input
                                        type="file"
                                        accept="image/png,image/webp"
                                        className="hidden"
                                        onChange={(e) => e.target.files?.[0] && handleFrameChange(e.target.files[0])}
                                    />
                                </label>
                                {frameFile && (
                                    <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Replacement selected: {frameFile.name} ({(frameFile.size / 1024).toFixed(1)} KB)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Settings & Visibility */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
                        <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                            <Sliders className="w-5 h-5 text-brand-500" />
                            <span>Publishing & Photo Area Settings</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                >
                                    <option value="published">Published (Live to Public)</option>
                                    <option value="draft">Draft (Hidden)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Visibility
                                </label>
                                <select
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value as any)}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                >
                                    <option value="public">Public (Visible in explore & search)</option>
                                    <option value="unlisted">Unlisted (Accessible only via link)</option>
                                    <option value="private">Private (Only you can access)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Default Aspect Ratio
                                </label>
                                <select
                                    value={aspectRatio}
                                    onChange={(e) => setAspectRatio(e.target.value as any)}
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                >
                                    <option value="1:1">1:1 Square (1080x1080)</option>
                                    <option value="4:5">4:5 Portrait (1080x1350)</option>
                                    <option value="9:16">9:16 Story (1080x1920)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Default Photo Zoom ({defaultZoom}x)
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2.0"
                                    step="0.05"
                                    value={defaultZoom}
                                    onChange={(e) => setDefaultZoom(parseFloat(e.target.value))}
                                    className="w-full accent-brand-500 cursor-pointer mt-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Save Action */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Link
                            href={`/campaigns/${campaign.slug}`}
                            className="px-6 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md shadow-brand-500/25 active:scale-95 transition-all disabled:opacity-60"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isSubmitting ? 'Saving Changes...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
