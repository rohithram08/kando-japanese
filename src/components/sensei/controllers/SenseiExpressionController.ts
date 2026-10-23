import * as THREE from 'three';

export type SenseiEmotion =
  | 'neutral'
  | 'happy'
  | 'thinking'
  | 'surprised'
  | 'sad'
  | 'error'
  | 'encouraging'
  | 'celebrating'
  | 'confused'
  | 'listening'
  | 'sleepy';

// All canonical shape keys and aliases to reset when switching emotions
const EMOTION_KEYS = [
  'neutral', 'Fcl_ALL_Neutral',
  'happy', 'Fcl_ALL_Joy',
  'encouraging', 'Fcl_ALL_Fun',
  'surprised', 'Fcl_ALL_Surprised',
  'sad', 'Fcl_ALL_Sorrow',
  'confused', 'Fcl_BRW_Sorrow',
  'thinking', 'Fcl_BRW_Surprised',
  'listening',
  'celebrating',
  'error', 'Fcl_ALL_Angry',
  'sleepy', 'Fcl_EYE_Close',
  // legacy keys
  'eyes_happy_arch', 'eyes_wide', 'brow_angry', 'brow_sad', 'brow_surprised',
  'mouth_smile', 'mouth_sad', 'mouth_open_wide'
];

export class SenseiExpressionController {
  private scene: THREE.Group | null = null;
  private blinkTimer = 0;
  private blinkInterval = 3.5;
  private isBlinking = false;
  private blinkProgress = 0;
  private isSpeaking = false;

  private currentEmotion: SenseiEmotion = 'neutral';
  private targetWeights: Record<string, number> = {};

  // Cache meshes that have morph targets to avoid scene traversal every frame
  private morphMeshes: THREE.Mesh[] = [];

  constructor(scene?: THREE.Group) {
    if (scene) this.setScene(scene);
  }

  public setSpeaking(speaking: boolean) {
    this.isSpeaking = speaking;
  }

  public setScene(scene: THREE.Group) {
    this.scene = scene;
    this.morphMeshes = [];

    // Find all meshes with blendshapes
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
          this.morphMeshes.push(mesh);
        }
      }
    });
  }

  public resetExpressions() {
    this.currentEmotion = 'neutral';
    for (const key of EMOTION_KEYS) {
      this.targetWeights[key] = 0;
    }
  }

  public setEmotion(emotion: SenseiEmotion) {
    this.currentEmotion = emotion;

    // Reset all emotion blendshapes to 0
    for (const key of EMOTION_KEYS) {
      this.targetWeights[key] = 0;
    }

    // Set gentle, natural anime expressions (single clean morph target without extreme stacking!)
    switch (emotion) {
      case 'happy':
        // Soft, sweet anime smile (0.42 provides a natural warm curve, not a slit-mouth grimace)
        this.targetWeights['Fcl_ALL_Joy'] = 0.42;
        break;
      case 'celebrating':
        this.targetWeights['Fcl_ALL_Joy'] = 0.58;
        this.targetWeights['Fcl_BRW_Joy'] = 0.40;
        break;
      case 'encouraging':
        // Reassuring, friendly teacher smile
        this.targetWeights['Fcl_ALL_Fun'] = 0.38;
        break;
      case 'surprised':
        this.targetWeights['Fcl_ALL_Surprised'] = 0.48;
        break;
      case 'sad':
        this.targetWeights['Fcl_ALL_Sorrow'] = 0.42;
        break;
      case 'confused':
        this.targetWeights['Fcl_BRW_Sorrow'] = 0.45;
        this.targetWeights['Fcl_MTH_Small'] = 0.25;
        break;
      case 'thinking':
        this.targetWeights['Fcl_BRW_Surprised'] = 0.38;
        this.targetWeights['Fcl_MTH_Small'] = 0.22;
        break;
      case 'listening':
        this.targetWeights['Fcl_EYE_Spread'] = 0.30;
        this.targetWeights['Fcl_ALL_Neutral'] = 0.25;
        break;
      case 'error':
        this.targetWeights['Fcl_ALL_Angry'] = 0.45;
        break;
      case 'sleepy':
        this.targetWeights['Fcl_EYE_Close'] = 0.65;
        break;
      case 'neutral':
      default:
        this.targetWeights['Fcl_ALL_Neutral'] = 0.25;
        break;
    }
  }

  // Explicitly set a viseme weight (used by LipSyncController)
  public setViseme(visemeName: string, weight: number) {
    this.targetWeights[visemeName] = weight;

    // Map to the exact GLB viseme morph targets
    const lower = visemeName.toLowerCase();
    if (lower === 'vowel_a' || lower === 'a') {
      this.targetWeights['Fcl_MTH_A'] = weight;
      this.targetWeights['vowel_a'] = weight;
    } else if (lower === 'vowel_i' || lower === 'i') {
      this.targetWeights['Fcl_MTH_I'] = weight;
      this.targetWeights['vowel_i'] = weight;
    } else if (lower === 'vowel_u' || lower === 'u') {
      this.targetWeights['Fcl_MTH_U'] = weight;
      this.targetWeights['vowel_u'] = weight;
    } else if (lower === 'vowel_e' || lower === 'e') {
      this.targetWeights['Fcl_MTH_E'] = weight;
      this.targetWeights['vowel_e'] = weight;
    } else if (lower === 'vowel_o' || lower === 'o') {
      this.targetWeights['Fcl_MTH_O'] = weight;
      this.targetWeights['vowel_o'] = weight;
    }
  }

  public update(delta: number) {
    // Handle Blinking logic even if scene isn't loaded yet
    this.blinkTimer += delta;
    if (!this.isBlinking && this.blinkTimer >= this.blinkInterval) {
      this.isBlinking = true;
      this.blinkTimer = 0;
      this.blinkProgress = 0;
      this.blinkInterval = 2.5 + Math.random() * 2.0;
    }

    let blinkWeight = 0;
    if (this.isBlinking) {
      this.blinkProgress += delta * 7;
      if (this.blinkProgress <= 1) {
        blinkWeight = Math.sin(this.blinkProgress * Math.PI);
      } else {
        blinkWeight = 0;
        this.isBlinking = false;
      }
    }

    // Combine natural blinking with current emotion baseline (e.g. sleepy)
    const baseEyeClose = this.currentEmotion === 'sleepy' ? (this.targetWeights['sleepy'] || 0.75) : 0;
    const effectiveClose = Math.min(1.0, baseEyeClose + blinkWeight);

    this.targetWeights['blink'] = effectiveClose;
    this.targetWeights['Fcl_EYE_Close'] = effectiveClose;
    this.targetWeights['blink_left'] = effectiveClose;
    this.targetWeights['Fcl_EYE_Close_L'] = effectiveClose;
    this.targetWeights['blink_right'] = effectiveClose;
    this.targetWeights['Fcl_EYE_Close_R'] = effectiveClose;
    this.targetWeights['blink_L'] = effectiveClose;
    this.targetWeights['blink_R'] = effectiveClose;

    if (!this.scene || this.morphMeshes.length === 0) return;

    // Apply interpolated weights to meshes
    for (const mesh of this.morphMeshes) {
      const dict = mesh.morphTargetDictionary;
      const influences = mesh.morphTargetInfluences;
      if (!dict || !influences) continue;

      for (const [key, targetWeight] of Object.entries(this.targetWeights)) {
        if (dict[key] !== undefined) {
          const idx = dict[key];
          let effectiveWeight = targetWeight;

          // When speaking, decouple active smile/emotion morphs from mouth visemes
          // so vowels can clearly articulate without being locked into a rigid grin!
          if (this.isSpeaking && (
            key.includes('Joy') ||
            key.includes('Fun') ||
            key.includes('MTH_Joy') ||
            key.includes('MTH_Fun') ||
            key === 'happy' ||
            key === 'encouraging'
          )) {
            effectiveWeight = Math.min(effectiveWeight, 0.12);
          }

          // Smooth interpolation for emotions, snap for blinks/visemes
          const isInstant =
            key.startsWith('blink') ||
            key.startsWith('vowel') ||
            key.startsWith('Fcl_MTH_') ||
            key.startsWith('Fcl_EYE_');

          if (isInstant) {
            influences[idx] = effectiveWeight;
          } else {
            influences[idx] += (effectiveWeight - influences[idx]) * (delta * 10);
          }
        }
      }
    }
  }
}

