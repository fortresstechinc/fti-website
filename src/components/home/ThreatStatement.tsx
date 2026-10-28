"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { threatScenes } from "@/content/site";
import styles from "./ThreatStatement.module.css";

const COUNT = threatScenes.length;
/**
 * Degrees between neighbouring photos on the gallery wheel: wide enough that,
 * at rest, the neighbours sit off-screen and only one photo shows. The turn
 * between them is the only time two are in view: out with the old, in with the new.
 */
const STEP = 40;
/**
 * Which way the wheel turns as the page scrolls down. Counter-clockwise (1)
 * brings each next photo up the arc from the right; clockwise (-1), from the left.
 */
const TURN: 1 | -1 = 1;

/**
 * Which audience faces front, as a continuous index from the first (0) to the
 * last. The scroll is one fluid pass: each hand-over takes the middle 70% of
 * its stretch, with a short settle on each audience between.
 */
function wheelIndex(p: number) {
  const raw = Math.min(1, Math.max(0, p)) * (COUNT - 1);
  let f = 0;
  for (let k = 0; k < COUNT - 1; k++) {
    const t = Math.min(1, Math.max(0, (raw - k - 0.15) / 0.7));
    f += t * t * (3 - 2 * t);
  }
  return f;
}

/**
 * The threat sequence: one audience at a time, in one fluid scroll. A single
 * line sits above a large photo. As the visitor scrolls, the line grows slightly
 * and fades while the next rises in, and the photo swings out along a curved
 * gallery (a wheel whose centre is below the screen) as the next swings in,
 * turning counter-clockwise. Line and photo share one index, so they move together.
 */
export function ThreatStatement() {
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  // Reduced motion steps between photos instead of turning the wheel.
  const front = useTransform(progress, (p) => (reduce ? Math.round(wheelIndex(p)) : wheelIndex(p)));
  const wheelRotate = useTransform(front, (f) => -f * STEP * TURN);
  const bridge = useRef<HTMLDivElement>(null);
  const { scrollYProgress: covered } = useScroll({ target: bridge, offset: ["start 0.2", "start -0.5"] });
  const answerOpacity = useTransform(covered, [0, 1], [1, 0.35]);
  const answerScale = useTransform(covered, [0, 1], [1, 0.94]);
  // How much a line grows as it leaves: less on phones, where lines fill the width.
  const [grow, setGrow] = useState(0.14);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setGrow(mq.matches ? 0.05 : 0.14);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section id="who-its-for" className={styles.section} aria-labelledby="threat-heading">
      <h2 id="threat-heading" className="sr-only">
        The threat
      </h2>
      <div ref={stage} className={styles.track}>
        <div className={styles.stage}>
          <div className={styles.lines}>
            {threatScenes.map((s, i) => (
              <Line key={s.group} text={s.line} index={i} front={front} grow={grow} still={reduce} />
            ))}
          </div>
          <motion.div className={styles.wheel} style={{ rotate: wheelRotate }}>
            {threatScenes.map((s, i) => (
              <Card key={s.group} scene={s} index={i} front={front} />
            ))}
          </motion.div>
        </div>
      </div>
      {/* The answer pins mid-screen and dims as the How it works panel rises over it. */}
      <div ref={bridge} className={styles.bridge}>
        <motion.div className={styles.resolve} style={reduce ? undefined : { opacity: answerOpacity, scale: answerScale }}>
          <div className={styles.resolveInner}>
            <span className={styles.rule} aria-hidden="true" />
            <p className={`display-l ${styles.answer}`}>Whatever is in the air, we answer&nbsp;it.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** One photo on the wheel, set at its own angle; it dims as it turns away from the front. */
function Card({ scene, index, front }: { scene: (typeof threatScenes)[number]; index: number; front: MotionValue<number> }) {
  // Fully present while it is the front photo or on its way in or out; gone
  // beyond one step, so no stray card shows on very wide screens.
  const opacity = useTransform(front, (f) => {
    const d = Math.min(1, Math.max(0, (Math.abs(index - f) - 0.7) / 0.3));
    return 1 - d * d * (3 - 2 * d);
  });
  // The photo nearest the front always paints on top.
  const zIndex = useTransform(front, (f) => 10 - Math.round(Math.abs(index - f) * 2));
  return (
    <motion.figure className={styles.card} style={{ rotate: index * STEP * TURN, opacity, zIndex }}>
      <figcaption className={`label ${styles.chip}`}>
        {scene.group}
      </figcaption>
      <div className={styles.photo}>
        <Image src={scene.image} alt={scene.alt} fill sizes="(max-width: 767px) 88vw, 70vw" />
      </div>
    </motion.figure>
  );
}

/**
 * One line, stacked with the others in the same place and driven by the shared
 * index: it rises in from below as its audience comes to the front, then grows
 * slightly and fades as it leaves, so only one reads at a time.
 */
function Line({ text, index, front, grow, still }: { text: string; index: number; front: MotionValue<number>; grow: number; still: boolean }) {
  // Gone before the midpoint of each hand-over, so the old line has left before
  // the new one arrives and the two never overlap.
  const opacity = useTransform(front, (f) => Math.max(0, 1 - Math.abs(index - f) * 2.5));
  const y = useTransform(front, (f) => Math.max(-1, Math.min(1, index - f)) * 48);
  const scale = useTransform(front, (f) => 1 + Math.max(0, Math.min(1, f - index)) * grow);
  return (
    <motion.p className={styles.line} style={still ? { opacity } : { opacity, y, scale }}>
      {text}
    </motion.p>
  );
}
