<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('campaigns')) {
            Schema::create('campaigns', function (Blueprint $table) {
                $table->id();
                $table->foreignId('creator_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
                $table->string('title');
                $table->string('title_bn')->nullable();
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->text('description_bn')->nullable();
                $table->string('campaign_type')->default('frame'); // 'frame' or 'background'
                $table->string('frame_url');
                $table->string('thumbnail_url')->nullable();
                $table->string('background_url')->nullable();
                $table->string('status')->default('published'); // 'draft', 'published', 'archived', 'pending_review'
                $table->string('visibility')->default('public'); // 'public', 'unlisted', 'private'
                $table->boolean('is_featured')->default(false);
                $table->boolean('is_trending')->default(false);
                $table->unsignedBigInteger('supporters_count')->default(0);
                $table->unsignedBigInteger('views_count')->default(0);
                $table->date('start_date')->nullable();
                $table->date('end_date')->nullable();
                $table->text('tags')->nullable();
                $table->timestamps();

                $table->index(['status', 'visibility']);
                $table->index('is_trending');
                $table->index('is_featured');
                $table->index('supporters_count');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};

