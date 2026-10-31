import { describe, it, expect, beforeEach } from 'vitest';
import { SenseiAnimationController, SenseiAnimationState } from '../controllers/SenseiAnimationController';
import { SenseiExpressionController } from '../controllers/SenseiExpressionController';
import { SenseiLipSyncController, JapaneseVowel } from '../controllers/SenseiLipSyncController';
import { SenseiMovementController } from '../controllers/SenseiMovementController';
import { useSenseiStore } from '../../../store/senseiStore';

describe('Sensei Character Controllers & State Machine', () => {
  describe('SenseiAnimationController', () => {
    it('initializes in idle state by default', () => {
      const controller = new SenseiAnimationController();
      expect(controller.getState()).toBe('idle');
    });

    it('transitions smoothly through all required animation states', () => {
      const controller = new SenseiAnimationController();
      const states: SenseiAnimationState[] = [
        'idle',
        'talking',
        'speaking',
        'thinking',
        'happy',
        'celebrating',
        'encouraging',
        'confused',
        'error',
        'waving',
        'pointing',
        'teaching',
      ];

      for (const st of states) {
        controller.setState(st);
        expect(controller.getState()).toBe(st);
        const offsets = controller.update(0.016);
        expect(offsets).toHaveProperty('offsetY');
        expect(offsets).toHaveProperty('rotationZ');
      }
    });
  });

  describe('SenseiExpressionController', () => {
    it('manages emotions and resets correctly', () => {
      const controller = new SenseiExpressionController();
      expect(() => {
        controller.setEmotion('happy');
        controller.setEmotion('thinking');
        controller.setEmotion('error');
        controller.setEmotion('celebrating');
        controller.resetExpressions();
      }).not.toThrow();
    });

    it('updates blinking timer on frame ticks', () => {
      const controller = new SenseiExpressionController();
      expect(() => {
        controller.update(0.016);
        controller.update(3.0); // Trigger blink threshold
      }).not.toThrow();
    });
  });

  describe('SenseiLipSyncController', () => {
    it('handles Japanese vowels (A, I, U, E, O)', () => {
      const controller = new SenseiLipSyncController();
      const vowels: JapaneseVowel[] = ['A', 'I', 'U', 'E', 'O', null];

      for (const v of vowels) {
        expect(() => controller.setVowel(v, 0.8)).not.toThrow();
      }
    });

    it('manages speech active state and mouth reset', () => {
      const controller = new SenseiLipSyncController();
      controller.setSpeaking(true);
      controller.update(0.016);
      controller.setSpeaking(false);
      expect(() => controller.resetMouth()).not.toThrow();
    });
  });

  describe('SenseiMovementController', () => {
    it('calculates floating hover and respects reduced motion', () => {
      const normalController = new SenseiMovementController(undefined, { reducedMotion: false });
      const normalOffsets = normalController.update(1.0);

      const reducedController = new SenseiMovementController(undefined, { reducedMotion: true });
      const reducedOffsets = reducedController.update(1.0);

      expect(Math.abs(reducedOffsets.offsetY)).toBeLessThanOrEqual(Math.abs(normalOffsets.offsetY) + 0.001);
    });
  });

  describe('Sensei Zustand Store & Companion Modes', () => {
    beforeEach(() => {
      useSenseiStore.setState({
        isOpen: false,
        companionMode: 'minimized',
        animationState: 'idle',
        speechState: 'idle',
        position: { x: 0, y: 0 },
        targetId: null,
        targetMessage: null,
      });
    });

    it('toggles open/chat mode and waves upon opening', () => {
      const store = useSenseiStore.getState();
      expect(store.isOpen).toBe(false);
      expect(store.companionMode).toBe('minimized');

      store.toggleOpen();
      const updated = useSenseiStore.getState();
      expect(updated.isOpen).toBe(true);
      expect(updated.companionMode).toBe('chat');
      expect(updated.animationState).toBe('waving');
    });

    it('persists and updates movable position', () => {
      const store = useSenseiStore.getState();
      store.setPosition({ x: -120, y: -80 });
      expect(useSenseiStore.getState().position).toEqual({ x: -120, y: -80 });
    });

    it('supports guideTo and clearTarget mechanisms', () => {
      const store = useSenseiStore.getState();
      store.guideTo('srs-review-card', 'Review your vocabulary now!');
      
      let state = useSenseiStore.getState();
      expect(state.targetId).toBe('srs-review-card');
      expect(state.targetMessage).toBe('Review your vocabulary now!');
      expect(state.companionMode).toBe('teaching');
      expect(state.animationState).toBe('pointing');

      store.clearTarget();
      state = useSenseiStore.getState();
      expect(state.targetId).toBeNull();
      expect(state.targetMessage).toBeNull();
      expect(state.animationState).toBe('idle');
    });

    it('triggers celebration animation and speech mode', () => {
      const store = useSenseiStore.getState();
      store.triggerCelebration('Lesson 1 Completed');
      const state = useSenseiStore.getState();
      expect(state.companionMode).toBe('celebration');
      expect(state.animationState).toBe('celebrating');
    });
  });
});
