---
name: FTI
description: The low sky at dawn, defended. An airy editorial site where a drawn dawn sky and the real hardware do the persuading.
colors:
  sky-1: "#e8edf1"
  sky-2: "#eef1f2"
  dawn: "#f4eee6"
  sage: "#eef1ec"
  ink: "#0d1117"
  slate: "#56606b"
  ink-80: "rgb(13 17 23 / 0.8)"
  ink-60: "rgb(13 17 23 / 0.62)"
  hair: "rgb(13 17 23 / 0.12)"
  hair-strong: "rgb(13 17 23 / 0.2)"
  night: "#0a0f16"
  night-2: "#121a24"
  dusk: "#2b3a4a"
  on-night: "#ffffff"
  on-night-70: "rgb(255 255 255 / 0.68)"
  on-night-55: "rgb(255 255 255 / 0.55)"
  hair-night: "rgb(255 255 255 / 0.14)"
  ember: "#ff5b1f"
  ember-ink: "#b8400f"
  ember-on-night: "#ff7a45"
  peach-1: "#f7ede2"
  peach-2: "#e6cdb4"
  fog-1: "#e4ebf0"
  fog-2: "#b6c4d0"
  mist-1: "#eef1f3"
  mist-2: "#c9d0d7"
  nav-1: "#e9d9c8"
  nav-2: "#c9d3db"
  nav-3: "#6e7c89"
  nav-4: "#3e4a56"
  nav-5: "#232c36"
typography:
  display-hero:
    fontFamily: "Newsreader, Times New Roman, serif"
    fontSize: "clamp(88px, 13.5vw, 200px)"
    fontWeight: 300
    lineHeight: 0.86
    letterSpacing: "-0.045em"
  display-xl:
    fontFamily: "Newsreader, Times New Roman, serif"
    fontSize: "clamp(64px, 9.6vw, 144px)"
    fontWeight: 300
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  display-l:
    fontFamily: "Newsreader, Times New Roman, serif"
    fontSize: "clamp(48px, 6.2vw, 88px)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.03em"
  display-m:
    fontFamily: "Newsreader, Times New Roman, serif"
    fontSize: "clamp(36px, 4.6vw, 64px)"
    fontWeight: 300
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Newsreader, Times New Roman, serif"
    fontSize: "36px"
    fontWeight: 300
    lineHeight: "40px"
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Newsreader, Times New Roman, serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: "30px"
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(17px, 1.4vw, 20px)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  body-small:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "23px"
  label:
    fontFamily: "B612 Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
    fontFeature: "tnum"
  label-button:
    fontFamily: "B612 Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded:
  chip: "4px"
  control: "6px"
  card: "10px"
  panel: "14px"
spacing:
  inset: "10px"
  gutter: "clamp(20px, 4.4vw, 64px)"
  row: "16px"
  grid: "32px"
  block: "72px"
  section: "clamp(120px, 12vw, 160px)"
components:
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-night}"
    typography: "{typography.label-button}"
    rounded: "{rounded.control}"
    padding: "6px 6px 6px 18px"
  button-dark-hover:
    backgroundColor: "#1d2530"
  button-light:
    backgroundColor: "{colors.on-night}"
    textColor: "{colors.ink}"
    typography: "{typography.label-button}"
    rounded: "{rounded.control}"
    padding: "6px 6px 6px 18px"
  button-light-hover:
    backgroundColor: "{colors.sky-1}"
  button-arrow-chip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-night}"
    rounded: "{rounded.chip}"
    size: "30px"
  button-arrow-chip-live:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.on-night}"
    rounded: "{rounded.chip}"
    size: "30px"
  segmented-switch:
    backgroundColor: "{colors.on-night}"
    textColor: "{colors.ink-60}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "4px"
  segmented-switch-item-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-night}"
    rounded: "{rounded.chip}"
    padding: "9px 16px"
  side-nav-row:
    textColor: "{colors.ink}"
    padding: "19px 16px"
  inset-panel:
    backgroundColor: "{colors.night}"
    textColor: "{colors.on-night}"
    rounded: "{rounded.panel}"
    padding: "clamp(56px, 6vw, 72px) clamp(20px, 4.4vw, 64px)"
  spec-row:
    textColor: "{colors.slate}"
    typography: "{typography.label}"
    padding: "15px 0"
  data-card:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-night}"
    rounded: "{rounded.card}"
    width: "440px"
---

# Design System: FTI

## Overview

**Creative North Star: "The Low Sky at Dawn, Defended"**

The site is a pre-dawn sky held in place: a fixed four-stop gradient ground from cool sky to warm dawn to sage, with the content set into it as rounded panels inset 10px from the viewport edge. Light grounds carry long editorial passages in Newsreader Light; night panels carry the system's operational moments (How it works, the contact footer, BOLT's spotlight). The drawn dawn sky of the home hero and the real hardware, rendered as matte-black 3D objects on calm gradient grounds, do the persuading. Typography and space do the rest.

Density is low and the rhythm is generous: sections breathe on 120 to 200px of vertical padding, headlines are short and balanced, and data lives in hairline rows set in uppercase B612 Mono. Motion is scroll-linked and eased with one long-tail curve, never springy in feel. Things rise, sharpen, turn and fly as the reader moves.

The world refuses the category default of dark tactical HUD pages with neon glows and stock-soldier photography. The HUD vocabulary appears only as thin ember overlays: on the home hero's illustrative engagement over the drawn sky, and in the drawn Lumen interface, where it is the product.

**Key Characteristics:**
- A fixed sky-to-dawn gradient ground with 14px-radius panels inset 10px from the viewport.
- Newsreader Light display with tight negative tracking; Geist body; B612 Mono uppercase labels.
- One ember, reserved for live signals.
- White or ink buttons that end in a square arrow chip.
- One shared WebGL canvas rendering black, finish-accurate product models under a dawn studio; only the home hero runs its own canvas, for the drawn sky and the engagement.
- Scroll-linked motion on a single ease-out curve, with a complete reduced-motion path to final states.

## Colors

A cool-to-warm daylight palette of near-white skies, blue-black ink and night, with a single hot ember that only ever means something is happening.

### Primary
- **Ember** (`ember`): the one live signal. The engaged tracks' brackets and the dashed intercept trajectories in the home hero's illustrative engagement, the drone's track bracket, approve control and hit in the How it works scene, the hostile track and engage control in the Lumen screen, the arrow chip of the one primary action in a view (`live`), the focus ring, the text caret and the selection highlight.
- **Ember Ink** (`ember-ink`): the darker ember for small text on light grounds, where the full ember fails contrast.
- **Ember on Night** (`ember-on-night`): the lifted ember for small text and badges on night panels (live tags, hostile readouts, the hero's engaged track labels and active step). Used as a literal in five places; it has no custom property yet.

### Neutral
- **Pre-dawn Sky** (`sky-1`, `sky-2`), **Dawn** (`dawn`), **Sage** (`sage`): the page ground, painted as one fixed gradient at 0%, 30%, 72% and 100%. `sky-2` is also the solid fallback, the scrollbar track and the meta theme colour is `sky-1`.
- **Ink** (`ink`): all text on light grounds, dark buttons, chips and the active tab.
- **Slate** (`slate`): secondary prose (`.muted`), spec values, row labels.
- **Ink tints** (`ink-80`, `ink-60`): stat labels and resting nav links.
- **Hairlines** (`hair`, `hair-strong`): 1px rules for spec rows, nav rows and feature lists. `hair-strong` marks list tops and the vertical rule under the threat lines.
- **Night** (`night`), **Night 2** (`night-2`), **Dusk** (`dusk`): night panels, painted as a radial gradient rising from dusk at the bottom edge into night.
- **On-night whites** (`on-night`, `on-night-70`, `on-night-55`, `hair-night`): text, secondary text, labels and rules on night panels. The contact headline steps down through 100%, 55% and 35% white.

### Product grounds
Each product owns a calm vertical gradient (top, a fixed mid stop at 60%, bottom): Lumen on **Peach** (`peach-1` to `peach-2`), Anchor on **Fog** (`fog-1` to `fog-2`), FIST on **Mist** (`mist-1` to `mist-2`), and BOLT on **Night** (a radial from #3a4a5a through #16202b to `night`). The ground follows the product everywhere it appears: hero, spotlight, comparison tile and loop card.

### Side nav
`nav-1` to `nav-5` run dawn to night down the home page's rail: a peach block, a blue-grey block, then three progressively darker solid rows. Collapsed, the same colours form the 6px strip on the right edge.

### Named Rules
**The One Ember Rule.** Ember means live: a track, a lock, a trajectory, an engagement, or the single primary action in a view. Never use it for decoration, emphasis, status that is not live, or brand colour.

**The Ground Follows the Product Rule.** A product's gradient ground travels with it to every surface where it appears. Never put a product on another product's ground.

## Typography

**Display Font:** Newsreader, weight 300 (Times New Roman, serif fallback)
**Body Font:** Geist (system-ui fallback)
**Label/Mono Font:** B612 Mono (ui-monospace fallback). Drawn for Airbus cockpit displays; chosen 2026-10-28 to replace Geist Mono, whose developer-tool look read as generic. It runs wider than Geist Mono, so label tracking was tightened to 0.1em (0.08em on buttons and small chips). It ships in 400 and 700 only, so a 500 weight renders as 400.

**Character:** A light, slightly literary serif set very large and very tight carries the voice. A neutral grotesk carries the explanation, and a tracked mono carries the evidence: specs, tags and controls.

### Hierarchy
- **Display hero** (300, clamp 88 to 200px, 0.86, -0.045em): product names on product heroes. The home hero headline sits between this and display-xl (clamp 56 to 128px, 0.94, -0.035em, set in white over the drawn sky with no text-shadow).
- **Display XL** (300, clamp 64 to 144px, 0.92, -0.04em): product names in home spotlights.
- **Display L** (300, clamp 48 to 88px, 1, -0.03em): section headlines, kept to a few words with a `ch` max-width so they break into two or three balanced lines.
- **Display M** (300, clamp 36 to 64px, 1.04, -0.025em): secondary section headlines on product pages.
- **Headline** (300, 36px/40px, -0.02em): comparison product names. Stat values use the same face at 40px/44px.
- **Title** (400, 24px/30px): feature-item titles in serif.
- **Lede** (Geist 400, clamp 17 to 20px, 1.5): the paragraph beside a headline, capped at 380 to 420px.
- **Body** (Geist 400, 17px, 1.55): default text. **Body small** (15px/23px) for list bodies and footer columns.
- **Label** (B612 Mono 400, 12px, 0.1em, uppercase, tabular numerals): spec keys and values, stat captions, footer column heads, step tags, figure captions. Spec values run at 0.08em.

### Named Rules
**The Light Serif Rule.** Display type is Newsreader at 300 with negative tracking, always `text-wrap: balance`. Never bold a headline; emphasis comes from size and white-alpha steps.

**The Mono Means Data Rule.** B612 Mono uppercase is for data, controls and captions. It never sits above a headline as a kicker.

## Layout

The page is a vertical stack of full-bleed sections and inset panels over a fixed gradient ground. Panels sit 10px (`inset`) from the viewport on three sides, so the sky shows as a thin frame around them. Content inside panels and sections uses a fluid side gutter (`gutter`, 20 to 64px).

- **Section rhythm:** 120 to 160px vertical padding (`section`), up to 200px around the threat statement. Header-to-content gaps are 56 to 72px; at the largest scale, 72 to 120px.
- **Header pattern:** headline left, lede right, aligned to the bottom or top edge and wrapping on narrow screens.
- **Grids:** feature lists are 4-up at 24px gaps (2-up at 1000px, 1-up at 560px). Loop cards are 3-up at 16px gaps. Footer columns are 2fr plus four 1fr at 32px.
- **What we defend:** below How it works, with the Comparison header pattern (Display L title left, lede right: "One FTI site defends all of this. A circle ten kilometres across, watched by its sensors and held by its interceptors, all run from one Anchor."). One 16:9 night panel (square on phones, max 78vh) holds a static MapLibre map of the visitor's own area on OpenFreeMap's dark style, ground set to night and water to #0f1b28, framed to a single 10 km circle (5 km radius) in ember with a 14% fill and 2px line, centred on the visitor's approximate location, its diameter drawn as a white 1.75px dimension line from edge to edge with end ticks and a "10 km" mono chip just above its middle. Nothing else is drawn on the map: no site marker or product ranges. The attribution stays, in the site's type. Under the map, the city in a mono label and, for a placed visitor only, the privacy note. Location comes from `/api/where`, which reads Vercel's IP geolocation headers, rounds to two decimals and stores nothing; without them (local development, or an unplaced connection) the map quietly shows Washington, DC, named like any other place. The map loads during the intro, not on scroll: a head script (`where-script.ts`) requests the location while the HTML parses, the page preconnects to the tile server, and the map is built as soon as the location arrives, so on a typical machine it is drawn within about 1 to 2.5s of arrival, before the intro ends. MapLibre's worker is copied to `public/vendor` on install.
- **Comparison:** one table holds both the product heads (card, name, tagline) and four short rows (Role, Performance, Weight, Deploys), so each value sits under its product by construction: a 130px label column and four equal product columns with 16px between, 992px minimum. Below that width it scrolls sideways inside the gutter.
- **Home hero:** a 420vh section (340vh at 767px and below) with a sticky 100svh stage. The first 75% of its scroll plays the engagement; from 78% it hands over to the page. The panel takes the flexible width; on wide screens the open rail takes a 200px column to its right (the sticky stage's right padding eases between 10px and 220px). The scene canvas and HUD keep the full rail-closed width and the panel clips them, so the canvas never resizes while the rail moves.
- **Product hero:** a 190vh section (160vh at 900px and below) with a sticky grid of nav, title row, stage and switcher, at a 680px minimum height.
- **Breakpoints:** 1100 (the rail stops taking a column and floats over the page instead; previews off), 1000 (spotlight and grid stack), 900 (top-nav links off, product sections single-column), 767 (home hero mobile: shorter scroll, compact HUD labels), 560 and 520 (switcher glyphs off).

**The Inset Frame Rule.** A full-width panel never touches the viewport. It sits `inset` from the edges with `panel` radius, so the sky always frames it.

## Elevation & Depth

Depth comes mainly from grounds, not shadows: night panels set against the light sky, radial dusk glows rising from a panel's bottom edge, gradient product grounds, and real 3D models with contact shadows. Shadows are few, soft, and always pulled in with a strong negative spread, so they read as a lift rather than an outline.

### Shadow Vocabulary
- **Button lift** (`0 8px 24px -12px rgb(10 15 22 / 0.45)`): the white button only, so it separates from the hero sky and night.
- **Floating control** (`0 10px 30px -18px rgb(10 15 22 / 0.5)`): the product switcher, floating over the hero stage.
- **Device drop** (`0 40px 80px -40px rgb(0 0 0 / 0.8)`, or a `drop-shadow(0 40px 60px rgb(13 17 23 / 0.28))` filter for the Lumen screen): illustrated product interfaces.

### Named Rules
**The Ground Before Shadow Rule.** Separate surfaces with a change of ground first. Add a shadow only to an object that floats over the hero sky, a model or a night panel.

## Shapes

The form language is soft rectangles with a strict radius ladder: 14px for panels and the open rail, 10px for device and data cards, 6px for buttons, inputs, tabs, tiles and image wells, and 4px for chips, tab indicators and badges. Circles are for nodes and status dots only. Rules are 1px hairlines; there are no heavy borders. The arrow chip is the system's recurring silhouette: a 30px rounded square (40px on loop cards) holding a 14px arrow, nudged 3px right on hover.

## Components

### Buttons
Mono, uppercase, and they end in a square arrow chip.
- **Shape:** a rounded rectangle (6px), with the chip at 4px. The contract calls these pills; the build ships them at the control radius.
- **Dark:** an ink fill with white text and a white chip holding an ink arrow; padding 6px 6px 6px 18px, a 14px gap, 13px B612 Mono at 0.08em. Used on light grounds.
- **Light:** a white fill with ink text, an ink chip and the button-lift shadow. Used over the hero sky and on night panels.
- **Live:** either tone with the chip painted ember. Reserved for the one primary action in a view (Contact us).
- **Hover / Focus:** background, colour and shadow ease over 0.35s, and the chip slides 3px right over 0.45s. Dark hovers to #1d2530; light hovers to `sky-1`. Focus is the global 2px ember outline at a 3px offset.
- **Text contact:** the top-nav Contact is a plain 6px ink (or white on night) block at 10px 16px with no chip.

### Segmented switch
- **Style:** a white tray with a 1px `hair` border, 6px radius and 4px padding, holding 4px-radius label items.
- **State:** the product switcher marks the active item with a 7% ink wash and lifts hovered items to 4%.

### Cards / Containers
- **Inset panel:** 14px radius, inset 10px, night radial or product-ground fill, 48 to 72px vertical padding and gutter sides.
- **Product tile:** a 6px-radius image well on the product's ground, holding a turntable model or the compact Lumen screen. It lifts 4px on hover over 0.6s, with the name in headline serif below.
- **Feature item:** no box. A `hair-strong` top rule, 24px top padding, a serif title and a muted body.

### Spec rows
- **Style:** a `dl` of label-typed rows, key left and value right in slate at 0.08em, 15px vertical padding and `hair` rules top and bottom. On night panels, rules use 6% white.
- **Stats:** measured figures only (for example Mach 0.5, 2 km, 240 km/h, 25 km, under a minute). The label sits below a 40px Newsreader value, with a 20% ink (or white) top rule. A product with no confirmed figure shows no stat row; words never stand in for numbers.

### Navigation
- **How it works (night panel):** one section in place of the old Capabilities tabs and kill chain. A night panel (the dusk radial gradient, inset 10px, 14px radius) overlaps the threat section by 70vh and rises over its closing line, entering at 0.94 scale with a 32px radius and settling to 1 and 14px; it then pins in a 320vh track (300vh on phones) while the scroll walks its four stages (each hand-over takes the middle 60% of its stretch, spring-smoothed: stiffness 120, damping 30, mass 0.4). It holds the heading "One system, sensor to shot" and one simple scene drawn in the product illustrations' line style (white 1.6px strokes over #18222e fills): a quadcopter in the sky, and along a ground line a radar on its tripod, the Anchor (ammo-can-shaped, corner bumpers, lid dome, fins, antenna), the operator's rugged tablet and BOLT's launch box. One label system only: each part's name sits under it on the ground line in mono (13px, 11px on phones), the lit one white and the rest on-night-55, and the names are buttons that walk to their stage. Beneath, one caption travels to the lit part (clamped between 17% and 83%): a Newsreader title (clamp 30 to 42px) and one sentence in on-night-70, fading through at each midpoint. Steps: Detect, "A sensor spots the drone."; Track, "The Anchor turns it into one clear track."; Approve, "An operator approves on the tablet."; Intercept, "BOLT or FIST takes it down." The lit part is full strength and the rest sit at 38%. Each stage draws only its own link, dashed and flowing (the radar's beam to the drone, then the ground link to the Anchor, then to the tablet, then to the launcher and the ember intercept arc); links already walked stay at 18% and links ahead are hidden. Ember marks only what has happened: the drone's track bracket and the track diamond on the Anchor and tablet from Track on, the tablet's Approve bar from Approve on (with a tap ripple), and the intercept arc and strike at Intercept. On phones the drawing renders 1.8x larger in a clipped window that pans with the scroll, the drone placed so it stays in frame at every stage, and the caption stays centred.
- **Threat sequence (home, after the hero):** one audience at a time, in one fluid pass: a 290vh track (250vh at 767px and below) pins a 100svh stage, and a single continuous index (each hand-over takes the middle 70% of its stretch, spring-smoothed: stiffness 120, damping 30, mass 0.4) drives both the line and the photo, so they move together. One Newsreader Light line (clamp 28 to 50px) sits above a large photo; the lines stack in one place, the incoming one rising 48px into place and the outgoing one growing up to 14% (5% on phones) as it fades, each gone before the midpoint so they never overlap. The photos hang on a curved gallery, a wheel whose centre is below the stage (radius `max(2000px, 150vw)`, 900px on phones) with cards 40 degrees apart, so neighbours rest off-screen. Each hand-over turns it counter-clockwise: the old photo swings out along the arc to the left as the new one swings in from the right. A card is a mono ink chip naming the group (4px radius) over the photo at 6px radius with a soft drop, `min(70vw, 1080px, 108vh)` wide at 16:9, and 88vw square on phones. Reduced motion steps between audiences without turning or moving the lines.
- **Product pages:** one template, five parts, and each fact appears once. (1) The hero: name, a one-line lede (tagline plus what the product is) and the 3D model or Lumen screen. (2) A product walkthrough, headed by the product's tagline (the same line under its comparison card: "The whole fight at a glance", "Agentic C2 you can carry", "Dumb, cheap, and deadly", "Stop them farther out"): the How it works night panel (rising at 0.94 scale, pinned 240vh, 225vh on phones) holding one illustration per stage instead of a diagram. The illustrations are vector line art generated in Paper (page "Product illustrations", QuiverAI Arrow Telos) to one brief: isometric three-quarter view, off-white 2px lines over flat slate fills (#1b2633, #2b3a4a), no text, and one ember accent per picture on the thing that matters in that stage (the approve tap, the exhaust, the hit, the tracked threat, the lit GPU). Each page shows only what is unique to its product, never the home page's detect-to-defeat chain, with one clear subject per picture and each device drawn to match the real product. Lumen, the interface to the whole system, drawn around one rugged tablet that stays identical in all three: a radar on a tripod linked to the tablet by one dashed line; the tablet map with tracks marked hostile (ember diamonds), unknown (gray circles) and friendly (blue #4c8dff squares, the only place blue appears); an over-the-shoulder tap on Approve. Continuity comes from generating each picture as a Quiver edit (quiver-arrow-edit-telos) with the earlier picture as its reference node. Anchor, the lightweight C2 node, drawn from the 3D model (corner bumpers, lid dome, heat-sink fins, side grooves, end button, whip antenna, no handle) at ammo-can size and identical in all three: beside a .50 cal M2A1 ammo can (11.75 × 6 × 7.5 in) drawn to scale against the model's 26.4 × 14 × 12.5 cm (assembled by hand from a generated can and the Endure drawing, because the generator refused every edit that added a second object; the assembled SVG in media/illustrations is the source), ember on the end button; under an ember dotted arc from a sun to a moon, a full day and night (up to 24 hours; the sun, moon and arc are drawn by hand over the generated Anchor); the lid lifted off over one board with the chip lit. BOLT, cheap and fired in mass, the round traced from the 3D model and the box from the launch video (a tall square column, flat top, vent arch at the base): the round alone, with an ember band behind the nose; the box alone with three ember radio-wave arcs off its top corner (fired remotely over radio, never by a person); the same round leaving the same box on an ember exhaust under a dotted guidance line (assembled by hand from the first two, with the band turned slate so the exhaust is the one ember). FIST, the drone with reach, drawn directly from the 3D model (each part projected and filled in the set's slate, because the generator refused every FIST drawing): the drone in level flight with a long ember dotted trail; FPV goggles and an AI chip with an ember core, split by a thin slash, the two ways to fly it (FPV pilot or Lumen autonomy; the tag keeps "Lumen autonomy in development"); the same drone tipped into a dive with ember target brackets ahead of its nose. They stack in one 16:10 window (4:3 on phones, clamp 200px to 500px tall by 42vh) and cross-fade with the scroll (opacity 1 − 2|offset|, a 4% scale drift). Beneath them a three-column step row names every stage at once: a 2px progress segment per step that fills with the scroll, a mono "01" count with the tag in ember-on-night, a Newsreader title (clamp 26 to 36px) and one sentence; the current step is white, the rest on-night-55, and each step scrolls to its stage. On phones the row keeps counts and titles and the current sentence sits centred beneath. Paper exports go in media/illustrations/ and `npm run prepare:illustrations` strips their night background, crops them to the drawing and lifts any dark line work to #E4EAF0 into public/illustrations/<product>-<n>.svg. (3) In action: a Display M heading over a 9:16 portrait visual, sized by height (clamp 520 to 780px by 80vh) so the whole frame fits the screen, beside two stacked figure panels that fill the rest of the row at the same height, 12px apart; below 900px it stacks with the frame centred at up to 440px wide. The visual is FTI's own iPhone footage where it exists (BOLT firing, FIST climbing away: portrait so the landscape stays in view, silent, looping, autoplaying, with a first-frame poster; the exports are stored 1080 square with a 9:16 pixel aspect and prepare:media rescales them to true 540 × 960) or a drawn loop on night (Lumen: tracks appear, are sorted hostile, unknown and friendly, one is bracketed, approved and given an ember intercept line; Anchor: an ember arc runs a 24-hour dial with a sun turning to a moon at its head, "24 h" at the centre and "Up to 24 hours on battery" beneath; both loops are drawn for the same 9:16 frame). Each panel is a night ground with one small moving line drawing above a Newsreader figure (clamp 36 to 56px) and a 14px on-night-70 caption: BOLT 2 km range ring and Mach 0.5 across a 0–2 km scale (≈ 12 s); FIST 25 km ring with BOLT's 2 km ring to scale inside and 240 km/h across 0–25 km (≈ 6 min); Lumen sensors flowing into one node and out to BOLT and FIST, and a stopwatch stopping short of 60 s ("Under 1 min"); Anchor's white partner panel with the FTI mark and the NVIDIA Inception badge as supplied, and 50 track marks lighting in turn. No product stills. The range and speed drawings on BOLT and FIST replay in step with the footage: each time the 8 s video loops, the ring draws round over 2.4s and the mark crosses its scale over 2.8s, then both hold until the next pass; the Lumen and Anchor figures loop. Reduced motion shows every drawing at its finished state and the footage paused with controls. Coordinates are rounded so server and browser markup match. (4) Specifications: Display M heading and the Request full specs control on the left; headline figures in Newsreader Light (clamp 36 to 48px) over a hair-strong rule, then the spec sheet rows. (5) Close the loop. BOLT and FIST share one set of figures (Top speed, Range, Flight time, Weight) and one set of spec rows (Type, Launch, Deploy, Guidance, Datalink, GPS, Targets, Authorisation, Defeat method, Time to launch), so the two effectors read side by side. Unconfirmed figures and rows carry estimates flagged `guess: true` in the content until FTI confirms them; guesses never reach the home page. A fact left `null` still shows as a dashed hair-strong chip reading "To upload" in ink-60 mono.
- **Launch pacing (BOLT and FIST heroes):** their heroes pin for 235vh (190vh on phones) where the Anchor and Lumen take 190vh (160vh), so the launch takes half as much scroll again, and the model eases after the scroll with a short lag (about 0.3s to settle) instead of snapping to it.
- **BOLT hero (product page):** the whole launch is scroll-driven. The round starts fully inside its tube, rises over the first 38% of the hero scroll until its tail clears the mouth, then tips about 56° onto its flight path from 42%. Its fins stay deployed throughout: they sit on the diagonals and span 0.308 square, so the round holds its roll while in the tube and passes through the tube's 0.33 mouth, then starts rolling with the scroll once it is out. The tube is 0.36 wide by 1.7 tall with thin walls and a 0.012 corner radius. A clipping plane at the mouth, kept in the tube's frame so it follows a drag, hides whatever is still inside; it drops away once the round tips over.
- **Product hero name:** as the pinned hero scrolls, the display name scales from 1 to 0.56 about its top-left corner over the first 60% of the scroll, so it shrinks toward a title and never rises into the header. The title row keeps `clamp(40px, 7vh, 72px)` clear above it.
- **Product hero sizing and light:** every product fills a similar share of its hero stage, about half its height. Hero cameras sit at z 6.8 (BOLT), 4.3 (FIST) and 3.75 (Anchor). On the night ground (BOLT), raking side lights (cool from the left, warm from the right), stronger environment panels and a soft dusk radial glow behind the stage keep matte black legible.
- **Lumen tablet in its home spotlight:** `min(400px, 38%)` wide (72% on phones), centred in the stage, about the footprint of the 3D products in the neighbouring spotlights. On the Lumen product page it stays large: `min(720px, 62vw, 120vh)` (94vw at 900px and below).
- **Rail (home page, after seasats):** one fixed element that morphs between a 6px strip (right 4px, 3px radius) and the 200px open nav (right 10px, 14px radius) over 0.6s ease-out; only the row words fade, so the strip keeps the nav's colours. Rows are 14px Geist at 19px 16px with mono index numerals; hover indents to 22px with a 22% white wash, dark rows brighten, and the current section's label is underlined. It opens when the page is at its very top on wide screens, when a fine pointer reaches the last 12px of the viewport (and stays open until it moves 24px clear of the rail), when focus enters it, or on a tap of the marker; a tap outside closes a tapped rail. The marker is a 5 by 7px white arrow with difference blending, travelling down the rail as a reading line moves through the page (from the viewport top to its bottom over the scroll), interpolating between the rows of consecutive sections. Hovering the marker, or opening the rail, shows a 128 by 80px preview (6px radius, night ground, hairline ring, soft drop) beside the marker; hovering a row moves it to that row. Previews are captured screenshots in `public/nav`, captioned with a mono chip. The native scrollbar is hidden wherever the rail is present.
- **Top nav (product pages):** logo, centred 60%-ink links to the home sections in page order (Who it's for, How it works, What we defend, Products, Careers; the threat section is labelled "Who it's for" because the segments it names are never presented as customers) that turn full ink on hover, and the Contact block. On night grounds it uses white-55 links and a white Contact. Links never wrap; below 1280px the logo and Contact slots shrink to their contents to make room, and below 960px the links hide.

### Scrolling

- **Smooth scroll:** Lenis drives the page (lerp 0.11, wheel 0.95), off for reduced motion. Same-page links (the side-rail rows, Skip to content) are handled by Lenis's anchor option and glide to their section over 1.4s; they work from anywhere, including mid-animation and when the address already carries that hash.
- **Page entry:** product pages always open at their top, however they are reached (a link, Back or Forward, or a reload); `PageTop` turns off the browser's scroll restoration there and resets Lenis too. The home page keeps the browser's restoration, so Back to it returns the visitor to where they were.

### Intro

- **Intro (first page of a visit):** a fixed white screen (z 1000) with the black FTI mark centred (clamp 96 to 136px wide). The mark rises into view through an unseen horizon at its own bottom edge (an overflow-hidden box; translateY 105% to 0 over 1.1s from 0.2s), holds, then fades up 14px from 1.8s while the white lifts away like a blind (clip-path inset from the bottom, 0.75s from 1.85s), uncovering the page from below. 2.6s in all, pure CSS so it paints with the HTML. A head script stamps the visit in sessionStorage, so reloads and in-site navigation skip it (`html[data-intro="seen"]`), and smooth scroll is paused while it plays. Reduced motion keeps the hold and cuts instead of lifting.

### Home hero (signature)
The home hero runs its own R3F canvas (fov 38, DPR capped at 1.4), apart from the shared product canvas. A shader paints the Paper sky gradient, warming as the reader scrolls, behind four shader cumulus banks: noise scaled to each plane's proportions, a gentle domain warp, a warm lit crown over a cool shadowed underside, and haze with distance. Ink delta-wing and quadcopter silhouettes climb out of the banks, and two interceptors fly quadratic curves from launchers at the defended site: the BOLT model leaves its tube vertically, pitches over and hits the second track from the left (a suspect quadcopter), and the FIST model climbs a shallower arc to the suspect delta wing. BOLT carries a soft additive motor glow, and each hit makes a brief additive flash. A static CSS gradient of the same sky stands in while the scene loads; a low night scrim and an 8% grain sit over it.
- **HUD overlay:** DOM, placed every frame from projected 3D positions. Bracket corners draw from a `--c` variable: white at rest, ember on the two engaged tracks. On phones the neutral tracks keep their brackets but drop their labels. Mono track labels sit on a 58% night plate at 4px radius and flip to the bracket's left near the right edge. The site marker carries faint elliptical range rings, and each trajectory is a 1.5px ember dash.
- **Sequence:** spring-smoothed scroll progress (stiffness 90, damping 26, mass 0.5) runs headline out, detect, classify, approve, both trajectories, then launch. BOLT hits first (0.84) and FIST second (0.9); each track reads Cleared and falls back into the clouds. Every track starts below the frame and stays hidden until its climb begins, so the opening frame is sky and cloud only.
- **Hand-over:** the HUD, scrim, grain, mark and CTA fade first, and the remaining tracks climb out of frame. The sky shader brightens into the page's own body gradient from the horizon upward, and the cloud banks whiten and thin away. Last, a viewport-fixed copy of the body gradient settles over the whole sticky frame, so the panel's edge disappears and the next section continues with no seam. A mono stepper reads Detect / Classify / Approve / Intercept, with the active step in `ember-on-night`, and is marked "Illustrative". All track data is illustrative.
- **Restraint:** the canvas stops rendering while the hero is offscreen. Reduced motion holds a composed frame at progress 0.7.

### Product views (signature)
Every 3D product is a rectangle on the page that the one shared canvas draws into (ACES Filmic tone mapping, exposure 1.05, DPR capped at 1.75). It can be dragged to turn within about ±72° of yaw and springs back to its choreographed pose.
- **Studio:** a dawn Lightformer environment with a warm overhead key (#fff4e8), a cool left rim (#d6e4f2), a warm right rim (#ffe1c2), a low horizon ring (#f2c9a0) and a soft front panel (#eef2f6), plus a warm directional key (#fff1e2) and a cool fill (#c9d8ea). Night grounds raise the rims and fill so black forms still read. Hero stages add a soft contact shadow.
- **Finishes:** every part is black, and the finish is told by roughness and metalness alone. Matte printed PLA (roughness 0.78) carries runtime layer lines. Black anodised aluminium (metalness 0.92, roughness 0.36 at runtime) carries a dark-grey sheen. The rest are silicone bumpers (0.93), oxide hardware (metalness 0.85, roughness 0.36) and gloss lenses (0.08).
- **Stages:** a card shows a steady turntable, a spotlight turns with its panel's scroll, and a hero runs pinned choreography. BOLT rises from its anodised tube and tips onto its flight path, FIST pitches from tail-sitter into banked forward flight with spinning propellers, and the Anchor turns to show its corners.
- **Known trade-off:** printed layer lines on BOLT and FIST fade out once their on-screen spacing drops below about 3px, so they never shimmer into moiré. They read at 2x density and stay subtle at 1x on BOLT. This is deliberate, not a defect to tune away.

### Contact page (Book a briefing)
Every sales action leads to /contact: the light top nav, then the shared booking layout (a sticky intro with a Display L heading, lede, three numbered steps over hairlines and a phone-and-email line, beside the GoHighLevel calendar in a white 14px panel with a soft offset shadow), then the site footer without its closing call, since the page is that call. The Lunch and Launch booking page uses the same layout.

### Lunch and Launch (invitation only)
FTI's demo-day invitation at /lunch-and-launch, outside the site's navigation, under the slim header. It opens on the launch itself, the one page on the site set in daylight: a pinned scroll (360vh, 300vh on phones) over a 3D launch field drawn in the shared canvas. Open dry ground (a seeded speckle texture) runs to a pale mountain ridge lost in haze (#e6ecf0) under a daytime sky (#a6bfd3 to the haze, deepening to #7d9dbb as the view tilts up). Six BOLT launch boxes stand where they were dropped, each with the vent arch from the footage; the centre one fires. On scroll the 3D BOLT ignites, rises out of its box on small puffs of smoke, and climbs up and to the right and away on an ember exhaust and a white trail, while the camera tilts up after it and then lets it leave the top of the frame. Once it is gone, "You're invited to / Lunch and Launch" (Newsreader, up to 128px) appears with the lede and the one ember-chipped "Pick your date" button in the left of the sky, the trail still rising on the right. "Scroll to launch" sits in the sky at rest. Reduced motion skips the pin and shows the round just out of its box with the invitation already up. Below, on the site's sky ground: "Two hours at the launch site", the agenda set on a two-hour ruler (11:00 to 13:00, quarter-hour marks, half-hour labels), each block over a 3px bar, the launch in ink and lunch in slate; on phones the blocks stack and the ruler goes. "From past launches" holds FTI's own footage and photos in a mosaic (16:9 video, a photo as tall beside it, three 4:3 photos; 2 columns on phones); until media is supplied it shows dashed slots in development and is left out of production. Then the details as a spec sheet and the night closing panel. The booking page pairs a sticky intro (Display L heading, lede, three numbered steps, contact line) with the GoHighLevel calendar in a white 14px panel. The gate shown without a valid code is a single column: heading, one line, a code field with the dark arrow button, and an ember-ink error line when a code fails.

## Do's and Don'ts

### Do:
- **Do** set every full-width panel 10px in from the viewport with a 14px radius.
- **Don't** ship template tells: no blanket section entrances, no stat bars of words dressed as numbers, no adjective lists in place of a product's line, no decorative icon above every heading-and-text item, no index numbers on items whose order means nothing, no progressively faded tagline lines, and no placeholder `#` links. Unfilled facts read as dashed "To upload" blanks in `ink-60`, never ember; estimates on the product pages are flagged `guess: true` and kept off the home page.
- **Do** keep ember to live signals: tracks, locks, trajectories, engagement, and the arrow chip of the one primary action in a view.
- **Do** use `ember-ink` for ember text on light grounds and `ember-on-night` for ember text on night panels.
- **Do** set display type in Newsreader 300 with negative tracking and balanced wrapping; set data in 12px B612 Mono uppercase at 0.1em.
- **Do** end every call to action in the square arrow chip, in a white or ink button.
- **Do** drive motion from scroll on the one ease-out curve, cubic-bezier(0.16, 1, 0.3, 1). Content is simply present: there is no blanket entrance on sections. Motion lives in authored moments only (the hero engagement, the threat sequence, the How it works panel rising and its guided scene, the product walkthroughs and the 3D models).
- **Do** give every motion a reduced-motion final state. Model poses hold at progress 0.55, the home hero holds a composed engagement frame at progress 0.7, drag is off, and smooth scroll is off.
- **Do** render every 3D product through the shared canvas as a `View`, lit by the dawn Lightformer studio, with finishes from `scripts/prepare-models.mjs`.
- **Do** keep source media in `media/`, ship processed copies from `public/` via the prepare scripts, and write a provenance `.json` beside every shipped raster.

### Don't:
- **Don't** use ember for decoration, emphasis, unconfirmed values or brand colour.
- **Don't** put a mono label above a headline as a kicker or eyebrow.
- **Don't** make the page a dark tactical HUD with neon glows. HUD marks appear only as thin ember overlays on the home hero's illustrative engagement over the drawn sky and inside the drawn Lumen interface.
- **Don't** open a second WebGL context for a product model; add a `View` to the shared canvas. The home hero's scene canvas is the one exception.
- **Don't** use springy or bouncy motion. The scroll springs are tuned to settle without overshoot.
- **Don't** show a product on another product's ground.
- **Don't** ship the Anchor's internals or internal part names; the prepare script deletes them.
- **Don't** raise printed layer-line contrast to make lines read at 1x. They fade where their spacing drops below about 3px on screen, by design, to avoid moiré.
