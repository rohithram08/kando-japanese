import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Helpers ──────────────────────────────────────────────
function getSystemPreference() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function resolve(theme) {
  return theme === 'system' ? getSystemPreference() : theme
}

function applyTheme(resolved, theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  // Apply / remove dark class (this is what every `dark:` Tailwind class hooks into)
  root.classList.toggle('dark', resolved === 'dark')

  // Keep data attributes in sync (useful for CSS selectors / debugging)
  root.setAttribute('data-theme', resolved)
  root.setAttribute('data-theme-setting', theme)

  // Update <meta name="theme-color"> dynamically so mobile browser chrome matches
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.content = resolved === 'dark' ? '#0b1120' : '#ffffff'
  }

  // Update color-scheme for native browser UI (scrollbars, inputs, etc.)
  root.style.colorScheme = resolved
}

// ── Store ─────────────────────────────────────────────────
// theme: the user's chosen *setting* — 'light' | 'dark' | 'system'
// resolvedTheme: the *actual* theme being shown right now — always 'light' | 'dark'
// Both are plain fields (never getters) so they survive Zustand's
// Object.assign-based set() merges and never go stale.
export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      resolvedTheme: 'light',
      isDark: false,

      /** Set theme: 'light' | 'dark' | 'system' */
      setTheme: (theme) => {
        const resolved = resolve(theme)
        set({ theme, resolvedTheme: resolved, isDark: resolved === 'dark' })
        applyTheme(resolved, theme)
      },

      /** Toggle between light ↔ dark (skips system) */
      toggleTheme: () => {
        const next = get().resolvedTheme === 'dark' ? 'light' : 'dark'
        set({ theme: next, resolvedTheme: next, isDark: next === 'dark' })
        applyTheme(next, next)
      },

      /**
       * Called once on app boot in main.jsx.
       * Reads the persisted setting (defaulting to 'light' for first-ever visits)
       * and applies it before React paints, so there's no flash of the wrong theme.
       */
      initTheme: () => {
        const { theme } = get()
        const resolved = resolve(theme)
        set({ resolvedTheme: resolved, isDark: resolved === 'dark' })
        applyTheme(resolved, theme)

        // Keep in sync if the user later changes their OS-level preference
        // while "System" is selected.
        if (typeof window !== 'undefined') {
          window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
              if (get().theme === 'system') {
                const next = e.matches ? 'dark' : 'light'
                set({ resolvedTheme: next, isDark: next === 'dark' })
                applyTheme(next, 'system')
              }
            })
        }
      },
    }),
    {
      name: 'nihongo-theme',
      // Only persist the user's chosen setting — resolvedTheme/isDark are
      // always recomputed at boot via initTheme().
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
