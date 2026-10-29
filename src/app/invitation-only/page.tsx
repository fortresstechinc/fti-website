import type { Metadata } from "next";
import { Suspense } from "react";
import { contact } from "@/content/site";
import { LaunchFoot } from "@/components/launch/LaunchChrome";
import { GateFields, GateForm } from "@/components/launch/GateForm";
import { SlimHeader } from "@/components/chrome/SlimHeader";
import styles from "@/components/launch/Launch.module.css";

export const metadata: Metadata = {
  title: "By invitation",
  robots: { index: false, follow: false },
};

/**
 * Shown in place of Lunch and Launch to anyone without a valid invite (the
 * proxy rewrites to it). The code form goes back through the proxy as ?invite=.
 */
export default function InvitationOnlyPage() {
  return (
    <main id="main" className={styles.page}>
      <SlimHeader />
      <section className={styles.gate}>
        <h1 className="display-m">This page is by invitation.</h1>
        <p className={`lede ${styles.gateLede}`}>Open the link in your invitation, or enter your invitation code.</p>
        <Suspense fallback={<GateFields />}>
          <GateForm />
        </Suspense>
        <p className={styles.gateNote}>
          No invitation? Email <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      </section>
      <LaunchFoot />
    </main>
  );
}
