import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';

export interface SenseiBackgroundProps {
  daisPosition?: [number, number, number];
  showSlimeDais?: boolean;
  slimeDaisPosition?: [number, number, number];
}

export function SenseiBackground({
  daisPosition = [0, -0.01, 0],
  showSlimeDais = false,
  slimeDaisPosition = [1.70, -0.01, 0],
}: SenseiBackgroundProps) {
  const bgSphereRef = useRef<THREE.Mesh>(null);

  // Pre-create radial shadow texture
  const shadowTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
      gradient.addColorStop(0, 'rgba(25, 12, 40, 0.75)');
      gradient.addColorStop(0.35, 'rgba(40, 20, 60, 0.4)');
      gradient.addColorStop(0.7, 'rgba(75, 45, 100, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <group>
      {/* 1. Atmospheric Skybox: Soft Lavender to Sakura Ambient Dome */}
      <mesh ref={bgSphereRef} position={[0, 1.2, 0]} scale={12}>
        <sphereGeometry args={[1, 32, 32]} />
        <shaderMaterial
          side={THREE.BackSide}
          depthWrite={false}
          uniforms={{
            colorTop: { value: new THREE.Color('#f6edf8') },    // Gentle lavender-rose cream
            colorMid: { value: new THREE.Color('#e8d6f0') },    // Soft morning lavender
            colorBottom: { value: new THREE.Color('#cbb8e2') }, // Elegant purple mist
          }}
          vertexShader={`
            varying vec3 vWorldPosition;
            void main() {
              vec4 worldPosition = modelMatrix * vec4(position, 1.0);
              vWorldPosition = worldPosition.xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 colorTop;
            uniform vec3 colorMid;
            uniform vec3 colorBottom;
            varying vec3 vWorldPosition;
            void main() {
              float h = normalize(vWorldPosition).y;
              vec3 col;
              if (h < 0.0) {
                col = mix(colorBottom, colorMid, (h + 1.0));
              } else {
                col = mix(colorMid, colorTop, h);
              }
              gl_FragColor = vec4(col, 1.0);
            }
          `}
        />
      </mesh>

      {/* 2. Hana Sanctuary Dais: Grounding Circular Platform */}
      <group position={daisPosition}>
        {/* Outer Gold Accent Rim */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.78, 0.82, 64]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={0.85}
            roughness={0.25}
            emissive="#795548"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Inner Dais Floor: Pearlescent Sakura Tatami Floor */}
        <mesh position={[0, -0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.78, 64]} />
          <meshStandardMaterial
            color="#fdfbf9"
            roughness={0.4}
            metalness={0.05}
          />
        </mesh>

        {/* Subtle Decorative Inner Ring */}
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.62, 0.635, 64]} />
          <meshBasicMaterial color="#f0d5df" transparent opacity={0.6} />
        </mesh>

        {/* Contact Shadow under Sandals */}
        {shadowTexture && (
          <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.9, 0.9]} />
            <meshBasicMaterial
              map={shadowTexture}
              transparent
              opacity={0.35}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>

      {/* 3. Slime Companion Dais (Matching Circular Platform on Right) */}
      {showSlimeDais && (
        <group position={slimeDaisPosition}>
          {/* Outer Gold Accent Rim */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.42, 0.45, 48]} />
            <meshStandardMaterial
              color="#d4af37"
              metalness={0.85}
              roughness={0.25}
              emissive="#795548"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Inner Tatami Floor */}
          <mesh position={[0, -0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.42, 48]} />
            <meshStandardMaterial
              color="#fdfbf9"
              roughness={0.4}
              metalness={0.05}
            />
          </mesh>

          {/* Contact Shadow under Slime */}
          {shadowTexture && (
            <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.55, 0.55]} />
              <meshBasicMaterial
                map={shadowTexture}
                transparent
                opacity={0.35}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
}

