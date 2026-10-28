import { products } from "@/content/products";
import { ContactFooter } from "@/components/chrome/ContactFooter";
import { RailNav } from "@/components/chrome/RailNav";
import { Careers, Dispatches } from "@/components/home/Closing";
import { dispatches } from "@/content/site";
import { Comparison } from "@/components/home/Comparison";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhatWeDefend } from "@/components/home/WhatWeDefend";
import { Spotlight } from "@/components/home/Spotlight";
import { ThreatStatement } from "@/components/home/ThreatStatement";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <ThreatStatement />
        <HowItWorks />
        <WhatWeDefend />
        <Comparison />
        {products.map((p) => (
          <Spotlight key={p.slug} product={p} />
        ))}
        <Careers />
        {dispatches.length > 0 && <Dispatches />}
        <ContactFooter />
      </main>
      <RailNav />
    </>
  );
}
