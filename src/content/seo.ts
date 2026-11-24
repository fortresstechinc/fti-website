import type { Metadata } from "next";
import type { ProductSlug } from "./products";
import { siteUrl } from "./site";

/** Shown on link previews and in the home page's Organization record. */
export const siteName = "Fortress Technologies";

/**
 * Document titles for the public pages. Each one is absolute, so the root
 * "%s · FTI" template still applies to unlisted pages (Launch and Lunch,
 * the invitation, and the 404). Counts sit between 50 and 60 characters.
 */
export const pageTitles = {
  home: "Fortress Technologies Inc (FTI): Counter-Drone Systems",
  lumen: "LUMEN: Counter-Drone C2 in ATAK | Fortress Technologies",
  anchor: "Anchor: Edge C2 Node for LUMEN | Fortress Technologies",
  bolt: "BOLT: Closer-Range Kinetic Intercept | Fortress Technologies",
  fist: "FIST: Longer-Range Kinetic Intercept | Fortress Technologies",
  contact: "Contact: Counter-Drone Briefing | Fortress Technologies",
} as const satisfies Record<"home" | ProductSlug | "contact", string>;

export function absoluteTitle(title: string): Metadata["title"] {
  return { absolute: title };
}

/**
 * Home page only. sameAs is omitted: the repo has no real profile URL.
 * LinkedIn in site.ts is still the placeholder "#".
 */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Fortress Technologies Inc",
  alternateName: "FTI",
  url: siteUrl,
  logo: `${siteUrl}/brand/fti-black.png`,
};
