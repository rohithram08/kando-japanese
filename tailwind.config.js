/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Semantic design tokens, wired to the CSS variables defined in
        //    src/index.css (:root for light, .dark for dark). This is what
        //    lets components write `bg-surface text-foreground` etc. and
        //    have it adapt to the theme automatically — no isDark ternaries,
        //    no hardcoded hex values.
        border:   'hsl(var(--border) / <alpha-value>)',
        input:    'hsl(var(--input) / <alpha-value>)',
        ring:     'hsl(var(--ring) / <alpha-value>)',

        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',

        surface: {
          DEFAULT:    'hsl(var(--surface) / <alpha-value>)',
          foreground: 'hsl(var(--surface-foreground) / <alpha-value>)',
          muted:      'hsl(var(--surface-muted) / <alpha-value>)',
        },
        card: {
          DEFAULT:    'hsl(var(--surface) / <alpha-value>)',
          foreground: 'hsl(var(--surface-foreground) / <alpha-value>)',
        },

        primary: {
          DEFAULT:    'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        success: 'hsl(var(--success) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',

        // Japan-flag red used for hero gradients / brand marks — kept as a
        // literal (non-theme-reactive) accent since it's meant to always
        // read as "red" regardless of light/dark mode.
        japan: {
          red:    '#bc002d',
          sakura: '#ffb7c5',
          gold:   '#c9a84c',
        },
      },
      fontFamily: {
        sans:     ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        jp:       ['Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'sans-serif'],
        japanese: ['Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'sans-serif'],
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md': '0 4px 12px rgba(0,0,0,0.08)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.12)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
