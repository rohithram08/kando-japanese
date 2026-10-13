// src/data/levels.js
// ─────────────────────────────────────────────────────────────
// Lightweight level metadata (colors, labels, descriptions)
// Extracted to decouple layout & navigation components from
// the multi-megabyte grammar, kanji, and vocabulary datasets.
// ─────────────────────────────────────────────────────────────

export const LEVEL_META = {
  N5: {
    color:       'green',
    label:       'N5 – Beginner',
    description: 'Basic everyday expressions and simple sentences.',
    darkBg:      'bg-green-500/15',
    darkBorder:  'border-green-500/30',
    darkText:    'text-green-400',
    lightBg:     'bg-green-100',
    lightBorder: 'border-green-200',
    lightText:   'text-green-700',
    gradient:    'from-green-500 to-emerald-500',
  },
  N4: {
    color:       'blue',
    label:       'N4 – Elementary',
    description: 'Basic Japanese used in everyday situations.',
    darkBg:      'bg-blue-500/15',
    darkBorder:  'border-blue-500/30',
    darkText:    'text-blue-400',
    lightBg:     'bg-blue-100',
    lightBorder: 'border-blue-200',
    lightText:   'text-blue-700',
    gradient:    'from-blue-500 to-cyan-500',
  },
  N3: {
    color:       'yellow',
    label:       'N3 – Intermediate',
    description: 'Japanese in a broad range of everyday situations.',
    darkBg:      'bg-yellow-500/15',
    darkBorder:  'border-yellow-500/30',
    darkText:    'text-yellow-400',
    lightBg:     'bg-yellow-100',
    lightBorder: 'border-yellow-200',
    lightText:   'text-yellow-700',
    gradient:    'from-yellow-500 to-orange-400',
  },
  N2: {
    color:       'orange',
    label:       'N2 – Upper Intermediate',
    description: 'Japanese used in a wide range of topics.',
    darkBg:      'bg-orange-500/15',
    darkBorder:  'border-orange-500/30',
    darkText:    'text-orange-400',
    lightBg:     'bg-orange-100',
    lightBorder: 'border-orange-200',
    lightText:   'text-orange-700',
    gradient:    'from-orange-500 to-red-400',
  },
  N1: {
    color:       'red',
    label:       'N1 – Advanced',
    description: 'Japanese in a wide variety of circumstances.',
    darkBg:      'bg-red-500/15',
    darkBorder:  'border-red-500/30',
    darkText:    'text-red-400',
    lightBg:     'bg-red-100',
    lightBorder: 'border-red-200',
    lightText:   'text-red-700',
    gradient:    'from-red-500 to-rose-500',
  },
}

export const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']
