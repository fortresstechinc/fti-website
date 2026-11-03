import { ArrowButton } from "@/components/ui/ArrowButton";
import { denyMission, strikeMission } from "@/content/site";
import styles from "./Missions.module.css";

/**
 * Deny and Strike, the two missions after Track. Same header pattern as the
 * comparison, the same mono label as Track, and no motion of their own.
 * SPEAR has no page, so it has no link and no figures.
 */
export function Missions() {
  return (
    <>
      <section id={denyMission.id} className={styles.section} aria-labelledby="deny-heading">
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <p className={`label ${styles.mission}`}>{denyMission.mission}</p>
            <h2 id="deny-heading" className={`display-l ${styles.title}`}>
              {denyMission.heading}
            </h2>
          </div>
          <p className="muted lede">{denyMission.lede}</p>
        </div>
        <div className={styles.grid}>
          {denyMission.products.map((product) => (
            <article key={product.name} className={styles.card}>
              <h3 className={styles.name}>{product.name}</h3>
              <p className={`muted ${styles.body}`}>{product.body}</p>
              <ArrowButton href={product.href}>Explore {product.name}</ArrowButton>
            </article>
          ))}
        </div>
      </section>

      <section id={strikeMission.id} className={styles.section} aria-labelledby="strike-heading">
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <p className={`label ${styles.mission}`}>{strikeMission.mission}</p>
            <h2 id="strike-heading" className={`display-l ${styles.title}`}>
              {strikeMission.heading}
            </h2>
          </div>
          <p className="muted lede">{strikeMission.lede}</p>
        </div>
        <div className={styles.grid}>
          <article className={styles.card}>
            <h3 className={styles.name}>{strikeMission.name}</h3>
            <p className={`muted ${styles.body}`}>{strikeMission.body}</p>
          </article>
        </div>
      </section>
    </>
  );
}
