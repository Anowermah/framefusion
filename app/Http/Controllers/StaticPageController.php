<?php

namespace App\Http\Controllers;

use App\Models\PlatformSetting;
use Inertia\Inertia;

class StaticPageController extends Controller
{
    public function about()
    {
        return Inertia::render('Static/About', [
            'customContent' => PlatformSetting::get('page_about_content', ''),
        ]);
    }

    public function contact()
    {
        return Inertia::render('Static/Contact', [
            'contactInfo' => [
                'email' => PlatformSetting::get('contact_email', 'support@framefusion.io'),
                'phone' => PlatformSetting::get('contact_phone', '+880 1700-000000'),
                'address' => PlatformSetting::get('contact_address', 'Dhaka, Bangladesh'),
            ],
        ]);
    }

    public function privacy()
    {
        return Inertia::render('Static/Privacy', [
            'customContent' => PlatformSetting::get('page_privacy_content', ''),
        ]);
    }

    public function terms()
    {
        return Inertia::render('Static/Terms', [
            'customContent' => PlatformSetting::get('page_terms_content', ''),
        ]);
    }

    public function howItWorks()
    {
        return Inertia::render('Static/HowItWorks');
    }
}
