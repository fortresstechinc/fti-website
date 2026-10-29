"use client";

import { useEffect, useRef } from "react";

type Props = Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "preload" | "autoPlay"> & {
  /** Plays (muted) while on screen; the file isn't fetched until it's near the screen. */
  autoPlay?: boolean;
};

/**
 * Footage that costs nothing until it is about to be seen: only the poster
 * loads with the page, the video starts downloading as it nears the screen,
 * plays while visible and pauses when scrolled away.
 */
export function LazyVideo({ autoPlay = false, ...rest }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.preload = "auto";
          if (autoPlay) v.play().catch(() => {});
        } else if (autoPlay) v.pause();
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [autoPlay]);
  return <video ref={ref} preload="none" {...rest} />;
}
