import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        // Use an array form of alias so we can match both the exact
        // '@/routes' import (mapped to the compat wrapper) and prefix
        // imports like '@/routes/appearance' which should resolve to
        // the generated files under resources/js/routes/.
        alias: [
            // Match absolute dev-server imports that reference the generated
            // index file directly (e.g. '/resources/js/routes/index.ts?t=...')
            // and redirect them to the compatibility wrapper so a stable
            // `customers` export is always available at runtime.
            {
                find: /^\/resources\/js\/routes\/index(\.(t|j)sx?)?$/, // matches /resources/js/routes/index.ts, .tsx, .js
                replacement: path.resolve(__dirname, 'resources/js/routes/compat.ts'),
            },
            {
                find: /^@\/routes\/(.*)/,
                replacement: path.resolve(__dirname, 'resources/js/routes/$1'),
            },
            {
                find: '@/routes',
                replacement: path.resolve(__dirname, 'resources/js/routes/compat.ts'),
            },
        ],
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
});
