import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface SenseiBackgroundProps {
  // Dais props retained for backwards compatibility but rendered as classroom contact shadows
  daisPosition?: [number, number, number];
  showSlimeDais?: boolean;
  slimeDaisPosition?: [number, number, number];
}

export function ClassroomContactShadows({
  characterPos = [-1.70, 0, 0],
  slimePos = [1.70, 0, 0],
  showSlime = true,
}: {
  characterPos?: [number, number, number];
  slimePos?: [number, number, number];
  showSlime?: boolean;
}) {
  const contactShadowTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 6, 64, 64, 58);
      gradient.addColorStop(0, 'rgba(30, 20, 15, 0.65)');
      gradient.addColorStop(0.4, 'rgba(45, 30, 20, 0.35)');
      gradient.addColorStop(0.75, 'rgba(60, 45, 30, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  if (!contactShadowTexture) return null;

  return (
    <group>
      {/* Shadow directly under Hana's feet */}
      <mesh position={[characterPos[0], 0.002, characterPos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.1, 0.85]} />
        <meshBasicMaterial
          map={contactShadowTexture}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>
      {/* Shadow directly under Slime's base */}
      {showSlime && (
        <mesh position={[slimePos[0], 0.002, slimePos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.0, 0.9]} />
          <meshBasicMaterial
            map={contactShadowTexture}
            transparent
            opacity={0.55}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

export function SenseiBackground({
  daisPosition: _daisPosition = [-1.70, 0, 0],
  slimeDaisPosition: _slimeDaisPosition = [1.70, 0, 0],
}: SenseiBackgroundProps) {

  // 1. High-Resolution Japanese Classroom Blackboard (黒板 - Kokuban) Texture
  const chalkboardTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark pine-green chalkboard matte base
      ctx.fillStyle = '#1b3427';
      ctx.fillRect(0, 0, 1024, 512);

      // Subtle chalk dust haze
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
      for (let i = 0; i < 220; i++) {
        ctx.fillRect(Math.random() * 1024, Math.random() * 512, Math.random() * 160, Math.random() * 35);
      }

      // Chalk header: Classroom Title & Teacher Name
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 38px "Noto Sans JP", sans-serif';
      ctx.fillText('感動日本語教室  🌸  花先生', 512, 75);

      // Underline rule
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(220, 105);
      ctx.lineTo(804, 105);
      ctx.stroke();

      // Study topic banner
      ctx.font = 'bold 30px "Noto Sans JP", sans-serif';
      ctx.fillStyle = '#fef08a'; // Soft chalk yellow
      ctx.fillText('【今日のレッスン】 は (Topic)  vs  が (Subject)', 512, 175);

      // Chalk grammar examples
      ctx.font = '26px "Noto Sans JP", sans-serif';
      ctx.fillStyle = '#f1f5f9';
      ctx.fillText('・ 私は 学生です (Watashi wa gakusei desu)', 512, 255);
      ctx.fillText('・ 猫が 走ります (Neko ga hashirimasu)', 512, 325);

      // Encouraging motto at bottom
      ctx.font = '23px "Noto Sans JP", sans-serif';
      ctx.fillStyle = '#bae6fd'; // Soft chalk blue
      ctx.fillText('一歩ずつ、毎日楽しくマスターしよう！ がんばって！ ✨', 512, 425);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // 2. Parquet Japanese Cedar Classroom Floor Texture
  const floorTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Warm cedar plank base
      ctx.fillStyle = '#bf9467';
      ctx.fillRect(0, 0, 512, 512);

      // Horizontal plank grooves
      ctx.strokeStyle = '#8d633b';
      ctx.lineWidth = 3;
      for (let y = 0; y < 512; y += 64) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }

      // Vertical plank staggered joint lines
      ctx.lineWidth = 2;
      for (let y = 0; y < 512; y += 64) {
        const offset = (y / 64) % 2 === 0 ? 0 : 64;
        for (let x = offset; x < 512; x += 128) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 64);
          ctx.stroke();
        }
      }

      // Fine wood grain streaks
      ctx.fillStyle = 'rgba(100, 60, 20, 0.04)';
      for (let i = 0; i < 300; i++) {
        ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 80 + 20, 2);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 4);
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <group>
      {/* ── 1. Classroom Parquet Wood Floor (Extends across entire 360 room) ── */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial
          map={floorTexture || undefined}
          color="#d2a679"
          roughness={0.45}
          metalness={0.08}
        />
      </mesh>

      {/* ── 2. Classroom Back Wall (Warm Anime Cream Aesthetic) ── */}
      <mesh position={[0, 2.4, -3.5]} receiveShadow>
        <planeGeometry args={[16, 5.2]} />
        <meshStandardMaterial
          color="#f4eee4"
          roughness={0.85}
          metalness={0.02}
        />
      </mesh>

      {/* ── 3. Lower Wood Wainscoting / Baseboard Along Back Wall ── */}
      <mesh position={[0, 0.45, -3.48]}>
        <boxGeometry args={[16, 0.9, 0.04]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.4} />
      </mesh>
      {/* Wainscoting Top Molding Rail */}
      <mesh position={[0, 0.92, -3.46]}>
        <boxGeometry args={[16, 0.05, 0.06]} />
        <meshStandardMaterial color="#5c3818" roughness={0.3} />
      </mesh>

      {/* ── 4. Japanese Classroom Blackboard (黒板 - Kokuban) ── */}
      <group position={[0, 2.05, -3.44]}>
        {/* Outer Dark Teak Wood Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.7, 1.7, 0.05]} />
          <meshStandardMaterial color="#5c3818" roughness={0.35} />
        </mesh>

        {/* Inner Chalkboard Face with Teaching Kanji & Lesson Notes */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[5.5, 1.5]} />
          <meshStandardMaterial
            map={chalkboardTexture || undefined}
            color="#1b3427"
            roughness={0.65}
            metalness={0.05}
          />
        </mesh>

        {/* Bottom Chalk Ledge / Chalk Tray */}
        <mesh position={[0, -0.87, 0.06]}>
          <boxGeometry args={[5.7, 0.06, 0.12]} />
          <meshStandardMaterial color="#6d4320" roughness={0.4} />
        </mesh>

        {/* Small Chalk Pieces on Tray */}
        <mesh position={[-0.8, -0.83, 0.08]} rotation={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.08, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[-0.65, -0.83, 0.08]} rotation={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.07, 12]} />
          <meshStandardMaterial color="#fef08a" roughness={0.9} />
        </mesh>
        <mesh position={[-0.5, -0.83, 0.08]} rotation={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.06, 12]} />
          <meshStandardMaterial color="#f472b6" roughness={0.9} />
        </mesh>
        {/* Chalkboard Eraser */}
        <mesh position={[0.7, -0.82, 0.08]}>
          <boxGeometry args={[0.16, 0.04, 0.07]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
      </group>

      {/* ── 5. Left Classroom Wall with Shoji Morning Windows ── */}
      <group position={[-6.2, 2.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Wall Surface */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[14, 5.2]} />
          <meshStandardMaterial color="#eae4d6" roughness={0.8} />
        </mesh>
        {/* Wood Window Frame 1 */}
        <mesh position={[-1.8, 0.2, 0.02]}>
          <boxGeometry args={[2.4, 2.2, 0.04]} />
          <meshStandardMaterial color="#6d4320" roughness={0.4} />
        </mesh>
        <mesh position={[-1.8, 0.2, 0.04]}>
          <planeGeometry args={[2.2, 2.0]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
        </mesh>
        {/* Wood Window Frame 2 */}
        <mesh position={[1.8, 0.2, 0.02]}>
          <boxGeometry args={[2.4, 2.2, 0.04]} />
          <meshStandardMaterial color="#6d4320" roughness={0.4} />
        </mesh>
        <mesh position={[1.8, 0.2, 0.04]}>
          <planeGeometry args={[2.2, 2.0]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
        </mesh>
      </group>

      {/* ── 6. Teacher's Minimal Wooden Podium / Desk (Behind Hana-sensei) ── */}
      <group position={[-2.4, 0.42, -1.8]}>
        {/* Table Top */}
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[1.1, 0.05, 0.65]} />
          <meshStandardMaterial color="#7a4f2b" roughness={0.35} />
        </mesh>
        {/* Podium Front Panel */}
        <mesh position={[0, 0, 0.28]}>
          <boxGeometry args={[1.0, 0.8, 0.03]} />
          <meshStandardMaterial color="#633d1e" roughness={0.4} />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.45, 0, -0.24]}>
          <boxGeometry args={[0.05, 0.84, 0.05]} />
          <meshStandardMaterial color="#422813" />
        </mesh>
        <mesh position={[0.45, 0, -0.24]}>
          <boxGeometry args={[0.05, 0.84, 0.05]} />
          <meshStandardMaterial color="#422813" />
        </mesh>
        {/* Japanese Textbook & Pen on Podium */}
        <mesh position={[-0.15, 0.46, 0]} rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.24, 0.03, 0.32]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0.2, 0.45, 0.02]} rotation={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.18, 8]} />
          <meshStandardMaterial color="#e11d48" />
        </mesh>
      </group>

      {/* ── 7. Right Classroom Wall with Sliding Hallway Doors & Clock ── */}
      <group position={[6.2, 2.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[14, 5.2]} />
          <meshStandardMaterial color="#eae4d6" roughness={0.8} />
        </mesh>
        {/* Baseboard */}
        <mesh position={[0, -1.95, 0.02]}>
          <boxGeometry args={[14, 0.9, 0.04]} />
          <meshStandardMaterial color="#8b5a2b" roughness={0.4} />
        </mesh>

        {/* Sliding Classroom Wooden Door */}
        <group position={[-2.4, -0.2, 0.04]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.8, 3.4, 0.06]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.5, 0.04]}>
            <planeGeometry args={[1.4, 1.6]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.2} transparent opacity={0.7} />
          </mesh>
        </group>

        {/* Notice Board */}
        <group position={[1.4, 0.4, 0.04]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.8, 1.6, 0.05]} />
            <meshStandardMaterial color="#a07855" roughness={0.6} />
          </mesh>
          <mesh position={[-0.8, 0.3, 0.03]}>
            <planeGeometry args={[0.45, 0.55]} />
            <meshStandardMaterial color="#fef08a" />
          </mesh>
          <mesh position={[-0.2, 0.25, 0.03]}>
            <planeGeometry args={[0.5, 0.65]} />
            <meshStandardMaterial color="#bae6fd" />
          </mesh>
          <mesh position={[0.5, 0.2, 0.03]}>
            <planeGeometry args={[0.55, 0.7]} />
            <meshStandardMaterial color="#fbcfe8" />
          </mesh>
        </group>

        {/* Wall Clock */}
        <group position={[1.4, 1.8, 0.04]}>
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.04, 32]} />
            <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <circleGeometry args={[0.29, 32]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.05, 0.08, 0.03]} rotation={[0, 0, Math.PI / 3]}>
            <boxGeometry args={[0.015, 0.16, 0.005]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.07, 0.06, 0.03]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.012, 0.22, 0.005]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        </group>
      </group>

      {/* ── 8. Rear Classroom Wall with Student Cubbies / Lockers ── */}
      <group position={[0, 2.4, 4.8]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[16, 5.2]} />
          <meshStandardMaterial color="#f4eee4" roughness={0.85} />
        </mesh>
        <mesh position={[0, -1.95, 0.02]}>
          <boxGeometry args={[16, 0.9, 0.04]} />
          <meshStandardMaterial color="#8b5a2b" roughness={0.4} />
        </mesh>
        {/* Student Storage Lockers */}
        <group position={[0, -1.1, 0.35]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[8.0, 1.4, 0.65]} />
            <meshStandardMaterial color="#7a4f2b" roughness={0.4} />
          </mesh>
        </group>
        {/* Rear Bulletin Board */}
        <group position={[0, 0.9, 0.04]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[4.2, 1.1, 0.04]} />
            <meshStandardMaterial color="#5c3818" />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[4.0, 0.95]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ── 9. Classroom Ceiling with Recessed Lighting Fixtures ── */}
      <group position={[0, 4.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[16, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
export default SenseiBackground;
