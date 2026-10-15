// src/components/common/AudioButton.jsx
import React, { useState } from 'react'
import { Volume2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { audioService } from '../../services/audioService'
import { useI18n } from '../../i18n'

export default function AudioButton({ text, lang = 'ja-JP', size = 'md', variant = 'default' }) {
  const [playing, setPlaying] = useState(false)
  const { t } = useI18n()

  const speak = (e) => {
    e.stopPropagation()
    if (!text) return
    audioService.speak(text, {
      lang,
      onStart: () => setPlaying(true),
      onEnd: () => setPlaying(false),
      onError: () => setPlaying(false),
    })
  }

  const sizeClasses = { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-10 h-10' }
  const iconSize = { sm: 12, md: 14, lg: 16 }

  if (variant === 'ghost') {
    return (
      <button onClick={speak} aria-label={t('reading.audio_listen', 'Listen')} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
        <Volume2 size={14} />
        <span>{t('reading.audio_listen', 'Listen')}</span>
      </button>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={speak}
      aria-label={t('reading.audio_listen', 'Listen')}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center
                  transition-colors flex-shrink-0 ${
        playing
          ? 'bg-blue-500 text-white'
          : 'bg-muted text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-500 dark:hover:text-blue-400'
      }`}
    >
      <Volume2 size={iconSize[size]} />
    </motion.button>
  )
}