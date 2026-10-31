"use client";

import { View } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/** Phones and tablets: narrow screens, or screens without a hovering pointer. */
const LOCAL_QUERY = "(max-width: 900px), (hover: none)";

/**
 * Whether 3D draws into a canvas of its own beside the page content (phones,
 * tablets) rather than through the one shared, viewport-fixed canvas (desktop).
 * Touch scrolling runs ahead of the page's script, so a fixed canvas visibly
 * trails the content it is drawn over; a canvas inside the content scrolls with
 * it. Null until the browser has answered, so nothing renders on the server.
 */
export function useLocalCanvas() {
  const [local, setLocal] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(LOCAL_QUERY);
    const sync = () => setLocal(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return local;
}

/** The renderer settings every 3D scene on the site expects. */
export function prepareRenderer(gl: THREE.WebGLRenderer) {
  gl.toneMapping = THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure = 1.05;
  // BOLT's hero hides the part of the round still inside its launch tube.
  gl.localClippingEnabled = true;
}

type Props = {
  className?: string;
  label: string;
  children: React.ReactNode;
};

/**
 * A rectangle on the page that a 3D scene renders into. On desktop it is a
 * window onto the shared canvas (SceneHost). On touch screens it gets its own
 * small canvas, created when it comes within a screen of view, paused while
 * off screen and released when far away, so only a few exist at once.
 */
export function Viewport({ className, label, children }: Props) {
  const local = useLocalCanvas();
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!local || !el) return;
    const nearby = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "100% 0px" });
    const onScreen = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    nearby.observe(el);
    onScreen.observe(el);
    return () => {
      nearby.disconnect();
      onScreen.disconnect();
    };
  }, [local]);

  return (
    <div ref={box} className={className} role="img" aria-label={label}>
      {local === false && <View style={{ width: "100%", height: "100%", touchAction: "pan-y" }}>{children}</View>}
      {local && near && (
        <Canvas
          frameloop={visible ? "always" : "never"}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => prepareRenderer(gl)}
          // Touches pass through to the page, so scrolling over a model just scrolls.
          style={{ pointerEvents: "none" }}
        >
          {children}
        </Canvas>
      )}
    </div>
  );
}
