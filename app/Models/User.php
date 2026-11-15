<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'google_id',
        'avatar_url',
        'bio',
        'role',
        'status',
        'is_verified',
        'social_links',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
            'social_links' => 'array',
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'super_admin']);
    }

    public function isCreator(): bool
    {
        return in_array($this->role, ['creator', 'admin', 'super_admin']);
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class, 'creator_id');
    }

    public function generatedPhotos(): HasMany
    {
        return $this->hasMany(GeneratedPhoto::class);
    }

    public function savedCampaigns(): HasMany
    {
        return $this->hasMany(SavedCampaign::class);
    }

    public function bookmarkedCampaigns(): BelongsToMany
    {
        return $this->belongsToMany(Campaign::class, 'saved_campaigns', 'user_id', 'campaign_id')->withTimestamps();
    }

    public function galleryPosts(): HasMany
    {
        return $this->hasMany(GalleryPost::class);
    }
}
