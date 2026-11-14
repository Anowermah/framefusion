<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class StaticPageController extends Controller
{
    public function about()
    {
        return Inertia::render('Static/About');
    }

    public function contact()
    {
        return Inertia::render('Static/Contact');
    }

    public function privacy()
    {
        return Inertia::render('Static/Privacy');
    }

    public function terms()
    {
        return Inertia::render('Static/Terms');
    }

    public function howItWorks()
    {
        return Inertia::render('Static/HowItWorks');
    }
}

