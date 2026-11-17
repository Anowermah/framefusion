<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AiStudioController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StaticPageController;
use Illuminate\Support\Facades\Route;

// Public Pages
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/explore', [CampaignController::class, 'index'])->name('campaigns.explore');
Route::get('/trending', [CampaignController::class, 'trending'])->name('campaigns.trending');
Route::get('/categories', [CampaignController::class, 'categories'])->name('campaigns.categories');
Route::get('/how-it-works', [StaticPageController::class, 'howItWorks'])->name('how-it-works');
Route::get('/ai-studio', [AiStudioController::class, 'index'])->name('ai.studio');
Route::post('/api/ai/search', [AiStudioController::class, 'search'])->name('api.ai.search');
Route::post('/api/ai/chat', [AiStudioController::class, 'chat'])->name('api.ai.chat');

// Campaign Details & Interactive Photo Editor
Route::get('/campaigns/create', [CampaignController::class, 'create'])->name('campaigns.create');
Route::post('/campaigns', [CampaignController::class, 'store'])->name('campaigns.store');
Route::get('/campaigns/{slug}', [CampaignController::class, 'show'])->name('campaigns.show');
Route::get('/campaigns/{slug}/editor', [CampaignController::class, 'editor'])->name('campaigns.editor');
Route::get('/campaigns/{slug}/og-image', [CampaignController::class, 'ogImage'])->name('campaigns.og-image');

// Campaign Edit & Update (Requires Auth)
Route::middleware(['auth'])->group(function () {
    Route::get('/campaigns/{id}/edit', [CampaignController::class, 'edit'])->name('campaigns.edit');
    Route::post('/campaigns/{id}', [CampaignController::class, 'update'])->name('campaigns.update');
});

// Aliases & friendly redirects
Route::get('/campaign/{slug}', fn($slug) => redirect()->route('campaigns.show', ['slug' => $slug]));
Route::get('/campaign/{slug}/editor', fn($slug) => redirect()->route('campaigns.editor', ['slug' => $slug]));
Route::get('/campaign/{slug}/edit', fn($slug) => redirect()->route('campaigns.edit', ['id' => $slug]));
Route::get('/campaign/{slug}/og-image', fn($slug) => redirect()->route('campaigns.og-image', ['slug' => $slug]));
Route::get('/category/{slug}', fn($slug) => redirect()->route('campaigns.explore', ['category' => $slug]));
Route::get('/categories/{slug}', fn($slug) => redirect()->route('campaigns.explore', ['category' => $slug]));
Route::get('/search', fn() => redirect()->route('campaigns.explore'));

// SEO Dynamic Sitemaps & Crawlers
Route::get('/sitemap.xml', function () {
    $campaigns = \App\Models\Campaign::where('status', 'published')
        ->where('visibility', 'public')
        ->latest('updated_at')
        ->get();

    $categories = \App\Models\Category::all();

    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';

    $staticRoutes = [
        ['url' => url('/'), 'priority' => '1.0', 'changefreq' => 'daily'],
        ['url' => route('campaigns.explore'), 'priority' => '0.9', 'changefreq' => 'daily'],
        ['url' => route('campaigns.trending'), 'priority' => '0.9', 'changefreq' => 'daily'],
        ['url' => route('campaigns.categories'), 'priority' => '0.8', 'changefreq' => 'weekly'],
        ['url' => route('how-it-works'), 'priority' => '0.7', 'changefreq' => 'monthly'],
        ['url' => route('about'), 'priority' => '0.6', 'changefreq' => 'monthly'],
        ['url' => route('contact'), 'priority' => '0.6', 'changefreq' => 'monthly'],
        ['url' => route('privacy'), 'priority' => '0.3', 'changefreq' => 'yearly'],
        ['url' => route('terms'), 'priority' => '0.3', 'changefreq' => 'yearly'],
    ];

    foreach ($staticRoutes as $r) {
        $xml .= '<url>';
        $xml .= '<loc>' . htmlspecialchars($r['url']) . '</loc>';
        $xml .= '<changefreq>' . $r['changefreq'] . '</changefreq>';
        $xml .= '<priority>' . $r['priority'] . '</priority>';
        $xml .= '</url>';
    }

    foreach ($categories as $cat) {
        $xml .= '<url>';
        $xml .= '<loc>' . htmlspecialchars(route('campaigns.explore', ['category' => $cat->slug])) . '</loc>';
        $xml .= '<changefreq>weekly</changefreq>';
        $xml .= '<priority>0.8</priority>';
        $xml .= '</url>';
    }

    foreach ($campaigns as $camp) {
        $campUrl = route('campaigns.show', $camp->slug);
        $frameUrl = route('campaigns.og-image', $camp->slug);
        $lastmod = $camp->updated_at ? $camp->updated_at->toAtomString() : now()->toAtomString();

        $xml .= '<url>';
        $xml .= '<loc>' . htmlspecialchars($campUrl) . '</loc>';
        $xml .= '<lastmod>' . $lastmod . '</lastmod>';
        $xml .= '<changefreq>weekly</changefreq>';
        $xml .= '<priority>0.85</priority>';
        if ($frameUrl) {
            $xml .= '<image:image>';
            $xml .= '<image:loc>' . htmlspecialchars($frameUrl) . '</image:loc>';
            $xml .= '<image:title>' . htmlspecialchars($camp->title) . '</image:title>';
            $xml .= '<image:caption>' . htmlspecialchars($camp->description ? \Illuminate\Support\Str::limit($camp->description, 100) : $camp->title) . '</image:caption>';
            $xml .= '</image:image>';
        }
        $xml .= '</url>';
    }

    $xml .= '</urlset>';

    return response($xml, 200, [
        'Content-Type' => 'application/xml; charset=utf-8',
        'Cache-Control' => 'public, max-age=3600',
    ]);
})->name('sitemap');

Route::get('/robots.txt', function () {
    $sitemapUrl = url('/sitemap.xml');
    $content = "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /dashboard/\nDisallow: /profile/\nDisallow: /login\nDisallow: /register\nDisallow: /password/\n\nSitemap: {$sitemapUrl}\n";
    return response($content, 200, [
        'Content-Type' => 'text/plain',
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->name('robots');

// Direct Storage & Uploaded Frames Handler (CPanel, LiteSpeed & Shared Hosting compatibility)
Route::match(['get', 'head'], '/storage/{path}', function (string $path) {
    // 1. Check storage/app/public
    $appPublicFile = storage_path('app/public/' . $path);
    if (file_exists($appPublicFile) && is_file($appPublicFile)) {
        // Sync to public/storage so webserver can also serve it directly
        $pubFile = public_path('storage/' . $path);
        $pubDir = dirname($pubFile);
        if (!file_exists($pubDir)) {
            @mkdir($pubDir, 0755, true);
        }
        if (!file_exists($pubFile)) {
            @copy($appPublicFile, $pubFile);
            @chmod($pubFile, 0644);
        }

        return response()->file($appPublicFile, [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
            'Cache-Control' => 'public, max-age=604800',
        ]);
    }

    // 2. Check public/storage
    $publicStorageFile = public_path('storage/' . $path);
    if (file_exists($publicStorageFile) && is_file($publicStorageFile)) {
        return response()->file($publicStorageFile, [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
            'Cache-Control' => 'public, max-age=604800',
        ]);
    }

    abort(404);
})->where('path', '.*')->name('storage.serve');

Route::options('/storage/{path}', function () {
    return response('', 204)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
        ->header('Access-Control-Allow-Headers', '*');
})->where('path', '.*');


// Campaign Actions (Guest & User)
Route::post('/campaigns/{id}/generate', [CampaignController::class, 'generate'])->name('campaigns.generate');
Route::post('/campaigns/{id}/save', [CampaignController::class, 'toggleSave'])->name('campaigns.save');
Route::post('/campaigns/{id}/report', [CampaignController::class, 'report'])->name('campaigns.report');

// Static Pages
Route::get('/about', [StaticPageController::class, 'about'])->name('about');
Route::get('/contact', [StaticPageController::class, 'contact'])->name('contact');
Route::get('/privacy', [StaticPageController::class, 'privacy'])->name('privacy');
Route::get('/terms', [StaticPageController::class, 'terms'])->name('terms');

// Authenticated User Dashboard
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/campaigns', [DashboardController::class, 'myCampaigns'])->name('dashboard.campaigns');
    Route::get('/dashboard/photos', [DashboardController::class, 'myPhotos'])->name('dashboard.photos');
    Route::get('/dashboard/saved', [DashboardController::class, 'savedCampaigns'])->name('dashboard.saved');
    Route::post('/dashboard/campaigns/{id}/toggle-status', [DashboardController::class, 'toggleCampaignStatus'])->name('dashboard.campaigns.toggle');
    Route::delete('/dashboard/campaigns/{id}', [DashboardController::class, 'deleteCampaign'])->name('dashboard.campaigns.delete');

    // Profile Settings
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Dashboard Routes
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.index');
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users');
    Route::post('/users/{id}/role', [AdminController::class, 'updateUserRole'])->name('admin.users.role');
    Route::post('/users/{id}/toggle-status', [AdminController::class, 'toggleUserStatus'])->name('admin.users.status');
    Route::post('/users/{id}/toggle-verification', [AdminController::class, 'toggleUserVerification'])->name('admin.users.verify');
    Route::post('/users/{id}/reset-password', [AdminController::class, 'resetUserPassword'])->name('admin.users.reset-password');
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser'])->name('admin.users.delete');

    Route::get('/campaigns', [AdminController::class, 'campaigns'])->name('admin.campaigns');
    Route::post('/campaigns/{id}/feature', [AdminController::class, 'toggleCampaignFeature'])->name('admin.campaigns.feature');
    Route::post('/campaigns/{id}/trending', [AdminController::class, 'toggleCampaignTrending'])->name('admin.campaigns.trending');
    Route::post('/campaigns/{id}/status', [AdminController::class, 'updateCampaignStatus'])->name('admin.campaigns.status');
    Route::delete('/campaigns/{id}', [AdminController::class, 'adminDeleteCampaign'])->name('admin.campaigns.delete');

    Route::get('/categories', [AdminController::class, 'categories'])->name('admin.categories');
    Route::post('/categories', [AdminController::class, 'storeCategory'])->name('admin.categories.store');
    Route::put('/categories/{id}', [AdminController::class, 'updateCategory'])->name('admin.categories.update');
    Route::delete('/categories/{id}', [AdminController::class, 'destroyCategory'])->name('admin.categories.destroy');

    Route::get('/reports', [AdminController::class, 'reports'])->name('admin.reports');
    Route::post('/reports/{id}/status', [AdminController::class, 'updateReportStatus'])->name('admin.reports.status');

    Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings');
    Route::post('/settings', [AdminController::class, 'updateSettings'])->name('admin.settings.update');

    Route::get('/analytics', [AdminController::class, 'analytics'])->name('admin.analytics');
});

require __DIR__.'/auth.php';
