// Phase 6: GLB Animation Architecture
// 14 discrete skeletal animation clips baked into public/models/hana-sensei.glb

export type SenseiAnimationState =
  | 'idle'
  | 'greeting'
  | 'waving'
  | 'talking'
  | 'thinking'
  | 'happy'
  | 'encouraging'
  | 'confused'
  | 'celebrating'
  | 'teaching'
  | 'pointing'
  | 'listening'
  | 'error'
  | 'sleeping'
  // Legacy aliases
  | 'speaking';

/**
 * Normalization function to map any UI or legacy aliases to the 14 canonical GLB tracks:
 * idle, greeting, waving, talking, thinking, happy, encouraging, confused,
 * celebrating, teaching, pointing, listening, error, sleeping.
 */
export function getCanonicalAnimationName(state: SenseiAnimationState | string): string {
  switch (state) {
    case 'speaking':
      return 'talking';
    case 'happy':
      return 'happy';
    case 'waving':
      return 'waving';
    case 'greeting':
      return 'greeting';
    default:
      return state;
  }
}

export class SenseiAnimationController {
  private state: SenseiAnimationState = 'idle';
  private time = 0;

  constructor(initialState: SenseiAnimationState = 'idle') {
    this.state = initialState;
  }

  public getState(): SenseiAnimationState {
    return this.state;
  }

  public setState(state: SenseiAnimationState): void {
    this.state = state;
  }

  public update(delta: number): { offsetY: number; rotationZ: number } {
    this.time += delta;

    // Subtle ambient bob/sway for UI layering
    const offsetY = Math.sin(this.time * 2.0) * 0.02;
    const rotationZ = Math.sin(this.time * 1.2) * 0.01;

    return { offsetY, rotationZ };
  }
}

