// src/components/sensei/KandoSlime3D.tsx
import React, { useRef, useState, useEffect, useMemo } from 'react';
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

  // ── Authentic Teardrop / Onion-Dome Slime 3D Geometry ──
  // Revolved cross-section creating the iconic anime slime silhouette:
  // Flat squishy base, plump mochi belly, and gentle upward-tapering droplet crown.
  const slimeGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    // 1. Base bottom center to outer base rim
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.18, 0.005));
    points.push(new THREE.Vector2(0.32, 0.025));
    points.push(new THREE.Vector2(0.40, 0.065));
    // 2. Chubby lower belly
    points.push(new THREE.Vector2(0.44, 0.13));
    points.push(new THREE.Vector2(0.43, 0.20));
    // 3. Inward curve / waist
    points.push(new THREE.Vector2(0.38, 0.28));
    points.push(new THREE.Vector2(0.31, 0.35));
    // 4. Upper dome tapering smoothly into perky teardrop tip
    points.push(new THREE.Vector2(0.22, 0.42));
    points.push(new THREE.Vector2(0.12, 0.48));
    points.push(new THREE.Vector2(0.045, 0.52));
    points.push(new THREE.Vector2(0.005, 0.545));
    points.push(new THREE.Vector2(0, 0.55));

    const geo = new THREE.LatheGeometry(points, 48);
    geo.computeVertexNormals();
    return geo;
  }, []);

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
    const breath = Math.sin(t * 3.2) * 0.025;

    // Decay squish spring
    if (squishFactor > 0.001) {
      setSquishFactor((prev) => Math.max(0, prev - delta * 4.2));
    }

    if (bodyMeshRef.current) {
      if (mood === 'celebrating') {
        // Joyful anime hop
        const hop = Math.abs(Math.sin(t * 7.5)) * 0.14;
        bodyMeshRef.current.position.y = hop;
        bodyMeshRef.current.scale.set(
          1.04 + breath + squishFactor * 0.35,
          0.92 - breath * 1.5 - squishFactor * 0.35,
          1.04 + breath + squishFactor * 0.35
        );
      } else if (mood === 'listening') {
        // Attentive tilt towards Hana-sensei on the LEFT
        bodyMeshRef.current.position.y = 0;
        bodyMeshRef.current.rotation.y = THREE.MathUtils.lerp(
          bodyMeshRef.current.rotation.y,
          -0.12,
          delta * 4.5
        );
        bodyMeshRef.current.rotation.z = THREE.MathUtils.lerp(
          bodyMeshRef.current.rotation.z,
          0.05,
          delta * 4.5
        );
        bodyMeshRef.current.scale.set(
          1.02 + breath + squishFactor * 0.35,
          0.96 - breath - squishFactor * 0.35,
          1.02 + breath + squishFactor * 0.35
        );
      } else if (mood === 'studying') {
        // Focused study posture
        bodyMeshRef.current.position.y = 0;
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
          0.97 - breath * 0.5 - squishFactor * 0.35,
          1.0 + breath * 0.5 + squishFactor * 0.35
        );
      } else {
        // Gentle relaxed posture facing Hana
        bodyMeshRef.current.position.y = 0;
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
          1.03 + breath + squishFactor * 0.35,
          0.96 - breath * 1.2 - squishFactor * 0.35,
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
        notesGroupRef.current.position.y = 0.58 + Math.sin(t * 2.5) * 0.06;
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
      {/* ── Slime Body Dome (Authentic Teardrop Mochi Silhouette) ── */}
      <mesh
        ref={bodyMeshRef}
        geometry={slimeGeometry}
        position={[0, 0, 0]}
        onPointerDown={handlePointerDown}
        castShadow
        receiveShadow
      >
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
        <mesh position={[-0.14, 0.33, 0.28]} rotation={[0.2, 0.3, -0.4]}>
          <planeGeometry args={[0.09, 0.04]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.20, 0.26, 0.26]}>
          <circleGeometry args={[0.02, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>

        {/* ── Rosy Blush Cheeks ── */}
        <mesh position={[-0.18, 0.15, 0.38]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={isMrs ? '#f43f5e' : '#fb7185'} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.18, 0.15, 0.38]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={isMrs ? '#f43f5e' : '#fb7185'} transparent opacity={0.7} />
        </mesh>

        {/* ── Left Anime Eye ── */}
        <group ref={leftEyeRef} position={[-0.10, 0.21, 0.40]}>
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
        <group ref={rightEyeRef} position={[0.10, 0.21, 0.40]}>
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
        <mesh position={[0, 0.15, 0.415]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.024, 0.005, 8, 16, Math.PI * 0.9]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>

        {/* ── Mrs. Slime Sakura Blossom Hair Clip ── */}
        {isMrs && (
          <group position={[0.14, 0.42, 0.18]} rotation={[0.2, 0.4, -0.3]} scale={0.7}>
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
          <group position={[0, 0.28, 0]}>
            {/* White Headband Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.38, 0.024, 8, 32]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            {/* Red Hinomaru Sun */}
            <mesh position={[0, 0, 0.39]}>
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
export default KandoSlime3D;

