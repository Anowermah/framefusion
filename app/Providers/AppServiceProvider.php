<?php

namespace App\Providers;

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
                if (!\Illuminate\Support\Facades\Schema::hasTable('sessions')) {
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
                if (!\Illuminate\Support\Facades\Schema::hasTable('gallery_posts') || !\Illuminate\Support\Facades\Schema::hasTable('generated_photos')) {
                    \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
                }
            } catch (\Throwable $e) {
                // Silently continue
            }
        }
    }
}
