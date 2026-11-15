<?php

use App\Http\Controllers\AdminController;
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

// Campaign Details & Interactive Photo Editor
Route::get('/campaigns/create', [CampaignController::class, 'create'])->name('campaigns.create');
Route::post('/campaigns', [CampaignController::class, 'store'])->name('campaigns.store');
Route::get('/campaigns/{slug}', [CampaignController::class, 'show'])->name('campaigns.show');
Route::get('/campaigns/{slug}/editor', [CampaignController::class, 'editor'])->name('campaigns.editor');

// Campaign Edit & Update (Requires Auth)
Route::middleware(['auth'])->group(function () {
    Route::get('/campaigns/{id}/edit', [CampaignController::class, 'edit'])->name('campaigns.edit');
    Route::post('/campaigns/{id}', [CampaignController::class, 'update'])->name('campaigns.update');
});

// Aliases & friendly redirects
Route::get('/campaign/{slug}', fn($slug) => redirect()->route('campaigns.show', ['slug' => $slug]));
Route::get('/campaign/{slug}/editor', fn($slug) => redirect()->route('campaigns.editor', ['slug' => $slug]));
Route::get('/category/{slug}', fn($slug) => redirect()->route('campaigns.explore', ['category' => $slug]));
Route::get('/categories/{slug}', fn($slug) => redirect()->route('campaigns.explore', ['category' => $slug]));
Route::get('/search', fn() => redirect()->route('campaigns.explore'));

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

    Route::get('/campaigns', [AdminController::class, 'campaigns'])->name('admin.campaigns');
    Route::post('/campaigns/{id}/feature', [AdminController::class, 'toggleCampaignFeature'])->name('admin.campaigns.feature');
    Route::post('/campaigns/{id}/trending', [AdminController::class, 'toggleCampaignTrending'])->name('admin.campaigns.trending');
    Route::delete('/campaigns/{id}', [AdminController::class, 'adminDeleteCampaign'])->name('admin.campaigns.delete');

    Route::get('/categories', [AdminController::class, 'categories'])->name('admin.categories');
    Route::post('/categories', [AdminController::class, 'storeCategory'])->name('admin.categories.store');

    Route::get('/reports', [AdminController::class, 'reports'])->name('admin.reports');
    Route::post('/reports/{id}/status', [AdminController::class, 'updateReportStatus'])->name('admin.reports.status');

    Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings');
    Route::post('/settings', [AdminController::class, 'updateSettings'])->name('admin.settings.update');

    Route::get('/analytics', [AdminController::class, 'analytics'])->name('admin.analytics');
});

require __DIR__.'/auth.php';
