// ─── Avatar collection – single source of truth ──────────
export const AVATARS = [
  { id: 'avatar-1',  emoji: '🥷', label: 'Ninja',       bg: 'from-gray-700 to-gray-900'     },
  { id: 'avatar-2',  emoji: '🎌', label: 'Japan Flag',  bg: 'from-red-400 to-red-600'        },
  { id: 'avatar-3',  emoji: '🌸', label: 'Sakura',      bg: 'from-pink-400 to-pink-600'      },
  { id: 'avatar-4',  emoji: '⛩️', label: 'Torii Gate',  bg: 'from-orange-400 to-red-500'     },
  { id: 'avatar-5',  emoji: '🐉', label: 'Dragon',      bg: 'from-green-500 to-emerald-700'  },
  { id: 'avatar-6',  emoji: '🗻', label: 'Mt. Fuji',    bg: 'from-blue-400 to-indigo-600'    },
  { id: 'avatar-7',  emoji: '🎎', label: 'Dolls',       bg: 'from-rose-400 to-rose-600'      },
  { id: 'avatar-8',  emoji: '🍣', label: 'Sushi',       bg: 'from-amber-400 to-orange-500'   },
  { id: 'avatar-9',  emoji: '🎋', label: 'Tanabata',    bg: 'from-emerald-400 to-teal-600'   },
  { id: 'avatar-10', emoji: '🏯', label: 'Castle',      bg: 'from-yellow-500 to-amber-600'   },
  { id: 'avatar-11', emoji: '🎐', label: 'Wind Chime',  bg: 'from-cyan-400 to-blue-500'      },
  { id: 'avatar-12', emoji: '🐱', label: 'Cat',         bg: 'from-violet-400 to-purple-600'  },
  { id: 'avatar-13', emoji: '👺', label: 'Tengu',       bg: 'from-red-600 to-red-800'        },
  { id: 'avatar-14', emoji: '🦊', label: 'Fox',         bg: 'from-orange-400 to-amber-500'   },
  { id: 'avatar-15', emoji: '🎴', label: 'Hanafuda',    bg: 'from-indigo-500 to-purple-700'  },
]

export const getAvatarPreset = (id) => AVATARS.find((a) => a.id === id) || null
