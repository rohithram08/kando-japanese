import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import AdBanner from '../AdBanner';
import { AD_CONFIG } from '../../../config/adConfig';

afterEach(() => {
  cleanup();
  AD_CONFIG.enabled = true;
  AD_CONFIG.network = 'adsterra';
  AD_CONFIG.adsterra.codeSnippet = '';
});

describe('AdBanner Component', () => {
  it('renders sponsored badge and community support label', () => {
    render(<AdBanner placementId="test-dictionary" />);

    expect(screen.getByText('Sponsored')).toBeDefined();
    expect(screen.getByText('スポンサー')).toBeDefined();
    expect(screen.getByText(/Supports free Japanese learning/i)).toBeDefined();
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

  it('renders iframe when Adsterra code snippet is provided', () => {
    AD_CONFIG.network = 'adsterra';
    AD_CONFIG.adsterra.codeSnippet = '<script>window.atOptions={key:"123"};</script>';

    render(<AdBanner placementId="test-adsterra" />);

    const iframe = screen.getByTitle('Adsterra Advertisement');
    expect(iframe).toBeDefined();
  });

  it('renders custom ad HTML when configured for custom network', () => {
    AD_CONFIG.network = 'custom';
    AD_CONFIG.customAd.html = '<div data-testid="custom-sponsor">Custom Ad Partner</div>';

    render(<AdBanner placementId="test-custom" />);

    expect(screen.getByTestId('custom-sponsor')).toBeDefined();
    expect(screen.getByText('Custom Ad Partner')).toBeDefined();
  });
});
