import { renderShareImage, shareSize } from "@/lib/share-image";

export const alt = "The Low Sky, Defended. Fortress Technologies counter-drone systems.";
export const size = shareSize;
export const contentType = "image/png";

/** Branded default for pages without their own card: home, and the unlisted pages. */
export default function Image() {
  return renderShareImage({
    ground: "night",
    kicker: "COUNTER-DRONE",
    title: "The Low Sky, Defended",
    line: "Counter-drone systems for the low sky. Track. Deny. Strike.",
    titleSize: 78,
  });
}
