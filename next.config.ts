import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // Addresses the event has had before (and their ?invite= codes) still arrive:
  // the invitation is now /launchlunch and its booking page /invitation.
  async redirects() {
    return ["/launch-and-lunch", "/lunch-and-launch"].flatMap((old) => [
      { source: `${old}/book`, destination: "/invitation", permanent: true },
      { source: old, destination: "/launchlunch", permanent: true },
    ]);
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
