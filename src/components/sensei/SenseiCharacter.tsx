import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Environment, Html } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import { SenseiGLBCharacter } from './SenseiGLBLoader';
import { SenseiBackground } from './SenseiBackground';
import { SakuraParticles } from './SakuraParticles';
import { SenseiAnimationState } from './controllers/SenseiAnimationController';

export interface SenseiCharacterProps {
  speechState?: SenseiAnimationState;
  state?: SenseiAnimationState;
  reducedMotion?: boolean;
  mode?: 'compact' | 'full' | 'portrait';
  targetDirection?: 'left' | 'right' | 'forward' | null;
}

// ─── Loading Indicator ────────────────────────────────────────────────────────
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <div className="text-xs font-semibold text-primary/80 tracking-widest uppercase">Summoning</div>
      </div>
    </Html>
  );
}

// ─── Fallback 2D Avatar (Rule 38 Asset Blocker) ─────────────────────────────
function AvatarFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center w-[280px] sm:w-[320px] p-6 bg-background/80 backdrop-blur-md rounded-3xl border border-primary/20 shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        
        <div className="relative w-48 h-48 mb-4 rounded-full border-4 border-primary/30 overflow-hidden shadow-inner">
          <img 
            src="/images/sensei-avatar-fallback.jpg" 
            alt="Hana-sensei 2D Fallback"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="text-center z-10 relative">
          <h3 className="text-lg font-bold text-primary font-japanese tracking-wider mb-1">花先生</h3>
          <p className="text-xs text-muted-foreground/80 mb-3 px-2">
            3D GLB model pending final art pipeline.
          </p>
          <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20 inline-block">
            <span className="text-xs text-primary font-medium">Avatar Mode Active</span>
          </div>
        </div>
      </div>
    </Html>
  );
}

// ─── Main Sensei Character Export ───────────────────────────────────────────
export default function SenseiCharacter({
  speechState,
  state: propState,
  reducedMotion = false,
  mode = 'compact',
  targetDirection = null,
}: SenseiCharacterProps) {
  
  // Normalize active animation state (backward compatibility with speechState)
  const activeState: SenseiAnimationState = propState || speechState || 'idle';

  // Responsive mobile screen detection
  const [isMobileScreen, setIsMobileScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobileScreen(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Camera framing:
  // - Full stage: captures Hana from cap to sandals at ~85% vertical stage fill
  // - Portrait: waist to cap focus for intimate dialogue
  // - Compact: upper body for minimized floating widget
  const isPortrait = mode === 'portrait';
  const isFull = mode === 'full';

  let targetPos: [number, number, number] = [0, 0.74, 0];
  let cameraPos: [number, number, number] = isMobileScreen ? [0, 0.76, 2.52] : [0, 0.76, 2.28];
  let cameraFov = isMobileScreen ? 44 : 41;

  if (isPortrait) {
    targetPos = [0, 1.10, 0];
    cameraPos = isMobileScreen ? [0, 1.12, 1.5] : [0, 1.12, 1.35];
    cameraFov = 34;
  } else if (!isFull) {
    targetPos = [0, 1.15, 0];
    cameraPos = [0, 1.18, 1.55];
    cameraFov = 32;
  }

  return (
    <div className="w-full h-full relative select-none bg-transparent rounded-2xl overflow-hidden">
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: cameraPos, fov: cameraFov }}
      >
        <PerspectiveCamera makeDefault position={cameraPos} fov={cameraFov} />
        
        {/* Environment & Lighting */}
        <SenseiBackground />
        {!reducedMotion && <SakuraParticles count={isFull ? 45 : 25} />}
        
        <ambientLight intensity={1.4} color="#f5f0fa" />
        {/* Key light */}
        <directionalLight position={[1.8, 2.8, 3.2]} intensity={2.2} color="#ffffff" castShadow />
        {/* Fill light (soft sakura pink) */}
        <directionalLight position={[-2.4, 1.4, 1.8]} intensity={1.4} color="#fdf2f4" />
        {/* Rim light (gold) */}
        <directionalLight position={[0, 2.2, -3.5]} intensity={2.6} color="#e5a93c" />
        {/* Dedicated Wand Specular & Emissive Light */}
        <pointLight position={[0.45, 0.78, 0.65]} intensity={2.8} distance={2.5} color="#ffe082" />
        
        <Environment preset="city" />

        <ErrorBoundary FallbackComponent={AvatarFallback}>
          <Suspense fallback={<Loader />}>
            <SenseiGLBCharacter state={activeState} targetDirection={targetDirection} />
          </Suspense>
        </ErrorBoundary>

        {/* OrbitControls: Allows interactive viewing on full stage, restricted on compact */}
        <OrbitControls
          target={targetPos}
          enablePan={false}
          enableZoom={isFull || isPortrait}
          minDistance={1.2}
          maxDistance={3.8}
          minPolarAngle={isFull ? Math.PI / 3 : Math.PI / 2.3}
          maxPolarAngle={isFull ? Math.PI / 1.7 : Math.PI / 1.8}
          minAzimuthAngle={isFull ? -Math.PI : -Math.PI / 8}
          maxAzimuthAngle={isFull ? Math.PI : Math.PI / 8}
        />
      </Canvas>
    </div>
  );
}


