<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignFrame extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'frame_url',
        'canvas_width',
        'canvas_height',
        'aspect_ratio',
        'photo_area_config',
    ];

    protected $casts = [
        'canvas_width' => 'integer',
        'canvas_height' => 'integer',
        'photo_area_config' => 'array',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }
}

