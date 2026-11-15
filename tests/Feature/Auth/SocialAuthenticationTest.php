<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Contracts\User as SocialiteUserContract;
use Laravel\Socialite\Facades\Socialite;
use Mockery;
use Tests\TestCase;

class SocialAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_google_redirect_warns_if_not_configured(): void
    {
        config(['services.google.client_id' => '']);
        config(['services.google.client_secret' => '']);

        $response = $this->get(route('auth.google'));

        $response->assertRedirect(route('login'));
        $response->assertSessionHasErrors('email');
    }

    public function test_google_redirect_works_when_configured(): void
    {
        config(['services.google.client_id' => 'test-client-id']);
        config(['services.google.client_secret' => 'test-client-secret']);

        $response = $this->get(route('auth.google'));

        $this->assertTrue($response->isRedirection());
        $this->assertStringContainsString('accounts.google.com', $response->headers->get('Location'));
    }

    public function test_google_callback_creates_and_authenticates_new_user(): void
    {
        $mockUser = Mockery::mock(SocialiteUserContract::class);
        $mockUser->shouldReceive('getId')->andReturn('google-123456789');
        $mockUser->shouldReceive('getName')->andReturn('Google Test User');
        $mockUser->shouldReceive('getNickname')->andReturn('googletest');
        $mockUser->shouldReceive('getEmail')->andReturn('newgoogleuser@example.com');
        $mockUser->shouldReceive('getAvatar')->andReturn('https://lh3.googleusercontent.com/photo.jpg');

        $provider = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
        $provider->shouldReceive('user')->andReturn($mockUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get(route('auth.google.callback'));

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $this->assertDatabaseHas('users', [
            'email' => 'newgoogleuser@example.com',
            'google_id' => 'google-123456789',
            'name' => 'Google Test User',
        ]);
    }

    public function test_google_callback_links_existing_user(): void
    {
        $user = User::factory()->create([
            'email' => 'existinguser@example.com',
            'google_id' => null,
        ]);

        $mockUser = Mockery::mock(SocialiteUserContract::class);
        $mockUser->shouldReceive('getId')->andReturn('google-existing-id');
        $mockUser->shouldReceive('getName')->andReturn($user->name);
        $mockUser->shouldReceive('getNickname')->andReturn(null);
        $mockUser->shouldReceive('getEmail')->andReturn($user->email);
        $mockUser->shouldReceive('getAvatar')->andReturn('https://lh3.googleusercontent.com/avatar.jpg');

        $provider = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
        $provider->shouldReceive('user')->andReturn($mockUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get(route('auth.google.callback'));

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('dashboard', absolute: false));

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'google_id' => 'google-existing-id',
        ]);
    }

    public function test_native_oauth_callback_fallback_works(): void
    {
        config(['services.google.client_id' => 'test-id']);
        config(['services.google.client_secret' => 'test-secret']);
        config(['services.google.redirect' => 'http://localhost/auth/google/callback']);

        Http::fake([
            'https://oauth2.googleapis.com/token' => Http::response([
                'access_token' => 'mock_access_token',
                'token_type' => 'Bearer',
                'expires_in' => 3600,
            ], 200),
            'https://www.googleapis.com/oauth2/v3/userinfo' => Http::response([
                'sub' => 'google-sub-987654',
                'email' => 'native@example.com',
                'name' => 'Native Fallback User',
                'picture' => 'https://lh3.googleusercontent.com/native.jpg',
            ], 200),
        ]);

        // Simulating when Socialite throws exception
        $provider = Mockery::mock('Laravel\Socialite\Two\GoogleProvider');
        $provider->shouldReceive('user')->andThrow(new \Exception('Socialite simulated driver error'));
        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get(route('auth.google.callback', ['code' => 'mock_auth_code']));

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $this->assertDatabaseHas('users', [
            'email' => 'native@example.com',
            'google_id' => 'google-sub-987654',
            'name' => 'Native Fallback User',
        ]);
    }
}
