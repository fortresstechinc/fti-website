import * as THREE from "three";

/**
 * Turns a standard material into FDM-printed plastic: fine layer lines along the
 * print axis, cut into the surface as a bump and a small roughness ripple. The
 * lines fade out where they would be thinner than a pixel, so distant or small
 * renders stay clean instead of shimmering.
 */
export function applyPrintFinish(
  material: THREE.MeshStandardMaterial,
  {
    toModel,
    spacing,
    depth = 0.3,
  }: {
    /** Mesh-to-model matrix. Compressed models store each part in its own unit
        cube, so layers must be measured in model space to line up across parts. */
    toModel: THREE.Matrix4;
    /** Layer pitch in model units (metres), measured along model +Y. */
    spacing: number;
    depth?: number;
  },
) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uLayerSpacing = { value: spacing };
    shader.uniforms.uLayerDepth = { value: depth };
    shader.uniforms.uToModel = { value: toModel };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vLayer;\nuniform mat4 uToModel;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLayer = (uToModel * vec4(position, 1.0)).y;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
varying float vLayer;
uniform float uLayerSpacing;
uniform float uLayerDepth;
float ftiLayer() {
  float p = vLayer / uLayerSpacing;
  float w = fwidth(p);
  float groove = 0.5 + 0.5 * cos(p * 6.2831853);
  // Fully faded well before the lines approach pixel size, which is where moire starts.
  return groove * (1.0 - smoothstep(0.3, 0.48, w));
}
vec3 ftiPerturb(vec3 surfPos, vec3 surfNorm, vec2 dHdxy, float faceDir) {
  vec3 sx = normalize(dFdx(surfPos));
  vec3 sy = normalize(dFdy(surfPos));
  vec3 r1 = cross(sy, surfNorm);
  vec3 r2 = cross(surfNorm, sx);
  float det = dot(sx, r1) * faceDir;
  vec3 grad = sign(det) * (dHdxy.x * r1 + dHdxy.y * r2);
  return normalize(abs(det) * surfNorm - grad);
}`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
float ftiH = ftiLayer();
roughnessFactor = clamp(roughnessFactor + (ftiH - 0.5) * 0.06, 0.0, 1.0);`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
normal = ftiPerturb(-vViewPosition, normal, vec2(dFdx(ftiH), dFdy(ftiH)) * uLayerDepth, faceDirection);`,
      );
  };
  material.customProgramCacheKey = () => "fti-print";
  material.needsUpdate = true;
}
