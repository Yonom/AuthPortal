/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@authportal/*"],
  async redirects() {
    return [
      {
        source: "/authorize",
        has: [
          {
            type: "query",
            key: "screen_hint",
            value: "signup",
          },
        ],
        destination: "/sign-up",
        permanent: false,
      },
      {
        source: "/authorize",
        destination: "/sign-in",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: "https://authportal-app.firebaseapp.com/__/auth/:path*",
      },
      {
        source: "/oauth/:path*",
        destination: `https://portal-api.authportal.dev/oauth/:path*`,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "(?<domain>.*)",
          },
        ],
        destination: `/isr/:domain/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
