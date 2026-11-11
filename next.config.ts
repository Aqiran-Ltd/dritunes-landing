import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

// Live trade chat websocket (Reverb). Only allowed when a public ws host is configured.
const reverbHost = process.env.NEXT_PUBLIC_REVERB_HOST;
const reverbScheme = process.env.NEXT_PUBLIC_REVERB_SCHEME === 'http' ? 'ws' : 'wss';
const reverbConnect = reverbHost ? ` ${reverbScheme}://${reverbHost}${process.env.NEXT_PUBLIC_REVERB_PORT ? `:${process.env.NEXT_PUBLIC_REVERB_PORT}` : ''}` : '';

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://upload.wikimedia.org https://flagcdn.com https://admin.dritunesconsult.com https://admin.aqiranxchange.com http://localhost:8000 http://127.0.0.1:8000",
      "media-src 'self' data: blob: https://admin.dritunesconsult.com https://admin.aqiranxchange.com http://localhost:8000 http://127.0.0.1:8000",
      `connect-src 'self' https://admin.dritunesconsult.com https://admin.aqiranxchange.com http://localhost:8000 http://127.0.0.1:8000 https://*.sentry.io https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.googleapis.com https://www.gstatic.com https://va.vercel-scripts.com https://vitals.vercel-insights.com${reverbConnect}`,
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    // The buyer portal handles access tokens and commercially sensitive quotes:
    // never cache, never index, never leak the URL via Referer.
    const buyerHeaders = [
      { key: 'Referrer-Policy', value: 'no-referrer' },
      { key: 'Cache-Control', value: 'no-store, max-age=0' },
      { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
    ];
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      { source: '/buyer', headers: buyerHeaders },
      { source: '/buyer/:path*', headers: buyerHeaders },
    ];
  },
  // @ts-ignore - turbopack.root is required to silence the workspace root warning in Next.js 16
  turbopack: {
    root: '.',
  },
};



export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "abytrone",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
