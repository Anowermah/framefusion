<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\PlatformSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AiStudioController extends Controller
{
    /**
     * Display the Dedicated AI Studio Page
     */
    public function index()
    {
        $enabled = PlatformSetting::get('ai_assistant_enabled', true) && PlatformSetting::get('ai_studio_page_enabled', true);
        
        if (!$enabled) {
            return redirect()->route('campaigns.explore');
        }

        $categories = Category::select('id', 'name', 'name_bn', 'slug', 'icon')->get();
        $featuredCampaigns = Campaign::where('status', 'published')
            ->where('is_featured', true)
            ->with(['category:id,name,name_bn,slug', 'frames'])
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('AiStudio/Index', [
            'categories' => $categories,
            'featuredCampaigns' => $featuredCampaigns,
            'aiSettings' => [
                'bot_name' => PlatformSetting::get('ai_bot_name', 'FrameFusion AI'),
                'bot_name_bn' => PlatformSetting::get('ai_bot_name_bn', 'ফ্রেমফিউশন এআই'),
                'welcome_bn' => PlatformSetting::get('ai_welcome_message_bn'),
                'welcome_en' => PlatformSetting::get('ai_welcome_message_en'),
                'suggestions' => array_filter(array_map('trim', explode("\n", PlatformSetting::get('ai_suggestions', '')))),
                'auto_center' => PlatformSetting::get('ai_auto_center_enabled', true),
            ],
        ]);
    }

    /**
     * AI Search for campaigns based on query
     */
    public function search(Request $request)
    {
        $query = trim($request->input('query', ''));
        
        if (empty($query)) {
            $campaigns = Campaign::where('status', 'published')
                ->with(['category:id,name,name_bn,slug', 'frames'])
                ->orderByDesc('supporters_count')
                ->take(6)
                ->get();
                
            return response()->json(['success' => true, 'campaigns' => $campaigns]);
        }

        $words = array_filter(explode(' ', $query), fn($w) => mb_strlen(trim($w)) > 1);

        $campaignQuery = Campaign::where('status', 'published')
            ->with(['category:id,name,name_bn,slug', 'frames']);

        $campaignQuery->where(function ($q) use ($query, $words) {
            $q->where('title', 'like', "%{$query}%")
              ->orWhere('title_bn', 'like', "%{$query}%")
              ->orWhere('description', 'like', "%{$query}%")
              ->orWhere('description_bn', 'like', "%{$query}%")
              ->orWhere('tags', 'like', "%{$query}%")
              ->orWhereHas('category', function ($catQ) use ($query) {
                  $catQ->where('name', 'like', "%{$query}%")
                       ->orWhere('name_bn', 'like', "%{$query}%");
              });

            foreach ($words as $word) {
                $q->orWhere('title', 'like', "%{$word}%")
                  ->orWhere('title_bn', 'like', "%{$word}%")
                  ->orWhere('tags', 'like', "%{$word}%");
            }
        });

        $campaigns = $campaignQuery->orderByDesc('supporters_count')
            ->orderByDesc('views_count')
            ->take(6)
            ->get();

        return response()->json([
            'success' => true,
            'query' => $query,
            'campaigns' => $campaigns,
        ]);
    }

    /**
     * Process conversational chat with smart AI
     */
    public function chat(Request $request)
    {
        $message = trim($request->input('message', ''));
        $history = $request->input('history', []);

        if (empty($message)) {
            return response()->json([
                'success' => false,
                'reply' => 'অনুগ্রহ করে কিছু লিখুন।'
            ], 422);
        }

        $geminiKey = PlatformSetting::get('gemini_api_key', config('services.gemini.key', ''));

        // Check if user is asking for frames
        $campaigns = [];
        $searchResponse = $this->search(new Request(['query' => $message]));
        $campaignData = json_decode($searchResponse->getContent(), true);
        if (!empty($campaignData['campaigns'])) {
            $campaigns = $campaignData['campaigns'];
        }

        // 1. Try Gemini API if key is configured
        if (!empty($geminiKey)) {
            try {
                $geminiReply = $this->callGeminiApi($geminiKey, $message, $history, $campaigns);
                if (!empty($geminiReply)) {
                    return response()->json([
                        'success' => true,
                        'reply' => $geminiReply,
                        'campaigns' => $campaigns,
                    ]);
                }
            } catch (\Throwable $e) {
                Log::warning('Gemini API call failed, falling back to local smart engine: ' . $e->getMessage());
            }
        }

        // 2. High-Performance Local Intelligent Fallback Engine
        $localReply = $this->generateLocalResponse($message, $campaigns);

        return response()->json([
            'success' => true,
            'reply' => $localReply,
            'campaigns' => $campaigns,
        ]);
    }

    /**
     * Call Gemini API for natural conversation
     */
    protected function callGeminiApi(string $apiKey, string $message, array $history, array $campaigns): ?string
    {
        $campaignTitles = array_map(fn($c) => $c['title'] . (!empty($c['title_bn']) ? " ({$c['title_bn']})" : ''), array_slice($campaigns, 0, 4));
        $titlesStr = implode(', ', $campaignTitles);

        $systemInstruction = "You are FrameFusion AI Assistant, a friendly and smart AI agent for an automated photo frame and twibbon platform in Bangladesh. "
            . "You help users discover frames, customize templates, and download their photo with frame. "
            . "Always reply politely in the language the user asked in (Bengali or English). "
            . "Keep replies concise, friendly, and direct (max 2-3 short sentences). "
            . (!empty($titlesStr) ? "The user's query matched these available frames: {$titlesStr}. Mention that they can pick one below to start." : "If you cannot find a direct frame, encourage them to describe the occasion or explore popular categories.");

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}";

        $response = Http::timeout(10)->post($url, [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => "System instruction: {$systemInstruction}\n\nUser Message: {$message}"]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.7,
                'maxOutputTokens' => 250,
            ]
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
        }

        return null;
    }

    /**
     * Generate responsive Bengali & English smart replies locally
     */
    protected function generateLocalResponse(string $message, array $campaigns): string
    {
        $lower = mb_strtolower($message);

        // Greetings
        if (preg_match('/(hi|hello|hey|হাই|হ্যালো|সালাম|আসসালামু|নমস্কার)/u', $lower)) {
            return "আসসালামু আলাইকুম! আমি ফ্রেমফিউশন এআই সহকারী। আপনি কী ধরণের ফ্রেম খুঁজতে বা তৈরি করতে চান? আমাকে জানান (যেমন: বিজয় দিবস, জন্মদিন, মাহফিল নোটিশ বা রাজনৈতিক ফ্রেম)।";
        }

        // Thank you
        if (preg_match('/(ধন্যবাদ|thanks|thank you|শুকরিয়া)/u', $lower)) {
            return "আপনাকেও অসংখ্য ধন্যবাদ! আর কোনো ফ্রেম প্রয়োজন হলে বলুন, আমি সাহায্য করতে প্রস্তুত।";
        }

        // Help
        if (preg_match('/(কীভাবে|help|সাহায্য|নিয়ম|how)/u', $lower)) {
            return "খুব সহজ! আপনার পছন্দের ফ্রেমের নাম লিখুন (যেমন: বিজয় দিবস, ঈদ, জন্মদিন), ফ্রেমটি সিলেক্ট করে আপনার ছবি ও তথ্য দিলেই নিমেষে ফ্রেম রেডি হয়ে যাবে এবং ১-ক্লিকে ডাউনলোড করতে পারবেন।";
        }

        // Found campaigns
        if (!empty($campaigns)) {
            $count = count($campaigns);
            return "আপনার বর্ণনার সাথে মিল রেখে {$count}টি চমৎকার ফ্রেম পেয়েছি! নিচে যেকোনো একটি ফ্রেমে ট্যাপ করে আপনার ছবি ও তথ্য দিয়ে ডাউনলোড করে নিন:";
        }

        // No direct campaign match
        return "আপনার খোঁজা বিষয়ের সরাসরি ফ্রেম পাওয়া যায়নি। আপনি কি 'বিজয় দিবস', 'জন্মদিন', 'ঈদ মোবারক' বা 'নোটিশ পোস্টার' ইত্যাদি লিখে দেখতে চান? নিচে জনপ্রিয় কিছু ফ্রেম ঘুরে দেখতে পারেন:";
    }
}
