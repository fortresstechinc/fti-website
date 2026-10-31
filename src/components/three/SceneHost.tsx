"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { useEffect, useState } from "react";
import { prepareRenderer } from "./Viewport";
import styles from "./SceneHost.module.css";

/**
 * One WebGL context for the whole site. Every <ProductView> on the page renders
 * through this canvas into its own rectangle, so the GPU holds one context
 * instead of one per model.
 */
export function SceneHost() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <Canvas
      className={styles.canvas}
      eventSource={document.body}
      eventPrefix="client"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => prepareRenderer(gl)}
    >
      <View.Port />
    </Canvas>
  );
}
