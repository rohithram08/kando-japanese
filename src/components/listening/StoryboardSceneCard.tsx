// src/components/listening/StoryboardSceneCard.tsx
import React from 'react';
import type { StoryboardScene } from '../../api/listening';

interface StoryboardSceneCardProps {
  scene: StoryboardScene;
  isActive: boolean;
  totalScenes: number;
  currentSceneIndex: number;
  onSelectScene: (idx: number) => void;
}

export const StoryboardSceneCard: React.FC<StoryboardSceneCardProps> = ({
  scene,
  isActive,
  totalScenes,
  currentSceneIndex,
  onSelectScene,
}) => {
  // Render distinct thematic vector graphic based on sceneTheme
  const renderThemeIllustration = (theme: string) => {
    switch (theme) {
      case 'convenience_store':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full object-cover select-none" aria-hidden="true">
            <defs>
              <linearGradient id="bgConbini" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="100%" stopColor="#dcfce7" />
              </linearGradient>
              <linearGradient id="shelfGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" fill="url(#bgConbini)" rx="16" />
            {/* Store fluorescent lights */}
            <rect x="50" y="16" width="300" height="6" rx="3" fill="#ffffff" opacity="0.9" />
            {/* Store Shelves / Counter */}
            <rect x="30" y="90" width="340" height="110" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="30" y1="130" x2="370" y2="130" stroke="#e2e8f0" strokeWidth="2" />
            <line x1="30" y1="165" x2="370" y2="165" stroke="#e2e8f0" strokeWidth="2" />
            {/* Bento boxes on shelf */}
            <rect x="55" y="102" width="60" height="22" rx="4" fill="#fb923c" />
            <rect x="60" y="106" width="22" height="14" rx="2" fill="#ef4444" />
            <rect x="86" y="106" width="24" height="14" rx="2" fill="#fef08a" />
            <rect x="130" y="102" width="60" height="22" rx="4" fill="#38bdf8" />
            {/* Onigiri triangles */}
            <polygon points="220,124 235,98 250,124" fill="#ffffff" stroke="#334155" strokeWidth="2" />
            <rect x="230" y="114" width="10" height="10" fill="#1e293b" />
            <polygon points="265,124 280,98 295,124" fill="#ffffff" stroke="#334155" strokeWidth="2" />
            <rect x="275" y="114" width="10" height="10" fill="#1e293b" />
            {/* Green tea bottles */}
            <rect x="60" y="137" width="16" height="24" rx="3" fill="#22c55e" />
            <rect x="85" y="137" width="16" height="24" rx="3" fill="#16a34a" />
            <rect x="110" y="137" width="16" height="24" rx="3" fill="#15803d" />
            {/* Cash register terminal */}
            <rect x="240" y="145" width="80" height="48" rx="6" fill="#0f172a" />
            <rect x="250" y="152" width="60" height="22" rx="3" fill="#38bdf8" opacity="0.85" />
            <text x="256" y="167" fill="#ffffff" fontSize="10" fontWeight="bold">¥680</text>
            {/* Japanese Noren / Banner */}
            <rect x="140" y="32" width="120" height="32" rx="6" fill="#16a34a" />
            <text x="162" y="53" fill="#ffffff" fontSize="14" fontWeight="bold" letterSpacing="2">24H 🏪 コンビニ</text>
          </svg>
        );

      case 'train_station':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full object-cover select-none" aria-hidden="true">
            <defs>
              <linearGradient id="bgStation" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eff6ff" />
                <stop offset="100%" stopColor="#dbeafe" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" fill="url(#bgStation)" rx="16" />
            {/* Station Sign (Shinjuku -> Shibuya) */}
            <rect x="90" y="22" width="220" height="48" rx="6" fill="#ffffff" stroke="#22c55e" strokeWidth="4" />
            <rect x="90" y="56" width="220" height="14" fill="#22c55e" rx="2" />
            <text x="165" y="44" fill="#0f172a" fontSize="16" fontWeight="bold">新宿</text>
            <text x="162" y="54" fill="#64748b" fontSize="8">Shinjuku</text>
            <text x="245" y="66" fill="#ffffff" fontSize="8" fontWeight="bold">渋谷 方面 →</text>
            {/* Yamanote Train Platform Line */}
            <rect x="30" y="100" width="340" height="85" rx="8" fill="#1e293b" />
            <rect x="40" y="112" width="70" height="42" rx="4" fill="#38bdf8" opacity="0.6" />
            <rect x="125" y="112" width="70" height="42" rx="4" fill="#38bdf8" opacity="0.6" />
            <rect x="210" y="112" width="70" height="42" rx="4" fill="#38bdf8" opacity="0.6" />
            {/* Green Yamanote Stripe */}
            <rect x="30" y="160" width="340" height="12" fill="#22c55e" />
            {/* Platform Floor with Braille tiles */}
            <rect x="0" y="195" width="400" height="45" fill="#94a3b8" />
            <rect x="0" y="195" width="400" height="6" fill="#eab308" />
            <circle cx="200" cy="130" r="16" fill="#ef4444" opacity="0.9" />
            <text x="194" y="136" fill="#ffffff" fontSize="14" fontWeight="bold">14</text>
          </svg>
        );

      case 'classroom':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full object-cover select-none" aria-hidden="true">
            <defs>
              <linearGradient id="bgClass" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" fill="url(#bgClass)" rx="16" />
            {/* Green Blackboard */}
            <rect x="35" y="24" width="330" height="110" rx="8" fill="#14532d" stroke="#78350f" strokeWidth="6" />
            <text x="60" y="60" fill="#fef08a" fontSize="16" fontWeight="bold">宿題: P.45〜46</text>
            <text x="60" y="90" fill="#ffffff" fontSize="13">月曜日の朝に提出！</text>
            <text x="60" y="115" fill="#86efac" fontSize="12">漢字テストがあります 📝</text>
            {/* Classroom Desks */}
            <rect x="50" y="155" width="110" height="45" rx="5" fill="#d97706" />
            <rect x="240" y="155" width="110" height="45" rx="5" fill="#d97706" />
            {/* Notebook on desk */}
            <rect x="75" y="162" width="36" height="24" rx="2" fill="#ffffff" stroke="#94a3b8" />
            <line x1="82" y1="168" x2="104" y2="168" stroke="#cbd5e1" />
            <line x1="82" y1="174" x2="104" y2="174" stroke="#cbd5e1" />
          </svg>
        );

      case 'clinic':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full object-cover select-none" aria-hidden="true">
            <rect width="400" height="240" fill="#f0fdfa" rx="16" />
            <rect x="40" y="30" width="160" height="140" rx="10" fill="#ffffff" stroke="#0d9488" strokeWidth="2" />
            {/* Medical Red Cross */}
            <rect x="105" y="45" width="30" height="10" fill="#ef4444" rx="2" />
            <rect x="115" y="35" width="10" height="30" fill="#ef4444" rx="2" />
            <text x="65" y="100" fill="#0f172a" fontSize="13" fontWeight="bold">処方箋 (Medicine)</text>
            <text x="65" y="125" fill="#0d9488" fontSize="12">毎食後 1錠</text>
            {/* Stethoscope */}
            <path d="M260,60 C260,110 320,110 320,60" fill="none" stroke="#334155" strokeWidth="5" />
            <circle cx="290" cy="140" r="18" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
            <line x1="290" y1="108" x2="290" y2="122" stroke="#334155" strokeWidth="4" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full object-cover select-none" aria-hidden="true">
            <rect width="400" height="240" fill="#f8fafc" rx="16" />
            <circle cx="200" cy="100" r="45" fill="#6366f1" opacity="0.15" />
            <rect x="80" y="60" width="240" height="100" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
            <text x="135" y="115" fill="#4f46e5" fontSize="18" fontWeight="bold">会話シーン 🎧</text>
          </svg>
        );
    }
  };

  return (
    <div
      onClick={() => onSelectScene(scene.order - 1)}
      className={`relative group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
        isActive
          ? 'ring-3 ring-primary shadow-xl border-primary scale-[1.02]'
          : 'border-border/60 hover:border-primary/40 opacity-80 hover:opacity-100 shadow-md'
      }`}
    >
      {/* Top Banner Tag */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/85 backdrop-blur-md border border-border/60 text-xs font-bold text-foreground">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>
          Scene {scene.order} of {totalScenes}
        </span>
      </div>

      {/* Vector Illustration Canvas */}
      <div className="h-44 sm:h-52 w-full overflow-hidden bg-muted/20">
        {renderThemeIllustration(scene.sceneTheme)}
      </div>

      {/* Caption Overlay */}
      <div className="p-3 bg-card border-t border-border/40">
        <h4 className="font-bold text-sm text-foreground line-clamp-1">{scene.title}</h4>
        <p className="text-xs font-semibold text-primary mt-0.5 line-clamp-1">{scene.captionJa}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{scene.captionEn}</p>
      </div>
    </div>
  );
};
