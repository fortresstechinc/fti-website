"use client";

import type { MotionValue } from "motion/react";
import type { Product } from "@/content/products";
import { LumenScreen } from "@/components/lumen/LumenScreen";
import { ProductView } from "@/components/three/ProductView";
import type { Stage } from "@/components/three/ProductModel";

/** Lumen shows its live interface; the hardware renders as a 3D model. */
export function ProductVisual({
  product,
  stage,
  progress,
  className,
}: {
  product: Product;
  stage: Stage;
  progress?: MotionValue<number>;
  className?: string;
}) {
  if (product.slug === "lumen") {
    return <LumenScreen className={className} compact={stage === "card"} />;
  }
  return (
    <ProductView
      slug={product.slug}
      stage={stage}
      progress={progress}
      className={className}
      night={product.ground === "night"}
      label={`${product.name}, 3D model. Drag to turn.`}
    />
  );
}
