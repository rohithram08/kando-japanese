// src/config/adConfig.ts
// ─────────────────────────────────────────────────────────────────────────────
// Kando Japanese — Ad Network & Free Subdomain Monetization Configuration
// Configured for networks that accept free subdomains (.vercel.app, .github.io)
// ─────────────────────────────────────────────────────────────────────────────

export interface AdConfig {
  /** Master switch to enable or disable advertisements across the platform */
  enabled: boolean;

  /** Active ad provider ('ethicalads' for privacy-friendly tech/learning ads, or 'custom' for direct code) */
  network: 'ethicalads' | 'custom';

  /** EthicalAds configuration (accepted on .vercel.app, privacy-friendly, zero trackers) */
  ethicalAds: {
    /**
     * Your EthicalAds Publisher ID.
     * Default 'ethicalads' uses test mode so you can see live preview ads immediately.
     * Once your free account is approved at https://www.ethicalads.io/publishers/,
     * replace 'ethicalads' with your real publisher ID (e.g. 'kando-japanese').
     */
    publisher: string;

    /** Ad display type: 'image' (visual banner) or 'text' (clean reading text) */
    type: 'image' | 'text';

    /** Relevant keywords to match relevant Japanese, language learning, and education ads */
    keywords: string;

    /** Test mode flag: true displays test sponsor banners without requiring active billing */
    testMode: boolean;
  };

  /** Custom ad snippet fallback (e.g. Adsterra or Infolinks HTML snippet) */
  customAd: {
    html: string;
  };
}

export const AD_CONFIG: AdConfig = {
  enabled: true,
  network: 'ethicalads',
  ethicalAds: {
    publisher: 'ethicalads', // Test publisher accepted on all domains including .vercel.app
    type: 'image',
    keywords: 'japanese|learning|education|language|books',
    testMode: true,
  },
  customAd: {
    html: '',
  },
};
