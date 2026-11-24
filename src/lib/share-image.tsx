import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

/** Link-preview cards. 1200×630, in the site's night and product grounds. */
export const shareSize = { width: 1200, height: 630 };

const fontDir = join(process.cwd(), "src/assets/fonts");
const [newsreader, geist, geistMedium, logoWhite, logoBlack] = await Promise.all([
  readFile(join(fontDir, "Newsreader-300.ttf")),
  readFile(join(fontDir, "Geist-400.ttf")),
  readFile(join(fontDir, "Geist-500.ttf")),
  readFile(join(process.cwd(), "public/brand/fti-white.png")),
  readFile(join(process.cwd(), "public/brand/fti-black.png")),
]);

const fonts = [
  { name: "Newsreader", data: newsreader, weight: 300 as const, style: "normal" as const },
  { name: "Geist", data: geist, weight: 400 as const, style: "normal" as const },
  { name: "Geist", data: geistMedium, weight: 500 as const, style: "normal" as const },
];

const logo = {
  white: `data:image/png;base64,${logoWhite.toString("base64")}`,
  black: `data:image/png;base64,${logoBlack.toString("base64")}`,
};

/**
 * Product stills from public/models/posters. Satori draws PNG, not WebP, so
 * the transparent WebP is flattened to PNG here.
 */
export async function posterDataUrl(slug: "anchor" | "bolt" | "fist"): Promise<string> {
  const file = await readFile(join(process.cwd(), "public/models/posters", `${slug}.webp`));
  const png = await sharp(file).png().toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

type Ground = "night" | "peach" | "fog" | "mist" | "dawn";

const grounds: Record<Ground, { background: string; color: string; muted: string; kicker: string; mark: "white" | "black" }> = {
  night: { background: "#0a0f16", color: "#ffffff", muted: "rgba(255,255,255,0.68)", kicker: "#ff5b1f", mark: "white" },
  peach: { background: "#f7ede2", color: "#0d1117", muted: "rgba(13,17,23,0.62)", kicker: "#b8400f", mark: "black" },
  fog: { background: "#e4ebf0", color: "#0d1117", muted: "rgba(13,17,23,0.62)", kicker: "#b8400f", mark: "black" },
  mist: { background: "#eef1f3", color: "#0d1117", muted: "rgba(13,17,23,0.62)", kicker: "#b8400f", mark: "black" },
  dawn: { background: "#f4eee6", color: "#0d1117", muted: "rgba(13,17,23,0.62)", kicker: "#b8400f", mark: "black" },
};

export type ShareCard = {
  ground: Ground;
  kicker: string;
  title: string;
  line: string;
  titleSize?: number;
  poster?: string;
};

export function renderShareImage({ ground, kicker, title, line, titleSize = 84, poster }: ShareCard) {
  const tone = grounds[ground];
  const textWidth = poster ? 680 : 1200;
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: tone.background,
          color: tone.color,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: textWidth,
            height: "100%",
            padding: "60px 72px",
          }}
        >
          <img src={logo[tone.mark]} width={80} height={68} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Geist",
                fontWeight: 500,
                fontSize: 18,
                letterSpacing: 3,
                color: tone.kicker,
              }}
            >
              {kicker}
            </div>
            <div style={{ display: "flex", width: 48, height: 3, background: "#ff5b1f", marginTop: 18, marginBottom: 22 }} />
            <div
              style={{
                display: "flex",
                fontFamily: "Newsreader",
                fontWeight: 300,
                fontSize: titleSize,
                lineHeight: 1.02,
                letterSpacing: -1,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Geist",
                fontWeight: 400,
                fontSize: 26,
                lineHeight: 1.35,
                color: tone.muted,
                marginTop: 22,
                maxWidth: poster ? 520 : 820,
              }}
            >
              {line}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Geist",
              fontWeight: 500,
              fontSize: 18,
              letterSpacing: 2,
              color: tone.muted,
            }}
          >
            FORTRESS TECHNOLOGIES
          </div>
        </div>
        {poster ? (
          <div
            style={{
              display: "flex",
              width: 520,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              // Matte-black hardware disappears on the night ground, so BOLT's still sits on fog.
              background: ground === "night" ? "#e4ebf0" : "transparent",
            }}
          >
            <img src={poster} width={460} height={460} alt="" />
          </div>
        ) : null}
      </div>
    ),
    { ...shareSize, fonts },
  );
}
