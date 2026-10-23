// src/components/sensei/KandoSlime3D.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SlimeMood } from '../mascot/KandoSlime';
import { playPop } from '../../utils/soundEffects';

export interface KandoSlime3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  slimeType?: 'mr' | 'mrs';
  mood?: SlimeMood;
  scale?: number;
  interactive?: boolean;
  onPoke?: () => void;
}

export function KandoSlime3D({
  position = [1.05, 0, 0],
  rotation = [0, -0.65, 0],
  slimeType = 'mr',
  mood = 'idle',
  scale = 1,
  interactive = true,
  onPoke,
}: KandoSlime3DProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const bodyMeshRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const notesGroupRef = useRef<THREE.Group>(null);

  const [isBlinking, setIsBlinking] = useState(false);
  const [squishFactor, setSquishFactor] = useState(0);

  const isMrs = slimeType === 'mrs';

  // Spontaneous anime blinking
  useEffect(() => {
    let blinkTimer: NodeJS.Timeout;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
      blinkTimer = setTimeout(triggerBlink, 2600 + Math.random() * 2600);
    };
    blinkTimer = setTimeout(triggerBlink, 3000);
    return () => clearTimeout(blinkTimer);
  }, []);

  // Frame animation loop: jelly breathing, reactive listening tilt, squish spring physics
  useFrame((stateObj, delta) => {
    const t = stateObj.clock.elapsedTime;
    const breath = Math.sin(t * 3.2) * 0.03;

    // Decay squish spring
    if (squishFactor > 0.001) {
      setSquishFactor((prev) => Math.max(0, prev - delta * 4.2));
    }

    if (bodyMeshRef.current) {
      if (mood === 'celebrating') {
        // Joyful anime hop
        const hop = Math.abs(Math.sin(t * 7.5)) * 0.16;
        bodyMeshRef.current.position.y = 0.28 + hop;
        bodyMeshRef.current.scale.set(
          1.06 + breath + squishFactor * 0.35,
          0.82 - breath * 1.5 - squishFactor * 0.35,
          1.04 + breath + squishFactor * 0.35
        );
      } else if (mood === 'listening') {
        // Attentive tilt towards Hana-sensei on the LEFT
        bodyMeshRef.current.position.y = 0.28;
        bodyMeshRef.current.rotation.y = THREE.MathUtils.lerp(
          bodyMeshRef.current.rotation.y,
          -0.12,
          delta * 4.5
        );
        bodyMeshRef.current.rotation.z = THREE.MathUtils.lerp(
          bodyMeshRef.current.rotation.z,
          0.06,
          delta * 4.5
        );
        bodyMeshRef.current.scale.set(
          1.02 + breath + squishFactor * 0.35,
          0.84 - breath - squishFactor * 0.35,
          1.02 + breath + squishFactor * 0.35
        );
      } else if (mood === 'studying') {
        // Focused study posture
        bodyMeshRef.current.position.y = 0.28;
        bodyMeshRef.current.rotation.y = THREE.MathUtils.lerp(
          bodyMeshRef.current.rotation.y,
          0,
          delta * 3.5
        );
        bodyMeshRef.current.rotation.z = THREE.MathUtils.lerp(
          bodyMeshRef.current.rotation.z,
          0,
          delta * 3.5
        );
        bodyMeshRef.current.scale.set(
          1.0 + breath * 0.5 + squishFactor * 0.35,
          0.86 - breath * 0.5 - squishFactor * 0.35,
          1.0 + breath * 0.5 + squishFactor * 0.35
        );
      } else {
        // Gentle relaxed posture facing Hana
        bodyMeshRef.current.position.y = 0.28;
        bodyMeshRef.current.rotation.y = THREE.MathUtils.lerp(
          bodyMeshRef.current.rotation.y,
          0,
          delta * 3.0
        );
        bodyMeshRef.current.rotation.z = THREE.MathUtils.lerp(
          bodyMeshRef.current.rotation.z,
          0,
          delta * 3.0
        );
        bodyMeshRef.current.scale.set(
          1.05 + breath + squishFactor * 0.35,
          0.8 - breath * 1.2 - squishFactor * 0.35,
          1.03 + breath + squishFactor * 0.35
        );
      }
    }

    // Eye blinking scale animation
    const eyeScaleY = isBlinking ? 0.08 : 1;
    if (leftEyeRef.current) leftEyeRef.current.scale.y = eyeScaleY;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = eyeScaleY;

    // Floating musical note animation in listening mode
    if (notesGroupRef.current) {
      if (mood === 'listening') {
        notesGroupRef.current.visible = true;
        notesGroupRef.current.position.y = 0.56 + Math.sin(t * 2.5) * 0.06;
        notesGroupRef.current.rotation.z = Math.sin(t * 2) * 0.15;
      } else {
        notesGroupRef.current.visible = false;
      }
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (!interactive) return;
    playPop();
    setSquishFactor(0.42);
    onPoke?.();
  };

  // Materials
  const jellyColor = isMrs ? '#f472b6' : '#38bdf8';
  const emissiveColor = isMrs ? '#db2777' : '#0284c7';

  return (
    <group ref={rootGroupRef} position={position} rotation={rotation} scale={scale} dispose={null}>
      {/* ── Slime Body Dome (Cute Mochi Shape) ── */}
      <mesh
        ref={bodyMeshRef}
        position={[0, 0.28, 0]}
        onPointerDown={handlePointerDown}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshPhysicalMaterial
          color={jellyColor}
          emissive={emissiveColor}
          emissiveIntensity={0.25}
          roughness={0.12}
          metalness={0.04}
          transmission={0.48}
          ior={1.42}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          transparent
          opacity={0.96}
        />

        {/* ── Specular Shine Glint ── */}
        <mesh position={[-0.14, 0.16, 0.24]} rotation={[0.2, 0.3, -0.4]}>
          <planeGeometry args={[0.09, 0.04]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.2, 0.1, 0.22]}>
          <circleGeometry args={[0.02, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>

        {/* ── Rosy Blush Cheeks ── */}
        <mesh position={[-0.17, -0.06, 0.27]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={isMrs ? '#f43f5e' : '#fb7185'} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.17, -0.06, 0.27]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={isMrs ? '#f43f5e' : '#fb7185'} transparent opacity={0.7} />
        </mesh>

        {/* ── Left Anime Eye ── */}
        <group ref={leftEyeRef} position={[-0.09, 0.03, 0.31]}>
          <mesh scale={[1, 1.4, 0.4]}>
            <sphereGeometry args={[0.034, 16, 16]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          {/* Eye Sparkle Catchlight */}
          <mesh position={[-0.008, 0.014, 0.016]}>
            <circleGeometry args={[0.012, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Mrs. Slime Left Eyelashes */}
          {isMrs && (
            <mesh position={[-0.01, 0.045, 0.01]} rotation={[0, 0, 0.3]}>
              <planeGeometry args={[0.035, 0.007]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
          )}
        </group>

        {/* ── Right Anime Eye ── */}
        <group ref={rightEyeRef} position={[0.09, 0.03, 0.31]}>
          <mesh scale={[1, 1.4, 0.4]}>
            <sphereGeometry args={[0.034, 16, 16]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          {/* Eye Sparkle Catchlight */}
          <mesh position={[-0.008, 0.014, 0.016]}>
            <circleGeometry args={[0.012, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Mrs. Slime Right Eyelashes */}
          {isMrs && (
            <mesh position={[0.01, 0.045, 0.01]} rotation={[0, 0, -0.3]}>
              <planeGeometry args={[0.035, 0.007]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
          )}
        </group>

        {/* ── Cute Soft Mouth ── */}
        <mesh position={[0, -0.06, 0.315]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.024, 0.005, 8, 16, Math.PI * 0.9]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>

        {/* ── Mrs. Slime Sakura Blossom Hair Clip ── */}
        {isMrs && (
          <group position={[0.18, 0.24, 0.14]} rotation={[0.2, 0.4, -0.3]} scale={0.7}>
            {[0, 72, 144, 216, 288].map((angle, idx) => (
              <mesh
                key={idx}
                rotation={[0, 0, (angle * Math.PI) / 180]}
                position={[0, 0.04, 0]}
              >
                <circleGeometry args={[0.03, 16]} />
                <meshStandardMaterial color="#fdf2f8" emissive="#f472b6" emissiveIntensity={0.3} />
              </mesh>
            ))}
            <mesh position={[0, 0, 0.005]}>
              <circleGeometry args={[0.015, 16]} />
              <meshBasicMaterial color="#fb7185" />
            </mesh>
          </group>
        )}

        {/* ── Studying Mode: Japanese Hachimaki Headband (必勝) ── */}
        {mood === 'studying' && (
          <group position={[0, 0.12, 0]}>
            {/* White Headband Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.33, 0.024, 8, 32]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            {/* Red Hinomaru Sun */}
            <mesh position={[0, 0, 0.34]}>
              <circleGeometry args={[0.04, 24]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          </group>
        )}
      </mesh>

      {/* ── Floating Musical Note in Listening Mode ── */}
      <group ref={notesGroupRef} position={[0.15, 0.58, 0.1]} visible={false}>
        <mesh rotation={[0, 0, 0.2]}>
          <circleGeometry args={[0.045, 16]} />
          <meshBasicMaterial color={isMrs ? '#ec4899' : '#38bdf8'} />
        </mesh>
        <mesh position={[0.035, 0.06, 0]}>
          <planeGeometry args={[0.015, 0.12]} />
          <meshBasicMaterial color={isMrs ? '#ec4899' : '#38bdf8'} />
        </mesh>
      </group>
    </group>
  );
}
