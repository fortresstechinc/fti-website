import type { Metadata } from "next";

// Unlisted: kept out of search, and linked from nowhere on the site.
export const metadata: Metadata = {
  title: "Launch and Lunch",
  description: "An invitation to FTI's demo day.",
  robots: { index: false, follow: false },
};

export default function LaunchAndLunchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
