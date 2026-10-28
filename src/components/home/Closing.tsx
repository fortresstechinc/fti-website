import { contact, dispatches } from "@/content/site";
import { ArrowButton } from "@/components/ui/ArrowButton";
import styles from "./Closing.module.css";

export function Careers() {
  return (
    <section id="careers" className={styles.careers} aria-labelledby="careers-heading">
      <h2 id="careers-heading" className="display-l">
        Join the team.
      </h2>
      <div className={styles.careersBody}>
        <p className="muted">
          We are a small team of engineers, builders and operators shipping software and hardware that has to work the first time. Flight software,
          fusion, embedded and field roles open now.
        </p>
        <ArrowButton href={`mailto:${contact.email}?subject=Careers`}>View open roles</ArrowButton>
      </div>
    </section>
  );
}

export function Dispatches() {
  return (
    <section id="dispatches" className={styles.dispatches} aria-labelledby="dispatches-heading">
      <h2 id="dispatches-heading" className={`display-m ${styles.dispatchTitle}`}>
        Dispatches
      </h2>
      <ul className={styles.list}>
        {dispatches.map((d, i) => (
          <li key={d.title} className={styles.row}>
            <span className={`label ${d.live ? styles.tagLive : styles.tag}`}>{d.tag}</span>
            <span className={styles.rowTitle}>{d.title}</span>
            <span className={`label ${styles.date}`}>{d.date}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
