"use client";

import { useScroll } from "motion/react";
import { useRef } from "react";
import type { Product } from "@/content/products";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { ProductVisual } from "@/components/product/ProductVisual";
import styles from "./Spotlight.module.css";

export function Spotlight({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const night = product.ground === "night";
  // Only measured figures belong on the home page; blanks wait on the product page.
  // Confirmed figures only: guesses stay on the product pages until FTI confirms them.
  const stats = product.stats.filter((s) => s.value && !s.guess);

  return (
    <section ref={ref} id={`spotlight-${product.slug}`} className={styles.wrap} aria-labelledby={`spot-${product.slug}`}>
      <div className={`${styles.panel} ground-${product.ground}`}>
        <div className={styles.top}>
          <div className={styles.titleBlock}>
            <h2 id={`spot-${product.slug}`} className={`display-xl ${styles.name}`}>
              {product.name}
            </h2>
          </div>
          <div className={styles.story}>
            <p className="lede">{product.spotlight}</p>
            <ArrowButton href={`/${product.slug}`} tone={night ? "light" : "dark"}>
              Explore {product.name}
            </ArrowButton>
          </div>
        </div>

        <div className={styles.stage}>
          <ProductVisual product={product} stage="spotlight" progress={scrollYProgress} className={styles.visual} />
        </div>

        {stats.length > 0 && (
          <dl className={styles.stats}>
          {stats.map((s) => (
            <div key={s.label} className={`${styles.stat} ${night ? styles.statNight : ""}`}>
              <dt className={`label ${styles.statLabel}`}>{s.label}</dt>
              <dd className={styles.statValue}>{s.value}</dd>
            </div>
          ))}
          </dl>
        )}
      </div>
    </section>
  );
}
