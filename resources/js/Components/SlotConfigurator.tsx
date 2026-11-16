import React, { useState } from 'react';
import { 
    Calendar, Clock, MapPin, FileText, Award, User, 
    Camera, Move, Sliders, Check, Sparkles, RotateCcw,
    Eye, Layout, Palette
} from 'lucide-react';

export interface SlotConfigItem {
    enabled?: boolean;
    x: number; // percentage of canvas (0 - 100)
    y: number; // percentage of canvas (0 - 100)
    font_size?: number; // base font size in pixels for 1080px canvas
    color?: string;
    align?: 'left' | 'center' | 'right';
    max_width?: number; // percentage of canvas width
    shadow?: boolean;
}

export interface PhotoSlotConfig {
    x: number; // canvas offset
    y: number;
    width?: number; // percentage of canvas
    height?: number;
    zoom?: number;
    shape?: 'arch' | 'circle' | 'rectangle';
    hint?: string;
}

export interface SlotsConfig {
    photo_slot: PhotoSlotConfig;
    date_slot: SlotConfigItem;
    time_slot: SlotConfigItem;
    venue_slot: SlotConfigItem;
    topic_slot: SlotConfigItem;
    badge_slot: SlotConfigItem;
    name_slot: SlotConfigItem;
}

export const DEFAULT_SLOTS_CONFIG: SlotsConfig = {
    photo_slot: {
        x: 260,
        y: -70,
        width: 40.5,
        height: 60,
        zoom: 1.0,
        shape: 'arch',
        hint: 'ডানের মেহরাব/খিলানের মাঝে ছবি বসবে',
    },
    date_slot: {
        enabled: true,
        x: 29.5,
        y: 44.8,
        font_size: 18,
        color: '#FFFFFF',
        align: 'center',
        shadow: true,
    },
    time_slot: {
        enabled: true,
        x: 29.5,
        y: 48.5,
        font_size: 15,
        color: '#FEF3C7',
        align: 'center',
        shadow: true,
    },
    venue_slot: {
        enabled: true,
        x: 28.8,
        y: 58.2,
        font_size: 19,
        color: '#0B2559',
        align: 'center',
        max_width: 41,
        shadow: false,
    },
    topic_slot: {
        enabled: true,
        x: 28.8,
        y: 64.8,
        font_size: 17,
        color: '#1E3A8A',
        align: 'center',
        max_width: 41,
        shadow: false,
    },
    badge_slot: {
        enabled: true,
        x: 52.8,
        y: 77.2,
        font_size: 17,
        color: '#FFFFFF',
        align: 'center',
        shadow: true,
    },
    name_slot: {
        enabled: true,
        x: 75.5,
        y: 87.5,
        font_size: 33,
        color: '#FFFFFF',
        align: 'center',
        max_width: 42,
        shadow: true,
    },
};

export const PRESET_LAYOUTS: { id: string; name: string; name_en: string; config: SlotsConfig }[] = [
    {
        id: 'right_arch',
        name: 'ডানে খিলান + বামে নোটিশ (জুম\'আর খুতবা/ইসলামিক)',
        name_en: 'Right Arch + Left Details (Islamic Poster)',
        config: DEFAULT_SLOTS_CONFIG,
    },
    {
        id: 'left_arch',
        name: 'বামে খিলান + ডানে নোটিশ (মাহফিল ও কনফারেন্স)',
        name_en: 'Left Arch + Right Details',
        config: {
            photo_slot: { x: -260, y: -70, width: 40.5, height: 60, zoom: 1.0, shape: 'arch', hint: 'বামের মেহরাবে ছবি বসবে' },
            date_slot: { enabled: true, x: 72, y: 44.8, font_size: 18, color: '#FFFFFF', align: 'center', shadow: true },
            time_slot: { enabled: true, x: 72, y: 48.5, font_size: 15, color: '#FEF3C7', align: 'center', shadow: true },
            venue_slot: { enabled: true, x: 72, y: 58.2, font_size: 19, color: '#0B2559', align: 'center', max_width: 41, shadow: false },
            topic_slot: { enabled: true, x: 72, y: 64.8, font_size: 17, color: '#1E3A8A', align: 'center', max_width: 41, shadow: false },
            badge_slot: { enabled: true, x: 47, y: 77.2, font_size: 17, color: '#FFFFFF', align: 'center', shadow: true },
            name_slot: { enabled: true, x: 26, y: 87.5, font_size: 33, color: '#FFFFFF', align: 'center', max_width: 42, shadow: true },
        },
    },
    {
        id: 'center_circle',
        name: 'মাঝে সার্কেল ছবি + নিচে ব্যানার (প্রধান আলোচক)',
        name_en: 'Center Circle Speaker + Bottom Banner',
        config: {
            photo_slot: { x: 0, y: -60, width: 46, height: 46, zoom: 1.0, shape: 'circle', hint: 'মাঝের বৃত্তে ছবি বসবে' },
            date_slot: { enabled: true, x: 50, y: 12, font_size: 18, color: '#FFFFFF', align: 'center', shadow: true },
            time_slot: { enabled: true, x: 50, y: 16, font_size: 15, color: '#FEF3C7', align: 'center', shadow: true },
            venue_slot: { enabled: true, x: 50, y: 68, font_size: 18, color: '#0B2559', align: 'center', max_width: 70, shadow: false },
            topic_slot: { enabled: true, x: 50, y: 74, font_size: 16, color: '#1E3A8A', align: 'center', max_width: 75, shadow: false },
            badge_slot: { enabled: true, x: 50, y: 82, font_size: 16, color: '#FFFFFF', align: 'center', shadow: true },
            name_slot: { enabled: true, x: 50, y: 90, font_size: 32, color: '#FFFFFF', align: 'center', max_width: 60, shadow: true },
        },
    },
    {
        id: 'top_photo',
        name: 'উপরে বড় ছবি + নিচে তথ্য (সেমিনার / ওয়াজ মাহফিল)',
        name_en: 'Top Photo + Bottom Info (Seminar / Workshop)',
        config: {
            photo_slot: { x: 0, y: -140, width: 85, height: 45, zoom: 1.0, shape: 'rectangle', hint: 'উপরের অংশে ছবি বসবে' },
            date_slot: { enabled: true, x: 25, y: 65, font_size: 17, color: '#FFFFFF', align: 'center', shadow: true },
            time_slot: { enabled: true, x: 75, y: 65, font_size: 17, color: '#FEF3C7', align: 'center', shadow: true },
            venue_slot: { enabled: true, x: 50, y: 74, font_size: 19, color: '#0B2559', align: 'center', max_width: 80, shadow: false },
            topic_slot: { enabled: true, x: 50, y: 81, font_size: 17, color: '#1E3A8A', align: 'center', max_width: 80, shadow: false },
            badge_slot: { enabled: true, x: 50, y: 88, font_size: 15, color: '#FFFFFF', align: 'center', shadow: true },
            name_slot: { enabled: true, x: 50, y: 94, font_size: 30, color: '#FFFFFF', align: 'center', max_width: 70, shadow: true },
        },
    },
];

interface SlotConfiguratorProps {
    frameUrl: string;
    config: SlotsConfig;
    onChange: (newConfig: SlotsConfig) => void;
}

export default function SlotConfigurator({ frameUrl, config, onChange }: SlotConfiguratorProps) {
    const [activeSlot, setActiveSlot] = useState<
        'photo' | 'date' | 'time' | 'venue' | 'topic' | 'badge' | 'name'
    >('photo');

    const updatePhotoSlot = (partial: Partial<PhotoSlotConfig>) => {
        onChange({
            ...config,
            photo_slot: { ...config.photo_slot, ...partial },
        });
    };

    const updateTextSlot = (slotKey: keyof Omit<SlotsConfig, 'photo_slot'>, partial: Partial<SlotConfigItem>) => {
        onChange({
            ...config,
            [slotKey]: { ...config[slotKey], ...partial },
        });
    };

    const applyPreset = (presetConfig: SlotsConfig) => {
        onChange(JSON.parse(JSON.stringify(presetConfig)));
    };

    return (
        <div className="space-y-6">
            {/* Header & Notice */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sliders className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-blue-950">
                        ফ্রেমের স্লট ও পজিশন কনফিগারেশন (Admin Slot Fixer)
                    </h3>
                    <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
                        প্রতিটি নতুন ফ্রেমের ছবির স্থান, তারিখ, সময়, স্থান, বিষয়, পদবি ও নামের অবস্থান ফিক্স করে দিন।
                        ব্যবহারকারী শুধুমাত্র তথ্য লিখলেই তা স্বয়ংক্রিয়ভাবে সঠিক স্থানে নির্ভুল সাইজে বসে যাবে!
                    </p>
                </div>
            </div>

            {/* Quick Layout Presets Bar */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-blue-600" />
                    <span>১-ক্লিকে রেডিমেড লেআউট প্রিসেট নির্বাচন করুন:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {PRESET_LAYOUTS.map((preset) => (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => applyPreset(preset.config)}
                            className="p-3 rounded-2xl border text-left bg-white hover:border-blue-400 hover:shadow-xs transition-all border-gray-200 group"
                        >
                            <span className="block text-xs font-bold text-gray-900 group-hover:text-blue-600">
                                {preset.name}
                            </span>
                            <span className="block text-[10px] text-gray-400 mt-1">
                                {preset.name_en}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Interactive Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Visual Canvas Display with Overlay Markers */}
                <div className="lg:col-span-6 flex flex-col items-center">
                    <div className="w-full bg-slate-900 rounded-3xl p-3 border border-slate-800 shadow-xl relative overflow-hidden">
                        <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-bold text-slate-300">
                            <span className="flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5 text-blue-400" />
                                <span>লাইভ পজিশন প্রিভিউ (Live Overlay)</span>
                            </span>
                            <span className="text-[10px] text-slate-400">১০৮০×১০৮০ ক্যানভাস</span>
                        </div>

                        {/* Relative Visual Container */}
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                            {/* Frame PNG */}
                            {frameUrl && (
                                <img
                                    src={frameUrl}
                                    alt="Frame Preview"
                                    className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
                                />
                            )}

                            {/* Photo Slot Highlight Target */}
                            <div
                                style={{
                                    top: `${Math.max(2, (config.photo_slot.y < 0 ? 14 : 25))}%`,
                                    left: config.photo_slot.x < 0 ? '5%' : (config.photo_slot.x > 100 ? '55%' : '27%'),
                                    width: `${config.photo_slot.width || 40}%`,
                                    height: `${config.photo_slot.height || 60}%`,
                                }}
                                className={`absolute z-0 border-2 border-dashed border-emerald-400 bg-emerald-500/20 backdrop-blur-2xs flex flex-col items-center justify-center p-2 text-center transition-all ${
                                    config.photo_slot.shape === 'circle' ? 'rounded-full' : (config.photo_slot.shape === 'arch' ? 'rounded-t-[100px] rounded-b-xl' : 'rounded-2xl')
                                } ${activeSlot === 'photo' ? 'ring-4 ring-emerald-400 shadow-lg' : ''}`}
                            >
                                <Camera className="w-5 h-5 text-emerald-300 mb-1" />
                                <span className="text-[10px] font-black text-emerald-100">
                                    ছবির স্থান ({config.photo_slot.shape || 'arch'})
                                </span>
                            </div>

                            {/* Date Slot Marker */}
                            {config.date_slot.enabled && (
                                <div
                                    style={{
                                        left: `${config.date_slot.x}%`,
                                        top: `${config.date_slot.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        color: config.date_slot.color || '#FFFFFF',
                                        fontSize: '11px',
                                    }}
                                    className={`absolute z-20 font-bold whitespace-nowrap pointer-events-none drop-shadow-md px-1.5 py-0.5 rounded ${
                                        activeSlot === 'date' ? 'bg-blue-600/80 ring-2 ring-white text-white' : ''
                                    }`}
                                >
                                    📅 ২১ নভেম্বর ২০২৬
                                </div>
                            )}

                            {/* Time Slot Marker */}
                            {config.time_slot.enabled && (
                                <div
                                    style={{
                                        left: `${config.time_slot.x}%`,
                                        top: `${config.time_slot.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        color: config.time_slot.color || '#FEF3C7',
                                        fontSize: '10px',
                                    }}
                                    className={`absolute z-20 font-bold whitespace-nowrap pointer-events-none drop-shadow-md px-1.5 py-0.5 rounded ${
                                        activeSlot === 'time' ? 'bg-amber-600/80 ring-2 ring-white text-white' : ''
                                    }`}
                                >
                                    ⏰ দুপুর ১:৩০ মি.
                                </div>
                            )}

                            {/* Venue Slot Marker */}
                            {config.venue_slot.enabled && (
                                <div
                                    style={{
                                        left: `${config.venue_slot.x}%`,
                                        top: `${config.venue_slot.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        color: config.venue_slot.color || '#0B2559',
                                        fontSize: '11px',
                                    }}
                                    className={`absolute z-20 font-bold whitespace-nowrap pointer-events-none drop-shadow-md px-1.5 py-0.5 rounded ${
                                        activeSlot === 'venue' ? 'bg-indigo-600/80 ring-2 ring-white text-white' : ''
                                    }`}
                                >
                                    📍 বায়তুল মোকাররম
                                </div>
                            )}

                            {/* Topic Slot Marker */}
                            {config.topic_slot.enabled && (
                                <div
                                    style={{
                                        left: `${config.topic_slot.x}%`,
                                        top: `${config.topic_slot.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        color: config.topic_slot.color || '#1E3A8A',
                                        fontSize: '10px',
                                    }}
                                    className={`absolute z-20 font-bold whitespace-nowrap pointer-events-none drop-shadow-md px-1.5 py-0.5 rounded ${
                                        activeSlot === 'topic' ? 'bg-emerald-600/80 ring-2 ring-white text-white' : ''
                                    }`}
                                >
                                    📄 খুতবার গুরুত্ব
                                </div>
                            )}

                            {/* Badge Slot Marker */}
                            {config.badge_slot.enabled && (
                                <div
                                    style={{
                                        left: `${config.badge_slot.x}%`,
                                        top: `${config.badge_slot.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        color: config.badge_slot.color || '#FFFFFF',
                                        fontSize: '10px',
                                    }}
                                    className={`absolute z-20 font-black whitespace-nowrap pointer-events-none drop-shadow-md px-1.5 py-0.5 rounded ${
                                        activeSlot === 'badge' ? 'bg-amber-500 ring-2 ring-white text-white' : ''
                                    }`}
                                >
                                    🏷️ খতীব
                                </div>
                            )}

                            {/* Name Slot Marker */}
                            {config.name_slot.enabled && (
                                <div
                                    style={{
                                        left: `${config.name_slot.x}%`,
                                        top: `${config.name_slot.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        color: config.name_slot.color || '#FFFFFF',
                                        fontSize: '14px',
                                    }}
                                    className={`absolute z-20 font-black whitespace-nowrap pointer-events-none drop-shadow-md px-2 py-0.5 rounded ${
                                        activeSlot === 'name' ? 'bg-blue-600 ring-2 ring-white text-white' : ''
                                    }`}
                                >
                                    👤 মাওলানা মুফতি আব্দুল্লাহ
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Slot Inspector & Slider Controls */}
                <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-5">
                    {/* Slot Select Tabs */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">
                            পজিশন এডিট করতে উপাদান সিলেক্ট করুন:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { id: 'photo', label: '📸 ছবির স্থান', activeColor: 'bg-emerald-600 text-white' },
                                { id: 'date', label: '📅 তারিখ', activeColor: 'bg-blue-600 text-white' },
                                { id: 'time', label: '⏰ সময়', activeColor: 'bg-amber-600 text-white' },
                                { id: 'venue', label: '📍 স্থান', activeColor: 'bg-indigo-600 text-white' },
                                { id: 'topic', label: '📄 বিষয়', activeColor: 'bg-emerald-700 text-white' },
                                { id: 'badge', label: '🏷️ পদবি', activeColor: 'bg-amber-500 text-white' },
                                { id: 'name', label: '👤 নাম', activeColor: 'bg-blue-700 text-white' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveSlot(tab.id as any)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        activeSlot === tab.id
                                            ? tab.activeColor + ' shadow-xs ring-2 ring-offset-1'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CONTROLS FOR: PHOTO SLOT */}
                    {activeSlot === 'photo' && (
                        <div className="space-y-4 pt-2 border-t border-gray-100 animate-in fade-in duration-150">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-gray-900">ছবির কাটআউট উইন্ডো কনফিগারেশন</span>
                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                                    {config.photo_slot.shape}
                                </span>
                            </div>

                            {/* Cutout Shape */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 block">কাটআউট আকৃতি (Shape)</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'arch', label: 'মসজিদ খিলান' },
                                        { id: 'circle', label: 'বৃত্তাকার' },
                                        { id: 'rectangle', label: 'আয়তাকার' },
                                    ].map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => updatePhotoSlot({ shape: s.id as any })}
                                            className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                                                config.photo_slot.shape === s.id
                                                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                            }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Horizontal Offset Slider */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-gray-700">
                                    <span>ডানে / বামে সরান (X Offset)</span>
                                    <span>{config.photo_slot.x} px</span>
                                </div>
                                <input
                                    type="range"
                                    min="-400"
                                    max="400"
                                    step="10"
                                    value={config.photo_slot.x}
                                    onChange={(e) => updatePhotoSlot({ x: parseInt(e.target.value) })}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                            </div>

                            {/* Vertical Offset Slider */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-gray-700">
                                    <span>উপরে / নিচে সরান (Y Offset)</span>
                                    <span>{config.photo_slot.y} px</span>
                                </div>
                                <input
                                    type="range"
                                    min="-300"
                                    max="300"
                                    step="10"
                                    value={config.photo_slot.y}
                                    onChange={(e) => updatePhotoSlot({ y: parseInt(e.target.value) })}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                            </div>

                            {/* Window Width & Height */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[11px] font-bold text-gray-700">
                                        <span>প্রস্থ (Width %)</span>
                                        <span>{config.photo_slot.width || 40}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="20"
                                        max="90"
                                        step="1"
                                        value={config.photo_slot.width || 40}
                                        onChange={(e) => updatePhotoSlot({ width: parseInt(e.target.value) })}
                                        className="w-full accent-emerald-600 cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[11px] font-bold text-gray-700">
                                        <span>উচ্চতা (Height %)</span>
                                        <span>{config.photo_slot.height || 60}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="20"
                                        max="90"
                                        step="1"
                                        value={config.photo_slot.height || 60}
                                        onChange={(e) => updatePhotoSlot({ height: parseInt(e.target.value) })}
                                        className="w-full accent-emerald-600 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONTROLS FOR ANY TEXT SLOT */}
                    {activeSlot !== 'photo' && (() => {
                        const slotKey = `${activeSlot}_slot` as keyof Omit<SlotsConfig, 'photo_slot'>;
                        const item = config[slotKey];

                        return (
                            <div className="space-y-4 pt-2 border-t border-gray-100 animate-in fade-in duration-150">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-gray-900 uppercase">
                                        {activeSlot} স্লটের সেটিংস
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => updateTextSlot(slotKey, { enabled: !item.enabled })}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                            item.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                                        }`}
                                    >
                                        {item.enabled ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Disabled)'}
                                    </button>
                                </div>

                                {/* X Position Slider */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-gray-700">
                                        <span>অনুভূমিক অবস্থান (X Position %)</span>
                                        <span>{item.x}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5"
                                        max="95"
                                        step="0.5"
                                        value={item.x}
                                        onChange={(e) => updateTextSlot(slotKey, { x: parseFloat(e.target.value) })}
                                        className="w-full accent-blue-600 cursor-pointer"
                                    />
                                </div>

                                {/* Y Position Slider */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-gray-700">
                                        <span>উল্লম্ব অবস্থান (Y Position %)</span>
                                        <span>{item.y}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="5"
                                        max="95"
                                        step="0.5"
                                        value={item.y}
                                        onChange={(e) => updateTextSlot(slotKey, { y: parseFloat(e.target.value) })}
                                        className="w-full accent-blue-600 cursor-pointer"
                                    />
                                </div>

                                {/* Font Size Slider */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-gray-700">
                                        <span>ফন্ট সাইজ (Font Size px)</span>
                                        <span>{item.font_size || 18} px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="12"
                                        max="60"
                                        step="1"
                                        value={item.font_size || 18}
                                        onChange={(e) => updateTextSlot(slotKey, { font_size: parseInt(e.target.value) })}
                                        className="w-full accent-blue-600 cursor-pointer"
                                    />
                                </div>

                                {/* Color Picker & Drop Shadow */}
                                <div className="grid grid-cols-2 gap-3 pt-1">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 block">টেক্সট কালার</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={item.color || '#FFFFFF'}
                                                onChange={(e) => updateTextSlot(slotKey, { color: e.target.value })}
                                                className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                                            />
                                            <span className="text-xs font-mono text-gray-600 uppercase">
                                                {item.color || '#FFFFFF'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 block">ড্রপ শ্যাডো</label>
                                        <button
                                            type="button"
                                            onClick={() => updateTextSlot(slotKey, { shadow: !item.shadow })}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                                                item.shadow
                                                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                    : 'bg-gray-50 border-gray-200 text-gray-500'
                                            }`}
                                        >
                                            {item.shadow ? 'ছায়া সক্রিয়' : 'ছায়া বন্ধ'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
