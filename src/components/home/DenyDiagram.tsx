"use client";

import styles from "@/components/guide/diagram.module.css";

/**
 * Deny, in the same line drawing as the Track scene. A LUMEN dome cues two
 * effectors: BOLT, a rocket that closes to a proximity fuze and throws a
 * buckshot and BB spray through several drones, and FIST, a fast interceptor
 * that hits one. White strokes, ember only on the handed track, the flights,
 * the fuze, the spray and the hits. Illustrative.
 */

const G = 286;
const DOME = 168;
const BOLT = 348;
const FIST = 468;

const SWARM = [
  { x: 690, y: 86 },
  { x: 762, y: 74 },
  { x: 726, y: 140 },
];
const SINGLE = { x: 908, y: 116 };
/** The middle of the swarm, where BOLT's proximity fuze opens. */
const BURST = { x: 726, y: 100 };

/** Where the rocket and FIST sit once they are in the air, nose along +x. */
const ROCKET = [
  { x: 470, y: 148, rot: -58 },
  { x: BURST.x, y: BURST.y, rot: -8 },
];
const INTERCEPTOR = [
  { x: 590, y: 188, rot: -14 },
  { x: 790, y: 148, rot: -8 },
  { x: 868, y: 120, rot: -2 },
];

const cue = `M${DOME + 76} ${G - 16} H ${FIST - 28}`;
const boltFlight = `M${BOLT} ${G - 108} C ${BOLT + 80} 140, 560 60, ${BURST.x} ${BURST.y}`;
const fistFlight = `M${FIST} ${G - 36} C 600 200, 740 160, ${SINGLE.x - 40} ${SINGLE.y}`;

const CROP = { x: 52, y: 28, w: 940, h: 316 };

export const DENY_GUIDE = {
  size: { w: CROP.w, h: CROP.h },
  markers: [DOME, (BOLT + FIST) / 2, 640, 820].map((x) => ({ x: x - CROP.x, y: G + 14 - CROP.y })),
} as const;

function Drone({ x, y, hit }: { x: number; y: number; hit: boolean }) {
  return (
    <g className={`${styles.drone} ${hit ? styles.down : ""}`}>
      <g transform={`translate(${x} ${y})`} className={styles.glyph}>
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
      <g transform={`translate(${x} ${y})`} className={`${styles.strike} ${hit ? styles.shown : ""}`}>
        <path d="M-20 -20 L 20 20 M20 -20 L -20 20" />
      </g>
    </g>
  );
}

function Rocket({ x, y, rot }: { x: number; y: number; rot: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(1.35)`}>
      <g className={styles.glyph}>
        <path d="M18 0 L6 -5 L-12 -4.2 L-12 4.2 L6 5 Z" className={styles.solid} />
        <path d="M-2 -4.2 L-13 -12 L-6 -4.2 M-2 4.2 L-13 12 L-6 4.2" />
      </g>
      <path d="M-12 -2.2 L-20 0 L-12 2.2 Z" className={styles.emberFill} />
    </g>
  );
}

function Fist({ x, y, rot }: { x: number; y: number; rot: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(1.25)`} className={styles.glyph}>
      <rect x="-16" y="-4" width="34" height="8" rx="3" className={styles.solid} />
      <path d="M0 -4 L-10 -15 M0 4 L-10 15 M18 0 L24 0" />
      {[
        [-14, -7],
        [-7, -7],
        [-14, 7],
        [-7, 7],
      ].map(([cx, cy]) => (
        <ellipse key={`${cx}${cy}`} cx={cx} cy={cy} rx="4.5" ry="1.8" />
      ))}
    </g>
  );
}

/** Buckshot and BB, two sizes, along the line from the burst through one drone. */
function spray(to: { x: number; y: number }) {
  return [0.28, 0.5, 0.72, 0.96].map((t, i) => ({
    x: BURST.x + (to.x - BURST.x) * t,
    y: BURST.y + (to.y - BURST.y) * t,
    r: i % 2 === 0 ? 2.6 : 1.5,
  }));
}

export function DenyDiagram({ stage, still }: { stage: number; still: boolean }) {
  const part = (n: number) => `${styles.part} ${stage === n ? styles.on : ""}`;
  const link = (n: number) => `${styles.link} ${stage === n ? styles.linkOn : stage > n ? styles.linkDone : ""}`;
  const flying = stage >= 1 && stage <= 2;
  const hit = stage === 3;
  const rocket = stage === 1 ? ROCKET[0] : ROCKET[1];
  const fist = INTERCEPTOR[Math.min(stage, 3) - 1];

  return (
    <svg viewBox={`${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}`} className={styles.svg} aria-hidden="true">
      <line x1="20" y1={G} x2="1020" y2={G} className={styles.ground} />

      <path d={cue} className={link(0)} />
      <path d={boltFlight} className={`${styles.flight} ${flying ? styles.linkOn : ""}`} />
      <path d={fistFlight} className={`${styles.flight} ${flying ? styles.linkOn : ""}`} />

      {SWARM.map((d) => (
        <Drone key={`${d.x}${d.y}`} x={d.x} y={d.y} hit={hit} />
      ))}
      <Drone x={SINGLE.x} y={SINGLE.y} hit={hit} />
      <g transform={`translate(${SINGLE.x} ${SINGLE.y})`} className={`${styles.bracket} ${stage >= 2 ? styles.shown : ""}`}>
        <path d="M-34 -26 h10 M-34 -26 v10 M34 -26 h-10 M34 -26 v10 M-34 26 h10 M-34 26 v-10 M34 26 h-10 M34 26 v-10" />
      </g>

      {/* 1 · Cue: the LUMEN Dome hands the track to the effectors. */}
      <g className={part(0)}>
        <path d={`M${DOME - 84} ${G} A 84 72 0 0 1 ${DOME + 84} ${G}`} className={styles.line} />
        <rect x={DOME - 16} y={G - 26} width="32" height="26" rx="3" className={styles.solid} />
        <path d={`M${DOME} ${G - 16} l5 5 -5 5 -5 -5 z`} className={styles.emberFill} />
      </g>

      {/* 2 · Launch: BOLT's box and FIST on its pad. */}
      <g className={part(1)}>
        <rect x={BOLT - 14} y={G - 98} width="28" height="98" rx="2" className={styles.solid} />
        <line x1={BOLT - 14} y1={G - 30} x2={BOLT + 14} y2={G - 30} className={styles.hairline} />
        <path d={`M${BOLT - 6} ${G} v-9 a6 6 0 0 1 12 0 v9`} className={styles.line} />
        <rect x={FIST - 26} y={G - 8} width="52" height="8" rx="2" className={styles.solid} />
        {stage < 1 && <Fist x={FIST} y={G - 28} rot={-6} />}
      </g>

      {(stage === 1 || stage === 2) && <Rocket x={rocket.x} y={rocket.y} rot={rocket.rot} />}
      {stage >= 1 && fist && <Fist x={fist.x} y={fist.y} rot={fist.rot} />}

      {/* 3 · Close: the proximity fuze rings the swarm. FIST is bracketed onto the one drone. */}
      {stage === 2 && <circle cx={BURST.x} cy={BURST.y} r="52" className={`${styles.flight} ${styles.linkOn}`} />}

      {/* 4 · Defeat: buckshot and BB spray through the swarm. FIST has hit the one. */}
      <g className={`${styles.reveal} ${hit ? styles.shown : ""}`}>
        <circle cx={BURST.x} cy={BURST.y} r="5" className={styles.emberFill} />
        {SWARM.flatMap((d) => spray(d)).map((p) => (
          <circle key={`${p.x.toFixed(1)}-${p.y.toFixed(1)}`} cx={p.x} cy={p.y} r={p.r} className={styles.emberFill} />
        ))}
      </g>

      {!still && stage === 0 && (
        <circle r="3.5" className={styles.whiteFill}>
          <animateMotion dur="1.3s" repeatCount="indefinite" path={cue} />
        </circle>
      )}
      {!still && flying && (
        <>
          <circle r="4" className={styles.emberFill}>
            <animateMotion dur="1.5s" repeatCount="indefinite" path={boltFlight} />
          </circle>
          <circle r="3.5" className={styles.emberFill}>
            <animateMotion dur="1.7s" repeatCount="indefinite" path={fistFlight} />
          </circle>
        </>
      )}
    </svg>
  );
}
