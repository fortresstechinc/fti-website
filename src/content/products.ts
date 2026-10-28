// Every product fact on the site comes from product-docs/*.txt via the approved Paper design.
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
/** One stage of a product walkthrough; `picture` describes its illustration for screen readers. */
export type Step = { title: string; body: string; tag: string; picture: string };
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
  kind: string;
  /** The product's short line: heads its walkthrough and sits under its comparison card. */
  tagline: string;
  /** Hero line on the product page: the tagline and what the product is. */
  lede: string;
  /** Paragraph on the home spotlight. */
  spotlight: string;
  /** Headline figures. Real ones also show on the home spotlight. */
  stats: Stat[];
  /** How the product works, in three illustrated stages, walked by scroll. */
  walkthrough: { steps: Step[] };
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
    name: "Lumen",
    kind: "Software",
    tagline: "The whole fight at a glance",
    lede: "The simplest C2 on the battlefield. One screen for every sensor and every effector, inside ATAK today.",
    spotlight:
      "The simplest C2 on the battlefield. Lumen brings every sensor and every effector into one clean picture inside ATAK, classifies each track, and puts the whole system one tap away.",
    stats: [
      { value: "< 1 min", label: "Operator ready" },
      { value: "4", label: "Sensor types fused", guess: true },
      { value: "< 10 min", label: "Setup to first track", guess: true },
      { value: "1 tap", label: "To approve an engagement" },
    ],
    walkthrough: {
      steps: [
        { title: "Connect", body: "Any sensor in, any effector out.", tag: "Open on both ends", picture: "A radar on a tripod, linked by one line to a rugged tablet running Lumen." },
        { title: "Understand", body: "Read the whole fight at a glance.", tag: "AI/ML classification", picture: "The Lumen map on the tablet, with tracks marked hostile in orange, unknown in gray and friendly in blue." },
        { title: "Act", body: "One tap and the system acts.", tag: "In ATAK today", picture: "An operator tapping the approve button on the same tablet, with an interceptor rising in the distance." },
      ],
    },
    action: {
      visual: { kind: "lumen" },
      panels: [
        { kind: "connect", figure: "Any sensor in", label: "Radar, EO/IR, RF and acoustic in; BOLT, FIST and the unit's own effectors out" },
        { kind: "stopwatch", figure: "Under 1 min", label: "From a new operator to running Lumen", seconds: 52 },
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
    closing: "Lumen decides. Pair it with the Anchor that runs it and the interceptors that act.",
  },
  {
    slug: "anchor",
    name: "Anchor",
    kind: "Hardware",
    tagline: "Agentic C2 you can carry",
    lede: "The brain in a box. An extremely light C2 node that runs Lumen at the site, for up to 24 hours on battery.",
    spotlight:
      "The brain in a box. An extremely light, rugged C2 node that runs Lumen on site for up to 24 hours on battery: sensor fusion, battlefield intelligence, mesh networking and effector tasking, with nothing sent to the cloud.",
    // 50 tracked threats (2026-10-23) and 24-hour battery (2026-10-25) from Nic Lewis.
    stats: [
      { value: "50", label: "Threats tracked simultaneously" },
      { value: "24 h", label: "On battery, up to" },
      { value: "4.5 kg", label: "Weight", guess: true },
      { value: "< 2 min", label: "Boot to operational", guess: true },
    ],
    walkthrough: {
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
      { label: "Runs", value: "Lumen: fusion · Battlefield intelligence · Effector tasking" },
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
    tagline: "Dumb, cheap, and deadly",
    lede: "Dumb, cheap and deadly effective. A low-cost interceptor, set down in boxes and fired in mass.",
    spotlight:
      "Dumb, cheap and deadly effective. BOLT carries no seeker. Lumen tracks the target, computes the intercept and steers each round by command guidance, so the round stays light, simple and built for volume.",
    stats: [
      { value: "Mach 0.5", label: "Top speed" },
      { value: "2 km", label: "Range" },
      { value: "12 s", label: "Flight time", guess: true },
      { value: "1.2 kg", label: "Weight", guess: true },
    ],
    walkthrough: {
      steps: [
        { title: "Simple", body: "Almost no intelligence on board. That keeps it cheap.", tag: "No seeker", picture: "A BOLT round on its own: a plain finned body with no seeker in the nose." },
        { title: "Deploy", body: "Backpacked or dropped in by drone, then fired remotely.", tag: "Set down and leave", picture: "One BOLT launch box standing on its own, a tall square column with a vent at its base, with radio waves coming off it: it is fired remotely over radio." },
        { title: "Swarm", body: "Fired in mass, steered by Lumen at short range.", tag: "Command guidance", picture: "A BOLT round leaving the top of the same launch box on its exhaust, with a dotted guidance line curving ahead of it." },
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
      { label: "Guidance", value: "Command guidance by Lumen" },
      { label: "Datalink", value: "Jam-resistant command link" },
      { label: "GPS", value: "Not required" },
      { label: "Targets", value: "Small drones · Swarms", guess: true },
      { label: "Authorisation", value: "Operator approves every engagement" },
      { label: "Defeat method", value: "Kinetic hit-to-kill", guess: true },
      { label: "Time to launch", value: "Under 5 s", guess: true },
    ],
    compare: {
      role: "Volume intercept",
      performance: "Mach 0.5 · 2 km",
      weight: "Backpackable",
      deploys: "Set down, fired remotely",
    },
    ground: "night",
    loopLine: "Dumb, cheap and deadly effective",
    closing: "BOLT handles the volume, and FIST takes out the priority target. Lumen and the Anchor tie them together.",
  },
  {
    slug: "fist",
    name: "FIST",
    kind: "Effector",
    tagline: "Stop them farther out",
    lede: "A cheap interceptor drone with real reach, for the priority threats that get past the swarm layer.",
    spotlight:
      "A cheap interceptor drone with real reach. Slower than BOLT but able to go much farther, FIST hunts the threats that get through: Shahed-class one-way attack drones, Lancet-class loitering munitions and artillery spotters. Pilots fly it FPV today; autonomous launch by Lumen is in development.",
    stats: [
      { value: "240 km/h", label: "Top speed" },
      { value: "25 km", label: "Range" },
      { value: "15 min", label: "Flight time", guess: true },
      { value: "2.5 kg", label: "Weight", guess: true },
    ],
    walkthrough: {
      steps: [
        { title: "Reach", body: "A drone, not a rocket: slower, with far more reach.", tag: "Up to 25 km", picture: "FIST in level flight, a stubby winged drone with four propellers at its tail, trailing a long dotted path behind it." },
        { title: "Fly", body: "Fly it FPV, or let it fly autonomously.", tag: "Lumen autonomy in development", picture: "FPV pilot goggles beside an AI chip: flown by a pilot, or flying itself." },
        { title: "Intercept", body: "Catches priority threats far from the line.", tag: "Shahed · Lancet", picture: "The same FIST tipped into a dive, with target brackets just ahead of its nose." },
      ],
    },
    action: {
      visual: { kind: "video", file: "/media/fist.mp4", poster: "/media/fist-poster.webp", label: "FIST lifting off from a field and climbing away into the sky." },
      panels: [
        { kind: "range", figure: "25 km", label: "Reach, drawn to scale against BOLT's 2 km", km: 25, compareKm: 2 },
        { kind: "travel", figure: "240 km/h", label: "Out to its full reach in about 6 minutes", km: 25, time: "≈ 6 min" },
      ],
    },
    specs: [
      { label: "Type", value: "Low-cost interceptor drone" },
      { label: "Launch", value: "Ground · Vehicle · Small boat" },
      { label: "Deploy", value: "Man-packable" },
      { label: "Guidance", value: "FPV pilot · Lumen autonomy in development" },
      { label: "Datalink", value: "Digital video and control link", guess: true },
      { label: "GPS", value: "Not required", guess: true },
      { label: "Targets", value: "Shahed · Lancet · Recon drones" },
      { label: "Authorisation", value: "Operator approves every engagement" },
      { label: "Defeat method", value: "Kinetic intercept", guess: true },
      { label: "Time to launch", value: "Under 30 s", guess: true },
    ],
    compare: {
      role: "Priority intercept",
      performance: "240 km/h · 25 km",
      weight: "Man-packable",
      deploys: "Ground, vehicle or boat",
    },
    ground: "mist",
    loopLine: "A cheap interceptor drone with real reach",
    closing: "FIST takes out the priority target. Pair it with Lumen and the Anchor that runs it.",
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const compareRows: { key: keyof Product["compare"]; label: string }[] = [
  { key: "role", label: "Role" },
  { key: "performance", label: "Performance" },
  { key: "weight", label: "Weight" },
  { key: "deploys", label: "Deploys" },
];
