"use client";

import { RoundedBox, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { ProductSlug } from "@/content/products";
import { applyPrintFinish } from "./printFinish";

export type ModelSlug = Exclude<ProductSlug, "lumen">;
export type Stage = "hero" | "card" | "spotlight";

const URL: Record<ModelSlug, string> = {
  bolt: "/models/bolt.glb",
  fist: "/models/fist.glb",
  anchor: "/models/anchor.glb",
};

/** Height each model is normalised to, in scene units. */
const SIZE: Record<ModelSlug, number> = { bolt: 1.5, fist: 1.5, anchor: 1.25 };

/**
 * BOLT's launch tube in the hero, in model space. The fins sit on the diagonals
 * and span 0.308 square, so with the round unrolled they pass through the
 * 0.33 mouth; the walls are thin to keep the tube close to its slim proportion.
 */
export const TUBE = { x: -0.55, y: -0.62, height: 1.7, width: 0.36, mouth: 0.33, radius: 0.012 };
const TUBE_TOP = TUBE.y + TUBE.height / 2;

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Clones the model, applies the print finish, and recentres it at the origin. */
export function usePrepared(slug: ModelSlug) {
  const { scene } = useGLTF(URL[slug]);
  return useMemo(() => {
    const root = scene.clone(true);
    root.updateMatrixWorld(true);
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
      if (mat.name === "pla") {
        // BOLT geometry is in millimetres with Z as its long axis; FIST is metres, Y up.
        // Both models print along +Y in metres. Layers are drawn coarser than a
        // real 0.2 mm print so they still read on screen; they fade when small.
        // BOLT renders larger relative to its size, so it takes a finer, shallower layer.
        applyPrintFinish(
          mat,
          slug === "bolt"
            ? { toModel: mesh.matrixWorld.clone(), spacing: 0.0028, depth: 0.14 }
            : { toModel: mesh.matrixWorld.clone(), spacing: 0.01, depth: 0.32 },
        );
      }
      if (mat.name === "anodized") {
        // For metals the base colour is the reflection tint: black anodising
        // reflects a dark grey sheen, which the matte silicone corners never do.
        mat.color.setRGB(0.075, 0.078, 0.086);
        mat.metalness = 0.92;
        mat.roughness = 0.36;
      }
      mesh.material = mat;
    });
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = SIZE[slug] / Math.max(size.x, size.y, size.z);
    const wrapper = new THREE.Group();
    root.position.set(-center.x, -center.y, -center.z);
    wrapper.add(root);
    wrapper.scale.setScalar(scale);

    // FIST: pivot each propeller about its own motor axis so it can spin.
    const props: THREE.Group[] = [];
    if (slug === "fist") {
      wrapper.updateMatrixWorld(true);
      const groups: THREE.Object3D[] = [];
      root.traverse((o) => o.name.startsWith("prop_") && groups.push(o));
      for (const g of groups) {
        const c = new THREE.Box3().setFromObject(g).getCenter(new THREE.Vector3());
        const pivot = new THREE.Group();
        g.parent!.add(pivot);
        pivot.position.copy(g.parent!.worldToLocal(c.clone()));
        pivot.attach(g);
        props.push(pivot);
      }
    }

    return { object: wrapper, props, height: size.y * scale };
  }, [scene, slug]);
}

type Props = {
  slug: ModelSlug;
  stage: Stage;
  /** 0..1 scroll progress through the owning section. */
  progress?: MotionValue<number>;
  reduced?: boolean;
};

export function ProductModel({ slug, stage, progress, reduced = false }: Props) {
  const { object, props } = usePrepared(slug);
  const group = useRef<THREE.Group>(null);
  const born = useRef<number | null>(null);
  /** BOLT's and FIST's hero launch eases after the scroll rather than snapping to it. */
  const eased = useRef<number | null>(null);
  // A clipping plane at the tube's mouth, kept in the tube's frame (so dragging
  // the model carries it along) and copied to world space each frame.
  const clip = useMemo(() => ({ local: new THREE.Plane(new THREE.Vector3(0, 1, 0), -TUBE_TOP), world: new THREE.Plane() }), []);
  const clipsInTube = slug === "bolt" && stage === "hero";

  useLayoutEffect(() => {
    if (!clipsInTube) return;
    const set = (planes: THREE.Plane[] | null) =>
      object.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) (mesh.material as THREE.Material).clippingPlanes = planes;
      });
    set([clip.world]);
    return () => set(null);
  }, [object, clipsInTube, clip]);

  useLayoutEffect(() => {
    born.current = null;
    eased.current = null;
    // Roll about the model's own axis first, then yaw, then pitch onto the path.
    if (group.current) group.current.rotation.order = "ZYX";
  }, [slug, stage]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    if (born.current === null) born.current = t;
    const age = t - born.current;
    const raw = reduced ? 0.55 : clamp01(progress?.get() ?? 0);
    // The launches follow the scroll with a short lag (about 0.3s to settle), so a
    // quick flick of the wheel plays out instead of firing the round off at once.
    const launch = stage === "hero" && (slug === "bolt" || slug === "fist") && !reduced;
    if (eased.current === null || !launch) eased.current = raw;
    else eased.current += (raw - eased.current) * (1 - Math.exp(-delta * 7));
    const p = eased.current;
    const intro = reduced ? 1 : smooth(clamp01(age / 1.4));

    if (slug === "fist") {
      // Propellers: idle on the ground, up to full speed in flight.
      const spin = (stage === "hero" ? lerp(9, 26, p) : 14) * delta;
      props.forEach((pv, i) => (pv.rotation.y += i % 2 === 0 ? spin : -spin));
    }

    if (stage !== "hero") {
      // Cards: a slow, steady turntable. Spotlights: the product turns as its
      // panel scrolls past. Both hold a fixed presentation tilt.
      g.rotation.y = reduced ? 0.6 : stage === "card" ? t * 0.35 : lerp(-0.9, 1.3, smooth(p)) + Math.sin(t * 0.5) * 0.06;
      g.rotation.z = slug === "bolt" ? -0.5 : slug === "fist" ? -0.35 : 0;
      g.rotation.x = slug === "anchor" ? 0.32 : 0.12;
      g.position.y = Math.sin(t * 1.1) * 0.03;
      return;
    }

    if (slug === "bolt") {
      // Hero, all on scroll: the round starts fully inside its tube, rises until
      // its tail clears the mouth, then tips onto its flight path. It holds its
      // roll while in the tube, fins on the diagonals where they clear the
      // mouth, and starts rolling about its own axis once it is out.
      const rise = smooth(clamp01(p / 0.38));
      const tilt = smooth(clamp01((p - 0.42) / 0.55));
      const roll = Math.max(0, p - 0.38) * 4;
      g.position.set(lerp(TUBE.x, 0.55, tilt), lerp(TUBE_TOP - 0.83, TUBE_TOP + 0.79, rise) + lerp(0, 0.25, tilt), 0);
      g.rotation.set(0, roll, -lerp(0, 0.98, tilt));
      // Whatever is still inside the tube is not drawn, so the fins never show
      // through its walls. Once the round is clear and tipping over, the plane
      // drops out of the way.
      if (g.parent) {
        clip.local.constant = tilt > 0 ? 100 : -TUBE_TOP;
        clip.world.copy(clip.local).applyMatrix4(g.parent.matrixWorld);
      }
    } else if (slug === "fist") {
      // Hero: stands as a tail-sitter, then pitches into forward flight and banks.
      const fly = smooth(p);
      g.position.set(lerp(0, 0.35, fly), lerp(-0.08, 0.28, fly) + Math.sin(t * 1.4) * 0.025 * intro, 0);
      g.rotation.set(Math.sin(t * 0.9) * 0.05 + lerp(0, 0.35, fly), lerp(-0.4, 0.5, fly) + (1 - intro) * 0.6, -lerp(0, 1.15, fly));
    } else {
      // Anchor hero: turns to show each rugged corner and lifts to reveal its top.
      const turn = smooth(p);
      g.position.set(0, lerp(-0.12, -0.04, turn), 0);
      g.rotation.set(lerp(0.16, 0.3, turn), lerp(-0.7, 2.4, turn) + (1 - intro) * -0.8, 0);
    }
  });

  return (
    <group ref={group}>
      <primitive object={object} />
    </group>
  );
}

/** BOLT's upright launch tube, roughly five times as tall as it is wide. */
export function LaunchTube({ x = TUBE.x }: { x?: number }) {
  return (
    <group position={[x, TUBE.y, 0]}>
      <RoundedBox args={[TUBE.width, TUBE.height, TUBE.width]} radius={TUBE.radius} smoothness={3} castShadow receiveShadow>
        {/* Anodised like the Anchor: the base colour is the metal's reflection tint. */}
        <meshStandardMaterial color="#33363c" metalness={0.92} roughness={0.38} />
      </RoundedBox>
      <mesh position={[0, TUBE.height / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TUBE.mouth, TUBE.mouth]} />
        <meshBasicMaterial color="#000" />
      </mesh>
    </group>
  );
}

useGLTF.preload(URL.bolt);
useGLTF.preload(URL.fist);
useGLTF.preload(URL.anchor);
