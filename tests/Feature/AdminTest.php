<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\PlatformSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/admin');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/admin');
        $response->assertStatus(200);
    }

    public function test_admin_can_update_platform_settings_in_database(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post('/admin/settings', [
            'site_name' => 'Custom Frame Brand',
            'contact_email' => 'admin@custombrand.com',
            'announcement_enabled' => true,
            'announcement_text' => 'Special holiday announcement!',
        ]);

        $response->assertSessionHas('success');

        $this->assertEquals('Custom Frame Brand', PlatformSetting::get('site_name'));
        $this->assertEquals('admin@custombrand.com', PlatformSetting::get('contact_email'));
        $this->assertTrue(PlatformSetting::get('announcement_enabled'));
        $this->assertEquals('Special holiday announcement!', PlatformSetting::get('announcement_text'));
    }

    public function test_admin_can_create_and_update_categories(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        // Create
        $response = $this->actingAs($admin)->post('/admin/categories', [
            'name' => 'Sports & Gaming',
            'name_bn' => 'খেলাধুলা ও গেমিং',
            'slug' => 'sports-gaming',
            'icon' => 'Trophy',
            'order' => 5,
        ]);
        $response->assertSessionHas('success');

        $category = Category::where('slug', 'sports-gaming')->first();
        $this->assertNotNull($category);

        // Update
        $updateResponse = $this->actingAs($admin)->put('/admin/categories/' . $category->id, [
            'name' => 'Sports & eSports',
            'name_bn' => 'খেলাধুলা ও ই-স্পোর্টস',
            'slug' => 'sports-gaming',
            'icon' => 'Trophy',
            'order' => 10,
        ]);
        $updateResponse->assertSessionHas('success');

        $this->assertEquals('Sports & eSports', $category->fresh()->name);
        $this->assertEquals(10, $category->fresh()->order);

        // Delete
        $deleteResponse = $this->actingAs($admin)->delete('/admin/categories/' . $category->id);
        $deleteResponse->assertSessionHas('success');
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_admin_can_update_campaign_status_and_badges(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $creator = User::factory()->create(['role' => 'creator']);
        $category = Category::create([
            'name' => 'General',
            'slug' => 'general',
            'icon' => 'Flag',
        ]);

        $campaign = Campaign::create([
            'creator_id' => $creator->id,
            'category_id' => $category->id,
            'title' => 'Community Campaign',
            'slug' => 'community-campaign',
            'frame_url' => '/storage/frames/test.png',
            'status' => 'draft',
            'is_featured' => false,
            'is_trending' => false,
        ]);

        // Update status to published
        $statusResp = $this->actingAs($admin)->post('/admin/campaigns/' . $campaign->id . '/status', [
            'status' => 'published',
        ]);
        $statusResp->assertSessionHas('success');
        $this->assertEquals('published', $campaign->fresh()->status);

        // Toggle feature
        $this->actingAs($admin)->post('/admin/campaigns/' . $campaign->id . '/feature');
        $this->assertTrue($campaign->fresh()->is_featured);

        // Toggle trending
        $this->actingAs($admin)->post('/admin/campaigns/' . $campaign->id . '/trending');
        $this->assertTrue($campaign->fresh()->is_trending);
    }

    public function test_admin_can_manage_users(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $targetUser = User::factory()->create([
            'role' => 'user',
            'status' => 'active',
        ]);

        // Update role
        $this->actingAs($admin)->post('/admin/users/' . $targetUser->id . '/role', [
            'role' => 'creator',
        ]);
        $this->assertEquals('creator', $targetUser->fresh()->role);

        // Toggle status
        $this->actingAs($admin)->post('/admin/users/' . $targetUser->id . '/toggle-status');
        $this->assertEquals('suspended', $targetUser->fresh()->status);

        // Reset password
        $this->actingAs($admin)->post('/admin/users/' . $targetUser->id . '/reset-password', [
            'password' => 'NewAdminSetPassword123!',
        ]);
        $this->assertTrue(Hash::check('NewAdminSetPassword123!', $targetUser->fresh()->password));

        // Delete user
        $this->actingAs($admin)->delete('/admin/users/' . $targetUser->id);
        $this->assertDatabaseMissing('users', ['id' => $targetUser->id]);
    }

    public function test_super_admin_has_full_exclusive_control_and_protection(): void
    {
        $superAdmin = User::factory()->create(['role' => 'super_admin']);
        $regularAdmin = User::factory()->create(['role' => 'admin']);
        $normalUser = User::factory()->create(['role' => 'user']);

        // 1. Regular admin CANNOT promote user to super_admin
        $this->actingAs($regularAdmin)->post('/admin/users/' . $normalUser->id . '/role', [
            'role' => 'super_admin',
        ]);
        $this->assertEquals('user', $normalUser->fresh()->role);

        // 2. Regular admin CANNOT delete or suspend a super_admin
        $this->actingAs($regularAdmin)->delete('/admin/users/' . $superAdmin->id);
        $this->assertDatabaseHas('users', ['id' => $superAdmin->id]);

        $this->actingAs($regularAdmin)->post('/admin/users/' . $superAdmin->id . '/toggle-status');
        $this->assertEquals('active', $superAdmin->fresh()->status);

        // 3. Super admin CAN promote user to super_admin
        $this->actingAs($superAdmin)->post('/admin/users/' . $normalUser->id . '/role', [
            'role' => 'super_admin',
        ]);
        $this->assertEquals('super_admin', $normalUser->fresh()->role);

        // 4. Super admin CAN delete another admin
        $this->actingAs($superAdmin)->delete('/admin/users/' . $regularAdmin->id);
        $this->assertDatabaseMissing('users', ['id' => $regularAdmin->id]);
    }
}
