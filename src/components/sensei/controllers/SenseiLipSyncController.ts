import { SenseiExpressionController } from './SenseiExpressionController';

export type JapaneseVowel =
  | 'vowel_A' | 'vowel_I' | 'vowel_U' | 'vowel_E' | 'vowel_O'
  | 'vowel_a' | 'vowel_i' | 'vowel_u' | 'vowel_e' | 'vowel_o'
  | 'A' | 'I' | 'U' | 'E' | 'O'
  | null;

export class SenseiLipSyncController {
  private expressionController: SenseiExpressionController;
  private isSpeaking = false;
  private speechTime = 0;

  constructor(expressionController?: SenseiExpressionController) {
    this.expressionController = expressionController || new SenseiExpressionController();
  }

  public setSpeaking(speaking: boolean) {
    this.isSpeaking = speaking;
    if (!speaking) {
      this.resetMouth();
    }
  }

  public setVowel(vowel: JapaneseVowel | string, weight = 1.0) {
    this.resetMouth();
    if (!vowel) return;

    const normalized = vowel.toUpperCase().replace(/^VOWEL_?/, '');
    if (['A', 'I', 'U', 'E', 'O'].includes(normalized)) {
      this.expressionController.setViseme(`vowel_${normalized.toLowerCase()}`, weight);
    }
  }

  public resetMouth() {
    if (!this.expressionController) return;
    this.expressionController.setViseme('vowel_a', 0);
    this.expressionController.setViseme('vowel_i', 0);
    this.expressionController.setViseme('vowel_u', 0);
    this.expressionController.setViseme('vowel_e', 0);
    this.expressionController.setViseme('vowel_o', 0);
  }

  /**
   * Update rhythmic mouth movement during active speech.
   * Sine-wave cadence tuned to Japanese mora rhythm (flap-sync) driving real GLB visemes.
   */
  public update(delta: number) {
    if (!this.isSpeaking) return;

    this.speechTime += delta;

    // Anime flap-sync cadence: fast switching between A/I/O/E to simulate Japanese speech
    const cycle = (this.speechTime * 12) % 5;
    const intensity = (Math.sin(this.speechTime * 18) + 1) * 0.4 + 0.1; // Pulsing 0.1 to 0.9

    this.resetMouth();

    // Sometimes close mouth briefly between mora phrasing
    if (Math.sin(this.speechTime * 8) > 0.82) {
      return; // Rest frame
    }

    if (cycle < 1.5) {
      this.expressionController.setViseme('vowel_a', intensity);
    } else if (cycle < 2.8) {
      this.expressionController.setViseme('vowel_i', intensity * 0.8);
    } else if (cycle < 3.8) {
      this.expressionController.setViseme('vowel_o', intensity * 0.9);
    } else {
      this.expressionController.setViseme('vowel_e', intensity * 0.7);
    }
  }
}

