import React, { useState } from 'react';
import { 
    Calendar, Clock, MapPin, FileText, Award, User, 
    Camera, Move, Sliders, Check, Sparkles, RotateCcw,
    Eye, Layout, Palette, Type, AlignLeft, AlignCenter, AlignRight,
    Square, Circle, Shapes, Maximize2
} from 'lucide-react';

export type PhotoCutoutShape = 'arch' | 'circle' | 'rectangle' | 'rounded_rectangle' | 'oval';

export interface SlotConfigItem {
    enabled?: boolean;
    x: number; // percentage of canvas (0 - 100)
    y: number; // percentage of canvas (0 - 100)
    font_size?: number; // base font size in pixels for 1080px canvas (10 - 90)
    color?: string; // hex color e.g. #FFFFFF
    font_family?: string; // 'Hind Siliguri' | 'Noto Serif Bengali' | 'Anek Bangla' | 'Tiro Bangla' | 'Inter'
    font_weight?: 'normal' | '500' | '600' | 'bold' | '800';
    align?: 'left' | 'center' | 'right';
    max_width?: number; // percentage of canvas width (10 - 100)
    shadow?: boolean;
}

export interface PhotoSlotConfig {
    x: number; // canvas offset (-450 to +450)
    y: number; // canvas offset (-450 to +450)
    width?: number; // percentage of canvas (15% - 95%)
    height?: number; // percentage of canvas (15% - 95%)
    zoom?: number; // default zoom 0.5 - 2.5
    shape?: PhotoCutoutShape;
    border_radius?: number; // for rounded_rectangle in px (0 - 80)
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

export const FONT_OPTIONS: { id: string; name: string; name_en: string; style: string }[] = [
    { id: 'Hind Siliguri', name: 'হিন্দ শিলিগুড়ি', name_en: 'Hind Siliguri (Standard)', style: '"Hind Siliguri", sans-serif' },
    { id: 'Noto Serif Bengali', name: 'নোটো সেরিফ', name_en: 'Noto Serif (Classic)', style: '"Noto Serif Bengali", serif' },
    { id: 'Anek Bangla', name: 'অনেকা বাংলা', name_en: 'Anek Bangla (Modern Bold)', style: '"Anek Bangla", sans-serif' },
    { id: 'Tiro Bangla', name: 'তিরো বাংলা', name_en: 'Tiro Bangla (Traditional)', style: '"Tiro Bangla", serif' },
    { id: 'Inter', name: 'ইন্টার সান্স', name_en: 'Inter (Clean / English)', style: 'Inter, sans-serif' },
];

export const COLOR_PALETTES = [
    { hex: '#FFFFFF', name: 'সাদা' },
    { hex: '#FEF3C7', name: 'ক্রিম সোনালী' },
    { hex: '#F59E0B', name: 'উজ্জ্বল গোল্ড' },
    { hex: '#0B2559', name: 'গাঢ় নেভি' },
    { hex: '#1E3A8A', name: 'রয়েল ব্লু' },
    { hex: '#047857', name: 'পান্না সবুজ' },
    { hex: '#DC2626', name: 'রক্তিম লাল' },
    { hex: '#0F172A', name: 'কালো' },
];

export const DEFAULT_SLOTS_CONFIG: SlotsConfig = {
    photo_slot: {
        x: 260,
        y: -70,
        width: 40.5,
        height: 60,
        zoom: 1.0,
        shape: 'arch',
        border_radius: 16,
        hint: 'ডানের মেহরাব/খিলানের মাঝে ছবি বসবে',
    },
    date_slot: {
        enabled: true,
        x: 29.5,
        y: 44.8,
        font_size: 18,
        color: '#FFFFFF',
        font_family: 'Hind Siliguri',
        font_weight: 'bold',
        align: 'center',
        shadow: true,
    },
    time_slot: {
        enabled: true,
        x: 29.5,
        y: 48.5,
        font_size: 15,
        color: '#FEF3C7',
        font_family: 'Hind Siliguri',
        font_weight: '600',
        align: 'center',
        shadow: true,
    },
    venue_slot: {
        enabled: true,
        x: 28.8,
        y: 58.2,
        font_size: 19,
        color: '#0B2559',
        font_family: 'Hind Siliguri',
        font_weight: 'bold',
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
        font_family: 'Hind Siliguri',
        font_weight: '600',
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
        font_family: 'Anek Bangla',
        font_weight: '800',
        align: 'center',
        shadow: true,
    },
    name_slot: {
        enabled: true,
        x: 75.5,
        y: 87.5,
        font_size: 33,
        color: '#FFFFFF',
        font_family: 'Hind Siliguri',
        font_weight: 'bold',
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
            photo_slot: { x: -260, y: -70, width: 40.5, height: 60, zoom: 1.0, shape: 'arch', border_radius: 16, hint: 'বামের মেহরাবে ছবি বসবে' },
            date_slot: { enabled: true, x: 72, y: 44.8, font_size: 18, color: '#FFFFFF', font_family: 'Hind Siliguri', font_weight: 'bold', align: 'center', shadow: true },
            time_slot: { enabled: true, x: 72, y: 48.5, font_size: 15, color: '#FEF3C7', font_family: 'Hind Siliguri', font_weight: '600', align: 'center', shadow: true },
            venue_slot: { enabled: true, x: 72, y: 58.2, font_size: 19, color: '#0B2559', font_family: 'Hind Siliguri', font_weight: 'bold', align: 'center', max_width: 41, shadow: false },
            topic_slot: { enabled: true, x: 72, y: 64.8, font_size: 17, color: '#1E3A8A', font_family: 'Hind Siliguri', font_weight: '600', align: 'center', max_width: 41, shadow: false },
            badge_slot: { enabled: true, x: 47, y: 77.2, font_size: 17, color: '#FFFFFF', font_family: 'Anek Bangla', font_weight: '800', align: 'center', shadow: true },
            name_slot: { enabled: true, x: 26, y: 87.5, font_size: 33, color: '#FFFFFF', font_family: 'Hind Siliguri', font_weight: 'bold', align: 'center', max_width: 42, shadow: true },
        },
    },
    {
        id: 'center_circle',
        name: 'মাঝে সার্কেল ছবি + নিচে ব্যানার (প্রধান আলোচক)',
        name_en: 'Center Circle Speaker + Bottom Details',
        config: {
            photo_slot: { x: 0, y: -60, width: 46, height: 46, zoom: 1.0, shape: 'circle', border_radius: 9999, hint: 'মাঝের বৃত্তে ছবি বসবে' },
            date_slot: { enabled: true, x: 50, y: 12, font_size: 18, color: '#FFFFFF', font_family: 'Hind Siliguri', font_weight: 'bold', align: 'center', shadow: true },
            time_slot: { enabled: true, x: 50, y: 16, font_size: 15, color: '#FEF3C7', font_family: 'Hind Siliguri', font_weight: '600', align: 'center', shadow: true },
            venue_slot: { enabled: true, x: 50, y: 68, font_size: 18, color: '#0B2559', font_family: 'Hind Siliguri', font_weight: 'bold', align: 'center', max_width: 70, shadow: false },
            topic_slot: { enabled: true, x: 50, y: 74, font_size: 16, color: '#1E3A8A', font_family: 'Hind Siliguri', font_weight: '600', align: 'center', max_width: 75, shadow: false },
            badge_slot: { enabled: true, x: 50, y: 82, font_size: 16, color: '#FFFFFF', font_family: 'Anek Bangla', font_weight: '800', align: 'center', shadow: true },
            name_slot: { enabled: true, x: 50, y: 90, font_size: 32, color: '#FFFFFF', font_family: 'Hind Siliguri', font_weight: 'bold', align: 'center', max_width: 60, shadow: true },
        },
    },
    {
        id: 'top_photo',
        name: 'উপরে বড় ছবি + নিচে তথ্য (সেমিনার / ওয়াজ মাহফিল)',
        name_en: 'Top Photo Banner + Bottom Information',
        config: {
            photo_slot: { x: 0, y: -140, width: 85, height: 45, zoom: 1.0, shape: 'rectangle', border_radius: 0, hint: 'উপরের অংশে ছবি বসবে' },
            date_slot: { enabled: true, x: 25, y: 65, font_size: 17, color: '#FFFFFF', font_family: 'Hind Siliguri', font_weight: 'bold', align: 'center', shadow: true },
            time_slot: { enabled: true, x: 75, y: 65, font_size: 17, color: '#FEF3C7', font_family: 'Hind Siliguri', font_weight: '600', align: 'center', shadow: true },
            venue_slot: { enabled: true, x: 50, y: 74, font_size: 19, color: '#0B2559', font_family: 'Hind Siliguri', font_weight: 'bold', align: 'center', max_width: 80, shadow: false },
            topic_slot: { enabled: true, x: 50, y: 81, font_size: 17, color: '#1E3A8A', font_family: 'Hind Siliguri', font_weight: '600', align: 'center', max_width: 80, shadow: false },
            badge_slot: { enabled: true, x: 50, y: 88, font_size: 15, color: '#FFFFFF', font_family: 'Anek Bangla', font_weight: '800', align: 'center', shadow: true },
            name_slot: { enabled: true, x: 50, y: 94, font_size: 30, color: '#FFFFFF', font_family: 'Hind Siliguri', font_weight: 'bold', align: 'center', max_width: 70, shadow: true },
        },
    },
    {
        id: 'rounded_box',
        name: 'বামে রাউন্ডেড বক্স ছবি + ডানে কার্ড',
        name_en: 'Left Rounded Box + Right Details',
        config: {
            photo_slot: { x: -240, y: -60, width: 44, height: 55, zoom: 1.0, shape: 'rounded_rectangle', border_radius: 28, hint: 'বামের রাউন্ডেড বক্সে ছবি বসবে' },
            date_slot: { enabled: true, x: 72, y: 44, font_size: 18, color: '#FFFFFF', font_family: 'Hind Siliguri', font_weight: 'bold', align: 'center', shadow: true },
            time_slot: { enabled: true, x: 72, y: 48, font_size: 15, color: '#FEF3C7', font_family: 'Hind Siliguri', font_weight: '600', align: 'center', shadow: true },
            venue_slot: { enabled: true, x: 72, y: 58, font_size: 19, color: '#0B2559', font_family: 'Noto Serif Bengali', font_weight: 'bold', align: 'center', max_width: 44, shadow: false },
            topic_slot: { enabled: true, x: 72, y: 65, font_size: 17, color: '#1E3A8A', font_family: 'Anek Bangla', font_weight: '600', align: 'center', max_width: 44, shadow: false },
            badge_slot: { enabled: true, x: 47, y: 77, font_size: 17, color: '#FFFFFF', font_family: 'Anek Bangla', font_weight: '800', align: 'center', shadow: true },
            name_slot: { enabled: true, x: 28, y: 88, font_size: 32, color: '#FFFFFF', font_family: 'Tiro Bangla', font_weight: 'bold', align: 'center', max_width: 44, shadow: true },
        },
    },
];

export const getShapeBorderRadius = (shape?: string, borderRadius: number = 16) => {
    switch (shape) {
        case 'circle': return '9999px';
        case 'arch': return '140px 140px 16px 16px';
        case 'oval': return '50%';
        case 'rounded_rectangle': return `${borderRadius}px`;
        case 'rectangle': return '0px';
        default: return '16px';
    }
};

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

    const photoShape = config.photo_slot.shape || 'arch';
    const borderRadius = config.photo_slot.border_radius ?? 16;
    const shapeRadiusStyle = getShapeBorderRadius(photoShape, borderRadius);

    // Exact placement for the photo target container
    const photoLeft = `calc(50% + ${(config.photo_slot.x / 1080) * 100}% - ${(config.photo_slot.width || 40.5) / 2}%)`;
    const photoTop = `calc(50% + ${(config.photo_slot.y / 1080) * 100}% - ${(config.photo_slot.height || 60) / 2}%)`;

    return (
        <div className="space-y-6">
            {/* Header Notice */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sliders className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-blue-950">
                        ফ্রেমের স্লট, ফন্ট ও কালার কনফিগারেশন (Admin Slot Fixer)
                    </h3>
                    <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
                        প্রতিটি লেখার উপাদান (তারিখ, সময়, স্থান, বিষয়, পদবি ও নাম)-এর জন্য আলাদা ফন্ট, সাইজ, টেক্সট কালার এবং ছবির বিভিন্ন শেপ (খিলান, সার্কেল, রেকটাংগেল ইত্যাদি) ফিক্স করে দিন। 
                        সাধারণ ব্যবহারকারী শুধুমাত্র লিখলেই সঠিক সাইজে স্বয়ংক্রিয়ভাবে ফ্রেম হয়ে যাবে!
                    </p>
                </div>
            </div>

            {/* Quick Layout Presets */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-blue-600" />
                    <span>১-ক্লিকে রেডিমেড লেআউট প্রিসেট সিলেক্ট করুন:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
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

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Visual Canvas Display with Overlay Markers */}
                <div className="lg:col-span-6 flex flex-col items-center">
                    <div className="w-full bg-slate-900 rounded-3xl p-3 border border-slate-800 shadow-xl relative overflow-hidden">
                        <div className="flex items-center justify-between px-2 pb-2 text-[11px] font-bold text-slate-300">
                            <span className="flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5 text-blue-400" />
                                <span>লাইভ পজিশন ও ফন্ট প্রিভিউ (Live Overlay)</span>
                            </span>
                            <span className="text-[10px] text-slate-400">১০৮০×১০৮০ ক্যানভাস</span>
                        </div>

                        {/* Relative Visual Container */}
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 select-none">
                            {/* Frame PNG */}
                            {frameUrl && (
                                <img
                                    src={frameUrl}
                                    alt="Frame Preview"
                                    className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
                                />
                            )}

                            {/* Photo Slot Cutout Highlight Target */}
                            <div
                                onClick={() => setActiveSlot('photo')}
                                style={{
                                    left: photoLeft,
                                    top: photoTop,
                                    width: `${config.photo_slot.width || 40.5}%`,
                                    height: `${config.photo_slot.height || 60}%`,
                                    borderRadius: shapeRadiusStyle,
                                }}
                                className={`absolute z-0 border-2 border-dashed border-emerald-400 bg-emerald-500/20 backdrop-blur-2xs flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all ${
                                    activeSlot === 'photo' ? 'ring-4 ring-emerald-400 shadow-xl bg-emerald-500/30' : 'hover:bg-emerald-500/30'
                                }`}
                            >
                                <Camera className="w-5 h-5 text-emerald-300 mb-1" />
                                <span className="text-[10px] font-black text-emerald-100">
                                    ছবির স্থান ({config.photo_slot.shape || 'arch'})
                                </span>
                            </div>

                            {/* Date Slot Marker */}
                            {config.date_slot.enabled && (
                                <div
                                    onClick={() => setActiveSlot('date')}
                                    style={{
                                        left: `${config.date_slot.x}%`,
                                        top: `${config.date_slot.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        color: config.date_slot.color || '#FFFFFF',
                                        fontSize: `${Math.round((config.date_slot.font_size || 18) * 0.55)}px`,
                                        fontFamily: config.date_slot.font_family || 'Hind Siliguri',
                                        fontWeight: config.date_slot.font_weight || 'bold',
                                    }}
                                    className={`absolute z-20 whitespace-nowrap cursor-pointer px-1.5 py-0.5 rounded transition-all drop-shadow-md ${
                                        activeSlot === 'date' ? 'ring-2 ring-white bg-blue-600/80 shadow-lg scale-105' : 'hover:bg-white/20'
                                    }`}
                                >
                                    📅 ২১ নভেম্বর ২০২৬
                                </div>
                            )}

                            {/* Time Slot Marker */}
                            {config.time_slot.enabled && (
                                <div
                                    onClick={() => setActiveSlot('time')}
                                    style={{
                                        left: `${config.time_slot.x}%`,
                                        top: `${config.time_slot.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        color: config.time_slot.color || '#FEF3C7',
                                        fontSize: `${Math.round((config.time_slot.font_size || 15) * 0.55)}px`,
                                        fontFamily: config.time_slot.font_family || 'Hind Siliguri',
                                        fontWeight: config.time_slot.font_weight || '600',
                                    }}
                                    className={`absolute z-20 whitespace-nowrap cursor-pointer px-1.5 py-0.5 rounded transition-all drop-shadow-md ${
                                        activeSlot === 'time' ? 'ring-2 ring-white bg-amber-600/80 shadow-lg scale-105' : 'hover:bg-white/20'
                                    }`}
                                >
                                    ⏰ দুপুর ১:৩০ মি.
                                </div>
                            )}

                            {/* Venue Slot Marker */}
                            {config.venue_slot.enabled && (
                                <div
                                    onClick={() => setActiveSlot('venue')}
                                    style={{
                                        left: `${config.venue_slot.x}%`,
                                        top: `${config.venue_slot.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        color: config.venue_slot.color || '#0B2559',
                                        fontSize: `${Math.round((config.venue_slot.font_size || 19) * 0.55)}px`,
                                        fontFamily: config.venue_slot.font_family || 'Hind Siliguri',
                                        fontWeight: config.venue_slot.font_weight || 'bold',
                                    }}
                                    className={`absolute z-20 whitespace-nowrap cursor-pointer px-1.5 py-0.5 rounded transition-all drop-shadow-md ${
                                        activeSlot === 'venue' ? 'ring-2 ring-white bg-indigo-600/80 shadow-lg scale-105' : 'hover:bg-white/20'
                                    }`}
                                >
                                    📍 বায়তুল মোকাররম
                                </div>
                            )}

                            {/* Topic Slot Marker */}
                            {config.topic_slot.enabled && (
                                <div
                                    onClick={() => setActiveSlot('topic')}
                                    style={{
                                        left: `${config.topic_slot.x}%`,
                                        top: `${config.topic_slot.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        color: config.topic_slot.color || '#1E3A8A',
                                        fontSize: `${Math.round((config.topic_slot.font_size || 17) * 0.55)}px`,
                                        fontFamily: config.topic_slot.font_family || 'Hind Siliguri',
                                        fontWeight: config.topic_slot.font_weight || '600',
                                    }}
                                    className={`absolute z-20 whitespace-nowrap cursor-pointer px-1.5 py-0.5 rounded transition-all drop-shadow-md ${
                                        activeSlot === 'topic' ? 'ring-2 ring-white bg-emerald-600/80 shadow-lg scale-105' : 'hover:bg-white/20'
                                    }`}
                                >
                                    📄 খুতবার গুরুত্ব
                                </div>
                            )}

                            {/* Badge Slot Marker */}
                            {config.badge_slot.enabled && (
                                <div
                                    onClick={() => setActiveSlot('badge')}
                                    style={{
                                        left: `${config.badge_slot.x}%`,
                                        top: `${config.badge_slot.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        color: config.badge_slot.color || '#FFFFFF',
                                        fontSize: `${Math.round((config.badge_slot.font_size || 17) * 0.55)}px`,
                                        fontFamily: config.badge_slot.font_family || 'Anek Bangla',
                                        fontWeight: config.badge_slot.font_weight || '800',
                                    }}
                                    className={`absolute z-20 whitespace-nowrap cursor-pointer px-1.5 py-0.5 rounded transition-all drop-shadow-md ${
                                        activeSlot === 'badge' ? 'ring-2 ring-white bg-amber-500 shadow-lg scale-105' : 'hover:bg-white/20'
                                    }`}
                                >
                                    🏷️ খতীব
                                </div>
                            )}

                            {/* Name Slot Marker */}
                            {config.name_slot.enabled && (
                                <div
                                    onClick={() => setActiveSlot('name')}
                                    style={{
                                        left: `${config.name_slot.x}%`,
                                        top: `${config.name_slot.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        color: config.name_slot.color || '#FFFFFF',
                                        fontSize: `${Math.round((config.name_slot.font_size || 33) * 0.55)}px`,
                                        fontFamily: config.name_slot.font_family || 'Hind Siliguri',
                                        fontWeight: config.name_slot.font_weight || 'bold',
                                    }}
                                    className={`absolute z-20 whitespace-nowrap cursor-pointer px-2 py-0.5 rounded transition-all drop-shadow-md ${
                                        activeSlot === 'name' ? 'ring-2 ring-white bg-blue-600 shadow-lg scale-105' : 'hover:bg-white/20'
                                    }`}
                                >
                                    👤 মাওলানা মুফতি আব্দুল্লাহ
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Slot Inspector & Controls Panel */}
                <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-5">
                    {/* Slot Select Tabs */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">
                            পজিশন, ফন্ট ও কালার এডিট করতে উপাদান সিলেক্ট করুন:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { id: 'photo', label: '📸 ছবির স্থান ও শেপ', activeColor: 'bg-emerald-600 text-white' },
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
                                <span className="text-xs font-black text-gray-900">
                                    ছবির কাটআউট উইন্ডো ও আকৃতি কনফিগারেশন
                                </span>
                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full capitalize">
                                    {config.photo_slot.shape || 'arch'}
                                </span>
                            </div>

                            {/* Cutout Shape Selector (Circle, Rectangle, Arch, Rounded, Oval) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 block">
                                    কাটআউট আকৃতি (Cutout Shape)
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {[
                                        { id: 'arch', label: 'মসজিদ খিলান / মেহরাব', icon: Shapes },
                                        { id: 'circle', label: 'বৃত্তাকার (Circle)', icon: Circle },
                                        { id: 'rectangle', label: 'আয়তাকার (Rectangle)', icon: Square },
                                        { id: 'rounded_rectangle', label: 'রাউন্ডেড কর্নার বক্স', icon: Square },
                                        { id: 'oval', label: 'ওভাল / উপবৃত্ত (Oval)', icon: Circle },
                                    ].map((s) => {
                                        const Icon = s.icon;
                                        return (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => updatePhotoSlot({ shape: s.id as any })}
                                                className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center gap-2 ${
                                                    (config.photo_slot.shape || 'arch') === s.id
                                                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100'
                                                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                                                }`}
                                            >
                                                <Icon className="w-3.5 h-3.5 shrink-0" />
                                                <span className="leading-tight">{s.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Rounded Rectangle Radius Slider */}
                            {config.photo_slot.shape === 'rounded_rectangle' && (
                                <div className="space-y-1 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                    <div className="flex justify-between text-xs font-bold text-emerald-900">
                                        <span>কর্নার রেডিয়াস (Border Radius)</span>
                                        <span>{config.photo_slot.border_radius ?? 24} px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="4"
                                        max="80"
                                        step="2"
                                        value={config.photo_slot.border_radius ?? 24}
                                        onChange={(e) => updatePhotoSlot({ border_radius: parseInt(e.target.value) })}
                                        className="w-full accent-emerald-600 cursor-pointer"
                                    />
                                </div>
                            )}

                            {/* Window Width & Height Sliders */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[11px] font-bold text-gray-700">
                                        <span>উইন্ডো প্রস্থ (Width %)</span>
                                        <span>{config.photo_slot.width || 40}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="15"
                                        max="95"
                                        step="1"
                                        value={config.photo_slot.width || 40}
                                        onChange={(e) => updatePhotoSlot({ width: parseInt(e.target.value) })}
                                        className="w-full accent-emerald-600 cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[11px] font-bold text-gray-700">
                                        <span>উইন্ডো উচ্চতা (Height %)</span>
                                        <span>{config.photo_slot.height || 60}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="15"
                                        max="95"
                                        step="1"
                                        value={config.photo_slot.height || 60}
                                        onChange={(e) => updatePhotoSlot({ height: parseInt(e.target.value) })}
                                        className="w-full accent-emerald-600 cursor-pointer"
                                    />
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
                                    min="-450"
                                    max="450"
                                    step="5"
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
                                    min="-450"
                                    max="450"
                                    step="5"
                                    value={config.photo_slot.y}
                                    onChange={(e) => updatePhotoSlot({ y: parseInt(e.target.value) })}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                            </div>

                            {/* Initial Zoom Slider */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-gray-700">
                                    <span>ডিফল্ট ছবির জুম (Default Zoom)</span>
                                    <span>{Math.round((config.photo_slot.zoom || 1.0) * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2.5"
                                    step="0.05"
                                    value={config.photo_slot.zoom || 1.0}
                                    onChange={(e) => updatePhotoSlot({ zoom: parseFloat(e.target.value) })}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                            </div>
                        </div>
                    )}

                    {/* CONTROLS FOR INDIVIDUAL TEXT SLOTS */}
                    {activeSlot !== 'photo' && (() => {
                        const slotKey = `${activeSlot}_slot` as keyof Omit<SlotsConfig, 'photo_slot'>;
                        const item = config[slotKey];

                        return (
                            <div className="space-y-5 pt-2 border-t border-gray-100 animate-in fade-in duration-150">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-gray-900 uppercase">
                                        {activeSlot === 'date' && '📅 তারিখ স্লট কনফিগারেশন'}
                                        {activeSlot === 'time' && '⏰ সময় স্লট কনফিগারেশন'}
                                        {activeSlot === 'venue' && '📍 স্থান / মসজিদ স্লট কনফিগারেশন'}
                                        {activeSlot === 'topic' && '📄 আলোচ্য বিষয় স্লট কনফিগারেশন'}
                                        {activeSlot === 'badge' && '🏷️ পদবি ব্যাজ কনফিগারেশন'}
                                        {activeSlot === 'name' && '👤 বক্তা / ব্যবহারকারীর নাম কনফিগারেশন'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => updateTextSlot(slotKey, { enabled: !item.enabled })}
                                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                                            item.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                                        }`}
                                    >
                                        {item.enabled ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Disabled)'}
                                    </button>
                                </div>

                                {/* 1. INDIVIDUAL FONT FAMILY SELECTOR */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <Type className="w-3.5 h-3.5 text-blue-600" />
                                            <span>এই স্লটের নির্দিষ্ট ফন্ট (Font Family)</span>
                                        </span>
                                        <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                                            {item.font_family || 'Hind Siliguri'}
                                        </span>
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {FONT_OPTIONS.map((f) => (
                                            <button
                                                key={f.id}
                                                type="button"
                                                onClick={() => updateTextSlot(slotKey, { font_family: f.id })}
                                                className={`p-2 rounded-xl text-left border transition-all ${
                                                    (item.font_family || 'Hind Siliguri') === f.id
                                                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-100 font-bold'
                                                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                                                }`}
                                            >
                                                <span className="block text-xs" style={{ fontFamily: f.style }}>
                                                    {f.name}
                                                </span>
                                                <span className="block text-[9px] text-gray-400">
                                                    {f.id}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. INDIVIDUAL FONT WEIGHT & ALIGNMENT */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Font Weight */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 block">ফন্ট বোল্ডনেস (Weight)</label>
                                        <select
                                            value={item.font_weight || 'bold'}
                                            onChange={(e) => updateTextSlot(slotKey, { font_weight: e.target.value as any })}
                                            className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-200 font-medium"
                                        >
                                            <option value="normal">Normal (৪০০)</option>
                                            <option value="500">Medium (৫০০)</option>
                                            <option value="600">Semi-Bold (৬০০)</option>
                                            <option value="bold">Bold (৭০০)</option>
                                            <option value="800">Extra-Bold (৮০০)</option>
                                        </select>
                                    </div>

                                    {/* Alignment */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-700 block">অ্যালাইনমেন্ট</label>
                                        <div className="flex gap-1">
                                            {[
                                                { id: 'left', icon: AlignLeft },
                                                { id: 'center', icon: AlignCenter },
                                                { id: 'right', icon: AlignRight },
                                            ].map((a) => {
                                                const Icon = a.icon;
                                                return (
                                                    <button
                                                        key={a.id}
                                                        type="button"
                                                        onClick={() => updateTextSlot(slotKey, { align: a.id as any })}
                                                        className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center transition-all ${
                                                            (item.align || 'center') === a.id
                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <Icon className="w-3.5 h-3.5" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* 3. INDIVIDUAL FONT SIZE SLIDER */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-gray-700">
                                        <span>ফন্ট সাইজ (Font Size px)</span>
                                        <span className="text-blue-600 font-black">{item.font_size || 18} px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="90"
                                        step="1"
                                        value={item.font_size || 18}
                                        onChange={(e) => updateTextSlot(slotKey, { font_size: parseInt(e.target.value) })}
                                        className="w-full accent-blue-600 cursor-pointer"
                                    />
                                </div>

                                {/* 4. INDIVIDUAL COLOR PICKER & PALETTE SWATCHES */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 block">
                                        এই লেখার কালার (Text Color)
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={item.color || '#FFFFFF'}
                                            onChange={(e) => updateTextSlot(slotKey, { color: e.target.value })}
                                            className="w-9 h-9 rounded-xl cursor-pointer border border-gray-200 p-0.5 shrink-0"
                                        />
                                        <input
                                            type="text"
                                            value={item.color || '#FFFFFF'}
                                            onChange={(e) => updateTextSlot(slotKey, { color: e.target.value })}
                                            className="w-24 px-2 py-1 text-xs font-mono rounded-lg border border-gray-200 uppercase"
                                        />
                                        {/* Quick Color Swatches */}
                                        <div className="flex flex-wrap gap-1">
                                            {COLOR_PALETTES.map((c) => (
                                                <button
                                                    key={c.hex}
                                                    type="button"
                                                    title={c.name}
                                                    onClick={() => updateTextSlot(slotKey, { color: c.hex })}
                                                    style={{ backgroundColor: c.hex }}
                                                    className={`w-6 h-6 rounded-lg border transition-all ${
                                                        (item.color || '#FFFFFF').toUpperCase() === c.hex.toUpperCase()
                                                            ? 'ring-2 ring-blue-500 scale-110 shadow-xs border-transparent'
                                                            : 'border-gray-300 hover:scale-105'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 5. POSITION X & Y SLIDERS */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] font-bold text-gray-700">
                                            <span>X পজিশন %</span>
                                            <span>{item.x}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="2"
                                            max="98"
                                            step="0.5"
                                            value={item.x}
                                            onChange={(e) => updateTextSlot(slotKey, { x: parseFloat(e.target.value) })}
                                            className="w-full accent-blue-600 cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] font-bold text-gray-700">
                                            <span>Y পজিশন %</span>
                                            <span>{item.y}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="2"
                                            max="98"
                                            step="0.5"
                                            value={item.y}
                                            onChange={(e) => updateTextSlot(slotKey, { y: parseFloat(e.target.value) })}
                                            className="w-full accent-blue-600 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* 6. MAX WIDTH & DROP SHADOW */}
                                <div className="grid grid-cols-2 gap-3 pt-1">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[11px] font-bold text-gray-700">
                                            <span>সর্বোচ্চ লাইন প্রস্থ (%)</span>
                                            <span>{item.max_width || 50}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="15"
                                            max="95"
                                            step="1"
                                            value={item.max_width || 50}
                                            onChange={(e) => updateTextSlot(slotKey, { max_width: parseInt(e.target.value) })}
                                            className="w-full accent-blue-600 cursor-pointer"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-gray-700 block">ড্রপ শ্যাডো (ছায়া)</label>
                                        <button
                                            type="button"
                                            onClick={() => updateTextSlot(slotKey, { shadow: !item.shadow })}
                                            className={`w-full py-2 rounded-xl text-xs font-bold border transition-colors ${
                                                item.shadow
                                                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                    : 'bg-gray-50 border-gray-200 text-gray-500'
                                            }`}
                                        >
                                            {item.shadow ? 'ছায়া অন (High Contrast)' : 'ছায়া বন্ধ (None)'}
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
