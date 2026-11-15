<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. generated_photos (Clean table definition without strict foreign key constraints)
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

        // 2. saved_campaigns
        if (!Schema::hasTable('saved_campaigns')) {
            Schema::create('saved_campaigns', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->index();
                $table->unsignedBigInteger('campaign_id')->index();
                $table->timestamps();
                $table->unique(['user_id', 'campaign_id']);
            });
        }

        // 3. campaign_supporters
        if (!Schema::hasTable('campaign_supporters')) {
            Schema::create('campaign_supporters', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('campaign_id')->index();
                $table->unsignedBigInteger('user_id')->nullable()->index();
                $table->string('supporter_name')->nullable();
                $table->timestamps();
            });
        }

        // 4. campaign_frames
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

        // 5. gallery_posts
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

        // 6. platform_settings
        if (!Schema::hasTable('platform_settings')) {
            Schema::create('platform_settings', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique();
                $table->longText('value')->nullable();
                $table->string('type')->default('string');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        // Safe down
    }
};
