<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\CampaignSupporter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('campaigns')
            ->orderBy('order')
            ->get();

        $trendingCampaigns = Campaign::with(['creator', 'category'])
            ->where('status', 'published')
            ->where('visibility', 'public')
            ->where('is_trending', true)
            ->orderByDesc('supporters_count')
            ->take(6)
            ->get();

        $featuredCampaigns = Campaign::with(['creator', 'category'])
            ->where('status', 'published')
            ->where('visibility', 'public')
            ->where('is_featured', true)
            ->orderByDesc('supporters_count')
            ->take(6)
            ->get();

        $recentCampaigns = Campaign::with(['creator', 'category'])
            ->where('status', 'published')
            ->where('visibility', 'public')
            ->latest()
            ->take(6)
            ->get();

        $totalSupporters = CampaignSupporter::count() + 54000;
        $totalCampaigns = Campaign::where('status', 'published')->count();

        return Inertia::render('Home', [
            'categories' => $categories,
            'trendingCampaigns' => $trendingCampaigns,
            'featuredCampaigns' => $featuredCampaigns,
            'recentCampaigns' => $recentCampaigns,
            'stats' => [
                'totalSupporters' => $totalSupporters,
                'totalCampaigns' => $totalCampaigns,
            ],
        ]);
    }
}

