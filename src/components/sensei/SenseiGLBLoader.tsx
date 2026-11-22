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
  position?: [number, number, number];
  onInteract?: () => void;
}

export function SenseiGLBCharacter({
  state,
  targetDirection = null,
  position = [0, 0, 0],
  onInteract,
}: SenseiGLBCharacterProps) {
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

  // Initialize scene into controllers, enable Unity-grade shadows, and cache critical bones
  useEffect(() => {
    if (scene) {
      expressionCtrl.setScene(scene);

      // Unity-grade PBR shadow casting & material response
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat.roughness !== undefined) {
              mat.roughness = Math.min(mat.roughness, 0.65);
            }
            mat.needsUpdate = true;
          }
        }
      });

      spineBoneRef.current =
        scene.getObjectByName('J_Bip_C_Spine') ||
        scene.getObjectByName('J_Bip_C_UpperChest') ||
        null;
      headBoneRef.current = scene.getObjectByName('J_Bip_C_Head') || null;
      wandSocketRef.current =
        scene.getObjectByName('Socket_Wand_R') ||
        scene.getObjectByName('J_Bip_R_Hand') ||
        null;

      if (import.meta.env.DEV) {
        console.log(
          `[HanaSensei] GLB scene loaded: ${scene.children.length} root objects, ${animations.length} animation clips.`
        );
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

  // Duolingo-grade cartoon squash & stretch bounce spring physics
  const squashY = useRef(1);
  const squashVelY = useRef(0);
  const squashX = useRef(1);
  const squashVelX = useRef(0);
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (prevStateRef.current !== state && state !== 'idle') {
      squashVelY.current = -0.52;
      squashVelX.current = 0.26;
    }
    prevStateRef.current = state;
  }, [state]);

  // Frame update loop: lip-sync, expressions, procedural micro-motions, squash/stretch and target turning
  useFrame((stateObj, delta) => {
    lipSyncCtrl.update(delta);
    expressionCtrl.update(delta);

    // 1. Dynamic target-based turning
    let targetRotationY = 0;
    if (targetDirection === 'left') targetRotationY = -0.65; // ~37 deg leftwards
    else if (targetDirection === 'right') targetRotationY = 0.65; // ~37 deg rightwards towards Slime!

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetRotationY,
        delta * 3.5
      );
    }

    // 2. Duolingo Cartoon Squash & Stretch Harmonic Spring
    const springK = 65;
    const springD = 7.5;
    const forceY = -springK * (squashY.current - 1) - springD * squashVelY.current;
    const forceX = -springK * (squashX.current - 1) - springD * squashVelX.current;
    squashVelY.current += forceY * delta;
    squashVelX.current += forceX * delta;
    squashY.current += squashVelY.current * delta;
    squashX.current += squashVelX.current * delta;

    if (group.current) {
      group.current.scale.set(squashX.current, squashY.current, squashX.current);
    }

    // 3. Unity-Grade Procedural Life & Breathing Micro-Motions
    const t = stateObj.clock.elapsedTime;
    const isIdle = state === 'idle' || !state;

    if (spineBoneRef.current) {
      // Natural organic breathing cycle
      const breathIntensity = isIdle ? 0.016 : 0.008;
      spineBoneRef.current.rotation.x = Math.sin(t * 1.6) * breathIntensity;
    }

    if (headBoneRef.current) {
      // Natural subtle head saccades and target focus
      const targetHeadY =
        targetDirection === 'right' ? 0.18 : targetDirection === 'left' ? -0.18 : 0;
      const microSaccade = Math.sin(t * 0.4) * 0.014;
      headBoneRef.current.rotation.y = targetHeadY + microSaccade;
      headBoneRef.current.rotation.z = Math.cos(t * 0.5) * 0.008;
    }

    if (wandSocketRef.current) {
      // Subtle magical wand float & sparkle sway
      wandSocketRef.current.rotation.z = Math.sin(t * 1.3) * 0.018;
    }
  });

  // Smooth animation transitions across all 14 GLB tracks
  useEffect(() => {
    if (!actions) return;

    const clipName = getCanonicalAnimationName(state);
    const action = actions[clipName] || actions['idle'];

    if (action) {
      action.reset().fadeIn(0.22).play();

      return () => {
        action.fadeOut(0.22);
      };
    } else if (import.meta.env.DEV) {
      console.warn(
        `[HanaSensei] Animation clip "${clipName}" not found in GLB. Available:`,
        Object.keys(actions)
      );
    }
  }, [state, actions]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    // Bouncy cartoon reaction on click
    squashVelY.current = -0.58;
    squashVelX.current = 0.28;
    onInteract?.();
  };

  return (
    <group
      ref={group}
      position={position}
      onPointerDown={handlePointerDown}
      dispose={null}
    >
      <primitive object={scene} />
    </group>
  );
}

// Preload the model
useGLTF.preload(GLB_MODEL_PATH);
