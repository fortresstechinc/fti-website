// Captures the rail's section previews (public/nav/*.webp) from a running site.
// Run `npm run dev` first, then `npm run prepare:previews`. Needs Google Chrome
// (or CHROME_PATH) and cwebp.
import { execFileSync } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const SECTIONS = ["top", "who-its-for", "how-it-works", "what-we-defend", "products", "spotlight-lumen", "spotlight-anchor", "spotlight-bolt", "spotlight-fist", "careers", "contact"];

await mkdir("public/nav", { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
// Skip the visit intro, and stub the visitor's location so the map shows its example site.
await context.addInitScript(() => sessionStorage.setItem("fti-intro", "1"));
await context.route("**/api/where", (r) => r.fulfill({ json: { found: false } }));
const page = await context.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });
// Previews show the page itself, without the rail.
await page.addStyleTag({ content: "div[data-rail], nextjs-portal { display: none !important; }" });
await page.waitForTimeout(3000);

for (const id of SECTIONS) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    window.scrollTo(0, el ? el.getBoundingClientRect().top + window.scrollY : 0);
  }, id);
  await page.waitForTimeout(id === "what-we-defend" ? 9000 : 2500);
  const png = `public/nav/${id}.png`;
  await page.screenshot({ path: png });
  execFileSync("cwebp", ["-quiet", "-q", "78", "-resize", "256", "160", png, "-o", `public/nav/${id}.webp`]);
  await rm(png);
}

await browser.close();
console.log(`previews written to public/nav (${SECTIONS.length})`);
