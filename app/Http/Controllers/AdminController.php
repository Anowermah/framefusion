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
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(function ($request, $next) {
                if (!Auth::check() || !Auth::user()->isAdmin()) {
                    abort(403, 'Unauthorized. Admin or Super Admin access required.');
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

        $recentUsers = User::latest()->take(6)->get();
        $recentCampaigns = Campaign::with('creator')->latest()->take(6)->get();
        $recentReports = Schema::hasTable('reports')
            ? Report::with(['campaign', 'reporter'])->latest()->take(6)->get()
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
        $withCount = ['campaigns'];
        if (Schema::hasTable('generated_photos')) {
            $withCount[] = 'generatedPhotos';
        }
        $query = User::withCount($withCount)->latest();

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

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $users = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    public function updateUserRole(Request $request, int $id)
    {
        $request->validate(['role' => 'required|in:user,creator,admin,super_admin']);
        $currentUser = Auth::user();
        $targetUser = User::findOrFail($id);

        // Only super_admin can create or modify super_admin roles
        if ($targetUser->role === 'super_admin' && !$currentUser->isSuperAdmin()) {
            return back()->with('error', 'Only Super Admin can modify another Super Admin account.');
        }

        if ($request->role === 'super_admin' && !$currentUser->isSuperAdmin()) {
            return back()->with('error', 'Only Super Admin can promote someone to Super Admin.');
        }

        $targetUser->role = $request->role;
        $targetUser->save();

        return back()->with('success', 'User role updated to ' . $request->role . '.');
    }

    public function toggleUserStatus(int $id)
    {
        $currentUser = Auth::user();
        $targetUser = User::findOrFail($id);

        if ($targetUser->id === $currentUser->id) {
            return back()->with('error', 'You cannot suspend your own account.');
        }

        if ($targetUser->isSuperAdmin() && !$currentUser->isSuperAdmin()) {
            return back()->with('error', 'Only Super Admin can suspend a Super Admin.');
        }

        $targetUser->status = $targetUser->status === 'active' ? 'suspended' : 'active';
        $targetUser->save();

        return back()->with('success', 'User status updated to ' . $targetUser->status . '.');
    }

    public function resetUserPassword(Request $request, int $id)
    {
        $request->validate([
            'password' => 'required|string|min:8',
        ]);

        $currentUser = Auth::user();
        $targetUser = User::findOrFail($id);

        if ($targetUser->isSuperAdmin() && !$currentUser->isSuperAdmin()) {
            return back()->with('error', 'Only Super Admin can reset a Super Admin password.');
        }

        $targetUser->password = Hash::make($request->password);
        $targetUser->save();

        return back()->with('success', 'Password reset successfully for ' . $targetUser->name . '.');
    }

    public function deleteUser(int $id)
    {
        $currentUser = Auth::user();
        $targetUser = User::findOrFail($id);

        if ($targetUser->id === $currentUser->id) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        if ($targetUser->isSuperAdmin() && !$currentUser->isSuperAdmin()) {
            return back()->with('error', 'Only Super Admin can delete a Super Admin account.');
        }

        $targetUser->delete();

        return back()->with('success', 'User deleted successfully.');
    }

    /**
     * Manage Campaigns
     */
    public function campaigns(Request $request)
    {
        $query = Campaign::with(['creator', 'category'])->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($catId = $request->input('category_id')) {
            $query->where('category_id', $catId);
        }

        $campaigns = $query->paginate(15)->withQueryString();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/Campaigns', [
            'campaigns' => $campaigns,
            'categories' => $categories,
            'filters' => $request->only(['search', 'status', 'category_id']),
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

    public function updateCampaignStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|in:published,draft,pending,rejected,suspended',
        ]);

        $campaign = Campaign::findOrFail($id);
        $campaign->status = $request->status;
        $campaign->save();

        return back()->with('success', 'Campaign status updated to ' . $request->status . '.');
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
            'icon' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        Category::create([
            'name' => $request->name,
            'name_bn' => $request->name_bn,
            'slug' => $request->slug,
            'description' => $request->description,
            'icon' => $request->icon ?? 'Briefcase',
            'order' => (int) ($request->order ?? 0),
        ]);

        return back()->with('success', 'Category created successfully.');
    }

    public function updateCategory(Request $request, int $id)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'name_bn' => 'nullable|string|max:100',
            'slug' => 'required|string|unique:categories,slug,' . $id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        $category = Category::findOrFail($id);
        $category->update([
            'name' => $request->name,
            'name_bn' => $request->name_bn,
            'slug' => $request->slug,
            'description' => $request->description,
            'icon' => $request->icon ?? $category->icon ?? 'Briefcase',
            'order' => (int) ($request->order ?? 0),
        ]);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroyCategory(int $id)
    {
        $category = Category::findOrFail($id);
        if ($category->campaigns()->count() > 0) {
            return back()->with('error', 'Cannot delete this category because campaigns are assigned to it. Move or delete those campaigns first.');
        }

        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
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
        return Inertia::render('Admin/Settings', [
            'settings' => PlatformSetting::allKeyMap(),
        ]);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->except(['_token']);

        foreach ($data as $key => $val) {
            $type = is_bool($val) ? 'boolean' : (is_int($val) ? 'integer' : 'string');
            PlatformSetting::set($key, $val, $type);
        }

        return back()->with('success', 'Website settings saved and updated in database successfully.');
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
            'topCampaigns' => Campaign::orderByDesc('supporters_count')->take(10)->get(),
        ];

        return Inertia::render('Admin/Analytics', [
            'stats' => $stats,
        ]);
    }
}
