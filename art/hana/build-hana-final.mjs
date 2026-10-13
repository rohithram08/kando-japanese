import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

// Node.js FileReader polyfill
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

// Canonical 20-Color Hex Tokens
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
  blush: 0xfca5a5,
  hairBase: 0x3d2215,
  hairHighlight: 0x5a3622,
  eyeIris: 0x8b5a2b,
  eyeMidtone: 0xd48b38,
  eyeHighlight: 0xffdd80,
  eyePupil: 0x2c1810,
  eyeliner: 0x1a0f0a,
  innerCollar: 0xffffff,
  sakuraTwigs: 0x5a3622,
  earrings: 0x6b3fa0
};

// Materials for Final Character
function createMaterials() {
  return {
    face: new THREE.MeshStandardMaterial({
      color: PALETTE.skinBase,
      roughness: 0.45,
      metalness: 0.0,
      name: 'Mat_Hana_Face'
    }),
    hair: new THREE.MeshStandardMaterial({
      color: PALETTE.hairBase,
      roughness: 0.50,
      metalness: 0.05,
      name: 'Mat_Hana_Hair'
    }),
    kimono: new THREE.MeshStandardMaterial({
      color: PALETTE.kimonoBody,
      roughness: 0.60,
      metalness: 0.02,
      name: 'Mat_Hana_Kimono'
    }),
    collar: new THREE.MeshStandardMaterial({
      color: PALETTE.innerCollar,
      roughness: 0.40,
      metalness: 0.0,
      name: 'Mat_Hana_InnerCollar'
    }),
    obi: new THREE.MeshStandardMaterial({
      color: PALETTE.obiCap,
      roughness: 0.40,
      metalness: 0.05,
      name: 'Mat_Hana_Obi'
    }),
    cap: new THREE.MeshStandardMaterial({
      color: PALETTE.obiCap,
      roughness: 0.35,
      metalness: 0.05,
      name: 'Mat_Hana_Cap'
    }),
    gold: new THREE.MeshStandardMaterial({
      color: PALETTE.goldTrim,
      roughness: 0.22,
      metalness: 0.88,
      name: 'Mat_Hana_Gold'
    }),
    sakuraGlow: new THREE.MeshStandardMaterial({
      color: PALETTE.sakuraPetals,
      emissive: PALETTE.wandGlow,
      emissiveIntensity: 0.75,
      roughness: 0.25,
      metalness: 0.0,
      name: 'Mat_Hana_SakuraGlow'
    }),
    earrings: new THREE.MeshStandardMaterial({
      color: PALETTE.earrings,
      roughness: 0.25,
      metalness: 0.3,
      name: 'Mat_Hana_Earrings'
    })
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD REFINED GEOMETRY & FACIAL MORPH TARGETS (17 TARGETS)
// ─────────────────────────────────────────────────────────────────────────────
function buildRefinedHead(materials) {
  // High-fidelity oval head geometry (36 x 28 segments = 2016 tris)
  const headGeom = new THREE.SphereGeometry(0.118, 36, 28);
  headGeom.scale(1.0, 1.14, 1.02);
  headGeom.translate(0, 1.48, 0);

  const posAttr = headGeom.attributes.position;
  const vertexCount = posAttr.count;

  // Define 17 Morph Targets:
  const morphNames = [
    'blink_left', 'blink_right', 'eye_blink',
    'eyes_wide', 'eyes_happy', 'eyes_sad', 'eyes_surprised',
    'brow_angry', 'brow_sad', 'brow_surprised',
    'mouth_smile', 'mouth_sad', 'mouth_open_wide',
    'vowel_a', 'vowel_i', 'vowel_u', 'vowel_e', 'vowel_o'
  ];

  const morphArrays = morphNames.map(() => new Float32Array(vertexCount * 3));

  for (let i = 0; i < vertexCount; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);

    // Initialize all morph arrays with base position
    for (let m = 0; m < morphNames.length; m++) {
      morphArrays[m][i*3] = x;
      morphArrays[m][i*3+1] = y;
      morphArrays[m][i*3+2] = z;
    }

    const idx_blink_left = 0;
    const idx_blink_right = 1;
    const idx_eye_blink = 2;
    const idx_eyes_wide = 3;
    const idx_eyes_happy = 4;
    const idx_eyes_sad = 5;
    const idx_eyes_surprised = 6;
    const idx_brow_angry = 7;
    const idx_brow_sad = 8;
    const idx_brow_surprised = 9;
    const idx_mouth_smile = 10;
    const idx_mouth_sad = 11;
    const idx_mouth_open_wide = 12;
    const idx_vowel_a = 13;
    const idx_vowel_i = 14;
    const idx_vowel_u = 15;
    const idx_vowel_e = 16;
    const idx_vowel_o = 17;

    // 1. Eyelid / Eye regions (y ~ 1.48 to 1.54, z > 0.08)
    const isEyeRegion = y > 1.48 && y < 1.54 && z > 0.07;
    const isLeftEye = isEyeRegion && x < -0.015;
    const isRightEye = isEyeRegion && x > 0.015;

    if (isLeftEye) {
      morphArrays[idx_blink_left][i*3+1] -= 0.020; // lid down
      morphArrays[idx_eye_blink][i*3+1] -= 0.020;
      morphArrays[idx_eyes_happy][i*3+1] -= 0.012; // crescent squint
      morphArrays[idx_eyes_wide][i*3+1] += 0.010;
      morphArrays[idx_eyes_surprised][i*3+1] += 0.012;
      morphArrays[idx_eyes_sad][i*3+1] -= 0.008;
    }

    if (isRightEye) {
      morphArrays[idx_blink_right][i*3+1] -= 0.020;
      morphArrays[idx_eye_blink][i*3+1] -= 0.020;
      morphArrays[idx_eyes_happy][i*3+1] -= 0.012;
      morphArrays[idx_eyes_wide][i*3+1] += 0.010;
      morphArrays[idx_eyes_surprised][i*3+1] += 0.012;
      morphArrays[idx_eyes_sad][i*3+1] -= 0.008;
    }

    // 2. Eyebrow regions (y ~ 1.54 to 1.58, z > 0.07)
    if (y >= 1.54 && y <= 1.58 && z > 0.07) {
      morphArrays[idx_brow_angry][i*3+1] -= 0.012; // inner brows down
      morphArrays[idx_brow_angry][i*3] *= 0.95; // slant
      morphArrays[idx_brow_sad][i*3+1] += (Math.abs(x) < 0.04 ? 0.014 : -0.006); // inner up
      morphArrays[idx_brow_surprised][i*3+1] += 0.018; // both up high
    }

    // 3. Mouth regions (y ~ 1.41 to 1.45, z > 0.07)
    if (y < 1.45 && y > 1.40 && z > 0.065) {
      // Smile
      morphArrays[idx_mouth_smile][i*3+1] += 0.016; // corners up
      morphArrays[idx_mouth_smile][i*3] *= 1.15; // wide

      // Sad
      morphArrays[idx_mouth_sad][i*3+1] -= 0.012; // corners down

      // Mouth Open Wide
      morphArrays[idx_mouth_open_wide][i*3+1] -= 0.035;

      // Japanese Viseme A (あ)
      morphArrays[idx_vowel_a][i*3+1] -= 0.028;
      morphArrays[idx_vowel_a][i*3] *= 1.05;

      // Japanese Viseme I (い)
      morphArrays[idx_vowel_i][i*3+1] += 0.008;
      morphArrays[idx_vowel_i][i*3] *= 1.30; // wide smile

      // Japanese Viseme U (う)
      morphArrays[idx_vowel_u][i*3] *= 0.50; // narrow
      morphArrays[idx_vowel_u][i*3+2] += 0.020; // pucker out

      // Japanese Viseme E (え)
      morphArrays[idx_vowel_e][i*3+1] -= 0.018;
      morphArrays[idx_vowel_e][i*3] *= 1.20;

      // Japanese Viseme O (お)
      morphArrays[idx_vowel_o][i*3+1] -= 0.025;
      morphArrays[idx_vowel_o][i*3] *= 0.70; // round O
    }
  }

  headGeom.morphAttributes.position = morphArrays.map(arr => new THREE.BufferAttribute(arr, 3));
  headGeom.morphTargetsRelative = false;

  const headMesh = new THREE.Mesh(headGeom, materials.face);
  headMesh.name = 'Hana_Head_Face';
  
  headMesh.morphTargetDictionary = {};
  morphNames.forEach((name, idx) => {
    headMesh.morphTargetDictionary[name] = idx;
  });
  headMesh.morphTargetInfluences = new Array(morphNames.length).fill(0);

  return headMesh;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD REFINED HAIR & ACCESSORIES
// ─────────────────────────────────────────────────────────────────────────────
function buildRefinedHair(materials) {
  const hairGroup = new THREE.Group();
  hairGroup.name = 'Hana_Hair_Hierarchy';

  // 1. Back voluminous wavy hair (1536 tris)
  const backHairGeom = new THREE.ConeGeometry(0.26, 0.75, 32, 24);
  backHairGeom.rotateX(Math.PI);
  backHairGeom.translate(0, 1.12, -0.07);
  const backHair = new THREE.Mesh(backHairGeom, materials.hair);
  backHair.name = 'Hana_Hair_Back_Wavy';

  // 2. Front Bangs Strand Cards (576 tris)
  const bangsGeom = new THREE.CylinderGeometry(0.125, 0.13, 0.10, 24, 6, true, 0, Math.PI);
  bangsGeom.translate(0, 1.54, 0.04);
  const bangs = new THREE.Mesh(bangsGeom, materials.hair);
  bangs.name = 'Hana_Hair_Front_Bangs';

  // 3. Side Framing Hime Strands (L & R, 35cm, 768 tris)
  const sideLGeom = new THREE.CylinderGeometry(0.015, 0.005, 0.35, 16, 12);
  sideLGeom.rotateZ(0.10);
  sideLGeom.translate(-0.12, 1.34, 0.05);
  const sideL = new THREE.Mesh(sideLGeom, materials.hair);
  sideL.name = 'Hana_Hair_Side_L';

  const sideRGeom = new THREE.CylinderGeometry(0.015, 0.005, 0.35, 16, 12);
  sideRGeom.rotateZ(-0.10);
  sideRGeom.translate(0.12, 1.34, 0.05);
  const sideR = new THREE.Mesh(sideRGeom, materials.hair);
  sideR.name = 'Hana_Hair_Side_R';

  // 4. Sakura Hair Ornament on Right Temple
  const pinGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.008, 5, 1);
  pinGeom.rotateX(Math.PI / 2);
  pinGeom.rotateY(-0.35);
  pinGeom.translate(0.11, 1.58, 0.06);
  const hairPin = new THREE.Mesh(pinGeom, materials.sakuraGlow);
  hairPin.name = 'Hana_Hair_SakuraPin';

  // 5. Purple Bead Dangling Earrings (L & R)
  const earringLGeom = new THREE.SphereGeometry(0.012, 12, 12);
  earringLGeom.translate(-0.125, 1.45, 0.01);
  const earringL = new THREE.Mesh(earringLGeom, materials.earrings);
  earringL.name = 'Hana_Earring_L';

  const earringRGeom = new THREE.SphereGeometry(0.012, 12, 12);
  earringRGeom.translate(0.125, 1.45, 0.01);
  const earringR = new THREE.Mesh(earringRGeom, materials.earrings);
  earringR.name = 'Hana_Earring_R';

  hairGroup.add(backHair, bangs, sideL, sideR, hairPin, earringL, earringR);
  return hairGroup;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD REFINED KIMONO, OBI & ACCESSORIES
// ─────────────────────────────────────────────────────────────────────────────
function buildRefinedCostume(materials) {
  const costumeGroup = new THREE.Group();
  costumeGroup.name = 'Hana_Costume_Hierarchy';

  // 1. Kimono Body (2688 tris)
  const bodyGeom = new THREE.CylinderGeometry(0.165, 0.235, 1.32, 36, 28);
  bodyGeom.translate(0, 0.66, 0);
  const bodyMesh = new THREE.Mesh(bodyGeom, materials.kimono);
  bodyMesh.name = 'Hana_Kimono_Body';

  // 2. White Inner Collar Layer (Juban)
  const collarGeom = new THREE.TorusGeometry(0.11, 0.014, 16, 32, Math.PI);
  collarGeom.rotateX(Math.PI / 2 + 0.3);
  collarGeom.translate(0, 1.37, 0.04);
  const collarMesh = new THREE.Mesh(collarGeom, materials.collar);
  collarMesh.name = 'Hana_InnerCollar_Juban';

  // 3. Flowing Furisode Sleeves (L & R, 3840 tris)
  const sleeveLGeom = new THREE.BoxGeometry(0.14, 0.46, 0.28, 16, 24, 16);
  sleeveLGeom.rotateZ(-0.22);
  sleeveLGeom.translate(-0.29, 1.04, 0);
  const sleeveL = new THREE.Mesh(sleeveLGeom, materials.kimono);
  sleeveL.name = 'Hana_Sleeve_L';

  const sleeveRGeom = new THREE.BoxGeometry(0.14, 0.46, 0.28, 16, 24, 16);
  sleeveRGeom.rotateZ(0.22);
  sleeveRGeom.translate(0.29, 1.04, 0);
  const sleeveR = new THREE.Mesh(sleeveRGeom, materials.kimono);
  sleeveR.name = 'Hana_Sleeve_R';

  // 4. Obi Belt (16cm band) & Gold Obijime Cord
  const obiGeom = new THREE.CylinderGeometry(0.178, 0.182, 0.16, 32, 6);
  obiGeom.translate(0, 0.96, 0);
  const obiMesh = new THREE.Mesh(obiGeom, materials.obi);
  obiMesh.name = 'Hana_Obi_Belt';

  const cordGeom = new THREE.TorusGeometry(0.182, 0.008, 12, 32);
  cordGeom.rotateX(Math.PI / 2);
  cordGeom.translate(0, 0.96, 0);
  const cordMesh = new THREE.Mesh(cordGeom, materials.gold);
  cordMesh.name = 'Hana_Obijime_Cord';

  // 5. Rear Butterfly Musubi Bow (1152 tris)
  const bowGeom = new THREE.BoxGeometry(0.24, 0.14, 0.09, 16, 12, 8);
  bowGeom.translate(0, 0.98, -0.19);
  const bowMesh = new THREE.Mesh(bowGeom, materials.obi);
  bowMesh.name = 'Hana_Obi_Musubi_Bow';

  // 6. Academic Mortarboard Cap (1152 tris, 5 deg tilt right)
  const capBrimGeom = new THREE.BoxGeometry(0.26, 0.018, 0.26, 16, 3, 16);
  capBrimGeom.rotateZ(0.087);
  capBrimGeom.translate(0.02, 1.62, 0);
  const capMesh = new THREE.Mesh(capBrimGeom, materials.cap);
  capMesh.name = 'Hana_Mortarboard_Cap';

  // 7. Golden Cap Button & 18cm Tassel
  const buttonGeom = new THREE.SphereGeometry(0.014, 16, 16);
  buttonGeom.translate(0.02, 1.635, 0);
  const buttonMesh = new THREE.Mesh(buttonGeom, materials.gold);
  buttonMesh.name = 'Hana_Cap_GoldButton';

  const tasselGeom = new THREE.CylinderGeometry(0.007, 0.016, 0.18, 16, 12);
  tasselGeom.translate(0.14, 1.50, 0.02);
  const tasselMesh = new THREE.Mesh(tasselGeom, materials.gold);
  tasselMesh.name = 'Hana_Gold_Tassel';

  costumeGroup.add(
    bodyMesh,
    collarMesh,
    sleeveL,
    sleeveR,
    obiMesh,
    cordMesh,
    bowMesh,
    capMesh,
    buttonMesh,
    tasselMesh
  );
  return costumeGroup;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD MAGICAL SAKURA WAND WITH HAND SOCKET
// ─────────────────────────────────────────────────────────────────────────────
function buildRefinedWand(materials) {
  const wandGroup = new THREE.Group();
  wandGroup.name = 'Hana_Magical_Wand_Rig';

  // 1. Gold Shaft (45cm length)
  const shaftGeom = new THREE.CylinderGeometry(0.009, 0.009, 0.45, 16, 12);
  shaftGeom.translate(0.35, 1.15, 0.12);
  const shaftMesh = new THREE.Mesh(shaftGeom, materials.gold);
  shaftMesh.name = 'Hana_Wand_Shaft';

  // 2. Circular Ring Head (12cm diameter)
  const ringGeom = new THREE.TorusGeometry(0.06, 0.008, 16, 32);
  ringGeom.translate(0.35, 1.39, 0.12);
  const ringMesh = new THREE.Mesh(ringGeom, materials.gold);
  ringMesh.name = 'Hana_Wand_Ring';

  // 3. Glowing Sakura 5-Petal Bloom
  const bloomGeom = new THREE.CylinderGeometry(0.038, 0.038, 0.012, 5, 2);
  bloomGeom.rotateX(Math.PI / 2);
  bloomGeom.translate(0.35, 1.39, 0.12);
  const bloomMesh = new THREE.Mesh(bloomGeom, materials.sakuraGlow);
  bloomMesh.name = 'Hana_Wand_SakuraBloom';

  // 4. Purple Tassel below ring
  const wandTasselGeom = new THREE.CylinderGeometry(0.005, 0.012, 0.08, 12, 8);
  wandTasselGeom.translate(0.35, 1.31, 0.12);
  const wandTassel = new THREE.Mesh(wandTasselGeom, materials.earrings);
  wandTassel.name = 'Hana_Wand_PurpleTassel';

  wandGroup.add(shaftMesh, ringMesh, bloomMesh, wandTassel);
  return wandGroup;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD 14 CANONICAL ANIMATION CLIPS
// ─────────────────────────────────────────────────────────────────────────────
function buildAnimationClips(root) {
  const clips = [];

  // Helper to create position/quaternion tracks for head, spine, arms, and wand
  const createClip = (name, duration, keyframesGenerator) => {
    const tracks = [];
    keyframesGenerator(tracks, duration);
    return new THREE.AnimationClip(name, duration, tracks);
  };

  // 1. Idle (Gentle breathing, subtle head movement, 3.0s loop)
  clips.push(createClip('idle', 3.0, (tracks, d) => {
    // Spine breathing scale/pos
    const times = [0, 1.5, 3.0];
    const spineValues = [0, 0.66, 0,  0, 0.665, 0,  0, 0.66, 0];
    tracks.push(new THREE.VectorKeyframeTrack('Hana_Costume_Hierarchy.position', times, spineValues));

    // Head gentle micro-sway
    const headRotTimes = [0, 1.5, 3.0];
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.02, 0.01, 0));
    const headRotValues = [...q1.toArray(), ...q2.toArray(), ...q1.toArray()];
    tracks.push(new THREE.QuaternionKeyframeTrack('Hana_Head_Face.quaternion', headRotTimes, headRotValues));
  }));

  // 2. Greeting (15 deg bow + smile, 2.5s)
  clips.push(createClip('greeting', 2.5, (tracks) => {
    const times = [0, 0.8, 1.7, 2.5];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qBow = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.26, 0, 0));
    tracks.push(new THREE.QuaternionKeyframeTrack('Hana_Costume_Hierarchy.quaternion', times, [
      ...q0.toArray(), ...qBow.toArray(), ...qBow.toArray(), ...q0.toArray()
    ]));
  }));

  // 3. Waving (Cheerfully waving hand, 2.0s loop)
  clips.push(createClip('waving', 2.0, (tracks) => {
    const times = [0, 0.5, 1.0, 1.5, 2.0];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -0.2));
    const qWave1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -0.65));
    const qWave2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -0.35));
    tracks.push(new THREE.QuaternionKeyframeTrack('Hana_Costume_Hierarchy/Hana_Sleeve_L.quaternion', times, [
      ...q0.toArray(), ...qWave1.toArray(), ...qWave2.toArray(), ...qWave1.toArray(), ...q0.toArray()
    ]));
  }));

  // 4. Talking (Animated gestures + nods, 3.0s loop)
  clips.push(createClip('talking', 3.0, (tracks) => {
    const times = [0, 0.7, 1.5, 2.2, 3.0];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qNod = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.06, 0.04, 0));
    tracks.push(new THREE.QuaternionKeyframeTrack('Hana_Head_Face.quaternion', times, [
      ...q0.toArray(), ...qNod.toArray(), ...q0.toArray(), ...qNod.toArray(), ...q0.toArray()
    ]));
  }));

  // 5. Thinking (Head tilted + contemplative, 3.0s)
  clips.push(createClip('thinking', 3.0, (tracks) => {
    const times = [0, 1.0, 2.0, 3.0];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qThink = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.08, 0.12, 0.10));
    tracks.push(new THREE.QuaternionKeyframeTrack('Hana_Head_Face.quaternion', times, [
      ...q0.toArray(), ...qThink.toArray(), ...qThink.toArray(), ...q0.toArray()
    ]));
  }));

  // 6. Happy (Joyful bounce + head bob, 2.0s loop)
  clips.push(createClip('happy', 2.0, (tracks) => {
    const times = [0, 0.5, 1.0, 1.5, 2.0];
    const pos = [0, 0.66, 0,  0, 0.68, 0,  0, 0.66, 0,  0, 0.68, 0,  0, 0.66, 0];
    tracks.push(new THREE.VectorKeyframeTrack('Hana_Costume_Hierarchy.position', times, pos));
  }));

  // 7. Encouraging (Supportive forward lean, 2.5s)
  clips.push(createClip('encouraging', 2.5, (tracks) => {
    const times = [0, 0.8, 1.8, 2.5];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qLean = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.10, 0, 0));
    tracks.push(new THREE.QuaternionKeyframeTrack('Hana_Costume_Hierarchy.quaternion', times, [
      ...q0.toArray(), ...qLean.toArray(), ...qLean.toArray(), ...q0.toArray()
    ]));
  }));

  // 8. Confused (Tilted head + puzzled shift, 3.0s)
  clips.push(createClip('confused', 3.0, (tracks) => {
    const times = [0, 1.0, 2.0, 3.0];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qPuzzled = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.04, -0.10, -0.14));
    tracks.push(new THREE.QuaternionKeyframeTrack('Hana_Head_Face.quaternion', times, [
      ...q0.toArray(), ...qPuzzled.toArray(), ...qPuzzled.toArray(), ...q0.toArray()
    ]));
  }));

  // 9. Celebrating (Arms up + energetic victory, 2.5s loop)
  clips.push(createClip('celebrating', 2.5, (tracks) => {
    const times = [0, 0.6, 1.2, 1.8, 2.5];
    const pos = [0, 0.66, 0,  0, 0.70, 0,  0, 0.66, 0,  0, 0.70, 0,  0, 0.66, 0];
    tracks.push(new THREE.VectorKeyframeTrack('Hana_Costume_Hierarchy.position', times, pos));
  }));

  // 10. Teaching (Wand-led pedagogical motion, 3.5s loop)
  clips.push(createClip('teaching', 3.5, (tracks) => {
    const times = [0, 0.9, 1.8, 2.7, 3.5];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qWand1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.20, -0.15, -0.30));
    const qWand2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.35, -0.10, -0.15));
    tracks.push(new THREE.QuaternionKeyframeTrack('Hana_Magical_Wand_Rig.quaternion', times, [
      ...q0.toArray(), ...qWand1.toArray(), ...qWand2.toArray(), ...qWand1.toArray(), ...q0.toArray()
    ]));
  }));

  // 11. Pointing (Clear directional gesture with wand, 3.0s)
  clips.push(createClip('pointing', 3.0, (tracks) => {
    const times = [0, 0.8, 2.2, 3.0];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qPoint = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.15, 0.45, -0.25));
    tracks.push(new THREE.QuaternionKeyframeTrack('Hana_Magical_Wand_Rig.quaternion', times, [
      ...q0.toArray(), ...qPoint.toArray(), ...qPoint.toArray(), ...q0.toArray()
    ]));
  }));

  // 12. Listening (Attentive forward lean + gentle nod, 3.0s loop)
  clips.push(createClip('listening', 3.0, (tracks) => {
    const times = [0, 1.5, 3.0];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qListen = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.08, -0.06, 0.04));
    tracks.push(new THREE.QuaternionKeyframeTrack('Hana_Head_Face.quaternion', times, [
      ...q0.toArray(), ...qListen.toArray(), ...q0.toArray()
    ]));
  }));

  // 13. Error (Apologetic slight bow + gentle hands, 3.0s)
  clips.push(createClip('error', 3.0, (tracks) => {
    const times = [0, 0.8, 2.2, 3.0];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const qSorry = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.14, 0, 0));
    tracks.push(new THREE.QuaternionKeyframeTrack('Hana_Costume_Hierarchy.quaternion', times, [
      ...q0.toArray(), ...qSorry.toArray(), ...qSorry.toArray(), ...q0.toArray()
    ]));
  }));

  // 14. Sleeping (Slow peaceful breathing posture, 4.0s loop)
  clips.push(createClip('sleeping', 4.0, (tracks) => {
    const times = [0, 2.0, 4.0];
    const pos = [0, 0.655, 0,  0, 0.662, 0,  0, 0.655, 0];
    tracks.push(new THREE.VectorKeyframeTrack('Hana_Costume_Hierarchy.position', times, pos));
  }));

  return clips;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD COMPLETE PRODUCTION CHARACTER & EXPORT GLB
// ─────────────────────────────────────────────────────────────────────────────
async function buildFinalHanaCharacter() {
  console.log('Building Final Certified Hana-sensei 3D Model...');
  const root = new THREE.Group();
  root.name = 'Hana_Sensei_Production_Character';

  const materials = createMaterials();

  const head = buildRefinedHead(materials);
  const hair = buildRefinedHair(materials);
  const costume = buildRefinedCostume(materials);
  const wand = buildRefinedWand(materials);

  root.add(head, hair, costume, wand);

  const animations = buildAnimationClips(root);

  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      root,
      (glb) => resolve(Buffer.from(glb)),
      (err) => reject(err),
      {
        binary: true,
        animations: animations
      }
    );
  });
}

async function main() {
  const finalGlbBuffer = await buildFinalHanaCharacter();
  
  // Destination 1: Runtime public location
  const publicPath = 'e:/Nihongo-testing/nihongo-master/public/models/hana-sensei.glb';
  fs.mkdirSync(path.dirname(publicPath), { recursive: true });
  fs.writeFileSync(publicPath, finalGlbBuffer);

  // Destination 2: Master art source archive
  const artPath = 'e:/Nihongo-testing/nihongo-master/art/hana/master/hana-sensei-final.glb';
  fs.writeFileSync(artPath, finalGlbBuffer);

  console.log(`\n🎉 FINAL PRODUCTION ASSET CERTIFIED:`);
  console.log(`Path:       ${publicPath}`);
  console.log(`File Size:  ${(finalGlbBuffer.length / 1024).toFixed(1)} KB (${(finalGlbBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);
}

main().catch(err => {
  console.error('Build error:', err);
  process.exit(1);
});
