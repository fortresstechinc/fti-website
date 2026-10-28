import type { Metadata } from "next";
import { launchAndLunch as lnl } from "@/content/launch-and-lunch";
import { Booking } from "@/components/booking/Booking";
import { LaunchFoot } from "@/components/launch/LaunchChrome";
import { BackLink, SlimHeader } from "@/components/chrome/SlimHeader";
import styles from "@/components/launch/Launch.module.css";

export const metadata: Metadata = { title: "Pick your date · Launch and Lunch" };

export default function BookPage() {
  const { booking } = lnl;
  return (
    <main id="main" className={styles.page}>
      <SlimHeader end={<BackLink href="/launch-and-lunch">The invitation</BackLink>} />
      <Booking
        heading={booking.heading}
        lede={booking.lede}
        steps={booking.steps}
        fallback="Can't find a date that works?"
        calendarUrl={booking.calendarUrl}
        calendarTitle="Launch and Lunch booking calendar"
        configuredIn="src/content/launch-and-lunch.ts"
      />
      <LaunchFoot />
    </main>
  );
}
