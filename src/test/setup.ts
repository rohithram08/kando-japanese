// src/test/setup.ts
import { vi } from 'vitest';

if (typeof window !== 'undefined') {
  if (!window.IntersectionObserver) {
    class MockIntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = vi.fn(() => []);
    }
    window.IntersectionObserver = MockIntersectionObserver as any;
    global.IntersectionObserver = MockIntersectionObserver as any;
  }

  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }
}
