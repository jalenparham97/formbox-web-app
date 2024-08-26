import { withSentryConfig } from "@sentry/nextjs";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

function createHeaders() {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    return [];
  }

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    frame-src ${process.env.APP_URL}/forms/*;
    upgrade-insecure-requests;
`;

  return [
    {
      source: "/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value: cspHeader.replace(/\n/g, ""),
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
      ],
    },
  ];
}

/** @type {import("next").NextConfig} */
const coreConfig = {
  async headers() {
    return createHeaders();
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/organizations",
        permanent: false,
      },
    ];
  },
};

// Injected content via Sentry wizard below

export default withSentryConfig(coreConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "formbox",
  project: "formbox-webapp",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
