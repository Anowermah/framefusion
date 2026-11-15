<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle(Request $request): RedirectResponse
    {
        $clientId = trim((string) config('services.google.client_id'), " \t\n\r\0\x0B\"'");
        $clientSecret = trim((string) config('services.google.client_secret'), " \t\n\r\0\x0B\"'");
        $redirect = trim((string) config('services.google.redirect'), " \t\n\r\0\x0B\"'");

        if (empty($clientId) || empty($clientSecret)) {
            return redirect()->route('login')->withErrors([
                'email' => 'Google Login is not configured yet. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment file.',
            ]);
        }

        config([
            'services.google.client_id' => $clientId,
            'services.google.client_secret' => $clientSecret,
            'services.google.redirect' => $redirect,
        ]);

        // If Laravel Socialite package is available in vendor, use it
        if (class_exists(\Laravel\Socialite\Facades\Socialite::class)) {
            try {
                return \Laravel\Socialite\Facades\Socialite::driver('google')->redirect();
            } catch (\Throwable $e) {
                Log::warning('Socialite redirect failed, falling back to native OAuth: ' . $e->getMessage());
            }
        }

        // Native OAuth 2.0 fallback (Works 100% even without vendor/socialite)
        $state = Str::random(40);
        $request->session()->put('google_oauth_state', $state);

        $query = http_build_query([
            'client_id' => $clientId,
            'redirect_uri' => $redirect,
            'response_type' => 'code',
            'scope' => 'openid profile email',
            'state' => $state,
            'access_type' => 'online',
            'prompt' => 'select_account',
        ]);

        return redirect()->away('https://accounts.google.com/o/oauth2/v2/auth?' . $query);
    }

    /**
     * Obtain the user information from Google and authenticate.
     */
    public function handleGoogleCallback(Request $request): RedirectResponse
    {
        try {
            $clientId = trim((string) config('services.google.client_id'), " \t\n\r\0\x0B\"'");
            $clientSecret = trim((string) config('services.google.client_secret'), " \t\n\r\0\x0B\"'");
            $redirect = trim((string) config('services.google.redirect'), " \t\n\r\0\x0B\"'");

            if (!empty($redirect)) {
                config(['services.google.redirect' => $redirect]);
            }

            $googleId = null;
            $googleEmail = null;
            $googleName = null;
            $googleAvatar = null;

            // Try Socialite first if present
            if (class_exists(\Laravel\Socialite\Facades\Socialite::class)) {
                try {
                    $googleUser = \Laravel\Socialite\Facades\Socialite::driver('google')->user();
                    if ($googleUser && !empty($googleUser->getEmail())) {
                        $googleId = (string) $googleUser->getId();
                        $googleEmail = (string) $googleUser->getEmail();
                        $googleName = (string) ($googleUser->getName() ?? $googleUser->getNickname() ?? 'Google User');
                        $googleAvatar = $googleUser->getAvatar();
                    }
                } catch (\Throwable $socialiteEx) {
                    Log::warning('Socialite callback exception, trying native token exchange: ' . $socialiteEx->getMessage());
                }
            }

            // If Socialite was not available or didn't fetch user, use native token exchange
            if (empty($googleEmail)) {
                $code = $request->query('code');
                if (empty($code)) {
                    $errorDesc = $request->query('error_description') ?? $request->query('error') ?? 'Google authorization was cancelled.';
                    return redirect()->route('login')->withErrors([
                        'email' => 'Google authorization failed: ' . $errorDesc,
                    ]);
                }

                // Exchange code for access token
                $tokenResponse = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                    'client_id' => $clientId,
                    'client_secret' => $clientSecret,
                    'code' => $code,
                    'grant_type' => 'authorization_code',
                    'redirect_uri' => $redirect,
                ]);

                if ($tokenResponse->failed()) {
                    $errorMsg = $tokenResponse->json('error_description') ?? $tokenResponse->json('error') ?? 'Token exchange failed';
                    return redirect()->route('login')->withErrors([
                        'email' => 'Google authentication error: ' . $errorMsg,
                    ]);
                }

                $accessToken = $tokenResponse->json('access_token');

                // Retrieve user info
                $userInfoResponse = Http::withToken($accessToken)->get('https://www.googleapis.com/oauth2/v3/userinfo');
                if ($userInfoResponse->failed()) {
                    return redirect()->route('login')->withErrors([
                        'email' => 'Could not retrieve user profile from Google.',
                    ]);
                }

                $googleData = $userInfoResponse->json();
                $googleId = (string) ($googleData['sub'] ?? '');
                $googleEmail = (string) ($googleData['email'] ?? '');
                $googleName = (string) ($googleData['name'] ?? $googleData['given_name'] ?? 'Google User');
                $googleAvatar = $googleData['picture'] ?? null;
            }

            if (empty($googleEmail)) {
                return redirect()->route('login')->withErrors([
                    'email' => 'Unable to authenticate with Google. No email was provided by your account.',
                ]);
            }

            // Find user by google_id or email
            $user = User::where('google_id', $googleId)
                ->orWhere('email', $googleEmail)
                ->first();

            if ($user) {
                // Link Google ID if not already set
                if (empty($user->google_id) && !empty($googleId)) {
                    $user->google_id = $googleId;
                }

                // Update avatar if not set
                if (empty($user->avatar_url) && !empty($googleAvatar)) {
                    $user->avatar_url = $googleAvatar;
                }

                // If email was unverified, mark verified from trusted Google OAuth
                if (empty($user->email_verified_at)) {
                    $user->email_verified_at = now();
                }

                $user->save();
            } else {
                // Generate unique username
                $nameSlug = Str::slug($googleName ?: explode('@', $googleEmail)[0], '_');
                $candidate = $nameSlug ?: 'user';
                $username = $candidate;
                $counter = 1;
                while (User::where('username', $username)->exists()) {
                    $username = $candidate . '_' . $counter++;
                }

                $user = User::create([
                    'name' => $googleName,
                    'username' => $username,
                    'email' => $googleEmail,
                    'google_id' => $googleId,
                    'avatar_url' => $googleAvatar,
                    'password' => Hash::make(Str::random(32)),
                    'role' => 'user',
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]);

                event(new Registered($user));
            }

            Auth::login($user, true);
            $request->session()->regenerate();

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (\Throwable $e) {
            Log::error('Google Social Login Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('login')->withErrors([
                'email' => 'Google authentication failed or was cancelled. (' . Str::limit($e->getMessage(), 120) . ')',
            ]);
        }
    }
}
