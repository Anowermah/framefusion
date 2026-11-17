<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Category;
use App\Models\PlatformSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiStudioTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        PlatformSetting::set('ai_assistant_enabled', true, 'boolean');
        PlatformSetting::set('ai_studio_page_enabled', true, 'boolean');
    }

    public function test_ai_studio_page_can_be_rendered(): void
    {
        $response = $this->get('/ai-studio');
        $response->assertStatus(200);
    }

    public function test_ai_search_returns_json_results(): void
    {
        $category = Category::create(['name' => 'Celebration', 'slug' => 'celebration']);
        $user = User::factory()->create();

        Campaign::create([
            'creator_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Birthday Celebration Frame',
            'title_bn' => 'জন্মদিনের শুভেচ্ছা ফ্রেম',
            'slug' => 'birthday-celebration-frame',
            'frame_url' => '/storage/frames/test.png',
            'status' => 'published',
            'visibility' => 'public',
            'tags' => 'birthday,celebration',
        ]);

        $response = $this->postJson('/api/ai/search', ['query' => 'জন্মদিন']);
        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['success', 'campaigns']);
    }

    public function test_ai_chat_returns_conversational_reply_and_campaigns(): void
    {
        $category = Category::create(['name' => 'Celebration', 'slug' => 'celebration']);
        $user = User::factory()->create();

        Campaign::create([
            'creator_id' => $user->id,
            'category_id' => $category->id,
            'title' => 'Birthday Greeting',
            'title_bn' => 'জন্মদিনের শুভেচ্ছা ফ্রেম',
            'slug' => 'birthday-greeting-unique',
            'frame_url' => '/storage/frames/test.png',
            'status' => 'published',
            'visibility' => 'public',
        ]);

        $response = $this->postJson('/api/ai/chat', [
            'message' => 'জন্মদিনের শুভেচ্ছা ফ্রেম'
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['success', 'reply', 'campaigns']);
    }

    public function test_ai_chat_validates_empty_message(): void
    {
        $response = $this->postJson('/api/ai/chat', [
            'message' => ''
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }
}
