"use client";

import { ArrowButton } from "@/components/ui/ArrowButton";
import { SceneGuide } from "@/components/guide/SceneGuide";
import { Walkthrough } from "@/components/guide/Walkthrough";
import { denyMission, strikeMission } from "@/content/site";
import { DENY_GUIDE, DenyDiagram } from "./DenyDiagram";
import { STRIKE_GUIDE, StrikeDiagram } from "./StrikeDiagram";

/**
 * Deny and Strike, the two missions after Track. The same night panel and the
 * same scroll-walked scene. SPEAR has no page, so Strike has no link.
 */
export function Missions() {
  return (
    <>
      <Walkthrough
        id={denyMission.id}
        mission={denyMission.mission}
        heading={denyMission.heading}
        lede={denyMission.lede}
        count={denyMission.steps.length}
        actions={denyMission.products.map((product) => (
          <ArrowButton key={product.name} href={product.href} tone="light">
            Explore {product.name}
          </ArrowButton>
        ))}
      >
        {(front, pick, still) => (
          <SceneGuide
            steps={denyMission.steps}
            markers={DENY_GUIDE.markers}
            size={DENY_GUIDE.size}
            label={denyMission.label}
            front={front}
            onPick={pick}
          >
            {(stage) => <DenyDiagram stage={stage} still={still} />}
          </SceneGuide>
        )}
      </Walkthrough>

      <Walkthrough
        id={strikeMission.id}
        mission={strikeMission.mission}
        heading={strikeMission.heading}
        lede={strikeMission.lede}
        count={strikeMission.steps.length}
      >
        {(front, pick, still) => (
          <SceneGuide
            steps={strikeMission.steps}
            markers={STRIKE_GUIDE.markers}
            size={STRIKE_GUIDE.size}
            label={strikeMission.label}
            front={front}
            onPick={pick}
          >
            {(stage) => <StrikeDiagram stage={stage} still={still} />}
          </SceneGuide>
        )}
      </Walkthrough>
    </>
  );
}
