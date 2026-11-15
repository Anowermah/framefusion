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
        }
    }
}
