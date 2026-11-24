import { productBySlug, type ProductSlug } from "@/content/products";
import { posterDataUrl, renderShareImage, shareSize, type ShareCard } from "@/lib/share-image";

export const size = shareSize;
export const contentType = "image/png";

const cards: Record<ProductSlug, Omit<ShareCard, "poster"> & { alt: string; poster?: "anchor" | "bolt" | "fist" }> = {
  lumen: {
    ground: "peach",
    kicker: "TRACK",
    title: "LUMEN",
    titleSize: 92,
    line: "Mesh C2 inside ATAK. Anchor tracks. Link extends the mesh.",
    alt: "LUMEN, the Layered Ubiquitous Mesh Engagement Network: counter-drone C2 inside ATAK.",
  },
  anchor: {
    ground: "fog",
    kicker: "EDGE COMPUTER",
    title: "Anchor",
    titleSize: 92,
    line: "The edge computer that runs LUMEN at the site.",
    poster: "anchor",
    alt: "Anchor, the edge computer that runs LUMEN.",
  },
  bolt: {
    ground: "night",
    kicker: "DENY",
    title: "BOLT",
    titleSize: 92,
    line: "Autonomous kinetic interception for closer, smaller threats.",
    poster: "bolt",
    alt: "BOLT, autonomous kinetic interception for closer, smaller threats.",
  },
  fist: {
    ground: "mist",
    kicker: "DENY",
    title: "FIST",
    titleSize: 92,
    line: "Longer-range kinetic interceptor, piloted or autonomous.",
    poster: "fist",
    alt: "FIST, a longer-range kinetic interceptor, piloted or autonomous.",
  },
};

export function generateImageMetadata({ params }: { params: { product: string } }) {
  const card = cards[params.product as ProductSlug];
  return [
    {
      id: "card",
      alt: card?.alt ?? "Fortress Technologies",
      size: shareSize,
      contentType: "image/png",
    },
  ];
}

export default async function Image({ params }: { params: Promise<{ product: string }> }) {
  const { product: slug } = await params;
  const spec = cards[slug as ProductSlug];
  const known = productBySlug(slug);
  if (!spec || !known) {
    return renderShareImage({
      ground: "night",
      kicker: "COUNTER-DRONE",
      title: "The Low Sky, Defended",
      line: "Counter-drone systems for the low sky. Track. Deny. Strike.",
      titleSize: 78,
    });
  }
  const poster = spec.poster ? await posterDataUrl(spec.poster) : undefined;
  return renderShareImage({ ...spec, poster });
}
