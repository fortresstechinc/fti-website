"use client";

import type { Product, ProductWalk } from "@/content/products";
import { SceneGuide } from "@/components/guide/SceneGuide";
import { StageGallery } from "@/components/guide/StageGallery";
import { Walkthrough } from "@/components/guide/Walkthrough";
import { BOLT_GUIDE, BoltDiagram } from "./BoltDiagram";
import { FIST_GUIDE, FistDiagram } from "./FistDiagram";
import { LUMEN_GUIDE, LumenDiagram } from "./LumenDiagram";

const scenes = {
  lumen: { guide: LUMEN_GUIDE, Diagram: LumenDiagram },
  bolt: { guide: BOLT_GUIDE, Diagram: BoltDiagram },
  fist: { guide: FIST_GUIDE, Diagram: FistDiagram },
} as const;

/**
 * How one product works, walked by scroll. LUMEN, BOLT and FIST use the home
 * page's pinned scene. The Anchor keeps its illustration gallery.
 */
export function ProductWalkthrough({ product }: { product: Product }) {
  const walk = product.walkthrough;
  if (walk.kind === "scene") return <ProductScene product={product} walk={walk} />;

  const images = walk.steps.map((s, i) => ({ src: `/illustrations/${product.slug}-${i + 1}.svg`, alt: s.picture }));
  return (
    <Walkthrough id="how-it-works" heading={product.tagline} count={walk.steps.length}>
      {(front, pick) => <StageGallery steps={walk.steps} images={images} front={front} onPick={pick} />}
    </Walkthrough>
  );
}

function ProductScene({ product, walk }: { product: Product; walk: Extract<ProductWalk, { kind: "scene" }> }) {
  if (product.slug !== "lumen" && product.slug !== "bolt" && product.slug !== "fist") return null;
  const scene = scenes[product.slug];
  const Diagram = scene.Diagram;
  return (
    <Walkthrough id="how-it-works" mission={walk.mission} heading={product.tagline} lede={walk.lede} count={walk.steps.length}>
      {(front, pick, still) => (
        <SceneGuide steps={walk.steps} markers={scene.guide.markers} size={scene.guide.size} label={walk.label} front={front} onPick={pick}>
          {(stage) => <Diagram stage={stage} still={still} />}
        </SceneGuide>
      )}
    </Walkthrough>
  );
}
