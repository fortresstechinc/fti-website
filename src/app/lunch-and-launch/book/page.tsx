import type { Metadata } from "next";
import { lunchAndLaunch as lnl } from "@/content/lunch-and-launch";
import { Booking } from "@/components/booking/Booking";
import { LaunchFoot } from "@/components/launch/LaunchChrome";
import { BackLink, SlimHeader } from "@/components/chrome/SlimHeader";
import styles from "@/components/launch/Launch.module.css";

export const metadata: Metadata = { title: "Pick your date · Lunch and Launch" };

export default function BookPage() {
  const { booking } = lnl;
  return (
    <main id="main" className={styles.page}>
      <SlimHeader end={<BackLink href="/lunch-and-launch">The invitation</BackLink>} />
      <Booking
        heading={booking.heading}
        lede={booking.lede}
        steps={booking.steps}
        fallback="Can't find a date that works?"
        calendarUrl={booking.calendarUrl}
        calendarTitle="Lunch and Launch booking calendar"
        configuredIn="src/content/lunch-and-launch.ts"
      />
      <LaunchFoot />
    </main>
  );
}
