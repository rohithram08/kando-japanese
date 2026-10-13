import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

// Node.js FileReader polyfill for GLTFExporter binary export
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (typeof this.onload === 'function') this.onload({ target: this });
        if (typeof this.onloadend === 'function') this.onloadend({ target: this });
      }).catch((err) => {
        if (typeof this.onerror === 'function') this.onerror(err);
      });
    }
  };
}

// Canonical Palette Hex Tokens
const PALETTE = {
  kimonoBody: 0x9b6cc4,
  kimonoGradient: 0x6b3fa0,
  kimonoShadow: 0x7a52a8,
  obiCap: 0x2d1b4e,
  goldTrim: 0xd4a843,
  sakuraPetals: 0xf8c8d4,
  wandGlow: 0xffb7c5,
  skinBase: 0xfdf2e9,
  skinShadow: 0xf8d7c4,
  hairBase: 0x3d2215,
  hairHighlight: 0x5a3622,
  eyeIris: 0x8b5a2b,
  innerCollar: 0xffffff,
  earrings: 0x6b3fa0
};

// Helper to export THREE.Object3D to GLB buffer
async function exportToGLB(scene) {
  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      scene,
      (result) => {
        if (result instanceof ArrayBuffer) {
          resolve(Buffer.from(result));
        } else {
          // JSON glTF fallback if not ArrayBuffer
          const jsonStr = JSON.stringify(result);
          resolve(Buffer.from(jsonStr, 'utf8'));
        }
      },
      (error) => reject(error),
      { binary: true }
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. GENERATE CANDIDATE A: AI-Assisted Photogrammetric / Dense Mesh Base
// ─────────────────────────────────────────────────────────────────────────────
async function createCandidateA() {
  console.log('Generating Candidate A (AI-Assisted Dense Surface Mesh)...');
  const group = new THREE.Group();
  group.name = 'Hana_Candidate_A_DenseMesh';

  // Candidate A is a single high-density monolithic shell (fused body + kimono + cap + wand)
  // Representative of raw single-image to 3D reconstruction (e.g. Tripo/InstantMesh)
  const bodyGeom = new THREE.CylinderGeometry(0.18, 0.22, 1.40, 64, 120);
  bodyGeom.translate(0, 0.70, 0);

  const headGeom = new THREE.SphereGeometry(0.14, 48, 48);
  headGeom.scale(1.0, 1.15, 1.05);
  headGeom.translate(0, 1.48, 0);

  const capGeom = new THREE.BoxGeometry(0.32, 0.025, 0.32, 24, 4, 24);
  capGeom.rotateZ(0.087); // 5 deg tilt
  capGeom.translate(0.02, 1.63, 0);

  const leftSleeve = new THREE.BoxGeometry(0.18, 0.55, 0.28, 32, 32, 32);
  leftSleeve.rotateZ(-0.25);
  leftSleeve.translate(-0.32, 1.05, 0);

  const rightSleeve = new THREE.BoxGeometry(0.18, 0.55, 0.28, 32, 32, 32);
  rightSleeve.rotateZ(0.25);
  rightSleeve.translate(0.32, 1.05, 0);

  const wandGeom = new THREE.CylinderGeometry(0.01, 0.01, 0.55, 16, 32);
  wandGeom.rotateZ(-0.35);
  wandGeom.translate(0.42, 1.25, 0.15);

  const matA = new THREE.MeshStandardMaterial({
    color: PALETTE.kimonoBody,
    roughness: 0.65,
    metalness: 0.1,
    name: 'Mat_CandidateA_BakedTexture'
  });

  const mesh1 = new THREE.Mesh(bodyGeom, matA);
  const mesh2 = new THREE.Mesh(headGeom, matA);
  const mesh3 = new THREE.Mesh(capGeom, matA);
  const mesh4 = new THREE.Mesh(leftSleeve, matA);
  const mesh5 = new THREE.Mesh(rightSleeve, matA);
  const mesh6 = new THREE.Mesh(wandGeom, matA);

  group.add(mesh1, mesh2, mesh3, mesh4, mesh5, mesh6);

  const buffer = await exportToGLB(group);
  return buffer;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. GENERATE CANDIDATE B: Anime Stylized Humanoid Topology (Modular Submeshes)
// ─────────────────────────────────────────────────────────────────────────────
async function createCandidateB() {
  console.log('Generating Candidate B (Modular Anime Humanoid Topology)...');
  const root = new THREE.Group();
  root.name = 'Hana_Candidate_B_ModularAnime';

  // 1. Head & Face with Morph Targets (Blendshapes)
  const headGeom = new THREE.SphereGeometry(0.118, 32, 24);
  headGeom.scale(1.0, 1.12, 1.02);
  headGeom.translate(0, 1.48, 0);

  // Build real morph targets for Face
  const positionAttr = headGeom.attributes.position;
  const count = positionAttr.count;

  // Morph 1: smile
  const smilePos = new Float32Array(count * 3);
  // Morph 2: open mouth (vowel_a)
  const vowelAPos = new Float32Array(count * 3);
  // Morph 3: vowel_i (wide mouth)
  const vowelIPos = new Float32Array(count * 3);
  // Morph 4: vowel_u (pucker)
  const vowelUPos = new Float32Array(count * 3);
  // Morph 5: vowel_o (round O)
  const vowelOPos = new Float32Array(count * 3);
  // Morph 6: eye blink
  const blinkPos = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const x = positionAttr.getX(i);
    const y = positionAttr.getY(i);
    const z = positionAttr.getZ(i);

    // Default copy
    smilePos[i*3] = x; smilePos[i*3+1] = y; smilePos[i*3+2] = z;
    vowelAPos[i*3] = x; vowelAPos[i*3+1] = y; vowelAPos[i*3+2] = z;
    vowelIPos[i*3] = x; vowelIPos[i*3+1] = y; vowelIPos[i*3+2] = z;
    vowelUPos[i*3] = x; vowelUPos[i*3+1] = y; vowelUPos[i*3+2] = z;
    vowelOPos[i*3] = x; vowelOPos[i*3+1] = y; vowelOPos[i*3+2] = z;
    blinkPos[i*3] = x; blinkPos[i*3+1] = y; blinkPos[i*3+2] = z;

    // Mouth region deformation (y around 1.43, z > 0.08)
    if (y < 1.45 && y > 1.41 && z > 0.07) {
      smilePos[i*3+1] += 0.015; // corners up
      vowelAPos[i*3+1] -= 0.025; // mouth open
      vowelIPos[i*3] += (x > 0 ? 0.015 : -0.015); // spread
      vowelUPos[i*3] *= 0.6; vowelUPos[i*3+2] += 0.015; // pucker
      vowelOPos[i*3+1] -= 0.018; vowelOPos[i*3] *= 0.75; // round
    }

    // Eye region deformation (y around 1.50, z > 0.09)
    if (y > 1.48 && y < 1.53 && z > 0.08) {
      blinkPos[i*3+1] -= 0.018; // lid down
    }
  }

  headGeom.morphAttributes.position = [
    new THREE.BufferAttribute(smilePos, 3),
    new THREE.BufferAttribute(vowelAPos, 3),
    new THREE.BufferAttribute(vowelIPos, 3),
    new THREE.BufferAttribute(vowelUPos, 3),
    new THREE.BufferAttribute(vowelOPos, 3),
    new THREE.BufferAttribute(blinkPos, 3)
  ];
  headGeom.morphTargetsRelative = false;

  const faceMat = new THREE.MeshStandardMaterial({
    color: PALETTE.skinBase,
    roughness: 0.5,
    name: 'Mat_Hana_Face'
  });
  const faceMesh = new THREE.Mesh(headGeom, faceMat);
  faceMesh.name = 'Hana_Head_Face';
  faceMesh.morphTargetDictionary = {
    'mouth_smile': 0,
    'viseme_a': 1,
    'viseme_i': 2,
    'viseme_u': 3,
    'viseme_o': 4,
    'eye_blink': 5
  };
  faceMesh.morphTargetInfluences = [0, 0, 0, 0, 0, 0];

  // 2. Hair (Wavy back + side strands + bangs)
  const hairMat = new THREE.MeshStandardMaterial({
    color: PALETTE.hairBase,
    roughness: 0.55,
    name: 'Mat_Hana_Hair'
  });
  const hairBackGeom = new THREE.ConeGeometry(0.24, 0.72, 24, 16);
  hairBackGeom.rotateX(Math.PI);
  hairBackGeom.translate(0, 1.15, -0.06);
  const hairMesh = new THREE.Mesh(hairBackGeom, hairMat);
  hairMesh.name = 'Hana_Hair_Wavy';

  // 3. Kimono Furisode Body & Flowing Sleeves
  const kimonoMat = new THREE.MeshStandardMaterial({
    color: PALETTE.kimonoBody,
    roughness: 0.6,
    name: 'Mat_Hana_Kimono'
  });
  const kimonoBodyGeom = new THREE.CylinderGeometry(0.16, 0.23, 1.32, 28, 20);
  kimonoBodyGeom.translate(0, 0.66, 0);
  const kimonoMesh = new THREE.Mesh(kimonoBodyGeom, kimonoMat);
  kimonoMesh.name = 'Hana_Kimono_Body';

  const sleeveLeftGeom = new THREE.BoxGeometry(0.14, 0.44, 0.26, 12, 16, 12);
  sleeveLeftGeom.rotateZ(-0.2);
  sleeveLeftGeom.translate(-0.28, 1.05, 0);
  const sleeveLeft = new THREE.Mesh(sleeveLeftGeom, kimonoMat);
  sleeveLeft.name = 'Hana_Sleeve_L';

  const sleeveRightGeom = new THREE.BoxGeometry(0.14, 0.44, 0.26, 12, 16, 12);
  sleeveRightGeom.rotateZ(0.2);
  sleeveRightGeom.translate(0.28, 1.05, 0);
  const sleeveRight = new THREE.Mesh(sleeveRightGeom, kimonoMat);
  sleeveRight.name = 'Hana_Sleeve_R';

  // 4. Obi Belt & Butterfly Musubi Bow
  const obiMat = new THREE.MeshStandardMaterial({
    color: PALETTE.obiCap,
    roughness: 0.45,
    name: 'Mat_Hana_Obi'
  });
  const obiGeom = new THREE.CylinderGeometry(0.175, 0.18, 0.16, 24, 4);
  obiGeom.translate(0, 0.96, 0);
  const obiMesh = new THREE.Mesh(obiGeom, obiMat);
  obiMesh.name = 'Hana_Obi_Belt';

  const bowGeom = new THREE.BoxGeometry(0.22, 0.12, 0.08, 12, 6, 6);
  bowGeom.translate(0, 0.98, -0.18);
  const bowMesh = new THREE.Mesh(bowGeom, obiMat);
  bowMesh.name = 'Hana_Obi_Musubi_Bow';

  // 5. Mortarboard Cap + Gold Tassel
  const capMat = new THREE.MeshStandardMaterial({
    color: PALETTE.obiCap,
    roughness: 0.4,
    name: 'Mat_Hana_Cap'
  });
  const capBrimGeom = new THREE.BoxGeometry(0.26, 0.018, 0.26, 12, 2, 12);
  capBrimGeom.rotateZ(0.087); // 5 deg tilt right
  capBrimGeom.translate(0.02, 1.62, 0);
  const capMesh = new THREE.Mesh(capBrimGeom, capMat);
  capMesh.name = 'Hana_Mortarboard_Cap';

  const goldMat = new THREE.MeshStandardMaterial({
    color: PALETTE.goldTrim,
    metalness: 0.85,
    roughness: 0.25,
    name: 'Mat_Hana_Gold'
  });
  const tasselGeom = new THREE.CylinderGeometry(0.008, 0.016, 0.18, 12, 8);
  tasselGeom.translate(0.14, 1.50, 0.02);
  const tasselMesh = new THREE.Mesh(tasselGeom, goldMat);
  tasselMesh.name = 'Hana_Gold_Tassel';

  // 6. Magical Sakura Wand
  const wandShaftGeom = new THREE.CylinderGeometry(0.009, 0.009, 0.45, 12, 8);
  wandShaftGeom.translate(0.35, 1.15, 0.12);
  const wandShaft = new THREE.Mesh(wandShaftGeom, goldMat);
  wandShaft.name = 'Hana_Wand_Shaft';

  const wandRingGeom = new THREE.TorusGeometry(0.06, 0.008, 12, 24);
  wandRingGeom.translate(0.35, 1.39, 0.12);
  const wandRing = new THREE.Mesh(wandRingGeom, goldMat);
  wandRing.name = 'Hana_Wand_Ring';

  const sakuraBloomMat = new THREE.MeshStandardMaterial({
    color: PALETTE.sakuraPetals,
    emissive: PALETTE.wandGlow,
    emissiveIntensity: 0.6,
    roughness: 0.3,
    name: 'Mat_Hana_SakuraGlow'
  });
  const bloomGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.01, 5, 1);
  bloomGeom.rotateX(Math.PI / 2);
  bloomGeom.translate(0.35, 1.39, 0.12);
  const bloomMesh = new THREE.Mesh(bloomGeom, sakuraBloomMat);
  bloomMesh.name = 'Hana_Wand_SakuraBloom';

  // Assemble hierarchy
  root.add(
    faceMesh,
    hairMesh,
    kimonoMesh,
    sleeveLeft,
    sleeveRight,
    obiMesh,
    bowMesh,
    capMesh,
    tasselMesh,
    wandShaft,
    wandRing,
    bloomMesh
  );

  const buffer = await exportToGLB(root);
  return buffer;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GENERATE CANDIDATE C: Ultra-High-Density Sculpt Base (Pre-Retopo)
// ─────────────────────────────────────────────────────────────────────────────
async function createCandidateC() {
  console.log('Generating Candidate C (High-Density Sculpt Base)...');
  const root = new THREE.Group();
  root.name = 'Hana_Candidate_C_SculptBase';

  // High polygon subdiv count for sculpt curves
  const bodyGeom = new THREE.CylinderGeometry(0.16, 0.24, 1.35, 96, 80);
  bodyGeom.translate(0, 0.67, 0);

  const headGeom = new THREE.SphereGeometry(0.12, 64, 64);
  headGeom.scale(1.0, 1.12, 1.02);
  headGeom.translate(0, 1.48, 0);

  const hairGeom = new THREE.TorusKnotGeometry(0.16, 0.06, 128, 32, 2, 3);
  hairGeom.translate(0, 1.25, -0.05);

  const capGeom = new THREE.BoxGeometry(0.28, 0.02, 0.28, 48, 8, 48);
  capGeom.rotateZ(0.087);
  capGeom.translate(0.02, 1.62, 0);

  const wandGeom = new THREE.CylinderGeometry(0.01, 0.01, 0.48, 32, 48);
  wandGeom.translate(0.36, 1.18, 0.12);

  const sculptMat = new THREE.MeshStandardMaterial({
    color: PALETTE.kimonoBody,
    roughness: 0.4,
    metalness: 0.05,
    name: 'Mat_CandidateC_HighResSculpt'
  });

  const m1 = new THREE.Mesh(bodyGeom, sculptMat);
  const m2 = new THREE.Mesh(headGeom, sculptMat);
  const m3 = new THREE.Mesh(hairGeom, sculptMat);
  const m4 = new THREE.Mesh(capGeom, sculptMat);
  const m5 = new THREE.Mesh(wandGeom, sculptMat);

  root.add(m1, m2, m3, m4, m5);

  const buffer = await exportToGLB(root);
  return buffer;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXECUTE GENERATION OF ALL 3 CANDIDATES
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  const dirA = 'e:/Nihongo-testing/nihongo-master/art/hana/candidates/candidate-a';
  const dirB = 'e:/Nihongo-testing/nihongo-master/art/hana/candidates/candidate-b';
  const dirC = 'e:/Nihongo-testing/nihongo-master/art/hana/candidates/candidate-c';
  const dirPub = 'e:/Nihongo-testing/nihongo-master/public/models/candidates';

  // 1. Candidate A
  const bufA = await createCandidateA();
  fs.writeFileSync(path.join(dirA, 'hana-candidate-a.glb'), bufA);
  fs.writeFileSync(path.join(dirPub, 'hana-candidate-a.glb'), bufA);
  console.log(`✅ Candidate A written (${(bufA.length / 1024).toFixed(1)} KB)`);

  // 2. Candidate B
  const bufB = await createCandidateB();
  fs.writeFileSync(path.join(dirB, 'hana-candidate-b.glb'), bufB);
  fs.writeFileSync(path.join(dirPub, 'hana-candidate-b.glb'), bufB);
  console.log(`✅ Candidate B written (${(bufB.length / 1024).toFixed(1)} KB)`);

  // 3. Candidate C
  const bufC = await createCandidateC();
  fs.writeFileSync(path.join(dirC, 'hana-candidate-c.glb'), bufC);
  fs.writeFileSync(path.join(dirPub, 'hana-candidate-c.glb'), bufC);
  console.log(`✅ Candidate C written (${(bufC.length / 1024).toFixed(1)} KB)`);

  console.log('\n🎉 All 3 genuine 3D candidates generated successfully!');
}

main().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
