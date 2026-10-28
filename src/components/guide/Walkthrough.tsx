"use client";

import { useLenis } from "lenis/react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import styles from "./Walkthrough.module.css";

type Props = {
  id?: string;
  heading: string;
  /** How many stages the scroll walks. */
  count: number;
  className?: string;
  /**
   * The guide itself, given which stage faces front (a continuous index driven
   * by scroll), a way to jump to a stage, and whether motion is reduced.
   */
  children: (front: MotionValue<number>, pick: (i: number) => void, still: boolean) => React.ReactNode;
};

/**
 * Which stage faces front, as a continuous index from the first (0) to the
 * last. Each hand-over takes the middle 60% of its stretch of scroll, so every
 * stage settles before the next begins.
 */
function stageIndex(p: number, count: number) {
  const raw = Math.min(1, Math.max(0, p)) * (count - 1);
  let f = 0;
  for (let k = 0; k < count - 1; k++) {
    const t = Math.min(1, Math.max(0, (raw - k - 0.2) / 0.6));
    f += t * t * (3 - 2 * t);
  }
  return f;
}

/**
 * A night panel that rises into place like the next card in a stack, then pins
 * while the scroll walks its stages. The track is as long as the number of
 * stages needs.
 */
export function Walkthrough({ id, heading, count, className, children }: Props) {
  const reduce = useReducedMotion() ?? false;
  const lenis = useLenis();
  const track = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const headingId = `${id ?? "walkthrough"}-heading`;

  const { scrollYProgress: rise } = useScroll({ target: panel, offset: ["start end", "start 0.12"] });
  const scale = useTransform(rise, [0, 1], [0.94, 1]);
  const borderRadius = useTransform(rise, [0, 1], [32, 14]);

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const smoothed = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const front = useTransform(smoothed, (p) => stageIndex(p, count));

  // A step control scrolls the page to the point where its stage is settled.
  const pick = (i: number) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + (i / (count - 1)) * (el.offsetHeight - window.innerHeight);
    if (lenis) lenis.scrollTo(top, { duration: 1.1 });
    else window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id={id} className={`${styles.wrap} ${className ?? ""}`} aria-labelledby={headingId}>
      <div ref={track} className={styles.track} style={{ "--steps": count } as React.CSSProperties}>
        <div className={styles.sticky}>
          <motion.div ref={panel} className={styles.panel} style={reduce ? undefined : { scale, borderRadius }}>
            <h2 id={headingId} className={`display-l ${styles.heading}`}>
              {heading}
            </h2>
            {children(front, pick, reduce)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
