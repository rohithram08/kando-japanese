import React, { useState } from 'react'
import { motion } from 'framer-motion'
import AudioButton from '../common/AudioButton'
import { useSettingsStore } from '../../store/settingsStore'
import {
  getCurriculumMeaning,
  getCurriculumExplanation,
  getCurriculumTranslation,
  normalizeLocale,
  useI18n,
} from '../../i18n'

export default function GrammarCard({ grammar, lang, index }) {
  const [activeExample, setActiveExample] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const { t, locale } = useI18n()
  const showTranslation = useSettingsStore((s) => s.showTranslation)
  const storeLang = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage)
  const activeLang = normalizeLocale(lang || locale || storeLang)

  const displayMeaning = getCurriculumMeaning(grammar, activeLang)
  const displayExplanation = getCurriculumExplanation(grammar, activeLang)

  const examples = grammar.examples || []
  const currentExample = examples[activeExample]

  const translationEntry = getCurriculumTranslation(grammar.id, activeLang)
  const exampleTranslation =
    (translationEntry?.examples && translationEntry.examples[activeExample]) ||
    (activeLang === 'ta' ? currentExample?.ta : activeLang === 'hi' ? currentExample?.hi : currentExample?.en) ||
    currentExample?.en ||
    ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <code className="text-lg font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-900 px-3 py-1
                             rounded-lg border border-blue-100 dark:border-blue-500/20">
              {grammar.pattern}
            </code>
            <p className="text-sm text-muted-foreground mt-2">
              {showTranslation ? (
                <span>{displayMeaning}</span>
              ) : (
                <button
                  onClick={() => setRevealed(true)}
                  className="italic text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  {t('srs.tap_to_reveal', 'Tap to reveal translation')}
                </button>
              )}
            </p>
          </div>
          <span className="text-xs bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full
                           font-medium whitespace-nowrap">
            {grammar.jlpt_level || grammar.level}
          </span>
        </div>

        {/* Structure */}
        {(grammar.structure || grammar.formation) && (
          <div className="mt-3 bg-white/60 dark:bg-gray-900/40 rounded-xl p-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Structure
            </p>
            <code className="text-sm text-foreground/80">{grammar.structure || grammar.formation}</code>
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="p-4">
        {displayExplanation && (showTranslation || revealed) && (
          <div className="bg-yellow-50 dark:bg-yellow-500/5 border border-yellow-100 dark:border-yellow-500/10 rounded-xl p-3 mb-4">
            <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase mb-1">
              💡 {t('common.explanation', 'Explanation')}
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">{displayExplanation}</p>
          </div>
        )}

        {/* Examples */}
        {examples.length > 0 && (
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase mb-2">
              {t('common.examples', 'Examples')}
            </p>
            {/* Tab selector for multiple examples */}
            {examples.length > 1 && (
              <div className="flex gap-1 mb-3">
                {examples.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveExample(i)}
                    className={`w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                      activeExample === i
                        ? 'bg-blue-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Active Example */}
            {examples[activeExample] && (
              <motion.div
                key={activeExample}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-muted/60 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-lg font-medium text-foreground">
                    {examples[activeExample].jp}
                  </p>
                  <AudioButton
                    text={examples[activeExample].jp}
                    lang="ja-JP"
                  />
                </div>
                {examples[activeExample].reading && (
                  <p className="text-sm text-muted-foreground/70 mb-1">
                    {examples[activeExample].reading}
                  </p>
                )}
                {(showTranslation || revealed) ? (
                  <p className="text-sm text-muted-foreground border-t border-border pt-2">
                    {exampleTranslation}
                  </p>
                ) : (
                  <button
                    onClick={() => setRevealed(true)}
                    className="text-sm italic text-muted-foreground/50 hover:text-muted-foreground border-t border-border pt-2 w-full text-left transition-colors"
                  >
                    {t('srs.tap_to_reveal', 'Tap to reveal translation')}
                  </button>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Common Mistakes */}
        {grammar.common_mistakes && (
          <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3">
            <p className="text-xs font-bold text-red-600 uppercase mb-1">
              ⚠️ Common Mistakes
            </p>
            <p className="text-sm text-gray-700">{grammar.common_mistakes}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}