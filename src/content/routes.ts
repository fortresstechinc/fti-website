import fs from "node:fs";
import path from "node:path";
import { products } from "./products";
import { siteUrl } from "./site";

/**
 * Kept out of the sitemap. /launch is not a page: it redirects to /launchlunch.
 * Add a path here when a new page is marked noindex.
 */
export const unlistedPaths = ["/launchlunch", "/launch", "/invitation"] as const;

const unlisted = new Set<string>(unlistedPaths);

/**
 * Pages a crawler should see. Product URLs come from content, so a new product
 * is included on its own. Any other `src/app/<name>/page.tsx` is included too,
 * except API routes and the unlisted invitation pages.
 */
export function publicPaths(): string[] {
  const appDir = path.join(process.cwd(), "src/app");
  const productRoutes = products.map((product) => `/${product.slug}`).filter((route) => !unlisted.has(route));
  const extra = fs
    .readdirSync(appDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("[") && !entry.name.startsWith("("))
    .map((entry) => entry.name)
    .filter((name) => name !== "api" && fs.existsSync(path.join(appDir, name, "page.tsx")))
    .map((name) => `/${name}`)
    .filter((route) => !unlisted.has(route) && !productRoutes.includes(route))
    .sort();
  return ["/", ...productRoutes, ...extra];
}

export function absoluteUrl(route: string): string {
  return route === "/" ? siteUrl : `${siteUrl}${route}`;
}
