"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Product } from "@/content/products";
import { ProductSwitcher } from "@/components/chrome/ProductSwitcher";
import { TopNav } from "@/components/chrome/TopNav";
import { LumenScreen } from "@/components/lumen/LumenScreen";
import { ProductView } from "@/components/three/ProductView";
import styles from "./ProductHero.module.css";

/**
 * The hero pins while the visitor scrolls through it, giving each product room
 * to perform: BOLT leaves its tube, FIST transitions to forward flight, the
 * Anchor turns, and Lumen's screen tilts up to face the reader.
 */
export function ProductHero({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const night = product.ground === "night";

  const tilt = useTransform(scrollYProgress, [0, 0.7], [16, 0]);
  const lift = useTransform(scrollYProgress, [0, 0.7], [0.9, 1]);
  // The name shrinks toward its top-left corner as the product takes the stage.
  // Anchored there, it never rises into the header above it.
  const nameScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.56]);

  return (
    <section
      ref={ref}
      className={`${styles.hero} ground-${product.ground} ${night ? styles.night : ""} ${product.slug === "bolt" || product.slug === "fist" ? styles.launch : ""}`}
      aria-labelledby="product-name"
    >
      <div className={styles.sticky}>
        <TopNav tone={night ? "dark" : "light"} />
        <div className={styles.titleRow}>
          <motion.h1 id="product-name" className={styles.name} style={reduce ? undefined : { scale: nameScale }}>
            {product.name}
          </motion.h1>
          <p className={`lede ${styles.lede}`}>{product.lede}</p>
        </div>

        <div className={styles.stage}>
          {product.slug === "lumen" ? (
            <div className={styles.lumenWrap}>
              <motion.div className={styles.lumenTilt} style={reduce ? undefined : { rotateX: tilt, scale: lift }}>
                <LumenScreen className={styles.lumen} />
              </motion.div>
            </div>
          ) : (
            <ProductView
              slug={product.slug}
              stage="hero"
              progress={scrollYProgress}
              className={styles.view}
              night={night}
              label={`${product.name}, 3D model. Scroll to watch it move; drag to turn it.`}
            />
          )}
        </div>

        <div className={styles.switcher}>
          <ProductSwitcher active={product.slug} />
        </div>
      </div>
    </section>
  );
}
