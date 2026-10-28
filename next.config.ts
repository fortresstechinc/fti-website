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
    return [
      {
        // Hashed-by-hand media in /public/media and /public/models never changes in place.
        source: "/(media|models)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
