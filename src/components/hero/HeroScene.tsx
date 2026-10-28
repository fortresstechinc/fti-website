"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { DeltaDrone, Quadcopter } from "./Drones";
import { cloudFragment, cloudVertex, skyFragment, skyVertex } from "./shaders";
import { PHASE, SITE, TRACKS, easeInOut, easeOut, interceptCurve, mix, seg, trackPosition, type Interceptor, type Vec3 } from "./timeline";

export type HudRefs = {
  tracks: (HTMLDivElement | null)[];
  site: SVGGElement | null;
  /** One drawn trajectory per engagement, in TRACKS order. */
  trails: (SVGPathElement | null)[];
};

type Layer = {
  z: number;
  y: number;
  w: number;
  h: number;
  base: number;
  amp: number;
  soft: number;
  floor: number;
  scale: [number, number];
  seed: [number, number];
  drift: number;
  lit: string;
  shade: string;
  haze: number;
  opacity: number;
};

// Banks from far to near. Their tops sit where the Paper hero's clouds sat.
// Noise scale tracks each plane's proportions (about 1.4x wider than tall) so
// the billows stay round instead of smearing sideways.
const LAYERS: Layer[] = [
  { z: -34, y: 7.5, w: 150, h: 6, base: 0.5, amp: 0.22, soft: 0.2, floor: 0.0, scale: [9, 0.9], seed: [3.1, 7.7], drift: 0.004, lit: "#a6b4c4", shade: "#5a6878", haze: 0.55, opacity: 0.22 },
  { z: -30, y: -6.4, w: 140, h: 9, base: 0.56, amp: 0.18, soft: 0.09, floor: 0.0, scale: [12, 1.3], seed: [1.3, 4.1], drift: 0.006, lit: "#d6c3ad", shade: "#8a8783", haze: 0.5, opacity: 0.72 },
  { z: -18, y: -5.2, w: 100, h: 8, base: 0.72, amp: 0.22, soft: 0.07, floor: 0.04, scale: [10, 1.3], seed: [8.4, 2.2], drift: 0.009, lit: "#efdcc6", shade: "#7c8290", haze: 0.22, opacity: 0.94 },
  { z: -9, y: -4.6, w: 70, h: 6.4, base: 0.76, amp: 0.21, soft: 0.06, floor: 0.06, scale: [8.5, 1.2], seed: [5.9, 9.3], drift: 0.013, lit: "#f4e6d4", shade: "#6e7480", haze: 0.06, opacity: 0.97 },
];

function CloudLayer({ layer, octaves, day }: { layer: Layer; octaves: number; day: MotionValue<number> }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: cloudVertex,
        fragmentShader: cloudFragment,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        uniforms: {
          uTime: { value: 0 },
          uDrift: { value: layer.drift },
          uBase: { value: layer.base },
          uAmp: { value: layer.amp },
          uSoft: { value: layer.soft },
          uFloor: { value: layer.floor },
          uOpacity: { value: layer.opacity },
          uHazeAmt: { value: layer.haze },
          uScale: { value: new THREE.Vector2(...layer.scale) },
          uSeed: { value: new THREE.Vector2(...layer.seed) },
          uLit: { value: new THREE.Color(layer.lit) },
          uShade: { value: new THREE.Color(layer.shade) },
          uHaze: { value: new THREE.Color("#3a4a5a") },
          uOctaves: { value: octaves },
          uDay: { value: 0 },
        },
      }),
    [layer, octaves],
  );
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uDay.value = day.get();
  });
  return (
    <mesh position={[0, layer.y, layer.z]} material={material}>
      <planeGeometry args={[layer.w, layer.h]} />
    </mesh>
  );
}

function Sky({ progress, day }: { progress: MotionValue<number>; day: MotionValue<number> }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
        uniforms: { uDawn: { value: 0 }, uDay: { value: 0 }, uHorizon: { value: 0.83 } },
      }),
    [],
  );
  useFrame(() => {
    material.uniforms.uDawn.value = progress.get();
    material.uniforms.uDay.value = day.get();
  });
  return (
    <mesh material={material} renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

/** A soft radial glow, shared by BOLT's motor and the intercept flashes. */
function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,226,196,0.7)");
    g.addColorStop(1, "rgba(255,200,150,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);
}

/** Clones a model and centres it, scaled so its longest side is `length`. Both models fly nose along +Y. */
function useInterceptorModel(url: string, length: number) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const o = scene.clone(true);
    const box = new THREE.Box3().setFromObject(o);
    o.position.sub(box.getCenter(new THREE.Vector3()));
    const g = new THREE.Group();
    g.add(o);
    g.scale.setScalar(length / Math.max(...box.getSize(new THREE.Vector3()).toArray()));
    return g;
  }, [scene, length]);
}

const ENGAGED = TRACKS.flatMap((track, i) => (track.engage ? [{ track, i, ...track.engage }] : []));
// BOLT is a boosted round and keeps accelerating; FIST eases in and out.
const FLIGHT_EASE: Record<Interceptor, (t: number) => number> = { bolt: (t) => t * t, fist: easeInOut };
const BOLT_LENGTH = 0.7;

type SceneProps = {
  /** Progress through the engagement, 0..1. */
  progress: MotionValue<number>;
  /** The hand-over to the page below, 0..1: the sky brightens into the page gradient. */
  day: MotionValue<number>;
  hud: React.RefObject<HudRefs>;
  reduced: boolean;
};

function Scene({ progress, day, hud, reduced }: SceneProps) {
  const { camera, size } = useThree();
  const drones = useRef<(THREE.Group | null)[]>([]);
  const rotors = useRef<THREE.Group[][]>(TRACKS.map(() => []));
  const interceptors = useRef<Record<Interceptor, THREE.Group | null>>({ bolt: null, fist: null });
  const flashes = useRef<(THREE.Sprite | null)[]>([]);
  const motor = useRef<THREE.Sprite>(null);
  const glow = useGlowTexture();
  const models = { bolt: useInterceptorModel("/models/bolt.glb", BOLT_LENGTH), fist: useInterceptorModel("/models/fist.glb", 0.62) };

  const v = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const project = (p: Vec3) => {
    v.set(p[0], p[1], p[2]).project(camera);
    return [((v.x + 1) / 2) * size.width, ((1 - v.y) / 2) * size.height, v.z] as const;
  };

  useFrame((state) => {
    const p = reduced ? 0.7 : progress.get();
    const time = reduced ? 0 : state.clock.elapsedTime;
    const aspect = size.width / size.height;
    const xScale = Math.min(1, Math.max(0.42, aspect / 1.42));

    camera.position.set(0, mix(0, 0.5, easeInOut(p)), mix(10, 7.6, easeInOut(p)));
    camera.lookAt(0, mix(0, 0.3, p), -10);
    camera.updateMatrixWorld();

    const interceptPoints: Vec3[] = [];
    // At the hand-over the remaining tracks climb away out of frame.
    const exit = Math.pow(seg(day.get(), 0, 0.55), 2);

    TRACKS.forEach((track, i) => {
      const g = drones.current[i];
      if (!g) return;
      let pos = trackPosition(track, p, time, xScale);
      const ahead = trackPosition(track, Math.min(1, p + 0.02), time + 0.1, xScale);
      const { engage } = track;
      const fall = engage ? easeInOut(seg(p, engage.fall[0], engage.fall[1])) : 0;
      if (engage) {
        const hit = trackPosition(track, engage.flight[1], time, xScale);
        interceptPoints[i] = hit;
        if (fall > 0) pos = [hit[0] + fall * 1.2 * Math.sign(hit[0] || 1), hit[1] - fall * 7, hit[2]];
      }
      if (exit > 0) pos = [pos[0] + Math.sign(track.to[0] - track.from[0] || 1) * exit * 9, pos[1] + exit * 5, pos[2]];
      // Nothing flies before its climb starts, so the opening frame is sky and cloud only.
      g.visible = p > track.rise[0] && (!engage || p < engage.fall[1]);
      if (fall > 0) {
        g.rotation.set(fall * 2.4, fall * 1.4, fall * 3.1);
      } else if (track.kind === "delta") {
        g.lookAt(ahead[0] + (ahead[0] - pos[0]) * 4, ahead[1] + 0.05, ahead[2] + 3);
        g.rotateZ(Math.sin(time * 0.7) * 0.12 - 0.2);
      } else {
        g.lookAt(ahead[0] + (ahead[0] - pos[0]) * 3, ahead[1], ahead[2] + 2);
        g.rotateX(0.25);
        rotors.current[i].forEach((r, j) => (r.rotation.y += (j % 2 ? -1 : 1) * 0.6));
      }
      g.position.set(...pos);

      // Brackets appear once the track has climbed clear of the cloud tops.
      const el = hud.current?.tracks[i];
      if (el) {
        const [x, y, depth] = project(pos);
        const shown = seg(p, track.rise[0] + 0.14, track.rise[0] + 0.2) * (engage ? 1 - seg(p, engage.flight[1] + 0.04, engage.fall[1]) : 1);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        // Labels flip to the bracket's left near the right edge so they stay on screen.
        el.dataset.flip = x > size.width - 230 ? "1" : "0";
        el.style.opacity = depth < 1 && p >= PHASE.detect - 0.02 ? String(shown) : "0";
      }
    });

    ENGAGED.forEach(({ i, by, flight, fall }, k) => {
      const target = interceptPoints[i];
      const hitAt = flight[1];

      // Each interceptor flies the curve Lumen drew, from its launcher to the intercept point.
      const obj = interceptors.current[by];
      if (obj) {
        const t = FLIGHT_EASE[by](seg(p, flight[0], flight[1]));
        const pos = interceptCurve(by, target, xScale, t);
        const next = interceptCurve(by, target, xScale, Math.min(1, t + 0.02));
        obj.position.set(...pos);
        dir.set(next[0] - pos[0], next[1] - pos[1], next[2] - pos[2]);
        if (dir.lengthSq() > 0) obj.quaternion.setFromUnitVectors(up, dir.normalize());
        obj.visible = p > flight[0] && p < hitAt;
        obj.rotateY(time * (by === "bolt" ? 3 : 2));
        if (by === "bolt" && motor.current) motor.current.scale.setScalar(0.34 + Math.sin(time * 40) * 0.04);
      }

      // A brief flash where the interceptor meets the track.
      const flash = flashes.current[k];
      if (flash) {
        const burst = seg(p, hitAt, hitAt + 0.035);
        flash.visible = burst > 0 && burst < 1;
        flash.position.set(...target);
        flash.scale.setScalar(0.4 + easeOut(burst) * 1.6);
        (flash.material as THREE.SpriteMaterial).opacity = 1 - burst;
      }

      // The drawn trajectory, in screen space.
      const trail = hud.current?.trails[k];
      if (trail) {
        const draw = seg(p, PHASE.trajectory[0], PHASE.trajectory[1]);
        const fade = 1 - seg(p, hitAt + 0.02, fall[1]);
        if (draw <= 0 || fade <= 0) {
          trail.setAttribute("d", "");
        } else {
          let d = "";
          const steps = 28;
          for (let s = 0; s <= steps; s++) {
            const pt = project(interceptCurve(by, target, xScale, (s / steps) * draw));
            d += `${s === 0 ? "M" : "L"}${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`;
          }
          trail.setAttribute("d", d);
          trail.style.opacity = String(fade);
        }
      }
    });

    // The site marker, in screen space.
    const site = project([SITE[0] * xScale, SITE[1], SITE[2]]);
    if (hud.current?.site) hud.current.site.setAttribute("transform", `translate(${site[0].toFixed(1)} ${site[1].toFixed(1)})`);
  });

  const glowMaterial = (opacity: number) => (
    <spriteMaterial map={glow} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
  );

  return (
    <>
      <Sky progress={progress} day={day} />
      <hemisphereLight args={["#2b3e55", "#e6cdb4", 1.4]} />
      <directionalLight position={[0, -3, 9]} intensity={1.6} color="#f2c9a0" />
      <directionalLight position={[-4, 6, 2]} intensity={0.6} color="#9fb3c8" />
      {LAYERS.map((layer, i) => (
        <CloudLayer key={i} layer={layer} octaves={size.width < 700 ? 3 : 5} day={day} />
      ))}
      {TRACKS.map((track, i) => (
        <group key={track.id} ref={(g) => void (drones.current[i] = g)} scale={track.kind === "delta" ? 0.55 : 0.6}>
          {track.kind === "delta" ? <DeltaDrone /> : <Quadcopter spin={{ current: rotors.current[i] }} />}
        </group>
      ))}
      <group ref={(g) => void (interceptors.current.bolt = g)} visible={false}>
        <primitive object={models.bolt} />
        {/* The rocket motor's glow at the tail. */}
        <sprite ref={motor} position={[0, -BOLT_LENGTH / 2 - 0.06, 0]}>
          {glowMaterial(0.95)}
        </sprite>
      </group>
      <group ref={(g) => void (interceptors.current.fist = g)} visible={false}>
        <primitive object={models.fist} />
      </group>
      {ENGAGED.map(({ track }, k) => (
        <sprite key={track.id} ref={(s) => void (flashes.current[k] = s)} visible={false}>
          {glowMaterial(1)}
        </sprite>
      ))}
    </>
  );
}

export function HeroScene({ active, className, ...scene }: SceneProps & { active: boolean; className?: string }) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.4]}
      frameloop={scene.reduced ? "demand" : active ? "always" : "never"}
      camera={{ fov: 38, position: [0, 0, 10], near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <Scene {...scene} />
    </Canvas>
  );
}

useGLTF.preload("/models/bolt.glb");
useGLTF.preload("/models/fist.glb");
