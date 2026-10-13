import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SakuraParticlesProps {
  count?: number;
}

export function SakuraParticles({ count = 35 }: SakuraParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Generate random initial positions, velocities, and tumbling axes
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 5.0, // Natural spread around character
        y: Math.random() * 4.5 + 0.2,   // Float between floor and canopy
        z: (Math.random() - 0.5) * 3.0 - 0.5,
        speedY: 0.25 + Math.random() * 0.45, // Gentle slow fall
        speedX: (Math.random() - 0.5) * 0.2,
        rotSpeedX: 0.8 + Math.random() * 1.5,
        rotSpeedY: 0.5 + Math.random() * 1.2,
        rotSpeedZ: 0.3 + Math.random() * 0.8,
        scale: 0.028 + Math.random() * 0.022,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Create a delicate petal geometry: thin oval shape
  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Draw a single sakura petal silhouette
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.6, 0.4, 0.7, 1.2, 0.2, 1.8);
    shape.bezierCurveTo(0.05, 1.6, -0.05, 1.6, -0.2, 1.8);
    shape.bezierCurveTo(-0.7, 1.2, -0.6, 0.4, 0, 0);

    const geom = new THREE.ShapeGeometry(shape, 8);
    geom.center();
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const t = state.clock.elapsedTime;

    particles.forEach((particle, i) => {
      // Gentle floating downward motion with subtle breeze drift
      particle.y -= particle.speedY * delta;
      particle.x += Math.sin(t * 1.2 + particle.phase) * 0.15 * delta + particle.speedX * delta;
      particle.z += Math.cos(t * 0.9 + particle.phase) * 0.08 * delta;

      // Reset when reaching floor level
      if (particle.y < 0.02) {
        particle.y = 4.2 + Math.random() * 0.8;
        particle.x = (Math.random() - 0.5) * 5.0;
        particle.z = (Math.random() - 0.5) * 3.0 - 0.5;
      }

      dummy.position.set(particle.x, particle.y, particle.z);

      // Realistic tumbling & fluttering in wind
      dummy.rotation.x = Math.sin(t * particle.rotSpeedX + particle.phase) * 1.2;
      dummy.rotation.y = t * particle.rotSpeedY + particle.phase;
      dummy.rotation.z = Math.cos(t * particle.rotSpeedZ + particle.phase) * 0.8;

      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[petalGeometry, undefined, count]}
      frustumCulled={false}
    >
      <meshStandardMaterial
        color="#ffccd7"
        emissive="#ffb3c6"
        emissiveIntensity={0.15}
        roughness={0.6}
        side={THREE.DoubleSide}
        transparent
        opacity={0.72}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

