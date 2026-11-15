<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle(): RedirectResponse
    {
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');

        if (empty($clientId) || empty($clientSecret)) {
            return redirect()->route('login')->withErrors([
                'email' => 'Google Login is not configured yet. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment file.',
            ]);
        }

        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google and authenticate.
     */
    public function handleGoogleCallback(Request $request): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            if (!$googleUser || empty($googleUser->getEmail())) {
                return redirect()->route('login')->withErrors([
                    'email' => 'Unable to authenticate with Google. No email was provided by your account.',
                ]);
            }

            // Find user by google_id or email
            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            if ($user) {
                // Link Google ID if not already set
                if (empty($user->google_id)) {
                    $user->google_id = $googleUser->getId();
                }

                // Update avatar if not set
                if (empty($user->avatar_url) && !empty($googleUser->getAvatar())) {
                    $user->avatar_url = $googleUser->getAvatar();
                }

                // If email was unverified, mark verified from trusted Google OAuth
                if (empty($user->email_verified_at)) {
                    $user->email_verified_at = now();
                }

                $user->save();
            } else {
                // Generate unique username
                $nameSlug = Str::slug($googleUser->getName() ?? explode('@', $googleUser->getEmail())[0], '_');
                $candidate = $nameSlug ?: 'user';
                $username = $candidate;
                $counter = 1;
                while (User::where('username', $username)->exists()) {
                    $username = $candidate . '_' . $counter++;
                }

                $user = User::create([
                    'name' => $googleUser->getName() ?? $googleUser->getNickname() ?? 'Google User',
                    'username' => $username,
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar_url' => $googleUser->getAvatar(),
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
