<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Auto-check for vendor/autoload.php
if (!file_exists(__DIR__.'/../vendor/autoload.php')) {
    http_response_code(503);
    header('Content-Type: text/html; charset=utf-8');
    ?>
    <!DOCTYPE html>
    <html lang="bn">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FrameFusion Setup Required</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
            .box { background: #1e293b; max-width: 680px; width: 100%; border-radius: 1rem; padding: 2.5rem; border: 1px solid #334155; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
            h1 { font-size: 1.5rem; color: #f43f5e; margin-top: 0; display: flex; align-items: center; gap: 0.5rem; }
            p { color: #cbd5e1; line-height: 1.6; }
            pre { background: #020617; padding: 1.25rem; border-radius: 0.5rem; color: #38bdf8; overflow-x: auto; font-size: 0.9rem; line-height: 1.5; border: 1px solid #1e293b; }
            .badge { display: inline-block; background: #6366f1; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; }
            a { color: #60a5fa; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="box">
            <span class="badge">FrameFusion Platform</span>
            <h1>সার্ভার ইনিশিয়ালাইজেশন প্রয়োজন (Setup Required)</h1>
            <p>সার্ভারে <code>vendor/</code> (Composer Dependencies) ফোল্ডারটি পাওয়া যায়নি।</p>
            <p>আপনার <strong>cPanel Terminal</strong> অথবা <strong>SSH</strong> এ প্রজেক্টের রুট ডিরেক্টরিতে গিয়ে নিচের কমান্ডগুলো রান করুন:</p>
            <pre>composer install --optimize-autoloader
php artisan key:generate
php artisan migrate --seed --force
php artisan storage:link</pre>
            <p style="font-size: 0.875rem; color: #94a3b8; margin-top: 1.5rem;">সার্ভার ডায়াগনস্টিক রিপোর্ট দেখতে ভিজিট করুন: <a href="/test.php">/test.php</a></p>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Auto-create .env from .env.example if missing
if (!file_exists(__DIR__.'/../.env') && file_exists(__DIR__.'/../.env.example')) {
    @copy(__DIR__.'/../.env.example', __DIR__.'/../.env');
}

// Ensure database.sqlite exists if sqlite is used
if (!file_exists(__DIR__.'/../database/database.sqlite') && file_exists(__DIR__.'/../database')) {
    @touch(__DIR__.'/../database/database.sqlite');
}

// Auto-symlink storage if missing
if (!file_exists(__DIR__.'/storage') && file_exists(__DIR__.'/../storage/app/public')) {
    @symlink(__DIR__.'/../storage/app/public', __DIR__.'/storage');
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
