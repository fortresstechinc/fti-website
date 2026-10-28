"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { lunchAndLaunch as lnl } from "@/content/lunch-and-launch";
import { SlimHeader } from "@/components/chrome/SlimHeader";
import { LaunchSkyView } from "@/components/three/LaunchSky";
import { ArrowButton } from "@/components/ui/ArrowButton";
import styles from "./Launch.module.css";

/**
 * The opening: BOLT's tube on the launch field under a daytime sky. Scrolling
 * fires the round up and away, the view tilting up after it, and once it is
 * gone the invitation appears in the open sky.
 */
export function LaunchHero({ bookHref }: { bookHref: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const cue = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  // The sky deepens as the view tilts up away from the horizon.
  const deep = useTransform(scrollYProgress, [0.28, 0.75], [0, 1]);
  const invite = useTransform(scrollYProgress, [0.74, 0.88], [0, 1]);
  const inviteY = useTransform(scrollYProgress, [0.74, 0.88], [28, 0]);
  const inviteEvents = useTransform(scrollYProgress, (p) => (p > 0.8 ? "auto" : "none"));

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

        <div className={styles.skyTop}>
          <SlimHeader end={<span className={`label ${styles.quiet}`}>Private invitation</span>} />
        </div>

        {!reduce && (
          <motion.p className={`label ${styles.cue}`} style={{ opacity: cue }} aria-hidden="true">
            Scroll to launch
          </motion.p>
        )}

        <motion.div
          className={styles.invite}
          style={reduce ? undefined : { opacity: invite, y: inviteY, pointerEvents: inviteEvents }}
        >
          <h1 id="lnl-title" className={styles.inviteTitle}>
            <span className={styles.invitePre}>You&apos;re invited to</span>
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
