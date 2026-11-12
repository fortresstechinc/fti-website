"use client";

import styles from "@/components/guide/diagram.module.css";
import { Drone, Interceptor } from "./sceneParts";

/**
 * FIST, adapted from the Deny scene. A longer flight to one larger threat.
 * A tablet stands for the pilot; the aircraft is already on the path, so it
 * can be flown or guide itself. White strokes, ember on the flight and the
 * hit. Illustrative.
 */

const G = 304;
const PAD = 156;
const PILOT = 390;
const FAR = 720;
const THREAT = { x: 990, y: 100, scale: 1.48 };

/** Nose along +x. Clear of the pad, out along the route, then on the larger threat. */
const FLIGHT = [
  { x: 530, y: 186, rot: -10 },
  { x: FAR, y: 146, rot: -6 },
  { x: THREAT.x - 58, y: THREAT.y + 6, rot: -2 },
];

// The pilot's link leaves the top of the tablet. The route stays above it.
const guide = `M${PILOT} ${G - 74} Q 470 156, 530 186`;
const route = `M${PAD} ${G - 42} C 280 200, 420 168, 530 186 S 860 108, ${THREAT.x - 44} ${THREAT.y + 6}`;

const CROP = { x: 40, y: 12, w: 1060, h: 360 };

export const FIST_GUIDE = {
  size: { w: CROP.w, h: CROP.h },
  markers: [PAD, PILOT, FAR, THREAT.x].map((x) => ({ x: x - CROP.x, y: G + 16 - CROP.y })),
} as const;

export function FistDiagram({ stage, still }: { stage: number; still: boolean }) {
  const part = (n: number) => `${styles.part} ${stage === n ? styles.on : ""}`;
  const link = (n: number) => `${styles.link} ${stage === n ? styles.linkOn : stage > n ? styles.linkDone : ""}`;
  const craft = stage >= 1 ? FLIGHT[stage - 1] : null;

  return (
    <svg viewBox={`${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}`} className={styles.svg} aria-hidden="true">
      <line x1="20" y1={G} x2="1160" y2={G} className={styles.ground} />

      <path d={guide} className={link(1)} />
      <path d={route} className={`${styles.flight} ${stage >= 1 ? styles.linkOn : ""}`} />

      <Drone x={THREAT.x} y={THREAT.y} scale={THREAT.scale} hit={stage === 3} bracket={stage >= 2} />

      {/* 1 · Launch: one pad. The copy carries ground, vehicle and boat. */}
      <g className={part(0)}>
        <rect x={PAD - 28} y={G - 8} width="56" height="8" rx="2" className={styles.solid} />
        {stage < 1 ? <Interceptor x={PAD} y={G - 30} rot={-8} /> : null}
      </g>

      {/* 2 · Guide: the pilot's tablet. The route itself is the other way it flies. */}
      <g className={part(1)}>
        <rect x={PILOT - 36} y={G - 70} width="72" height="52" rx="8" className={styles.solid} />
        <rect x={PILOT - 28} y={G - 62} width="56" height="36" rx="2" className={styles.screen} />
        <path d={`M${PILOT - 16} ${G - 42} H ${PILOT + 16}`} className={styles.hairline} />
        <circle cx={PILOT + 8} cy={G - 50} r="3" className={styles.emberFill} />
      </g>

      {craft ? <Interceptor x={craft.x} y={craft.y} rot={craft.rot} /> : null}

      {!still && stage === 1 ? (
        <circle r="3.5" className={styles.whiteFill}>
          <animateMotion dur="1.3s" repeatCount="indefinite" path={guide} />
        </circle>
      ) : null}
      {!still && stage >= 1 && stage < 3 ? (
        <circle r="4" className={styles.emberFill}>
          <animateMotion dur="1.7s" repeatCount="indefinite" path={route} />
        </circle>
      ) : null}
    </svg>
  );
}
