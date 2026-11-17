import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from '@/Context/LanguageContext';

const appName = import.meta.env.VITE_APP_NAME || 'FrameFusion';

// Auto-recover from chunk load errors when a new build is deployed
window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    window.location.reload();
});

window.addEventListener('error', (event) => {
    const msg = event?.message || '';
    if (
        msg.includes('dynamically imported module') ||
        msg.includes('Importing a module script failed') ||
        msg.includes('error loading dynamically imported module') ||
        msg.includes('Loading chunk')
    ) {
        event.preventDefault();
        const lastReload = sessionStorage.getItem('vite_chunk_reload');
        const now = Date.now();
        if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
            sessionStorage.setItem('vite_chunk_reload', now.toString());
            window.location.reload();
        }
    }
});

// Recover from unhandled router exceptions or stuck requests
router.on('invalid', () => {
    window.location.reload();
});

router.on('exception', (event: any) => {
    if (event?.error?.message?.includes?.('Failed to fetch dynamically imported module')) {
        window.location.reload();
    }
});

createInertiaApp({
    title: (title) => {
        if (!title || !title.trim()) return appName;
        if (title.includes(appName)) return title;
        return `${title} | ${appName}`;
    },
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <LanguageProvider>
                <App {...props} />
            </LanguageProvider>
        );

        // Remove initial page preloader once React mounts
        const loader = document.getElementById('initial-page-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) loader.parentNode.removeChild(loader);
            }, 300);
        }
    },
    progress: {
        color: '#635BFF',
        showSpinner: false,
    },
});
