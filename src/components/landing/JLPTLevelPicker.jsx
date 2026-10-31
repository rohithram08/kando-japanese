// src/components/landing/JLPTLevelPicker.jsx
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, ArrowRight, Compass, Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { playPop } from '../../utils/soundEffects'
import { triggerRateLimitedConfetti } from '../../utils/confettiHelper'

export const JLPT_DETAILS = [
  {
    level: 'N5',
    title: 'Beginner Foundations',
    kanji: '~100 Kanji',
    vocab: '~800 Words',
    badgeColor: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-500',
    description: 'Master Hiragana, Katakana, basic everyday phrases, and foundational sentence structures.',
    sampleSentence: {
      japanese: '毎朝七時に起きて、学校へ行きます。',
      furigana: '毎朝[まいあさ]七時[しちじ]に起[お]きて、学校[がっこう]へ行[い]きます。',
      translation: 'I wake up at 7:00 every morning and go to school.',
    },
    grammarKey: 'て-form sequencing, time particle に, directional へ',
  },
  {
    level: 'N4',
    title: 'Elementary Conversational',
    kanji: '~300 Kanji',
    vocab: '~1,500 Words',
    badgeColor: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    description: 'Handle daily interactions, navigate train stations, shops, and read straightforward graded stories.',
    sampleSentence: {
      japanese: '京都駅に着いた時、少し心配になりました。',
      furigana: '京都駅[きょうとえき]に着[つ]いた時[とき]、少[すこ]し心配[しんぱい]になりました。',
      translation: 'When I arrived at Kyoto Station, I became a little worried.',
    },
    grammarKey: 'Temporal 〜た時, state change 〜になる, trial 〜てみる',
  },
  {
    level: 'N3',
    title: 'Intermediate Bridging',
    kanji: '~650 Kanji',
    vocab: '~3,750 Words',
    badgeColor: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-500',
    description: 'Bridge textbook learning to natural Japanese with conversational fluency and contextual reading.',
    sampleSentence: {
      japanese: '日本の文化についてもっと深く理解したいです。',
      furigana: '日本[にほん]の文化[ぶんか]についてもっと思[おも]う存分[ぞんぶん]理解[りかい]したいです。',
      translation: 'I want to understand Japanese culture much more deeply.',
    },
    grammarKey: '〜について, complex conjunctions, conditional 〜なら',
  },
  {
    level: 'N2',
    title: 'Advanced Fluency',
    kanji: '~1,000 Kanji',
    vocab: '~6,000 Words',
    badgeColor: 'from-orange-500 to-rose-600',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    description: 'Read news articles, understand workplace nuances, and converse comfortably in professional settings.',
    sampleSentence: {
      japanese: 'プロジェクトの進捗に応じて計画を見直す必要があります。',
      furigana: 'プロジェクトの進捗[しんちょく]に応[おう]じて計画[けいかく]を見直[みなお]す必要[ひつよう]があります。',
      translation: 'It is necessary to review the plan in accordance with project progress.',
    },
    grammarKey: '〜に応じて, business keigo, formal conjunctions',
  },
  {
    level: 'N1',
    title: 'Mastery & Nuance',
    kanji: '2,000+ Kanji',
    vocab: '10,000+ Words',
    badgeColor: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    description: 'Grasp subtle nuances, sophisticated literature, abstract discourse, and high-level debate.',
    sampleSentence: {
      japanese: '言葉の持つ多様な響きを味わいながら対話を深めます。',
      furigana: '言葉[ことば]の持[も]つ多様[たよう]な響[ひび]きを味[あじ]わいながら対話[たいわ]を深[ふか]めます。',
      translation: 'We deepen dialogue while appreciating the diverse resonances of language.',
    },
    grammarKey: 'Nuanced literary forms, idiomatic expressions',
  },
]

export default function JLPTLevelPicker({
  selectedLevel,
  onSelectLevel,
  speakJapanese,
  isPlayingAudio,
}) {
  const navigate = useNavigate()
  const activeLevelData =
    JLPT_DETAILS.find((d) => d.level === selectedLevel) || JLPT_DETAILS[0]

  const handleCardClick = (level) => {
    playPop()
    onSelectLevel(level)
  }

  const handleStartJourney = () => {
    playPop()
    triggerRateLimitedConfetti()
    navigate('/register')
  }

  return (
    <section id="curriculum" className="py-16 md:py-24 bg-surface/40 border-y border-border">
      <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20">
            <Compass className="w-3.5 h-3.5" />
            <span>Structured Progression</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Designed for Every Step of Your Journey
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-3">
            Select your starting proficiency level to explore curriculum benchmarks, vocabulary goals,
            and authentic Japanese sentences.
          </p>
        </div>

        {/* Chunky 3D Level Selector Cards ("I want to learn..." pattern) */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center sm:text-left mb-3">
            I want to start at:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {JLPT_DETAILS.map((item) => {
              const isSelected = item.level === selectedLevel
              return (
                <motion.button
                  key={item.level}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ y: 2, scale: 0.98 }}
                  onClick={() => handleCardClick(item.level)}
                  aria-label={`Select JLPT level ${item.level} ${item.title}`}
                  className={`p-3.5 sm:p-4 rounded-2xl text-left border-2 border-b-4 transition-all duration-150 cursor-pointer relative shadow-sm ${
                    isSelected
                      ? 'bg-primary/10 border-primary border-b-primary shadow-md ring-2 ring-primary/20 text-primary'
                      : 'bg-surface border-border text-foreground hover:border-primary/50 hover:bg-surface/90'
                  }`}
                >
                  {/* Selected check badge */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  <div className="text-xl sm:text-2xl font-black font-jp mb-0.5">
                    {item.level}
                  </div>
                  <div className="text-xs font-bold truncate">
                    {item.title.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-1">
                    {item.kanji}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Active Level Detail Card with Smooth Transition */}
        <div className="card p-6 sm:p-8 rounded-3xl border border-border shadow-lg bg-surface max-w-4xl mx-auto overflow-hidden">
          <AnimatePresence>
            <motion.div
              key={activeLevelData.level}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            >
              {/* Level Summary */}
              <div className="md:col-span-5 flex flex-col items-start text-left border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-6">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-2xl font-black px-3 py-1 rounded-xl bg-gradient-to-r ${activeLevelData.badgeColor} text-white shadow-sm`}
                  >
                    {activeLevelData.level}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-lg text-foreground">
                      {activeLevelData.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activeLevelData.kanji}</span>
                      <span>•</span>
                      <span>{activeLevelData.vocab}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {activeLevelData.description}
                </p>

                <div className="w-full p-3 rounded-xl bg-muted/60 text-xs mb-4">
                  <span className="font-bold text-foreground">Key Focus: </span>
                  <span className="text-muted-foreground">
                    {activeLevelData.grammarKey}
                  </span>
                </div>

                {/* 3D Dynamic CTA Button */}
                <button
                  type="button"
                  onClick={handleStartJourney}
                  className="btn-3d-primary py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm"
                >
                  <span>Start {activeLevelData.level} Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Sample Sentence Card with Pronunciation Audio */}
              <div className="md:col-span-7 flex flex-col items-start text-left">
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Sample Level Sentence
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      speakJapanese(activeLevelData.sampleSentence.japanese)
                    }
                    disabled={isPlayingAudio}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                    title="Play Japanese pronunciation"
                    aria-label="Listen to sample sentence"
                  >
                    <Volume2
                      className={`w-3.5 h-3.5 ${
                        isPlayingAudio ? 'animate-bounce' : ''
                      }`}
                    />
                    <span>
                      {isPlayingAudio ? 'Playing...' : 'Listen Audio'}
                    </span>
                  </button>
                </div>

                <div className="w-full p-4 rounded-2xl bg-muted/40 border border-border/80">
                  <div
                    className="text-lg sm:text-xl font-bold text-foreground mb-2 leading-relaxed font-jp"
                    data-testid="sample-sentence"
                  >
                    {activeLevelData.sampleSentence.japanese}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground italic font-sans mb-3">
                    {activeLevelData.sampleSentence.translation}
                  </div>
                  <div className="text-[11px] text-muted-foreground/75 font-mono pt-2 border-t border-border/50">
                    Furigana: {activeLevelData.sampleSentence.furigana}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between w-full">
                  <Link
                    to="/reading"
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Read full graded stories in this level</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
