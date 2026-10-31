// src/config/version.ts
// Single source of truth for Kando Japanese Platform Version

export const APP_VERSION = '2.1.16';
export const APP_NAME = 'Kando Japanese (感動)';
export const APP_CODENAME = 'Kando Genesis';
export const APP_RELEASE_DATE = '2026-10-31';

export const APP_RELEASE_HIGHLIGHTS = [
  'Authentic KanjiVG vector stroke engine with trajectory & shape recognition',
  'Zero-scroll unified kanji modal with dual-pane layout & 5-6 verified examples',
  'Long-form Graded Readers with verified furigana, pitch accent & sentence audio',
  'Real-time 3D VRM AI Hana-Sensei companion with natural Japanese speech',
  'Full multilingual curriculum (English, Tamil, Hindi) across JLPT N5 → N1',
  'SuperMemo-2 spaced repetition (SRS) system with real-time sync',
];

export const getAppVersionString = () => `v${APP_VERSION}`;
