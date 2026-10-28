import { lunchAndLaunch as lnl } from "@/content/lunch-and-launch";
import { contact } from "@/content/site";
import { LaunchFoot } from "@/components/launch/LaunchChrome";
import { LaunchHero } from "@/components/launch/LaunchHero";
import { ArrowButton } from "@/components/ui/ArrowButton";
import styles from "@/components/launch/Launch.module.css";

const BOOK = "/lunch-and-launch/book";
const dev = process.env.NODE_ENV === "development";

/** The ruler's position for a clock time, as a share of the two-hour slot. */
const at = (time: string) => {
  const hours = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h + m / 60;
  };
  const first = hours(lnl.ticks[0]);
  return (hours(time) - first) / (hours(lnl.ticks[lnl.ticks.length - 1]) - first);
};

export default function LunchAndLaunchPage() {
  const { past } = lnl;
  // Supplied media only in production; marked slots for the rest in development.
  const photos = past.photos.filter((p) => p.src || dev);
  const showVideo = Boolean(past.video.src) || dev;
  const showPast = showVideo || photos.length > 0;

  return (
    <main id="main" className={styles.page}>
      <LaunchHero bookHref={BOOK} />

      <section className={styles.day} aria-labelledby="day-heading">
        <h2 id="day-heading" className="display-m">
          {lnl.dayHeading}
        </h2>
        <div className={styles.schedule}>
          <ol className={styles.blocks}>
            {lnl.day.map((d) => (
              <li
                key={d.title}
                className={styles.block}
                style={{ gridColumn: `${Math.round(at(d.start) * 8) + 1} / ${Math.round(at(d.end) * 8) + 1}` }}
              >
                <span className={`label ${styles.blockTime}`}>
                  {d.start} – {d.end}
                </span>
                <h3 className={styles.blockTitle}>{d.title}</h3>
                <p className={styles.blockBody}>{d.body}</p>
              </li>
            ))}
          </ol>
          {/* The scale under the schedule: a mark every half hour across the slot. */}
          <div className={styles.ruler} aria-hidden="true">
            {lnl.ticks.map((t) => (
              <span key={t} className={styles.tick} style={{ left: `${at(t) * 100}%` }}>
                <span className="label">{t}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {showPast && (
        <section className={styles.past} aria-labelledby="past-heading">
          <div className={styles.pastHead}>
            <h2 id="past-heading" className="display-m">
              {past.heading}
            </h2>
            <p className={styles.pastBody}>{past.body}</p>
          </div>
          <div className={styles.mosaic}>
            {showVideo && (
              <figure className={`${styles.tile} ${styles.tileVideo}`}>
                {past.video.src ? (
                  <video
                    className={styles.media}
                    src={past.video.src}
                    poster={past.video.poster ?? undefined}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-label={past.video.label}
                  />
                ) : (
                  <span className={`label ${styles.slot}`}>Video to come</span>
                )}
              </figure>
            )}
            {photos.map((p, i) => (
              <figure key={i} className={styles.tile}>
                {p.src ? (
                  // eslint-disable-next-line @next/next/no-img-element -- FTI's own photos, served as supplied
                  <img className={styles.media} src={p.src} alt={p.alt} loading="lazy" />
                ) : (
                  <span className={`label ${styles.slot}`}>Photo to come</span>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className={styles.details} aria-labelledby="details-heading">
        <h2 id="details-heading" className="display-m">
          The details
        </h2>
        <dl className={styles.detailList}>
          {lnl.details.map((d) => (
            <div key={d.label} className={styles.detailRow}>
              <dt className="label">{d.label}</dt>
              <dd>{d.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.closingWrap} aria-labelledby="closing-heading">
        <div className={styles.closing}>
          <h2 id="closing-heading" className="display-l">
            Pick the day that suits your team.
          </h2>
          <div className={styles.closingSide}>
            <ArrowButton href={BOOK} tone="light" live>
              Pick your date
            </ArrowButton>
            <p className={styles.closingNote}>
              Questions? Call <a href={contact.phone.href}>{contact.phone.display}</a> or email{" "}
              <a href={`mailto:${contact.email}`}>{contact.email}</a>.
            </p>
          </div>
        </div>
      </section>

      <LaunchFoot />
    </main>
  );
}
