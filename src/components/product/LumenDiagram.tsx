"use client";

import styles from "@/components/guide/diagram.module.css";
import { Interceptor } from "./sceneParts";

/**
 * LUMEN, adapted from the Track scene. The Anchor starts the mesh, Link
 * extends it, the dome forms over both, and the cue runs out to BOLT and
 * FIST. White strokes, ember only on the track and the cue. Illustrative.
 */

const G = 308;
const ANCHOR = 200;
const LINK = 450;
const DOME_L = 70;
const DOME_R = 660;
const DOME_MARK = 590;
const DENY = 880;
const DRONE = { x: 390, y: 88 };

const toLink = `M${ANCHOR + 58} ${G - 22} H ${LINK - 40}`;
const extend = `M${LINK + 40} ${G - 22} H ${DOME_MARK - 10}`;
const dome = `M${DOME_L} ${G} A ${(DOME_R - DOME_L) / 2} 126 0 0 1 ${DOME_R} ${G}`;
const cue = `M${DOME_R - 4} ${G - 28} H ${DENY - 40}`;

const CROP = { x: 20, y: 12, w: 1060, h: 364 };

export const LUMEN_GUIDE = {
  size: { w: CROP.w, h: CROP.h },
  markers: [ANCHOR, LINK, DOME_MARK, DENY + 28].map((x) => ({ x: x - CROP.x, y: G + 16 - CROP.y })),
} as const;

export function LumenDiagram({ stage, still }: { stage: number; still: boolean }) {
  const part = (n: number) => `${styles.part} ${stage === n ? styles.on : ""}`;
  const link = (n: number) => `${styles.link} ${stage === n ? styles.linkOn : stage > n ? styles.linkDone : ""}`;
  return (
    <svg viewBox={`${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}`} className={styles.svg} aria-hidden="true">
      <line x1="0" y1={G} x2="1160" y2={G} className={styles.ground} />

      <path d={toLink} className={link(1)} />
      <path d={extend} className={link(1)} />
      <path d={cue} className={link(3)} />

      <g className={styles.drone}>
        <g transform={`translate(${DRONE.x} ${DRONE.y})`} className={styles.glyph}>
          <path d="M-15 -11 L15 11 M15 -11 L-15 11" />
          <rect x="-7" y="-5" width="14" height="10" rx="3" className={styles.solid} />
          {[
            [-15, -11],
            [15, -11],
            [-15, 11],
            [15, 11],
          ].map(([cx, cy]) => (
            <ellipse key={`${cx}${cy}`} cx={cx} cy={cy} rx="9" ry="2.6" />
          ))}
        </g>
      </g>
      <g transform={`translate(${DRONE.x} ${DRONE.y})`} className={`${styles.bracket} ${styles.shown}`}>
        <path d="M-34 -26 h10 M-34 -26 v10 M34 -26 h-10 M34 -26 v10 M-34 26 h10 M-34 26 v-10 M34 26 h-10 M34 26 v-10" />
      </g>

      {/* The dome forms over the mesh, then stays up while it cues Deny. */}
      <g className={`${styles.reveal} ${stage >= 2 ? styles.shown : ""}`}>
        <path d={dome} className={styles.line} />
      </g>

      {/* 1 · Track: the Anchor starts the mesh and holds one track. */}
      <g className={part(0)}>
        <path d={`M${ANCHOR + 34} ${G - 44} L ${ANCHOR + 40} ${G - 92}`} className={styles.line} />
        <circle cx={ANCHOR + 40} cy={G - 94} r="2.4" className={styles.whiteFill} />
        <rect x={ANCHOR - 48} y={G - 44} width="96" height="44" rx="4" className={styles.solid} />
        <line x1={ANCHOR - 48} y1={G - 32} x2={ANCHOR + 48} y2={G - 32} className={styles.hairline} />
        <path d={`M${ANCHOR - 30} ${G - 44} a12 7 0 0 1 24 0`} className={styles.solid} />
        <path
          d={`M${ANCHOR + 4} ${G - 44} v-6 M${ANCHOR + 10} ${G - 44} v-6 M${ANCHOR + 16} ${G - 44} v-6 M${ANCHOR + 22} ${G - 44} v-6`}
          className={styles.line}
        />
        <rect x={ANCHOR - 54} y={G - 46} width="10" height="46" rx="4" className={styles.solid} />
        <rect x={ANCHOR + 44} y={G - 46} width="10" height="46" rx="4" className={styles.solid} />
        <path
          d={`M${ANCHOR} ${G - 24} l8 8 -8 8 -8 -8 z`}
          className={`${styles.emberFill} ${styles.reveal} ${styles.shown}`}
        />
      </g>

      {/* 2 · Extend: Link, a repeater, carrying the mesh farther out. */}
      <g className={part(1)}>
        <path d={`M${LINK - 14} ${G - 96} a16 14 0 0 1 28 0`} className={styles.line} />
        <path d={`M${LINK - 26} ${G - 108} a28 22 0 0 1 52 0`} className={styles.line} />
        <path d={`M${LINK + 16} ${G - 40} L ${LINK + 24} ${G - 78}`} className={styles.line} />
        <circle cx={LINK + 24} cy={G - 80} r="2.2" className={styles.whiteFill} />
        <rect x={LINK - 32} y={G - 40} width="64" height="40" rx="3" className={styles.solid} />
        <line x1={LINK - 32} y1={G - 28} x2={LINK + 32} y2={G - 28} className={styles.hairline} />
      </g>

      {/* 4 · Cue: BOLT's box and FIST on its pad, just outside the dome. */}
      <g className={part(3)}>
        <rect x={DENY - 14} y={G - 78} width="24" height="78" rx="2" className={styles.solid} />
        <line x1={DENY - 14} y1={G - 24} x2={DENY + 10} y2={G - 24} className={styles.hairline} />
        <path d={`M${DENY - 6} ${G} v-8 a5 5 0 0 1 10 0 v8`} className={styles.line} />
        <rect x={DENY + 36} y={G - 8} width="44" height="8" rx="2" className={styles.solid} />
        <Interceptor x={DENY + 58} y={G - 28} rot={-8} scale={0.95} />
      </g>

      {!still && stage === 1
        ? [toLink, extend].map((path) => (
            <circle key={path} r="3.5" className={styles.whiteFill}>
              <animateMotion dur="1.35s" repeatCount="indefinite" path={path} />
            </circle>
          ))
        : null}
      {!still && stage === 3 ? (
        <circle r="3.5" className={styles.emberFill}>
          <animateMotion dur="1.4s" repeatCount="indefinite" path={cue} />
        </circle>
      ) : null}
    </svg>
  );
}
