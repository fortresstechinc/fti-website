import { renderShareImage, shareSize } from "@/lib/share-image";

export const alt = "Book a briefing with Fortress Technologies on counter-drone defence.";
export const size = shareSize;
export const contentType = "image/png";

export default function Image() {
  return renderShareImage({
    ground: "dawn",
    kicker: "CONTACT",
    title: "Book a briefing",
    line: "Thirty minutes with FTI on counter-drone defence for your site.",
    titleSize: 78,
  });
}
