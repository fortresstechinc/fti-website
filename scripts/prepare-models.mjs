// Turns the source models in media/ into the web models in public/models/.
// It recolours every part, removes anything that must not ship (the Anchor's
// internals and internal part names), puts each model in metres with Y up, and
// compresses the result with meshopt. Run with `npm run prepare:models`.
import { mkdir } from "node:fs/promises";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, meshopt, prune, simplify, weld } from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";

const OUT = "public/models";

// Colours are linear-light RGB (sRGB #141414 is about 0.007 linear).
const FINISHES = {
  // Matte FDM-printed PLA. The runtime adds the layer lines.
  pla: { color: [0.007, 0.007, 0.0075], metallic: 0, roughness: 0.78 },
  // Black anodised aluminium.
  anodized: { color: [0.016, 0.017, 0.019], metallic: 1, roughness: 0.4 },
  // Silicone and rubber bumpers.
  silicone: { color: [0.006, 0.006, 0.0065], metallic: 0, roughness: 0.93 },
  // Small dark metal hardware: screws, motor bells, rings.
  oxide: { color: [0.02, 0.021, 0.023], metallic: 0.85, roughness: 0.36 },
  // Lenses and domes.
  gloss: { color: [0.004, 0.004, 0.0045], metallic: 0, roughness: 0.08 },
};

function finish(doc, name) {
  const spec = FINISHES[name];
  return doc
    .createMaterial(name)
    .setBaseColorFactor([...spec.color, 1])
    .setMetallicFactor(spec.metallic)
    .setRoughnessFactor(spec.roughness);
}

function allMeshNodes(doc) {
  return doc.getRoot().listNodes().filter((n) => n.getMesh());
}

function wrapScene(doc, name, { rotation, scale }) {
  const scene = doc.getRoot().listScenes()[0];
  const root = doc.createNode(name);
  if (rotation) root.setRotation(rotation);
  if (scale) root.setScale([scale, scale, scale]);
  for (const child of scene.listChildren()) {
    scene.removeChild(child);
    root.addChild(child);
  }
  scene.addChild(root);
}

async function write(io, doc, file) {
  await doc.transform(
    dedup(),
    weld(),
    prune(),
    meshopt({ encoder: MeshoptEncoder, level: "medium" }),
  );
  await io.write(`${OUT}/${file}`, doc);
}

async function bolt(io) {
  const doc = await io.read("media/bolt.glb");
  const pla = finish(doc, "pla");
  for (const node of allMeshNodes(doc)) {
    for (const prim of node.getMesh().listPrimitives()) prim.setMaterial(pla);
  }
  // Source is millimetres with the long axis on +Z; stand it up on +Y in metres.
  wrapScene(doc, "BOLT", { rotation: [-Math.SQRT1_2, 0, 0, Math.SQRT1_2], scale: 0.001 });
  await doc.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: 0.3, error: 0.0005 }));
  await write(io, doc, "bolt.glb");
}

async function fist(io) {
  const doc = await io.read("media/fist.glb");
  const source = doc.getRoot().listMaterials();
  // Source material order: 0 shell, 1 camera lens, 2 bright metal, 3 rings,
  // 4 wings and arms, 5 motor cans, 6 propellers.
  const map = {
    0: finish(doc, "pla"),
    1: finish(doc, "gloss"),
    2: finish(doc, "oxide"),
    3: null,
    4: null,
    5: null,
    6: null,
  };
  map[3] = map[0];
  map[4] = map[0];
  map[5] = map[2];
  map[6] = map[0];
  for (const node of allMeshNodes(doc)) {
    for (const prim of node.getMesh().listPrimitives()) {
      prim.setMaterial(map[source.indexOf(prim.getMaterial())] ?? map[0]);
    }
  }
  // Each propeller is an unnamed group holding hub, two blades and a nut.
  let prop = 0;
  for (const node of doc.getRoot().listNodes()) {
    node.setName(node.listChildren().length > 0 && !node.getMesh() && node.getName() !== "RacingDrone" ? `prop_${prop++}` : "");
  }
  wrapScene(doc, "FIST", {});
  await write(io, doc, "fist.glb");
}

async function anchor(io) {
  const doc = await io.read("media/anchor.glb");
  // Never ship the interior: delete the whole subtree, not just hide it.
  for (const node of doc.getRoot().listNodes()) {
    if (node.getName() === "Internals") {
      node.traverse((n) => n.dispose());
    }
  }
  const finishes = {
    Walls: finish(doc, "anodized"),
    Rubber: finish(doc, "silicone"),
    "Black oxide": finish(doc, "oxide"),
    "Gloss black": finish(doc, "gloss"),
  };
  for (const node of allMeshNodes(doc)) {
    for (const prim of node.getMesh().listPrimitives()) {
      const name = prim.getMaterial()?.getName() ?? "";
      const key = ["Walls", "Powder coat", "Lid", "Deck"].includes(name) ? "Walls" : name;
      prim.setMaterial(finishes[key] ?? finishes.Walls);
    }
  }
  // Keep only the names the site animates; drop every other part name.
  for (const node of doc.getRoot().listNodes()) {
    if (!["EdgeComputeUnit", "Body", "Lid"].includes(node.getName())) node.setName("");
  }
  await write(io, doc, "anchor.glb");
}

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;
await mkdir(OUT, { recursive: true });
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.encoder": MeshoptEncoder });
await bolt(io);
await fist(io);
await anchor(io);
console.log("models written to", OUT);
