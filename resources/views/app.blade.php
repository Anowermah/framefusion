<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @php
            $siteName = \App\Models\PlatformSetting::get('site_name', config('app.name', 'FrameFusion'));
            $siteTagline = \App\Models\PlatformSetting::get('site_tagline', 'Create. Customize. Celebrate.');
            $defaultDescription = \App\Models\PlatformSetting::get('meta_description', 'FrameFusion - Create, customize, and celebrate visual photo campaigns and twibbons effortlessly.');
            $defaultKeywords = \App\Models\PlatformSetting::get('meta_keywords', 'twibbon, photo frame, campaign, profile frame, photo editor, twibbon bangladesh, framefusion');
            $twitterHandle = \App\Models\PlatformSetting::get('twitter_handle', '@FrameFusion');
            $googleVerification = \App\Models\PlatformSetting::get('google_site_verification', '');
            $faviconUrl = \App\Models\PlatformSetting::get('site_favicon', '/favicon.ico');

            // Fallback default OG image
            $defaultOgImage = \App\Models\PlatformSetting::get('og_default_image');
            if ($defaultOgImage && !str_starts_with($defaultOgImage, 'http')) {
                $defaultOgImage = url($defaultOgImage);
            }
            if (!$defaultOgImage) {
                $defaultOgImage = url('/apple-touch-icon.png');
            }

            // Inspect if current Inertia page is Campaign Show or Editor
            $campaignData = $page['props']['campaign'] ?? null;
            $isCampaignPage = !empty($campaignData) && !empty($campaignData['slug']);

            if ($isCampaignPage) {
                $campaignTitle = $campaignData['title'] ?? 'Campaign Frame';
                if (!empty($campaignData['title_bn']) && $campaignData['title_bn'] !== $campaignData['title']) {
                    $campaignTitle .= ' - ' . $campaignData['title_bn'];
                }
                $metaTitle = "{$campaignTitle} | {$siteName}";

                $campaignDesc = !empty($campaignData['description'])
                    ? strip_tags($campaignData['description'])
                    : (!empty($campaignData['description_bn']) ? strip_tags($campaignData['description_bn']) : $defaultDescription);
                $metaDescription = \Illuminate\Support\Str::limit($campaignDesc, 160);

                $metaKeywords = (!empty($campaignData['tags']) ? $campaignData['tags'] . ', ' : '') . $defaultKeywords;
                $canonicalUrl = route('campaigns.show', $campaignData['slug']);
                $ogType = 'article';

                // Frame as Feature Image: Dedicated OG Card with frame + direct frame URL
                $ogImageUrl = route('campaigns.og-image', $campaignData['slug']);
                $directFrameUrl = !empty($campaignData['frame_url']) 
                    ? url($campaignData['frame_url']) 
                    : (!empty($campaignData['thumbnail_url']) ? url($campaignData['thumbnail_url']) : null);
                $ogImageAlt = $campaignData['title'] ?? $siteName;
            } else {
                $pageTitle = $page['props']['title'] ?? null;
                $metaTitle = $pageTitle ? "{$pageTitle} | {$siteName}" : "{$siteName} - {$siteTagline}";
                $metaDescription = $defaultDescription;
                $metaKeywords = $defaultKeywords;
                $canonicalUrl = url()->current();
                $ogType = 'website';
                $ogImageUrl = $defaultOgImage;
                $directFrameUrl = null;
                $ogImageAlt = $siteName;
            }
        @endphp

        <!-- Standard Primary Meta Tags -->
        <title inertia>{{ $metaTitle }}</title>
        <meta name="title" content="{{ $metaTitle }}">
        <meta name="description" content="{{ $metaDescription }}">
        <meta name="keywords" content="{{ $metaKeywords }}">
        <meta name="author" content="{{ $siteName }}">
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
        <link rel="canonical" href="{{ $canonicalUrl }}">

        @if(!empty($googleVerification))
            <meta name="google-site-verification" content="{{ $googleVerification }}">
        @endif

        <!-- Open Graph / Facebook / WhatsApp / LinkedIn -->
        <meta property="og:type" content="{{ $ogType }}">
        <meta property="og:url" content="{{ $canonicalUrl }}">
        <meta property="og:site_name" content="{{ $siteName }}">
        <meta property="og:title" content="{{ $metaTitle }}">
        <meta property="og:description" content="{{ $metaDescription }}">
        <meta property="og:image" content="{{ $ogImageUrl }}">
        <meta property="og:image:secure_url" content="{{ $ogImageUrl }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="{{ $ogImageAlt }}">
        <meta property="og:image:type" content="image/png">
        @if(!empty($directFrameUrl))
            <meta property="og:image" content="{{ $directFrameUrl }}">
            <meta property="og:image:alt" content="{{ $ogImageAlt }} (Raw Frame)">
        @endif

        <!-- Twitter / X Cards -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="{{ $canonicalUrl }}">
        <meta name="twitter:title" content="{{ $metaTitle }}">
        <meta name="twitter:description" content="{{ $metaDescription }}">
        <meta name="twitter:image" content="{{ $ogImageUrl }}">
        <meta name="twitter:image:alt" content="{{ $ogImageAlt }}">
        @if(!empty($twitterHandle))
            <meta name="twitter:site" content="{{ $twitterHandle }}">
            <meta name="twitter:creator" content="{{ $twitterHandle }}">
        @endif

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="{{ $faviconUrl }}">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="shortcut icon" href="{{ $faviconUrl }}">
        <meta name="theme-color" content="{{ \App\Models\PlatformSetting::get('primary_color', '#635BFF') }}">

        <!-- Structured Data (JSON-LD) for Search Engines -->
        @if($isCampaignPage)
            @php
                $schemaData = [
                    '@context' => 'https://schema.org',
                    '@type' => 'CreativeWork',
                    'name' => $campaignData['title'] ?? '',
                    'headline' => $metaTitle,
                    'description' => $metaDescription,
                    'image' => array_values(array_filter([$ogImageUrl, $directFrameUrl])),
                    'url' => $canonicalUrl,
                    'datePublished' => $campaignData['created_at'] ?? now()->toIso8601String(),
                    'publisher' => [
                        '@type' => 'Organization',
                        'name' => $siteName,
                        'logo' => [
                            '@type' => 'ImageObject',
                            'url' => url('/apple-touch-icon.png'),
                        ],
                    ],
                ];
            @endphp
            <script type="application/ld+json">
            {!! json_encode($schemaData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
            </script>
        @else
            @php
                $schemaData = [
                    '@context' => 'https://schema.org',
                    '@type' => 'WebSite',
                    'name' => $siteName,
                    'url' => url('/'),
                    'description' => $defaultDescription,
                    'potentialAction' => [
                        '@type' => 'SearchAction',
                        'target' => url('/explore') . '?search={search_term_string}',
                        'query-input' => 'required name=search_term_string',
                    ],
                ];
            @endphp
            <script type="application/ld+json">
            {!! json_encode($schemaData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
            </script>
        @endif

        <!-- Google Fonts: Inter, Hind Siliguri, Noto Serif Bengali, Anek Bangla, Tiro Bangla (Non-blocking Asynchronous) -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Noto+Serif+Bengali:wght@400;600;700;800&family=Tiro+Bangla:ital@0;1&display=swap">
        <link href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Noto+Serif+Bengali:wght@400;600;700;800&family=Tiro+Bangla:ital@0;1&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
        <noscript>
            <link href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Noto+Serif+Bengali:wght@400;600;700;800&family=Tiro+Bangla:ital@0;1&display=swap" rel="stylesheet">
        </noscript>

        <!-- Google Tag Manager / Google Analytics -->
        @php
            $gaId = \App\Models\PlatformSetting::get('google_analytics_id', 'GTM-P4XBXWZG') ?: 'GTM-P4XBXWZG';
        @endphp
        @if(!empty($gaId))
            @if(str_starts_with($gaId, 'GTM-'))
                <!-- Google Tag Manager -->
                <script async src="https://www.googletagmanager.com/gtm.js?id={{ $gaId }}"></script>
                <script>
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
                </script>
                <!-- End Google Tag Manager -->
            @else
                <!-- Google Analytics (gtag.js) -->
                <script async src="https://www.googletagmanager.com/gtag/js?id={{ $gaId }}"></script>
                <script>
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '{{ $gaId }}');
                </script>
            @endif
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
        @if(!empty($gaId) && str_starts_with($gaId, 'GTM-'))
            <!-- Google Tag Manager (noscript) -->
            <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $gaId }}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
            <!-- End Google Tag Manager (noscript) -->
        @endif
        <!-- Initial Instant Loader (Smoothly fades out once React mounts) -->
        <div id="initial-page-loader" style="position:fixed;inset:0;z-index:99999;background:#F8F9FC;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif;transition:opacity 0.25s ease-out;">
            <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#635BFF,#8B5CF6);display:flex;align-items:center;justify-content:center;box-shadow:0 10px 25px -5px rgba(99,91,255,0.35);margin-bottom:16px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
            </div>
            <div style="width:24px;height:24px;border:3px solid #E2E8F0;border-top-color:#635BFF;border-radius:50%;animation:ffSpin 0.75s linear infinite;"></div>
            <style>@keyframes ffSpin{to{transform:rotate(360deg)}}</style>
            <div id="loader-fallback-prompt" style="display:none;margin-top:16px;text-align:center;">
                <p style="font-size:12px;color:#64748B;margin:0 0 8px 0;">লোড হতে কিছুটা সময় নিচ্ছে?</p>
                <button onclick="window.location.reload(true)" style="padding:6px 14px;font-size:11px;font-weight:700;color:#635BFF;background:#EEF2FF;border:1px solid #C7D2FE;border-radius:8px;cursor:pointer;">রিফ্রেশ করুন</button>
            </div>
            <script>
                setTimeout(function(){
                    var fb = document.getElementById('loader-fallback-prompt');
                    if (fb) fb.style.display = 'block';
                }, 4000);
            </script>
        </div>

        @inertia

        <!-- Custom Footer Scripts (Admin Database) -->
        {!! \App\Models\PlatformSetting::get('custom_footer_scripts', '') !!}
    </body>
</html>
