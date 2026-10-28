"use client";

import styles from "@/components/guide/diagram.module.css";

/**
 * The whole system in one simple scene, drawn for the night panel in the line
 * style of the product illustrations: a drone in the sky, and along the ground
 * a radar on its tripod, the Anchor, the operator's rugged tablet and BOLT's
 * launch box. Each stage lights its own part and draws only its own link; links
 * already walked stay faint, links ahead stay hidden. White strokes, ember only
 * on the track, the approve control and the intercept. Illustrative.
 */

const G = 330; // ground line
// Placed so it stays in frame at every stage of the phone view's pan.
const DRONE = { x: 500, y: 104 };
const SENSOR = 140;
const ANCHOR = 390;
const TABLET = 640;
const LAUNCH = 861;

const beam = `M${SENSOR + 16} 236 L ${DRONE.x - 30} ${DRONE.y + 16}`;
const toAnchor = `M${SENSOR + 22} 314 L ${ANCHOR - 56} 314`;
const toTablet = `M${ANCHOR + 56} 314 L ${TABLET - 62} 314`;
const toLaunch = `M${TABLET + 62} 314 L ${LAUNCH - 20} 314`;
const intercept = `M${LAUNCH} 232 C ${LAUNCH - 6} 150, 740 ${DRONE.y + 6}, ${DRONE.x + 32} ${DRONE.y + 6}`;

/** The drawing is cropped to its content, so it renders as large as possible. */
const CROP = { x: 80, y: 52, w: 840, h: 332 };

/** The drawing's size and where each part's name sits under it, in cropped units. */
export const SYSTEM_GUIDE = {
  size: { w: CROP.w, h: CROP.h },
  markers: [SENSOR, ANCHOR, TABLET, LAUNCH].map((x) => ({ x: x - CROP.x, y: G + 12 - CROP.y })),
} as const;

export function SystemDiagram({ stage, still }: { stage: number; still: boolean }) {
  const part = (n: number) => `${styles.part} ${stage === n ? styles.on : ""}`;
  /** A link: drawn while its stage is lit, faint once walked past, hidden before. */
  const link = (n: number) => `${styles.link} ${stage === n ? styles.linkOn : stage > n ? styles.linkDone : ""}`;
  const tracked = stage >= 1;
  const hit = stage === 3;

  return (
    <svg viewBox={`${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}`} className={styles.svg} aria-hidden="true">
      <line x1="40" y1={G} x2="960" y2={G} className={styles.ground} />

      {/* The links between the parts, under everything else. */}
      <path d={beam} className={link(0)} />
      <path d={toAnchor} className={link(1)} />
      <path d={toTablet} className={link(2)} />
      <path d={toLaunch} className={link(3)} />
      <path d={intercept} className={`${styles.flight} ${stage === 3 ? styles.linkOn : ""}`} />

      {/* The drone: the subject, always shown. Tracked from stage 2; struck at the end. */}
      <g className={`${styles.drone} ${hit ? styles.down : ""}`}>
        <g transform={`translate(${DRONE.x} ${DRONE.y})`} className={styles.glyph}>
          <path d="M-15 -11 L15 11 M15 -11 L-15 11" />
          <rect x="-7" y="-5" width="14" height="10" rx="3" className={styles.solid} />
          {[
            [-15, -11],
            [15, -11],
            [-15, 11],
            [15, 11],
          ].map(([x, y]) => (
            <ellipse key={`${x}${y}`} cx={x} cy={y} rx="9" ry="2.6" />
          ))}
        </g>
      </g>
      <g transform={`translate(${DRONE.x} ${DRONE.y})`} className={`${styles.bracket} ${tracked ? styles.shown : ""}`}>
        <path d="M-34 -26 h10 M-34 -26 v10 M34 -26 h-10 M34 -26 v10 M-34 26 h10 M-34 26 v-10 M34 26 h-10 M34 26 v-10" />
      </g>
      <g transform={`translate(${DRONE.x} ${DRONE.y})`} className={`${styles.strike} ${hit ? styles.shown : ""}`}>
        <path d="M-20 -20 L 20 20 M20 -20 L -20 20" />
      </g>

      {/* 1 · Detect: a radar on its tripod, dish turned up toward the drone. */}
      <g className={part(0)}>
        <path d={`M${SENSOR} 286 L ${SENSOR - 20} ${G} M${SENSOR} 286 L ${SENSOR + 20} ${G} M${SENSOR} 286 L ${SENSOR} ${G}`} className={styles.line} />
        <rect x={SENSOR - 9} y="272" width="18" height="14" rx="2" className={styles.solid} />
        <path d={`M${SENSOR} 272 L ${SENSOR} 262`} className={styles.line} />
        <g transform={`rotate(-34 ${SENSOR} 254)`}>
          <path d={`M${SENSOR - 22} 248 Q ${SENSOR} 270 ${SENSOR + 22} 248 Z`} className={styles.solid} />
          <path d={`M${SENSOR} 258 L ${SENSOR} 238`} className={styles.line} />
          <circle cx={SENSOR} cy="236" r="2.6" className={styles.whiteFill} />
        </g>
      </g>

      {/* 2 · Track: the Anchor, a small rugged box with its antenna, holding one track. */}
      <g className={part(1)}>
        <path d={`M${ANCHOR + 34} 286 L ${ANCHOR + 40} 238`} className={styles.line} />
        <circle cx={ANCHOR + 40} cy="236" r="2.4" className={styles.whiteFill} />
        <rect x={ANCHOR - 48} y="286" width="96" height="44" rx="4" className={styles.solid} />
        <line x1={ANCHOR - 48} y1="298" x2={ANCHOR + 48} y2="298" className={styles.hairline} />
        <path d={`M${ANCHOR - 30} 286 a12 7 0 0 1 24 0`} className={styles.solid} />
        <path d={`M${ANCHOR + 4} 286 v-6 M${ANCHOR + 10} 286 v-6 M${ANCHOR + 16} 286 v-6 M${ANCHOR + 22} 286 v-6`} className={styles.line} />
        <rect x={ANCHOR - 54} y="284" width="10" height="46" rx="4" className={styles.solid} />
        <rect x={ANCHOR + 44} y="284" width="10" height="46" rx="4" className={styles.solid} />
        <path d={`M${ANCHOR} 306 l8 8 -8 8 -8 -8 z`} className={`${styles.emberFill} ${styles.reveal} ${tracked ? styles.shown : ""}`} />
      </g>

      {/* 3 · Approve: the operator's rugged tablet, the track on its map and Approve beneath. */}
      <g className={part(2)}>
        <rect x={TABLET - 56} y="252" width="112" height="78" rx="10" className={styles.solid} />
        <rect x={TABLET - 46} y="261" width="92" height="60" rx="3" className={styles.screen} />
        {[
          [TABLET - 56, 252],
          [TABLET + 44, 252],
          [TABLET - 56, 318],
          [TABLET + 44, 318],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="12" height="12" rx="4" className={styles.whiteFill} />
        ))}
        <circle cx={TABLET} cy="282" r="15" className={styles.hair} />
        <path d={`M${TABLET + 7} 275 l5 5 -5 5 -5 -5 z`} className={`${styles.emberFill} ${styles.reveal} ${tracked ? styles.shown : ""}`} />
        <rect x={TABLET - 30} y="304" width="60" height="11" rx="3" className={`${styles.approve} ${stage >= 2 ? styles.approveLive : ""}`} />
        <circle cx={TABLET} cy="309" r="12" className={styles.tap} />
      </g>

      {/* 4 · Intercept: BOLT's launch box, a tall square column with its vent. */}
      <g className={part(3)}>
        <rect x={LAUNCH - 14} y="232" width="28" height="98" rx="2" className={styles.solid} />
        <line x1={LAUNCH - 14} y1="300" x2={LAUNCH + 14} y2="300" className={styles.hairline} />
        <path d={`M${LAUNCH - 6} ${G} v-9 a6 6 0 0 1 12 0 v9`} className={styles.line} />
      </g>

      {/* The moving parts, only while their stage is lit. */}
      {!still && stage === 0 && (
        <circle r="3.5" className={styles.whiteFill}>
          <animateMotion dur="1.2s" repeatCount="indefinite" path={beam} />
        </circle>
      )}
      {!still &&
        (stage === 1 || stage === 2) &&
        [0, 0.45, 0.9].map((b) => (
          <circle key={`${stage}-${b}`} r="3.5" className={styles.whiteFill}>
            <animateMotion dur="1.35s" begin={`${b}s`} repeatCount="indefinite" path={stage === 1 ? toAnchor : toTablet} />
          </circle>
        ))}
      {!still && stage === 3 && (
        <circle r="5" className={styles.emberFill}>
          <animateMotion dur="1.6s" repeatCount="indefinite" path={intercept} />
        </circle>
      )}
    </svg>
  );
}
