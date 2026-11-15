<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
    ];

    public static function get(string $key, $default = null)
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('platform_settings')) {
                return $default;
            }

            $setting = static::where('key', $key)->first();
            if (!$setting) {
                return $default;
            }

            return match ($setting->type) {
                'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
                'integer' => (int) $setting->value,
                'json' => json_decode($setting->value, true),
                default => $setting->value,
            };
        } catch (\Throwable $e) {
            return $default;
        }
    }

    public static function set(string $key, $value, string $type = 'string')
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('platform_settings')) {
                return null;
            }

            $storedValue = is_array($value) ? json_encode($value) : (string) $value;
            return static::updateOrCreate(
                ['key' => $key],
                ['value' => $storedValue, 'type' => $type]
            );
        } catch (\Throwable $e) {
            return null;
        }
    }
}

