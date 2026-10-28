import Script from "next/script";
import { contact } from "@/content/site";
import styles from "./Booking.module.css";

export type BookingStep = { title: string; body: string };

type Props = {
  heading: string;
  lede: React.ReactNode;
  steps: readonly BookingStep[];
  /** Opens the line under the steps, before the phone and email. */
  fallback: string;
  /** The GoHighLevel booking widget link (the embed iframe's src), or null for a placeholder. */
  calendarUrl: string | null;
  calendarTitle: string;
  /** Where the link is set, named in the placeholder during development. */
  configuredIn: string;
};

/**
 * A booking page's body: a sticky intro beside a GoHighLevel calendar. Picking
 * a time leads into the calendar's own form and confirmation, set in GHL.
 */
export function Booking({ heading, lede, steps, fallback, calendarUrl, calendarTitle, configuredIn }: Props) {
  // GoHighLevel's resize script finds its iframe by the calendar's id.
  const calendarId = calendarUrl?.split("/").filter(Boolean).pop();

  return (
    <section className={styles.book}>
      <div className={styles.bookIntro}>
        <h1 className="display-l">{heading}</h1>
        <p className={`lede ${styles.bookLede}`}>{lede}</p>
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li key={s.title} className={styles.step}>
              <span className={`label ${styles.stepCount}`}>{i + 1}</span>
              <div>
                <p className={styles.stepTitle}>{s.title}</p>
                <p className={styles.stepBody}>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className={styles.bookNote}>
          {fallback} Call <a href={contact.phone.href}>{contact.phone.display}</a> or email{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      </div>

      <div className={styles.calendar}>
        {calendarUrl ? (
          <>
            <iframe src={calendarUrl} id={`${calendarId}_fti`} title={calendarTitle} className={styles.calendarFrame} scrolling="no" />
            <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
          </>
        ) : (
          <div className={styles.calendarEmpty}>
            <span className="label">Calendar</span>
            {process.env.NODE_ENV === "development" ? (
              <p>
                The GoHighLevel calendar appears here once its booking link is set as <code>calendarUrl</code> in{" "}
                <code>{configuredIn}</code>.
              </p>
            ) : (
              <p>Booking opens shortly. To pick a time now, call or email us.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
