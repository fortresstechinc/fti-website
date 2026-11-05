"use client";

import styles from "@/components/guide/diagram.module.css";
import { Drone, Rocket, Tip, noseOf } from "./sceneParts";

/**
 * BOLT, adapted from the Deny scene. One smaller threat, close to the box.
 * LUMEN can cue it, the round leaves the box, and a payload fires from the
 * tip. White strokes, ember only on the handed track, the flight, the tip and
 * the hit. Illustrative.
 */

const G = 292;
const DOME = 168;
const BOX = 400;
const TIP_X = 630;
const THREAT = { x: 880, y: 168, scale: 0.7 };

/** Nose along +x. In the box's mouth, then closing, then on the threat. */
const ROCKET = [
  { x: 458, y: 186, rot: -50 },
  { x: TIP_X, y: 170, rot: -16 },
  { x: THREAT.x - 30, y: THREAT.y + 2, rot: -4 },
];

const cue = `M${DOME + 76} ${G - 14} H ${BOX - 22}`;
const flight = `M${BOX} ${G - 104} C ${BOX + 80} 150, 560 148, ${THREAT.x - 16} ${THREAT.y}`;

const CROP = { x: 48, y: 36, w: 960, h: 324 };

export const BOLT_GUIDE = {
  size: { w: CROP.w, h: CROP.h },
  markers: [DOME, BOX, TIP_X, THREAT.x].map((x) => ({ x: x - CROP.x, y: G + 16 - CROP.y })),
} as const;

export function BoltDiagram({ stage, still }: { stage: number; still: boolean }) {
  const part = (n: number) => `${styles.part} ${stage === n ? styles.on : ""}`;
  const link = (n: number) => `${styles.link} ${stage === n ? styles.linkOn : stage > n ? styles.linkDone : ""}`;
  const rocket = stage >= 1 ? ROCKET[stage - 1] : null;
  const tip =
    stage === 2 && rocket ? noseOf(rocket.x, rocket.y, rocket.rot) : stage >= 3 ? { x: THREAT.x - 4, y: THREAT.y } : null;

  return (
    <svg viewBox={`${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}`} className={styles.svg} aria-hidden="true">
      <line x1="20" y1={G} x2="1080" y2={G} className={styles.ground} />

      <path d={cue} className={link(0)} />
      <path d={flight} className={`${styles.flight} ${stage >= 1 ? styles.linkOn : ""}`} />

      <Drone x={THREAT.x} y={THREAT.y} scale={THREAT.scale} hit={stage === 3} bracket={stage >= 2} />

      {/* 1 · Cue: the LUMEN Dome, handing BOLT its own track. */}
      <g className={part(0)}>
        <path d={`M${DOME - 78} ${G} A 78 64 0 0 1 ${DOME + 78} ${G}`} className={styles.line} />
        <rect x={DOME - 16} y={G - 26} width="32" height="26" rx="3" className={styles.solid} />
        <path d={`M${DOME} ${G - 16} l5 5 -5 5 -5 -5 z`} className={styles.emberFill} />
      </g>

      {/* 2 · Launch: the box that was set down. The round is still in it. */}
      <g className={part(1)}>
        <rect x={BOX - 14} y={G - 98} width="28" height="98" rx="2" className={styles.solid} />
        <line x1={BOX - 14} y1={G - 30} x2={BOX + 14} y2={G - 30} className={styles.hairline} />
        <path d={`M${BOX - 6} ${G} v-9 a6 6 0 0 1 12 0 v9`} className={styles.line} />
      </g>

      {rocket ? <Rocket x={rocket.x} y={rocket.y} rot={rocket.rot} /> : null}
      {tip ? <Tip x={tip.x} y={tip.y} /> : null}

      {!still && stage === 0 ? (
        <circle r="3.5" className={styles.whiteFill}>
          <animateMotion dur="1.3s" repeatCount="indefinite" path={cue} />
        </circle>
      ) : null}
      {!still && stage >= 1 && stage < 3 ? (
        <circle r="4" className={styles.emberFill}>
          <animateMotion dur="1.5s" repeatCount="indefinite" path={flight} />
        </circle>
      ) : null}
    </svg>
  );
}
