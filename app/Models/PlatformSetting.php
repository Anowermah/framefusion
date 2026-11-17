<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class PlatformSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
    ];

    public static function defaults(): array
    {
        return [
            // Branding & General
            'site_name' => 'FrameFusion',
            'site_tagline' => 'Create. Customize. Celebrate.',
            'site_logo' => '',
            'site_favicon' => '/favicon.ico',
            'primary_color' => '#635BFF',
            'footer_text' => 'FrameFusion. All rights reserved. High-Performance Campaign & Twibbon Platform.',

            // Contact & Social
            'contact_email' => 'support@framefusion.io',
            'contact_phone' => '+880 1700-000000',
            'contact_address' => 'Dhaka, Bangladesh',
            'social_facebook' => 'https://facebook.com',
            'social_twitter' => 'https://x.com',
            'social_instagram' => 'https://instagram.com',
            'social_youtube' => 'https://youtube.com',
            'social_whatsapp' => '',

            // Hero & Homepage Content
            'hero_badge' => '✨ The #1 Campaign Frame Platform',
            'hero_title' => 'Create Stunning Campaign Frames in Seconds',
            'hero_subtitle' => 'Support campaigns, celebrate occasions, and personalize custom photo frames effortlessly.',
            'hero_cta_text' => 'Explore Frames',
            'hero_secondary_cta_text' => 'Create Campaign',
            'announcement_text' => '',
            'announcement_enabled' => false,

            // Feature Flags
            'allow_guest_downloads' => true,
            'require_campaign_approval' => false,
            'google_login_enabled' => true,
            'maintenance_mode' => false,

            // Twibbonize & Advanced Campaign Engine
            'enable_campaign_captions' => true,
            'default_campaign_hashtags' => '#FrameFusion #Campaign #PhotoFrame',
            'enable_qr_code_sharing' => true,
            'enable_watermark' => false,
            'watermark_text' => 'FrameFusion',
            'watermark_position' => 'bottom_right',
            'enable_external_action_links' => true,
            'allow_multi_frame_campaigns' => true,
            'max_frames_per_campaign' => 5,

            // SEO & Analytics
            'meta_title' => 'FrameFusion - Custom Photo Campaign & Twibbon Platform',
            'meta_description' => 'Create, customize, and celebrate visual photo campaigns and twibbons effortlessly.',
            'meta_keywords' => 'twibbon, photo frame, campaign, profile frame, photo editor, twibbon bangladesh, framefusion',
            'og_default_image' => '',
            'twitter_handle' => '@FrameFusion',
            'google_site_verification' => '',
            'google_analytics_id' => '',
            'custom_header_scripts' => '',
            'custom_footer_scripts' => '',

            // Page Contents
            'page_about_content' => '',
            'page_privacy_content' => '',
            'page_terms_content' => '',

            // AI Assistant & Chatbot Studio Controls
            'ai_assistant_enabled' => true,
            'ai_chat_widget_enabled' => true,
            'ai_studio_page_enabled' => true,
            'ai_bot_name' => 'FrameFusion AI',
            'ai_bot_name_bn' => 'ফ্রেমফিউশন এআই',
            'ai_welcome_message_bn' => 'স্বাগতম! আপনি কী ধরণের ফ্রেম তৈরি বা খুঁজতে চান? আমাকে জানান (যেমন: বিজয় দিবস, জন্মদিন, মাহফিল বা রাজনৈতিক পোস্টার)।',
            'ai_welcome_message_en' => 'Welcome! What kind of campaign frame are you looking for or creating? Tell me (e.g. Victory Day, Birthday, Notice Poster)!',
            'ai_suggestions' => "বিজয় দিবসের ফ্রেম\nজন্মদিনের শুভেচ্ছা ফ্রেম\nমাহফিল নোটিশ পোস্টার\nসাধারণ ফ্রেম",
            'gemini_api_key' => '',
            'ai_auto_center_enabled' => true,
        ];
    }

    public static function get(string $key, $default = null)
    {
        try {
            if (!Schema::hasTable('platform_settings')) {
                return $default ?? (static::defaults()[$key] ?? null);
            }

            $setting = static::where('key', $key)->first();
            if (!$setting) {
                return $default ?? (static::defaults()[$key] ?? null);
            }

            return match ($setting->type) {
                'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
                'integer' => (int) $setting->value,
                'json' => json_decode($setting->value, true),
                default => $setting->value,
            };
        } catch (\Throwable $e) {
            return $default ?? (static::defaults()[$key] ?? null);
        }
    }

    public static function set(string $key, $value, ?string $type = null)
    {
        try {
            if (!Schema::hasTable('platform_settings')) {
                return null;
            }

            if ($type === null) {
                $type = is_bool($value) ? 'boolean' : (is_int($value) ? 'integer' : (is_array($value) ? 'json' : 'string'));
            }

            $storedValue = match ($type) {
                'boolean' => $value ? '1' : '0',
                'json' => json_encode($value),
                default => (string) $value,
            };

            return static::updateOrCreate(
                ['key' => $key],
                ['value' => $storedValue, 'type' => $type]
            );
        } catch (\Throwable $e) {
            return null;
        }
    }

    public static function allKeyMap(): array
    {
        $defaults = static::defaults();

        try {
            if (!Schema::hasTable('platform_settings')) {
                return $defaults;
            }

            $saved = static::all();
            foreach ($saved as $item) {
                $defaults[$item->key] = match ($item->type) {
                    'boolean' => filter_var($item->value, FILTER_VALIDATE_BOOLEAN),
                    'integer' => (int) $item->value,
                    'json' => json_decode($item->value, true),
                    default => $item->value,
                };
            }

            return $defaults;
        } catch (\Throwable $e) {
            return $defaults;
        }
    }
}
