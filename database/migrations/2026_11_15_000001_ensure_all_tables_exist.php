<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. generated_photos
        if (!Schema::hasTable('generated_photos')) {
            Schema::create('generated_photos', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
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
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
                $table->timestamps();

                $table->unique(['user_id', 'campaign_id']);
            });
        }

        // 3. campaign_supporters
        if (!Schema::hasTable('campaign_supporters')) {
            Schema::create('campaign_supporters', function (Blueprint $table) {
                $table->id();
                $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('supporter_name')->nullable();
                $table->timestamps();
            });
        }

        // 4. campaign_frames
        if (!Schema::hasTable('campaign_frames')) {
            Schema::create('campaign_frames', function (Blueprint $table) {
                $table->id();
                $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
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
                $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->string('image_url');
                $table->text('caption')->nullable();
                $table->string('status')->default('published');
                $table->integer('likes_count')->default(0);
                $table->integer('comments_count')->default(0);
                $table->timestamps();
            });
        }

        // 6. comments
        if (!Schema::hasTable('comments')) {
            Schema::create('comments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('gallery_post_id')->constrained('gallery_posts')->onDelete('cascade');
                $table->text('content');
                $table->timestamps();
            });
        }

        // 7. likes
        if (!Schema::hasTable('likes')) {
            Schema::create('likes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('gallery_post_id')->constrained('gallery_posts')->onDelete('cascade');
                $table->timestamps();

                $table->unique(['user_id', 'gallery_post_id']);
            });
        }

        // 8. reports
        if (!Schema::hasTable('reports')) {
            Schema::create('reports', function (Blueprint $table) {
                $table->id();
                $table->foreignId('reporter_id')->nullable()->constrained('users')->nullOnDelete();
                $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
                $table->string('reason');
                $table->text('description')->nullable();
                $table->string('status')->default('pending');
                $table->timestamps();
            });
        }

        // 9. platform_settings
        if (!Schema::hasTable('platform_settings')) {
            Schema::create('platform_settings', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique();
                $table->text('value')->nullable();
                $table->string('type')->default('string');
                $table->timestamps();
            });

            $defaults = [
                ['key' => 'site_name', 'value' => 'FrameFusion', 'type' => 'string'],
                ['key' => 'site_tagline', 'value' => 'Create. Customize. Celebrate.', 'type' => 'string'],
                ['key' => 'primary_color', 'value' => '#635BFF', 'type' => 'string'],
                ['key' => 'secondary_color', 'value' => '#8B5CF6', 'type' => 'string'],
                ['key' => 'accent_color', 'value' => '#FF6B8A', 'type' => 'string'],
                ['key' => 'allow_guest_downloads', 'value' => '1', 'type' => 'boolean'],
                ['key' => 'enable_moderation', 'value' => '', 'type' => 'boolean'],
                ['key' => 'contact_email', 'value' => 'support@framefusion.io', 'type' => 'string'],
            ];
            foreach ($defaults as $d) {
                DB::table('platform_settings')->insertOrIgnore($d);
            }
        }
    }

    public function down(): void
    {
    }
};
