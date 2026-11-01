"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/content/products";
import { ProductVisual } from "@/components/product/ProductVisual";

const NARROW = "(max-width: 900px)";

/**
 * A comparison-table visual, rendered only on wide screens: phones hide the
 * table, so no model draws into a hidden box.
 */
export function CompareVisual({ product, when, className }: { product: Product; when: "wide" | "narrow"; className?: string }) {
  const [narrow, setNarrow] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  if (narrow === null || narrow !== (when === "narrow")) return null;
  return <ProductVisual product={product} stage="card" className={className} />;
}
