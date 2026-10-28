"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Product pages always open at their top, however they are reached: a link,
 * Back or Forward, or a reload. The home page keeps the browser's own scroll
 * restoration, so Back to it returns to where the visitor was.
 */
export function PageTop() {
  const path = usePathname();
  const lenis = useLenis();
  useLayoutEffect(() => {
    const home = path === "/";
    history.scrollRestoration = home ? "auto" : "manual";
    if (home || window.location.hash) return;
    window.scrollTo(0, 0);
    // The smooth scroller keeps its own position; move it too, or it drifts back.
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [path, lenis]);
  return null;
}
