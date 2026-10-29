import type { Metadata } from "next";
import { Suspense } from "react";
import { briefing } from "@/content/site";
import { AboutBack, AboutLede } from "@/components/booking/AboutProduct";
import { Booking } from "@/components/booking/Booking";
import { ContactFooter } from "@/components/chrome/ContactFooter";
import { BackLink, SlimHeader } from "@/components/chrome/SlimHeader";
import styles from "@/components/booking/Booking.module.css";

export const metadata: Metadata = {
  title: "Book a briefing",
  description: "Book a 30-minute briefing with FTI on counter-drone defence for your site.",
};

/**
 * Where every sales action on the site leads: a briefing call booked on FTI's
 * GoHighLevel calendar. A product's "Request full specs" arrives with ?about=,
 * read in the browser so the page is served as a static file.
 */
export default function ContactPage() {
  return (
    <main id="main">
      {/* Just the mark and a way back: the site nav and its Contact button would only lead here. */}
      <SlimHeader
        end={
          <Suspense fallback={<BackLink href="/">Back to the site</BackLink>}>
            <AboutBack />
          </Suspense>
        }
      />
      <div className={styles.siteBody}>
        <Booking
          heading={briefing.heading}
          lede={
            <Suspense fallback={briefing.lede}>
              <AboutLede />
            </Suspense>
          }
          steps={briefing.steps}
          fallback="Rather talk now?"
          calendarUrl={briefing.calendarUrl}
          calendarTitle="FTI briefing call calendar"
          configuredIn="src/content/site.ts"
        />
      </div>
      <ContactFooter cta={false} />
    </main>
  );
}
