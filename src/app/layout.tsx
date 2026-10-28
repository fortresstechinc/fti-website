import type { Metadata, Viewport } from "next";
import { B612_Mono, Geist, Newsreader } from "next/font/google";
import { Intro } from "@/components/chrome/Intro";
import { introScript } from "@/components/chrome/intro-script";
import { whereScript } from "@/components/home/where-script";
import { Providers } from "@/components/chrome/Providers";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-newsreader",
  display: "swap",
});
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
// The small-text face: drawn for Airbus cockpit displays, read at a glance.
const b612Mono = B612_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-b612-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "FTI · The Low Sky, Defended", template: "%s · FTI" },
  description:
    "FTI builds a low-cost, edge-native counter-drone system for small units: Lumen C2 inside ATAK, the Anchor edge computer, and the BOLT and FIST interceptors.",
};

export const viewport: Viewport = {
  themeColor: "#e8edf1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The head script may mark <html> before React hydrates; the DOM wins.
    <html lang="en" className={`${newsreader.variable} ${geist.variable} ${b612Mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        {/* The home map: ask for the location and open the tile server while the intro plays. */}
        <script dangerouslySetInnerHTML={{ __html: whereScript }} />
        <link rel="preconnect" href="https://tiles.openfreemap.org" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Providers>
          <Intro />
          {children}
        </Providers>
      </body>
    </html>
  );
}
