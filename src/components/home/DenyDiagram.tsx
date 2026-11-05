"use client";

import styles from "@/components/guide/diagram.module.css";

/**
 * Deny, in the same line drawing as the Track scene. LUMEN cues two effectors
 * onto two targets: BOLT, autonomous, intercepts a smaller threat close in and
 * fires a payload from its tip; FIST flies farther out and hits a larger one.
 * White strokes, ember only on the handed track, the flights, the tip, and the
 * hits. Illustrative.
 */

const G = 286;
const DOME = 168;
const BOLT = 348;
const FIST = 468;

/** A small threat, close to the launchers. */
const NEAR = { x: 590, y: 172, scale: 0.72 };
/** A larger threat, farther out. */
const FAR = { x: 908, y: 92, scale: 1.55 };

/** Nose along +x. Launch, then close. Defeat puts each effector on its own target. */
const ROCKET = [
  { x: 430, y: 196, rot: -42 },
  { x: 520, y: 180, rot: -16 },
  { x: NEAR.x - 22, y: NEAR.y, rot: -4 },
];
const INTERCEPTOR = [
  { x: 560, y: 206, rot: -14 },
  { x: 740, y: 148, rot: -8 },
  { x: FAR.x - 48, y: FAR.y + 4, rot: -2 },
];

const cue = `M${DOME + 76} ${G - 16} H ${FIST - 28}`;
const boltFlight = `M${BOLT} ${G - 108} C ${BOLT + 50} 170, 480 150, ${NEAR.x - 16} ${NEAR.y}`;
const fistFlight = `M${FIST} ${G - 36} C 640 200, 780 140, ${FAR.x - 36} ${FAR.y}`;

const CROP = { x: 48, y: 24, w: 960, h: 320 };

export const DENY_GUIDE = {
  size: { w: CROP.w, h: CROP.h },
  markers: [DOME, (BOLT + FIST) / 2, NEAR.x, (NEAR.x + FAR.x) / 2].map((x) => ({ x: x - CROP.x, y: G + 14 - CROP.y })),
} as const;

function Drone({ x, y, scale, hit, bracket }: { x: number; y: number; scale: number; hit: boolean; bracket: boolean }) {
  return (
    <g className={`${styles.drone} ${hit ? styles.down : ""}`}>
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <g className={styles.glyph}>
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
        <g className={`${styles.bracket} ${bracket ? styles.shown : ""}`}>
          <path d="M-34 -26 h10 M-34 -26 v10 M34 -26 h-10 M34 -26 v10 M-34 26 h10 M-34 26 v-10 M34 26 h-10 M34 26 v-10" />
        </g>
        <g className={`${styles.strike} ${hit ? styles.shown : ""}`}>
          <path d="M-20 -20 L 20 20 M20 -20 L -20 20" />
        </g>
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

/** A compact effect at BOLT's nose. It stays on the one near target. */
function Tip({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className={`${styles.strike} ${styles.shown}`}>
      <circle r="5" className={styles.emberFill} />
      <path d="M-11 0 H-6 M11 0 H6 M0 -11 V-6 M0 11 V6" />
    </g>
  );
}

export function DenyDiagram({ stage, still }: { stage: number; still: boolean }) {
  const part = (n: number) => `${styles.part} ${stage === n ? styles.on : ""}`;
  const link = (n: number) => `${styles.link} ${stage === n ? styles.linkOn : stage > n ? styles.linkDone : ""}`;
  const flying = stage === 1 || stage === 2;
  const hit = stage === 3;
  const rocket = ROCKET[Math.min(stage, 3) - 1];
  const fist = INTERCEPTOR[Math.min(stage, 3) - 1];
  const aimed = stage >= 2;

  return (
    <svg viewBox={`${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}`} className={styles.svg} aria-hidden="true">
      <line x1="20" y1={G} x2="1040" y2={G} className={styles.ground} />

      <path d={cue} className={link(0)} />
      <path d={boltFlight} className={`${styles.flight} ${stage >= 1 ? styles.linkOn : ""}`} />
      <path d={fistFlight} className={`${styles.flight} ${stage >= 1 ? styles.linkOn : ""}`} />

      <Drone x={NEAR.x} y={NEAR.y} scale={NEAR.scale} hit={hit} bracket={aimed} />
      <Drone x={FAR.x} y={FAR.y} scale={FAR.scale} hit={hit} bracket={aimed} />

      {/* 1 · Cue: the LUMEN Dome hands each effector its own track. */}
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

      {stage >= 1 && rocket && <Rocket x={rocket.x} y={rocket.y} rot={rocket.rot} />}
      {stage >= 1 && fist && <Fist x={fist.x} y={fist.y} rot={fist.rot} />}

      {/* 3 · Close, then 4 · Defeat: the payload leaves BOLT's tip onto the near threat only. */}
      {stage >= 2 && <Tip x={stage === 2 ? rocket.x + 22 : NEAR.x - 8} y={stage === 2 ? rocket.y : NEAR.y} />}

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
