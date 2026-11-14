import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './resources/js/**/*.ts',
    ],

    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#F5F5FF',
                    100: '#EBEBFE',
                    200: '#D8D7FE',
                    300: '#B8B5FD',
                    400: '#8E88FB',
                    500: '#635BFF',
                    600: '#5246F0',
                    700: '#4336D6',
                    800: '#382CAE',
                    900: '#31298B',
                },
                secondary: {
                    DEFAULT: '#8B5CF6',
                    50: '#F5F3FF',
                    500: '#8B5CF6',
                    600: '#7C3AED',
                },
                accent: {
                    DEFAULT: '#FF6B8A',
                    50: '#FFF1F4',
                    500: '#FF6B8A',
                    600: '#F43F5E',
                },
                surface: '#F8F9FC',
                charcoal: '#171923',
                mutedText: '#6B7280',
            },
            fontFamily: {
                sans: ['Inter', 'Hind Siliguri', ...defaultTheme.fontFamily.sans],
                bengali: ['Hind Siliguri', ...defaultTheme.fontFamily.sans],
            },
            boxShadow: {
                'card': '0 4px 20px -2px rgba(99, 91, 255, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
                'card-hover': '0 12px 30px -4px rgba(99, 91, 255, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
            },
        },
    },

    plugins: [forms],
};
