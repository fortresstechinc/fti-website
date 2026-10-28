// One timeline drives the hero: the 3D scene positions the drones from it and
// the HUD overlay reads the same numbers, so brackets always sit on their tracks.
// p is scroll progress through the hero, 0..1. All track data is illustrative.

export type Vec3 = [number, number, number];

export const seg = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const mix3 = (a: Vec3, b: Vec3, t: number): Vec3 => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

export type Interceptor = "bolt" | "fist";

export type Engagement = {
  by: Interceptor;
  /** Progress window of the interceptor's flight; the hit lands at its end. */
  flight: [number, number];
  /** Progress window over which the downed track falls back into the clouds. */
  fall: [number, number];
};

export type Track = {
  id: string;
  kind: "delta" | "quad";
  from: Vec3;
  to: Vec3;
  /** Progress window over which it climbs out of the cloud bank. */
  rise: [number, number];
  /** Classification once Lumen has looked at it. */
  label: string;
  engage?: Engagement;
};

// Every track starts below the bottom of the frame, so nothing shows until the
// visitor scrolls. Left to right on screen once they settle: 0861, 0874, 0882, 0893.
// BOLT is the faster round, so its hit lands first.
export const TRACKS: Track[] = [
  { id: "TRK-0882", kind: "delta", from: [-7, -9.5, -15], to: [3.4, 0.7, -5.5], rise: [0.08, 0.6], label: "Suspect", engage: { by: "fist", flight: [0.74, 0.9], fall: [0.9, 0.99] } },
  { id: "TRK-0874", kind: "quad", from: [4.5, -9, -13], to: [-2.6, 2.3, -9], rise: [0.14, 0.66], label: "Suspect", engage: { by: "bolt", flight: [0.74, 0.84], fall: [0.84, 0.94] } },
  { id: "TRK-0861", kind: "quad", from: [-1.5, -9, -12], to: [-5.8, 0.9, -7], rise: [0.18, 0.7], label: "Neutral" },
  { id: "TRK-0893", kind: "quad", from: [7, -10.5, -17], to: [6, 2.6, -12], rise: [0.22, 0.74], label: "Neutral" },
];

/** The defended site on the ground, below the clouds. Both interceptors launch from it. */
export const SITE: Vec3 = [0, -3.74, -6];
/** Each interceptor's launcher, as an x offset from the site. */
const LAUNCHER: Record<Interceptor, number> = { bolt: -0.5, fist: 0.5 };

export const PHASE = {
  headlineOut: [0.24, 0.36] as const,
  detect: 0.34,
  classify: 0.5,
  approve: 0.62,
  trajectory: [0.64, 0.74] as const,
  launch: 0.74,
};

export type Phase = 0 | 1 | 2 | 3 | 4;
export const STEPS = ["Detect", "Classify", "Approve", "Intercept"] as const;

export function phaseAt(p: number): Phase {
  if (p >= PHASE.launch) return 4;
  if (p >= PHASE.approve) return 3;
  if (p >= PHASE.classify) return 2;
  if (p >= PHASE.detect) return 1;
  return 0;
}

/** A track's position at p, plus a small ambient drift so nothing freezes mid-air. */
export function trackPosition(track: Track, p: number, time: number, xScale: number): Vec3 {
  const t = easeOut(seg(p, track.rise[0], track.rise[1]));
  const base = mix3(track.from, track.to, t);
  const settled = seg(p, track.rise[1], 1);
  const drift: Vec3 = [Math.sin(time * 0.4 + base[2]) * 0.12 + settled * 0.6 * Math.sign(track.to[0] - track.from[0]), Math.sin(time * 0.9 + base[0]) * 0.08, 0];
  return [(base[0] + drift[0]) * xScale, base[1] + drift[1], base[2]];
}

/** True once an engaged track has been hit. */
export const isCleared = (track: Track, p: number) => !!track.engage && p >= track.engage.flight[1];

/**
 * Quadratic bezier from an interceptor's launcher to its intercept point. BOLT
 * leaves its tube vertically and pitches over; FIST climbs on a shallower arc.
 */
export function interceptCurve(by: Interceptor, target: Vec3, xScale: number, t: number): Vec3 {
  const a: Vec3 = [(SITE[0] + LAUNCHER[by]) * xScale, SITE[1], SITE[2]];
  const c: Vec3 =
    by === "bolt"
      ? [a[0], mix(a[1], target[1], 0.9) + 0.4, mix(a[2], target[2], 0.3)]
      : [mix(a[0], target[0], 0.25), mix(a[1], target[1], 0.75) - 0.6, mix(a[2], target[2], 0.5)];
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * target[0], u * u * a[1] + 2 * u * t * c[1] + t * t * target[1], u * u * a[2] + 2 * u * t * c[2] + t * t * target[2]];
}
