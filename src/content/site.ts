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
  lede: "Thirty minutes with the FTI team. Tell us what you need to defend, and we'll show you how Lumen, the Anchor, BOLT and FIST would cover it.",
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
    group: "Commercial",
    line: "For utilities, a drone loitering over the substation.",
    image: "/icp/commercial.webp",
    alt: "A utility substation seen through a chain-link fence at dusk.",
  },
  {
    group: "Border",
    line: "On the southern border, drones dropping packages.",
    image: "/icp/border.webp",
    alt: "A border wall running straight across open grassland toward the mountains.",
  },
  {
    group: "U.S. Defense",
    line: "For U.S. forces, Shahed drones flying in salvos.",
    image: "/icp/defense.webp",
    alt: "Silhouetted service members beside a vehicle under a night sky.",
  },
  {
    group: "International",
    line: "In Ukraine, waves of attack drones over its cities.",
    image: "/icp/international.webp",
    alt: "A damaged apartment street in Ukraine after a drone strike.",
  },
];

/**
 * How the system works, in four stages walked one at a time over one simple
 * scene. Each stage names the part it lights and says what happens in one line.
 */
export const howItWorks = {
  heading: "One system, sensor to shot",
  label: "A drone in the sky. A sensor spots it, the Anchor turns it into one track, an operator approves on a tablet, and BOLT or FIST takes it down.",
  steps: [
    { name: "Sensor", title: "Detect", body: "A sensor spots the drone." },
    { name: "Anchor", title: "Track", body: "The Anchor turns it into one clear track." },
    { name: "Operator", title: "Approve", body: "An operator approves on the tablet." },
    { name: "BOLT · FIST", title: "Intercept", body: "BOLT or FIST takes it down." },
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
    { label: "Lumen", href: "/lumen", index: "02" },
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
