/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  transpilePackages: ["@authportal/*"],
  experimental: {
    mdxRs: true,
  },
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/Yonom/AuthPortal",
        permanent: false,
      },
      {
        source: "/discord",
        destination: "https://discord.gg/EksDXX43SX",
        permanent: false,
      },
    ];
  },
};

const withMDX = require("@next/mdx")();
module.exports = withMDX(nextConfig);
