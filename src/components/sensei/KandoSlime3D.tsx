// src/components/sensei/KandoSlime3D.tsx
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SlimeMood } from '../mascot/KandoSlime';
import { playPop } from '../../utils/soundEffects';

export type SlimeAccessory = 'none' | 'sensei_hat' | 'baseball_cap' | 'ribbon' | 'leaf' | 'auto';

export interface KandoSlime3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  slimeType?: 'mr' | 'mrs';
  mood?: SlimeMood;
  scale?: number;
  interactive?: boolean;
  accessory?: SlimeAccessory;
  onPoke?: () => void;
}

interface BurstParticle {
  id: number;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: string;
  size: number;
  life: number;
}

export function KandoSlime3D({
  position = [1.05, 0, 0],
  rotation = [0, -0.65, 0],
  slimeType = 'mr',
  mood = 'idle',
  scale = 1,
  interactive = true,
  accessory = 'auto',
  onPoke,
}: KandoSlime3DProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const bodyMeshRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const notesGroupRef = useRef<THREE.Group>(null);
  const particlesGroupRef = useRef<THREE.Group>(null);

  const [isBlinking, setIsBlinking] = useState(false);

  // Unity-grade harmonic spring physics state for squish and stretch
  const squishFactorRef = useRef(0);
  const squishVelRef = useRef(0);
  const [particles, setParticles] = useState<BurstParticle[]>([]);

  const isMrs = slimeType === 'mrs';

  // Resolved accessory: auto chooses based on persona if not specified
  const effectiveAccessory: SlimeAccessory =
    accessory === 'auto' ? (isMrs ? 'ribbon' : 'sensei_hat') : accessory;

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

  // Frame animation loop: jelly breathing, harmonic spring physics, listening tilt, particles
  useFrame((stateObj, delta) => {
    const t = stateObj.clock.elapsedTime;
    const breath = Math.sin(t * 3.2) * 0.025;

    // Harmonic jelly spring physics (Unity-style SpringDamper)
    const springStiffness = 55;
    const springDamping = 6.5;
    const springForce = -springStiffness * squishFactorRef.current;
    const dampingForce = -springDamping * squishVelRef.current;
    const acceleration = springForce + dampingForce;

    squishVelRef.current += acceleration * delta;
    squishFactorRef.current += squishVelRef.current * delta;

    // Clamp small jitter to zero
    if (Math.abs(squishFactorRef.current) < 0.001 && Math.abs(squishVelRef.current) < 0.001) {
      squishFactorRef.current = 0;
      squishVelRef.current = 0;
    }

    const currentSquish = squishFactorRef.current;

    if (bodyMeshRef.current) {
      if (mood === 'celebrating') {
        // Joyful anime hop
        const hop = Math.abs(Math.sin(t * 7.5)) * 0.16;
        bodyMeshRef.current.position.y = hop;
        bodyMeshRef.current.scale.set(
          1.05 + breath + currentSquish * 0.38,
          0.90 - breath * 1.5 - currentSquish * 0.42,
          1.05 + breath + currentSquish * 0.38
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
          1.02 + breath + currentSquish * 0.38,
          0.96 - breath - currentSquish * 0.42,
          1.02 + breath + currentSquish * 0.38
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
          1.0 + breath * 0.5 + currentSquish * 0.38,
          0.97 - breath * 0.5 - currentSquish * 0.42,
          1.0 + breath * 0.5 + currentSquish * 0.38
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
          1.03 + breath + currentSquish * 0.38,
          0.96 - breath * 1.2 - currentSquish * 0.42,
          1.03 + breath + currentSquish * 0.38
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

    // Update burst particles
    if (particles.length > 0) {
      setParticles((prev) =>
        prev
          .map((p) => {
            p.pos.addScaledVector(p.vel, delta);
            p.vel.y -= 2.0 * delta; // gentle gravity
            p.life -= delta * 1.6;
            return p;
          })
          .filter((p) => p.life > 0)
      );
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (!interactive) return;
    playPop();

    // Trigger juicy spring impulse
    squishVelRef.current = 2.8;

    // Spawn 8 colorful floating burst sparkle particles around the slime
    const newParticles: BurstParticle[] = [];
    const colors = isMrs
      ? ['#f472b6', '#fb7185', '#fed7aa', '#f43f5e', '#ffffff']
      : ['#38bdf8', '#818cf8', '#67e8f9', '#a78bfa', '#ffffff'];

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 0.6 + Math.random() * 0.8;
      newParticles.push({
        id: Math.random(),
        pos: new THREE.Vector3(0, 0.32, 0),
        vel: new THREE.Vector3(
          Math.cos(angle) * speed,
          0.8 + Math.random() * 0.7,
          Math.sin(angle) * speed
        ),
        color: colors[i % colors.length],
        size: 0.025 + Math.random() * 0.02,
        life: 1.0,
      });
    }
    setParticles(newParticles);
    onPoke?.();
  };

  // Materials - Unity Engine PBR Translucent Jelly
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
          emissiveIntensity={0.28}
          roughness={0.08}
          metalness={0.05}
          transmission={0.52}
          ior={1.44}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
          transparent
          opacity={0.96}
        />

        {/* ── Specular Shine Glint ── */}
        <mesh position={[-0.14, 0.33, 0.28]} rotation={[0.2, 0.3, -0.4]}>
          <planeGeometry args={[0.09, 0.04]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.78} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.20, 0.26, 0.26]}>
          <circleGeometry args={[0.022, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.68} side={THREE.DoubleSide} />
        </mesh>

        {/* ── Rosy Blush Cheeks ── */}
        <mesh position={[-0.18, 0.15, 0.38]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={isMrs ? '#f43f5e' : '#fb7185'} transparent opacity={0.75} />
        </mesh>
        <mesh position={[0.18, 0.15, 0.38]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={isMrs ? '#f43f5e' : '#fb7185'} transparent opacity={0.75} />
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

        {/* ── ACCESSORIES: Unity-Style Dynamic Props ── */}

        {/* 1. Academic Graduation / Sensei Cap 🎓 */}
        {effectiveAccessory === 'sensei_hat' && (
          <group position={[0, 0.52, 0]} rotation={[-0.08, 0.2, 0.05]} scale={0.92}>
            {/* Skull Cap Base */}
            <mesh position={[0, 0.02, 0]} castShadow>
              <cylinderGeometry args={[0.13, 0.15, 0.06, 24]} />
              <meshStandardMaterial color="#1e1b4b" roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Flat Mortarboard Diamond Board */}
            <mesh position={[0, 0.055, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <boxGeometry args={[0.34, 0.014, 0.34]} />
              <meshStandardMaterial color="#0f172a" roughness={0.25} metalness={0.15} />
            </mesh>
            {/* Golden Cap Button */}
            <mesh position={[0, 0.066, 0]}>
              <sphereGeometry args={[0.022, 16, 16]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Golden Hanging Tassel */}
            <group position={[0.11, 0.06, 0.11]}>
              <mesh position={[0, -0.07, 0]} rotation={[0, 0, -0.15]}>
                <cylinderGeometry args={[0.005, 0.014, 0.15, 8]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
          </group>
        )}

        {/* 2. Sporty Baseball Cap 🧢 */}
        {effectiveAccessory === 'baseball_cap' && (
          <group position={[0, 0.48, 0]} rotation={[-0.12, 0, 0]} scale={0.9}>
            {/* Cap Dome */}
            <mesh position={[0, 0.03, 0]} castShadow>
              <sphereGeometry args={[0.20, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color="#2563eb" roughness={0.4} />
            </mesh>
            {/* Front Visor Brim */}
            <mesh position={[0, 0.01, 0.16]} rotation={[0.2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.20, 0.015, 24, 1, false, -Math.PI * 0.32, Math.PI * 0.64]} />
              <meshStandardMaterial color="#1d4ed8" roughness={0.3} />
            </mesh>
            {/* Top Button */}
            <mesh position={[0, 0.20, 0]}>
              <sphereGeometry args={[0.018, 12, 12]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        )}

        {/* 3. Sakura Blossom Ribbon 🎀 */}
        {effectiveAccessory === 'ribbon' && (
          <group position={[0, 0.48, 0]} rotation={[0.1, 0, 0]} scale={0.9}>
            {/* Center Knot */}
            <mesh position={[0, 0.03, 0.14]}>
              <sphereGeometry args={[0.032, 16, 16]} />
              <meshStandardMaterial color="#db2777" roughness={0.2} emissive="#f472b6" emissiveIntensity={0.2} />
            </mesh>
            {/* Left Bow Loop */}
            <mesh position={[-0.08, 0.04, 0.13]} rotation={[0, 0.3, 0.4]}>
              <torusGeometry args={[0.055, 0.02, 8, 20]} />
              <meshStandardMaterial color="#ec4899" roughness={0.25} />
            </mesh>
            {/* Right Bow Loop */}
            <mesh position={[0.08, 0.04, 0.13]} rotation={[0, -0.3, -0.4]}>
              <torusGeometry args={[0.055, 0.02, 8, 20]} />
              <meshStandardMaterial color="#ec4899" roughness={0.25} />
            </mesh>
          </group>
        )}

        {/* 4. Tanuki Magic Leaf 🍃 */}
        {effectiveAccessory === 'leaf' && (
          <group position={[0, 0.53, 0]} rotation={[-0.2, 0.3, 0.1]} scale={0.85}>
            <mesh castShadow>
              <sphereGeometry args={[0.09, 16, 8]} scale={[1, 0.2, 1.8]} />
              <meshStandardMaterial color="#22c55e" roughness={0.3} emissive="#15803d" emissiveIntensity={0.15} />
            </mesh>
            {/* Leaf Stem */}
            <mesh position={[0, 0, -0.16]} rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
              <meshStandardMaterial color="#166534" roughness={0.4} />
            </mesh>
          </group>
        )}

        {/* ── Studying Mode: Japanese Hachimaki Headband (必勝) ── */}
        {mood === 'studying' && effectiveAccessory === 'none' && (
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

      {/* ── Burst Sparkle Particles on Poke ── */}
      {particles.map((p) => (
        <mesh key={p.id} position={p.pos}>
          <octahedronGeometry args={[p.size]} />
          <meshBasicMaterial color={p.color} transparent opacity={Math.min(1, p.life * 1.5)} />
        </mesh>
      ))}

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
