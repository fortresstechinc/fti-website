"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { ActionPanel, ActionVisual, Product } from "@/content/products";
import styles from "./InAction.module.css";

const LINE = "#E4EAF0";
const DIM = "rgb(228 234 240 / 0.28)";
const EMBER = "#FF5B1F";
const mono = { fontFamily: "var(--font-mono)", letterSpacing: "0.08em" } as const;
/** Rounds computed coordinates, so server and browser print identical markup. */
const r2 = (v: number) => Math.round(v * 100) / 100;

/** Opacity over a looping timeline: `at` are fractions of `dur`, `v` the values there. */
function Fade({ dur, at, v, live }: { dur: number; at: number[]; v: number[]; live: boolean }) {
  if (!live) return null;
  return <animate attributeName="opacity" dur={`${dur}s`} repeatCount="indefinite" keyTimes={at.join(";")} values={v.join(";")} />;
}

/* ---------- Figure panel drawings ---------- */

/** A ring at the product's range; with a comparison, the smaller ring to scale inside it. */
function Range({ km, compareKm, live }: { km: number; compareKm?: number; live: boolean }) {
  const R = 74, c = r2(2 * Math.PI * R), cx = 160, cy = 92;
  const rIn = compareKm ? r2((R * compareKm) / km) : 0;
  return (
    <svg viewBox="0 0 320 184" className={styles.graphic} aria-hidden="true" fill="none">
      <circle cx={cx} cy={cy} r={R} stroke={DIM} strokeDasharray="2 6" />
      <circle cx={cx} cy={cy} r={R} stroke={EMBER} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${c} ${c}`} strokeDashoffset={live ? c : 0} transform={`rotate(-90 ${cx} ${cy})`}>
        {live && <animate data-once attributeName="stroke-dashoffset" begin="indefinite" dur="2.4s" fill="freeze" from={c} to="0" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1" />}
      </circle>
      <path d={`M${cx} ${cy}H${cx + R}`} stroke={LINE} strokeOpacity="0.6" strokeDasharray="3 4" />
      <circle cx={cx} cy={cy} r="3.5" fill={LINE} />
      <text x={cx + R + 8} y={cy + 4} fill={LINE} fontSize="11" style={mono}>
        {km} KM
      </text>
      {compareKm ? (
        <>
          <circle cx={cx} cy={cy} r={rIn} stroke={LINE} strokeWidth="1.5" />
          <path d={`M${r2(cx - rIn * 0.7)} ${r2(cy - rIn * 0.7)}L${cx - 44} ${cy - 46}H${cx - 70}`} stroke={LINE} strokeOpacity="0.6" />
          <text x={cx - 72} y={cy - 50} fill={LINE} fillOpacity="0.8" fontSize="10" textAnchor="end" style={mono}>
            BOLT {compareKm} KM
          </text>
        </>
      ) : null}
    </svg>
  );
}

/** A scale from 0 to the full range, crossed by a moving mark at the product's pace. */
function Travel({ km, time, live }: { km: number; time: string; live: boolean }) {
  const x0 = 24, x1 = 296, y = 104;
  return (
    <svg viewBox="0 0 320 184" className={styles.graphic} aria-hidden="true" fill="none">
      <path d={`M${x0} ${y}H${x1}`} stroke={DIM} strokeWidth="2" />
      {[0, 0.5, 1].map((t) => (
        <g key={t}>
          <path d={`M${x0 + (x1 - x0) * t} ${y - 8}V${y + 8}`} stroke={LINE} strokeOpacity="0.6" />
          <text x={x0 + (x1 - x0) * t} y={y + 28} fill={LINE} fillOpacity="0.7" fontSize="10" textAnchor="middle" style={mono}>
            {t === 0 ? "0" : `${km * t} KM`}
          </text>
        </g>
      ))}
      <path d={`M${x0} ${y}H${x1}`} stroke={EMBER} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${x1 - x0} ${x1 - x0}`} strokeDashoffset={live ? x1 - x0 : 0}>
        {live && <animate data-once attributeName="stroke-dashoffset" begin="indefinite" dur="2.8s" fill="freeze" from={x1 - x0} to="0" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1" />}
      </path>
      <circle cx={live ? x0 : x1} cy={y} r="6" fill={EMBER}>
        {live && <animate data-once attributeName="cx" begin="indefinite" dur="2.8s" fill="freeze" from={x0} to={x1} calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1" />}
      </circle>
      <text x={x1} y={y - 22} fill={LINE} fontSize="12" textAnchor="end" style={mono}>
        {time}
      </text>
    </svg>
  );
}

/** One mark per track, lighting up in turn until the whole picture is held. */
function Tracks({ count, live }: { count: number; live: boolean }) {
  const cols = 10, gap = 26, w = (cols - 1) * gap, rows = Math.ceil(count / cols);
  const x0 = 160 - w / 2, y0 = 92 - ((rows - 1) * gap) / 2;
  return (
    <svg viewBox="0 0 320 184" className={styles.graphic} aria-hidden="true" fill="none">
      {Array.from({ length: count }, (_, i) => {
        const x = x0 + (i % cols) * gap, y = y0 + Math.floor(i / cols) * gap, t = i / count;
        const hostile = i % 7 === 3;
        return (
          <path key={i} d={`M${x} ${y - 6}l6 6-6 6-6-6z`} fill={hostile ? EMBER : LINE} opacity={live ? 0.15 : hostile ? 1 : 0.8}>
            <Fade live={live} dur={6} at={[0, t * 0.6, t * 0.6 + 0.04, 0.88, 1]} v={[0.15, 0.15, hostile ? 1 : 0.8, hostile ? 1 : 0.8, 0.15]} />
          </path>
        );
      })}
    </svg>
  );
}

/** Many sensors into one node, and out to the effectors. */
function Connect({ live }: { live: boolean }) {
  const ins = ["RADAR", "EO/IR", "RF", "ACOUSTIC"];
  const outs = ["BOLT", "FIST"];
  const nx = 160, ny = 92;
  return (
    <svg viewBox="0 0 320 184" className={styles.graphic} aria-hidden="true" fill="none">
      {ins.map((n, i) => {
        const y = 26 + i * 44;
        return (
          <g key={n}>
            <text x="8" y={y + 4} fill={LINE} fillOpacity="0.75" fontSize="9" style={mono}>
              {n}
            </text>
            <path d={`M74 ${y}C112 ${y} 116 ${ny} ${nx - 22} ${ny}`} stroke={LINE} strokeOpacity="0.55" strokeDasharray="3 5">
              {live && <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.2s" repeatCount="indefinite" />}
            </path>
          </g>
        );
      })}
      <rect x={nx - 22} y={ny - 16} width="44" height="32" rx="6" fill="#18222e" stroke={LINE} strokeWidth="1.5" />
      <text x={nx} y={ny + 4} fill={LINE} fontSize="8.5" textAnchor="middle" style={mono}>
        LUMEN
      </text>
      {outs.map((n, i) => {
        const y = 58 + i * 68;
        return (
          <g key={n}>
            <path d={`M${nx + 22} ${ny}C204 ${ny} 206 ${y} 246 ${y}`} stroke={EMBER} strokeWidth="1.5" strokeDasharray="3 5">
              {live && <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.2s" repeatCount="indefinite" />}
            </path>
            <text x="254" y={y + 4} fill={LINE} fontSize="9" style={mono}>
              {n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** A dial that runs and stops short of the minute. */
function Stopwatch({ seconds, live }: { seconds: number; live: boolean }) {
  const cx = 160, cy = 96, R = 64, c = r2(2 * Math.PI * R), stop = r2((seconds / 60) * c);
  const ang = (seconds / 60) * 360;
  return (
    <svg viewBox="0 0 320 184" className={styles.graphic} aria-hidden="true" fill="none">
      <path d={`M${cx - 8} ${cy - R - 16}h16M${cx} ${cy - R - 16}v8`} stroke={LINE} strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={R} stroke={DIM} strokeWidth="2" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * 2 * Math.PI;
        return <path key={i} d={`M${r2(cx + Math.sin(a) * (R - 6))} ${r2(cy - Math.cos(a) * (R - 6))}L${r2(cx + Math.sin(a) * (R - 13))} ${r2(cy - Math.cos(a) * (R - 13))}`} stroke={LINE} strokeOpacity="0.55" />;
      })}
      <circle cx={cx} cy={cy} r={R} stroke={EMBER} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${stop} ${c}`} strokeDashoffset={0} transform={`rotate(-90 ${cx} ${cy})`}>
        {live && <animate attributeName="stroke-dasharray" dur="5s" repeatCount="indefinite" keyTimes="0;0.6;0.9;1" values={`0 ${c};${stop} ${c};${stop} ${c};0 ${c}`} />}
      </circle>
      <path d={`M${cx} ${cy}V${cy - R + 18}`} stroke={LINE} strokeWidth="2" strokeLinecap="round" transform={`rotate(${ang} ${cx} ${cy})`}>
        {live && <animateTransform attributeName="transform" type="rotate" dur="5s" repeatCount="indefinite" keyTimes="0;0.6;0.9;1" values={`0 ${cx} ${cy};${ang} ${cx} ${cy};${ang} ${cx} ${cy};0 ${cx} ${cy}`} />}
      </path>
      <circle cx={cx} cy={cy} r="4" fill={LINE} />
      <text x={cx + R + 14} y={cy - R + 10} fill={LINE} fillOpacity="0.7" fontSize="10" style={mono}>
        60 S
      </text>
    </svg>
  );
}

function Panel({ panel, live }: { panel: ActionPanel; live: boolean }) {
  if (panel.kind === "partner") {
    return (
      <div className={`${styles.panel} ${styles.partner}`}>
        <span className={`label ${styles.partnerLabel}`}>Partner program</span>
        <div className={styles.partnerMarks}>
          <img src="/brand/fti-black.png" alt="FTI" className={styles.partnerFti} />
          <span className={styles.partnerRule} aria-hidden="true" />
          <img src="/brand/nvidia-inception.webp" alt="NVIDIA Inception Program" className={styles.partnerBadge} />
        </div>
        <p className={styles.partnerText}>FTI is a member of NVIDIA Inception.</p>
      </div>
    );
  }
  return <FigurePanel panel={panel} live={live} />;
}

/** A figure panel: a small moving drawing above its figure and caption. */
function FigurePanel({ panel, live }: { panel: Exclude<ActionPanel, { kind: "partner" }>; live: boolean }) {
  const drawing =
    panel.kind === "range" ? <Range km={panel.km} compareKm={panel.compareKm} live={live} /> :
    panel.kind === "travel" ? <Travel km={panel.km} time={panel.time} live={live} /> :
    panel.kind === "tracks" ? <Tracks count={panel.count} live={live} /> :
    panel.kind === "connect" ? <Connect live={live} /> :
    <Stopwatch seconds={panel.seconds} live={live} />;
  return (
    <div className={styles.panel}>
      {drawing}
      <div className={styles.caption}>
        <p className={styles.figure}>{panel.figure}</p>
        <p className={styles.label}>{panel.label}</p>
      </div>
    </div>
  );
}

/* ---------- Square visuals ---------- */

/** Lumen at work on one screen: tracks appear, are sorted, one is approved and engaged. */
function LumenLoop({ live }: { live: boolean }) {
  const D = 9, cx = 225, cy = 360;
  const tracks = [
    { x: 300, y: 190, k: "hostile" }, { x: 92, y: 250, k: "unknown" }, { x: 168, y: 292, k: "friendly" },
    { x: 334, y: 438, k: "unknown" }, { x: 118, y: 476, k: "hostile" }, { x: 372, y: 300, k: "unknown" },
  ] as const;
  return (
    <svg viewBox="0 0 450 800" className={styles.visualSvg} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Lumen at work: tracks appear on the map, are sorted into hostile, unknown and friendly, and the operator approves one engagement." fill="none">
      <rect x="0" y="0" width="450" height="800" fill="#0d141c" />
      <g stroke="#fff" strokeOpacity="0.05">
        <path d="M0 90H450M0 180H450M0 270H450M0 360H450M0 450H450M0 540H450M0 630H450M0 720H450M90 0V800M180 0V800M270 0V800M360 0V800" />
      </g>
      <path d="M0 610C80 576 150 624 226 572S350 520 450 536" stroke="#fff" strokeOpacity="0.08" strokeWidth="10" />
      <circle cx={cx} cy={cy} r="180" stroke="#fff" strokeOpacity="0.1" strokeDasharray="4 7" />
      <circle cx={cx} cy={cy} r="92" stroke="#fff" strokeOpacity="0.14" />
      <rect x={cx - 7} y={cy - 7} width="14" height="14" rx="2" fill={LINE} />
      <text x="26" y="46" fill={LINE} fillOpacity="0.7" fontSize="13" style={mono}>
        LUMEN · ATAK
      </text>
      {tracks.map((t, i) => {
        const appear = 0.04 + i * 0.035;
        return (
          <g key={i}>
            <circle cx={t.x} cy={t.y} r="5" fill={LINE} fillOpacity="0.55" opacity={0}>
              <Fade live={live} dur={D} at={[0, appear, appear + 0.03, 0.3, 0.34, 1]} v={[0, 0, 1, 1, 0, 0]} />
            </circle>
            <g opacity={live ? 0 : 1}>
              <Fade live={live} dur={D} at={[0, 0.3, 0.34, 0.92, 0.97, 1]} v={[0, 0, 1, 1, 0, 0]} />
              {t.k === "hostile" && <path d={`M${t.x} ${t.y - 10}l10 10-10 10-10-10z`} fill={EMBER} />}
              {t.k === "friendly" && <rect x={t.x - 8} y={t.y - 8} width="16" height="16" fill="#4c8dff" />}
              {t.k === "unknown" && <circle cx={t.x} cy={t.y} r="8" fill="#8a96a3" />}
            </g>
          </g>
        );
      })}
      {/* The selected threat, its approval and the intercept line. */}
      <g opacity={live ? 0 : 1}>
        <Fade live={live} dur={D} at={[0, 0.45, 0.49, 0.92, 0.97, 1]} v={[0, 0, 1, 1, 0, 0]} />
        <path d="M280 170h-8v8M320 170h8v8M280 210h-8v-8M320 210h8v-8" stroke={EMBER} strokeWidth="2" />
      </g>
      <path d={`M${cx} ${cy}Q252 270 300 190`} stroke={EMBER} strokeWidth="2" strokeDasharray="4 5" opacity={live ? 0 : 1}>
        <Fade live={live} dur={D} at={[0, 0.66, 0.7, 0.92, 0.97, 1]} v={[0, 0, 1, 1, 0, 0]} />
        {live && <animate attributeName="stroke-dashoffset" from="18" to="0" dur="0.8s" repeatCount="indefinite" />}
      </path>
      <g opacity={live ? 0 : 1}>
        <Fade live={live} dur={D} at={[0, 0.5, 0.54, 0.92, 0.97, 1]} v={[0, 0, 1, 1, 0, 0]} />
        <rect x="105" y="684" width="240" height="52" rx="10" fill={EMBER} />
        <text x={cx} y="716" fill="#0d1117" fontSize="15" textAnchor="middle" style={{ ...mono, fontWeight: 600 }}>
          APPROVE
        </text>
        <circle cx={cx} cy="710" r="14" fill="#fff" fillOpacity="0.5" opacity="0">
          {live && <animate attributeName="opacity" dur={`${D}s`} repeatCount="indefinite" keyTimes="0;0.6;0.62;0.68;1" values="0;0;0.9;0;0" />}
          {live && <animate attributeName="r" dur={`${D}s`} repeatCount="indefinite" keyTimes="0;0.6;0.68;1" values="6;6;34;34" />}
        </circle>
      </g>
    </svg>
  );
}

/** A day on battery: an ember arc runs the full 24-hour dial, sun into moon. */
function DayLoop({ live }: { live: boolean }) {
  const cx = 225, cy = 380, R = 160, c = r2(2 * Math.PI * R);
  const D = 9;
  const at = (h: number) => [r2(cx + Math.sin((h / 24) * 2 * Math.PI) * R), r2(cy - Math.cos((h / 24) * 2 * Math.PI) * R)];
  return (
    <svg viewBox="0 0 450 800" className={styles.visualSvg} preserveAspectRatio="xMidYMid slice" role="img" aria-label="A 24-hour dial with an ember arc running all the way round, from day into night: the Anchor runs up to 24 hours on battery." fill="none">
      <rect x="0" y="0" width="450" height="800" fill="#0d141c" />
      <text x="26" y="46" fill={LINE} fillOpacity="0.7" fontSize="13" style={mono}>
        ANCHOR
      </text>
      <circle cx={cx} cy={cy} r={R} stroke={DIM} strokeWidth="2" />
      {Array.from({ length: 24 }, (_, h) => {
        const a = (h / 24) * 2 * Math.PI, l = h % 6 === 0 ? 16 : 8;
        return <path key={h} d={`M${r2(cx + Math.sin(a) * (R - 10))} ${r2(cy - Math.cos(a) * (R - 10))}L${r2(cx + Math.sin(a) * (R - 10 - l))} ${r2(cy - Math.cos(a) * (R - 10 - l))}`} stroke={LINE} strokeOpacity={h % 6 === 0 ? 0.8 : 0.4} strokeWidth="1.5" />;
      })}
      {[0, 6, 12, 18].map((h) => {
        const [x, y] = at(h);
        const ox = h === 6 ? 24 : h === 18 ? -24 : 0, oy = h === 0 ? -16 : h === 12 ? 28 : 4;
        return (
          <text key={h} x={x + ox} y={y + oy} fill={LINE} fillOpacity="0.7" fontSize="12" textAnchor="middle" style={mono}>
            {String(h).padStart(2, "0")}
          </text>
        );
      })}
      <circle cx={cx} cy={cy} r={R} stroke={EMBER} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${c} ${c}`} strokeDashoffset={live ? c : 0} transform={`rotate(-90 ${cx} ${cy})`}>
        {live && <animate attributeName="stroke-dashoffset" dur={`${D}s`} repeatCount="indefinite" keyTimes="0;0.8;0.94;1" values={`${c};0;0;${c}`} />}
      </circle>
      {/* Sun for the day half, moon for the night half, riding the head of the arc. */}
      <g>
        {live && <animateMotion dur={`${D}s`} repeatCount="indefinite" keyTimes="0;0.8;1" keyPoints="0;1;1" calcMode="linear" path={`M${cx} ${cy - R}A${R} ${R} 0 1 1 ${cx - 0.01} ${cy - R}`} />}
        <g transform={live ? undefined : `translate(${cx} ${cy - R})`}>
          <g opacity={live ? 1 : 0}>
            <Fade live={live} dur={D} at={[0, 0.4, 0.42, 0.98, 1]} v={[1, 1, 0, 0, 1]} />
            <circle r="13" fill="#2b3a4a" stroke={LINE} strokeWidth="2" />
            <path d="M0-21v-6M0 21v6M-21 0h-6M21 0h6M-15-15l-4-4M15 15l4 4M15-15l4-4M-15 15l-4 4" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
          </g>
          <g opacity={live ? 0 : 1}>
            <Fade live={live} dur={D} at={[0, 0.4, 0.42, 0.98, 1]} v={[0, 0, 1, 1, 0]} />
            <path d="M5-15A15 15 0 1 0 15 5 11.7 11.7 0 0 1 5-15Z" fill="#2b3a4a" stroke={LINE} strokeWidth="2" strokeLinejoin="round" />
          </g>
        </g>
      </g>
      <text x={cx} y={cy + 20} fill={LINE} fontSize="68" textAnchor="middle" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
        24 h
      </text>
      <text x={cx} y="680" fill={LINE} fillOpacity="0.7" fontSize="13" textAnchor="middle" style={mono}>
        UP TO 24 HOURS ON BATTERY
      </text>
    </svg>
  );
}

function Visual({ visual, live }: { visual: ActionVisual; live: boolean }) {
  if (visual.kind === "video") {
    return (
      <video className={styles.video} src={visual.file} poster={visual.poster} autoPlay={live} muted loop playsInline preload="metadata" aria-label={visual.label} controls={!live} />
    );
  }
  return visual.kind === "lumen" ? <LumenLoop live={live} /> : <DayLoop live={live} />;
}

/** The product shown working: footage or a drawn loop, and two figures drawn as they move. */
export function InAction({ product }: { product: Product }) {
  const live = !useReducedMotion();
  const { visual, panels } = product.action;
  const section = useRef<HTMLElement>(null);

  // The range and speed drawings replay in step with the footage: each time the
  // video starts over, they draw again from empty, then hold until the next pass.
  useEffect(() => {
    const el = section.current;
    const video = el?.querySelector("video");
    if (!el || !video || !live) return;
    const replay = () => el.querySelectorAll<SVGAnimationElement>("animate[data-once]").forEach((a) => a.beginElement());
    let last = video.currentTime;
    let frame = 0;
    const watch = () => {
      // A loop shows up as the play head jumping back to the start.
      if (video.currentTime + 0.5 < last) replay();
      last = video.currentTime;
      frame = requestAnimationFrame(watch);
    };
    const start = () => {
      replay();
      last = video.currentTime;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(watch);
    };
    if (!video.paused && video.currentTime > 0) start();
    video.addEventListener("playing", start, { once: true });
    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener("playing", start);
    };
  }, [live]);

  return (
    <section ref={section} className={styles.section} aria-labelledby="action-heading">
      <h2 id="action-heading" className="display-m">
        In action
      </h2>
      <div className={styles.grid}>
        <div className={styles.visual}>
          <Visual visual={visual} live={live} />
        </div>
        <div className={styles.panels}>
          {panels.map((p, i) => (
            <Panel key={i} panel={p} live={live} />
          ))}
        </div>
      </div>
    </section>
  );
}
