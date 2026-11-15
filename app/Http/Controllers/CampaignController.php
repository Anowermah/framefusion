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
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
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
            'filters' => [
                'search' => (string) $request->input('search', ''),
                'category' => (string) $request->input('category', ''),
                'sort' => (string) $request->input('sort', 'trending'),
            ],
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
        $with = ['creator', 'category'];
        if (Schema::hasTable('campaign_frames')) {
            $with[] = 'primaryFrame';
        }
        if (Schema::hasTable('gallery_posts')) {
            $with[] = 'galleryPosts.user';
            if (Schema::hasTable('comments')) {
                $with[] = 'galleryPosts.comments.user';
            }
        }

        $campaign = Campaign::with($with)
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view count
        $campaign->increment('views_count');

        $isSaved = false;
        if (Auth::check() && Schema::hasTable('saved_campaigns')) {
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

        $ogImageUrl = route('campaigns.og-image', $campaign->slug);
        $directFrameUrl = !empty($campaign->frame_url) ? url($campaign->frame_url) : (!empty($campaign->thumbnail_url) ? url($campaign->thumbnail_url) : null);

        return Inertia::render('Campaigns/Show', [
            'campaign' => array_merge($campaign->toArray(), [
                'is_saved' => $isSaved,
                'og_image_url' => $ogImageUrl,
                'direct_frame_url' => $directFrameUrl,
                'canonical_url' => route('campaigns.show', $campaign->slug),
            ]),
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
     * Generate or serve Open Graph / Twitter feature image for social share cards
     */
    public function ogImage(string $slug)
    {
        $campaign = Campaign::with('category')->where('slug', $slug)->first();
        if (!$campaign) {
            return redirect(asset('/apple-touch-icon.png'));
        }

        // Cache directory
        $cacheDir = storage_path('app/public/og-cache');
        if (!file_exists($cacheDir)) {
            @mkdir($cacheDir, 0755, true);
        }
        $cacheFile = $cacheDir . '/' . $campaign->slug . '.png';

        // Serve cached version if fresh
        $lastModified = $campaign->updated_at ? $campaign->updated_at->timestamp : 0;
        if (file_exists($cacheFile) && filemtime($cacheFile) >= $lastModified) {
            return response()->file($cacheFile, [
                'Content-Type' => 'image/png',
                'Cache-Control' => 'public, max-age=604800, immutable',
            ]);
        }

        // Locate frame file
        $framePath = null;
        if (!empty($campaign->frame_url)) {
            $cleaned = ltrim(str_replace('/storage/', '', $campaign->frame_url), '/');
            if (file_exists(storage_path('app/public/' . $cleaned))) {
                $framePath = storage_path('app/public/' . $cleaned);
            } elseif (file_exists(public_path($campaign->frame_url))) {
                $framePath = public_path($campaign->frame_url);
            }
        }

        if (!$framePath && !empty($campaign->thumbnail_url)) {
            $cleaned = ltrim(str_replace('/storage/', '', $campaign->thumbnail_url), '/');
            if (file_exists(storage_path('app/public/' . $cleaned))) {
                $framePath = storage_path('app/public/' . $cleaned);
            } elseif (file_exists(public_path($campaign->thumbnail_url))) {
                $framePath = public_path($campaign->thumbnail_url);
            }
        }

        // If GD is available and frame file exists, generate high-resolution share card (1200x630)
        if ($framePath && file_exists($framePath) && function_exists('imagecreatetruecolor')) {
            try {
                $width = 1200;
                $height = 630;
                $img = imagecreatetruecolor($width, $height);

                imagealphablending($img, true);

                // Background: #F8F9FC
                $bgColor = imagecolorallocate($img, 248, 249, 252);
                imagefilledrectangle($img, 0, 0, $width, $height, $bgColor);

                // Top Accent Bar (Brand Purple #635BFF)
                $brandPurple = imagecolorallocate($img, 99, 91, 255);
                imagefilledrectangle($img, 0, 0, $width, 8, $brandPurple);

                // Frame Placement (Left Column: 540x540 at 45, 45)
                $targetSize = 540;
                $targetX = 45;
                $targetY = 45;

                // Frame mount white card with soft border
                $white = imagecolorallocate($img, 255, 255, 255);
                $cardBorder = imagecolorallocate($img, 226, 232, 240);
                imagefilledrectangle($img, $targetX, $targetY, $targetX + $targetSize, $targetY + $targetSize, $white);
                imagerectangle($img, $targetX, $targetY, $targetX + $targetSize, $targetY + $targetSize, $cardBorder);

                // Avatar silhouette placeholder behind the frame's transparent center
                $avatarGray = imagecolorallocate($img, 226, 232, 240);
                $centerX = $targetX + (int)($targetSize / 2);
                $centerY = $targetY + (int)($targetSize / 2);
                imagefilledellipse($img, $centerX, $centerY - 30, 140, 140, $avatarGray);
                imagefilledellipse($img, $centerX, $centerY + 120, 260, 170, $avatarGray);

                // Overlay the campaign frame onto the canvas
                $frameData = @file_get_contents($framePath);
                $frameImg = $frameData ? @imagecreatefromstring($frameData) : null;

                if ($frameImg) {
                    $fw = imagesx($frameImg);
                    $fh = imagesy($frameImg);
                    imagealphablending($frameImg, true);
                    imagecopyresampled($img, $frameImg, $targetX, $targetY, 0, 0, $targetSize, $targetSize, $fw, $fh);
                    imagedestroy($frameImg);

                    // Right Column Content (x: 630 to 1150)
                    $textColor = imagecolorallocate($img, 17, 24, 39);
                    $subtextColor = imagecolorallocate($img, 107, 114, 128);
                    $siteName = PlatformSetting::get('site_name', 'FrameFusion');

                    // Category Pill Badge
                    $catName = strtoupper($campaign->category ? $campaign->category->name : 'FEATURED FRAME');
                    $badgeBg = imagecolorallocate($img, 238, 242, 255);
                    $badgeText = imagecolorallocate($img, 99, 91, 255);
                    $badgeWidth = min(400, strlen($catName) * 10 + 30);
                    imagefilledrectangle($img, 630, 65, 630 + $badgeWidth, 98, $badgeBg);
                    imagestring($img, 5, 645, 74, $catName, $badgeText);

                    // Campaign Title (Word wrap up to 3 lines)
                    $titleLines = explode("\n", wordwrap($campaign->title, 32, "\n"));
                    $y = 130;
                    foreach (array_slice($titleLines, 0, 3) as $line) {
                        imagestring($img, 5, 630, $y, $line, $textColor);
                        $y += 32;
                    }

                    // Call To Action Box
                    $ctaY = max($y + 25, 310);
                    $ctaBoxBg = imagecolorallocate($img, 255, 255, 255);
                    $ctaBoxBorder = imagecolorallocate($img, 229, 231, 235);
                    imagefilledrectangle($img, 630, $ctaY, 1145, $ctaY + 120, $ctaBoxBg);
                    imagerectangle($img, 630, $ctaY, 1145, $ctaY + 120, $ctaBoxBorder);

                    $ctaTitle = imagecolorallocate($img, 31, 41, 55);
                    $ctaAction = imagecolorallocate($img, 99, 91, 255);
                    imagestring($img, 5, 650, $ctaY + 22, "Add your photo into this frame!", $ctaTitle);
                    imagestring($img, 4, 650, $ctaY + 54, "100% Free - Instant 1-Click Twibbon Creator", $ctaAction);
                    imagestring($img, 3, 650, $ctaY + 84, "Join thousands supporting this campaign.", $subtextColor);

                    // Footer branding
                    imagestring($img, 4, 630, 545, "Powered by " . $siteName . " | Twibbon & Photo Campaign Platform", $subtextColor);

                    // Save to cache
                    imagepng($img, $cacheFile, 8);
                    imagedestroy($img);

                    return response()->file($cacheFile, [
                        'Content-Type' => 'image/png',
                        'Cache-Control' => 'public, max-age=604800, immutable',
                    ]);
                }
            } catch (\Throwable $e) {
                // Ignore rendering error and fallback
            }
        }

        // Direct fallback: serve frame file
        if ($framePath && file_exists($framePath)) {
            return response()->file($framePath, [
                'Content-Type' => 'image/png',
                'Cache-Control' => 'public, max-age=604800',
            ]);
        }

        return redirect(asset('/apple-touch-icon.png'));
    }

    /**
     * Record Photo Generation (Supports Guests & Users)
     */
    public function generate(Request $request, int $id)
    {
        $campaign = Campaign::findOrFail($id);
        $campaign->increment('supporters_count');

        if (Schema::hasTable('campaign_supporters')) {
            CampaignSupporter::create([
                'campaign_id' => $campaign->id,
                'user_id' => Auth::id(),
                'supporter_name' => Auth::check() ? Auth::user()->name : 'Anonymous Supporter',
            ]);
        }

        if (Auth::check() && Schema::hasTable('generated_photos')) {
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

        if (!Schema::hasTable('saved_campaigns')) {
            return response()->json(['saved' => false]);
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
    public function edit(string $id)
    {
        $campaign = is_numeric($id)
            ? Campaign::with(['primaryFrame', 'category'])->findOrFail((int) $id)
            : Campaign::with(['primaryFrame', 'category'])->where('slug', $id)->firstOrFail();

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
    public function update(Request $request, string $id)
    {
        $campaign = is_numeric($id)
            ? Campaign::with('primaryFrame')->findOrFail((int) $id)
            : Campaign::with('primaryFrame')->where('slug', $id)->firstOrFail();

        if (Auth::id() !== $campaign->creator_id && Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized.');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'title_bn' => 'nullable|string|max:255',
            'slug' => ['required', 'string', 'max:255', Rule::unique('campaigns', 'slug')->ignore($campaign->id)],
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
            'campaign_type' => $request->input('campaign_type', $campaign->campaign_type),
            'frame_url' => $frameUrl,
            'thumbnail_url' => $frameUrl,
            'status' => $request->status,
            'visibility' => $request->visibility,
            'tags' => $request->tags,
        ]);

        // Update or create primary frame configuration
        if ($campaign->primaryFrame) {
            $campaign->primaryFrame->update([
                'frame_url' => $frameUrl,
                'aspect_ratio' => $request->input('aspect_ratio', $campaign->primaryFrame->aspect_ratio ?? '1:1'),
                'photo_area_config' => [
                    'zoom' => (float) $request->input('default_zoom', 1),
                ],
            ]);
        } else {
            CampaignFrame::create([
                'campaign_id' => $campaign->id,
                'frame_url' => $frameUrl,
                'canvas_width' => 1080,
                'canvas_height' => 1080,
                'aspect_ratio' => $request->input('aspect_ratio', '1:1'),
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

        if (Schema::hasTable('reports')) {
            Report::create([
                'reporter_id' => Auth::id(),
                'campaign_id' => $id,
                'reason' => $request->reason,
                'description' => $request->description,
                'status' => 'pending',
            ]);
        }

        return response()->json(['success' => true]);
    }
}

