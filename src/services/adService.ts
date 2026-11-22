// src/services/adService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Kando Japanese — Global Ad Network Service Loader
// Injects approved ad network scripts (Social Bar, Popunder) into DOM safely.
// ─────────────────────────────────────────────────────────────────────────────

import { AD_CONFIG } from '../config/adConfig';

export function initializeGlobalAds() {
  if (typeof window === 'undefined' || !AD_CONFIG.enabled) return;
  // Never inject live ad popups during automated test environments
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') return;

  if (AD_CONFIG.network === 'adsterra') {
    // 1. Social Bar (Unit 32417598)
    if (AD_CONFIG.adsterra.enableSocialBar && AD_CONFIG.adsterra.socialBarScriptUrl) {
      const existing = document.querySelector(`script[src="${AD_CONFIG.adsterra.socialBarScriptUrl}"]`);
      if (!existing) {
        const s = document.createElement('script');
        s.src = AD_CONFIG.adsterra.socialBarScriptUrl;
        s.setAttribute('data-cfasync', 'false');
        s.async = true;
        document.body.appendChild(s);
      }
    }

    // 2. Popunder (Unit 32417597)
    if (AD_CONFIG.adsterra.enablePopunder && AD_CONFIG.adsterra.popunderScriptUrl) {
      const existing = document.querySelector(`script[src="${AD_CONFIG.adsterra.popunderScriptUrl}"]`);
      if (!existing) {
        const s = document.createElement('script');
        s.src = AD_CONFIG.adsterra.popunderScriptUrl;
        s.setAttribute('data-cfasync', 'false');
        s.async = true;
        document.body.appendChild(s);
      }
    }
  }
}
