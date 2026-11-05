"use client";

import styles from "@/components/guide/diagram.module.css";

/** The same quadcopter as the home scenes. `scale` is how large the threat reads. */
export function Drone({
  x,
  y,
  scale,
  hit,
  bracket,
}: {
  x: number;
  y: number;
  scale: number;
  hit: boolean;
  bracket: boolean;
}) {
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

/** BOLT, nose along +x. The ember at the tail is the motor, not a payload. */
export function Rocket({ x, y, rot }: { x: number; y: number; rot: number }) {
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

/** Where a payload leaves the tip, in the same compact mark as the Deny scene. */
export function Tip({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className={`${styles.strike} ${styles.shown}`}>
      <circle r="5" className={styles.emberFill} />
      <path d="M-11 0 H-6 M11 0 H6 M0 -11 V-6 M0 11 V6" />
    </g>
  );
}

/** Nose of a rocket drawn by {@link Rocket}, so the payload sits on the tip. */
export function noseOf(x: number, y: number, rot: number) {
  const rad = (rot * Math.PI) / 180;
  return { x: x + Math.cos(rad) * 26, y: y + Math.sin(rad) * 26 };
}

/** FIST in flight, nose along +x. */
export function Interceptor({ x, y, rot, scale = 1.25 }: { x: number; y: number; rot: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`} className={styles.glyph}>
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
