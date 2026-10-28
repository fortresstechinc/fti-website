"use client";

import { useLenis } from "lenis/react";
import { useLayoutEffect } from "react";
import { INTRO_KEY as KEY, INTRO_LENGTH as LENGTH } from "./intro-script";
import styles from "./Intro.module.css";

/**
 * The white screen with the FTI mark that opens a visit, then fades into the page.
 * Pure CSS plays it; this component only keeps the page still underneath.
 */
export function Intro() {
  const lenis = useLenis();

  useLayoutEffect(() => {
    let started = 0;
    try {
      started = Number(sessionStorage.getItem(KEY) ?? 0);
    } catch {}
    const left = started ? LENGTH - (Date.now() - started) : 0;
    // Development remounts clear the attribute the head script set; put it back.
    if (left <= 0) {
      document.documentElement.setAttribute("data-intro", "seen");
      return;
    }
    lenis?.stop();
    const timer = window.setTimeout(() => lenis?.start(), left);
    return () => {
      window.clearTimeout(timer);
      lenis?.start();
    };
  }, [lenis]);

  return (
    <div className={styles.intro} aria-hidden="true">
      <div className={styles.mark}>
        {/* A plain img: it must paint with the HTML, before any script runs. */}
        <img src="/brand/fti-black.png" alt="" width={113} height={96} className={styles.logo} />
      </div>
    </div>
  );
}
