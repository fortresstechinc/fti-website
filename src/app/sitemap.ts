import type { MetadataRoute } from "next";
import { absoluteUrl, publicPaths } from "@/content/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths().map((route) => ({ url: absoluteUrl(route) }));
}
