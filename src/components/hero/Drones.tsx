"use client";

import { useMemo } from "react";
import * as THREE from "three";

const INK = "#0d1117";

/** A delta-wing one-way attack drone silhouette (Shahed-class). Nose points +Z. */
export function DeltaDrone() {
  const wing = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 1.05);
    s.lineTo(1.25, -0.55);
    s.lineTo(1.15, -0.72);
    s.lineTo(0, -0.4);
    s.lineTo(-1.15, -0.72);
    s.lineTo(-1.25, -0.55);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.045, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 1 });
    // Lay the outline flat with its nose toward +Z (the direction the scene flies
    // it), so the wingtips land under the tip fins at z -0.55 to -0.72.
    g.rotateX(Math.PI / 2);
    g.translate(0, 0.045, 0);
    return g;
  }, []);
  return (
    <group>
      <mesh geometry={wing}>
        <meshStandardMaterial color={INK} roughness={0.62} metalness={0.15} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, 0.03, 0.05]}>
        <capsuleGeometry args={[0.1, 1.5, 6, 12]} />
        <meshStandardMaterial color={INK} roughness={0.55} metalness={0.2} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.18, 0.14, -0.6]}>
          <boxGeometry args={[0.03, 0.3, 0.26]} />
          <meshStandardMaterial color={INK} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/** A small quadcopter silhouette with rotor discs. */
export function Quadcopter({ spin }: { spin: React.RefObject<THREE.Group[]> }) {
  const arms = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ] as const;
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.34, 0.12, 0.44]} />
        <meshStandardMaterial color={INK} roughness={0.6} metalness={0.2} />
      </mesh>
      {arms.map(([x, z], i) => (
        <group key={i}>
          <mesh position={[x * 0.24, 0, z * 0.24]} rotation-y={Math.atan2(x, z)}>
            <boxGeometry args={[0.05, 0.05, 0.5]} />
            <meshStandardMaterial color={INK} roughness={0.6} />
          </mesh>
          <group
            position={[x * 0.42, 0.08, z * 0.42]}
            ref={(g) => {
              if (g && spin.current) spin.current[i] = g;
            }}
          >
            <mesh>
              <cylinderGeometry args={[0.2, 0.2, 0.008, 24]} />
              <meshStandardMaterial color={INK} transparent opacity={0.28} roughness={0.5} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.4, 0.012, 0.04]} />
              <meshStandardMaterial color={INK} roughness={0.6} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
