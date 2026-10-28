"use client";

import { ContactShadows, Environment, Lightformer, PerspectiveCamera, PresentationControls, View } from "@react-three/drei";
import { useReducedMotion, type MotionValue } from "motion/react";
import { Suspense } from "react";
import { LaunchTube, ProductModel, type ModelSlug, type Stage } from "./ProductModel";

// Hero distances are set so every product fills a similar share of the stage
// (about half its height), matching the Lumen tablet beside them.
const CAMERA: Record<Stage, Record<ModelSlug, [number, number, number]>> = {
  hero: { bolt: [0, 0.15, 6.8], fist: [0, 0.15, 4.3], anchor: [0, 0.98, 3.75] },
  card: { bolt: [0, 0, 4.4], fist: [0, 0, 4.6], anchor: [0, 0.35, 4.2] },
  spotlight: { bolt: [0, 0, 4.2], fist: [0, 0, 4.3], anchor: [0, 0.4, 3.9] },
};

type Props = {
  slug: ModelSlug;
  stage: Stage;
  progress?: MotionValue<number>;
  className?: string;
  /** Night grounds get a cooler, brighter rim so black forms still read. */
  night?: boolean;
  label: string;
};

/**
 * A rectangle on the page that the shared canvas renders a product into.
 * Drag to turn the product; it springs back to its choreographed pose.
 */
export function ProductView({ slug, stage, progress, className, night = false, label }: Props) {
  const reduced = useReducedMotion() ?? false;
  const cam = CAMERA[stage][slug];
  return (
    <div className={className} role="img" aria-label={label}>
    <View style={{ width: "100%", height: "100%", touchAction: "pan-y" }}>
      <PerspectiveCamera makeDefault position={cam} fov={30} onUpdate={(c) => c.lookAt(0, stage === "hero" && slug === "anchor" ? -0.05 : 0, 0)} />
      <ambientLight intensity={night ? 0.45 : 0.5} />
      <directionalLight position={[3.5, 5, 4]} intensity={night ? 3.2 : 2.6} color="#fff1e2" castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={night ? 3.2 : 1.6} color="#c9d8ea" />
      {night && (
        <>
          {/* Raking side lights: on a night ground, matte black needs light across
              its sides, not just behind it, for its form and edges to read. */}
          <directionalLight position={[-5, 1.5, 0.6]} intensity={stage === "card" ? 4.2 : 3.4} color="#d6e4f2" />
          <directionalLight position={[5, 0.8, 0.8]} intensity={stage === "card" ? 3.2 : 2.6} color="#ffd9b8" />
          {/* Cards render small, so a soft front fill lifts the form a little more. */}
          {stage === "card" && <directionalLight position={[1, 1.5, 6]} intensity={1.6} color="#eef2f6" />}
        </>
      )}
      <Environment resolution={256} frames={1}>
        {/* A soft dawn studio: warm key overhead, cool rims, a low horizon glow. */}
        <Lightformer form="rect" intensity={3} color="#fff4e8" position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={night ? 7 : 2.4} color="#d6e4f2" position={[-5, 1, -2]} rotation-y={Math.PI / 2.4} scale={[2, 8, 1]} />
        <Lightformer form="rect" intensity={night ? 5.5 : 1.8} color="#ffe1c2" position={[5, 0.5, 1]} rotation-y={-Math.PI / 2.2} scale={[1.2, 6, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#f2c9a0" position={[0, -2, -6]} scale={6} />
        {/* A low, soft front panel: gives anodised faces a sheen and edges a highlight. */}
        <Lightformer form="rect" intensity={night ? 2.6 : 1.2} color="#eef2f6" position={[0, 0.4, 6]} scale={[6, 2.4, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <PresentationControls
          enabled={!reduced}
          global={false}
          cursor
          snap
          speed={1.4}
          rotation={[0, 0, 0]}
          polar={[-0.25, 0.35]}
          azimuth={[-Math.PI / 2.5, Math.PI / 2.5]}
        >
          <ProductModel slug={slug} stage={stage} progress={progress} reduced={reduced} />
          {stage === "hero" && slug === "bolt" && <LaunchTube />}
        </PresentationControls>
        {stage === "hero" && (
          <ContactShadows
            position={[0, slug === "bolt" ? -1.47 : slug === "fist" ? -0.85 : -0.56, 0]}
            opacity={night ? 0.55 : 0.38}
            scale={6}
            blur={2.6}
            far={2.4}
            frames={reduced ? 1 : Infinity}
          />
        )}
      </Suspense>
    </View>
    </div>
  );
}
