"use client";

import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useState } from "react";
import type { GuideStep } from "./SceneGuide";
import styles from "./StageGallery.module.css";

export type StageImage = { src: string; alt: string };

type Props = {
  steps: readonly GuideStep[];
  images: readonly StageImage[];
  /** Which stage faces front, as a continuous index driven by scroll. */
  front: MotionValue<number>;
  onPick: (i: number) => void;
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** One illustration, fully shown at its own stage and gone by the next. */
function Picture({ image, index, front }: { image: StageImage; index: number; front: MotionValue<number> }) {
  const opacity = useTransform(front, (f) => clamp(1 - Math.abs(f - index) * 2));
  const scale = useTransform(front, (f) => 1 + (index - f) * 0.04);
  return <motion.img className={styles.picture} src={image.src} alt={image.alt} style={{ opacity, scale }} draggable={false} />;
}

/** The step's segment of the progress line, filling as the scroll arrives at it. */
function Segment({ index, front }: { index: number; front: MotionValue<number> }) {
  const scaleX = useTransform(front, (f) => clamp(f - index + 1));
  return (
    <span className={styles.track} aria-hidden="true">
      <motion.span className={styles.fill} style={{ scaleX }} />
    </span>
  );
}

/**
 * Walks a short sequence of illustrations, one per stage, as the visitor
 * scrolls. Beneath them a numbered row names every stage at once, so the whole
 * sequence reads at a glance, and lights the current one; each step jumps to
 * its stage.
 */
export function StageGallery({ steps, images, front, onPick }: Props) {
  const [stage, setStage] = useState(0);
  useMotionValueEvent(front, "change", (f) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.round(f)));
    setStage((s) => (s === next ? s : next));
  });

  return (
    <div className={styles.gallery}>
      <div className={styles.stage}>
        {images.map((image, i) => (
          <Picture key={image.src} image={image} index={i} front={front} />
        ))}
      </div>

      <ol className={styles.steps}>
        {steps.map((s, i) => (
          <li key={s.title}>
            <button type="button" className={styles.step} aria-current={i === stage ? "step" : undefined} onClick={() => onPick(i)}>
              <Segment index={i} front={front} />
              <span className={`label ${styles.count}`}>
                {String(i + 1).padStart(2, "0")}
                {s.tag && <span className={styles.tag}> · {s.tag}</span>}
              </span>
              <span className={styles.title}>{s.title}</span>
              <span className={styles.body}>{s.body}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className={styles.phoneBody} aria-live="polite">
        {steps[stage].body}
      </p>
    </div>
  );
}
