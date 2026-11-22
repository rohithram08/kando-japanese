// src/components/common/AdBanner.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Kando Japanese — Non-Intrusive Educational AdBanner
// Designed for free-subdomain ad networks (EthicalAds, Adsterra, Infolinks)
// Non-tracking, responsive, and collapsible to maintain a respectful study flow.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useId } from 'react';
import { Sparkles, X, Heart, ExternalLink } from 'lucide-react';
import { AD_CONFIG } from '../../config/adConfig';

declare global {
  interface Window {
    ethicalads?: {
      load: () => void;
      reload: () => void;
      wait: boolean;
    };
  }
}

export interface AdBannerProps {
  /** Optional placement identifier */
  placementId?: string;
  /** Visual variant: 'horizontal' (banner) or 'compact' (small card) */
  variant?: 'horizontal' | 'compact';
  /** Extra CSS classes */
  className?: string;
}

export default function AdBanner({
  placementId = 'default',
  variant = 'horizontal',
  className = '',
}: AdBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const uniqueId = useId().replace(/:/g, '');
  const containerId = `ea-ad-${placementId}-${uniqueId}`;

  // 1. Inject EthicalAds client script once if EthicalAds is selected
  useEffect(() => {
    if (!AD_CONFIG.enabled || isDismissed) return;

    if (AD_CONFIG.network === 'ethicalads') {
      const existingScript = document.querySelector('script[src*="ethicalads.min.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://media.ethicalads.io/media/client/ethicalads.min.js';
        script.async = true;
        script.onload = () => {
          setScriptLoaded(true);
          try {
            window.ethicalads?.load();
          } catch {}
        };
        document.head.appendChild(script);
      } else {
        setScriptLoaded(true);
        try {
          window.ethicalads?.load();
        } catch {}
      }
    }
  }, [isDismissed]);

  // 2. Trigger ad reload when component mounts or script loads
  useEffect(() => {
    if (!AD_CONFIG.enabled || isDismissed) return;
    if (scriptLoaded && window.ethicalads) {
      try {
        window.ethicalads.load();
      } catch {}
    }
  }, [scriptLoaded, isDismissed]);

  if (!AD_CONFIG.enabled || isDismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`relative w-full rounded-2xl bg-card/60 backdrop-blur-md border border-border/70 p-3 sm:p-4 shadow-sm overflow-hidden my-4 transition-all duration-300 ${className}`}
    >
      {/* ── Subtitle Bar ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground pb-2 mb-2 border-b border-border/40">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-semibold text-[10px] tracking-wide uppercase">
            Sponsored
          </span>
          <span className="font-japanese text-[10px] opacity-75">スポンサー</span>
          <span className="hidden sm:inline text-muted-foreground/60">•</span>
          <span className="hidden sm:inline text-[10px] text-muted-foreground/80 flex items-center gap-1">
            <Heart className="w-2.5 h-2.5 text-rose-400 inline" /> Supports free Japanese learning for everyone
          </span>
        </div>

        {/* Hide / Dismiss Button */}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-md text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted transition-colors"
          title="Dismiss ad for this session"
          aria-label="Dismiss ad for this session"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Ad Slot Container ───────────────────────────────────────── */}
      <div className="min-h-[90px] flex items-center justify-center">
        {AD_CONFIG.network === 'ethicalads' ? (
          <div
            id={containerId}
            data-ea-publisher={AD_CONFIG.ethicalAds.publisher}
            data-ea-type={AD_CONFIG.ethicalAds.type}
            data-ea-keywords={AD_CONFIG.ethicalAds.keywords}
            data-ea-manual="true"
            className="horizontal adaptive w-full flex justify-center text-center text-xs"
          >
            {/* Fallback preview banner when offline, ad-blocked, or before EthicalAds renders */}
            <div className="py-2 px-3 rounded-xl bg-muted/40 border border-border/50 text-center max-w-md w-full flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Kando Japanese Community Sponsor</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Ads delivered through EthicalAds are 100% privacy-respecting and tracker-free. Payouts directly support our TiDB database and server hosting.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="w-full flex justify-center"
            dangerouslySetInnerHTML={{ __html: AD_CONFIG.customAd.html || '<p class="text-xs text-muted-foreground">Custom Ad Placement</p>' }}
          />
        )}
      </div>
    </aside>
  );
}
