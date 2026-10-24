// src/components/profile/ProfileBannerScene.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Animated 2D banner for the profile page — a looping "Wave XP" Japan scene:
// twilight sky, twinkling stars, glowing moon, drifting clouds, Mt. Fuji + torii
// silhouettes, falling sakura petals, rolling waves and a bobbing Jelly slime.
//
// Pure CSS/SVG (no canvas, no extra deps). Every animation is disabled for people
// who prefer reduced motion, and the whole scene is aria-hidden decoration.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react'

const STARS = [
  { l: 6, t: 14, s: 2, d: 0 }, { l: 14, t: 34, s: 1.5, d: 1.1 }, { l: 23, t: 10, s: 2, d: 2.2 },
  { l: 31, t: 26, s: 1.5, d: 0.6 }, { l: 42, t: 12, s: 2.5, d: 1.7 }, { l: 51, t: 30, s: 1.5, d: 2.8 },
  { l: 58, t: 9, s: 2, d: 0.3 }, { l: 66, t: 24, s: 1.5, d: 1.4 }, { l: 74, t: 38, s: 2, d: 2.5 },
  { l: 81, t: 13, s: 1.5, d: 0.9 }, { l: 90, t: 30, s: 2, d: 1.9 }, { l: 95, t: 8, s: 1.5, d: 2.9 },
]

const PETALS = [
  { l: 4, d: 0, t: 9, s: 10 }, { l: 12, d: 3.2, t: 11, s: 8 }, { l: 21, d: 1.4, t: 8, s: 12 },
  { l: 30, d: 5.1, t: 12, s: 9 }, { l: 38, d: 2.3, t: 10, s: 11 }, { l: 47, d: 6.6, t: 9, s: 8 },
  { l: 55, d: 0.8, t: 13, s: 10 }, { l: 63, d: 4.2, t: 8, s: 12 }, { l: 71, d: 7.4, t: 11, s: 9 },
  { l: 79, d: 2.9, t: 10, s: 11 }, { l: 87, d: 5.8, t: 9, s: 8 }, { l: 94, d: 1.9, t: 12, s: 10 },
]

const CSS = `
.pbs-root { position:absolute; inset:0; overflow:hidden; }
.pbs-hills { position:absolute; left:0; bottom:0; width:100%; height:62%; }
.pbs-torii { position:absolute; left:14%; bottom:26px; width:64px; }
.pbs-sky { position:absolute; inset:0;
  background: linear-gradient(120deg,#6d28d9 0%,#7c3aed 25%,#6366f1 55%,#4338ca 80%,#6d28d9 100%);
  background-size: 240% 240%; animation: pbs-sky 18s ease-in-out infinite alternate; }
.pbs-star { position:absolute; border-radius:9999px; background:#fff; opacity:.8; animation: pbs-twinkle 3.2s ease-in-out infinite; }
.pbs-moon { position:absolute; right:12%; top:14%; width:44px; height:44px; border-radius:9999px;
  background: radial-gradient(circle at 35% 35%,#fff7ed,#fde68a 70%); box-shadow:0 0 28px 8px rgba(253,230,138,.45);
  animation: pbs-glow 5s ease-in-out infinite; }
.pbs-cloud { position:absolute; left:0; opacity:.22; animation: pbs-drift linear infinite; will-change: transform; }
.pbs-petal { position:absolute; top:-14px; border-radius:100% 0 100% 0; background:linear-gradient(135deg,#fbcfe8,#f472b6);
  opacity:.85; animation: pbs-fall linear infinite; will-change: transform; }
.pbs-wave { position:absolute; left:0; bottom:0; width:200%; animation: pbs-wave linear infinite; will-change: transform; }
.pbs-slime { position:absolute; right:9%; bottom:34px; width:58px; animation: pbs-bob 2.6s ease-in-out infinite; transform-origin: 50% 100%; }
.pbs-eye { transform-box: fill-box; transform-origin: center; animation: pbs-blink 4.8s infinite; }
.pbs-avatar { animation: pbs-float 4.5s ease-in-out infinite; }
.pbs-avatar-ring { animation: pbs-ring 3.2s ease-out infinite; }

@keyframes pbs-sky { from { background-position: 0% 40%; } to { background-position: 100% 60%; } }
@keyframes pbs-twinkle { 0%,100% { opacity:.25; transform:scale(.8);} 50% { opacity:1; transform:scale(1.25);} }
@keyframes pbs-glow { 0%,100% { box-shadow:0 0 22px 6px rgba(253,230,138,.35);} 50% { box-shadow:0 0 38px 14px rgba(253,230,138,.6);} }
@keyframes pbs-drift { from { transform: translateX(-30%);} to { transform: translateX(110vw);} }
@keyframes pbs-fall {
  0%   { transform: translate3d(0,-10px,0) rotate(0deg); opacity:0; }
  8%   { opacity:.9; }
  50%  { transform: translate3d(28px,95px,0) rotate(180deg); }
  100% { transform: translate3d(-14px,230px,0) rotate(360deg); opacity:0; }
}
@keyframes pbs-wave { from { transform: translateX(0);} to { transform: translateX(-50%);} }
@keyframes pbs-bob {
  0%,100% { transform: translateY(0) scale(1,1); }
  45%     { transform: translateY(-16px) scale(.94,1.08); }
  60%     { transform: translateY(-16px) scale(.96,1.05); }
  85%     { transform: translateY(0) scale(1.08,.9); }
}
@keyframes pbs-blink { 0%,92%,100% { transform:scaleY(1);} 95% { transform:scaleY(.1);} }
@keyframes pbs-float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-5px);} }
@keyframes pbs-ring { 0% { box-shadow:0 0 0 0 rgba(168,85,247,.55);} 100% { box-shadow:0 0 0 16px rgba(168,85,247,0);} }

@media (prefers-reduced-motion: reduce) {
  .pbs-sky,.pbs-star,.pbs-moon,.pbs-cloud,.pbs-petal,.pbs-wave,.pbs-slime,.pbs-eye,.pbs-avatar,.pbs-avatar-ring { animation: none !important; }
  .pbs-petal { display:none; }
}
`

const Cloud = ({ top, scale, duration, delay }) => (
  <svg
    className="pbs-cloud"
    style={{ top: `${top}%`, animationDuration: `${duration}s`, animationDelay: `${delay}s`, width: 120 * scale }}
    viewBox="0 0 120 50"
    fill="#fff"
    aria-hidden="true"
  >
    <ellipse cx="38" cy="32" rx="30" ry="14" />
    <ellipse cx="66" cy="24" rx="26" ry="18" />
    <ellipse cx="90" cy="33" rx="24" ry="12" />
  </svg>
)

export default function ProfileBannerScene() {
  return (
    <div className="pbs-root" aria-hidden="true" data-testid="profile-banner-scene">
      <style>{CSS}</style>
      <div className="pbs-sky" />

      {STARS.map((s, i) => (
        <span key={i} className="pbs-star" style={{ left: `${s.l}%`, top: `${s.t}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }} />
      ))}
      <div className="pbs-moon" />

      <Cloud top={16} scale={1} duration={46} delay={-8} />
      <Cloud top={34} scale={0.7} duration={62} delay={-30} />
      <Cloud top={8} scale={0.55} duration={78} delay={-52} />

      {/* Mt. Fuji + far hills */}
      <svg className="pbs-hills" viewBox="0 0 800 160" preserveAspectRatio="none">
        <path d="M0 160 L0 120 Q80 96 160 118 T320 112 L430 28 L470 28 L585 112 Q660 96 740 116 T800 110 L800 160 Z" fill="#4c1d95" opacity=".55" />
        <path d="M430 28 L470 28 L486 50 Q468 44 450 56 Q432 44 414 50 Z" fill="#f5f3ff" opacity=".9" />
        <path d="M0 160 L0 134 Q120 112 240 136 T480 132 T800 128 L800 160 Z" fill="#3b0764" opacity=".6" />
      </svg>

      {/* Torii gate */}
      <svg className="pbs-torii" viewBox="0 0 64 56" aria-hidden="true">
        <path d="M2 10 Q32 2 62 10 L60 16 Q32 9 4 16 Z" fill="#fb7185" />
        <rect x="8" y="18" width="48" height="5" fill="#f43f5e" />
        <rect x="14" y="14" width="6" height="42" fill="#fb7185" />
        <rect x="44" y="14" width="6" height="42" fill="#fb7185" />
      </svg>

      {/* Sakura petals */}
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="pbs-petal"
          style={{ left: `${p.l}%`, width: p.s, height: p.s, animationDuration: `${p.t}s`, animationDelay: `${-p.d}s` }}
        />
      ))}

      {/* Jelly slime mascot */}
      <svg className="pbs-slime" viewBox="0 0 64 52" aria-hidden="true">
        <defs>
          <radialGradient id="pbs-jelly" cx="40%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="60%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </radialGradient>
        </defs>
        <path d="M6 46 Q4 22 20 12 Q32 4 44 12 Q60 22 58 46 Q32 52 6 46 Z" fill="url(#pbs-jelly)" stroke="#0891b2" strokeWidth="1.2" />
        <ellipse cx="22" cy="20" rx="7" ry="4" fill="#fff" opacity=".55" />
        <g fill="#0f172a">
          <ellipse className="pbs-eye" cx="24" cy="32" rx="3" ry="4" />
          <ellipse className="pbs-eye" cx="40" cy="32" rx="3" ry="4" />
        </g>
        <ellipse cx="18" cy="38" rx="3.2" ry="2" fill="#fb7185" opacity=".55" />
        <ellipse cx="46" cy="38" rx="3.2" ry="2" fill="#fb7185" opacity=".55" />
        <path d="M28 39 Q32 43 36 39" fill="none" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
      </svg>

      {/* Rolling waves */}
      <svg className="pbs-wave" style={{ animationDuration: '14s', height: 34, opacity: 0.55 }} viewBox="0 0 1600 34" preserveAspectRatio="none">
        <path d="M0 18 Q50 2 100 18 T200 18 T300 18 T400 18 T500 18 T600 18 T700 18 T800 18 T900 18 T1000 18 T1100 18 T1200 18 T1300 18 T1400 18 T1500 18 T1600 18 V34 H0 Z" fill="#22d3ee" />
      </svg>
      <svg className="pbs-wave" style={{ animationDuration: '9s', height: 24, opacity: 0.75 }} viewBox="0 0 1600 24" preserveAspectRatio="none">
        <path d="M0 12 Q40 0 80 12 T160 12 T240 12 T320 12 T400 12 T480 12 T560 12 T640 12 T720 12 T800 12 T880 12 T960 12 T1040 12 T1120 12 T1200 12 T1280 12 T1360 12 T1440 12 T1520 12 T1600 12 V24 H0 Z" fill="#0ea5e9" />
      </svg>
    </div>
  )
}
