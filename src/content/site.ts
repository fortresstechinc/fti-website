// Home page and shared copy, transferred from the approved Paper design.

export const contact = {
  // From FTI (2026-10-26). Location and LinkedIn are still placeholders.
  email: "team@fortress-tech.com",
  phone: { label: "Customer support", display: "435-383-4441", href: "tel:+14353834441" },
  location: "Springville, UT",
  linkedin: "#",
};

/**
 * The briefing call every sales action on the site leads to (/contact): FTI's
 * "Briefing Call" GoHighLevel calendar, from fortress-tech.com/home-calendar.
 */
export const briefing = {
  heading: "Book a briefing",
  lede: "Thirty minutes with the FTI team. Tell us what you need to defend, and we'll show you how LUMEN, the Anchor, BOLT and FIST would cover it.",
  steps: [
    { title: "Pick a time", body: "Choose a 30-minute slot on the calendar." },
    { title: "Add your details", body: "Tell us who you are and what you need to defend." },
    { title: "We confirm", body: "We'll be in touch shortly to confirm the call." },
  ],
  calendarUrl: "https://api.leadconnectorhq.com/widget/booking/rDgWXBMsEwgzky9i0PgZ" as string | null,
};

/**
 * The threat sequence: one line per audience FTI builds for, each with a photo
 * supplied by FTI. Lines describe the threat each group faces; they never
 * imply that group is a customer.
 */
export const threatScenes = [
  {
    group: "U.S. Defense",
    line: "For U.S. forces, Shahed drones flying in salvos.",
    image: "/icp/defense.webp",
    alt: "Silhouetted service members beside a vehicle under a night sky.",
  },
  {
    group: "Commercial",
    line: "For utilities, a drone loitering over the substation.",
    image: "/icp/commercial.webp",
    alt: "A utility substation seen through a chain-link fence at dusk.",
  },
  {
    group: "International",
    line: "In Ukraine, waves of attack drones over its cities.",
    image: "/icp/international.webp",
    alt: "A damaged apartment street in Ukraine after a drone strike.",
  },
  {
    group: "Border",
    line: "On the southern border, drones dropping packages.",
    image: "/icp/border.webp",
    alt: "A border wall running straight across open grassland toward the mountains.",
  },
];

/**
 * Track, the first mission: the LUMEN Dome, walked in four stages over one
 * simple scene. Each stage names the part it lights and says what happens in
 * one line. The scene's mechanics are unchanged.
 */
export const howItWorks = {
  mission: "Track",
  heading: "The LUMEN Dome",
  lede: "Layered Ubiquitous Mesh Engagement Network.",
  label:
    "LUMEN, the Layered Ubiquitous Mesh Engagement Network. A sensor spots the drone, the Anchor turns it into one track and starts the mesh, Link extends that mesh, and an operator approves on the tablet before BOLT or FIST takes it down.",
  steps: [
    { name: "Sensor", title: "Detect", body: "A sensor spots the drone. LUMEN takes it in." },
    { name: "Anchor", title: "Track", body: "The Anchor makes one track and starts the mesh. Link extends it." },
    { name: "Operator", title: "Approve", body: "One picture on the tablet. An operator approves." },
    { name: "BOLT · FIST", title: "Intercept", body: "BOLT or FIST takes it down." },
  ],
} as const;

/**
 * Deny, the mission after Track. Same night panel, walked in four stages.
 * Step lines only restate the War Room Brief (and Track's handoff). SPEAR has
 * no page; BOLT and FIST keep theirs.
 */
export const denyMission = {
  id: "deny",
  mission: "Deny",
  heading: "Active denial",
  lede: "Soft-kill and hard-kill against Group 1–3 UAS and loitering munitions.",
  label:
    "Active denial. BOLT, Burst of Lethal Termination, is low-cost, one-way kinetic hard-kill against swarms and loitering munitions. Standalone, or cued by the LUMEN Dome, the rocket flies to the target, detonates on a proximity fuze, and releases a buckshot and BB spray that shreds multiple Group 1–3 UAS in one burst. FIST is derived from the battle-tested Ukrainian Sting family. Up to 340+ km/h, with extended range. Reliable intercepts in GPS-denied and contested environments, and a decisive cost advantage over traditional missiles. Illustrative.",
  steps: [
    { name: "LUMEN", title: "Cue", body: "LUMEN hands over the track. Standalone, or cued by the LUMEN Dome." },
    { name: "BOLT · FIST", title: "Launch", body: "The rocket flies to the target. FIST is up to 340+ km/h, with extended range." },
    { name: "Close", title: "Close", body: "BOLT closes to a proximity fuze. FIST intercepts in GPS-denied and contested environments." },
    { name: "Defeat", title: "Defeat", body: "A buckshot and BB spray shreds multiple Group 1–3 UAS in one burst. FIST takes it down." },
  ],
  products: [
    { name: "BOLT", href: "/bolt" },
    { name: "FIST", href: "/fist" },
  ],
} as const;

/**
 * Strike, after Deny. SPEAR has no page and no button. Step lines only restate
 * the War Room Brief: it launches inside the protected LUMEN Dome and strikes
 * forward. Illustrative.
 */
export const strikeMission = {
  id: "strike",
  mission: "Strike",
  heading: "Precision strike",
  lede: "Precision offensive UAS, launched from inside the dome.",
  label:
    "SPEAR, Shielded Precision Expeditionary Attack Round. A packable offensive UAS that launches from within the protected LUMEN Dome, flies out past the dome edge, and delivers precision forward strike against enemy UAS launch sites, ground vehicles, fortifications and personnel. Illustrative.",
  steps: [
    { name: "Dome", title: "Launch", body: "Shielded Precision Expeditionary Attack Round. A packable offensive UAS that launches from within the protected LUMEN Dome." },
    { name: "Edge", title: "Fly", body: "It flies out past the dome edge." },
    { name: "Target", title: "Find", body: "It delivers precision forward strike." },
    { name: "Hit", title: "Strike", body: "Enemy UAS launch sites, ground vehicles, fortifications and personnel." },
  ],
} as const;

/**
 * What we defend: a 10 km circle (5 km radius) around the visitor's own area. When the
 * visitor's location is unknown (and in development) the map quietly shows `example`.
 */
export const whatWeDefend = {
  heading: "What we defend",
  lede: "One FTI site defends all of this. A circle ten kilometres across, watched by its sensors and held by its interceptors, all run from one Anchor.",
  radiusKm: 5,
  example: { lat: 38.89, lon: -77.03, place: "Washington, DC" },
  note: "Approximate, from your connection. Not stored.",
} as const;

// Shown only when it has entries. The internal milestones from the Paper design are
// not confirmed for public use (PRODUCT.md); add press or funding items once supplied.
export const dispatches: { tag: string; title: string; date: string; href?: string; live?: boolean }[] = [];

export const homeNav = {
  company: [
    { label: "Home", href: "#top" },
    { label: "Who it's for", href: "#who-its-for", index: "01" },
    { label: "How it works", href: "#how-it-works", index: "02" },
    { label: "What we defend", href: "#what-we-defend", index: "03" },
  ],
  products: [
    { label: "Comparison", href: "#products", index: "01" },
    { label: "LUMEN", href: "/lumen", index: "02" },
    { label: "Anchor", href: "/anchor", index: "03" },
    { label: "BOLT", href: "/bolt", index: "04" },
    { label: "FIST", href: "/fist", index: "05" },
  ],
  about: [
    { label: "Careers", href: "#careers" },
    // Opens the booking page; the rail marker still tracks the footer it sits by.
    { label: "Contact", href: "/contact", section: "contact" },
  ],
};
