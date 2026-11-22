// src/config/adConfig.ts
// ─────────────────────────────────────────────────────────────────────────────
// Kando Japanese — Ad Network & Free Subdomain Monetization Configuration
// Configured for networks that accept free subdomains (.vercel.app, .github.io)
// ─────────────────────────────────────────────────────────────────────────────

export interface AdConfig {
  /** Master switch to enable or disable advertisements across the platform */
  enabled: boolean;

  /** Active ad provider ('adsterra' | 'ethicalads' | 'custom') */
  network: 'adsterra' | 'ethicalads' | 'custom';

  /** Adsterra configuration for kandojapanese.vercel.app */
  adsterra: {
    /** Adsterra Website ID */
    websiteId: string;
    /** Direct HTML/JS snippet from Adsterra's 'Get Code' button */
    codeSnippet: string;
  };

  /** EthicalAds configuration (accepted on .vercel.app, privacy-friendly, zero trackers) */
  ethicalAds: {
    publisher: string;
    type: 'image' | 'text';
    keywords: string;
    testMode: boolean;
  };

  /** Custom ad snippet fallback */
  customAd: {
    html: string;
  };
}

export const AD_CONFIG: AdConfig = {
  enabled: true,
  network: 'adsterra',
  adsterra: {
    websiteId: '6220158',
    codeSnippet: '', // Paste the code snippet from Adsterra "Get code" here
  },
  ethicalAds: {
    publisher: 'ethicalads',
    type: 'image',
    keywords: 'japanese|learning|education|language|books',
    testMode: true,
  },
  customAd: {
    html: '',
  },
};
