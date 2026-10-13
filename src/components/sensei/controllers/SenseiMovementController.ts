import * as THREE from 'three';

export interface MovementOptions {
  enableBreathing?: boolean;
  enableHeadSway?: boolean;
  enableFloatingBob?: boolean;
  reducedMotion?: boolean;
}

export class SenseiMovementController {
  private target: THREE.Object3D | null = null;
  private time = 0;
  private reducedMotion = false;

  constructor(target?: THREE.Object3D | any, options?: MovementOptions) {
    if (target && target.isObject3D) this.setTarget(target);
    if (options?.reducedMotion !== undefined) {
      this.reducedMotion = options.reducedMotion;
    } else if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  public setTarget(target: THREE.Object3D | null) {
    this.target = target;
  }

  // Backward compatibility alias
  public setVRM(vrm: any) {
    if (vrm?.scene) {
      this.target = vrm.scene;
    } else if (vrm?.isObject3D) {
      this.target = vrm;
    }
  }

  public setReducedMotion(reduced: boolean) {
    this.reducedMotion = reduced;
  }

  /**
   * Update subtle floating hover physics and micro-rotations
   */
  public update(delta: number, state?: string): { offsetY: number; rotationZ: number } {
    this.time += delta;
    const motionScale = this.reducedMotion ? 0.2 : 1.0;

    // Gentle hover bobbing
    const offsetY = Math.sin(this.time * 2.0) * 0.03 * motionScale;
    const rotationZ = Math.sin(this.time * 1.0) * 0.015 * motionScale;

    // If target has a head bone and animations aren't actively driving it
    if (this.target && state === 'idle') {
      const head = this.target.getObjectByName('J_Bip_C_Head');
      if (head) {
        head.rotation.y = Math.sin(this.time * 0.6) * 0.03 * motionScale;
        head.rotation.x = Math.sin(this.time * 1.2) * 0.015 * motionScale;
      }
    }

    return { offsetY, rotationZ };
  }
}

