import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Globe, BookmarkPlus, Check } from 'lucide-react'
import { useSettingsStore } from '../../store/settingsStore'
import { useSRSStore } from '../../store/srsStore'
import { audioService } from '../../services/audioService'
import AudioButton from '../common/AudioButton'
import FuriganaText from '../common/FuriganaText'
import PitchContourVisualizer from '../pitch/PitchContourVisualizer'
import { getPitchAccent } from '../../data/pitch/pitchData'
import { getCurriculumMeaning, getCurriculumTranslation, normalizeLocale } from '../../i18n'


export default function VocabCard({ vocab, lang, index }) {
  const [expanded, setExpanded] = useState(false)
  const showTranslation = useSettingsStore((s) => s.showTranslation)
  const autoPlay = useSettingsStore((s) => s.autoPlay)
  const storeLang = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage)
  const activeLang = normalizeLocale(lang || storeLang)
  const { isCardInSRS, addCardToSRS } = useSRSStore()
  const inDeck = isCardInSRS(vocab?.id || vocab?.word)

  // Auto-play this word's pronunciation once when it first appears in the
  // lesson, if the real "Auto-Play Audio" study preference is on.
  useEffect(() => {
    if (autoPlay && vocab?.word) {
      const t = setTimeout(() => audioService.speak(vocab.word), 400)
      return () => clearTimeout(t)
    }
  }, [vocab?.word, autoPlay])

  const pitchInfo = getPitchAccent(vocab?.word, vocab?.reading)

  if (!vocab) return null

  const displayMeaning = getCurriculumMeaning(vocab, activeLang)
  const translationEntry = getCurriculumTranslation(vocab.id, activeLang)
  const exampleTranslation = translationEntry?.example || vocab.example?.en || vocab.example_sentence_en || ''

  const translations = [
    { label: '🇬🇧 English', value: getCurriculumMeaning(vocab, 'en') },
    { label: '🇮🇳 Tamil', value: getCurriculumTranslation(vocab.id, 'ta')?.meaning || vocab.meaning_ta },
    { label: '🇮🇳 Hindi', value: getCurriculumTranslation(vocab.id, 'hi')?.meaning || vocab.meaning_hi },
  ].filter(m => Boolean(m.value))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl overflow-hidden border transition-all duration-200 ${
        expanded
          ? 'border-red-200 bg-white shadow-lg shadow-red-500/5 dark:border-red-500/30 dark:bg-gray-800/80 dark:shadow-lg dark:shadow-red-500/5'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-gray-700'
      }`}
    >
      {/* Main row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-4 text-left transition-colors"
      >
        {/* Japanese word */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              <FuriganaText
                word={vocab.word}
                reading={vocab.reading}
                size="lg"
              />
            </div>
            {pitchInfo && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {pitchInfo.patternMeta?.label || pitchInfo.pattern} [{pitchInfo.dropPosition}]
              </span>
            )}
          </div>
          <p className="text-sm mt-0.5 text-muted-foreground">
            {showTranslation ? (
              <span>{displayMeaning}</span>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded(true) }}
                className="italic text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                Tap to reveal translation
              </button>
            )}
          </p>
        </div>

        {/* Right side badges & controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {vocab.part_of_speech && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline-block bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/15 dark:text-blue-400 dark:border dark:border-blue-500/20`}>
              {vocab.part_of_speech}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              addCardToSRS('vocabulary', vocab.id || vocab.word, vocab.word)
            }}
            title={inDeck ? 'In your SRS review deck' : 'Add to SRS review deck'}
            className={`px-2 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              inDeck
                ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                : 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-500/20 border border-purple-200 dark:border-purple-500/20'
            }`}
          >
            {inDeck ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden md:inline">In SRS</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ SRS</span>
              </>
            )}
          </button>
          <AudioButton text={vocab.word} lang="ja-JP" />
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>

      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`px-4 pb-4 border-t border-border`}>
              {/* Part of speech (mobile) */}
              {vocab.part_of_speech && (
                <div className="mt-3 sm:hidden">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/15 dark:text-blue-400 dark:border dark:border-blue-500/20`}>
                    {vocab.part_of_speech}
                  </span>
                </div>
              )}

              {/* Example sentence */}
              {vocab.example_sentence_jp && (
                <div className={`mt-3 rounded-xl p-3.5 bg-gray-50 border border-gray-100 dark:bg-gray-800/80 dark:border dark:border-gray-700`}>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground`}>
                    Example
                  </p>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm leading-relaxed text-foreground`}>
                        {vocab.example_sentence_jp}
                      </p>
                      {vocab.example_sentence_reading && (
                        <p className={`text-xs mt-1 text-muted-foreground`}>
                          {vocab.example_sentence_reading}
                        </p>
                      )}
                      {(exampleTranslation || vocab.example_sentence_en) && (
                        <p className="text-xs mt-1.5 pt-1.5 border-t text-muted-foreground border-border">
                          {exampleTranslation || vocab.example_sentence_en}
                        </p>
                      )}
                    </div>
                    <AudioButton
                      text={vocab.example_sentence_jp}
                      lang="ja-JP"
                      size="sm"
                    />
                  </div>
                </div>
              )}

              {/* Pitch Accent Contour */}
              <div className="mt-3">
                <p className="text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">
                  Tokyo Pitch Accent
                </p>
                <PitchContourVisualizer
                  word={vocab.word}
                  reading={vocab.reading}
                  showParticle={true}
                />
              </div>

              {/* Translations grid */}
              {translations.length > 1 && (
                <div className="mt-3">
                  <div className={`flex items-center gap-1.5 mb-2 text-muted-foreground`}>
                    <Globe className="w-3 h-3" />
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Translations
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {translations.map((meaning, i) => (
                      <div
                        key={i}
                        className={`rounded-lg p-2.5 text-xs bg-gray-50 border border-gray-100 dark:bg-gray-800/60 dark:border dark:border-gray-700/50`}
                      >
                        <span className="text-muted-foreground">
                          {meaning.label}
                        </span>
                        <p className={`mt-0.5 font-medium text-foreground/80`}>
                          {meaning.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* JLPT level tag if available */}
              {vocab.jlpt_level && (
                <div className={`mt-3 flex items-center gap-2 text-xs text-muted-foreground`}>
                  <span className={`px-2 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 dark:border dark:border-gray-700`}>
                    {vocab.jlpt_level}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}