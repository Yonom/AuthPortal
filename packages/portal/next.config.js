/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@authportal/core"],
  env: {
    KV_PROVIDER: process.env.KV_PROVIDER ?? "inMemory",
  },
  async rewrites() {
    return [
      {
        source: "/__/auth/(.*)",
        destination: "https://authportal-app.firebaseapp.com/__/auth/$1",
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
