"use client";

import { useSearchParams } from "next/navigation";
import { productBySlug } from "@/content/products";
import { briefing } from "@/content/site";
import { BackLink } from "@/components/chrome/SlimHeader";

/**
 * The contact page's two product-aware bits, read in the browser from
 * ?about=<product> (sent by a product's "Request full specs"), so the page
 * itself stays static. Each renders the general version until it knows.
 */
function useAbout() {
  return productBySlug(useSearchParams().get("about") ?? "");
}

export function AboutLede() {
  const product = useAbout();
  return product
    ? `Thirty minutes with the FTI team. Book a time and we'll take you through ${product.name}'s full specifications, and how it fits the rest of the system.`
    : briefing.lede;
}

export function AboutBack() {
  const product = useAbout();
  return <BackLink href={product ? `/${product.slug}` : "/"}>{product ? `Back to ${product.name}` : "Back to the site"}</BackLink>;
}
