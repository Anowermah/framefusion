<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'creator_id',
        'category_id',
        'title',
        'title_bn',
        'slug',
        'description',
        'description_bn',
        'campaign_type',
        'frame_url',
        'thumbnail_url',
        'background_url',
        'status',
        'visibility',
        'is_featured',
        'is_trending',
        'supporters_count',
        'views_count',
        'start_date',
        'end_date',
        'tags',
        'caption_template',
        'action_link_url',
        'action_link_text',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_trending' => 'boolean',
        'supporters_count' => 'integer',
        'views_count' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function frames(): HasMany
    {
        return $this->hasMany(CampaignFrame::class);
    }

    public function primaryFrame()
    {
        return $this->hasOne(CampaignFrame::class)->latestOfMany();
    }

    public function supporters(): HasMany
    {
        return $this->hasMany(CampaignSupporter::class);
    }

    public function generatedPhotos(): HasMany
    {
        return $this->hasMany(GeneratedPhoto::class);
    }

    public function galleryPosts(): HasMany
    {
        return $this->hasMany(GalleryPost::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function isSavedBy(?User $user): bool
    {
        if (!$user) {
            return false;
        }
        return SavedCampaign::where('user_id', $user->id)
            ->where('campaign_id', $this->id)
            ->exists();
    }
}

