import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useSettingsStore, sanitizeReaderSpeed, VALID_READER_SPEEDS, migrateSettingsStorage } from '../settingsStore';

describe('useSettingsStore — Reader Preferences & Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.getState().resetToDefaults();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('provides safe defaults for readerSpeed and readerAutoPlayNext', () => {
    const state = useSettingsStore.getState();
    expect(state.readerSpeed).toBe(1.0);
    expect(state.readerAutoPlayNext).toBe(false);
  });

  it('sanitizes reader speeds to valid options (0.8, 1.0, 1.2) and falls back safely', () => {
    expect(sanitizeReaderSpeed(0.8)).toBe(0.8);
    expect(sanitizeReaderSpeed(1.0)).toBe(1.0);
    expect(sanitizeReaderSpeed(1.2)).toBe(1.2);

    // Stale or invalid inputs fall back to 1.0
    expect(sanitizeReaderSpeed(0.5)).toBe(1.0);
    expect(sanitizeReaderSpeed(2.0)).toBe(1.0);
    expect(sanitizeReaderSpeed('fast' as any)).toBe(1.0);
    expect(sanitizeReaderSpeed(null as any)).toBe(1.0);
    expect(sanitizeReaderSpeed(undefined as any)).toBe(1.0);
    expect(sanitizeReaderSpeed(NaN as any)).toBe(1.0);
  });

  it('updates readerSpeed via setReaderSpeed and rejects invalid values', () => {
    useSettingsStore.getState().setReaderSpeed(0.8);
    expect(useSettingsStore.getState().readerSpeed).toBe(0.8);

    useSettingsStore.getState().setReaderSpeed(1.2);
    expect(useSettingsStore.getState().readerSpeed).toBe(1.2);

    // Invalid attempt falls back to 1.0
    useSettingsStore.getState().setReaderSpeed(1.5 as any);
    expect(useSettingsStore.getState().readerSpeed).toBe(1.0);
  });

  it('toggles and persists readerAutoPlayNext', () => {
    expect(useSettingsStore.getState().readerAutoPlayNext).toBe(false);

    useSettingsStore.getState().setReaderAutoPlayNext(true);
    expect(useSettingsStore.getState().readerAutoPlayNext).toBe(true);

    useSettingsStore.getState().setReaderAutoPlayNext(false);
    expect(useSettingsStore.getState().readerAutoPlayNext).toBe(false);
  });

  it('persists preferences under localStorage key nihongo_settings for guests', () => {
    useSettingsStore.getState().setReaderSpeed(0.8);
    useSettingsStore.getState().setReaderAutoPlayNext(true);

    const raw = localStorage.getItem('nihongo_settings');
    expect(raw).toBeDefined();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.readerSpeed).toBe(0.8);
    expect(parsed.state.readerAutoPlayNext).toBe(true);
    // Transient values must NOT be persisted
    expect(parsed.state.hydrated).toBeUndefined();
    expect(parsed.state.isPlaying).toBeUndefined();
  });

  it('sanitizes stale or corrupted values upon initialization / merge', () => {
    // Simulate corrupt localStorage
    localStorage.setItem(
      'nihongo_settings',
      JSON.stringify({
        state: {
          readerSpeed: 99.9, // corrupted speed
          readerAutoPlayNext: 'not-a-bool',
        },
      })
    );

    useSettingsStore.getState().init();
    const state = useSettingsStore.getState();
    expect(state.readerSpeed).toBe(1.0);
    expect(typeof state.readerAutoPlayNext).toBe('boolean');
    expect(state.hydrated).toBe(true);
  });

  it('resetToDefaults restores defaults while maintaining hydration status', () => {
    useSettingsStore.getState().setReaderSpeed(1.2);
    useSettingsStore.getState().setReaderAutoPlayNext(true);

    useSettingsStore.getState().resetToDefaults();
    const state = useSettingsStore.getState();
    expect(state.readerSpeed).toBe(1.0);
    expect(state.readerAutoPlayNext).toBe(false);
    expect(state.hydrated).toBe(true);
  });

  describe('migrateSettingsStorage — 5 Edge Case Scenarios', () => {
    it('Scenario 1 (Legacy-only): migrates legacy preferences from nihongo-settings to nihongo_settings', () => {
      localStorage.removeItem('nihongo_settings');
      localStorage.setItem(
        'nihongo-settings',
        JSON.stringify({
          state: {
            jlptLevel: 'N4',
            readerSpeed: 1.2,
            readerAutoPlayNext: true,
          },
        })
      );

      const res = migrateSettingsStorage(localStorage);
      expect(res).toBeDefined();
      expect(res?.jlptLevel).toBe('N4');
      expect(res?.readerSpeed).toBe(1.2);
      expect(res?.readerAutoPlayNext).toBe(true);

      const saved = JSON.parse(localStorage.getItem('nihongo_settings')!);
      expect(saved.state.jlptLevel).toBe('N4');
      expect(saved.state.readerSpeed).toBe(1.2);

      useSettingsStore.getState().init();
      const state = useSettingsStore.getState();
      expect(state.jlptLevel).toBe('N4');
      expect(state.readerSpeed).toBe(1.2);
      expect(state.readerAutoPlayNext).toBe(true);
    });

    it('Scenario 2 (Canonical-only): preserves canonical preferences without modification', () => {
      localStorage.setItem(
        'nihongo_settings',
        JSON.stringify({
          state: {
            jlptLevel: 'N3',
            readerSpeed: 0.8,
            readerAutoPlayNext: false,
          },
        })
      );
      localStorage.removeItem('nihongo-settings');

      const res = migrateSettingsStorage(localStorage);
      expect(res?.jlptLevel).toBe('N3');
      expect(res?.readerSpeed).toBe(0.8);
      expect(localStorage.getItem('nihongo-settings')).toBeNull();

      useSettingsStore.getState().init();
      const state = useSettingsStore.getState();
      expect(state.jlptLevel).toBe('N3');
      expect(state.readerSpeed).toBe(0.8);
    });

    it('Scenario 3 (Both exist): canonical overrides legacy on collision, while legacy backfills missing fields', () => {
      localStorage.setItem(
        'nihongo_settings',
        JSON.stringify({
          state: {
            jlptLevel: 'N4', // canonical has N4
            readerSpeed: 1.2, // canonical has 1.2
          },
        })
      );
      localStorage.setItem(
        'nihongo-settings',
        JSON.stringify({
          state: {
            jlptLevel: 'N5', // conflict: canonical should win
            readerSpeed: 0.8, // conflict: canonical should win
            readerAutoPlayNext: true, // legacy has field not in canonical: should backfill
            fontSize: 'large', // legacy has field not in canonical: should backfill
          },
        })
      );

      const res = migrateSettingsStorage(localStorage);
      expect(res?.jlptLevel).toBe('N4'); // canonical preserved
      expect(res?.readerSpeed).toBe(1.2); // canonical preserved
      expect(res?.readerAutoPlayNext).toBe(true); // backfilled from legacy
      expect(res?.fontSize).toBe('large'); // backfilled from legacy

      useSettingsStore.getState().init();
      const state = useSettingsStore.getState();
      expect(state.jlptLevel).toBe('N4');
      expect(state.readerSpeed).toBe(1.2);
      expect(state.readerAutoPlayNext).toBe(true);
      expect(state.fontSize).toBe('large');
    });

    it('Scenario 4 (Neither exists): returns null and retains default settings without error', () => {
      localStorage.removeItem('nihongo_settings');
      localStorage.removeItem('nihongo-settings');

      const res = migrateSettingsStorage(localStorage);
      expect(res).toBeNull();

      useSettingsStore.getState().init();
      const state = useSettingsStore.getState();
      expect(state.jlptLevel).toBe('N5');
      expect(state.readerSpeed).toBe(1.0);
      expect(state.readerAutoPlayNext).toBe(false);
      expect(state.hydrated).toBe(true);
    });

    it('Scenario 5 (Malformed JSON): handles corrupt data safely and recovers from valid legacy if available', () => {
      // Subcase 5A: Canonical corrupt, legacy valid -> recovers from legacy
      localStorage.setItem('nihongo_settings', '{corrupt-json-canonical!!!');
      localStorage.setItem(
        'nihongo-settings',
        JSON.stringify({
          state: {
            jlptLevel: 'N4',
            readerSpeed: 0.8,
          },
        })
      );

      const resA = migrateSettingsStorage(localStorage);
      expect(resA?.jlptLevel).toBe('N4');
      expect(resA?.readerSpeed).toBe(0.8);

      // Subcase 5B: Both corrupt -> safely returns null without throwing
      localStorage.setItem('nihongo_settings', '{corrupt-json-1');
      localStorage.setItem('nihongo-settings', '{corrupt-json-2');

      expect(() => {
        const resB = migrateSettingsStorage(localStorage);
        expect(resB).toBeNull();
      }).not.toThrow();

      useSettingsStore.getState().init();
      const state = useSettingsStore.getState();
      expect(state.readerSpeed).toBe(1.0);
      expect(state.hydrated).toBe(true);
    });
  });
});

