import { describe, it, expect } from 'vitest';
import {
  APP_VERSION,
  APP_NAME,
  APP_RELEASE_DATE,
  APP_RELEASE_HIGHLIGHTS,
  getAppVersionString,
} from '../version';

describe('Platform Version Configuration', () => {
  it('exposes platform version 2.1.16', () => {
    expect(APP_VERSION).toBe('2.1.16');
    expect(getAppVersionString()).toBe('v2.1.16');
  });

  it('contains platform branding and release highlights', () => {
    expect(APP_NAME).toContain('Kando Japanese');
    expect(APP_RELEASE_DATE).toBe('2026-10-31');
    expect(APP_RELEASE_HIGHLIGHTS.length).toBeGreaterThanOrEqual(5);
  });
});
