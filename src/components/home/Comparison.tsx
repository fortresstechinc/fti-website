import Link from "next/link";
import { compareRows, products } from "@/content/products";
import { ProductVisual } from "@/components/product/ProductVisual";
import styles from "./Comparison.module.css";

export function Comparison() {
  return (
    <section
      id="products"
      className={styles.section}
      aria-labelledby="compare-heading"
    >
      <div className={styles.header}>
        <h2 id="compare-heading" className={`display-l ${styles.title}`}>
          Our Products
        </h2>
        <p className="muted lede">
          Software that decides, a brain in a box that runs it, and two
          interceptors: BOLT handles the volume, and FIST takes out the priority
          target.
        </p>
      </div>

      {/* One table for the product heads and the rows, so every value sits
          under its product by construction. */}
      <div className={styles.scroller}>
        <table className={styles.table}>
          <caption className="sr-only">How the four products compare</caption>
          <colgroup>
            <col className={styles.keyCol} />
            {products.map((p) => (
              <col key={p.slug} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <td />
              {products.map((p) => (
                <th key={p.slug} scope="col" className={styles.head}>
                  <Link href={`/${p.slug}`} className={styles.headLink}>
                    <span className={`${styles.image} ground-${p.ground}`}>
                      <ProductVisual
                        product={p}
                        stage="card"
                        className={styles.visual}
                      />
                    </span>
                    <span className={styles.name}>{p.name}</span>
                    <span className={`muted ${styles.tagline}`}>
                      {p.tagline}
                    </span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row) => (
              <tr key={row.key}>
                <th scope="row" className="label">
                  {row.label}
                </th>
                {products.map((p) => (
                  <td key={p.slug} className="label">
                    {p.compare[row.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
