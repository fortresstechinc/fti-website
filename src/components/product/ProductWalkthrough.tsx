"use client";

import type { Product } from "@/content/products";
import { StageGallery } from "@/components/guide/StageGallery";
import { Walkthrough } from "@/components/guide/Walkthrough";

/** How one product works, one illustration per stage, walked by scroll. */
export function ProductWalkthrough({ product }: { product: Product }) {
  const { steps } = product.walkthrough;
  const images = steps.map((s, i) => ({ src: `/illustrations/${product.slug}-${i + 1}.svg`, alt: s.picture }));
  return (
    <Walkthrough id="how-it-works" heading={product.tagline} count={steps.length}>
      {(front, pick) => <StageGallery steps={steps} images={images} front={front} onPick={pick} />}
    </Walkthrough>
  );
}
