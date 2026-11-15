<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('gallery_posts')) {
            Schema::create('gallery_posts', function (Blueprint $table) {
                $table->id();
                $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->string('image_url');
                $table->text('caption')->nullable();
                $table->string('status')->default('published'); // published, hidden, flagged
                $table->integer('likes_count')->default(0);
                $table->integer('comments_count')->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('comments')) {
            Schema::create('comments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('gallery_post_id')->constrained('gallery_posts')->onDelete('cascade');
                $table->text('content');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('likes')) {
            Schema::create('likes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('gallery_post_id')->constrained('gallery_posts')->onDelete('cascade');
                $table->timestamps();

                $table->unique(['user_id', 'gallery_post_id']);
            });
        }

        if (!Schema::hasTable('reports')) {
            Schema::create('reports', function (Blueprint $table) {
                $table->id();
                $table->foreignId('reporter_id')->nullable()->constrained('users')->nullOnDelete();
                $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
                $table->string('reason');
                $table->text('description')->nullable();
                $table->string('status')->default('pending'); // pending, resolved, dismissed
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('platform_settings')) {
            Schema::create('platform_settings', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique();
                $table->text('value')->nullable();
                $table->string('type')->default('string');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('platform_settings');
        Schema::dropIfExists('reports');
        Schema::dropIfExists('likes');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('gallery_posts');
    }
};

