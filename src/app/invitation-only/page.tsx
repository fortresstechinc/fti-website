import type { Metadata } from "next";
import { contact } from "@/content/site";
import { Icon } from "@/components/icons";
import { LaunchFoot } from "@/components/launch/LaunchChrome";
import { SlimHeader } from "@/components/chrome/SlimHeader";
import button from "@/components/ui/ArrowButton.module.css";
import styles from "@/components/launch/Launch.module.css";

export const metadata: Metadata = {
  title: "By invitation",
  robots: { index: false, follow: false },
};

/**
 * Shown in place of Launch and Lunch to anyone without a valid invite (the
 * proxy rewrites to it). The code form goes back through the proxy as ?invite=.
 */
export default async function InvitationOnlyPage({ searchParams }: { searchParams: Promise<{ tried?: string }> }) {
  const tried = (await searchParams).tried === "1";
  return (
    <main id="main" className={styles.page}>
      <SlimHeader />
      <section className={styles.gate}>
        <h1 className="display-m">This page is by invitation.</h1>
        <p className={`lede ${styles.gateLede}`}>Open the link in your invitation, or enter your invitation code.</p>
        <form action="/launch-and-lunch" method="get" className={styles.gateForm}>
          <label htmlFor="invite" className="sr-only">
            Invitation code
          </label>
          <input
            id="invite"
            name="invite"
            className={styles.gateInput}
            placeholder="Invitation code"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            required
            aria-invalid={tried || undefined}
            aria-describedby={tried ? "invite-error" : undefined}
          />
          <button type="submit" className={`${button.button} ${button.dark}`}>
            <span>Open</span>
            <span className={button.chip}>
              <Icon name="arrow" size={14} />
            </span>
          </button>
        </form>
        {tried && (
          <p id="invite-error" className={styles.gateError}>
            That code didn&apos;t match an invitation. Check it and try again, or ask us for a new one.
          </p>
        )}
        <p className={styles.gateNote}>
          No invitation? Email <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      </section>
      <LaunchFoot />
    </main>
  );
}
