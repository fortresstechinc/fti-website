# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router, TypeScript), built in this folder. The user authorised code on 2026-10-23. The Paper file (https://app.paper.design/file/01M5JMTGY14Y8YWJPGPG0ATF53, page "Website") is the approved design source the build was transferred from.

The user's product models and footage live in `media/`. That folder holds the originals; the build reads processed copies from `public/`.

## Users

- **Primary: military buyers.** Program offices, acquisition staff and technical evaluators deciding whether to test, field or buy a counter-drone capability. They will pressure-test every claim: autonomy policy, guidance accuracy, datalink and jamming, single points of failure.
- **Secondary: investors.** VCs and strategic partners judging whether the company and its product line are credible and fundable.

The end users of the products are small military units: operators and their leaders. They are the people the products serve, not the site's primary audience.

**Target segments (ICPs), from Nic Lewis, 2026-10-23:** Commercial (utilities and other critical infrastructure facing loitering drones), Border (the southern border, drones dropping packages), U.S. Defense (Shahed-class drones in salvos), International (the drone war in Ukraine). The home page's threat sequence names each one. Describe the threat each segment faces; never imply any of them is a customer.

## Product Purpose

FTI builds a low-cost, edge-native counter-drone system for small units. The site explains what each product line does, how the four fit into one sensor-to-shot loop, and why they are cheap enough to field at scale. Success means a buyer or investor leaves understanding the system and asks for a demo or a conversation.

## Positioning

The intelligence lives in software at the edge, not in each round. Lumen (C2) and the Anchor (the computer that runs it) do the sensing, fusion, classification and guidance. That lets the interceptors stay cheap: BOLT has no seeker and is command-guided by Lumen, and FIST is flown FPV by a pilot today (autonomous launch by Lumen is in development). Everything runs on site, with no cloud, Wi-Fi, cell network or reach-back. A human approves every engagement.

Family line, verbatim from the product docs: "BOLT handles the volume, and FIST takes out the priority target."

## Operating Context

- Operators use Lumen inside ATAK on tablets they already carry. Lumen publishes Cursor-on-Target.
- Sensors, effectors and ATAK devices connect to the Anchor over tactical mesh radio or fiber.
- The operating environment is contested and disconnected: no external network, possible jamming, small teams emplacing gear by hand.

## Capabilities and Constraints

The source of truth for public copy is `product-docs/*.txt` (lumen, anchor, bolt, fist). They override the internal repos (`../lumen-anchor`, `../lumen-demo`, `../lumen-first-test`, `../controls`) for anything public.

- **Lumen.** "The simplest C2 on the battlefield." Track-to-track fusion from any connected sensor (radar, EO/IR, RF, acoustic). Its own AI/ML classifies each track. A new operator is running it in under a minute; that claim covers running it, not setup. A local AI model suggests next actions. Voice is for status and suggestions only; engagements are approved by tap. Open on both ends: new sensors and effectors plug in. The interface to the whole system: many sensors in, many effectors out. ATAK is the default display; other interfaces are planned (Nic Lewis, 2026-10-25).
- **Anchor.** "The brain in a box." A rugged edge computer that runs Lumen on NVIDIA GPU hardware. Public copy names no specific module. Team-portable; Lumen is running in minutes. Tracks up to 50 threats simultaneously (from Nic Lewis, 2026-10-23; public claims may go beyond the product docs when he supplies them). Undecided or unknown: weight, power draw, battery runtime, boot-to-operational time, failover or multi-Anchor operation. An extremely light C2 node; up to 24 hours on battery (Nic Lewis, 2026-10-25).
- **BOLT.** "Dumb, cheap, and deadly effective." Low-cost and seekerless, steered by Lumen's command guidance. Radar-agnostic (any track source), Mach 0.5, 2 km, backpackable. Human-in-the-loop, no GPS required. The datalink is described publicly only as a "jam-resistant command link". Undecided: whether BOLT is pitched against Shahed-class targets, and which sensors meet the accuracy target at 2 km. Never launched by a person: its boxes are set down (backpacked in or dropped by drone) and fired remotely; short range, used in mass (Nic Lewis, 2026-10-25).
- **FIST.** "A cheap interceptor drone with real reach." A low-cost interceptor drone for Shahed/Geran-class one-way attack drones, Lancet-class loitering munitions and artillery-spotting recon drones. 150 mph (240 km/h), 25 km range. Man-packable; launches from the ground, a vehicle or a small boat. All black, similar in look to Ukraine's Sting interceptor. Unknown: its datalink. Flown FPV today; autonomous launch by Lumen is in development (Nic Lewis, 2026-10-25), so the site never says it flies itself.
- **Terms kept off the site:** Laya, "<30 ms" triage, 1–5 priority scores, MAVLink/ELRS, the Jetson module name, BOLT-1/5/X variants, and FIST's old 340+ km/h, 25–37+ km and "RF + EO/IR + AI seeker" figures.

## Brand Commitments

- The company name and wordmark are **FTI**. Do not use "Fortress", even though the Lumen doc says it.
- The product names are written Lumen, Anchor, BOLT and FIST.
- Voice: plain, confident and specific. Short declarative taglines, as in the product docs.
- Visual reference the user chose: seasats.com.

## Evidence on Hand

- Press and funding items exist and may be shown, but no specific articles, rounds or links have been provided yet. Ask before citing any.
- No customers, contracts, units, testimonials, benchmarks or test results may be named or implied.
- The four threat-scene photos in `media/icp-photos/` were supplied by FTI. Their licence and credit are unconfirmed; confirm them before launch.
- Internal milestones (first BOLT flight logs, SAPIENT server, two-radar Lumen demo) appear in the repos. They are not confirmed for public use.

## Visitor data

- The home page's What we defend map uses each visitor's approximate, city-level location from their IP address (Vercel's geolocation headers), only to draw the map. It is not stored, logged or shared. Map tiles load from OpenFreeMap, which sees the visitor's IP like any web request.

## Product Principles

1. Every claim must survive an evaluator. When a fact is unconfirmed, leave a blank for FTI to fill (`null` in `src/content/products.ts`) or leave it out. Exception (Nic Lewis, 2026-10-26): the product spec pages carry estimates so they read complete, each flagged `guess: true` until FTI confirms it; guesses never appear on the home page.
2. A human approves every engagement. Lumen suggests and flies; it never decides to use force.
3. Cheap and simple are features. Low cost, low training burden and low cognitive load are the pitch.
4. Edge first: nothing depends on the cloud or outside connectivity.
5. One system: each product page shows where that product sits in the sensor-to-shot loop.
