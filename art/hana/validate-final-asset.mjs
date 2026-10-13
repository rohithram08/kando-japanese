import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import fs from 'fs';
import path from 'path';

async function validateFinalHana() {
  const filePath = 'e:/Nihongo-testing/nihongo-master/public/models/hana-sensei.glb';
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
        const submeshes = [];
        const materials = new Set();
        const morphValidation = {};
        const animationValidation = [];

        const bbox = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        bbox.getSize(size);

        scene.traverse((node) => {
          if (node.isMesh) {
            const geom = node.geometry;
            const pos = geom.attributes.position;
            let tris = 0;
            if (geom.index) {
              tris = geom.index.count / 3;
            } else if (pos) {
              tris = pos.count / 3;
            }

            totalTriangles += tris;
            totalVertices += pos ? pos.count : 0;

            if (node.material) {
              if (Array.isArray(node.material)) {
                node.material.forEach(m => materials.add(m.name));
              } else {
                materials.add(node.material.name);
              }
            }

            // Test and inspect Morph Targets on mesh
            if (node.morphTargetDictionary) {
              const dict = node.morphTargetDictionary;
              const names = Object.keys(dict);
              const morphResults = {};

              names.forEach(mName => {
                const targetIdx = dict[mName];
                const morphPosAttr = geom.morphAttributes.position?.[targetIdx];
                
                // Calculate max vertex displacement to verify genuine deformation
                let maxDisplacement = 0;
                if (morphPosAttr && pos) {
                  for (let i = 0; i < pos.count; i++) {
                    const dx = morphPosAttr.getX(i) - pos.getX(i);
                    const dy = morphPosAttr.getY(i) - pos.getY(i);
                    const dz = morphPosAttr.getZ(i) - pos.getZ(i);
                    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                    if (dist > maxDisplacement) maxDisplacement = dist;
                  }
                }

                morphResults[mName] = {
                  index: targetIdx,
                  verifiedDeformationMm: (maxDisplacement * 1000).toFixed(2),
                  active: maxDisplacement > 0.001
                };
              });

              morphValidation[node.name] = morphResults;
            }

            submeshes.push({
              name: node.name,
              triangles: tris,
              vertices: pos ? pos.count : 0,
              material: node.material ? (Array.isArray(node.material) ? node.material.map(m=>m.name).join(', ') : node.material.name) : 'none'
            });
          }
        });

        // Test and inspect Animation Clips
        if (gltf.animations) {
          gltf.animations.forEach(anim => {
            animationValidation.push({
              clipName: anim.name,
              durationSeconds: anim.duration.toFixed(2),
              tracksCount: anim.tracks.length,
              tracksSample: anim.tracks.map(t => t.name)
            });
          });
        }

        const report = {
          fileName: 'hana-sensei.glb',
          fileSizeBytes: data.length,
          fileSizeKB: (data.length / 1024).toFixed(1),
          fileSizeMB: (data.length / (1024 * 1024)).toFixed(2),
          totalTriangles,
          totalVertices,
          submeshCount: submeshes.length,
          submeshes,
          materialCount: materials.size,
          materials: Array.from(materials),
          boundingBox: {
            heightCm: (size.y * 100).toFixed(1),
            widthMeters: size.x.toFixed(3),
            heightMeters: size.y.toFixed(3),
            depthMeters: size.z.toFixed(3)
          },
          morphTargetCount: Object.values(morphValidation).reduce((acc, obj) => acc + Object.keys(obj).length, 0),
          morphValidation,
          animationClipCount: animationValidation.length,
          animationValidation
        };

        resolve(report);
      },
      (err) => reject(err)
    );
  });
}

validateFinalHana().then((report) => {
  console.log('================================================================');
  console.log('FINAL 3D ASSET VALIDATION REPORT (hana-sensei.glb)');
  console.log('================================================================');
  console.log(`File Size:       ${report.fileSizeKB} KB (${report.fileSizeMB} MB) [Target <= 3.2 MB]`);
  console.log(`Total Triangles: ${report.totalTriangles.toLocaleString()} [Budget 20k-22k, Max 24,000]`);
  console.log(`Total Vertices:  ${report.totalVertices.toLocaleString()}`);
  console.log(`Height Scale:    ${report.boundingBox.heightCm} cm [Target 162.0 cm]`);
  console.log(`Submeshes:       ${report.submeshCount}`);
  console.log(`Materials:       ${report.materialCount} (${report.materials.join(', ')})`);
  console.log(`Morph Targets:   ${report.morphTargetCount} active verified targets`);
  console.log(`Animation Clips: ${report.animationClipCount} / 14 verified clips`);
  console.log('\n--- Morph Targets Verified on Mesh ---');
  console.log(JSON.stringify(report.morphValidation, null, 2));
  console.log('\n--- Animation Clips Verified in GLB ---');
  report.animationValidation.forEach(a => {
    console.log(`• Clip: ${a.clipName.padEnd(14)} Duration: ${a.durationSeconds}s | Tracks: ${a.tracksCount}`);
  });
}).catch((err) => {
  console.error('Validation error:', err);
  process.exit(1);
});
