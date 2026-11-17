import React, { useState, useEffect, useRef } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { useLanguage } from '@/Context/LanguageContext';
import { 
    Sparkles, X, Send, Upload, Download, RefreshCw, 
    ArrowRight, Check, Image as ImageIcon, MessageSquare, 
    User, ChevronDown, CheckCircle2, AlertCircle
} from 'lucide-react';
import { compositeFramePhoto } from '@/lib/aiCanvasCompositor';
import AiFrameMiniStudio from '@/Components/AiFrameMiniStudio';

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

export default function AiChatWidget() {
    const { platform_settings } = (usePage?.()?.props || {}) as any;
    const { language, t } = useLanguage();

    const isEnabled = (platform_settings?.ai_assistant_enabled !== false) && 
                      (platform_settings?.ai_chat_widget_enabled !== false);

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Active customization state
    const [activeCampaign, setActiveCampaign] = useState<any>(null);
    const [userPhotoFile, setUserPhotoFile] = useState<File | null>(null);
    const [userPhotoPreview, setUserPhotoPreview] = useState<string>('');
    const [customName, setCustomName] = useState('');
    const [customTitle, setCustomTitle] = useState('');
    const [isCompositing, setIsCompositing] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const botName = language === 'bn' 
        ? (platform_settings?.ai_bot_name_bn || 'ফ্রেমফিউশন এআই') 
        : (platform_settings?.ai_bot_name || 'FrameFusion AI');

    const defaultWelcome = language === 'bn'
        ? (platform_settings?.ai_welcome_message_bn || 'স্বাগতম! আপনি কী ধরণের ফ্রেম তৈরি বা খুঁজতে চান? আমাকে জানান (যেমন: বিজয় দিবস, জন্মদিন, মাহফিল বা রাজনৈতিক পোস্টার)।')
        : (platform_settings?.ai_welcome_message_en || 'Welcome! What kind of campaign frame are you looking for or creating? Tell me (e.g. Victory Day, Birthday, Notice Poster)!');

    const rawSuggestions = platform_settings?.ai_suggestions || "বিজয় দিবসের ফ্রেম\nজন্মদিনের শুভেচ্ছা ফ্রেম\nমাহফিল নোটিশ পোস্টার\nসাধারণ ফ্রেম";
    const suggestions = rawSuggestions.split("\n").map((s: string) => s.trim()).filter(Boolean);

    // Initialize with welcome message on first open
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: 'welcome-1',
                    sender: 'bot',
                    text: defaultWelcome,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }
            ]);
        }
    }, [defaultWelcome]);

    // Scroll to bottom on message update
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isCompositing]);

    if (!isEnabled) {
        return null;
    }

    const handleSendMessage = async (userText: string) => {
        const query = userText.trim();
        if (!query || isLoading) return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Add user message
        const userMsg: ChatMessage = {
            id: 'user-' + Date.now(),
            sender: 'user',
            text: query,
            timestamp: time,
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                },
                body: JSON.stringify({
                    message: query,
                    history: messages.slice(-4).map(m => ({ sender: m.sender, text: m.text })),
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                throw new Error(errorData?.message || `Server error: ${res.status}`);
            }

            const data = await res.json();

            if (data.success) {
                const botMsg: ChatMessage = {
                    id: 'bot-' + Date.now(),
                    sender: 'bot',
                    text: data.reply,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    campaigns: data.campaigns || [],
                };
                setMessages(prev => [...prev, botMsg]);
            } else {
                throw new Error(data.message || 'Error occurred');
            }
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    id: 'bot-err-' + Date.now(),
                    sender: 'bot',
                    text: language === 'bn' 
                        ? 'দুঃখিত, সংযোগে কিছুটা সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা নিচে দেওয়া ফ্রেমগুলো দেখতে পারেন।' 
                        : 'Sorry, connection issue occurred. Please try again.',
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

        // Bot asks user to upload photo and info
        const promptMsg: ChatMessage = {
            id: 'prompt-' + Date.now(),
            sender: 'bot',
            text: language === 'bn'
                ? `চমৎকার পছন্দ! আপনি "${title}" ফ্রেমটি বেছে নিয়েছেন। এবার নিচের বাটনে ট্যাপ করে আপনার ছবিটি আপলোড করুন। ছবিটি টেনে ইচ্ছামতো পজিশন করা, জুম ও নাম যুক্ত করার সকল কন্ট্রোল পেয়ে যাবেন:`
                : `Great choice! You picked "${title}". Upload your photo below to position it freely with zoom, move, and name controls:`,
            timestamp: time,
            promptForUpload: true,
            selectedCampaign: campaign,
        };

        setMessages(prev => [...prev, promptMsg]);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUserPhotoFile(file);
            const previewUrl = URL.createObjectURL(file);
            setUserPhotoPreview(previewUrl);
        }
    };

    const handleGenerateFrame = async () => {
        if (!activeCampaign || !userPhotoFile) return;

        setIsCompositing(true);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        try {
            // Find appropriate frame URL
            const frameUrl = activeCampaign.frame_url || activeCampaign.thumbnail_url;
            
            // Generate composite image
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

            // Bot replies with completed image and direct download button
            const successMsg: ChatMessage = {
                id: 'success-' + Date.now(),
                sender: 'bot',
                text: language === 'bn' 
                    ? '🎉 অভিনন্দন! আপনার ছবি ফ্রেমসহ প্রস্তুত হয়ে গেছে। নিচে ডাউনলোড বাটনে চাপ দিয়ে ফুল এইচডি (HD) কোয়ালিটিতে সেভ করুন:' 
                    : '🎉 Awesome! Your photo frame is ready. Click below to download in High Definition:',
                timestamp: time,
                finalImage: finalDataUrl,
                selectedCampaign: activeCampaign,
            };

            setMessages(prev => [...prev, successMsg]);
        } catch (err: any) {
            setMessages(prev => [
                ...prev,
                {
                    id: 'err-' + Date.now(),
                    sender: 'bot',
                    text: language === 'bn' ? 'ছবি প্রসেস করতে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Failed to composite photo. Please try again.',
                    timestamp: time,
                }
            ]);
        } finally {
            setIsCompositing(false);
        }
    };

    const handleDownload = (dataUrl: string, campaignTitle: string) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        const cleanTitle = (campaignTitle || 'framefusion').toLowerCase().replace(/[^a-z0-9]/gi, '-');
        a.download = `${cleanTitle}-frame.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleResetChat = () => {
        setActiveCampaign(null);
        setUserPhotoFile(null);
        setUserPhotoPreview('');
        setCustomName('');
        setCustomTitle('');
        setMessages([
            {
                id: 'welcome-' + Date.now(),
                sender: 'bot',
                text: defaultWelcome,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
        ]);
    };

    return (
        <>
            {/* FLOATING TRIGGER BUTTON (Always visible at bottom-right) */}
            <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40">
                {!isOpen ? (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="group relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-violet-500/35 hover:shadow-violet-500/50 hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-white"
                        title={language === 'bn' ? 'এআই সহকারীর সাথে চ্যাট করুন' : 'Chat with AI Studio'}
                    >
                        <div className="relative">
                            <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-ping" />
                        </div>
                        <span className="text-xs sm:text-sm font-black tracking-tight hidden xs:inline sm:inline">
                            {botName}
                        </span>
                        <span className="bg-white/20 text-[10px] font-bold px-1.5 py-0.5 rounded-full hidden sm:inline">
                            AI
                        </span>
                    </button>
                ) : null}
            </div>

            {/* EXPANDED INTERACTIVE CHAT WINDOW */}
            {isOpen && (
                <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col sm:w-[420px] sm:max-h-[640px] h-full sm:h-[85vh] bg-white sm:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-violet-700 via-indigo-600 to-purple-700 text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0 shadow-md">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-amber-300 shadow-xs">
                                <Sparkles className="w-5 h-5 fill-amber-300" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black tracking-tight leading-tight flex items-center gap-1.5">
                                    <span>{botName}</span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                </h3>
                                <p className="text-[10px] text-white/80 font-medium">
                                    {language === 'bn' ? 'স্মার্ট ফ্রেম ফাইন্ডার ও অটো-মেকার' : 'Conversational Frame Assistant'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleResetChat}
                                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all"
                                title={language === 'bn' ? 'চ্যাট নতুন করে শুরু করুন' : 'Reset Chat'}
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all active:scale-90"
                                title="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages Body */}
                    <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-4 space-y-4 bg-slate-50/70">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
                            >
                                <div className="flex items-end gap-1.5 max-w-[90%]">
                                    {msg.sender === 'bot' && (
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shrink-0 text-[10px] mb-1">
                                            <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                                        </div>
                                    )}

                                    <div
                                        className={`p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                                            msg.sender === 'user'
                                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-xs'
                                                : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>

                                {/* Matching Campaign Cards Ribbon */}
                                {msg.campaigns && msg.campaigns.length > 0 && (
                                    <div className="w-full space-y-2 pt-1">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block px-1">
                                            {language === 'bn' ? 'পছন্দসই ফ্রেম বেছে নিন:' : 'Available matching frames:'}
                                        </span>
                                        <div className="grid grid-cols-2 gap-2">
                                            {msg.campaigns.map((camp: any) => {
                                                const campTitle = language === 'bn' && camp.title_bn ? camp.title_bn : camp.title;
                                                const imgUrl = camp.thumbnail_url || camp.frame_url;
                                                return (
                                                    <div
                                                        key={camp.id}
                                                        className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                                                    >
                                                        <div className="aspect-square w-full rounded-xl bg-slate-100 overflow-hidden relative mb-2 flex items-center justify-center">
                                                            <img
                                                                src={imgUrl}
                                                                alt=""
                                                                className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[11px] font-bold text-slate-900 line-clamp-1">
                                                                {campTitle}
                                                            </h4>
                                                            <button
                                                                onClick={() => handleSelectCampaign(camp)}
                                                                className="mt-2 w-full py-1.5 px-2 bg-violet-50 hover:bg-violet-600 hover:text-white text-violet-700 font-bold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 active:scale-95"
                                                            >
                                                                <span>{language === 'bn' ? '🎯 ফ্রেমটি নিন' : 'Select'}</span>
                                                                <ArrowRight className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Interactive In-Chat Photo Positioning & Customization Studio */}
                                {msg.promptForUpload && (
                                    <div className="w-full">
                                        {userPhotoFile ? (
                                            <AiFrameMiniStudio
                                                campaign={msg.selectedCampaign || activeCampaign}
                                                userPhotoFile={userPhotoFile}
                                                userPhotoUrl={userPhotoPreview}
                                                onPhotoChange={(file) => {
                                                    setUserPhotoFile(file);
                                                    setUserPhotoPreview(URL.createObjectURL(file));
                                                }}
                                                language={language}
                                                compact={true}
                                            />
                                        ) : (
                                            <div className="w-full bg-white rounded-2xl border border-violet-200 p-3.5 shadow-md space-y-3 animate-in fade-in zoom-in-95">
                                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                                    <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                                                        <Upload className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-800">
                                                        {language === 'bn' ? 'ছবি নির্বাচন করুন' : 'Select Photo to Frame'}
                                                    </span>
                                                </div>

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    onChange={handlePhotoChange}
                                                    className="hidden"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-full py-3.5 px-3 rounded-xl border-2 border-dashed border-violet-300 hover:border-violet-500 bg-violet-50/50 hover:bg-violet-50 text-violet-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs"
                                                >
                                                    <ImageIcon className="w-4 h-4 text-violet-600" />
                                                    <span>{language === 'bn' ? '📷 আপনার ছবি নির্বাচন করুন' : '📷 Select Your Photo'}</span>
                                                </button>

                                                {(msg.selectedCampaign || activeCampaign) && (
                                                    <Link
                                                        href={`/campaigns/${(msg.selectedCampaign || activeCampaign).slug}/editor`}
                                                        className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all text-center block"
                                                    >
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                        <span>{language === 'bn' ? '🎨 ফুল স্টুডিও এডিটরে ওপেন করুন' : '🎨 Open in Studio Editor'}</span>
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Generated Final Image Card with 1-Click Download Button */}
                                {msg.finalImage && (
                                    <div className="w-full bg-white rounded-2xl border border-emerald-200 p-3 shadow-lg space-y-3 animate-in zoom-in-95">
                                        <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-900 relative shadow-inner">
                                            <img
                                                src={msg.finalImage}
                                                alt="Final Frame"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => handleDownload(msg.finalImage!, msg.selectedCampaign?.title)}
                                                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                                            >
                                                <Download className="w-4 h-4 stroke-[2.5]" />
                                                <span>{language === 'bn' ? '📥 ফ্রেম ডাউনলোড করুন' : '📥 Download Frame Photo'}</span>
                                            </button>

                                            <button
                                                onClick={() => handleSelectCampaign(msg.selectedCampaign)}
                                                className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1.5 transition-all"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                                                <span>{language === 'bn' ? '🔄 অন্য ছবি দিয়ে তৈরি করুন' : 'Try Another Photo'}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <span className="text-[9px] text-slate-400 px-1">{msg.timestamp}</span>
                            </div>
                        ))}

                        {/* Loading Typing Indicator */}
                        {isLoading && (
                            <div className="flex items-center gap-2 text-slate-400 text-xs p-2 bg-white rounded-xl border border-slate-100 w-fit">
                                <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-spin" />
                                <span className="animate-pulse">{botName} উত্তর লিখছে...</span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestion Chips */}
                    {suggestions.length > 0 && (
                        <div className="bg-slate-100/90 px-3 py-2 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 [-webkit-overflow-scrolling:touch]">
                            {suggestions.map((chip, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSendMessage(chip)}
                                    className="px-2.5 py-1 rounded-full bg-white hover:bg-violet-50 text-[10px] font-bold text-slate-700 hover:text-violet-700 border border-slate-200/80 shadow-2xs transition-all shrink-0 active:scale-95 whitespace-nowrap"
                                >
                                    🔍 {chip}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Chat Input Bar */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage(inputValue);
                        }}
                        className="p-2.5 sm:p-3 bg-white border-t border-slate-200/90 flex items-center gap-2 shrink-0"
                    >
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={language === 'bn' ? 'কোন ফ্রেম লাগবে লিখুন...' : 'Describe the frame you need...'}
                            className="flex-1 py-2 px-3.5 rounded-full border border-slate-200 text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-500/25 active:scale-90 transition-transform disabled:opacity-40"
                            title="Send"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
