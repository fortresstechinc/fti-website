import type { Metadata } from "next";

// Invitation only: kept out of search, and linked from nowhere on the site.
export const metadata: Metadata = {
  title: "Lunch and Launch",
  description: "An invitation to FTI's demo day.",
  robots: { index: false, follow: false },
};

export default function LunchAndLaunchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
