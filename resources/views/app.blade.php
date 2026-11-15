<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="{{ \App\Models\PlatformSetting::get('meta_description', 'FrameFusion - Create, customize, and celebrate visual photo campaigns and twibbons.') }}">
        <meta name="keywords" content="{{ \App\Models\PlatformSetting::get('meta_keywords', 'twibbon, photo frame, campaign, profile frame') }}">

        <title inertia>{{ \App\Models\PlatformSetting::get('site_name', config('app.name', 'FrameFusion')) }}</title>

        <!-- Favicon -->
        @php
            $faviconUrl = \App\Models\PlatformSetting::get('site_favicon', '/favicon.ico');
        @endphp
        <link rel="icon" type="image/x-icon" href="{{ $faviconUrl }}">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="shortcut icon" href="{{ $faviconUrl }}">
        <meta name="theme-color" content="{{ \App\Models\PlatformSetting::get('primary_color', '#635BFF') }}">

        <!-- Google Fonts: Inter & Hind Siliguri -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

        <!-- Google Analytics Tracking (Controlled from Admin) -->
        @if($gaId = \App\Models\PlatformSetting::get('google_analytics_id'))
            <script async src="https://www.googletagmanager.com/gtag/js?id={{ $gaId }}"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '{{ $gaId }}');
            </script>
        @endif

        <!-- Custom Header Scripts (Admin Database) -->
        {!! \App\Models\PlatformSetting::get('custom_header_scripts', '') !!}

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-[#F8F9FC] text-[#171923] selection:bg-brand-500 selection:text-white">
        @inertia

        <!-- Custom Footer Scripts (Admin Database) -->
        {!! \App\Models\PlatformSetting::get('custom_footer_scripts', '') !!}
    </body>
</html>
