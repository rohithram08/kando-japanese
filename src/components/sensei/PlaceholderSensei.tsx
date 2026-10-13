import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SenseiAnimationState } from './controllers/SenseiAnimationController';

/**
 * @deprecated REJECTED & OBSOLETE — DO NOT USE IN PRODUCTION.
 * Checkpoint 2/3/4 strictly mandates using the real GLB character (public/models/hana-sensei.glb)
 * via SenseiGLBLoader.tsx. This procedural geometry is preserved purely as historical reference.
 */
interface PlaceholderSenseiProps {
  state: SenseiAnimationState;
  reducedMotion?: boolean;
}

export function PlaceholderSensei({ state, reducedMotion = false }: PlaceholderSenseiProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const wandRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const eyesGroupRef = useRef<THREE.Group>(null);
  const sparklesGroupRef = useRef<THREE.Group>(null);

  // Colors based on character specification
  const colors = useMemo(() => ({
    kimonoBase: '#9333ea',    // Royal purple
    kimonoAccent: '#c084fc',  // Soft lavender
    obiBelt: '#e879f9',       // Pink/fuschia obi
    goldTrim: '#fbbf24',      // Golden accents / tassel
    capNavy: '#1e1b4b',       // Dark navy teacher cap
    skin: '#fde047',          // Warm stylized skin tone
    eyeColor: '#4c1d95',      // Deep purple/amber anime eyes
    hair: '#581c87',          // Deep plum/brown hair
    wandWood: '#d97706',      // Wand stick
    starCrystal: '#fde047',   // Glowing golden star tip
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const motionScale = reducedMotion ? 0.2 : 1.0;

    // 1. Root group floating bob & sway
    if (groupRef.current) {
      const hover = Math.sin(t * 2.0) * 0.06 * motionScale;
      groupRef.current.position.y = hover;

      if (state === 'celebrating' || state === 'happy') {
        const jump = Math.abs(Math.sin(t * 6.0)) * 0.12 * motionScale;
        groupRef.current.position.y = hover + jump;
        groupRef.current.rotation.z = Math.sin(t * 4.0) * 0.08 * motionScale;
      } else if (state === 'thinking') {
        groupRef.current.rotation.z = -0.05 * motionScale;
      } else {
        groupRef.current.rotation.z = Math.sin(t * 1.0) * 0.02 * motionScale;
      }
    }

    // 2. Head movements & tilts
    if (headRef.current) {
      if (state === 'thinking') {
        headRef.current.rotation.z = 0.18 * motionScale;
        headRef.current.rotation.x = -0.1 * motionScale;
      } else if (state === 'confused') {
        headRef.current.rotation.z = -0.2 * motionScale;
      } else if (state === 'talking' || state === 'speaking') {
        headRef.current.rotation.x = Math.sin(t * 10) * 0.04 * motionScale;
        headRef.current.rotation.y = Math.sin(t * 5) * 0.05 * motionScale;
      } else if (state === 'pointing' || state === 'teaching') {
        headRef.current.rotation.y = -0.2 * motionScale;
      } else {
        headRef.current.rotation.y = Math.sin(t * 0.8) * 0.05 * motionScale;
        headRef.current.rotation.x = Math.sin(t * 1.5) * 0.02 * motionScale;
        headRef.current.rotation.z = 0;
      }
    }

    // 3. Mouth animation (Lip Sync rhythm)
    if (mouthRef.current) {
      if (state === 'talking' || state === 'speaking') {
        const mouthOpen = (Math.sin(t * 16) + 1) * 0.5;
        mouthRef.current.scale.y = 0.3 + mouthOpen * 1.2;
        mouthRef.current.scale.x = 1.0 + (1 - mouthOpen) * 0.4;
      } else if (state === 'happy' || state === 'celebrating') {
        mouthRef.current.scale.set(1.4, 0.8, 1);
      } else if (state === 'error') {
        mouthRef.current.scale.set(0.8, 0.3, 1);
      } else {
        mouthRef.current.scale.set(1, 0.4, 1);
      }
    }

    // 4. Eyes blinking
    if (eyesGroupRef.current) {
      const isBlink = Math.sin(t * 2.2) > 0.96;
      eyesGroupRef.current.scale.y = isBlink ? 0.1 : 1.0;
    }

    // 5. Right Arm & Magical Wand Poses
    if (rightArmRef.current) {
      if (state === 'pointing' || state === 'teaching') {
        // Point wand forward towards target
        rightArmRef.current.rotation.x = -1.2 * motionScale;
        rightArmRef.current.rotation.z = -0.4 * motionScale;
      } else if (state === 'waving') {
        // Wave wand in greeting
        rightArmRef.current.rotation.x = -0.3 * motionScale;
        rightArmRef.current.rotation.z = (-1.2 + Math.sin(t * 8) * 0.4) * motionScale;
      } else if (state === 'celebrating') {
        // Raise wand triumphantly
        rightArmRef.current.rotation.x = -0.5 * motionScale;
        rightArmRef.current.rotation.z = -1.3 * motionScale;
      } else if (state === 'thinking') {
        // Touch wand near chin
        rightArmRef.current.rotation.x = -1.1 * motionScale;
        rightArmRef.current.rotation.z = 0.5 * motionScale;
      } else {
        // Relaxed holding wand at side
        rightArmRef.current.rotation.x = -0.2 * motionScale;
        rightArmRef.current.rotation.z = -0.3 * motionScale;
      }
    }

    // 6. Sparkle rotation
    if (sparklesGroupRef.current) {
      sparklesGroupRef.current.rotation.y = t * 1.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* ─── Kimono Torso / Body ─── */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.42, 0.85, 32]} />
        <meshStandardMaterial color={colors.kimonoBase} roughness={0.4} />
      </mesh>

      {/* Kimono Obi Belt */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.32, 0.35, 0.18, 32]} />
        <meshStandardMaterial color={colors.obiBelt} roughness={0.3} />
      </mesh>

      {/* Gold Obi Cord */}
      <mesh position={[0, 0.05, 0.28]}>
        <torusGeometry args={[0.06, 0.02, 16, 32]} />
        <meshStandardMaterial color={colors.goldTrim} metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Kimono Collar V-Neck */}
      <mesh position={[0, 0.35, 0.15]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.22, 0.12, 0.05]} />
        <meshStandardMaterial color={colors.kimonoAccent} />
      </mesh>

      {/* ─── Head & Face Group ─── */}
      <group ref={headRef} position={[0, 0.65, 0]}>
        {/* Head Sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial color={colors.skin} roughness={0.6} />
        </mesh>

        {/* Anime Hair (Back & Bangs) */}
        <mesh position={[0, 0.08, -0.08]}>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshStandardMaterial color={colors.hair} roughness={0.5} />
        </mesh>

        {/* Hair Ponytail */}
        <mesh position={[0, 0.1, -0.32]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.14, 0.4, 16]} />
          <meshStandardMaterial color={colors.hair} />
        </mesh>

        {/* Hair Ribbon */}
        <mesh position={[0, 0.22, -0.26]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color={colors.obiBelt} />
        </mesh>

        {/* Eyes Group (Blinkable) */}
        <group ref={eyesGroupRef} position={[0, 0.02, 0.28]}>
          {/* Left Eye */}
          <mesh position={[-0.1, 0, 0]}>
            <capsuleGeometry args={[0.035, 0.04, 8, 16]} />
            <meshStandardMaterial color={colors.eyeColor} />
          </mesh>
          {/* Left Eye Sparkle */}
          <mesh position={[-0.11, 0.02, 0.03]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Right Eye */}
          <mesh position={[0.1, 0, 0]}>
            <capsuleGeometry args={[0.035, 0.04, 8, 16]} />
            <meshStandardMaterial color={colors.eyeColor} />
          </mesh>
          {/* Right Eye Sparkle */}
          <mesh position={[0.09, 0.02, 0.03]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Cute Cheeks Blush */}
        <mesh position={[-0.16, -0.06, 0.24]} rotation={[0, -0.3, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#f472b6" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.16, -0.06, 0.24]} rotation={[0, 0.3, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#f472b6" transparent opacity={0.6} />
        </mesh>

        {/* Animated Mouth */}
        <mesh ref={mouthRef} position={[0, -0.12, 0.29]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#e11d48" roughness={0.3} />
        </mesh>

        {/* ─── Scholar / Graduation Cap ─── */}
        <group position={[0, 0.34, 0]} rotation={[0.08, 0, 0]}>
          {/* Cap Skull Fitting */}
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.22, 0.24, 0.08, 24]} />
            <meshStandardMaterial color={colors.capNavy} roughness={0.3} />
          </mesh>
          {/* Square Board Top */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.65, 0.65, 0.03]} />
            <meshStandardMaterial color={colors.capNavy} roughness={0.2} />
          </mesh>
          {/* Golden Center Button */}
          <mesh position={[0, 0.045, 0]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshStandardMaterial color={colors.goldTrim} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Golden Hanging Tassel */}
          <mesh position={[0.22, -0.08, 0.22]} rotation={[0.2, 0, 0.2]}>
            <cylinderGeometry args={[0.015, 0.03, 0.24, 8]} />
            <meshStandardMaterial color={colors.goldTrim} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ─── Left Sleeve & Hand ─── */}
      <group position={[-0.32, 0.22, 0]} rotation={[0, 0, 0.3]}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.14, 0.32, 0.22]} />
          <meshStandardMaterial color={colors.kimonoAccent} />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color={colors.skin} />
        </mesh>
      </group>

      {/* ─── Right Arm with Magical Teaching Wand ─── */}
      <group ref={rightArmRef} position={[0.32, 0.22, 0]}>
        {/* Right Sleeve */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.14, 0.32, 0.22]} />
          <meshStandardMaterial color={colors.kimonoAccent} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color={colors.skin} />
        </mesh>

        {/* Magical Wand */}
        <group ref={wandRef} position={[0, -0.32, 0.08]} rotation={[-0.6, 0, 0]}>
          {/* Wand Shaft */}
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.015, 0.02, 0.5, 12]} />
            <meshStandardMaterial color={colors.wandWood} roughness={0.3} />
          </mesh>
          {/* Golden Star Tip */}
          <mesh position={[0, 0.52, 0]} rotation={[0, 0, Math.PI / 4]}>
            <octahedronGeometry args={[0.08, 0]} />
            <meshStandardMaterial
              color={colors.starCrystal}
              emissive={colors.starCrystal}
              emissiveIntensity={0.8}
              roughness={0.1}
            />
          </mesh>
          {/* Particle Sparkles */}
          <group ref={sparklesGroupRef} position={[0, 0.52, 0]}>
            <mesh position={[0.1, 0.05, 0]}>
              <octahedronGeometry args={[0.02, 0]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-0.08, -0.04, 0.06]}>
              <octahedronGeometry args={[0.018, 0]} />
              <meshBasicMaterial color="#fef08a" />
            </mesh>
          </group>
        </group>
      </group>

      {/* Developer Fallback Badge */}
      <Html position={[0, -0.75, 0]} center distanceFactor={4}>
        <div className="text-[9px] font-mono leading-tight text-center px-2 py-0.5 rounded-full bg-background/90 border border-primary/30 text-primary whitespace-nowrap shadow-sm pointer-events-none select-none">
          🌸 VRM Drop-in Ready
        </div>
      </Html>
    </group>
  );
}
