import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import {
  SenseiAnimationState,
  getCanonicalAnimationName
} from './controllers/SenseiAnimationController';

import { SenseiExpressionController, SenseiEmotion } from './controllers/SenseiExpressionController';
import { SenseiLipSyncController } from './controllers/SenseiLipSyncController';
import { useSenseiStore } from '../../store/senseiStore';

export const GLB_MODEL_PATH = '/models/hana-sensei.glb';

interface SenseiGLBCharacterProps {
  state: SenseiAnimationState;
  targetDirection?: 'left' | 'right' | 'forward' | null;
}

export function SenseiGLBCharacter({ state, targetDirection = null }: SenseiGLBCharacterProps) {
  const group = useRef<THREE.Group>(null);
  const spineBoneRef = useRef<THREE.Object3D | null>(null);
  const headBoneRef = useRef<THREE.Object3D | null>(null);
  const wandSocketRef = useRef<THREE.Object3D | null>(null);

  // Controller instances
  const expressionCtrl = useMemo(() => new SenseiExpressionController(), []);
  const lipSyncCtrl = useMemo(() => new SenseiLipSyncController(expressionCtrl), [expressionCtrl]);

  // Global store states for driving expressions
  const emotion = useSenseiStore(s => s.emotion) as SenseiEmotion;
  const speechState = useSenseiStore(s => s.speechState);
  const isSpeaking = speechState === 'speaking' || state === 'talking' || state === 'speaking';

  const { scene, animations } = useGLTF(GLB_MODEL_PATH);
  const { actions } = useAnimations(animations, group);

  // Initialize scene into controllers and cache critical bones
  useEffect(() => {
    if (scene) {
      expressionCtrl.setScene(scene);

      spineBoneRef.current = scene.getObjectByName('J_Bip_C_Spine') || scene.getObjectByName('J_Bip_C_UpperChest') || null;
      headBoneRef.current = scene.getObjectByName('J_Bip_C_Head') || null;
      wandSocketRef.current = scene.getObjectByName('Socket_Wand_R') || scene.getObjectByName('J_Bip_R_Hand') || null;

      if (import.meta.env.DEV) {
        console.log(`[HanaSensei] GLB scene loaded: ${scene.children.length} root objects, ${animations.length} animation clips.`);
      }
    }
  }, [scene, animations, expressionCtrl]);

  // Sync state to controllers
  useEffect(() => {
    expressionCtrl.setEmotion(emotion || 'neutral');
  }, [emotion, expressionCtrl]);

  useEffect(() => {
    lipSyncCtrl.setSpeaking(isSpeaking);
    expressionCtrl.setSpeaking(isSpeaking);
  }, [isSpeaking, lipSyncCtrl, expressionCtrl]);

  // Frame update loop: lip-sync, expressions, procedural micro-motions, and target turning
  useFrame((stateObj, delta) => {
    lipSyncCtrl.update(delta);
    expressionCtrl.update(delta);

    // 1. Dynamic target-based turning
    let targetRotationY = 0;
    if (targetDirection === 'left') targetRotationY = 0.38;       // ~22 deg leftwards
    else if (targetDirection === 'right') targetRotationY = -0.38; // ~22 deg rightwards

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetRotationY,
        delta * 3.5
      );
    }

    // 2. Natural subtle procedural micro-motions on idle (breathing & life)
    const isIdle = state === 'idle' || !state;
    if (isIdle) {
      const t = stateObj.clock.elapsedTime;
      if (spineBoneRef.current) {
        // Natural chest expansion/contraction
        spineBoneRef.current.rotation.x = Math.sin(t * 1.5) * 0.012;
      }
      if (headBoneRef.current) {
        // Occasional gentle natural head curiosity drift
        headBoneRef.current.rotation.y = Math.sin(t * 0.35) * 0.022 + Math.sin(t * 0.8) * 0.008;
        headBoneRef.current.rotation.z = Math.cos(t * 0.4) * 0.012;
      }
      if (wandSocketRef.current) {
        // Subtle wand sparkle float
        wandSocketRef.current.rotation.z = Math.sin(t * 1.2) * 0.016;
      }
    }
  });

  // Smooth animation transitions across all 14 GLB tracks
  useEffect(() => {
    if (!actions) return;

    const clipName = getCanonicalAnimationName(state);
    const action = actions[clipName] || actions['idle'];

    if (action) {
      action.reset().fadeIn(0.25).play();

      return () => {
        action.fadeOut(0.25);
      };
    } else if (import.meta.env.DEV) {
      console.warn(`[HanaSensei] Animation clip "${clipName}" not found in GLB. Available:`, Object.keys(actions));
    }
  }, [state, actions]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model
useGLTF.preload(GLB_MODEL_PATH);


