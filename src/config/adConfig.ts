// src/config/adConfig.ts
// ─────────────────────────────────────────────────────────────────────────────
// Kando Japanese — Ad Network & Free Subdomain Monetization Configuration
// Configured with verified Adsterra Ad Units for kandojapanese.vercel.app
// ─────────────────────────────────────────────────────────────────────────────

export interface AdConfig {
  /** Master switch to enable or disable advertisements across the platform */
  enabled: boolean;

  /** Active ad provider ('adsterra' | 'ethicalads' | 'custom') */
  network: 'adsterra' | 'ethicalads' | 'custom';

  /** Adsterra configuration for kandojapanese.vercel.app (Website ID: 6220158) */
  adsterra: {
    websiteId: string;
    /** Unit 32417599: In-page Native Banner snippet */
    nativeBannerSnippet: string;
    /** Unit 32417598: Interactive Social Bar script URL */
    socialBarScriptUrl: string;
    /** Unit 32417597: Popunder script URL */
    popunderScriptUrl: string;
    /** Individual format toggles */
    enableNativeBanner: boolean;
    enableSocialBar: boolean;
    enablePopunder: boolean;
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
    // 1. Native Banner (ID: 32417599) — Embedded in Dictionary & Kana pages
    nativeBannerSnippet: `<script async="async" data-cfasync="false" src="https://bauval.org/21/0a542e9b5e6f732e9fac65470027589a"></script><div id="container-0a542e9b5e6f732e9fac65470027589a"></div>`,
    
    // 2. Social Bar (ID: 32417598) — Floating interactive sponsor badge
    socialBarScriptUrl: 'https://bauval.org/14/87c7f4031cfcacd0f3dd4730b3f3fc87',
    
    // 3. Popunder (ID: 32417597) — Background high-CPM tab
    popunderScriptUrl: 'https://abscloud.org/1/4b2f2d6fce9472134fff10b802caec7e',

    enableNativeBanner: true,
    enableSocialBar: true,
    enablePopunder: true,
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
