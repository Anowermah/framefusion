<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\CampaignFrame;
use App\Models\CampaignSupporter;
use App\Models\Category;
use App\Models\GalleryPost;
use App\Models\PlatformSetting;
use App\Models\User;
use App\Services\FrameGeneratorService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Generate PNG transparent frames
        $frames = FrameGeneratorService::generateSampleFrames();

        // 2. Default Platform Settings
        PlatformSetting::set('site_name', 'FrameFusion');
        PlatformSetting::set('site_tagline', 'Create. Customize. Celebrate.');
        PlatformSetting::set('primary_color', '#635BFF');
        PlatformSetting::set('secondary_color', '#8B5CF6');
        PlatformSetting::set('accent_color', '#FF6B8A');
        PlatformSetting::set('allow_guest_downloads', true, 'boolean');
        PlatformSetting::set('enable_moderation', false, 'boolean');
        PlatformSetting::set('contact_email', 'support@framefusion.io');

        // 3. Create Admin & Creator Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@framefusion.com'],
            [
                'name' => 'FrameFusion Admin',
                'username' => 'admin',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'bio' => 'Official platform administrator for FrameFusion.',
                'status' => 'active',
            ]
        );

        $creator = User::firstOrCreate(
            ['email' => 'creator@framefusion.com'],
            [
                'name' => 'Rahim Creative Studio',
                'username' => 'rahim_studio',
                'password' => Hash::make('password123'),
                'role' => 'creator',
                'bio' => 'Visual artist and campaign designer crafting viral twibbons.',
                'status' => 'active',
            ]
        );

        $demoUser = User::firstOrCreate(
            ['email' => 'user@framefusion.com'],
            [
                'name' => 'Ayesha Khan',
                'username' => 'ayesha_k',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'bio' => 'Student activist and design enthusiast.',
                'status' => 'active',
            ]
        );

        // 4. Categories with English and Bengali translations
        $categoryData = [
            [
                'name' => 'National & Festivals',
                'name_bn' => 'জাতীয় ও উৎসব',
                'slug' => 'national-festivals',
                'icon' => 'Flag',
                'description' => 'Celebrate national holidays, independence, and joyous cultural festivals.',
                'description_bn' => 'জাতীয় দিবস, স্বাধীনতা এবং আনন্দময় সাংস্কৃতিক উৎসব উদযাপন করুন।',
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'name' => 'Education & University',
                'name_bn' => 'শিক্ষা ও বিশ্ববিদ্যালয়',
                'slug' => 'education-university',
                'icon' => 'GraduationCap',
                'description' => 'Convocation, university batches, admission, and school spirit frames.',
                'description_bn' => 'সমাবর্তন, বিশ্ববিদ্যালয় ব্যাচ, ভর্তি এবং শিক্ষা প্রতিষ্ঠানের ক্যাম্পেইন ফ্রেম।',
                'is_featured' => true,
                'order' => 2,
            ],
            [
                'name' => 'Technology & Innovation',
                'name_bn' => 'প্রযুক্তি ও উদ্ভাবন',
                'slug' => 'technology-innovation',
                'icon' => 'Cpu',
                'description' => 'Tech conferences, AI meetups, hackathons, and developer rallies.',
                'description_bn' => 'প্রযুক্তি সম্মেলন, এআই মিটআপ, হ্যাকাথন এবং ডেভেলপারদের ক্যাম্পেইন।',
                'is_featured' => true,
                'order' => 3,
            ],
            [
                'name' => 'Social Awareness',
                'name_bn' => 'সামাজিক সচেতনতা',
                'slug' => 'social-awareness',
                'icon' => 'HeartHandshake',
                'description' => 'Health awareness, climate action, charity drives, and community causes.',
                'description_bn' => 'স্বাস্থ্য সচেতনতা, জলবায়ু সুরক্ষা, দান ও জনকল্যাণমূলক সামাজিক উদ্যোগ।',
                'is_featured' => true,
                'order' => 4,
            ],
            [
                'name' => 'Sports & Gaming',
                'name_bn' => 'খেলাধুলা ও গেমিং',
                'slug' => 'sports-gaming',
                'icon' => 'Trophy',
                'description' => 'World cup fever, premier leagues, esports tournaments, and team cheers.',
                'description_bn' => 'বিশ্বকাপ উত্তেজনা, প্রিমিয়ার লিগ, ই-স্পোর্টস এবং প্রিয় দলের সমর্থন।',
                'is_featured' => true,
                'order' => 5,
            ],
            [
                'name' => 'Business & Branding',
                'name_bn' => 'ব্যবসা ও ব্র্যান্ডিং',
                'slug' => 'business-branding',
                'icon' => 'Briefcase',
                'description' => 'Corporate milestones, webinars, hiring announcements, and company pride.',
                'description_bn' => 'কর্পোরেট মাইলফলক, ওয়েবিনার, নিয়োগ বিজ্ঞপ্তি এবং প্রতিষ্ঠানের প্রচার।',
                'is_featured' => false,
                'order' => 6,
            ],
        ];

        $categories = [];
        foreach ($categoryData as $data) {
            $categories[$data['slug']] = Category::firstOrCreate(['slug' => $data['slug']], $data);
        }

        // 5. Campaigns
        $campaignData = [
            [
                'title' => 'Bangladesh Independence Day 2026',
                'title_bn' => 'মহান স্বাধীনতা ও জাতীয় দিবস ২০২৬',
                'slug' => 'bangladesh-independence-day',
                'category_slug' => 'national-festivals',
                'frame_file' => 'bangladesh-independence.png',
                'description' => 'Commemorate the heroic sacrifice of our martyrs and celebrate 55 years of proud freedom and unity with our official national frame.',
                'description_bn' => 'আমাদের বীর শহীদদের আত্মত্যাগের প্রতি শ্রদ্ধা নিবেদন করে ও গর্বিত স্বাধীনতার ৫৫ বছর উদযাপন করতে যুক্ত হন আমাদের অফিসিয়াল ফ্রেমে।',
                'supporters_count' => 14250,
                'views_count' => 38900,
                'is_trending' => true,
                'is_featured' => true,
                'tags' => 'independence,bangladesh,26march,freedom,victory',
            ],
            [
                'title' => 'Class of 2026 Graduation Pride',
                'title_bn' => 'ক্লাস অফ ২০২৬ গ্র্যাজুয়েশন সেলিব্রেশন',
                'slug' => 'class-of-2026-graduation-pride',
                'category_slug' => 'education-university',
                'frame_file' => 'graduation-2026.png',
                'description' => 'You did it! Wear your graduation cap proudly, customize your convocation photo, and share your milestone with friends and family.',
                'description_bn' => 'আপনার গ্র্যাজুয়েশন অর্জনকে স্মরণীয় করে রাখুন এবং সমাবর্তনের আনন্দ বন্ধুদের সাথে শেয়ার করুন।',
                'supporters_count' => 9820,
                'views_count' => 24100,
                'is_trending' => true,
                'is_featured' => true,
                'tags' => 'graduation,convocation,classof2026,university,achievement',
            ],
            [
                'title' => 'Future AI & Global Tech Summit',
                'title_bn' => 'ফিউচার এআই ও গ্লোবাল টেক সামিট',
                'slug' => 'future-ai-tech-summit-2026',
                'category_slug' => 'technology-innovation',
                'frame_file' => 'tech-summit-2026.png',
                'description' => 'Official attendee, speaker, and delegate badge frame for the premier Artificial Intelligence and Cloud Innovation conference.',
                'description_bn' => 'বিশ্বসেরা এআই ও প্রযুক্তি সম্মেলনের প্রতিনিধি ও ডেলিগেটদের অফিসিয়াল ফ্রেম।',
                'supporters_count' => 6430,
                'views_count' => 18700,
                'is_trending' => true,
                'is_featured' => true,
                'tags' => 'ai,tech,conference,developer,summit',
            ],
            [
                'title' => 'Earth Hour & Climate Action Champion',
                'title_bn' => 'ধরিত্রী রক্ষা ও জলবায়ু সচেতনতা আন্দোলন',
                'slug' => 'earth-hour-climate-champion',
                'category_slug' => 'social-awareness',
                'frame_file' => 'earth-day.png',
                'description' => 'Stand up for renewable energy, environmental justice, and reforestation. Join thousands of youth pledging for our green planet.',
                'description_bn' => 'একটি সবুজ ও বাসযোগ্য পৃথিবীর প্রত্যয়ে জলবায়ু সুরক্ষা আন্দোলনে একাত্মতা প্রকাশ করুন।',
                'supporters_count' => 5210,
                'views_count' => 13400,
                'is_trending' => false,
                'is_featured' => true,
                'tags' => 'earth,green,climate,nature,environment',
            ],
            [
                'title' => 'Champions Football League Carnival',
                'title_bn' => 'চ্যাম্পিয়ন্স ফুটবল ফ্যান কার্নিভাল',
                'slug' => 'champions-football-carnival',
                'category_slug' => 'sports-gaming',
                'frame_file' => 'champions-league.png',
                'description' => 'Unite with your fellow supporters, gear up for the grand finals, and show your team devotion with this stadium frame.',
                'description_bn' => 'ফুটবল উন্মাদনায় মেতে উঠুন এবং আপনার প্রিয় ক্লাবের সমর্থনে প্রোফাইল ছবি সাজিয়ে নিন।',
                'supporters_count' => 8740,
                'views_count' => 29800,
                'is_trending' => true,
                'is_featured' => false,
                'tags' => 'football,soccer,champions,matchday,sports',
            ],
            [
                'title' => 'Eid Mubarak Festive Greetings',
                'title_bn' => 'ঈদ মোবারক শুভেচ্ছা ও আনন্দবার্তা',
                'slug' => 'eid-mubarak-festive-greetings',
                'category_slug' => 'national-festivals',
                'frame_file' => 'eid-mubarak.png',
                'description' => 'Spread festive love, harmony, and warm smiles with our elegant crescent and lantern greeting frame.',
                'description_bn' => 'পবিত্র ঈদের আনন্দ ছড়িয়ে দিন সবার মাঝে আমাদের নান্দনিক ফ্রেমের মাধ্যমে।',
                'supporters_count' => 11200,
                'views_count' => 31500,
                'is_trending' => true,
                'is_featured' => true,
                'tags' => 'eid,mubarak,celebration,festive,islamic',
            ],
        ];

        foreach ($campaignData as $camp) {
            $cat = $categories[$camp['category_slug']] ?? null;
            $frameUrl = $frames[$camp['frame_file']] ?? ('/storage/frames/' . $camp['frame_file']);

            $campaign = Campaign::updateOrCreate(
                ['slug' => $camp['slug']],
                [
                    'creator_id' => $creator->id,
                    'category_id' => $cat?->id,
                    'title' => $camp['title'],
                    'title_bn' => $camp['title_bn'],
                    'description' => $camp['description'],
                    'description_bn' => $camp['description_bn'],
                    'campaign_type' => 'frame',
                    'frame_url' => $frameUrl,
                    'thumbnail_url' => $frameUrl,
                    'status' => 'published',
                    'visibility' => 'public',
                    'is_featured' => $camp['is_featured'],
                    'is_trending' => $camp['is_trending'],
                    'supporters_count' => $camp['supporters_count'],
                    'views_count' => $camp['views_count'],
                    'start_date' => now()->subDays(10),
                    'end_date' => now()->addDays(60),
                    'tags' => $camp['tags'],
                ]
            );

            // Add Frame config
            CampaignFrame::updateOrCreate(
                ['campaign_id' => $campaign->id],
                [
                    'frame_url' => $frameUrl,
                    'canvas_width' => 1080,
                    'canvas_height' => 1080,
                    'aspect_ratio' => '1:1',
                    'photo_area_config' => [
                        'x' => 0,
                        'y' => 0,
                        'width' => 1080,
                        'height' => 1080,
                        'zoom' => 1,
                        'rotation' => 0,
                        'style' => 'center-fill',
                    ],
                ]
            );

            // Add sample supporters
            for ($i = 1; $i <= 3; $i++) {
                CampaignSupporter::firstOrCreate(
                    [
                        'campaign_id' => $campaign->id,
                        'user_id' => $demoUser->id,
                        'supporter_name' => 'Supporter #' . $i,
                    ]
                );
            }
        }
    }
}
