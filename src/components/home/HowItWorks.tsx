"use client";

import { howItWorks } from "@/content/site";
import { SceneGuide } from "@/components/guide/SceneGuide";
import { Walkthrough } from "@/components/guide/Walkthrough";
import { SYSTEM_GUIDE, SystemDiagram } from "./SystemDiagram";
import styles from "./HowItWorks.module.css";

/**
 * Track: the LUMEN Dome, in one simple scene walked by scroll. The night panel
 * rises over the threat section's closing line like the next card in a stack,
 * then pins while the scroll walks its stages. The scene itself is unchanged.
 */
export function HowItWorks() {
  const { steps } = howItWorks;
  return (
    <Walkthrough
      id="how-it-works"
      mission={howItWorks.mission}
      heading={howItWorks.heading}
      lede={howItWorks.lede}
      count={steps.length}
      className={styles.wrap}
    >
      {(front, pick, still) => (
        <SceneGuide steps={steps} markers={SYSTEM_GUIDE.markers} size={SYSTEM_GUIDE.size} label={howItWorks.label} front={front} onPick={pick}>
          {(stage) => <SystemDiagram stage={stage} still={still} />}
        </SceneGuide>
      )}
    </Walkthrough>
  );
}
