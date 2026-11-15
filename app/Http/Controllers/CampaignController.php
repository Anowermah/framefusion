<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\CampaignFrame;
use App\Models\CampaignSupporter;
use App\Models\Category;
use App\Models\GeneratedPhoto;
use App\Models\GalleryPost;
use App\Models\Report;
use App\Models\SavedCampaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CampaignController extends Controller
{
    /**
     * Explore & Search Campaigns
     */
    public function index(Request $request)
    {
        $query = Campaign::with(['creator', 'category'])
            ->where('status', 'published')
            ->where('visibility', 'public');

        // Search text
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('title_bn', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('tags', 'like', "%{$search}%")
                  ->orWhereHas('creator', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%")
                         ->orWhere('username', 'like', "%{$search}%");
                  });
            });
        }

        // Category filter
        if ($catSlug = $request->input('category')) {
            $query->whereHas('category', function ($q) use ($catSlug) {
                $q->where('slug', $catSlug);
            });
        }

        // Sorting
        $sort = $request->input('sort', 'trending');
        match ($sort) {
            'supported' => $query->orderByDesc('supporters_count'),
            'newest' => $query->latest(),
            'oldest' => $query->oldest(),
            'featured' => $query->where('is_featured', true)->orderByDesc('supporters_count'),
            default => $query->orderByDesc('is_trending')->orderByDesc('supporters_count'),
        };

        $campaigns = $query->paginate(12)->withQueryString();
        $categories = Category::orderBy('order')->get();

        return Inertia::render('Campaigns/Explore', [
            'campaigns' => $campaigns,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'sort']),
        ]);
    }

    /**
     * Trending Campaigns Page
     */
    public function trending()
    {
        $campaigns = Campaign::with(['creator', 'category'])
            ->where('status', 'published')
            ->where('visibility', 'public')
            ->where('is_trending', true)
            ->orderByDesc('supporters_count')
            ->paginate(12);

        return Inertia::render('Campaigns/Trending', [
            'campaigns' => $campaigns,
        ]);
    }

    /**
     * Categories Directory
     */
    public function categories()
    {
        $categories = Category::withCount('campaigns')
            ->orderBy('order')
            ->get();

        return Inertia::render('Campaigns/Categories', [
            'categories' => $categories,
        ]);
    }

    /**
     * Single Campaign Details Page
     */
    public function show(string $slug)
    {
        $campaign = Campaign::with(['creator', 'category', 'primaryFrame', 'galleryPosts.user', 'galleryPosts.comments.user'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view count
        $campaign->increment('views_count');

        $isSaved = false;
        if (Auth::check()) {
            $isSaved = SavedCampaign::where('user_id', Auth::id())
                ->where('campaign_id', $campaign->id)
                ->exists();
        }

        $relatedCampaigns = Campaign::with(['creator', 'category'])
            ->where('category_id', $campaign->category_id)
            ->where('id', '!=', $campaign->id)
            ->where('status', 'published')
            ->take(3)
            ->get();

        return Inertia::render('Campaigns/Show', [
            'campaign' => array_merge($campaign->toArray(), ['is_saved' => $isSaved]),
            'relatedCampaigns' => $relatedCampaigns,
        ]);
    }

    /**
     * Photo Editor Page for Campaign
     */
    public function editor(string $slug)
    {
        $campaign = Campaign::with(['creator', 'category', 'primaryFrame'])
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('Campaigns/Editor', [
            'campaign' => $campaign,
        ]);
    }

    /**
     * Record Photo Generation (Supports Guests & Users)
     */
    public function generate(Request $request, int $id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->increment('supporters_count');

        CampaignSupporter::create([
            'campaign_id' => $campaign->id,
            'user_id' => Auth::id(),
            'supporter_name' => Auth::check() ? Auth::user()->name : 'Anonymous Supporter',
        ]);

        if (Auth::check()) {
            GeneratedPhoto::create([
                'user_id' => Auth::id(),
                'campaign_id' => $campaign->id,
                'image_url' => $campaign->frame_url,
                'format' => $request->input('format', 'png'),
                'quality' => $request->input('quality', 'standard'),
            ]);
        }

        return response()->json([
            'success' => true,
            'supporters_count' => $campaign->supporters_count,
        ]);
    }

    /**
     * Save / Bookmark Campaign Toggle
     */
    public function toggleSave(int $id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $existing = SavedCampaign::where('user_id', $user->id)
            ->where('campaign_id', $id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['saved' => false]);
        }

        SavedCampaign::create([
            'user_id' => $user->id,
            'campaign_id' => $id,
        ]);

        return response()->json(['saved' => true]);
    }

    /**
     * Campaign Wizard Page
     */
    public function create()
    {
        $categories = Category::orderBy('order')->get();
        return Inertia::render('Campaigns/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store New Campaign
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'title_bn' => 'nullable|string|max:255',
            'slug' => 'required|string|max:255|unique:campaigns,slug',
            'category_id' => 'required|exists:categories,id',
            'frame_file' => 'required|image|mimes:png,webp|max:10240',
            'description' => 'nullable|string',
            'description_bn' => 'nullable|string',
            'tags' => 'nullable|string',
            'visibility' => 'required|in:public,unlisted,private',
            'status' => 'required|in:published,draft',
            'aspect_ratio' => 'required|string',
            'default_zoom' => 'nullable|numeric',
        ]);

        // Upload frame image
        $file = $request->file('frame_file');
        $fileName = time() . '_' . Str::slug($request->title) . '.' . $file->getClientOriginalExtension();
        $file->storeAs('frames', $fileName, 'public');

        // Dual storage assurance for shared hosting / cPanel environments
        $storedAppPath = storage_path('app/public/frames/' . $fileName);
        if (file_exists($storedAppPath)) {
            @chmod($storedAppPath, 0644);
        }

        $publicFramesDir = public_path('storage/frames');
        if (!file_exists($publicFramesDir)) {
            @mkdir($publicFramesDir, 0755, true);
        }
        if (file_exists($storedAppPath) && !file_exists($publicFramesDir . '/' . $fileName)) {
            @copy($storedAppPath, $publicFramesDir . '/' . $fileName);
            @chmod($publicFramesDir . '/' . $fileName, 0644);
        }

        $frameUrl = '/storage/frames/' . $fileName;

        $campaign = Campaign::create([
            'creator_id' => Auth::id(),
            'category_id' => $request->category_id,
            'title' => $request->title,
            'title_bn' => $request->title_bn,
            'slug' => Str::slug($request->slug),
            'description' => $request->description,
            'description_bn' => $request->description_bn,
            'campaign_type' => $request->input('campaign_type', 'frame'),
            'frame_url' => $frameUrl,
            'thumbnail_url' => $frameUrl,
            'status' => $request->status,
            'visibility' => $request->visibility,
            'tags' => $request->tags,
            'supporters_count' => 1,
            'views_count' => 1,
            'start_date' => now(),
        ]);

        CampaignFrame::create([
            'campaign_id' => $campaign->id,
            'frame_url' => $frameUrl,
            'canvas_width' => 1080,
            'canvas_height' => 1080,
            'aspect_ratio' => $request->aspect_ratio,
            'photo_area_config' => [
                'zoom' => (float) $request->input('default_zoom', 1),
            ],
        ]);

        return redirect()->route('campaigns.show', $campaign->slug)
            ->with('success', 'Campaign created successfully!');
    }

    /**
     * Edit Campaign Page
     */
    public function edit(int $id)
    {
        $campaign = Campaign::with(['primaryFrame', 'category'])->findOrFail($id);

        if (Auth::id() !== $campaign->creator_id && Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized. You can only edit your own campaigns.');
        }

        $categories = Category::orderBy('order')->get();

        return Inertia::render('Campaigns/Edit', [
            'campaign' => $campaign,
            'categories' => $categories,
        ]);
    }

    /**
     * Update Existing Campaign
     */
    public function update(Request $request, int $id)
    {
        $campaign = Campaign::with('primaryFrame')->findOrFail($id);

        if (Auth::id() !== $campaign->creator_id && Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized.');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'title_bn' => 'nullable|string|max:255',
            'slug' => 'required|string|max:255|unique:campaigns,slug,' . $campaign->id,
            'category_id' => 'required|exists:categories,id',
            'frame_file' => 'nullable|image|mimes:png,webp|max:10240',
            'description' => 'nullable|string',
            'description_bn' => 'nullable|string',
            'tags' => 'nullable|string',
            'visibility' => 'required|in:public,unlisted,private',
            'status' => 'required|in:published,draft',
            'aspect_ratio' => 'nullable|string',
            'default_zoom' => 'nullable|numeric',
        ]);

        $frameUrl = $campaign->frame_url;

        // If new replacement frame is uploaded
        if ($request->hasFile('frame_file')) {
            $file = $request->file('frame_file');
            $fileName = time() . '_' . Str::slug($request->title) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('frames', $fileName, 'public');

            // Dual storage sync
            $storedAppPath = storage_path('app/public/frames/' . $fileName);
            if (file_exists($storedAppPath)) {
                @chmod($storedAppPath, 0644);
            }

            $publicFramesDir = public_path('storage/frames');
            if (!file_exists($publicFramesDir)) {
                @mkdir($publicFramesDir, 0755, true);
            }
            if (file_exists($storedAppPath) && !file_exists($publicFramesDir . '/' . $fileName)) {
                @copy($storedAppPath, $publicFramesDir . '/' . $fileName);
                @chmod($publicFramesDir . '/' . $fileName, 0644);
            }

            $frameUrl = '/storage/frames/' . $fileName;
        }

        $campaign->update([
            'category_id' => $request->category_id,
            'title' => $request->title,
            'title_bn' => $request->title_bn,
            'slug' => Str::slug($request->slug),
            'description' => $request->description,
            'description_bn' => $request->description_bn,
            'frame_url' => $frameUrl,
            'thumbnail_url' => $frameUrl,
            'status' => $request->status,
            'visibility' => $request->visibility,
            'tags' => $request->tags,
        ]);

        // Update primary frame configuration
        if ($campaign->primaryFrame) {
            $campaign->primaryFrame->update([
                'frame_url' => $frameUrl,
                'aspect_ratio' => $request->input('aspect_ratio', $campaign->primaryFrame->aspect_ratio ?? '1:1'),
                'photo_area_config' => [
                    'zoom' => (float) $request->input('default_zoom', 1),
                ],
            ]);
        }

        return redirect()->route('campaigns.show', $campaign->slug)
            ->with('success', 'Campaign updated successfully!');
    }

    /**
     * Report Campaign
     */
    public function report(Request $request, int $id)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Report::create([
            'reporter_id' => Auth::id(),
            'campaign_id' => $id,
            'reason' => $request->reason,
            'description' => $request->description,
            'status' => 'pending',
        ]);

        return response()->json(['success' => true]);
    }
}

