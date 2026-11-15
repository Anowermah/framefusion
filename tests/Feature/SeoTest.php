<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\PlatformSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeoTest extends TestCase
{
    use RefreshDatabase;

    public function test_sitemap_xml_is_generated_successfully(): void
    {
        $creator = User::factory()->create();
        $category = Category::create([
            'name' => 'National',
            'slug' => 'national',
            'icon' => 'Flag',
        ]);

        Campaign::create([
            'creator_id' => $creator->id,
            'category_id' => $category->id,
            'title' => 'Victory Day Special Frame',
            'slug' => 'victory-day-special',
            'description' => 'Celebrate victory with this official photo frame.',
            'frame_url' => '/storage/frames/bangladesh-independence.png',
            'status' => 'published',
            'visibility' => 'public',
        ]);

        $response = $this->get('/sitemap.xml');

        $response->assertStatus(200);
        $this->assertStringContainsString('application/xml', $response->headers->get('Content-Type'));
        $this->assertStringContainsString('<urlset', $response->getContent());
        $this->assertStringContainsString('victory-day-special', $response->getContent());
        $this->assertStringContainsString('<image:image>', $response->getContent());
    }

    public function test_robots_txt_contains_sitemap_reference(): void
    {
        $response = $this->get('/robots.txt');

        $response->assertStatus(200);
        $this->assertStringContainsString('User-agent: *', $response->getContent());
        $this->assertStringContainsString('Sitemap:', $response->getContent());
        $this->assertStringContainsString('Disallow: /admin/', $response->getContent());
    }

    public function test_campaign_page_renders_complete_open_graph_and_twitter_meta_tags(): void
    {
        $creator = User::factory()->create();
        $category = Category::create([
            'name' => 'Celebration',
            'slug' => 'celebration',
            'icon' => 'Sparkles',
        ]);

        $campaign = Campaign::create([
            'creator_id' => $creator->id,
            'category_id' => $category->id,
            'title' => 'Celebration Festival Frame 2026',
            'slug' => 'celebration-festival-2026',
            'description' => 'A wonderful festive frame for social media celebrations.',
            'tags' => 'festival,celebration,party',
            'frame_url' => '/storage/frames/bangladesh-independence.png',
            'status' => 'published',
            'visibility' => 'public',
        ]);

        $response = $this->get("/campaigns/{$campaign->slug}");

        $response->assertStatus(200);
        $content = $response->getContent();

        // Title and standard meta
        $this->assertStringContainsString('Celebration Festival Frame 2026', $content);
        $this->assertStringContainsString('name="description"', $content);
        $this->assertStringContainsString('name="keywords"', $content);
        $this->assertStringContainsString('rel="canonical"', $content);

        // Open Graph tags
        $this->assertStringContainsString('property="og:type" content="article"', $content);
        $this->assertStringContainsString('property="og:title"', $content);
        $this->assertStringContainsString('property="og:description"', $content);
        $this->assertStringContainsString('property="og:image"', $content);
        $this->assertStringContainsString("/campaigns/{$campaign->slug}/og-image", $content);

        // Twitter Card tags
        $this->assertStringContainsString('name="twitter:card" content="summary_large_image"', $content);
        $this->assertStringContainsString('name="twitter:image"', $content);

        // Schema.org JSON-LD
        $this->assertStringContainsString('"@type":"CreativeWork"', $content);
    }

    public function test_campaign_og_image_route_serves_or_generates_image(): void
    {
        $creator = User::factory()->create();
        $category = Category::create([
            'name' => 'National',
            'slug' => 'national',
            'icon' => 'Flag',
        ]);

        $campaign = Campaign::create([
            'creator_id' => $creator->id,
            'category_id' => $category->id,
            'title' => 'Independence Hero Frame',
            'slug' => 'independence-hero-frame',
            'description' => 'Support heroes.',
            'frame_url' => '/storage/frames/bangladesh-independence.png',
            'status' => 'published',
            'visibility' => 'public',
        ]);

        $response = $this->get("/campaigns/{$campaign->slug}/og-image");

        // Should return 200 with image/png, or 302 redirect fallback
        $this->assertTrue(in_array($response->getStatusCode(), [200, 302]));
        if ($response->getStatusCode() === 200) {
            $this->assertStringContainsString('image/', $response->headers->get('Content-Type'));
        }
    }
}
