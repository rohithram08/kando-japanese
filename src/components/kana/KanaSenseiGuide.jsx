import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Volume2,
  BookOpen,
} from 'lucide-react';
import { audioService } from '../../services/audioService';
import { CONFUSABLE_PAIRS } from '../../data/kana/kanaData';
import HanaSenseiCharacter2D from '../sensei/HanaSenseiCharacter2D';

export default function KanaSenseiGuide({ onStartQuiz: _onStartQuiz, onSelectScript: _onSelectScript }) {
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);

  const handleSpeak = (text) => {
    audioService.speak(text);
  };

  const currentPair = CONFUSABLE_PAIRS[selectedPairIndex];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-surface p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Sensei Avatar Badge */}
          <div className="relative shrink-0 flex items-center justify-center">
            <HanaSenseiCharacter2D
              state="greeting"
              size="sm"
              showStatusPill={false}
              interactive={true}
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                Hana-sensei&apos;s Kana Masterclass
              </h2>
              <button
                onClick={() => handleSpeak('こんにちは！ひらがなとカタカナをいっしょにべんきょうしましょう！')}
                className="p-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors"
                title="Hear Hana-sensei speak"
                aria-label="Hear Hana-sensei speak"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-foreground/85 leading-relaxed">
              &ldquo;Konnichiwa! Welcome to Japanese! Japanese writing starts with two 46-character phonetic alphabets.
              Every sound in Japanese can be spelled with either <strong>Hiragana</strong> or <strong>Katakana</strong>.&rdquo;
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-left">
              <div className="p-3.5 rounded-2xl bg-surface border border-border shadow-sm">
                <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">
                  ひらがな &bull; Hiragana (Smooth & Cursive)
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  Used for native Japanese words, grammar particles (は, を, に), verb endings (食べる), and furigana readings.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border shadow-sm">
                <span className="font-bold text-pink-600 dark:text-pink-400 block mb-1">
                  カタカナ &bull; Katakana (Sharp & Angular)
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  Used for loanwords from other languages (コーヒー coffee, カメラ camera), foreign names, onomatopoeia, and emphasis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confusing Pairs Cheat-Sheet */}
      <div className="p-6 rounded-3xl border border-border bg-surface space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              The Notorious Look-Alike Pairs
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hana-sensei&apos;s foolproof mnemonics for characters that confuse every beginner.
            </p>
          </div>
        </div>

        {/* Pair Pills */}
        <div className="flex flex-wrap gap-2">
          {CONFUSABLE_PAIRS.map((pair, idx) => (
            <button
              key={pair.title}
              onClick={() => setSelectedPairIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedPairIndex === idx
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-muted/50 border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span>{pair.title}</span>
            </button>
          ))}
        </div>

        {/* Active Pair Card */}
        {currentPair && (
          <motion.div
            key={currentPair.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl border border-purple-500/20 bg-purple-500/5 space-y-4"
          >
            {/* Giant side-by-side display */}
            <div className="flex items-center justify-center gap-8 py-2">
              {currentPair.chars.map((char, i) => (
                <div key={char} className="text-center group">
                  <span className="text-6xl font-japanese font-black text-foreground block group-hover:scale-105 transition-transform">
                    {char}
                  </span>
                  <span className="text-xs font-mono font-bold uppercase text-purple-600 dark:text-purple-400 mt-1 block">
                    {currentPair.romaji[i]}
                  </span>
                  <button
                    onClick={() => handleSpeak(char)}
                    className="mt-1 p-1 rounded-md text-muted-foreground hover:text-foreground"
                    title={`Hear ${char}`}
                  >
                    <Volume2 className="w-3.5 h-3.5 mx-auto" />
                  </button>
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div className="p-4 rounded-xl bg-surface border border-border space-y-1.5 text-xs">
              <span className="font-bold text-foreground block">
                How to tell them apart:
              </span>
              <p className="text-foreground/80 leading-relaxed">
                {currentPair.explanation}
              </p>
              <div className="pt-1.5 text-purple-600 dark:text-purple-400 font-semibold">
                &rarr; {currentPair.rule}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Recommended Beginner Roadmap */}
      <div className="p-6 rounded-3xl border border-border bg-surface space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          Recommended 4-Step Learning Path
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            {
              step: 'Step 1',
              title: 'Hiragana Vowels',
              desc: 'Master あ, い, う, え, お first. All Japanese sounds branch from these 5 vowels.',
            },
            {
              step: 'Step 2',
              title: 'Gojūon Consonants',
              desc: 'Learn K, S, T, N, H, M, Y, R, W rows. Practice with the character explorer.',
            },
            {
              step: 'Step 3',
              title: 'Voiced & Contracted',
              desc: 'Add ten-ten ゛ (dakuon) and maru ゜ (handakuon), then contracted pairs (きゃ, しゅ).',
            },
            {
              step: 'Step 4',
              title: 'Katakana Counterparts',
              desc: 'Map every Hiragana sound to its Katakana counterpart. Use quizzes to lock it in!',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-border bg-muted/20 space-y-1.5"
            >
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400">
                {item.step}
              </span>
              <h4 className="font-bold text-foreground text-sm">
                {item.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
