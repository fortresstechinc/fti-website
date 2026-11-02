import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // The event was first published as "Launch and Lunch"; invite links sent
  // with the old address (and their ?invite= code) still arrive.
  async redirects() {
    return [{ source: "/launch-and-lunch/:path*", destination: "/lunch-and-launch/:path*", permanent: true }];
  },
  async headers() {
    // Static files in public/ (not hashed): browsers keep them for a day and
    // refresh them in the background for a week after. Next's own hashed
    // /_next/static files are cached for a year by Vercel.
    const cache = { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" };
    return [{ source: "/(media|models|illustrations|brand|icp|nav|vendor)/:path*", headers: [cache] }];
  },
};

export default nextConfig;
