import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // The event was first published as "Launch and Lunch"; invite links sent
  // with the old address (and their ?invite= code) still arrive.
  async redirects() {
    return [{ source: "/launch-and-lunch/:path*", destination: "/lunch-and-launch/:path*", permanent: true }];
  },
  // Caching for public/ files is set in netlify.toml.
};

export default nextConfig;
