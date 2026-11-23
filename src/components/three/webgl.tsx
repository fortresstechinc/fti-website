"use client";

import { Component, useEffect, useState, type ReactNode } from "react";

let support: boolean | null = null;
const listeners = new Set<(ok: boolean) => void>();

/**
 * WebGL2, which is what the product renderers and the map both ask for.
 * A throwaway context is dropped immediately so it does not count against
 * the browser's context limit.
 */
export function detectWebGL(): boolean {
  if (support !== null) return support;
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      failIfMajorPerformanceCaveat: false,
    });
    const ok = !!gl && !gl.isContextLost();
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    support = ok;
  } catch {
    support = false;
  }
  return support;
}

/** A context that probed fine can still fail once a renderer asks for one. */
export function markWebGLUnavailable() {
  if (support === false) return;
  support = false;
  listeners.forEach((listener) => listener(false));
}

/** Null until the browser has answered, so server markup stays free of the result. */
export function useWebGL(): boolean | null {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    setOk(detectWebGL());
    listeners.add(setOk);
    return () => {
      listeners.delete(setOk);
    };
  }, []);
  return ok;
}

type BoundaryProps = { children: ReactNode; fallback: ReactNode };

/**
 * The 3D canvas rethrows a failed context into React, which would otherwise
 * replace the whole page. This keeps the failure inside the viewer.
 */
export class WebGLBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    markWebGLUnavailable();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
