"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";
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
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        // BOLT's hero hides the part of the round still inside its launch tube.
        gl.localClippingEnabled = true;
      }}
    >
      <View.Port />
    </Canvas>
  );
}
