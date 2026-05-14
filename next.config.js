/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig