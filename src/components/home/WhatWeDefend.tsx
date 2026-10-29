"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { whatWeDefend as copy } from "@/content/site";
import styles from "./WhatWeDefend.module.css";

type Where = { lat: number; lon: number; place: string; found: boolean };

const STYLE = "https://tiles.openfreemap.org/styles/dark";
const EMBER = "#FF5B1F";

/** A circle of radius `km` around a point, as a GeoJSON polygon (flat-earth is plenty at this size). */
function circle(lat: number, lon: number, km: number, steps = 160) {
  const dLat = km / 110.574;
  const dLon = km / (111.32 * Math.cos((lat * Math.PI) / 180));
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const a = (i / steps) * 2 * Math.PI;
    return [lon + dLon * Math.sin(a), lat + dLat * Math.cos(a)];
  });
  return { type: "Polygon" as const, coordinates: [pts] };
}

/** The diameter as a dimension line: west edge to east edge through the centre, with end ticks. */
function diameter(lat: number, lon: number, km: number) {
  const dLon = km / (111.32 * Math.cos((lat * Math.PI) / 180));
  const tick = (km * 0.07) / 110.574;
  const w = lon - dLon, e = lon + dLon;
  return {
    type: "MultiLineString" as const,
    coordinates: [
      [[w, lat], [e, lat]],
      [[w, lat - tick], [w, lat + tick]],
      [[e, lat - tick], [e, lat + tick]],
    ],
  };
}

/** The south-west and north-east corners of the square around the circle. */
function box(lat: number, lon: number, km: number): [[number, number], [number, number]] {
  const dLat = km / 110.574, dLon = km / (111.32 * Math.cos((lat * Math.PI) / 180));
  return [[lon - dLon, lat - dLat], [lon + dLon, lat + dLat]];
}

/** Room around the circle, and for the credit line along the bottom. */
const pad = () => (window.innerWidth <= 760 ? { top: 28, bottom: 36, left: 20, right: 20 } : { top: 48, bottom: 56, left: 48, right: 48 });

/** A 10 km circle around the visitor's own area, on a night map of it. */
export function WhatWeDefend() {
  const holder = useRef<HTMLDivElement>(null);
  const [where, setWhere] = useState<Where | null>(null);
  const [ready, setReady] = useState(false);

  // The location was asked for in <head> during the intro (where-script.ts); reuse
  // that answer, or ask now if this visit began on another page.
  useEffect(() => {
    let live = true;
    const asked = (window as unknown as { __ftiWhere?: Promise<{ found: boolean; lat?: number; lon?: number; place?: string }> }).__ftiWhere;
    (asked ??
      fetch("/api/where", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : { found: false }))
        .catch(() => ({ found: false }))
    )
      .then((d) => {
        if (!live) return;
        setWhere(d.found ? { lat: d.lat, lon: d.lon, place: d.place || "Your area", found: true } : { ...copy.example, found: false });
      });
    return () => {
      live = false;
    };
  }, []);

  // The map is built as soon as the location is known, during the intro, so its
  // tiles are loaded long before the visitor scrolls down to it.
  useEffect(() => {
    if (!where || !holder.current) return;
    let gone = false;
    let map: { remove: () => void } | null = null;
    let marker: { remove: () => void } | null = null;
    (async () => {
      const ml = await import("maplibre-gl");
      if (gone || !holder.current) return;
      // The worker ships as its own file (copied to public/vendor on install).
      ml.setWorkerUrl("/vendor/maplibre-gl-worker.mjs");
      const { lat, lon } = where;
      const m = new ml.Map({
        container: holder.current,
        style: STYLE,
        bounds: box(lat, lon, copy.radiusKm),
        fitBoundsOptions: { padding: pad() },
        interactive: false,
        attributionControl: { compact: true },
      });
      map = m;
      // The tile style names a few fill patterns (e.g. "wood-pattern") its sprite
      // doesn't include; a transparent stand-in keeps those fills plain and quiet.
      m.on("styleimagemissing", (e) => {
        if (!m.hasImage(e.id)) m.addImage(e.id, { width: 1, height: 1, data: new Uint8Array(4) });
      });
      m.on("load", () => {
        if (gone) return;
        // Into the site's night palette: ground and water.
        if (m.getLayer("background")) m.setPaintProperty("background", "background-color", "#0a0f16");
        if (m.getLayer("water")) m.setPaintProperty("water", "fill-color", "#0f1b28");
        m.addSource("area", { type: "geojson", data: { type: "Feature", properties: {}, geometry: circle(lat, lon, copy.radiusKm) } });
        m.addLayer({ id: "area-fill", type: "fill", source: "area", paint: { "fill-color": EMBER, "fill-opacity": 0.14 } });
        m.addLayer({ id: "area-line", type: "line", source: "area", paint: { "line-color": EMBER, "line-width": 2 } });
        m.addSource("diameter", { type: "geojson", data: { type: "Feature", properties: {}, geometry: diameter(lat, lon, copy.radiusKm) } });
        m.addLayer({ id: "diameter", type: "line", source: "diameter", paint: { "line-color": "#E4EAF0", "line-width": 1.75 } });
        // The measurement, sitting just above the middle of the line.
        const label = document.createElement("div");
        label.className = styles.measure;
        label.textContent = `${copy.radiusKm * 2} km`;
        marker = new ml.Marker({ element: label, anchor: "bottom", offset: [0, -8] }).setLngLat([lon, lat]).addTo(m);
        setReady(true);
      });
    })();
    return () => {
      gone = true;
      marker?.remove();
      map?.remove();
      setReady(false);
    };
  }, [where]);

  return (
    <section id="what-we-defend" className={styles.section} aria-labelledby="defend-heading">
      <div className={styles.header}>
        <h2 id="defend-heading" className={`display-l ${styles.title}`}>
          {copy.heading}
        </h2>
        <p className="muted lede">{copy.lede}</p>
      </div>

      <div className={styles.panel}>
        <div ref={holder} className={styles.map} role="img" aria-label={where ? `A map of ${where.place} with a circle 10 km across around it, its diameter marked.` : "A map, loading."} />
        {!ready && (
          <p className={`label ${styles.status}`} aria-live="polite">
            Locating
          </p>
        )}
      </div>

      <div className={styles.foot}>
        <p className={`label ${styles.place}`}>{where ? where.place : " "}</p>
        {where?.found && <p className={`muted ${styles.note}`}>{copy.note}</p>}
      </div>
    </section>
  );
}
