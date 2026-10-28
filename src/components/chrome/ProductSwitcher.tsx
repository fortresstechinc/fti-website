import Link from "next/link";
import { products, type ProductSlug } from "@/content/products";
import styles from "./ProductSwitcher.module.css";

const GLYPH: Record<ProductSlug, React.ReactNode> = {
  lumen: <rect x="0.5" y="0.5" width="15" height="11" rx="2" fill="currentColor" />,
  anchor: (
    <>
      <rect x="2" y="4" width="12" height="8" rx="1.5" fill="currentColor" />
      <path d="M5 4V0M11 4V1" stroke="currentColor" strokeWidth="1.2" />
    </>
  ),
  bolt: (
    <>
      <path d="M15 1c-1 3-4 6-8 8l-2-2c2-4 5-7 10-6z" fill="currentColor" />
      <path d="M5 7L1 11" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  fist: (
    <>
      <rect x="6" y="1" width="4" height="10" rx="2" fill="currentColor" />
      <path d="M1 7h14" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
};

export function ProductSwitcher({ active }: { active: ProductSlug }) {
  return (
    <nav aria-label="Products" className={styles.switcher}>
      {products.map((p) => (
        <Link
          key={p.slug}
          href={`/${p.slug}`}
          aria-current={p.slug === active ? "page" : undefined}
          className={`label ${styles.item} ${p.slug === active ? styles.active : ""}`}
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
            {GLYPH[p.slug]}
          </svg>
          {p.name}
        </Link>
      ))}
    </nav>
  );
}
