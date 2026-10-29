"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { PageTop } from "./PageTop";

// The 3D layer loads after the page is interactive and never blocks first paint.
// Pages with no 3D (booking, the invitation gate) don't mount it, so they never
// start a WebGL context.
const NO_3D = ["/contact", "/lunch-and-launch/book", "/invitation-only"];
const SceneHost = dynamic(() => import("@/components/three/SceneHost").then((m) => m.SceneHost), { ssr: false });

// Same-page links (#products, the rail rows) glide to their section through the
// smooth scroller, and still work when the address already carries that hash.
export function Providers({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  return (
    <>
      {reduce ? (
        <>
          <PageTop />
          {children}
        </>
      ) : (
        <ReactLenis root options={{ lerp: 0.11, wheelMultiplier: 0.95, anchors: { duration: 1.4 } }}>
          <PageTop />
          {children}
        </ReactLenis>
      )}
      {!NO_3D.includes(pathname) && <SceneHost />}
    </>
  );
}
