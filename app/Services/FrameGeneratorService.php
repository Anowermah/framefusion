<?php

namespace App\Services;

class FrameGeneratorService
{
    public static function generateSampleFrames(): array
    {
        $dir = public_path('storage/frames');
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }

        $frames = [
            'bangladesh-independence.png' => [
                'title' => 'Bangladesh Independence Day',
                'title_bn' => 'মহান স্বাধীনতা দিবস',
                'primary_color' => [0, 106, 78], // Bangladesh Green
                'accent_color' => [244, 42, 65],  // Red
                'banner_text' => 'INDEPENDENCE DAY CELEBRATION',
                'sub_text' => 'Proud Citizen • 26th March',
                'style' => 'circle',
            ],
            'graduation-2026.png' => [
                'title' => 'Class of 2026 Graduate',
                'title_bn' => 'গ্র্যাজুয়েশন ২০২৬',
                'primary_color' => [30, 41, 59], // Slate Navy
                'accent_color' => [234, 179, 8],  // Gold
                'banner_text' => 'CLASS OF 2026 • PROUD GRADUATE',
                'sub_text' => 'Dream Big • Achieve Greatness',
                'style' => 'circle',
            ],
            'tech-summit-2026.png' => [
                'title' => 'Global AI & Tech Summit 2026',
                'title_bn' => 'গ্লোবাল এআই ও টেক সামিট',
                'primary_color' => [99, 91, 255], // Primary #635BFF
                'accent_color' => [139, 92, 246], // Secondary #8B5CF6
                'banner_text' => 'FUTURE TECH SUMMIT 2026',
                'sub_text' => 'Innovator & Official Delegate',
                'style' => 'rounded',
            ],
            'earth-day.png' => [
                'title' => 'Earth Day & Eco Warrior',
                'title_bn' => 'বিশ্ব ধরিত্রী দিবস',
                'primary_color' => [16, 185, 129], // Emerald
                'accent_color' => [6, 78, 59],     // Dark Green
                'banner_text' => 'EARTH WARRIOR • CLIMATE ACTION',
                'sub_text' => 'One Planet • One Future',
                'style' => 'circle',
            ],
            'champions-league.png' => [
                'title' => 'Champions Football Fever',
                'title_bn' => 'ফুটবল ফ্যান কার্নিভাল',
                'primary_color' => [239, 68, 68],  // Red
                'accent_color' => [30, 58, 138],  // Deep Blue
                'banner_text' => 'MATCH DAY • SUPER FAN',
                'sub_text' => 'Born To Win • Together We Roar',
                'style' => 'circle',
            ],
            'eid-mubarak.png' => [
                'title' => 'Eid Mubarak Celebrations',
                'title_bn' => 'ঈদ মোবারক শুভেচ্ছা',
                'primary_color' => [13, 148, 136], // Teal
                'accent_color' => [245, 158, 11],  // Gold
                'banner_text' => 'EID MUBARAK 2026',
                'sub_text' => 'Peace, Joy & Blessings To All',
                'style' => 'circle',
            ],
        ];

        $generated = [];
        $w = 1080;
        $h = 1080;

        foreach ($frames as $fileName => $meta) {
            $filePath = $dir . DIRECTORY_SEPARATOR . $fileName;
            
            // Create truecolor canvas with transparency
            $img = imagecreatetruecolor($w, $h);
            imagealphablending($img, false);
            imagesavealpha($img, true);

            // Transparent background
            $transparent = imagecolorallocatealpha($img, 0, 0, 0, 127);
            imagefill($img, 0, 0, $transparent);
            imagealphablending($img, true);

            // Colors
            $pColor = imagecolorallocate($img, $meta['primary_color'][0], $meta['primary_color'][1], $meta['primary_color'][2]);
            $aColor = imagecolorallocate($img, $meta['accent_color'][0], $meta['accent_color'][1], $meta['accent_color'][2]);
            $white = imagecolorallocate($img, 255, 255, 255);
            $gold = imagecolorallocate($img, 253, 224, 71);

            // Top Header Bar
            imagefilledrectangle($img, 0, 0, $w, 140, $pColor);
            imagefilledrectangle($img, 0, 140, $w, 150, $aColor);

            // Bottom Banner Card
            imagefilledrectangle($img, 0, $h - 220, $w, $h - 210, $aColor);
            imagefilledrectangle($img, 0, $h - 210, $w, $h, $pColor);

            // Outer decorative borders
            imagefilledrectangle($img, 0, 0, 40, $h, $pColor);
            imagefilledrectangle($img, $w - 40, 0, $w, $h, $pColor);

            // Draw circular or rounded transparent ring guide
            $cx = $w / 2;
            $cy = ($h / 2) - 30;
            $radius = 390;

            if ($meta['style'] === 'circle') {
                // Outer ring
                imagesetthickness($img, 16);
                imageellipse($img, $cx, $cy, $radius * 2, $radius * 2, $aColor);
                imagesetthickness($img, 8);
                imageellipse($img, $cx, $cy, ($radius * 2) + 24, ($radius * 2) + 24, $pColor);

                // Four corner decorative badges
                imagefilledellipse($img, $cx - $radius, $cy, 28, 28, $gold);
                imagefilledellipse($img, $cx + $radius, $cy, 28, 28, $gold);
                imagefilledellipse($img, $cx, $cy - $radius, 28, 28, $gold);
            } else {
                // Rounded frame border
                imagesetthickness($img, 14);
                imagerectangle($img, 120, 180, $w - 120, $h - 250, $aColor);
                imagesetthickness($img, 6);
                imagerectangle($img, 134, 194, $w - 134, $h - 264, $pColor);
            }

            // Top text label
            imagestring($img, 5, 60, 55, "FRAMEFUSION CAMPAIGN: " . strtoupper($meta['title']), $white);

            // Bottom Banner Text
            imagestring($img, 5, 80, $h - 160, $meta['banner_text'], $gold);
            imagestring($img, 4, 80, $h - 110, $meta['sub_text'], $white);
            imagestring($img, 3, $w - 280, $h - 70, "#FrameFusionCampaign", $gold);

            // Save PNG with transparency
            imagepng($img, $filePath, 8);
            imagedestroy($img);

            $generated[$fileName] = '/storage/frames/' . $fileName;
        }

        return $generated;
    }
}

