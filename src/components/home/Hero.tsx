"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Logo } from "@/components/chrome/Logo";
import type { HudRefs } from "@/components/hero/HeroScene";
import { PHASE, STEPS, TRACKS, isCleared, phaseAt, type Phase } from "@/components/hero/timeline";
import styles from "./Hero.module.css";

// Share of the hero's scroll given to the engagement; the hand-over starts a little after.
const ENGAGEMENT_END = 0.75;
const HANDOVER_START = 0.78;

const HeroScene = dynamic(() => import("@/components/hero/HeroScene").then((m) => m.HeroScene), { ssr: false });

/**
 * The Paper hero, alive: a pre-dawn sky over a drifting cloud bank. Scrolling
 * plays one engagement: drones climb out of the clouds, Lumen locks and
 * classifies them, the operator approves, and BOLT and FIST each fly a drawn
 * trajectory to one suspect track. Illustrative data throughout. The last
 * stretch hands over: the sky brightens into the page's own gradient, so the
 * panel dissolves into the section below.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const hud = useRef<HudRefs>({ tracks: [], site: null, trails: [] });
  const reduce = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>(reduce ? 3 : 0);
  // Ids of the tracks already hit, as one string so the state only changes when a hit lands.
  const [cleared, setCleared] = useState("");
  const [active, setActive] = useState(true);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smoothed = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 });
  const progress = useTransform(smoothed, [0, ENGAGEMENT_END], [0, 1]);
  const day = useTransform(smoothed, [HANDOVER_START, 1], [0, 1]);

  const headlineOpacity = useTransform(progress, [PHASE.headlineOut[0], PHASE.headlineOut[1]], [1, 0]);
  const headlineY = useTransform(progress, [0, PHASE.headlineOut[1]], [0, -48]);
  const stepperIn = useTransform(progress, [PHASE.detect - 0.04, PHASE.detect + 0.02], [0, 1]);
  const cueOpacity = useTransform(progress, [0, 0.08], [1, 0]);
  // The hand-over: overlays and chrome leave first, then the sky turns to day and
  // the page gradient settles over the panel so its edge disappears.
  const chromeOpacity = useTransform(day, [0, 0.3], [1, 0]);
  const stepperOpacity = useTransform(() => stepperIn.get() * chromeOpacity.get());
  const settle = useTransform(day, [0.5, 1], [0, 1]);

  useMotionValueEvent(progress, "change", (p) => {
    if (reduce) return;
    const next = phaseAt(p);
    setPhase((cur) => (cur === next ? cur : next));
    const hits = TRACKS.filter((t) => isCleared(t, p)).map((t) => t.id).join(" ");
    setCleared((cur) => (cur === hits ? cur : hits));
  });

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const step = phase >= 4 ? 3 : phase >= 3 ? 2 : phase >= 2 ? 1 : 0;

  return (
    <section id="top" ref={section} className={styles.hero} aria-label="FTI">
      <div className={styles.sticky}>
        <div className={styles.panel}>
          <HeroScene className={styles.scene} progress={progress} day={day} hud={hud} reduced={reduce} active={active} />
          <motion.div className={styles.scrim} style={{ opacity: chromeOpacity }} aria-hidden="true" />
          <motion.div className={styles.grain} style={{ opacity: chromeOpacity }} aria-hidden="true" />

          <motion.div className={styles.hud} style={{ opacity: chromeOpacity }} aria-hidden="true">
            <svg className={styles.svg}>
              <g ref={(g) => void (hud.current.site = g)}>
                {[1, 2, 3, 4].map((r) => (
                  <ellipse key={r} rx={r * 220} ry={r * 46} fill="none" stroke="#fff" strokeOpacity="0.07" />
                ))}
                <circle r="12" fill="none" stroke="#fff" strokeOpacity="0.5" />
                <circle r="4" fill="#fff" />
              </g>
              {TRACKS.filter((t) => t.engage).map((t, k) => (
                <path
                  key={t.id}
                  ref={(p) => void (hud.current.trails[k] = p)}
                  fill="none"
                  stroke="#FF5B1F"
                  strokeOpacity="0.85"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                />
              ))}
            </svg>
            {TRACKS.map((t, i) => {
              const engaged = !!t.engage && phase >= 2;
              const hit = cleared.includes(t.id);
              return (
                <div key={t.id} ref={(el) => void (hud.current.tracks[i] = el)} className={styles.track} style={{ opacity: 0 }}>
                  <span className={`${styles.bracket} ${engaged ? styles.engaged : ""}`} />
                  <span className={`${styles.trackLabel} ${t.engage ? "" : styles.neutralLabel}`}>
                    <span>{t.id}</span>
                    <span className={engaged ? styles.labelLive : styles.labelDim}>{hit ? "Cleared" : phase >= 2 ? t.label : "Unknown"}</span>
                    {t.engage && phase >= 3 && !hit && <span className={styles.chip}>Approved · Operator</span>}
                    {t.engage && phase === 4 && !hit && <span className={styles.chip}>{t.engage.by === "bolt" ? "BOLT · Guiding" : "FIST · In flight"}</span>}
                  </span>
                </div>
              );
            })}
          </motion.div>

          <motion.div className={styles.top} style={{ opacity: chromeOpacity }}>
            <Logo tone="white" />
            <p className={`label ${styles.live}`}>
              Counter-UAS systems
            </p>
          </motion.div>

          <motion.h1 className={styles.headline} style={reduce ? undefined : { opacity: headlineOpacity, y: headlineY }}>
            The Low Sky, Defended
          </motion.h1>

          <motion.ol className={styles.stepper} style={{ opacity: reduce ? chromeOpacity : stepperOpacity }} aria-label="Engagement sequence, illustrative">
            {STEPS.map((s, i) => (
              <li key={s} className={`label ${i === step ? styles.stepOn : i < step ? styles.stepDone : ""}`} aria-current={i === step ? "step" : undefined}>
                <span className={styles.stepIndex}>{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
            <li className={`label ${styles.demo}`}>Illustrative</li>
          </motion.ol>

          <motion.div className={styles.bottom} style={{ opacity: chromeOpacity }}>
            <ArrowButton href="/contact" tone="light" live>
              Book a briefing
            </ArrowButton>
            <motion.p className={`label ${styles.cue}`} style={{ opacity: cueOpacity }} aria-hidden="true">
              Scroll to watch an engagement
            </motion.p>
          </motion.div>
        </div>


        {/* Over the whole frame, not just the panel, so the panel's rounded edge goes too. */}
        <motion.div className={styles.settle} style={{ opacity: settle }} aria-hidden="true" />
      </div>
    </section>
  );
}
