<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FrameFusionPlatformTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }
    public function test_homepage_renders_successfully(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertSee('FrameFusion');
    }

    public function test_explore_page_renders_with_filters(): void
    {
        $response = $this->get('/explore?search=Independence&sort=trending');
        $response->assertStatus(200);
    }

    public function test_trending_and_categories_pages(): void
    {
        $this->get('/trending')->assertStatus(200);
        $this->get('/categories')->assertStatus(200);
    }

    public function test_static_information_pages(): void
    {
        $this->get('/how-it-works')->assertStatus(200);
        $this->get('/about')->assertStatus(200);
        $this->get('/contact')->assertStatus(200);
        $this->get('/privacy')->assertStatus(200);
        $this->get('/terms')->assertStatus(200);
    }

    public function test_campaign_details_and_photo_editor_render(): void
    {
        $campaign = Campaign::first();
        $this->assertNotNull($campaign);

        // Details page
        $resDetails = $this->get('/campaigns/' . $campaign->slug);
        $resDetails->assertStatus(200);

        // Photo editor page
        $resEditor = $this->get('/campaigns/' . $campaign->slug . '/editor');
        $resEditor->assertStatus(200);
    }

    public function test_photo_generation_increments_supporters_counter(): void
    {
        $campaign = Campaign::first();
        $initialCount = $campaign->supporters_count;

        $response = $this->postJson("/campaigns/{$campaign->id}/generate", [
            'format' => 'png',
            'quality' => 'standard',
        ]);

        $response->assertStatus(200);
        $this->assertEquals($initialCount + 1, $campaign->fresh()->supporters_count);
    }

    public function test_user_dashboard_authenticated_access(): void
    {
        $user = User::where('role', 'user')->first() ?? User::factory()->create();

        $this->actingAs($user)->get('/dashboard')->assertStatus(200);
        $this->actingAs($user)->get('/dashboard/campaigns')->assertStatus(200);
        $this->actingAs($user)->get('/dashboard/photos')->assertStatus(200);
        $this->actingAs($user)->get('/dashboard/saved')->assertStatus(200);
    }

    public function test_admin_dashboard_access(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->get('/admin')->assertStatus(200);
        $this->actingAs($admin)->get('/admin/users')->assertStatus(200);
        $this->actingAs($admin)->get('/admin/campaigns')->assertStatus(200);
        $this->actingAs($admin)->get('/admin/categories')->assertStatus(200);
        $this->actingAs($admin)->get('/admin/reports')->assertStatus(200);
        $this->actingAs($admin)->get('/admin/settings')->assertStatus(200);
        $this->actingAs($admin)->get('/admin/analytics')->assertStatus(200);
    }
}

