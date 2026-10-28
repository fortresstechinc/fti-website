# FTI website

The marketing site for FTI's counter-drone system: Lumen, the Anchor, BOLT and FIST. Next.js 16 (App Router, TypeScript), transferred from the approved Paper design (`PRODUCT.md` has the link).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build; every page is static
npm run lint       # type check
```

## Where things live

| Path | What it holds |
|---|---|
| `src/content/` | All site copy. `products.ts` holds each product's facts and `site.ts` the home page. Copy must stay within `product-docs/` and `PRODUCT.md`. |
| `src/components/home/` | Home sections: the hero, the threat sequence, How it works (the guided sensor-to-shot scene), comparison, spotlights, careers |
| `src/components/hero/` | The hero scene: shader sky and clouds, drone silhouettes, and the scroll timeline for the illustrative engagement |
| `src/components/product/` | Product page sections. Every product page comes from one template (`src/app/[product]/page.tsx`). |
| `src/components/chrome/` | Site chrome: the home page's right-edge rail (`RailNav`), top nav, product switcher, contact footer |
| `src/components/three/` | The 3D layer: one shared WebGL canvas (`SceneHost`), a view per product, the models and their choreography, and the 3D-printed finish |
| `src/components/lumen/` | Lumen's ATAK interface, drawn live in SVG with illustrative data |
| `media/` | Originals supplied by FTI: models, footage, logos. Never served directly, and not in the repo: get them from FTI before running the `prepare:*` scripts. |
| `public/` | Processed copies the site serves. Regenerate them with the scripts below. |

## Regenerating media and models

```bash
npm run prepare:models   # media/*.glb -> public/models/*.glb
npm run prepare:media    # logos, favicon and threat-scene photos (needs ImageMagick and cwebp)
npm run prepare:previews # the rail's section previews in public/nav (needs `npm run dev` running, Chrome and cwebp)
```

`prepare:models` recolours the models (matte-black PLA for BOLT and FIST; black anodised aluminium with silicone corners for the Anchor), compresses them with meshopt, and deletes the Anchor's internal parts and part names so they never ship.

Product walkthrough illustrations are generated in Paper (page "Product illustrations"). Export each as SVG into `media/illustrations/` keeping its layer name ("BOLT 2 · Salvo.svg"), then run `npm run prepare:illustrations` to write the served files to `public/illustrations/`.

Re-capture the previews whenever a home section changes. After `prepare:media` or `prepare:previews`, re-embed each raster's provenance with Impeccable's `embed-prompt` (see `DESIGN.md`).

## Contact page

Every sales action on the site (the top nav's Contact, the footer's Contact us and Contact links, and each product's Request full specs) leads to `/contact`, which embeds FTI's 30-minute "Briefing Call" GoHighLevel calendar (from fortress-tech.com/home-calendar). The link is `briefing.calendarUrl` in `src/content/site.ts`. Request full specs adds `?about=<product>`, which names that product in the page's opening line. The footer's plain email and phone stay as direct links.

## Lunch and Launch (invitation only)

`/lunch-and-launch` is FTI's demo-day invitation, with its booking page at `/lunch-and-launch/book`. Nothing on the site links to it and search engines are told to skip it. `src/proxy.ts` lets a visitor in only with an invite code:

- **Codes** live in the `LUNCH_AND_LAUNCH_CODES` environment variable, comma-separated (set it in `.env.local` for development and in the Vercel project settings for production). With no codes set, nobody gets in.
- **Invite link:** `https://<site>/lunch-and-launch?invite=<code>`. A valid code is remembered for 90 days, so the booking page and return visits just work. Removing a code shuts out everyone who used it.
- **Without a code** the visitor sees an "invitation only" page where they can type one in.
- **Past launches:** originals go in `media/lunch-and-launch/`; `npm run prepare:media` cuts the footage and sizes the photos into `public/media/lunch-and-launch/`, and `past` in `src/content/lunch-and-launch.ts` points at them. A slot left `null` stays off the live page.
- **Calendar:** paste the GoHighLevel booking widget link (the `src` of the calendar's embed iframe) into `booking.calendarUrl` in `src/content/lunch-and-launch.ts`. Until then the booking page shows a placeholder.

## Before launch

- **Placeholder** in `src/content/site.ts`: the LinkedIn link. The footer hides it while it is `#`, and there is no privacy policy link until a policy page exists.
- **Guessed product specs:** to make the product pages read complete, every unconfirmed figure and spec row was filled with an estimate on 2026-10-26 and flagged `guess: true` in `src/content/products.ts` (22 of them; search for `guess: true`). Guesses show on the product pages but never on the home page. Confirm or correct each one before launch, then delete its flag.
- **What we defend map:** the home page map centres on each visitor's approximate location from Vercel's IP geolocation headers (`src/app/api/where/route.ts`); nothing is stored or sent elsewhere. Off Vercel, or in `npm run dev`, it quietly shows the fallback place in `src/content/site.ts` (Washington, DC), with no mention that it is a fallback. Map tiles come from OpenFreeMap (free, no key; it sees visitor IPs when tiles load, and its attribution must stay on the map). `npm install` copies MapLibre's worker to `public/vendor/`. The location request starts from a script in the page head (`src/components/home/where-script.ts`) and the map builds during the intro, so it is ready before the visitor scrolls to it. Mention the location lookup in the privacy policy.
- **Product footage:** the In action section on the BOLT and FIST pages plays `media/bolt-marketing.mp4` and `media/fist-marketing.mp4` (iPhone portrait, 8 s). After replacing either, or the NVIDIA Inception badge in `media/`, run `npm run prepare:media` to rebuild `public/media/` (silent 540 × 960 MP4s and first-frame posters) and `public/brand/nvidia-inception.webp`. Lumen and Anchor use drawn loops, not footage. Confirm the footage is cleared for public release.
- **Dispatches:** the section stays hidden until press or funding items are added to `dispatches` in `src/content/site.ts`.
- **Threat-scene photos:** `media/icp-photos/` (served from `public/icp/`) are third-party photographs. Confirm the licence for each, and add credits if the licences require them, before going live. This matters most for the U.S. Defense and Ukraine images.
- **Specs requests:** "Request full specs" opens an email for now. Swap it for a document link when one exists.
