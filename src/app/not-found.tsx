import type { Metadata } from "next";
import { BackLink, SlimHeader } from "@/components/chrome/SlimHeader";
import { LaunchFoot } from "@/components/launch/LaunchChrome";
import { ArrowButton } from "@/components/ui/ArrowButton";
import styles from "@/components/launch/Launch.module.css";

export const metadata: Metadata = { title: "Page not found" };

/** Any address the site doesn't have: say so plainly and offer the way back. */
export default function NotFound() {
  return (
    <main id="main" className={styles.page}>
      <SlimHeader end={<BackLink href="/">Back to the site</BackLink>} />
      <section className={styles.gate}>
        <h1 className="display-m">This page isn&apos;t here.</h1>
        <p className={`lede ${styles.gateLede}`}>The link may be old, or the address mistyped. Everything FTI makes is a step away.</p>
        <ArrowButton href="/" live>
          Go to the home page
        </ArrowButton>
      </section>
      <LaunchFoot />
    </main>
  );
}
