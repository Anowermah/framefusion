<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
}
