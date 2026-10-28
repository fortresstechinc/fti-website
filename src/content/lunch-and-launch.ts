// Lunch and Launch: FTI's invitation-only demo day. The pages live at
// /lunch-and-launch and are reachable only with an invite code (see src/proxy.ts).

export const lunchAndLaunch = {
  name: "Lunch and Launch",
  lede: "An FTI demo day. Watch us fly drones and launch rockets at our test site, then stay for lunch on us.",
  where: "Goshen, Utah",

  // From the agenda on FTI's GoHighLevel booking page (fortress-tech.com/launch-c):
  // 11am demo, 12pm lunch with the presentation and Q&A, in a two-hour slot.
  dayHeading: "Two hours at the launch site",
  day: [
    {
      start: "11:00",
      end: "12:00",
      title: "Launch",
      body: "A live drone and rocket demo at our launch site in Goshen, Utah.",
    },
    {
      start: "12:00",
      end: "13:00",
      title: "Lunch, presentation and Q&A",
      body: "Lunch is on us while we show where FTI is headed, then your questions for the engineers who built it.",
    },
  ],
  /** The ruler under the schedule: every half hour across the two-hour slot. */
  ticks: ["11:00", "11:30", "12:00", "12:30", "13:00"],

  /**
   * Footage and photos from earlier Lunch and Launch days, supplied by FTI.
   * Originals live in media/lunch-and-launch/; `npm run prepare:media` cuts
   * and sizes them into public/media/lunch-and-launch/. A slot whose `src` is
   * null shows a marked placeholder in development and is left out of the
   * production page.
   */
  past: {
    heading: "From past launches",
    body: "Earlier Lunch and Launch days at the Goshen launch site.",
    // The team on the field to the launch, cut to 16s (see scripts/prepare-media.sh).
    video: {
      src: "/media/lunch-and-launch/launch.mp4" as string | null,
      poster: "/media/lunch-and-launch/launch-poster.webp" as string | null,
      label: "The team waiting on the field at a past Lunch and Launch, then a rocket's trail climbing into the sky.",
    },
    // The first photo stands beside the footage, so it is the portrait one.
    photos: [
      { src: "/media/lunch-and-launch/guest.webp" as string | null, alt: "A guest at the launch site in a Freedom Isn't Free shirt." },
      { src: "/media/lunch-and-launch/arrival.webp" as string | null, alt: "Guests walking out across the sagebrush to the launch canopy." },
      { src: "/media/lunch-and-launch/watching.webp" as string | null, alt: "Guests gathered on the field, waiting for a launch." },
      { src: "/media/lunch-and-launch/briefing.webp" as string | null, alt: "The FTI team talking with guests under the canopy." },
    ],
  },

  details: [
    { label: "Where", value: "Launch site in Goshen, Utah · Location shared once you're approved" },
    { label: "When", value: "The date you choose · 11 am to 1 pm, Mountain Time" },
    { label: "Lunch", value: "Provided" },
    { label: "Cost", value: "None" },
    { label: "Who", value: "Invited guests" },
  ],

  booking: {
    heading: "Pick your date",
    lede: "Choose a day on the calendar, then add your details. Once your registration is approved, we'll send you the launch site's location.",
    steps: [
      { title: "Choose a day", body: "Open dates are shown on the calendar." },
      { title: "Add your details", body: "Tell us who's coming." },
      { title: "Watch your inbox", body: "Approval brings the location and the plan for the day." },
    ],
    /**
     * The GoHighLevel booking widget link, from the calendar's Share / Embed
     * code: the iframe's src, e.g.
     * "https://api.leadconnectorhq.com/widget/booking/AbCdEf123". Until it is
     * set, the page shows a placeholder where the calendar goes. This is the
     * "Lunch and Launch" calendar from fortress-tech.com/launch-c.
     */
    calendarUrl: "https://api.leadconnectorhq.com/widget/booking/DNATIyHTmw5nlkwEJKV4" as string | null,
  },
};
