// Shaders for the hero sky. Colours are passed as sRGB and written straight out
// (these materials are not tone-mapped), so they match the Paper palette exactly.

const noise = /* glsl */ `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p, int octaves) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    s += a * snoise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return s;
}
`;

export const skyVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  // Drawn straight to clip space, always behind everything.
  gl_Position = vec4(position.xy, 0.9999, 1.0);
}
`;

/**
 * Pre-dawn sky from the Paper hero: night at the top, a warm horizon, dark ground.
 * uDay brightens it into the page's own gradient as the hero hands over.
 */
export const skyFragment = /* glsl */ `
uniform float uDawn;
uniform float uDay;
uniform float uHorizon;
varying vec2 vUv;
vec3 hex(float r, float g, float b) { return vec3(r, g, b) / 255.0; }
void main() {
  float y = 1.0 - vUv.y; // 0 at the top
  vec3 c0 = hex(10.0, 15.0, 22.0);
  vec3 c1 = hex(20.0, 33.0, 48.0);
  vec3 c2 = mix(hex(58.0, 74.0, 90.0), hex(72.0, 86.0, 101.0), uDawn);
  vec3 c3 = mix(hex(167.0, 154.0, 140.0), hex(196.0, 172.0, 148.0), uDawn);
  vec3 c4 = mix(hex(217.0, 195.0, 168.0), hex(236.0, 208.0, 172.0), uDawn);
  vec3 ground = hex(42.0, 46.0, 51.0);
  float h = uHorizon;
  vec3 col = c0;
  col = mix(col, c1, smoothstep(0.0, 0.38, y));
  col = mix(col, c2, smoothstep(0.38, h - 0.2, y));
  col = mix(col, c3, smoothstep(h - 0.2, h - 0.04, y));
  col = mix(col, c4, smoothstep(h - 0.04, h + 0.06, y));
  col = mix(col, ground, smoothstep(h + 0.06, h + 0.16, y));
  // The body gradient: sky-1, sky-2 at 30%, dawn at 72%, sage at the bottom.
  vec3 day = mix(hex(232.0, 237.0, 241.0), hex(238.0, 241.0, 242.0), clamp(y / 0.3, 0.0, 1.0));
  day = mix(day, hex(244.0, 238.0, 230.0), clamp((y - 0.3) / 0.42, 0.0, 1.0));
  day = mix(day, hex(238.0, 241.0, 236.0), clamp((y - 0.72) / 0.28, 0.0, 1.0));
  // Light rises from the horizon: the bottom turns first and the top follows,
  // so the change reads as morning arriving rather than a grey crossfade.
  float t = smoothstep(0.0, 1.0, clamp(uDay * 1.7 - (1.0 - y) * 0.7, 0.0, 1.0));
  gl_FragColor = vec4(mix(col, day, t), 1.0);
}
`;

export const cloudVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * A cumulus bank on a plane: a billowing top edge from domain-warped noise,
 * a warm sunlit crown fading to a cool shadowed underside, and haze toward
 * the sky colour with distance.
 */
export const cloudFragment = /* glsl */ `
${noise}
uniform float uTime;
uniform float uDrift;
uniform float uBase;
uniform float uAmp;
uniform float uSoft;
uniform float uFloor;
uniform float uOpacity;
uniform float uHazeAmt;
uniform vec2 uScale;
uniform vec2 uSeed;
uniform vec3 uLit;
uniform vec3 uShade;
uniform vec3 uHaze;
uniform int uOctaves;
uniform float uDay;
varying vec2 vUv;
void main() {
  vec2 p = vUv * uScale + uSeed + vec2(uTime * uDrift, 0.0);
  // A gentle warp rounds the billows; strong warping turns cloud into flame.
  float warp = fbm(p * 0.45, 3);
  float n = fbm(p + vec2(warp * 0.35, warp * 0.25), uOctaves);
  float detail = fbm(p * 1.9 + warp * 0.6, 2);
  float top = uBase + n * uAmp + detail * uAmp * 0.14;
  float inside = top - vUv.y;
  float a = smoothstep(0.0, uSoft, inside);
  if (a <= 0.001) discard;
  float depth = clamp(inside / (uAmp * 2.6), 0.0, 1.0);
  vec3 col = mix(uLit, uShade, smoothstep(0.04, 0.95, depth));
  col *= 0.95 + 0.08 * detail;
  col = mix(col, uHaze, uHazeAmt);
  a *= smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
  a *= smoothstep(uFloor, uFloor + 0.18, vUv.y);
  // At the hand-over the bank whitens toward dawn and thins away.
  col = mix(col, vec3(0.957, 0.933, 0.902), uDay * 0.7);
  a *= 1.0 - smoothstep(0.3, 0.9, uDay);
  gl_FragColor = vec4(col, a * uOpacity);
}
`;
