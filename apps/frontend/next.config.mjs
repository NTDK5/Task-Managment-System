/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {},
    i18n: {
        locales: ['en', 'om', 'am'],
        defaultLocale: 'en'
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Warning: This allows production builds to successfully complete even if
        // your project has type errors.
        ignoreBuildErrors: true,
    },
    // Add trailing slash configuration
    trailingSlash: false,
    // Ensure proper routing
    experimental: {
        appDir: true,
    },
    // Add redirects for common issues
    async redirects() {
        return [
            {
                source: '/admin',
                destination: '/admin/',
                permanent: true,
            },
        ];
    },
    // Add rewrites if needed
    async rewrites() {
        return [];
    }
};

export default nextConfig;
