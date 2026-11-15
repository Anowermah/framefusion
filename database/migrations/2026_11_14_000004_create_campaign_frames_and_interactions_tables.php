<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('campaign_frames')) {
            Schema::create('campaign_frames', function (Blueprint $table) {
                $table->id();
                $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
                $table->string('frame_url');
                $table->integer('canvas_width')->default(1080);
                $table->integer('canvas_height')->default(1080);
                $table->string('aspect_ratio')->default('1:1');
                $table->json('photo_area_config')->nullable(); // {x, y, width, height, zoom, rotation, shape}
                $table->timestamps();
            });
        }

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

        if (!Schema::hasTable('saved_campaigns')) {
            Schema::create('saved_campaigns', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
                $table->timestamps();

                $table->unique(['user_id', 'campaign_id']);
            });
        }

        if (!Schema::hasTable('campaign_supporters')) {
            Schema::create('campaign_supporters', function (Blueprint $table) {
                $table->id();
                $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('supporter_name')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_supporters');
        Schema::dropIfExists('saved_campaigns');
        Schema::dropIfExists('generated_photos');
        Schema::dropIfExists('campaign_frames');
    }
};

