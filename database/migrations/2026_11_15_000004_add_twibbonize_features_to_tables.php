<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add Twibbonize features to campaigns table
        if (Schema::hasTable('campaigns')) {
            Schema::table('campaigns', function (Blueprint $table) {
                if (!Schema::hasColumn('campaigns', 'caption_template')) {
                    $table->text('caption_template')->nullable()->after('tags');
                }
                if (!Schema::hasColumn('campaigns', 'action_link_url')) {
                    $table->string('action_link_url')->nullable()->after('caption_template');
                }
                if (!Schema::hasColumn('campaigns', 'action_link_text')) {
                    $table->string('action_link_text')->nullable()->after('action_link_url');
                }
            });
        }

        // 2. Add creator verification checkmark to users table
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'is_verified')) {
                    $table->boolean('is_verified')->default(false)->after('status');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('campaigns')) {
            Schema::table('campaigns', function (Blueprint $table) {
                if (Schema::hasColumn('campaigns', 'action_link_text')) {
                    $table->dropColumn('action_link_text');
                }
                if (Schema::hasColumn('campaigns', 'action_link_url')) {
                    $table->dropColumn('action_link_url');
                }
                if (Schema::hasColumn('campaigns', 'caption_template')) {
                    $table->dropColumn('caption_template');
                }
            });
        }

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasColumn('users', 'is_verified')) {
                    $table->dropColumn('is_verified');
                }
            });
        }
    }
};
