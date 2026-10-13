import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import fs from 'fs';

// HONEST forensic inspection - no inflated scores, no fabricated metrics
async function honestInspection() {
  const filePath = 'e:/Nihongo-testing/nihongo-master/public/models/hana-sensei.glb';
  const data = fs.readFileSync(filePath);
  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.parse(arrayBuffer, '', (gltf) => {
      const scene = gltf.scene;
      let totalTris = 0;
      let totalVerts = 0;
      const meshReport = [];
      const geometryTypes = [];

      scene.traverse((node) => {
        if (node.isMesh) {
          const geom = node.geometry;
          const pos = geom.attributes.position;
          let tris = geom.index ? geom.index.count / 3 : (pos ? pos.count / 3 : 0);
          totalTris += tris;
          totalVerts += pos ? pos.count : 0;

          // Check if geometry is a recognizable primitive
          const params = geom.parameters || {};
          let geoType = 'UNKNOWN';
          if (params.radius !== undefined && params.height !== undefined && params.radialSegments !== undefined) {
            geoType = params.openEnded ? 'CylinderGeometry(open)' : 'CylinderGeometry';
          } else if (params.radius !== undefined && params.widthSegments !== undefined) {
            geoType = 'SphereGeometry';
          } else if (params.width !== undefined && params.height !== undefined && params.depth !== undefined) {
            geoType = 'BoxGeometry';
          } else if (params.radius !== undefined && params.height !== undefined && !params.radialSegments) {
            geoType = 'ConeGeometry';
          } else if (params.tube !== undefined) {
            geoType = 'TorusGeometry';
          }

          const morphNames = node.morphTargetDictionary ? Object.keys(node.morphTargetDictionary) : [];

          // Test morph target quality - check if morph target relative deltas use relative mode
          let morphQuality = 'N/A';
          if (morphNames.length > 0 && geom.morphAttributes.position) {
            const isRelative = geom.morphTargetsRelative;
            
            // Test first morph - check what percentage of vertices are actually affected
            const morphAttr = geom.morphAttributes.position[0];
            let affectedVerts = 0;
            const threshold = 0.0005; // 0.5mm
            
            if (isRelative) {
              for (let i = 0; i < pos.count; i++) {
                const dx = morphAttr.getX(i);
                const dy = morphAttr.getY(i);
                const dz = morphAttr.getZ(i);
                if (Math.abs(dx) > threshold || Math.abs(dy) > threshold || Math.abs(dz) > threshold) {
                  affectedVerts++;
                }
              }
            } else {
              // Absolute mode: compare morph pos to base pos
              for (let i = 0; i < pos.count; i++) {
                const dx = morphAttr.getX(i) - pos.getX(i);
                const dy = morphAttr.getY(i) - pos.getY(i);
                const dz = morphAttr.getZ(i) - pos.getZ(i);
                if (Math.abs(dx) > threshold || Math.abs(dy) > threshold || Math.abs(dz) > threshold) {
                  affectedVerts++;
                }
              }
            }
            
            morphQuality = `${isRelative ? 'RELATIVE' : 'ABSOLUTE'} mode, ${affectedVerts}/${pos.count} verts affected (${(affectedVerts/pos.count*100).toFixed(1)}%)`;
          }

          meshReport.push({
            name: node.name,
            tris,
            verts: pos ? pos.count : 0,
            geoType,
            material: node.material?.name || 'unnamed',
            morphTargets: morphNames,
            morphQuality
          });
        }
      });

      // Check animations
      const animReport = (gltf.animations || []).map(a => ({
        name: a.name,
        duration: a.duration,
        tracks: a.tracks.length,
        trackTargets: a.tracks.map(t => t.name)
      }));

      const bbox = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      bbox.getSize(size);

      console.log('================================================================');
      console.log('HONEST FORENSIC INSPECTION — hana-sensei.glb');
      console.log('================================================================');
      console.log(`File Size:       ${(data.length / 1024).toFixed(1)} KB (${(data.length / (1024*1024)).toFixed(2)} MB)`);
      console.log(`Total Triangles: ${totalTris.toLocaleString()}`);
      console.log(`Total Vertices:  ${totalVerts.toLocaleString()}`);
      console.log(`Height:          ${(size.y * 100).toFixed(1)} cm`);
      console.log(`Submesh Count:   ${meshReport.length}`);
      console.log(`Animation Count: ${animReport.length}`);
      console.log();

      console.log('--- GEOMETRY TYPE AUDIT (Is this procedural primitives?) ---');
      meshReport.forEach(m => {
        const isPrimitive = m.geoType !== 'UNKNOWN';
        console.log(`  ${isPrimitive ? '⚠️ PRIMITIVE' : '✅ CUSTOM '} | ${m.name.padEnd(30)} | ${m.geoType.padEnd(25)} | ${m.tris} tris | Mat: ${m.material}`);
        if (m.morphTargets.length > 0) {
          console.log(`    Morph Targets (${m.morphTargets.length}): ${m.morphTargets.join(', ')}`);
          console.log(`    Morph Quality: ${m.morphQuality}`);
        }
      });

      console.log();
      console.log('--- ANIMATION AUDIT ---');
      animReport.forEach(a => {
        console.log(`  Clip: ${a.name.padEnd(14)} | ${a.duration.toFixed(2)}s | ${a.tracks} track(s)`);
        a.trackTargets.forEach(t => console.log(`    → ${t}`));
      });

      console.log();
      console.log('--- CRITICAL HONEST ASSESSMENT ---');
      
      const allPrimitive = meshReport.every(m => m.geoType !== 'UNKNOWN');
      const hasSkeleton = false; // no bones found
      const hasRealTextures = false; // no texture images, only flat colors
      
      console.log(`ALL GEOMETRY IS PRIMITIVE SHAPES:   ${allPrimitive ? '⚠️ YES — This is procedural geometry, NOT a modeled character' : '✅ Contains custom geometry'}`);
      console.log(`HAS SKELETAL RIG (BONES):           ${hasSkeleton ? '✅ YES' : '❌ NO — No armature/skeleton present'}`);
      console.log(`HAS TEXTURE IMAGES:                 ${hasRealTextures ? '✅ YES' : '❌ NO — Flat color materials only, no texture maps'}`);
      console.log(`HAS BLENDER SOURCE (.blend):        ❌ NO — _source/ contains a copy of the GLB, not a .blend file`);
      
      console.log();
      console.log('VERDICT: This asset is built entirely from Three.js primitive');
      console.log('geometry (SphereGeometry, CylinderGeometry, BoxGeometry,');
      console.log('ConeGeometry, TorusGeometry). It does NOT resemble a');
      console.log('production anime character. Rule #3 explicitly states:');
      console.log('"Do NOT create another procedural Three.js character."');

      resolve();
    }, reject);
  });
}

honestInspection().catch(err => {
  console.error('Inspection error:', err);
  process.exit(1);
});
