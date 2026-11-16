<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('campaigns')) {
            Schema::table('campaigns', function (Blueprint $table) {
                if (!Schema::hasColumn('campaigns', 'slots_config')) {
                    $table->json('slots_config')->nullable()->after('action_link_text');
                }
            });
        }

        if (Schema::hasTable('campaign_frames')) {
            Schema::table('campaign_frames', function (Blueprint $table) {
                if (!Schema::hasColumn('campaign_frames', 'slots_config')) {
                    $table->json('slots_config')->nullable()->after('photo_area_config');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('campaigns')) {
            Schema::table('campaigns', function (Blueprint $table) {
                if (Schema::hasColumn('campaigns', 'slots_config')) {
                    $table->dropColumn('slots_config');
                }
            });
        }

        if (Schema::hasTable('campaign_frames')) {
            Schema::table('campaign_frames', function (Blueprint $table) {
                if (Schema::hasColumn('campaign_frames', 'slots_config')) {
                    $table->dropColumn('slots_config');
                }
            });
        }
    }
};
