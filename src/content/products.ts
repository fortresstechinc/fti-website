// Product facts live here. As of 2026-11-03 the War Room Brief overrides
// product-docs where they conflict (see PRODUCT.md). Otherwise every fact
// comes from product-docs/*.txt via the approved Paper design.
// A null value is a blank still to come from FTI: the page shows it as an empty
// slot naming what goes there (see README, "Before launch").

export type ProductSlug = "lumen" | "anchor" | "bolt" | "fist";

export type IconName =
  | "fuse"
  | "bars"
  | "screen"
  | "mic"
  | "shield"
  | "doc"
  | "target"
  | "plug"
  | "hex"
  | "signal"
  | "clock"
  | "spark";

/** A measured figure. Words dressed as numbers do not belong here. */
/**
 * `guess: true` marks a placeholder FTI has not confirmed (filled in 2026-10-26 so
 * the spec pages read complete). Guesses show on product pages but never on the
 * home page. Confirm or correct each one, then delete its flag.
 */
export type Stat = { value: string | null; label: string; guess?: boolean };
export type Spec = { label: string; value: string | null; guess?: boolean };
/** One stage of the Anchor gallery; `picture` describes its illustration for screen readers. */
export type Step = { title: string; body: string; tag: string; picture: string };
/** One stage of a pinned product scene: the part it lights, then a title and a line. */
export type SceneStep = { name: string; title: string; body: string };

/** Anchor keeps its illustrations. LUMEN, BOLT and FIST walk a scene, like the home page. */
export type ProductWalk =
  | { kind: "gallery"; steps: readonly Step[] }
  | {
      kind: "scene";
      /** Track or Deny, in the shared mono label. */
      mission: string;
      /** One short line under the tagline. */
      lede: string;
      /** The scene, for screen readers. Marked illustrative, like the home scenes. */
      label: string;
      steps: readonly SceneStep[];
    };
/**
 * A photo or video for the product page. It shows once `file` exists under
 * public/; until then the page shows a blank naming what to send.
 */
/** The big square on the left of In action: real footage, or a drawn loop. */
export type ActionVisual =
  | { kind: "video"; file: string; poster: string; label: string }
  | { kind: "lumen" }
  | { kind: "day" };

/** A figure panel beside it: one headline figure and a small moving drawing of it. */
export type ActionPanel =
  | { kind: "range"; figure: string; label: string; km: number; compareKm?: number }
  | { kind: "travel"; figure: string; label: string; km: number; time: string }
  | { kind: "partner" }
  | { kind: "tracks"; figure: string; label: string; count: number }
  | { kind: "connect"; figure: string; label: string }
  | { kind: "stopwatch"; figure: string; label: string; seconds: number };

export type Product = {
  slug: ProductSlug;
  name: string;
  /** Spelled-out name under the product-page wordmark. Only LUMEN sets this. */
  expansion?: string;
  kind: string;
  /** The product's short line: heads its walkthrough and sits under its comparison card. */
  tagline: string;
  /** Hero line on the product page: the tagline and what the product is. */
  lede: string;
  /** Paragraph on the home spotlight. */
  spotlight: string;
  /** Headline figures. Real ones also show on the home spotlight. */
  stats: Stat[];
  /** How the product works, walked by scroll. */
  walkthrough: ProductWalk;
  /** The product shown working: one square visual and two figure panels. */
  action: { visual: ActionVisual; panels: [ActionPanel, ActionPanel] };
  specs: Spec[];
  /** The home comparison: four short facts per product, one per row. */
  compare: {
    role: string;
    performance: string;
    weight: string;
    deploys: string;
  };
  /** Ground the product sits on. "night" grounds flip the text to white. */
  ground: "peach" | "fog" | "night" | "mist";
  loopLine: string;
  closing: string;
};


export const products: Product[] = [
  {
    slug: "lumen",
    name: "LUMEN",
    expansion: "Layered Ubiquitous Mesh Engagement Network",
    kind: "Software",
    tagline: "The whole fight at a glance",
    lede: "The simplest C2 on the battlefield. One screen for every sensor and every effector, inside ATAK today.",
    spotlight:
      "The simplest C2 on the battlefield. LUMEN brings every sensor and every effector into one clean picture inside ATAK, classifies each track, and puts the whole system one tap away.",
    stats: [
      { value: "< 1 min", label: "Operator ready" },
      { value: "4", label: "Sensor types fused", guess: true },
      { value: "< 10 min", label: "Setup to first track", guess: true },
      { value: "1 tap", label: "To approve an engagement" },
    ],
    walkthrough: {
      kind: "scene",
      mission: "Track",
      lede: "Layered Ubiquitous Mesh Engagement Network.",
      label:
        "LUMEN, the Layered Ubiquitous Mesh Engagement Network. The Anchor makes one track and starts the mesh, Link extends that mesh, the LUMEN Dome forms, and an operator approves before LUMEN cues BOLT and FIST. Illustrative.",
      steps: [
        { name: "Anchor", title: "Track", body: "The Anchor makes one track and starts the mesh." },
        { name: "Link", title: "Extend", body: "Link extends the mesh the Anchor establishes." },
        { name: "Dome", title: "Form", body: "The mesh forms the LUMEN Dome. One picture on the tablet. An operator approves." },
        { name: "BOLT · FIST", title: "Cue", body: "LUMEN cues BOLT and FIST. Each gets its own target." },
      ],
    },
    action: {
      visual: { kind: "lumen" },
      panels: [
        { kind: "connect", figure: "Any sensor in", label: "Radar, EO/IR, RF and acoustic in; BOLT, FIST and the unit's own effectors out" },
        { kind: "stopwatch", figure: "Under 1 min", label: "From a new operator to running LUMEN", seconds: 52 },
      ],
    },
    specs: [
      { label: "Display", value: "ATAK today · More interfaces planned" },
      { label: "Messaging", value: "Cursor-on-Target" },
      { label: "Sensor input", value: "Radar · EO/IR · RF · Acoustic" },
      { label: "Effector output", value: "BOLT · FIST · Systems the unit owns" },
      { label: "Classification", value: "Onboard AI/ML" },
      { label: "Voice", value: "Status & suggestions" },
      { label: "Network", value: "Mesh radio or fiber · No cloud" },
      { label: "Runs on", value: "Anchor" },
      { label: "Integrated sensors", value: "Any sensor with an open interface", guess: true },
      { label: "Supported devices", value: "Android devices running ATAK", guess: true },
    ],
    compare: {
      role: "Command & control",
      performance: "Under 1 min to operate",
      weight: "Software only",
      deploys: "On ATAK tablets",
    },
    ground: "peach",
    loopLine: "The simplest C2 on the battlefield",
    closing: "LUMEN decides. Pair it with the Anchor that runs it and the interceptors that act.",
  },
  {
    slug: "anchor",
    name: "Anchor",
    kind: "Hardware",
    tagline: "Agentic C2 you can carry",
    lede: "The brain in a box. An extremely light C2 node that runs LUMEN at the site, for up to 24 hours on battery.",
    spotlight:
      "The brain in a box. An extremely light, rugged C2 node that runs LUMEN on site for up to 24 hours on battery: sensor fusion, battlefield intelligence, mesh networking and effector tasking, with nothing sent to the cloud.",
    // 50 tracked threats (2026-10-23) and 24-hour battery (2026-10-25) from Nic Lewis.
    stats: [
      { value: "50", label: "Threats tracked simultaneously" },
      { value: "24 h", label: "On battery, up to" },
      { value: "4.5 kg", label: "Weight", guess: true },
      { value: "< 2 min", label: "Boot to operational", guess: true },
    ],
    walkthrough: {
      kind: "gallery",
      steps: [
        { title: "Carry", body: "About the size of a .50 cal ammo can.", tag: "Lightweight C2", picture: "The Anchor beside a .50 caliber M2A1 ammo can, drawn to scale: a little shorter and much lower than the can." },
        { title: "Endure", body: "Up to 24 hours on battery.", tag: "Battery powered", picture: "The Anchor under a dotted arc running from a sun on one side to a moon on the other: it keeps running through a full day and night." },
        { title: "Think", body: "Fusion, intelligence and comms, all on board.", tag: "NVIDIA GPU", picture: "The same Anchor with its lid lifted off, showing one board inside with its processor lit." },
      ],
    },
    action: {
      visual: { kind: "day" },
      panels: [
        { kind: "partner" },
        { kind: "tracks", figure: "50", label: "Threats tracked at once", count: 50 },
      ],
    },
    specs: [
      { label: "Compute", value: "NVIDIA GPU" },
      { label: "Enclosure", value: "Rugged and sealed · IP67", guess: true },
      { label: "Runs", value: "LUMEN: fusion · Battlefield intelligence · Effector tasking" },
      { label: "Links", value: "Tactical mesh radio or fiber" },
      { label: "Operator display", value: "ATAK devices" },
      { label: "Cloud", value: "None required" },
      { label: "Size", value: "26 × 14 × 13 cm", guess: true },
      { label: "Power draw", value: "25 W typical", guess: true },
      { label: "Redundancy", value: "Networked Anchors overlap", guess: true },
    ],
    compare: {
      role: "Edge compute",
      performance: "50 tracked threats",
      weight: "Lightweight",
      deploys: "At the site, in minutes",
    },
    ground: "fog",
    loopLine: "The brain in a box",
    closing: "The Anchor runs it all. Pair it with the software operators see and the interceptors that act.",
  },
  {
    slug: "bolt",
    name: "BOLT",
    kind: "Effector",
    tagline: "Kinetic hard-kill",
    lede: "Autonomous kinetic interception for the closer, smaller threats. Payloads fire from the tip, on its own or cued by the LUMEN Dome.",
    spotlight:
      "Autonomous kinetic interception against the closer, smaller threats. BOLT can fire more than one payload type from its tip. Standalone, or cued by the LUMEN Dome.",
    stats: [
      { value: "Mach 0.5", label: "Top speed" },
      { value: "2 km", label: "Range" },
      { value: "12 s", label: "Flight time", guess: true },
      { value: "1.2 kg", label: "Weight", guess: true },
    ],
    walkthrough: {
      kind: "scene",
      mission: "Deny",
      lede: "Closer in than FIST. A payload fires from the tip.",
      label:
        "BOLT, autonomous kinetic interception for the closer, smaller threats. It flies on its own or cued by the LUMEN Dome, leaves a box that was set down and left, and fires a payload from its tip. FIST takes a larger target farther out. Illustrative.",
      steps: [
        { name: "LUMEN", title: "Cue", body: "Standalone, or cued by the LUMEN Dome." },
        { name: "Box", title: "Launch", body: "Set down and leave. Backpacked in or dropped by drone, then fired remotely." },
        { name: "Tip", title: "Payload", body: "Multiple payload types, fired from the tip." },
        { name: "Threat", title: "Defeat", body: "BOLT takes the closer, smaller threat. FIST takes a larger one, farther out." },
      ],
    },
    action: {
      visual: { kind: "video", file: "/media/bolt.mp4", poster: "/media/bolt-poster.webp", label: "A BOLT round firing from its launch box on open desert ground." },
      panels: [
        { kind: "range", figure: "2 km", label: "Effective range", km: 2 },
        { kind: "travel", figure: "Mach 0.5", label: "Across its full range in about 12 seconds", km: 2, time: "≈ 12 s" },
      ],
    },
    specs: [
      { label: "Type", value: "Low-cost counter-drone interceptor" },
      { label: "Launch", value: "From ground boxes · Fired remotely" },
      { label: "Deploy", value: "Backpacked or dropped in by drone" },
      { label: "Guidance", value: "Standalone or LUMEN Dome-cued" },
      { label: "Datalink", value: "Jam-resistant command link" },
      { label: "GPS", value: "Not required" },
      { label: "Targets", value: "Closer in · Smaller threats" },
      { label: "Authorisation", value: "Operator approves every engagement" },
      { label: "Defeat method", value: "Autonomous · Tip-fired payload" },
      { label: "Time to launch", value: "Under 5 s", guess: true },
    ],
    compare: {
      role: "Volume intercept",
      performance: "Mach 0.5 · 2 km",
      weight: "Backpackable",
      deploys: "Set down, fired remotely",
    },
    ground: "night",
    loopLine: "Low-cost, one-way kinetic hard-kill",
    closing: "BOLT handles the volume, and FIST takes out the priority target. LUMEN and the Anchor tie them together.",
  },
  {
    slug: "fist",
    name: "FIST",
    kind: "Effector",
    tagline: "Stop them farther out",
    lede: "A traditional kinetic interceptor for longer range. A pilot flies it, or it guides itself, to larger targets farther out.",
    spotlight:
      "A cheap interceptor drone with real reach. Slower than BOLT but able to go much farther, FIST hunts the threats that get through: Shahed-class one-way attack drones, Lancet-class loitering munitions and artillery spotters. Pilots fly it FPV today; autonomous launch by LUMEN is in development.",
    stats: [
      { value: "340+ km/h", label: "Top speed" },
      { value: "25 km", label: "Range" },
      { value: "15 min", label: "Flight time", guess: true },
      { value: "2.5 kg", label: "Weight", guess: true },
    ],
    walkthrough: {
      kind: "scene",
      mission: "Deny",
      lede: "Larger targets, farther out than BOLT.",
      label:
        "FIST, a traditional kinetic interceptor for longer range. It launches from the ground, a vehicle, or a small boat. A pilot flies it, or it guides itself, to a larger target farther out. It does not take BOLT's target. Illustrative.",
      steps: [
        { name: "Pad", title: "Launch", body: "From the ground, a vehicle, or a small boat. It flies farther out than BOLT." },
        { name: "Pilot", title: "Guide", body: "A pilot flies FIST, or it guides itself to the target." },
        { name: "Farther", title: "Reach", body: "It reaches larger targets farther out." },
        { name: "Threat", title: "Defeat", body: "FIST defeats that target. BOLT takes the closer, smaller one." },
      ],
    },
    action: {
      visual: { kind: "video", file: "/media/fist.mp4", poster: "/media/fist-poster.webp", label: "FIST lifting off from a field and climbing away into the sky." },
      panels: [
        { kind: "range", figure: "25 km", label: "Reach, drawn to scale against BOLT's 2 km", km: 25, compareKm: 2 },
        { kind: "travel", figure: "340+ km/h", label: "Across its full reach", km: 25, time: "" },
      ],
    },
    specs: [
      { label: "Type", value: "Low-cost interceptor drone" },
      { label: "Launch", value: "Ground · Vehicle · Small boat" },
      { label: "Deploy", value: "Man-packable" },
      { label: "Guidance", value: "Pilot · Autonomous guidance" },
      { label: "Datalink", value: "Digital video and control link", guess: true },
      { label: "GPS", value: "Not required", guess: true },
      { label: "Targets", value: "Shahed · Lancet · Recon drones" },
      { label: "Authorisation", value: "Operator approves every engagement" },
      { label: "Defeat method", value: "Kinetic intercept", guess: true },
      { label: "Time to launch", value: "Under 30 s", guess: true },
    ],
    compare: {
      role: "Priority intercept",
      performance: "340+ km/h · 25 km",
      weight: "Man-packable",
      deploys: "Ground, vehicle or boat",
    },
    ground: "mist",
    loopLine: "A cheap interceptor drone with real reach",
    closing: "FIST takes out the priority target. Pair it with LUMEN and the Anchor that runs it.",
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const compareRows: { key: keyof Product["compare"]; label: string }[] = [
  { key: "role", label: "Role" },
  { key: "performance", label: "Performance" },
  { key: "weight", label: "Weight" },
  { key: "deploys", label: "Deploys" },
];
