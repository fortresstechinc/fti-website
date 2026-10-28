import { NodeIO, getBounds } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
// Prints a model's node tree with sizes, centres and materials. Usage: node scripts/inspect-model.mjs <file.glb>
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(process.argv[2]);
const root = doc.getRoot();
const mats = root.listMaterials();
console.log('materials:', mats.map((m,i)=>`${i}:${m.getName()||'-'} rgba=${m.getBaseColorFactor().map(v=>v.toFixed(2)).join(',')} metal=${m.getMetallicFactor()} rough=${m.getRoughnessFactor()}`).join('\n  '));
const scene = root.listScenes()[0];
function walk(node, depth) {
  const mesh = node.getMesh();
  let info = '';
  if (mesh) {
    const b = getBounds(node);
    const size = b.max.map((v,i)=>(v-b.min[i]).toFixed(3));
    const ctr = b.max.map((v,i)=>((v+b.min[i])/2).toFixed(3));
    const m = mesh.listPrimitives().map(p=>mats.indexOf(p.getMaterial())).join('/');
    const tris = mesh.listPrimitives().reduce((a,p)=>a+((p.getIndices()?.getCount() ?? p.getAttribute('POSITION').getCount())/3),0);
    info = ` mesh size=[${size}] ctr=[${ctr}] mat=${m} tris=${tris} uv=${!!mesh.listPrimitives()[0].getAttribute('TEXCOORD_0')}`;
  }
  console.log(' '.repeat(depth*2) + (node.getName()||'(node)') + info);
  node.listChildren().forEach(c=>walk(c, depth+1));
}
scene.listChildren().forEach(n=>walk(n,0));
