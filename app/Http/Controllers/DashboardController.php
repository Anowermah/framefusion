<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\GeneratedPhoto;
use App\Models\SavedCampaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Dashboard Overview
     */
    public function index()
    {
        $user = Auth::user();

        $campaignsCount = Campaign::where('creator_id', $user->id)->count();
        $totalSupporters = Campaign::where('creator_id', $user->id)->sum('supporters_count');
        $generatedPhotosCount = GeneratedPhoto::where('user_id', $user->id)->count();
        $savedCampaignsCount = SavedCampaign::where('user_id', $user->id)->count();

        $recentCampaigns = Campaign::where('creator_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        $recentGenerated = GeneratedPhoto::with('campaign')
            ->where('user_id', $user->id)
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Dashboard/Overview', [
            'stats' => [
                'totalCampaigns' => $campaignsCount,
                'totalSupporters' => $totalSupporters,
                'generatedPhotos' => $generatedPhotosCount,
                'savedCampaigns' => $savedCampaignsCount,
            ],
            'recentCampaigns' => $recentCampaigns,
            'recentGenerated' => $recentGenerated,
        ]);
    }

    /**
     * User's Campaigns
     */
    public function myCampaigns()
    {
        $user = Auth::user();
        $campaigns = Campaign::with('category')
            ->where('creator_id', $user->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Dashboard/MyCampaigns', [
            'campaigns' => $campaigns,
        ]);
    }

    /**
     * User's Generated Photos History
     */
    public function myPhotos()
    {
        $user = Auth::user();
        $photos = GeneratedPhoto::with('campaign')
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(12);

        return Inertia::render('Dashboard/MyPhotos', [
            'photos' => $photos,
        ]);
    }

    /**
     * Saved / Bookmarked Campaigns
     */
    public function savedCampaigns()
    {
        $user = Auth::user();
        $saved = SavedCampaign::with(['campaign.creator', 'campaign.category'])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(12);

        return Inertia::render('Dashboard/Saved', [
            'savedCampaigns' => $saved,
        ]);
    }

    /**
     * Toggle Campaign Publish / Draft Status
     */
    public function toggleCampaignStatus(int $id)
    {
        $campaign = Campaign::where('id', $id)
            ->where('creator_id', Auth::id())
            ->firstOrFail();

        $campaign->status = $campaign->status === 'published' ? 'draft' : 'published';
        $campaign->save();

        return back()->with('success', 'Campaign status updated.');
    }

    /**
     * Delete Campaign
     */
    public function deleteCampaign(int $id)
    {
        $campaign = Campaign::where('id', $id)
            ->where('creator_id', Auth::id())
            ->firstOrFail();

        $campaign->delete();

        return back()->with('success', 'Campaign deleted successfully.');
    }
}

