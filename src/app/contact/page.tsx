import type { Metadata } from "next";
import { productBySlug } from "@/content/products";
import { briefing } from "@/content/site";
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
 * GoHighLevel calendar. A product's "Request full specs" arrives with ?about=.
 */
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ about?: string }> }) {
  const product = productBySlug((await searchParams).about ?? "");
  const lede = product
    ? `Thirty minutes with the FTI team. Book a time and we'll take you through ${product.name}'s full specifications, and how it fits the rest of the system.`
    : briefing.lede;

  return (
    <main id="main">
      {/* Just the mark and a way back: the site nav and its Contact button would only lead here. */}
      <SlimHeader
        end={<BackLink href={product ? `/${product.slug}` : "/"}>{product ? `Back to ${product.name}` : "Back to the site"}</BackLink>}
      />
      <div className={styles.siteBody}>
        <Booking
          heading={briefing.heading}
          lede={lede}
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
