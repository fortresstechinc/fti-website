"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { homeNav } from "@/content/site";
import styles from "./RailNav.module.css";

type Row = { label: string; href: string; index?: string; section: string };

// Each row tracks the home section it stands for; product rows track their
// spotlight. A row that leaves the page names the section it tracks.
const sectionOf = (href: string) => (href.startsWith("#") ? href.slice(1) : `spotlight-${href.slice(1)}`);
const toRow = (l: { label: string; href: string; index?: string; section?: string }): Row => ({
  ...l,
  section: l.section ?? sectionOf(l.href),
});

const COMPANY = homeNav.company.map(toRow);
const PRODUCTS = [toRow({ label: "Products", href: "#products" }), ...homeNav.products.map(toRow)];
const ABOUT = homeNav.about.map(toRow);
const ROWS = [...COMPANY, ...PRODUCTS, ...ABOUT];
const ABOUT_GROUNDS = ["var(--nav-3)", "var(--nav-4)", "var(--nav-5)"];

/** Rows the marker travels between: the first row for each section, in page order. */
const STOPS = ROWS.map((r, i) => ({ ...r, row: i })).filter((r, i, all) => all.findIndex((o) => o.section === r.section) === i);

/** Pointer distance from the right edge that opens the rail, in px. It stops
 *  short of the marker, so hovering the marker only previews. */
const EDGE = 12;
/** Open while the page is still at its very top, as the hero was designed. */
const TOP_OPEN = 0.15;

/**
 * The home page's right-edge navigation. At rest it is a thin strip of the
 * nav's own colours with a small marker that travels down it as the page
 * scrolls. Pushing the pointer to the right edge, tabbing into it, or tapping
 * the marker opens the full rail; hovering the marker (or a row, when open)
 * shows a preview of that section.
 */
export function RailNav() {
  const nav = useRef<HTMLElement>(null);
  const marker = useRef<HTMLButtonElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLAnchorElement | null)[]>([]);
  const geometry = useRef({ rowY: [] as number[] });
  const markerY = useRef(0);
  const hoverRow = useRef<number | null>(null);

  const [edge, setEdge] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tapped, setTapped] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [peek, setPeek] = useState(false);
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [wide, setWide] = useState(false);

  const engaged = edge || focused || tapped;
  // Only wide screens start open; on a phone the open rail would cover the hero.
  const open = engaged || (atTop && wide);
  const showPreview = engaged || peek;
  const shownRow = hovered ?? STOPS[current].row;

  const { scrollY } = useScroll();

  const place = () => {
    const y = hoverRow.current === null ? markerY.current : geometry.current.rowY[hoverRow.current];
    if (preview.current) preview.current.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) translateY(-50%)`;
    if (marker.current) marker.current.style.transform = `translate3d(0, ${markerY.current.toFixed(1)}px, 0) translateY(-50%)`;
  };

  const update = (y: number) => {
    const { rowY } = geometry.current;
    if (!rowY.length) return;
    const vh = window.innerHeight;
    // Section tops are read fresh each time: pinned tracks, the map and late
    // sections all move them after load, and a stale set lets the marker drift.
    const tops = STOPS.map((s) => {
      const el = document.getElementById(s.section);
      return el ? el.getBoundingClientRect().top + y : 0;
    });
    // The section under the middle of the screen is the one being read.
    const line = y + vh / 2;
    let i = 0;
    while (i < tops.length - 1 && line >= tops[i + 1]) i++;
    const next = Math.min(i + 1, tops.length - 1);
    // The marker holds on the section being read, and only glides to the next
    // row over the last half-screen before that section reaches mid-screen.
    const band = Math.min(vh / 2, tops[next] - tops[i]);
    const t = next === i || band <= 0 ? 0 : Math.min(1, Math.max(0, (line - (tops[next] - band)) / band));
    markerY.current = rowY[STOPS[i].row] + (rowY[STOPS[next].row] - rowY[STOPS[i].row]) * t;
    place();
    setCurrent((c) => (c === i ? c : i));
    const top = y < vh * TOP_OPEN;
    setAtTop((c) => (c === top ? c : top));
  };

  useMotionValueEvent(scrollY, "change", update);

  // Measure row centres; re-measure whenever the page reflows.
  useEffect(() => {
    const measure = () => {
      geometry.current = {
        rowY: rows.current.map((r) => (r ? r.getBoundingClientRect().top + r.offsetHeight / 2 : 0)),
      };
      update(window.scrollY);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fine pointers open the rail at the right edge and close it once they move clear.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onMove = (e: PointerEvent) => {
      if (!fine.matches) return;
      const w = document.documentElement.clientWidth;
      const navLeft = nav.current?.getBoundingClientRect().left ?? w;
      setEdge((was) => (was ? e.clientX >= navLeft - 24 : e.clientX >= w - EDGE));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1101px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // A tap outside closes a rail opened by tap.
  useEffect(() => {
    if (!tapped) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!nav.current?.contains(t) && !marker.current?.contains(t)) setTapped(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [tapped]);

  // The hero gives the open rail its own column on wide screens.
  useEffect(() => {
    document.documentElement.dataset.rail = open ? "open" : "closed";
  }, [open]);
  useEffect(() => () => void delete document.documentElement.dataset.rail, []);

  const hover = (i: number | null) => {
    hoverRow.current = i;
    setHovered(i);
    place();
  };

  const row = (r: Row, i: number, className = styles.row, style?: React.CSSProperties) => (
    <Link
      key={r.href + r.label}
      ref={(el) => void (rows.current[i] = el)}
      href={r.href}
      className={className}
      style={style}
      aria-current={STOPS[current].row === i ? "location" : undefined}
      onPointerEnter={() => hover(i)}
      onPointerLeave={() => hover(null)}
      onClick={() => setTapped(false)}
    >
      {r.index && <span className={styles.index}>{r.index}</span>}
      <span className={styles.label}>{r.label}</span>
    </Link>
  );

  return (
    <div data-rail className={styles.root} data-open={open ? "" : undefined} data-preview={showPreview ? "" : undefined}>
      <nav
        ref={nav}
        className={styles.rail}
        aria-label="Sections"
        onFocus={() => setFocused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false)}
        onClick={() => !open && setTapped(true)}
      >
        <div className={styles.group} style={{ background: "var(--nav-1)" }}>
          {COMPANY.map((r, i) => row(r, i))}
        </div>
        <div className={`${styles.group} ${styles.grow}`} style={{ background: "var(--nav-2)" }}>
          {PRODUCTS.map((r, i) => row(r, COMPANY.length + i))}
        </div>
        <div className={styles.group}>
          {ABOUT.map((r, i) => row(r, COMPANY.length + PRODUCTS.length + i, `${styles.row} ${styles.dark}`, { background: ABOUT_GROUNDS[i] }))}
        </div>
      </nav>

      <button
        ref={marker}
        type="button"
        className={styles.marker}
        aria-label={`You are at ${ROWS[STOPS[current].row].label}. Open section navigation`}
        aria-expanded={open}
        onPointerEnter={() => setPeek(true)}
        onPointerLeave={() => setPeek(false)}
        onClick={() => setTapped((t) => !t)}
      >
        <span className={styles.arrow} />
      </button>

      <div ref={preview} className={styles.preview} aria-hidden="true">
        {ROWS.map((r, i) =>
          STOPS.some((s) => s.row === i) ? (
            // eslint-disable-next-line @next/next/no-img-element
            // Rows that share a section (Products and Comparison) share a preview.
            <img key={i} src={`/nav/${r.section}.webp`} alt="" width={128} height={80} data-on={ROWS[shownRow].section === r.section ? "" : undefined} />
          ) : null,
        )}
        <span className={styles.caption}>{ROWS[shownRow].label}</span>
      </div>
    </div>
  );
}
