"use client";

import { useLenis } from "lenis/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { lunchAndLaunch as lnl } from "@/content/lunch-and-launch";
import { SlimHeader } from "@/components/chrome/SlimHeader";
import { LaunchSkyView } from "@/components/three/LaunchSky";
import { Icon } from "@/components/icons";
import { ArrowButton } from "@/components/ui/ArrowButton";
import styles from "./Launch.module.css";

/**
 * The opening: BOLT's tube on the launch field under a daytime sky, and the
 * start of a sentence, "You're invited to…", over a Scroll down control.
 * Scrolling (or the control) fires the round up and away, the view tilting up
 * after it, and once it is gone the sentence finishes in the open sky with the
 * event's name and the way to book.
 */
export function LaunchHero({ bookHref }: { bookHref: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // The title card lifts away as the launch begins.
  const card = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const cardY = useTransform(scrollYProgress, [0, 0.08], [0, -24]);
  const cardEvents = useTransform(scrollYProgress, (p) => (p < 0.04 ? "auto" : "none"));
  // The sky deepens as the view tilts up away from the horizon.
  const deep = useTransform(scrollYProgress, [0.28, 0.75], [0, 1]);
  const invite = useTransform(scrollYProgress, [0.74, 0.88], [0, 1]);
  const inviteY = useTransform(scrollYProgress, [0.74, 0.88], [28, 0]);
  const inviteEvents = useTransform(scrollYProgress, (p) => (p > 0.8 ? "auto" : "none"));

  // Plays the whole launch for the visitor: a slow scroll to where the
  // invitation has settled, so the flight reads at its own pace.
  const watch = () => {
    const el = ref.current;
    if (!el) return;
    const end = el.offsetTop + (el.offsetHeight - window.innerHeight) * 0.92;
    if (lenis) lenis.scrollTo(end, { duration: 6.5, easing: (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2) });
    else window.scrollTo({ top: end, behavior: "smooth" });
  };

  return (
    <section ref={ref} className={`${styles.launch} ${reduce ? styles.still : ""}`} aria-labelledby="lnl-title">
      <div className={styles.sky}>
        <motion.div className={styles.skyDeep} style={{ opacity: reduce ? 0.4 : deep }} aria-hidden="true" />
        <LaunchSkyView
          progress={scrollYProgress}
          reduced={reduce}
          className={styles.skyView}
          label="A BOLT round launching from its tube on an open field and climbing away into the sky."
        />
      </div>

      {/* The words ride in their own pinned layer above the shared 3D canvas. */}
      <div className={styles.front}>
        <div className={styles.skyTop}>
          <SlimHeader end={<span className={`label ${styles.quiet}`}>Private invitation</span>} />
        </div>

        {!reduce && (
          <motion.div className={styles.opening} style={{ opacity: card, y: cardY, pointerEvents: cardEvents }}>
            <p className={styles.openingTitle}>You&apos;re invited to…</p>
            <button type="button" className={styles.watch} onClick={watch}>
              <span>Scroll down</span>
              <span className={styles.watchChip} aria-hidden="true">
                <Icon name="arrow" size={14} />
              </span>
            </button>
          </motion.div>
        )}

        <motion.div
          className={styles.invite}
          style={reduce ? undefined : { opacity: invite, y: inviteY, pointerEvents: inviteEvents }}
        >
          <h1 id="lnl-title" className={styles.inviteTitle}>
            {/* The opening already said "You're invited to…"; this finishes the
                sentence. Without motion there is no opening, so it says it here. */}
            {reduce ? <span className={styles.invitePre}>You&apos;re invited to</span> : <span className="sr-only">You&apos;re invited to </span>}
            <span>{lnl.name}</span>
          </h1>
          <p className={`lede ${styles.inviteLede}`}>{lnl.lede}</p>
          <div className={styles.actions}>
            <ArrowButton href={bookHref} live>
              Pick your date
            </ArrowButton>
            <span className={`label ${styles.quiet}`}>{lnl.where} · By invitation</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
