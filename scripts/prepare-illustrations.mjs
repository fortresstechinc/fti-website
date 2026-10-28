// Turns the product walkthrough illustrations exported from Paper (page
// "Product illustrations", SVG export) into the files the site serves.
//
//   node scripts/prepare-illustrations.mjs [export dir, default media/illustrations]
//
// Exports are named "<PRODUCT> <n> · <Stage>.svg" (the Paper layer names). Each
// one loses its solid night background, so it floats on the walkthrough panel,
// and is cropped to its drawing. Output: public/illustrations/<product>-<n>.svg.

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright-core";

const SOURCE = process.argv[2] ?? join(process.cwd(), "media", "illustrations");
const OUT = join(process.cwd(), "public", "illustrations");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const files = (await readdir(SOURCE)).filter((f) => /^(LUMEN|Lumen|ANCHOR|Anchor|BOLT|FIST) \d .*\.svg$/.test(f));
if (!files.length) {
  console.error(`No illustration exports found in ${SOURCE}`);
  process.exit(1);
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();

for (const file of files) {
  const [product, n] = file.split(" ");
  let svg = await readFile(join(SOURCE, file), "utf8");
  const [, w, h] = svg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/) ?? [];

  // The night background goes; the panel behind is the ground. Generators draw
  // it as a near-black rectangle spanning the canvas, not always its full height,
  // and edits sometimes draw it again as a rectangular path ("M0 0H…V…H0Z").
  const nearBlack = (attrs) => {
    const fill = attrs.match(/fill="#([0-9a-fA-F]{6})"/)?.[1];
    return fill && [0, 2, 4].every((i) => parseInt(fill.slice(i, i + 2), 16) < 0x22);
  };
  svg = svg.replace(/<rect([^>]*)\/>\s*/g, (m, attrs) => {
    const num = (a) => parseFloat(attrs.match(new RegExp(`\\s${a}="([\\d.]+)"`))?.[1] ?? "0");
    const spans = num("width") >= +w * 0.9 || num("height") >= +h * 0.9;
    return nearBlack(attrs) && spans ? "" : m;
  });
  svg = svg.replace(/<path([^>]*)\/>\s*/g, (m, attrs) => {
    const [, pw, ph] = attrs.match(/\sd="M0 0H([\d.]+)V([\d.]+)H0Z"/) ?? [];
    const spans = +pw >= +w * 0.9 || +ph >= +h * 0.9;
    return pw && nearBlack(attrs) && spans ? "" : m;
  });
  // Paper's layout style on the root does not belong in a served file.
  svg = svg.replace(/\sstyle="[^"]*"/, "");

  // The set is white line art over slate. A few generations came back with
  // slate lines, which vanish on the night panel; when most of a drawing's
  // lines are dark, they are lifted to the set's off-white.
  const strokes = [...svg.matchAll(/stroke="#([0-9a-fA-F]{6})"/g)].map((m) => m[1]);
  const dark = (hex) => {
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.3;
  };
  if (strokes.filter(dark).length > strokes.length / 2) {
    svg = svg.replace(/stroke="#([0-9a-fA-F]{6})"/g, (m, hex) => (dark(hex) ? 'stroke="#E4EAF0"' : m));
  }

  await page.setContent(`<!doctype html><body style="margin:0">${svg}</body>`);
  const box = await page.evaluate(() => {
    const b = document.querySelector("svg").getBBox();
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  });
  // A margin of 2% of the drawing, whatever units the generator drew in.
  const pad = Math.max(box.w, box.h) * 0.02;
  const vb = [box.x - pad, box.y - pad, box.w + pad * 2, box.h + pad * 2].map((v) => +v.toFixed(2));
  svg = svg
    .replace(/viewBox="[^"]*"/, `viewBox="${vb.join(" ")}"`)
    .replace(/\swidth="[^"]*"/, ` width="${vb[2]}"`)
    .replace(/\sheight="[^"]*"/, ` height="${vb[3]}"`);

  const name = `${product.toLowerCase()}-${n}.svg`;
  await writeFile(join(OUT, name), svg);
  console.log(`${file} → public/illustrations/${name} (${vb[2]}×${vb[3]})`);
}

await browser.close();
