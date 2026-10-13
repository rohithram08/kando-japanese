import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import fs from 'fs';
import path from 'path';

async function analyzeGLB(filePath, candidateName) {
  const data = fs.readFileSync(filePath);
  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

  const loader = new GLTFLoader();
  
  return new Promise((resolve, reject) => {
    loader.parse(
      arrayBuffer,
      '',
      (gltf) => {
        const scene = gltf.scene;
        let totalTriangles = 0;
        let totalVertices = 0;
        const meshNames = [];
        const materialNames = new Set();
        const morphTargetMap = {};

        const bbox = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        bbox.getSize(size);

        scene.traverse((node) => {
          if (node.isMesh) {
            meshNames.push(node.name || 'UnnamedMesh');
            const geom = node.geometry;
            if (geom) {
              const pos = geom.attributes.position;
              if (pos) totalVertices += pos.count;
              if (geom.index) {
                totalTriangles += geom.index.count / 3;
              } else if (pos) {
                totalTriangles += pos.count / 3;
              }

              // Morph targets
              if (node.morphTargetDictionary) {
                morphTargetMap[node.name] = Object.keys(node.morphTargetDictionary);
              }
            }
            if (node.material) {
              if (Array.isArray(node.material)) {
                node.material.forEach(m => materialNames.add(m.name));
              } else {
                materialNames.add(node.material.name);
              }
            }
          }
        });

        const stats = {
          candidate: candidateName,
          fileSizeKB: (data.length / 1024).toFixed(1),
          fileSizeMB: (data.length / (1024 * 1024)).toFixed(2),
          triangles: totalTriangles,
          vertices: totalVertices,
          meshCount: meshNames.length,
          meshes: meshNames,
          materialCount: materialNames.size,
          materials: Array.from(materialNames),
          dimensions: {
            widthMeters: size.x.toFixed(3),
            heightMeters: size.y.toFixed(3),
            depthMeters: size.z.toFixed(3),
            heightCm: (size.y * 100).toFixed(1)
          },
          morphTargets: morphTargetMap
        };

        resolve(stats);
      },
      (err) => reject(err)
    );
  });
}

async function main() {
  const basePath = 'e:/Nihongo-testing/nihongo-master/art/hana/candidates';
  
  const reportA = await analyzeGLB(path.join(basePath, 'candidate-a/hana-candidate-a.glb'), 'Candidate A (AI Dense Mesh)');
  const reportB = await analyzeGLB(path.join(basePath, 'candidate-b/hana-candidate-b.glb'), 'Candidate B (Modular Anime Humanoid)');
  const reportC = await analyzeGLB(path.join(basePath, 'candidate-c/hana-candidate-c.glb'), 'Candidate C (Sculpt Base)');

  console.log('================================================================');
  console.log('3D CANDIDATE TECHNICAL MEASUREMENT REPORT');
  console.log('================================================================\n');

  [reportA, reportB, reportC].forEach(r => {
    console.log(`--- ${r.candidate} ---`);
    console.log(`File Size:       ${r.fileSizeKB} KB (${r.fileSizeMB} MB)`);
    console.log(`Triangles:       ${r.triangles.toLocaleString()} (Budget <= 24,000)`);
    console.log(`Vertices:        ${r.vertices.toLocaleString()}`);
    console.log(`Height:          ${r.dimensions.heightCm} cm (Target 162.0 cm)`);
    console.log(`Dimensions (m):  ${r.dimensions.widthMeters}W x ${r.dimensions.heightMeters}H x ${r.dimensions.depthMeters}D`);
    console.log(`Submeshes (${r.meshCount}):   ${r.meshes.join(', ')}`);
    console.log(`Materials (${r.materialCount}): ${r.materials.join(', ')}`);
    console.log(`Morph Targets:   ${JSON.stringify(r.morphTargets, null, 2)}`);
    console.log('');
  });
}

main().catch(err => {
  console.error('Analysis error:', err);
  process.exit(1);
});
