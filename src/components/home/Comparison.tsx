import Link from "next/link";
import { compareRows, products } from "@/content/products";
import { Icon } from "@/components/icons";
import { CompareVisual } from "./CompareVisual";
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
                      <CompareVisual product={p} when="wide" className={styles.visual} />
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

      {/* Phones: one card per product with the same four facts, instead of a
          table to swipe across. */}
      <ul className={styles.cards}>
        {products.map((p) => (
          <li key={p.slug}>
            <Link href={`/${p.slug}`} className={styles.card}>
              <span className={`${styles.thumb} ground-${p.ground}`}>
                <CompareVisual product={p} when="narrow" className={styles.visual} />
              </span>
              <span className={styles.cardHead}>
                <span className={styles.cardName}>{p.name}</span>
                <span className={`muted ${styles.tagline}`}>{p.tagline}</span>
              </span>
              <span className={styles.cardGo} aria-hidden="true">
                <Icon name="arrow" size={14} />
              </span>
              <dl className={styles.facts}>
                {compareRows.map((row) => (
                  <div key={row.key} className={styles.fact}>
                    <dt className="label">{row.label}</dt>
                    <dd>{p.compare[row.key]}</dd>
                  </div>
                ))}
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
