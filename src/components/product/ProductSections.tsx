import Link from "next/link";
import { products, type Product } from "@/content/products";
import { Icon } from "@/components/icons";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { ProductVisual } from "./ProductVisual";
import styles from "./ProductSections.module.css";

/** An empty slot naming what FTI still needs to send. */
function Blank({ need, className }: { need: string; className?: string }) {
  return (
    <span className={`${styles.blank} ${className ?? ""}`}>
      <span className="label">To upload</span>
      <span className="sr-only">: {need}</span>
    </span>
  );
}

/** The reference: headline figures, then the hard facts, then a way to ask for more. */
export function Specs({ product }: { product: Product }) {
  return (
    <section className={styles.specs} aria-labelledby="specs-heading">
      <div className={styles.specsHead}>
        <h2 id="specs-heading" className="display-m">
          Specifications
        </h2>
        <Link className={styles.request} href={`/contact?about=${product.slug}`}>
          <span className="label">Request full specs</span>
          <Icon name="arrow" size={16} />
        </Link>
      </div>
      <div className={styles.sheet}>
        <dl className={styles.figures}>
          {product.stats.map((s) => (
            <div key={s.label} className={styles.figure}>
              <dt className="label">{s.label}</dt>
              <dd className={styles.figureValue}>{s.value ?? <Blank need={s.label} className={styles.figureBlank} />}</dd>
            </div>
          ))}
        </dl>
        <dl className={styles.specList}>
          {product.specs.map((s) => (
            <div key={s.label} className={styles.specRow}>
              <dt className="label">{s.label}</dt>
              <dd className="label">{s.value ?? <Blank need={s.label} />}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function CloseTheLoop({ product }: { product: Product }) {
  const others = products.filter((p) => p.slug !== product.slug);
  return (
    <section className={styles.loop} aria-labelledby="loop-heading">
      <div className={styles.loopHead}>
        <h2 id="loop-heading" className="display-m">
          Close the loop
        </h2>
        <p className="muted">{product.closing}</p>
      </div>
      <ul className={styles.loopCards}>
        {others.map((p) => (
          <li key={p.slug}>
            <Link href={`/${p.slug}`} className={styles.loopCard}>
              <div className={`${styles.loopImage} ground-${p.ground}`}>
                <ProductVisual product={p} stage="card" className={styles.loopVisual} />
              </div>
              <div className={styles.loopMeta}>
                <div>
                  <h3 className={styles.loopName}>{p.name}</h3>
                  <p className="muted">{p.loopLine}</p>
                </div>
                <span className={styles.loopArrow} aria-hidden="true">
                  <Icon name="arrow" size={14} />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.loopCta}>
        <ArrowButton href="/#how-it-works" tone="dark">
          See the whole loop
        </ArrowButton>
      </div>
    </section>
  );
}
