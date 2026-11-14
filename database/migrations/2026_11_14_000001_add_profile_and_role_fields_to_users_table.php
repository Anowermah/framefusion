<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->unique()->after('name');
            $table->string('avatar_url')->nullable()->after('email');
            $table->text('bio')->nullable()->after('avatar_url');
            $table->string('role')->default('user')->after('bio'); // user, creator, admin, super_admin
            $table->string('status')->default('active')->after('role'); // active, suspended
            $table->json('social_links')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'avatar_url', 'bio', 'role', 'status', 'social_links']);
        });
    }
};

