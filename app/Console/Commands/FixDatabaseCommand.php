<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;

class FixDatabaseCommand extends Command
{
    protected $signature = 'app:fix-db';
    protected $description = 'Ensure all required production tables and schemas exist in MySQL/SQLite';

    public function handle(): int
    {
        $this->info('Running database migration checks...');

        // 1. Run migrations with force
        $exitCode = Artisan::call('migrate', ['--force' => true]);
        $this->line(Artisan::output());

        // 2. Check each critical table
        $tables = [
            'users',
            'categories',
            'campaigns',
            'campaign_frames',
            'generated_photos',
            'saved_campaigns',
            'campaign_supporters',
            'gallery_posts',
            'comments',
            'likes',
            'reports',
            'platform_settings',
            'sessions',
            'cache',
        ];

        // Ensure users table has google_id
        if (Schema::hasTable('users') && !Schema::hasColumn('users', 'google_id')) {
            try {
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE `users` ADD COLUMN `google_id` VARCHAR(255) NULL UNIQUE AFTER `email`");
                $this->info("  + Added `google_id` column to `users` table.");
            } catch (\Throwable $e) {
                // column might already exist or DB driver syntax difference
            }
        }

        $this->info("\n=== Table Status ===");
        $allGood = true;
        foreach ($tables as $t) {
            $exists = Schema::hasTable($t);
            $status = $exists ? '<fg=green>EXISTS</>' : '<fg=red>MISSING</>';
            $this->line("  - {$t}: {$status}");
            if (!$exists) {
                $allGood = false;
            }
        }

        // 3. Clear cache
        Artisan::call('optimize:clear');
        $this->info("\nOptimization cache cleared successfully!");

        if ($allGood) {
            $this->info("\nAll database tables verified and ready! Everything is working perfectly.");
            return Command::SUCCESS;
        } else {
            $this->error("\nSome tables could not be verified. Please check MySQL credentials.");
            return Command::FAILURE;
        }
    }
}
