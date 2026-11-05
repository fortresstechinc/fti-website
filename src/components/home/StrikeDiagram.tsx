"use client";

import styles from "@/components/guide/diagram.module.css";

/**
 * Strike, in the same line drawing as the Track scene. SPEAR launches inside
 * the LUMEN Dome, flies out past the dome edge, and strikes a target on the
 * ground. White strokes, ember only on the flight and the hit. Illustrative.
 */

const G = 304;
const EDGE = 408;
const TARGET = { x: 848, y: G - 20 };

/**
 * Nose along +x. One smooth arc: inside the dome, past its edge, inbound,
 * then the dive. The join is a reflected control, so the path doesn't kink.
 */
const SPEAR = [
  { x: 236, y: 232, rot: -43 },
  { x: 470, y: 150, rot: -14 },
  { x: 640, y: 132, rot: 12 },
  { x: 808, y: 230, rot: 42 },
];

const dome = `M78 ${G} A 165 150 0 0 1 ${EDGE} ${G}`;
const lift = `M${SPEAR[0].x} ${G - 8} L${SPEAR[0].x} ${SPEAR[0].y}`;
const flight = `M${SPEAR[0].x} ${SPEAR[0].y} C 340 140, 420 140, ${SPEAR[1].x} ${SPEAR[1].y} S 760 80, ${TARGET.x - 20} ${TARGET.y - 16}`;

const CROP = { x: 40, y: 36, w: 900, h: 332 };

export const STRIKE_GUIDE = {
  size: { w: CROP.w, h: CROP.h },
  markers: [SPEAR[0].x, EDGE, SPEAR[2].x, TARGET.x].map((x) => ({ x: x - CROP.x, y: G + 14 - CROP.y })),
} as const;

function Spear({ x, y, rot }: { x: number; y: number; rot: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} className={styles.glyph}>
      <path d="M20 0 L8 -4.5 L-16 -3.5 L-16 3.5 L8 4.5 Z" className={styles.solid} />
      <path d="M2 -3.5 L-8 -16 L6 -4 M2 3.5 L-8 16 L6 4 M-16 -3.5 L-22 -9 M-16 3.5 L-22 9" />
    </g>
  );
}

export function StrikeDiagram({ stage, still }: { stage: number; still: boolean }) {
  const part = (n: number) => `${styles.part} ${stage === n ? styles.on : ""}`;
  const spear = SPEAR[stage];
  const hit = stage === 3;

  return (
    <svg viewBox={`${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}`} className={styles.svg} aria-hidden="true">
      <line x1="20" y1={G} x2="980" y2={G} className={styles.ground} />

      <path d={flight} className={`${styles.flight} ${stage >= 1 ? styles.linkOn : ""}`} />

      {/* The dome. Full while SPEAR is still leaving it, then it recedes. */}
      <g className={`${styles.part} ${stage <= 1 ? styles.on : ""}`}>
        <path d={dome} className={styles.line} />
      </g>

      {/* The dome edge, the line SPEAR crosses. */}
      <g className={part(1)}>
        <path d={`M${EDGE} ${G} V ${G - 56}`} className={styles.line} />
      </g>

      <Spear x={spear.x} y={spear.y} rot={spear.rot} />

      {/* A ground target: one of the things the brief names. */}
      <g className={`${styles.part} ${stage >= 2 ? styles.on : ""}`}>
        <g transform={`translate(${TARGET.x} ${TARGET.y})`}>
          <path d="M-34 -8 H34 V10 H-34 Z" className={styles.solid} />
          <path d="M-16 -8 L-6 -20 H18 L26 -8" className={styles.line} />
          <circle cx="-18" cy="12" r="6" className={styles.line} />
          <circle cx="16" cy="12" r="6" className={styles.line} />
        </g>
      </g>
      <g transform={`translate(${TARGET.x} ${TARGET.y - 4})`} className={`${styles.bracket} ${stage >= 2 ? styles.shown : ""}`}>
        <path d="M-46 -32 h12 M-46 -32 v12 M46 -32 h-12 M46 -32 v12 M-46 28 h12 M-46 28 v-12 M46 28 h-12 M46 28 v-12" />
      </g>
      <g transform={`translate(${TARGET.x} ${TARGET.y - 4})`} className={`${styles.strike} ${hit ? styles.shown : ""}`}>
        <path d="M-16 -16 L 16 16 M16 -16 L -16 16" />
      </g>

      {!still && stage === 0 && (
        <circle r="3.5" className={styles.emberFill}>
          <animateMotion dur="1.2s" repeatCount="indefinite" path={lift} />
        </circle>
      )}
      {!still && stage >= 1 && !hit && (
        <circle r="4" className={styles.emberFill}>
          <animateMotion dur="1.6s" repeatCount="indefinite" path={flight} />
        </circle>
      )}
    </svg>
  );
}
