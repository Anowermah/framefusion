import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useLanguage } from '@/Context/LanguageContext';
import { 
    Sparkles, Send, Upload, Download, RefreshCw, 
    ArrowRight, Check, Image as ImageIcon, Flame, 
    Layers, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { compositeFramePhoto } from '@/lib/aiCanvasCompositor';

interface Props {
    categories: any[];
    featuredCampaigns: any[];
    aiSettings: {
        bot_name: string;
        bot_name_bn: string;
        welcome_bn?: string;
        welcome_en?: string;
        suggestions: string[];
        auto_center?: boolean;
    };
}

interface ChatMessage {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    timestamp: string;
    campaigns?: any[];
    promptForUpload?: boolean;
    selectedCampaign?: any;
    finalImage?: string;
}

export default function AiStudioIndex({ categories, featuredCampaigns, aiSettings }: Props) {
    const { language, t } = useLanguage();
    const { platform_settings } = (usePage?.()?.props || {}) as any;

    const botName = language === 'bn' ? (aiSettings.bot_name_bn || 'ফ্রেমফিউশন এআই') : (aiSettings.bot_name || 'FrameFusion AI');
    const welcomeText = language === 'bn'
        ? (aiSettings.welcome_bn || 'স্বাগতম! আপনি কী ধরণের ফ্রেম তৈরি বা খুঁজতে চান? আমাকে জানান (যেমন: বিজয় দিবস, জন্মদিন, মাহফিল বা রাজনৈতিক পোস্টার)।')
        : (aiSettings.welcome_en || 'Welcome! What kind of campaign frame are you looking for or creating? Tell me!');

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'init-1',
            sender: 'bot',
            text: welcomeText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
    ]);

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Compositing states
    const [activeCampaign, setActiveCampaign] = useState<any>(null);
    const [userPhotoFile, setUserPhotoFile] = useState<File | null>(null);
    const [userPhotoPreview, setUserPhotoPreview] = useState<string>('');
    const [customName, setCustomName] = useState('');
    const [customTitle, setCustomTitle] = useState('');
    const [isCompositing, setIsCompositing] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isCompositing]);

    const handleSendMessage = async (userText: string) => {
        const query = userText.trim();
        if (!query || isLoading) return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setMessages(prev => [
            ...prev,
            { id: 'u-' + Date.now(), sender: 'user', text: query, timestamp: time }
        ]);
        setInputValue('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                },
                body: JSON.stringify({
                    message: query,
                    history: messages.slice(-4).map(m => ({ sender: m.sender, text: m.text })),
                }),
            });

            const data = await res.json();
            if (data.success) {
                setMessages(prev => [
                    ...prev,
                    {
                        id: 'b-' + Date.now(),
                        sender: 'bot',
                        text: data.reply,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        campaigns: data.campaigns || [],
                    }
                ]);
            }
        } catch (e) {
            setMessages(prev => [
                ...prev,
                {
                    id: 'b-err-' + Date.now(),
                    sender: 'bot',
                    text: language === 'bn' ? 'সংযোগ সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Connection error. Please try again.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectCampaign = (campaign: any) => {
        setActiveCampaign(campaign);
        setUserPhotoFile(null);
        setUserPhotoPreview('');
        setCustomName('');
        setCustomTitle('');

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const title = language === 'bn' && campaign.title_bn ? campaign.title_bn : campaign.title;

        setMessages(prev => [
            ...prev,
            {
                id: 'p-' + Date.now(),
                sender: 'bot',
                text: language === 'bn'
                    ? `দারুণ পছন্দ! আপনি "${title}" ফ্রেমটি বেছে নিয়েছেন। এবার নিচের ফরম থেকে আপনার ছবিটি দিন এবং ফ্রেমে নাম/তথ্য যোগ করে "ফ্রেম তৈরি করুন" এ চাপুন:`
                    : `Selected "${title}". Now upload your photo and enter details below:`,
                timestamp: time,
                promptForUpload: true,
                selectedCampaign: campaign,
            }
        ]);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUserPhotoFile(file);
            setUserPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleGenerateFrame = async () => {
        if (!activeCampaign || !userPhotoFile) return;

        setIsCompositing(true);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        try {
            const frameUrl = activeCampaign.frame_url || activeCampaign.thumbnail_url;
            const finalDataUrl = await compositeFramePhoto({
                frameUrl,
                userImage: userPhotoFile,
                slotConfig: activeCampaign.slot_config || { x: 0.1, y: 0.1, width: 0.8, height: 0.8, shape: 'rectangle' },
                textConfig: {
                    name: customName,
                    designation: customTitle,
                },
                outputSize: 1080,
            });

            setMessages(prev => [
                ...prev,
                {
                    id: 's-' + Date.now(),
                    sender: 'bot',
                    text: language === 'bn'
                        ? '🎉 চমৎকার! আপনার ছবি ফ্রেমসহ প্রস্তুত হয়ে গেছে। নিচে ডাউনলোড বাটনে চাপ দিয়ে ফুল রেজোলিউশনে সেভ করে নিন:'
                        : '🎉 High-definition photo frame generated successfully! Click download below:',
                    timestamp: time,
                    finalImage: finalDataUrl,
                    selectedCampaign: activeCampaign,
                }
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    id: 'err-' + Date.now(),
                    sender: 'bot',
                    text: language === 'bn' ? 'ছবি প্রসেস করতে ব্যর্থ হয়েছে।' : 'Failed to composite photo.',
                    timestamp: time,
                }
            ]);
        } finally {
            setIsCompositing(false);
        }
    };

    const handleDownload = (dataUrl: string, title: string) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        const cleanTitle = (title || 'framefusion').toLowerCase().replace(/[^a-z0-9]/gi, '-');
        a.download = `${cleanTitle}-ai-frame.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <MainLayout>
            <Head title={`AI Studio & Frame Assistant | ${botName}`} />

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 md:pb-12">
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/25">
                            <Sparkles className="w-6 h-6 fill-amber-300 text-amber-300 animate-pulse" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md inline-block">
                                Interactive Conversational Studio
                            </span>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                {botName}
                            </h1>
                        </div>
                    </div>

                    <Link
                        href="/explore"
                        className="text-xs font-bold text-slate-600 hover:text-violet-600 flex items-center gap-1 self-start sm:self-auto"
                    >
                        <span>{language === 'bn' ? 'সকল ফ্রেম ব্রাউজ করুন' : 'Browse All Frames'}</span>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Workspace Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEFT SIDEBAR: Recommendations & Suggested Prompts */}
                    <div className="hidden lg:block lg:col-span-4 space-y-5">
                        {/* Suggestion Prompts */}
                        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                                {language === 'bn' ? 'দ্রুত সার্চ করুন (Prompt Chips)' : 'Suggested Prompts'}
                            </h3>
                            <div className="flex flex-col gap-1.5">
                                {aiSettings.suggestions.map((s, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleSendMessage(s)}
                                        className="text-left py-2 px-3 rounded-xl bg-slate-50 hover:bg-violet-50 hover:text-violet-700 text-xs font-bold text-slate-700 transition-all active:scale-98 border border-slate-100 flex items-center justify-between group"
                                    >
                                        <span>🔍 {s}</span>
                                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Featured Trending Frames */}
                        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span>{language === 'bn' ? 'জনপ্রিয় ক্যাম্পেইন ফ্রেম' : 'Trending Frames'}</span>
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {featuredCampaigns.map((fc) => (
                                    <div
                                        key={fc.id}
                                        onClick={() => handleSelectCampaign(fc)}
                                        className="p-2 rounded-2xl border border-slate-100 hover:border-violet-300 bg-slate-50 hover:bg-white transition-all cursor-pointer group shadow-2xs"
                                    >
                                        <div className="aspect-square rounded-xl bg-white overflow-hidden mb-1.5 flex items-center justify-center">
                                            <img
                                                src={fc.thumbnail_url || fc.frame_url}
                                                alt=""
                                                className="w-full h-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-800 line-clamp-1">
                                            {language === 'bn' && fc.title_bn ? fc.title_bn : fc.title}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MAIN CHAT CONVERSATION CONTAINER */}
                    <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-card flex flex-col h-[75vh] sm:h-[80vh] overflow-hidden">
                        {/* Messages Scroll Area */}
                        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-5 bg-slate-50/50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
                                >
                                    <div className="flex items-end gap-2 max-w-[85%]">
                                        {msg.sender === 'bot' && (
                                            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mb-1">
                                                <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
                                            </div>
                                        )}

                                        <div
                                            className={`p-3.5 sm:p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                                                msg.sender === 'user'
                                                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-xs'
                                                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </div>

                                    {/* Campaign Match Cards */}
                                    {msg.campaigns && msg.campaigns.length > 0 && (
                                        <div className="w-full max-w-xl space-y-2 pt-2">
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {msg.campaigns.map((camp: any) => {
                                                    const campTitle = language === 'bn' && camp.title_bn ? camp.title_bn : camp.title;
                                                    return (
                                                        <div
                                                            key={camp.id}
                                                            className="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                                                        >
                                                            <div className="aspect-square w-full rounded-xl bg-slate-100 overflow-hidden relative mb-2 flex items-center justify-center">
                                                                <img
                                                                    src={camp.thumbnail_url || camp.frame_url}
                                                                    alt=""
                                                                    className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
                                                                />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                                                                    {campTitle}
                                                                </h4>
                                                                <button
                                                                    onClick={() => handleSelectCampaign(camp)}
                                                                    className="mt-2 w-full py-1.5 px-2 bg-violet-50 hover:bg-violet-600 hover:text-white text-violet-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 active:scale-95"
                                                                >
                                                                    <span>{language === 'bn' ? '🎯 ফ্রেমটি নিন' : 'Select'}</span>
                                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* In-Chat Upload & Customization Form */}
                                    {msg.promptForUpload && (
                                        <div className="w-full max-w-md bg-white rounded-3xl border border-violet-200 p-4 shadow-lg space-y-3.5 animate-in fade-in zoom-in-95">
                                            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                                                <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                                                    <Upload className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs sm:text-sm font-bold text-slate-800">
                                                    {language === 'bn' ? 'ছবি ও তথ্য যুক্ত করুন' : 'Upload Photo & Details'}
                                                </span>
                                            </div>

                                            {/* Image upload */}
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    onChange={handlePhotoChange}
                                                    className="hidden"
                                                />
                                                {userPhotoPreview ? (
                                                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                                                        <img
                                                            src={userPhotoPreview}
                                                            alt="User"
                                                            className="w-14 h-14 rounded-xl object-cover border border-white shadow-xs shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-xs font-bold text-slate-800 block truncate">
                                                                {userPhotoFile?.name}
                                                            </span>
                                                            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                {language === 'bn' ? 'ছবি সিলেক্ট হয়েছে' : 'Photo Selected'}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
                                                        >
                                                            {language === 'bn' ? 'পরিবর্তন' : 'Change'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-violet-300 hover:border-violet-500 bg-violet-50/50 hover:bg-violet-50 text-violet-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
                                                    >
                                                        <ImageIcon className="w-5 h-5" />
                                                        <span>{language === 'bn' ? '📷 আপনার ছবি নির্বাচন করুন' : '📷 Select Your Photo'}</span>
                                                    </button>
                                                )}
                                            </div>

                                            {/* Name & Title */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                <input
                                                    type="text"
                                                    placeholder={language === 'bn' ? 'আপনার নাম (ঐচ্ছিক)' : 'Your Name (Optional)'}
                                                    value={customName}
                                                    onChange={e => setCustomName(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-violet-500"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder={language === 'bn' ? 'পদবী / শুভেচ্ছা বার্তা (ঐচ্ছিক)' : 'Designation / Note (Optional)'}
                                                    value={customTitle}
                                                    onChange={e => setCustomTitle(e.target.value)}
                                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-violet-500"
                                                />
                                            </div>

                                            {/* Generate button */}
                                            <button
                                                type="button"
                                                onClick={handleGenerateFrame}
                                                disabled={!userPhotoFile || isCompositing}
                                                className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-violet-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-95"
                                            >
                                                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                                                <span>
                                                    {isCompositing
                                                        ? (language === 'bn' ? 'ফ্রেম তৈরি হচ্ছে...' : 'Compositing Frame...')
                                                        : (language === 'bn' ? '✨ ফ্রেম তৈরি করুন' : '✨ Generate Frame')}
                                                </span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Final Composite Preview & 1-Click Download */}
                                    {msg.finalImage && (
                                        <div className="w-full max-w-sm bg-white rounded-3xl border border-emerald-200 p-4 shadow-xl space-y-3.5 animate-in zoom-in-95">
                                            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 relative shadow-inner">
                                                <img
                                                    src={msg.finalImage}
                                                    alt="Final Frame"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleDownload(msg.finalImage!, msg.selectedCampaign?.title)}
                                                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                                                >
                                                    <Download className="w-5 h-5 stroke-[2.5]" />
                                                    <span>{language === 'bn' ? '📥 ফ্রেম ডাউনলোড করুন' : '📥 Download Frame Photo'}</span>
                                                </button>

                                                <button
                                                    onClick={() => handleSelectCampaign(msg.selectedCampaign)}
                                                    className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                                                >
                                                    <RefreshCw className="w-4 h-4 text-slate-500" />
                                                    <span>{language === 'bn' ? '🔄 অন্য ছবি দিয়ে তৈরি করুন' : 'Try Another Photo'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <span className="text-[10px] text-slate-400 px-2">{msg.timestamp}</span>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex items-center gap-2 text-slate-400 text-xs p-3 bg-white rounded-2xl border border-slate-100 w-fit">
                                    <Sparkles className="w-4 h-4 text-violet-600 animate-spin" />
                                    <span className="animate-pulse">{botName} উত্তর প্রস্তুত করছে...</span>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage(inputValue);
                            }}
                            className="p-3 sm:p-4 bg-white border-t border-slate-200/80 flex items-center gap-2 sm:gap-3 shrink-0"
                        >
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={language === 'bn' ? 'কী ধরণের ফ্রেম লাগবে লিখুন (যেমন: বিজয় দিবস, জন্মদিন, মাহফিল)...' : 'Describe the frame you need...'}
                                className="flex-1 py-2.5 sm:py-3 px-4 rounded-full border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="px-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 shadow-md shadow-violet-500/25 active:scale-95 transition-all disabled:opacity-40"
                            >
                                <span>{language === 'bn' ? 'পাঠান' : 'Send'}</span>
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
