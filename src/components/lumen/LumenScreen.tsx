"use client";

import { useReducedMotion } from "motion/react";
import { useId } from "react";

/**
 * Lumen running in ATAK, drawn live: map on the left, the Lumen plugin panel on
 * the right. All data is illustrative (no real tracks, places or grid references).
 * Tracks drift, the selected threat pulses, and the engagement vector flows.
 */
export function LumenScreen({ className, compact = false }: { className?: string; compact?: boolean }) {
  const reduce = useReducedMotion();
  const live = !reduce && !compact;
  const mono = { fontFamily: "var(--font-mono)" };
  const clip = `lumen-map-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg
      viewBox="0 0 620 420"
      className={className}
      role="img"
      aria-label="Lumen inside ATAK: a map with three tracks on the left and the Lumen panel on the right, listing threats and a Hold to engage button. Illustrative data."
      fill="none"
    >
      <rect x="10" y="10" width="600" height="400" rx="28" fill="#0D1117" />
      <rect x="26" y="26" width="568" height="368" rx="12" fill="#18222E" />
      <clipPath id={clip}>
        <rect x="26" y="26" width="344" height="368" rx="12" />
      </clipPath>

      <g clipPath={`url(#${clip})`}>
        <g stroke="#fff" strokeOpacity="0.06">
          <path d="M26 98H370M26 170H370M26 242H370M26 314H370M112 26V394M198 26V394M284 26V394" />
        </g>
        <path d="M30 346 C 110 316, 170 356, 240 306 S 330 262, 370 272" stroke="#fff" strokeOpacity="0.11" strokeWidth="9" />
        <circle cx="186" cy="224" r="112" stroke="#fff" strokeOpacity="0.16" strokeDasharray="4 6" />
        <circle cx="186" cy="224" r="56" stroke="#fff" strokeOpacity="0.2" />
        {live && (
          <circle cx="186" cy="224" r="56" stroke="#fff" strokeOpacity="0.5" fill="none">
            <animate attributeName="r" from="10" to="118" dur="3.6s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" from="0.45" to="0" dur="3.6s" repeatCount="indefinite" />
          </circle>
        )}
        <rect x="180" y="218" width="12" height="12" rx="2" fill="#fff" />

        {/* Engagement vector to the selected threat. */}
        <path d="M186 224 Q 248 176 300 126" stroke="#FF5B1F" strokeWidth="1.5" strokeDasharray="3 4">
          {live && <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.9s" repeatCount="indefinite" />}
        </path>
        <g>
          {live && <animateTransform attributeName="transform" type="translate" values="0 0; -4 3; 0 0" dur="6s" repeatCount="indefinite" />}
          <circle cx="306" cy="120" r="15" stroke="#FF5B1F" strokeOpacity="0.6">
            {live && <animate attributeName="r" values="13;19;13" dur="1.8s" repeatCount="indefinite" />}
          </circle>
          <path d="M306 110l10 10-10 10-10-10z" fill="#FF5B1F" />
          <text x="246" y="96" fill="#FF5B1F" fontSize="9" letterSpacing="1" style={mono}>
            TRK-0882
          </text>
        </g>
        <g>
          {live && <animateTransform attributeName="transform" type="translate" values="0 0; 10 6; 0 0" dur="11s" repeatCount="indefinite" />}
          <path d="M108 128l7 7-7 7-7-7z" fill="#fff" fillOpacity="0.55" />
        </g>
        <g>
          {live && <animateTransform attributeName="transform" type="translate" values="0 0; -8 -5; 0 0" dur="9s" repeatCount="indefinite" />}
          <path d="M262 318l7 7-7 7-7-7z" fill="#fff" fillOpacity="0.55" />
        </g>

        <rect x="38" y="38" width="96" height="22" rx="4" fill="#0D1117" fillOpacity="0.85" />
        <circle cx="50" cy="49" r="3" fill="#7FD1FF" />
        <text x="60" y="52" fill="#fff" fontSize="9" letterSpacing="1" style={mono}>
          ALPHA-1
        </text>
        <g fill="#0D1117" fillOpacity="0.85">
          <rect x="296" y="38" width="20" height="20" rx="4" />
          <rect x="320" y="38" width="20" height="20" rx="4" />
          <rect x="344" y="38" width="20" height="20" rx="4" />
        </g>
        <g stroke="#fff" strokeOpacity="0.7" strokeWidth="1.2">
          <path d="M301 44h10M301 48h10M301 52h10" />
          <circle cx="330" cy="48" r="4.5" />
          <path d="M354 42v12M348 48h12" />
        </g>
        <text x="38" y="382" fill="#fff" fillOpacity="0.55" fontSize="9" letterSpacing="1" style={mono}>
          DEMO DATA · SIMULATED SITE
        </text>
      </g>

      {/* The Lumen plugin panel. */}
      <path d="M370 26 H582 A12 12 0 0 1 594 38 V382 A12 12 0 0 1 582 394 H370 Z" fill="#0F151C" />
      <path d="M370 26V394" stroke="#fff" strokeOpacity="0.1" />
      <path d="M386 39l6 6-6 6-6-6z" fill="#FF5B1F" />
      <text x="400" y="49" fill="#fff" fontSize="11" fontWeight="600" letterSpacing="2" style={mono}>
        LUMEN
      </text>
      <path d="M572 40l8 8M580 40l-8 8" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.2" />
      <path d="M370 62H594" stroke="#fff" strokeOpacity="0.08" />
      <text x="384" y="82" fill="#fff" fillOpacity="0.5" fontSize="9" letterSpacing="1.2" style={mono}>
        THREATS · 3
      </text>
      <rect x="378" y="90" width="208" height="26" rx="4" fill="#FF5B1F" fillOpacity="0.14" />
      <path d="M392 97l6 6-6 6-6-6z" fill="#FF5B1F" />
      <text x="404" y="107" fill="#fff" fontSize="10" letterSpacing="1" style={mono}>
        TRK-0882
      </text>
      <text x="530" y="107" fill="#FF5B1F" fontSize="9" fontWeight="600" letterSpacing="1" style={mono}>
        HOSTILE
      </text>
      <path d="M392 125l6 6-6 6-6-6z" fill="#fff" fillOpacity="0.55" />
      <text x="404" y="135" fill="#fff" fillOpacity="0.8" fontSize="10" letterSpacing="1" style={mono}>
        TRK-0874
      </text>
      <text x="530" y="135" fill="#fff" fillOpacity="0.55" fontSize="9" letterSpacing="1" style={mono}>
        SUSPECT
      </text>
      <path d="M392 153l6 6-6 6-6-6z" fill="#fff" fillOpacity="0.55" />
      <text x="404" y="163" fill="#fff" fillOpacity="0.8" fontSize="10" letterSpacing="1" style={mono}>
        TRK-0861
      </text>
      <text x="530" y="163" fill="#fff" fillOpacity="0.55" fontSize="9" letterSpacing="1" style={mono}>
        NEUTRAL
      </text>
      <path d="M378 180H586" stroke="#fff" strokeOpacity="0.08" />
      <text x="384" y="198" fill="#fff" fillOpacity="0.5" fontSize="9" letterSpacing="1.2" style={mono}>
        SELECTED
      </text>
      <text x="384" y="216" fill="#FF5B1F" fontSize="10" letterSpacing="1" style={mono}>
        GROUP 1 · HOSTILE
      </text>
      <g fill="#fff" fillOpacity="0.05">
        <rect x="378" y="226" width="64" height="44" rx="4" />
        <rect x="450" y="226" width="64" height="44" rx="4" />
        <rect x="522" y="226" width="64" height="44" rx="4" />
      </g>
      {[
        ["386", "1.2 KM", "RANGE"],
        ["458", "85 M", "ALT"],
        ["530", "18 M/S", "SPEED"],
      ].map(([x, v, l]) => (
        <g key={l}>
          <text x={x} y="246" fill="#fff" fontSize="12" letterSpacing="0.5" style={mono}>
            {v}
          </text>
          <text x={x} y="261" fill="#fff" fillOpacity="0.5" fontSize="8" letterSpacing="1" style={mono}>
            {l}
          </text>
        </g>
      ))}
      <text x="384" y="290" fill="#fff" fillOpacity="0.5" fontSize="8" letterSpacing="1" style={mono}>
        RECOMMENDED · BOLT
      </text>
      <rect x="378" y="296" width="208" height="4" rx="2" fill="#fff" fillOpacity="0.1" />
      <rect x="378" y="296" width="176" height="4" rx="2" fill="#fff" fillOpacity="0.75" />
      <rect x="378.5" y="314.5" width="99" height="29" rx="5" stroke="#fff" strokeOpacity="0.25" />
      <text x="404" y="333" fill="#fff" fontSize="10" letterSpacing="1.5" style={mono}>
        MONITOR
      </text>
      <rect x="486.5" y="314.5" width="99" height="29" rx="5" stroke="#fff" strokeOpacity="0.25" />
      <rect x="512" y="322" width="6" height="10" rx="3" stroke="#fff" strokeWidth="1.1" />
      <path d="M509 329a6 6 0 0012 0M515 335v2" stroke="#fff" strokeWidth="1.1" />
      <text x="528" y="333" fill="#fff" fontSize="10" letterSpacing="1.5" style={mono}>
        ASK
      </text>
      <rect x="378" y="350" width="208" height="32" rx="5" fill="#FF5B1F">
        {live && <animate attributeName="fill-opacity" values="1;0.82;1" dur="2.4s" repeatCount="indefinite" />}
      </rect>
      <text x="430" y="370" fill="#fff" fontSize="11" fontWeight="600" letterSpacing="1.8" style={mono}>
        HOLD TO ENGAGE
      </text>
    </svg>
  );
}
