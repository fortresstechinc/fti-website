"use client";

import { motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import styles from "./SceneGuide.module.css";

export type GuideStep = { title: string; body: string; tag?: string };
/** A scene step: the name of the part it lights, then its title and line. */
export type SceneStep = { name: string; title: string; body: string };
/** Where each step's name sits under its part of the drawing, in its viewBox units. */
export type MarkerPoint = { x: number; y: number };

type Props = {
  steps: readonly SceneStep[];
  markers: readonly MarkerPoint[];
  /** The drawing's viewBox size, so markers and the caption can be placed by percentage. */
  size: { w: number; h: number };
  label: string;
  /** Which step faces front, as a continuous index driven by scroll (0 to steps - 1). */
  front: MotionValue<number>;
  /** Jump to a step, by scrolling to it. */
  onPick: (i: number) => void;
  children: (stage: number) => React.ReactNode;
};

/** On phones the drawing renders this much larger and pans with the scroll. */
const PHONE_ZOOM = 1.8;
/** The least gap the caption keeps to the window's edge. */
const EDGE = 40;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Walks a drawing stage by stage as the visitor scrolls. Each part is named
 * under the ground line; the lit one is bright and the names jump to their
 * stage. One caption, a title and a line, travels beneath to whichever part is
 * lit, fading through at the midpoint between stages. On phones the drawing is
 * larger and pans with the scroll. The caption sits centred under the lit part,
 * held off the window's edges.
 */
export function SceneGuide({ steps, markers, size, label, front, onPick, children }: Props) {
  const count = steps.length;
  const [stage, setStage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const laneRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  // Bumped on mount and resize, so the caption is placed before any scroll.
  const layout = useMotionValue(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      zoomRef.current = mq.matches ? PHONE_ZOOM : 1;
      setZoom(zoomRef.current);
      layout.set(layout.get() + 1);
    };
    sync();
    mq.addEventListener("change", sync);
    const relayout = () => layout.set(layout.get() + 1);
    window.addEventListener("resize", relayout);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", relayout);
    };
  }, [layout]);

  useMotionValueEvent(front, "change", (f) => {
    const next = clamp(Math.round(f), 0, count - 1);
    setStage((s) => (s === next ? s : next));
  });

  // The active part's horizontal position, gliding between markers with the scroll.
  const xAt = (f: number) => {
    const i = clamp(Math.floor(f), 0, count - 1);
    const j = Math.min(i + 1, count - 1);
    const t = f - i;
    return (markers[i].x + (markers[j].x - markers[i].x) * t) / size.w;
  };
  // How far the zoomed canvas is shifted, as a share of its own width.
  const panAt = (f: number) => {
    const z = zoomRef.current;
    if (z === 1) return 0;
    const half = 1 / (2 * z);
    return half - clamp(xAt(f), half, 1 - half);
  };
  const pan = useTransform(front, (f) => `${panAt(f) * 100}%`);
  // Centred under the lit part, spilling past the lane where the window has
  // room, and held off the window's edges only where it doesn't.
  const caption = useTransform([front, layout], ([f]: number[]) => {
    const lane = laneRef.current;
    if (!lane || !captionRef.current) return "50%";
    // Layout offsets, not the bounding box, so the panel's rising scale is ignored.
    let left = 0;
    for (let el: HTMLElement | null = lane; el; el = el.offsetParent as HTMLElement | null) left += el.offsetLeft;
    const width = lane.offsetWidth;
    // Where the lit part sits across the lane, after the phone zoom and pan.
    const x = (xAt(f) + panAt(f)) * zoomRef.current * width;
    const half = captionRef.current.offsetWidth / 2;
    const lo = EDGE + half - left;
    const hi = document.documentElement.clientWidth - EDGE - half - left;
    return `${lo > hi ? width / 2 : clamp(x, lo, hi)}px`;
  });
  // The text fades out before the midpoint between stages and back in after it.
  const captionOpacity = useTransform(front, (f) => Math.max(0, 1 - Math.abs(f - Math.round(f)) * 2.4));
  const step = steps[stage];

  return (
    <div className={styles.guide}>
      <figure className={styles.figure} role="img" aria-label={label}>
        <motion.div className={styles.canvas} style={{ width: `${zoom * 100}%`, x: pan }}>
          {children(stage)}
          {markers.map((m, i) => (
            <button
              key={i}
              type="button"
              className={`label ${styles.name}`}
              style={{ left: `${(m.x / size.w) * 100}%`, top: `${(m.y / size.h) * 100}%` }}
              aria-label={`Step ${i + 1}: ${steps[i].title}`}
              aria-pressed={i === stage}
              onClick={() => onPick(i)}
            >
              {steps[i].name}
            </button>
          ))}
        </motion.div>
      </figure>

      <div ref={laneRef} className={styles.lane}>
        <motion.div ref={captionRef} className={styles.caption} style={{ left: caption }} aria-live="polite">
          <motion.div style={{ opacity: captionOpacity }}>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.body}>{step.body}</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
