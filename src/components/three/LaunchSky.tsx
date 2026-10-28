"use client";

import { ContactShadows, Environment, Lightformer, PerspectiveCamera, View } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { LaunchTube, TUBE, usePrepared } from "./ProductModel";

const TUBE_TOP = TUBE.y + TUBE.height / 2;
const GROUND = TUBE.y - TUBE.height / 2;
/** Half of BOLT's length: the model is normalised to 1.5 units long. */
const HALF = 0.75;
/** Where the round heads once it is clear of the tube: up, off to the right, and
 *  away, so its trail rises through the right of the frame, clear of the invitation. */
const HEADING = new THREE.Vector3(30, 80, -55);
/** The far haze the ground and the trail fade into; matches the sky's horizon. */
const HAZE = "#e6ecf0";

const UP = new THREE.Vector3(0, 1, 0);
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smoke puffs around the tube's base at ignition: [x, z, size, delay]. Mostly
 *  to the sides and behind, so the tube itself stays clear. */
const PUFFS: [number, number, number, number][] = [
  [-0.34, 0.05, 0.16, 0],
  [0.34, 0.02, 0.15, 0.08],
  [-0.22, -0.26, 0.18, 0.04],
  [0.24, -0.28, 0.17, 0.12],
  [-0.52, -0.1, 0.13, 0.2],
  [0.55, -0.14, 0.12, 0.24],
  [0, -0.36, 0.19, 0.1],
  [-0.4, 0.22, 0.11, 0.3],
  [0.42, 0.24, 0.1, 0.34],
];

/** The mountains behind the field: a ridge line across the horizon, lost in haze. */
const RIDGE = (() => {
  const shape = new THREE.Shape();
  const W = 420;
  shape.moveTo(-W / 2, 0);
  // A deterministic, layered ridge: a few long swells with shorter peaks on top.
  for (let i = 0; i <= 120; i++) {
    const x = -W / 2 + (W * i) / 120;
    const u = x / W;
    const y = 4.6 + Math.sin(u * 9.1 + 1.3) * 2.2 + Math.sin(u * 23.7 + 0.4) * 1.1 + Math.abs(Math.sin(u * 57 + 2.2)) * 0.8;
    shape.lineTo(x, Math.max(1, y));
  }
  shape.lineTo(W / 2, 0);
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
})();

/** The other launch boxes set down on the field, waiting, each where it was
 *  dropped: [x, z, turn]. */
const BOXES: [number, number, number][] = [
  [-1.45, -1.7, 0.35],
  [1.3, -0.8, -0.2],
  [2.9, -3.9, 0.5],
  [-3.3, -4.6, -0.4],
  [-0.95, -7, 0.15],
];

/** The vent arch at the foot of a launch box's front face. */
const VENT = (() => {
  const w = 0.13;
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(-w / 2, 0.12);
  shape.absarc(0, 0.12, w / 2, Math.PI, 0, true);
  shape.lineTo(w / 2, 0);
  shape.closePath();
  return new THREE.ShapeGeometry(shape, 12);
})();

/** A BOLT launch box standing on the field, its vent facing the viewer. */
function Box({ x, z, turn = 0 }: { x: number; z: number; turn?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, turn, 0]}>
      <LaunchTube x={0} />
      <mesh geometry={VENT} position={[0, GROUND + 0.002, TUBE.width / 2 + 0.002]}>
        <meshBasicMaterial color="#090b0e" />
      </mesh>
    </group>
  );
}

/** Dry, speckled ground: a small noise tile, repeated across the field. */
function Field() {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#d3cbb2";
    ctx.fillRect(0, 0, size, size);
    // A seeded scatter of grit and low scrub, so the tile is the same every load.
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 2600; i++) {
      const dark = rand() < 0.7;
      ctx.fillStyle = dark ? `rgba(120, 108, 82, ${0.08 + rand() * 0.14})` : `rgba(250, 246, 235, ${0.1 + rand() * 0.2})`;
      const r = rand() < 0.97 ? 0.6 + rand() * 1.2 : 2 + rand() * 3;
      ctx.beginPath();
      ctx.arc(rand() * size, rand() * size, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(160, 80);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND, -60]}>
      <planeGeometry args={[600, 300]} />
      <meshStandardMaterial map={texture} roughness={1} />
    </mesh>
  );
}

/**
 * The launch, all on scroll (`p`, 0..1): the round waits in its tube, ignites,
 * rises out, then climbs up and away into the sky on an ember exhaust and a
 * white trail, while the camera tilts up to follow it until it is gone.
 */
function Launch({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const { object } = usePrepared("bolt");
  const round = useRef<THREE.Group>(null);
  const flame = useRef<THREE.Group>(null);
  const trail = useRef<THREE.Group>(null);
  const trailMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const puffs = useRef<(THREE.Mesh | null)[]>([]);
  const eased = useRef<number | null>(null);
  const v = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      tail: new THREE.Vector3(),
      mouth: new THREE.Vector3(0, TUBE_TOP, 0),
      span: new THREE.Vector3(),
      heading: HEADING.clone().normalize(),
      roll: new THREE.Quaternion(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const g = round.current;
    if (!g) return;
    // Follows the scroll with a short lag, so a quick flick still plays out.
    const raw = reduced ? 0.36 : clamp01(progress.get());
    if (eased.current === null || reduced) eased.current = raw;
    else eased.current += (raw - eased.current) * (1 - Math.exp(-delta * 6));
    const p = eased.current;
    const t = state.clock.elapsedTime;

    const ignite = clamp01((p - 0.03) / 0.07);
    const rise = smooth(clamp01((p - 0.08) / 0.2));
    const climb = clamp01((p - 0.28) / 0.62);
    const away = climb * climb;
    const turn = smooth(clamp01(climb * 3));

    // Position: out of the tube, then along the heading, accelerating.
    v.pos.set(0, lerp(TUBE_TOP - 0.83, TUBE_TOP + 0.8, rise), 0).addScaledVector(HEADING, away);
    v.dir.copy(UP).lerp(v.heading, turn).normalize();
    g.position.copy(v.pos);
    g.quaternion.setFromUnitVectors(UP, v.dir);
    // Fins stay on the diagonals inside the tube; the round rolls once it is out.
    v.roll.setFromAxisAngle(UP, Math.max(0, p - 0.26) * 7);
    g.quaternion.multiply(v.roll);

    // Exhaust: lit from ignition, flickering, gone once the round is a speck.
    if (flame.current) {
      const thrust = ignite * (1 - smooth(clamp01((p - 0.86) / 0.1)));
      const flicker = 0.85 + Math.sin(t * 38) * 0.08 + Math.sin(t * 23) * 0.07;
      flame.current.visible = thrust > 0.01;
      flame.current.scale.set(thrust, thrust * flicker * (1 + turn * 0.6), thrust);
    }

    // Trail: from the tube's mouth to the round's tail, widening as it ages.
    v.tail.copy(v.pos).addScaledVector(v.dir, -HALF);
    v.span.subVectors(v.tail, v.mouth);
    const length = v.span.y > 0 ? v.span.length() : 0;
    if (trail.current) {
      trail.current.visible = length > 0.02;
      if (length > 0.02) {
        trail.current.position.copy(v.mouth).addScaledVector(v.span, 0.5);
        trail.current.quaternion.setFromUnitVectors(UP, v.span.normalize());
        const width = lerp(0.04, 0.16, smooth(climb));
        trail.current.scale.set(width, length, width);
        const fade = 1 - smooth(clamp01((p - 0.8) / 0.2)) * 0.45;
        trailMats.current.forEach((m, i) => (m.opacity = (i === 0 ? 0.85 : 0.22) * fade));
      }
    }

    // Ignition smoke: billows out around the tube's base and thins away.
    const billow = smooth(clamp01((p - 0.05) / 0.35));
    puffs.current.forEach((m, i) => {
      if (!m) return;
      const [x, z, size, delay] = PUFFS[i];
      const k = smooth(clamp01((billow - delay) / (1 - delay)));
      m.visible = k > 0.01;
      m.scale.setScalar(size * lerp(0.4, 1.8, k));
      m.position.set(x * lerp(0.7, 2, k), GROUND + size * lerp(0.4, 1.3, k), z * lerp(0.7, 2, k));
      (m.material as THREE.MeshStandardMaterial).opacity = 0.55 * k * (1 - smooth(clamp01((p - 0.32) / 0.3)));
    });

    // Camera: from just above the tube's mouth, tilts up after the round, then
    // stops and lets it climb out of the top of the frame.
    const follow = smooth(clamp01((p - 0.26) / 0.4));
    state.camera.position.set(0, lerp(0.75, 2.6, follow), 10);
    state.camera.lookAt(0, lerp(0.25, 6.4, follow), 0);
  });

  return (
    <>
      <group ref={round}>
        <primitive object={object} />
        <group ref={flame} position={[0, -HALF - 0.02, 0]}>
          <mesh position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.075, 0.4, 20]} />
            <meshBasicMaterial color="#ff5b1f" transparent opacity={0.92} />
          </mesh>
          <mesh position={[0, -0.11, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.04, 0.22, 16]} />
            <meshBasicMaterial color="#ffe2c4" />
          </mesh>
        </group>
      </group>

      <group ref={trail} visible={false}>
        {/* A soft core and a faint halo; narrower at the round, wider where it is older. */}
        {[1, 2.4].map((r, i) => (
          <mesh key={r} renderOrder={1}>
            <cylinderGeometry args={[0.45 * r, r, 1, 20, 1, true]} />
            <meshStandardMaterial
              ref={(m) => void (m && (trailMats.current[i] = m))}
              color="#ffffff"
              roughness={1}
              transparent
              opacity={i === 0 ? 0.85 : 0.22}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {PUFFS.map((_, i) => (
        <mesh key={i} ref={(m) => void (puffs.current[i] = m)} visible={false}>
          <sphereGeometry args={[1, 20, 14]} />
          <meshStandardMaterial color="#f7f7f5" roughness={1} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}

      <Box x={0} z={0} />
    </>
  );
}

type Props = {
  progress: MotionValue<number>;
  reduced: boolean;
  className?: string;
  label: string;
};

/** The launch field in daylight: open ground running to a hazy horizon under the page's sky. */
export function LaunchSkyView({ progress, reduced, className, label }: Props) {
  return (
    <div className={className} role="img" aria-label={label}>
      <View style={{ width: "100%", height: "100%" }}>
        <PerspectiveCamera makeDefault position={[0, 0.75, 10]} fov={30} />
        <fog attach="fog" args={[HAZE, 18, 290]} />
        <hemisphereLight args={["#dfe9f2", "#cdbf9f", 1.15]} />
        <directionalLight position={[6, 10, 5]} intensity={2.6} color="#fff3e2" />
        <directionalLight position={[-5, 3, -3]} intensity={1.2} color="#c9d8ea" />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} color="#fff4e8" position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[8, 4, 1]} />
          <Lightformer form="rect" intensity={2.4} color="#d6e4f2" position={[-5, 1, -2]} rotation-y={Math.PI / 2.4} scale={[2, 8, 1]} />
          <Lightformer form="rect" intensity={1.8} color="#ffe1c2" position={[5, 0.5, 1]} rotation-y={-Math.PI / 2.2} scale={[1.2, 6, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#eef2f6" position={[0, 0.4, 6]} scale={[6, 2.4, 1]} />
        </Environment>

        {/* The mountains: far enough that the haze turns them pale blue. */}
        <mesh geometry={RIDGE} position={[0, GROUND - 0.5, -170]}>
          <meshBasicMaterial color="#6f8293" />
        </mesh>

        {/* The field: dry ground out to the horizon, lost in haze. */}
        <Field />
        {BOXES.map(([x, z, turn]) => (
          <Box key={`${x}${z}`} x={x} z={z} turn={turn} />
        ))}

        <Suspense fallback={null}>
          <Launch progress={progress} reduced={reduced} />
          <ContactShadows position={[0, GROUND + 0.004, -3]} opacity={0.42} scale={14} blur={2.4} far={2.6} frames={reduced ? 1 : Infinity} />
        </Suspense>
      </View>
    </div>
  );
}
