import type { ModelSlug } from "./ProductModel";
import styles from "./ModelPoster.module.css";

/** A still of the product, shown only when the browser cannot start WebGL. */
export function ModelPoster({ slug }: { slug: ModelSlug }) {
  return <img className={styles.poster} src={`/models/posters/${slug}.webp`} alt="" draggable={false} />;
}
