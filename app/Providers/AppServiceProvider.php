<?php

namespace App\Providers;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Safe session fallback: if database session table is missing, gracefully use file driver
        if (config('session.driver') === 'database') {
            try {
                if (!Schema::hasTable('sessions')) {
                    config(['session.driver' => 'file']);
                }
            } catch (\Throwable $e) {
                config(['session.driver' => 'file']);
            }
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Auto-heal missing database tables (Web requests only, never in console)
        if (!app()->runningInConsole()) {
            try {
                if (!Schema::hasTable('generated_photos')) {
                    Schema::create('generated_photos', function (Blueprint $table) {
                        $table->id();
                        $table->unsignedBigInteger('user_id')->nullable()->index();
                        $table->unsignedBigInteger('campaign_id')->index();
                        $table->string('image_url');
                        $table->string('format')->default('png');
                        $table->string('quality')->default('standard');
                        $table->timestamps();
                    });
                }
            } catch (\Throwable $e) {}

            try {
                if (!Schema::hasTable('saved_campaigns')) {
                    Schema::create('saved_campaigns', function (Blueprint $table) {
                        $table->id();
                        $table->unsignedBigInteger('user_id')->index();
                        $table->unsignedBigInteger('campaign_id')->index();
                        $table->timestamps();
                        $table->unique(['user_id', 'campaign_id']);
                    });
                }
            } catch (\Throwable $e) {}

            try {
                if (!Schema::hasTable('campaign_supporters')) {
                    Schema::create('campaign_supporters', function (Blueprint $table) {
                        $table->id();
                        $table->unsignedBigInteger('campaign_id')->index();
                        $table->unsignedBigInteger('user_id')->nullable()->index();
                        $table->string('supporter_name')->nullable();
                        $table->timestamps();
                    });
                }
            } catch (\Throwable $e) {}

            try {
                if (!Schema::hasTable('campaign_frames')) {
                    Schema::create('campaign_frames', function (Blueprint $table) {
                        $table->id();
                        $table->unsignedBigInteger('campaign_id')->index();
                        $table->string('frame_url');
                        $table->integer('canvas_width')->default(1080);
                        $table->integer('canvas_height')->default(1080);
                        $table->string('aspect_ratio')->default('1:1');
                        $table->json('photo_area_config')->nullable();
                        $table->timestamps();
                    });
                }
            } catch (\Throwable $e) {}

            try {
                if (!Schema::hasTable('gallery_posts')) {
                    Schema::create('gallery_posts', function (Blueprint $table) {
                        $table->id();
                        $table->unsignedBigInteger('campaign_id')->index();
                        $table->unsignedBigInteger('user_id')->index();
                        $table->string('image_url');
                        $table->text('caption')->nullable();
                        $table->string('status')->default('published');
                        $table->timestamps();
                    });
                }
            } catch (\Throwable $e) {}

            try {
                if (!Schema::hasTable('platform_settings')) {
                    Schema::create('platform_settings', function (Blueprint $table) {
                        $table->id();
                        $table->string('key')->unique();
                        $table->longText('value')->nullable();
                        $table->string('type')->default('string');
                        $table->timestamps();
                    });
                }
            } catch (\Throwable $e) {}

            // Auto-heal missing Twibbonize columns on campaigns table
            try {
                if (Schema::hasTable('campaigns')) {
                    Schema::table('campaigns', function (Blueprint $table) {
                        if (!Schema::hasColumn('campaigns', 'caption_template')) {
                            $table->text('caption_template')->nullable();
                        }
                        if (!Schema::hasColumn('campaigns', 'action_link_url')) {
                            $table->string('action_link_url')->nullable();
                        }
                        if (!Schema::hasColumn('campaigns', 'action_link_text')) {
                            $table->string('action_link_text')->nullable();
                        }
                        if (!Schema::hasColumn('campaigns', 'slots_config')) {
                            $table->json('slots_config')->nullable();
                        }
                    });
                }
            } catch (\Throwable $e) {}

            try {
                if (Schema::hasTable('campaign_frames')) {
                    Schema::table('campaign_frames', function (Blueprint $table) {
                        if (!Schema::hasColumn('campaign_frames', 'slots_config')) {
                            $table->json('slots_config')->nullable();
                        }
                    });
                }
            } catch (\Throwable $e) {}

            // Auto-heal missing creator verification column on users table
            try {
                if (Schema::hasTable('users')) {
                    Schema::table('users', function (Blueprint $table) {
                        if (!Schema::hasColumn('users', 'is_verified')) {
                            $table->boolean('is_verified')->default(false);
                        }
                    });
                }
            } catch (\Throwable $e) {}

            // Auto-heal default event poster campaign if missing
            try {
                if (Schema::hasTable('campaigns') && !\App\Models\Campaign::where('slug', 'jumar-khutbah-event-poster')->exists()) {
                    $creator = \App\Models\User::first();
                    $category = \App\Models\Category::first();
                    $frameUrl = '/storage/frames/juma-khutbah-template.png';

                    if ($creator && $category) {
                        \App\Models\Campaign::create([
                            'creator_id' => $creator->id,
                            'category_id' => $category->id,
                            'title' => 'Juma\'ar Khutbah & Event Poster',
                            'title_bn' => 'পবিত্র জুম\'আর খুতবা ও মাহফিল পোস্টার ফ্রেম',
                            'slug' => 'jumar-khutbah-event-poster',
                            'description' => 'Official event and Friday Khutbah poster frame. Customize your date, time, venue, topic, designation, and name with your photo.',
                            'description_bn' => 'পবিত্র জুম\'আর খুতবা, মাহফিল ও বিশেষ অনুষ্ঠানের পোস্টার ফ্রেম। তারিখ, সময়, স্থান, আলোচ্য বিষয়, পদবি ও নিজের নাম যুক্ত করে ছবি তৈরি করুন।',
                            'campaign_type' => 'event_notice',
                            'frame_url' => $frameUrl,
                            'thumbnail_url' => $frameUrl,
                            'status' => 'published',
                            'visibility' => 'public',
                            'is_featured' => true,
                            'is_trending' => true,
                            'supporters_count' => 1250,
                            'views_count' => 4500,
                            'start_date' => now()->subDays(2),
                            'end_date' => now()->addDays(90),
                            'tags' => 'juma,khutbah,islamic,event,poster,notice,mahfil',
                            'caption_template' => 'আমি পবিত্র জুম\'আর খুতবা ও মাহফিল পোস্টার ফ্রেমে নিজের ছবি ও তথ্য যুক্ত করে পোস্টার তৈরি করেছি! আপনিও তৈরি করুন: ',
                            'action_link_text' => 'খুতবার পোস্টার ফ্রেম তৈরি করুন',
                        ]);
                    }
                }
            } catch (\Throwable $e) {}
        }
    }
}
