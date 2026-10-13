import React, { useState } from 'react'
import { motion } from 'framer-motion'
import AudioButton from '../common/AudioButton'
import TranslatedText from '../common/TranslatedText'
import { useSettingsStore } from '../../store/settingsStore'
import { useTranslatedText } from '../../hooks/useTranslatedText'

export default function GrammarCard({ grammar, lang, index }) {
  const [activeExample, setActiveExample] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const showTranslation = useSettingsStore((s) => s.showTranslation)

  // Curated, human-written content for english/tamil/hindi.
  const curatedMeaning = { english: grammar.meaning_en, tamil: grammar.meaning_ta || grammar.meaning_en, hindi: grammar.meaning_hi || grammar.meaning_en }[lang]
  const curatedExplanation = { english: grammar.explanation_en, tamil: grammar.explanation_ta || grammar.explanation_en, hindi: grammar.explanation_hi || grammar.explanation_en }[lang]

  // Live translation, only actually used when there's no curated content
  // for this language (the hook is a cheap no-op for 'english').
  const { text: liveMeaning, loading: meaningLoading, isMachineTranslated } =
    useTranslatedText(grammar.meaning_en, curatedMeaning ? 'english' : lang)
  const { text: liveExplanation, loading: explanationLoading } =
    useTranslatedText(grammar.explanation_en, curatedExplanation ? 'english' : lang)

  const displayMeaning = curatedMeaning || liveMeaning
  const displayExplanation = curatedExplanation || liveExplanation

  const examples = grammar.examples || []
  const currentExample = examples[activeExample]
  // Grammar examples have curated ta/hi translations (unlike vocab
  // examples, which have none) — use those directly when available.
  const curatedExampleTranslation = currentExample
    ? { english: currentExample.en, tamil: currentExample.ta || currentExample.en, hindi: currentExample.hi || currentExample.en }[lang]
    : undefined

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border border-gray-100 rounded-2xl overflow-hidden"
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
                meaningLoading ? (
                  <span className="inline-block h-[1em] w-32 rounded bg-muted animate-pulse align-middle" />
                ) : (
                  <>
                    {displayMeaning}
                    {isMachineTranslated && (
                      <span
                        title="Translated live via machine translation, not hand-written"
                        className="ml-1.5 text-[9px] font-bold px-1 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 align-middle"
                      >
                        live
                      </span>
                    )}
                  </>
                )
              ) : (
                <button
                  onClick={() => setRevealed(true)}
                  className="italic text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  Tap to reveal translation
                </button>
              )}
            </p>
          </div>
          <span className="text-xs bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full
                           font-medium whitespace-nowrap">
            {grammar.jlpt_level}
          </span>
        </div>

        {/* Structure */}
        {grammar.structure && (
          <div className="mt-3 bg-white/60 dark:bg-gray-900/40 rounded-xl p-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Structure
            </p>
            <code className="text-sm text-foreground/80">{grammar.structure}</code>
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="p-4">
        {displayExplanation && (showTranslation || revealed) && (
          <div className="bg-yellow-50 dark:bg-yellow-500/5 border border-yellow-100 dark:border-yellow-500/10 rounded-xl p-3 mb-4">
            <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase mb-1">
              💡 Explanation
            </p>
            {explanationLoading ? (
              <span className="inline-block h-[1em] w-48 rounded bg-yellow-100 dark:bg-yellow-500/10 animate-pulse" />
            ) : (
              <p className="text-sm text-foreground/80">{displayExplanation}</p>
            )}
          </div>
        )}

        {/* Examples */}
        {examples.length > 0 && (
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase mb-2">
              Examples
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
                    {curatedExampleTranslation || (
                      <TranslatedText text={currentExample.en} lang={lang} />
                    )}
                  </p>
                ) : (
                  <button
                    onClick={() => setRevealed(true)}
                    className="text-sm italic text-muted-foreground/50 hover:text-muted-foreground border-t border-border pt-2 w-full text-left transition-colors"
                  >
                    Tap to reveal translation
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