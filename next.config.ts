import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // Old addresses for the event still arrive: the invitation is now
  // /launchlunch and its booking page /invitation. /launch is a short address
  // for the same invitation. A leftover ?invite= is ignored.
  async redirects() {
    return [
      ...["/launch-and-lunch", "/lunch-and-launch"].flatMap((old) => [
        { source: `${old}/book`, destination: "/invitation", permanent: true },
        { source: old, destination: "/launchlunch", permanent: true },
      ]),
      { source: "/launch", destination: "/launchlunch", permanent: true },
    ];
  },
  async headers() {
    // Static files in public/ (not hashed): browsers keep them for a day and
    // refresh them in the background for a week after. Next's own hashed
    // /_next/static files are cached for a year by Vercel.
    const cache = { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" };
    // The invitation and its booking page stay out of search. They are unlisted
    // (no nav link, no sitemap entry) and anyone with the link can open them.
    const noindex = { key: "X-Robots-Tag", value: "noindex, nofollow" };
    return [
      { source: "/(media|models|illustrations|brand|icp|nav|vendor)/:path*", headers: [cache] },
      { source: "/launchlunch", headers: [noindex] },
      { source: "/invitation", headers: [noindex] },
    ];
  },
};

export default nextConfig;
