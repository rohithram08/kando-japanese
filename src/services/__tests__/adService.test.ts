import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initializeGlobalAds } from '../adService';
import { AD_CONFIG } from '../../config/adConfig';

describe('adService - initializeGlobalAds', () => {
  beforeEach(() => {
    // Clear any test injected scripts
    document.querySelectorAll('script[src*="bauval.org"], script[src*="abscloud.org"]').forEach((el) => el.remove());
  });

  afterEach(() => {
    document.querySelectorAll('script[src*="bauval.org"], script[src*="abscloud.org"]').forEach((el) => el.remove());
  });

  it('injects Social Bar and Popunder scripts into DOM when forced past test env check', () => {
    // In Vitest, NODE_ENV is 'test', so initializeGlobalAds safely early exits by default
    initializeGlobalAds();
    expect(document.querySelector('script[src*="bauval.org"]')).toBeNull();

    // Now test injection directly by temporarily stubbing process.env.NODE_ENV
    const originalEnv = process.env.NODE_ENV;
    try {
      (process.env as any).NODE_ENV = 'production';
      initializeGlobalAds();

      const socialBarScript = document.querySelector(`script[src="${AD_CONFIG.adsterra.socialBarScriptUrl}"]`);
      const popunderScript = document.querySelector(`script[src="${AD_CONFIG.adsterra.popunderScriptUrl}"]`);

      expect(socialBarScript).not.toBeNull();
      expect(popunderScript).not.toBeNull();
      expect(socialBarScript?.getAttribute('data-cfasync')).toBe('false');
      expect(popunderScript?.getAttribute('data-cfasync')).toBe('false');
    } finally {
      (process.env as any).NODE_ENV = originalEnv;
    }
  });

  it('does not re-inject scripts if they already exist in DOM', () => {
    const originalEnv = process.env.NODE_ENV;
    try {
      (process.env as any).NODE_ENV = 'production';
      initializeGlobalAds();
      initializeGlobalAds();

      const scripts = document.querySelectorAll(`script[src="${AD_CONFIG.adsterra.socialBarScriptUrl}"]`);
      expect(scripts.length).toBe(1);
    } finally {
      (process.env as any).NODE_ENV = originalEnv;
    }
  });
});
