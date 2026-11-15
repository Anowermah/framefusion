<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\GeneratedPhoto;
use App\Models\PlatformSetting;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(function ($request, $next) {
                if (!Auth::check() || Auth::user()->role !== 'admin') {
                    abort(403, 'Unauthorized. Admin access required.');
                }
                return $next($request);
            }),
        ];
    }
    /**
     * Admin Overview
     */
    public function index()
    {
        $totalUsers = User::count();
        $totalCampaigns = Campaign::count();
        $totalPhotos = Schema::hasTable('generated_photos') ? GeneratedPhoto::count() : 0;
        $pendingReports = Schema::hasTable('reports') ? Report::where('status', 'pending')->count() : 0;
        $totalSupporters = (int) (Campaign::sum('supporters_count') ?? 0);

        $recentUsers = User::latest()->take(5)->get();
        $recentCampaigns = Campaign::with('creator')->latest()->take(5)->get();
        $recentReports = Schema::hasTable('reports')
            ? Report::with(['campaign', 'reporter'])->latest()->take(5)->get()
            : collect([]);

        return Inertia::render('Admin/Overview', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalCampaigns' => $totalCampaigns,
                'totalPhotos' => $totalPhotos,
                'pendingReports' => $pendingReports,
                'totalSupporters' => $totalSupporters,
            ],
            'recentUsers' => $recentUsers,
            'recentCampaigns' => $recentCampaigns,
            'recentReports' => $recentReports,
        ]);
    }

    /**
     * Manage Users
     */
    public function users(Request $request)
    {
        $query = User::latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        }

        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        $users = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function updateUserRole(Request $request, int $id)
    {
        $request->validate(['role' => 'required|in:user,creator,admin']);
        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();

        return back()->with('success', 'User role updated.');
    }

    public function toggleUserStatus(int $id)
    {
        $user = User::findOrFail($id);
        $user->status = $user->status === 'active' ? 'suspended' : 'active';
        $user->save();

        return back()->with('success', 'User status updated.');
    }

    /**
     * Manage Campaigns
     */
    public function campaigns(Request $request)
    {
        $query = Campaign::with(['creator', 'category'])->latest();

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        $campaigns = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Campaigns', [
            'campaigns' => $campaigns,
        ]);
    }

    public function toggleCampaignFeature(int $id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->is_featured = !$campaign->is_featured;
        $campaign->save();

        return back()->with('success', 'Campaign feature status updated.');
    }

    public function toggleCampaignTrending(int $id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->is_trending = !$campaign->is_trending;
        $campaign->save();

        return back()->with('success', 'Campaign trending status updated.');
    }

    public function adminDeleteCampaign(int $id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->delete();

        return back()->with('success', 'Campaign removed by admin.');
    }

    /**
     * Manage Categories
     */
    public function categories()
    {
        $categories = Category::withCount('campaigns')->orderBy('order')->get();

        return Inertia::render('Admin/Categories', [
            'categories' => $categories,
        ]);
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'name_bn' => 'nullable|string|max:100',
            'slug' => 'required|string|unique:categories,slug',
            'description' => 'nullable|string',
        ]);

        Category::create($request->all());

        return back()->with('success', 'Category created successfully.');
    }

    /**
     * Manage Reports
     */
    public function reports()
    {
        $reports = Schema::hasTable('reports')
            ? Report::with(['campaign', 'reporter'])->latest()->paginate(15)
            : new \Illuminate\Pagination\LengthAwarePaginator([], 0, 15);

        return Inertia::render('Admin/Reports', [
            'reports' => $reports,
        ]);
    }

    public function updateReportStatus(Request $request, int $id)
    {
        $request->validate(['status' => 'required|in:resolved,dismissed,pending']);
        $report = Report::findOrFail($id);
        $report->status = $request->status;
        $report->save();

        return back()->with('success', 'Report status updated.');
    }

    /**
     * Website Settings
     */
    public function settings()
    {
        $settings = [
            'site_name' => PlatformSetting::get('site_name', 'FrameFusion'),
            'site_tagline' => PlatformSetting::get('site_tagline', 'Create. Customize. Celebrate.'),
            'primary_color' => PlatformSetting::get('primary_color', '#635BFF'),
            'contact_email' => PlatformSetting::get('contact_email', 'support@framefusion.io'),
            'allow_guest_downloads' => PlatformSetting::get('allow_guest_downloads', true),
        ];

        return Inertia::render('Admin/Settings', [
            'settings' => $settings,
        ]);
    }

    public function updateSettings(Request $request)
    {
        foreach ($request->all() as $key => $val) {
            PlatformSetting::set($key, $val);
        }

        return back()->with('success', 'Settings saved successfully.');
    }

    /**
     * Analytics
     */
    public function analytics()
    {
        $stats = [
            'totalUsers' => User::count(),
            'totalCampaigns' => Campaign::count(),
            'totalPhotos' => Schema::hasTable('generated_photos') ? GeneratedPhoto::count() : 0,
            'totalSupporters' => (int) (Campaign::sum('supporters_count') ?? 0),
            'topCampaigns' => Campaign::orderByDesc('supporters_count')->take(5)->get(),
        ];

        return Inertia::render('Admin/Analytics', [
            'stats' => $stats,
        ]);
    }
}

