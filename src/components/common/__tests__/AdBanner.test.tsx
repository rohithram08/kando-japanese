import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import AdBanner from '../AdBanner';
import { AD_CONFIG } from '../../../config/adConfig';

const DEFAULT_BANNER_SNIPPET = AD_CONFIG.adsterra.nativeBannerSnippet;

afterEach(() => {
  cleanup();
  AD_CONFIG.enabled = true;
  AD_CONFIG.network = 'adsterra';
  AD_CONFIG.adsterra.enableNativeBanner = true;
  AD_CONFIG.adsterra.nativeBannerSnippet = DEFAULT_BANNER_SNIPPET;
});

describe('AdBanner Component', () => {
  it('renders sponsored badge and Adsterra native banner iframe when configured', () => {
    render(<AdBanner placementId="test-dictionary" />);

    expect(screen.getByText('Sponsored')).toBeDefined();
    expect(screen.getByText('スポンサー')).toBeDefined();
    expect(screen.getByText(/Supports free Japanese learning/i)).toBeDefined();
    expect(screen.getByTitle('Adsterra Advertisement')).toBeDefined();
  });

  it('renders partner placeholder when native banner snippet is empty', () => {
    AD_CONFIG.adsterra.nativeBannerSnippet = '';
    render(<AdBanner placementId="test-empty" />);

    expect(screen.getByText(/Adsterra Partner Connected/i)).toBeDefined();
  });

  it('allows dismissing the ad banner when close button is clicked', () => {
    render(<AdBanner placementId="test-dismiss" />);

    const dismissBtn = screen.getByTitle(/Dismiss ad/i);
    fireEvent.click(dismissBtn);

    expect(screen.queryByText('Sponsored')).toBeNull();
  });

  it('renders nothing when AD_CONFIG.enabled is false', () => {
    AD_CONFIG.enabled = false;
    const { container } = render(<AdBanner placementId="test-disabled" />);

    expect(container.firstChild).toBeNull();
  });

  it('renders custom ad HTML when configured for custom network', () => {
    AD_CONFIG.network = 'custom';
    AD_CONFIG.customAd.html = '<div data-testid="custom-sponsor">Custom Ad Partner</div>';

    render(<AdBanner placementId="test-custom" />);

    expect(screen.getByTestId('custom-sponsor')).toBeDefined();
    expect(screen.getByText('Custom Ad Partner')).toBeDefined();
  });
});
