import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import fs from 'fs';
import path from 'path';

async function forensicInspectCandidateB() {
  const filePath = 'e:/Nihongo-testing/nihongo-master/public/models/candidates/hana-candidate-b.glb';
  const data = fs.readFileSync(filePath);
  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.parse(
      arrayBuffer,
      '',
      (gltf) => {
        const scene = gltf.scene;
        const submeshes = [];
        let totalTriangles = 0;
        let totalVertices = 0;
        const materials = [];
        const morphTargets = {};
        const bones = [];
        const animations = [];

        // Traverse hierarchy
        scene.traverse((node) => {
          if (node.isBone) {
            bones.push({
              name: node.name,
              position: [node.position.x, node.position.y, node.position.z],
              parent: node.parent?.name || 'none'
            });
          }

          if (node.isMesh) {
            const geom = node.geometry;
            const pos = geom.attributes.position;
            const uvs = geom.attributes.uv;
            const normals = geom.attributes.normal;
            
            let tris = 0;
            if (geom.index) {
              tris = geom.index.count / 3;
            } else if (pos) {
              tris = pos.count / 3;
            }

            totalTriangles += tris;
            totalVertices += pos ? pos.count : 0;

            const meshInfo = {
              name: node.name || 'UnnamedMesh',
              triangles: tris,
              vertices: pos ? pos.count : 0,
              hasUVs: !!uvs,
              hasNormals: !!normals,
              materialName: node.material ? (Array.isArray(node.material) ? node.material.map(m=>m.name).join(', ') : node.material.name) : 'none',
              morphTargets: node.morphTargetDictionary ? Object.keys(node.morphTargetDictionary) : []
            };

            submeshes.push(meshInfo);

            if (node.morphTargetDictionary) {
              morphTargets[node.name] = Object.keys(node.morphTargetDictionary);
            }

            if (node.material) {
              const matList = Array.isArray(node.material) ? node.material : [node.material];
              matList.forEach(m => {
                if (!materials.some(existing => existing.name === m.name)) {
                  materials.push({
                    name: m.name,
                    type: m.type,
                    color: m.color ? `#${m.color.getHexString()}` : 'none',
                    roughness: m.roughness ?? 'none',
                    metalness: m.metalness ?? 'none',
                    emissive: m.emissive ? `#${m.emissive.getHexString()}` : 'none',
                    emissiveIntensity: m.emissiveIntensity ?? 0
                  });
                }
              });
            }
          }
        });

        // Animations in gltf
        if (gltf.animations && gltf.animations.length > 0) {
          gltf.animations.forEach(anim => {
            animations.push({
              name: anim.name,
              duration: anim.duration,
              tracksCount: anim.tracks.length,
              tracks: anim.tracks.map(t => t.name)
            });
          });
        }

        const bbox = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        bbox.getSize(size);

        const report = {
          fileName: 'hana-candidate-b.glb',
          fileSizeBytes: data.length,
          fileSizeKB: (data.length / 1024).toFixed(2),
          fileSizeMB: (data.length / (1024 * 1024)).toFixed(3),
          totalTriangles,
          totalVertices,
          submeshCount: submeshes.length,
          submeshes,
          materialCount: materials.length,
          materials,
          morphTargetSummary: morphTargets,
          boneCount: bones.length,
          bones,
          animationCount: animations.length,
          animations,
          boundingBox: {
            min: [bbox.min.x.toFixed(3), bbox.min.y.toFixed(3), bbox.min.z.toFixed(3)],
            max: [bbox.max.x.toFixed(3), bbox.max.y.toFixed(3), bbox.max.z.toFixed(3)],
            size: [size.x.toFixed(3), size.y.toFixed(3), size.z.toFixed(3)],
            heightCm: (size.y * 100).toFixed(1)
          }
        };

        resolve(report);
      },
      (err) => reject(err)
    );
  });
}

forensicInspectCandidateB().then((report) => {
  console.log(JSON.stringify(report, null, 2));
}).catch((err) => {
  console.error('Inspection error:', err);
  process.exit(1);
});
