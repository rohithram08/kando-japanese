// src/components/grammar/ParticleStudio.jsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Volume2,
  ArrowRight,
  BookOpen,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Languages,
} from 'lucide-react'
import { audioService } from '../../services/audioService'
import { playClick } from '../../utils/soundEffects'

const PARTICLE_DATA = [
  {
    id: 'wa',
    particle: 'は',
    romaji: 'wa',
    role: 'Topic Marker ("As for...")',
    tamil: 'தான் / பொறுத்தவரை (-dhaan / poruthavarai)',
    hindi: 'तो / के बारे में (-to / ke baare mein)',
    english: 'Topic marker ("Speaking of X", "As for X")',
    exampleJp: '私 は 学生 です。',
    exampleRomaji: 'Watashi wa gakusei desu.',
    exampleTa: 'நான் தான் மாணவன்। (என்னை பொறுத்தவரை மாணவன்)',
    exampleHi: 'मैं तो छात्र हूँ। (मेरे बारे में कहें तो विद्यार्थी हूँ)',
    exampleEn: 'I am a student. (As for me, I am a student)',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'ga',
    particle: 'が',
    romaji: 'ga',
    role: 'Subject Marker (Specific focus / Agent)',
    tamil: 'எழுவாய் உருபு (தான் / Subject focus)',
    hindi: 'कर्ता कारक (ने / Subject identifier)',
    english: 'Subject identifier (specifies who or what performs the action/state)',
    exampleJp: '猫 が います。',
    exampleRomaji: 'Neko ga imasu.',
    exampleTa: 'பூனை இருக்கிறது। (பூனை தான் அங்கே உள்ளது)',
    exampleHi: 'बिल्ली है। (बिल्ली मौजूद है)',
    exampleEn: 'There is a cat. (The cat is the one that exists)',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'o',
    particle: 'を',
    romaji: 'wo / o',
    role: 'Direct Object Marker',
    tamil: 'இரண்டாம் வேற்றுமை: -ஐ (-ai)',
    hindi: 'कर्म कारक: को (ko)',
    english: 'Direct Object marker (the thing affected by the transitive verb)',
    exampleJp: '本 を 読みます。',
    exampleRomaji: 'Hon o yomimasu.',
    exampleTa: 'புத்தகத்தை [புத்தகம் + ஐ] படிக்கிறேன்।',
    exampleHi: 'किताब को पढ़ता हूँ।',
    exampleEn: 'I read a book.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'ni',
    particle: 'に',
    romaji: 'ni',
    role: 'Destination / Specific Time / Indirect Object',
    tamil: 'நான்காம்/ஏழாம் வேற்றுமை: -க்கு (-kku) / -இல் (-il)',
    hindi: 'संप्रदान/अधिकरण कारक: को (ko) / में (mein) / पर (par)',
    english: 'Target, destination, or specific point in time ("at", "to", "on")',
    exampleJp: '学校 に 行きます。',
    exampleRomaji: 'Gakkou ni ikimasu.',
    exampleTa: 'பள்ளிக்கு [பள்ளி + க்கு] போகிறேன்।',
    exampleHi: 'स्कूल को [स्कूल] जाता हूँ।',
    exampleEn: 'I go to school.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'de',
    particle: 'で',
    romaji: 'de',
    role: 'Location of Action / Means / Tool',
    tamil: 'மூன்றாம்/ஏழாம் வேற்றுமை: -ஆல் (-aal) / -இல் (-il)',
    hindi: 'करण/अधिकरण कारक: से (se) / में (mein)',
    english: 'Action location or tool/method ("at [doing something]", "by", "with")',
    exampleJp: '図書館 で 勉強します。',
    exampleRomaji: 'Toshokan de benkyou shimasu.',
    exampleTa: 'நூலகத்தில் [நூலகம் + இல்] படிக்கிறேன்।',
    exampleHi: 'पुस्तकालय में पढ़ाई करता हूँ।',
    exampleEn: 'I study at the library.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'kara',
    particle: 'から',
    romaji: 'kara',
    role: 'Starting Point / Origin / "From"',
    tamil: 'ஐந்தாம் வேற்றுமை: -இருந்து (-irundhu)',
    hindi: 'अपादान कारक: से (se / "from")',
    english: 'Starting point in time or location ("from", "since")',
    exampleJp: '東京 から 来ました。',
    exampleRomaji: 'Toukyou kara kimashita.',
    exampleTa: 'டோக்கியோவிலிருந்து [டோக்கியோ + இருந்து] வந்தேன்।',
    exampleHi: 'टोक्यो से आया हूँ।',
    exampleEn: 'I came from Tokyo.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'made',
    particle: 'まで',
    romaji: 'made',
    role: 'Ending Point / "Until / To"',
    tamil: 'எல்லை உருபு: -வரை (-varai)',
    hindi: 'सीमा कारक: तक (tak)',
    english: 'End point in time or space ("until", "up to", "as far as")',
    exampleJp: '5時 まで 働きます。',
    exampleRomaji: 'Goji made hatarakimasu.',
    exampleTa: '5 மணி வரை [மணி + வரை] வேலை செய்கிறேன்।',
    exampleHi: '5 बजे तक काम करता हूँ।',
    exampleEn: 'I work until 5 o\'clock.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'no',
    particle: 'の',
    romaji: 'no',
    role: 'Possessive / Modifier ("\'s", "of")',
    tamil: 'ஆறாம் வேற்றுமை: -உடைய (-udaiya) / -இன் (-in)',
    hindi: 'संबंध कारक: का / के / की (ka / ke / ki)',
    english: 'Indicates possession or modifies a noun ("of", "\'s")',
    exampleJp: '私 の 友達 です。',
    exampleRomaji: 'Watashi no tomodachi desu.',
    exampleTa: 'என்னுடைய [நான் + உடைய] நண்பன்।',
    exampleHi: 'मेरा [मैं + का] दोस्त है।',
    exampleEn: 'This is my friend.',
    color: 'from-fuchsia-500 to-rose-600',
  },
  {
    id: 'to',
    particle: 'と',
    romaji: 'to',
    role: 'Comitative ("With") / Exhaustive "And"',
    tamil: 'இணைப்பு உருபு: -உடன் (-udan) / மற்றும் (matrum)',
    hindi: 'साथी कारक: के साथ (ke saath) / और (aur)',
    english: 'Indicates companionship ("with") or lists nouns completely ("and")',
    exampleJp: '友達 と 話します。',
    exampleRomaji: 'Tomodachi to hanashimasu.',
    exampleTa: 'நண்பனுடன் [நண்பன் + உடன்] பேசுகிறேன்।',
    exampleHi: 'दोस्त के साथ बात करता हूँ।',
    exampleEn: 'I speak with my friend.',
    color: 'from-teal-500 to-emerald-600',
  },
]

const SOV_COMPARISON = {
  japanese: [
    { word: '私', tag: 'Noun (I)' },
    { particle: 'は', tag: 'Topic (தான் / तो)' },
    { word: '図書館', tag: 'Noun (Library)' },
    { particle: 'で', tag: 'Place (இல் / में)' },
    { word: '日本語', tag: 'Noun (Japanese)' },
    { particle: 'を', tag: 'Object (ஐ / को)' },
    { word: '勉強します', tag: 'Verb (Study)' },
  ],
  tamil: [
    { word: 'நான்', tag: 'Subject' },
    { particle: 'தான்', tag: 'Topic' },
    { word: 'நூலகத்', tag: 'Noun' },
    { particle: 'தில்', tag: 'Locative (-இல்)' },
    { word: 'ஜப்பானிய மொழி', tag: 'Noun' },
    { particle: 'யை', tag: 'Accusative (-ஐ)' },
    { word: 'படிக்கிறேன்', tag: 'Verb' },
  ],
  hindi: [
    { word: 'मैं', tag: 'Subject' },
    { particle: 'तो', tag: 'Topic' },
    { word: 'पुस्तकालय', tag: 'Noun' },
    { particle: 'में', tag: 'Locative (में)' },
    { word: 'जापानी भाषा', tag: 'Noun' },
    { particle: 'को', tag: 'Accusative (को)' },
    { word: 'पढ़ता हूँ', tag: 'Verb' },
  ],
  english: [
    { word: 'I', tag: 'Subject' },
    { word: 'study', tag: 'Verb' },
    { word: 'Japanese', tag: 'Object' },
    { particle: 'at', tag: 'Preposition' },
    { word: 'the library', tag: 'Location' },
  ],
}

const QUIZ_QUESTIONS = [
  {
    promptTa: 'நான் பள்ளிக்கு [__] போகிறேன்। (Target / Destination)',
    promptHi: 'मैं स्कूल [__] जाता हूँ। (Target / Destination)',
    jpSentence: '私 は 学校 [ ? ] 行きます。',
    correct: 'に',
    options: ['に', 'で', 'を', 'は'],
    explanation:
      'Destination takes に (ni). Tamil uses -க்கு (-kku: பள்ளிக்கு) and Hindi uses को (ko).',
  },
  {
    promptTa: 'நான் புத்தகத்தை [__] படிக்கிறேன்। (Direct Object)',
    promptHi: 'मैं किताब [__] पढ़ता हूँ। (Direct Object)',
    jpSentence: '私 は 本 [ ? ] 読みます。',
    correct: 'を',
    options: ['を', 'で', 'に', 'が'],
    explanation:
      'Direct object takes を (o/wo). Tamil uses -ஐ (-ai: புத்தகத்தை) and Hindi uses को (ko).',
  },
  {
    promptTa: 'பேனாவால் [__] எழுதுகிறேன்। (Tool / Instrument)',
    promptHi: 'पेन [__] लिखता हूँ। (Tool / Instrument)',
    jpSentence: 'ペン [ ? ] 書きます。',
    correct: 'で',
    options: ['で', 'に', 'を', 'から'],
    explanation:
      'Tool or instrument takes で (de). Tamil uses -ஆல் (-aal: பேனாவால்) and Hindi uses से (se).',
  },
  {
    promptTa: 'டோக்கியோவிலிருந்து [__] வந்தேன்। (Starting Point)',
    promptHi: 'टोक्यो [__] आया हूँ। (Starting Point)',
    jpSentence: '東京 [ ? ] 来ました。',
    correct: 'から',
    options: ['から', 'まで', 'で', 'に'],
    explanation:
      'Starting point takes から (kara: "from"). Tamil uses -இருந்து (-irundhu) and Hindi uses से (se).',
  },
]

export default function ParticleStudio() {
  const [activeTab, setActiveTab] = useState('matrix') // 'matrix' | 'sov' | 'quiz'
  const [selectedParticle, setSelectedParticle] = useState(PARTICLE_DATA[0])
  const [quizIndex, setQuizIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)

  const handleSpeak = (text) => {
    audioService.speak(text).catch(() => {})
  }

  const handleOptionClick = (opt) => {
    if (selectedOption !== null) return
    playClick()
    setSelectedOption(opt)
    if (opt === QUIZ_QUESTIONS[quizIndex].correct) {
      setQuizScore((s) => s + 1)
    }
  }

  const handleNextQuestion = () => {
    playClick()
    if (quizIndex + 1 < QUIZ_QUESTIONS.length) {
      setQuizIndex((i) => i + 1)
      setSelectedOption(null)
    } else {
      setQuizFinished(true)
    }
  }

  const resetQuiz = () => {
    playClick()
    setQuizIndex(0)
    setSelectedOption(null)
    setQuizScore(0)
    setQuizFinished(false)
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase bg-primary/10 text-primary">
              Exclusive Pedagogy
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Languages className="w-3.5 h-3.5" />
              <span>Japanese • Tamil • Hindi Isomorphism</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground mt-1 flex items-center gap-2">
            <span>助詞パラレル道場</span>
            <span className="text-muted-foreground font-normal text-sm hidden sm:inline">
              (Particle Parallelism Studio)
            </span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Japanese, Tamil, and Hindi share identical SOV sentence order and postpositional case markers!
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-muted/60 p-1 rounded-xl text-xs font-semibold gap-1 shrink-0">
          <button
            onClick={() => { playClick(); setActiveTab('matrix'); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'matrix'
                ? 'bg-surface text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Particle Matrix
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('sov'); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'sov'
                ? 'bg-surface text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            SOV Parallelism
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('quiz'); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'quiz'
                ? 'bg-surface text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Practice Quiz
          </button>
        </div>
      </div>

      {/* ── TAB 1: PARTICLE MATRIX ── */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Particle Selector Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {PARTICLE_DATA.map((p) => {
              const isSelected = selectedParticle.id === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => { playClick(); setSelectedParticle(p); }}
                  className={`flex flex-col items-center justify-center min-w-[56px] h-14 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary shadow-xs scale-105 font-bold'
                      : 'border-border bg-surface text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                  }`}
                >
                  <span className="text-lg font-japanese">{p.particle}</span>
                  <span className="text-[10px] uppercase font-mono">{p.romaji}</span>
                </button>
              )
            })}
          </div>

          {/* Active Particle Detail Card */}
          <motion.div
            key={selectedParticle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-gradient-to-br from-surface to-muted/20 p-5 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black font-japanese text-primary">
                    {selectedParticle.particle}
                  </span>
                  <div>
                    <span className="text-sm font-bold text-foreground">
                      {selectedParticle.role}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Romaji: <code className="font-mono text-primary font-bold">{selectedParticle.romaji}</code>
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSpeak(selectedParticle.exampleJp)}
                className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                title="Listen to Japanese pronunciation"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Isomorphism breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="bg-surface/80 border border-border/80 rounded-xl p-3.5 space-y-1">
                <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wide">
                  Tamil Equivalent (வேற்றுமை)
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {selectedParticle.tamil}
                </p>
                <p className="text-xs text-muted-foreground font-serif">
                  {selectedParticle.exampleTa}
                </p>
              </div>

              <div className="bg-surface/80 border border-border/80 rounded-xl p-3.5 space-y-1">
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wide">
                  Hindi Equivalent (कारक)
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {selectedParticle.hindi}
                </p>
                <p className="text-xs text-muted-foreground font-serif">
                  {selectedParticle.exampleHi}
                </p>
              </div>
            </div>

            {/* Japanese example sentence */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">
                  Natural Japanese Usage
                </p>
                <p className="text-base font-bold text-foreground font-japanese">
                  {selectedParticle.exampleJp}
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {selectedParticle.exampleRomaji}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedParticle.exampleEn}
                </p>
              </div>
              <button
                onClick={() => handleSpeak(selectedParticle.exampleJp)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Play Audio
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── TAB 2: SOV PARALLELISM ── */}
      {activeTab === 'sov' && (
        <div className="space-y-6">
          <div className="bg-muted/40 rounded-xl p-4 border border-border text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Why English learners struggle with Japanese:</strong> English uses{' '}
            <code className="text-primary font-bold">Subject - Verb - Object (SVO)</code> with prepositions placed <em>before</em> nouns.
            Japanese, Tamil, and Hindi use{' '}
            <code className="text-primary font-bold">Subject - Object - Verb (SOV)</code> with postpositions attached <em>after</em> nouns.
            Notice below how Japanese, Tamil, and Hindi follow the <strong>exact same word order token-for-token</strong>!
          </div>

          <div className="space-y-4">
            {/* Japanese */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Japanese (SOV + Postpositions)
                </span>
                <button
                  onClick={() => handleSpeak('私は図書館で日本語を勉強します')}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Audio
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SOV_COMPARISON.japanese.map((tok, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2 rounded-lg border text-center ${
                      tok.particle
                        ? 'bg-primary text-white border-primary font-bold'
                        : 'bg-surface border-border text-foreground'
                    }`}
                  >
                    <span className="text-base block font-japanese">{tok.word || tok.particle}</span>
                    <span className="text-[10px] block opacity-80 font-mono mt-0.5">{tok.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tamil */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-2">
                Tamil (SOV + Postpositional வேற்றுமை உருபுகள்)
              </span>
              <div className="flex flex-wrap gap-2">
                {SOV_COMPARISON.tamil.map((tok, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2 rounded-lg border text-center ${
                      tok.particle
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                        : 'bg-surface border-border text-foreground'
                    }`}
                  >
                    <span className="text-base block font-serif">{tok.word || tok.particle}</span>
                    <span className="text-[10px] block opacity-80 font-mono mt-0.5">{tok.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hindi */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-2">
                Hindi (SOV + Postpositional कारक / परसर्ग)
              </span>
              <div className="flex flex-wrap gap-2">
                {SOV_COMPARISON.hindi.map((tok, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2 rounded-lg border text-center ${
                      tok.particle
                        ? 'bg-amber-600 text-white border-amber-600 font-bold'
                        : 'bg-surface border-border text-foreground'
                    }`}
                  >
                    <span className="text-base block font-serif">{tok.word || tok.particle}</span>
                    <span className="text-[10px] block opacity-80 font-mono mt-0.5">{tok.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* English Inverted Contrast */}
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                English (SVO + Prepositions) — Inverted Order
              </span>
              <div className="flex flex-wrap gap-2">
                {SOV_COMPARISON.english.map((tok, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2 rounded-lg border text-center ${
                      tok.particle
                        ? 'bg-muted-foreground/30 border-muted-foreground/50 text-foreground font-semibold'
                        : 'bg-surface border-border text-foreground'
                    }`}
                  >
                    <span className="text-sm block">{tok.word || tok.particle}</span>
                    <span className="text-[10px] block opacity-60 font-mono mt-0.5">{tok.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: PRACTICE QUIZ ── */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {!quizFinished ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <span>Score: {quizScore}</span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
                <div className="space-y-2">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3.5 py-2">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide block">
                      Tamil Prompt
                    </span>
                    <p className="text-sm font-semibold text-foreground font-serif">
                      {QUIZ_QUESTIONS[quizIndex].promptTa}
                    </p>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3.5 py-2">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide block">
                      Hindi Prompt
                    </span>
                    <p className="text-sm font-semibold text-foreground font-serif">
                      {QUIZ_QUESTIONS[quizIndex].promptHi}
                    </p>
                  </div>
                </div>

                <div className="py-2 text-center">
                  <span className="text-xs text-muted-foreground block mb-1">
                    Complete the Japanese sentence:
                  </span>
                  <p className="text-xl font-bold font-japanese text-foreground tracking-wide">
                    {QUIZ_QUESTIONS[quizIndex].jpSentence}
                  </p>
                </div>

                {/* Option buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {QUIZ_QUESTIONS[quizIndex].options.map((opt) => {
                    const isSelected = selectedOption === opt
                    const isCorrect = opt === QUIZ_QUESTIONS[quizIndex].correct
                    let btnStyle = 'border-border bg-muted/30 hover:border-primary/50 text-foreground'

                    if (selectedOption !== null) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold'
                      } else if (isSelected) {
                        btnStyle = 'border-red-500 bg-red-500/20 text-red-500 font-bold'
                      } else {
                        btnStyle = 'opacity-40 border-border bg-muted/10 text-muted-foreground'
                      }
                    }

                    return (
                      <button
                        key={opt}
                        disabled={selectedOption !== null}
                        onClick={() => handleOptionClick(opt)}
                        className={`h-14 rounded-xl border text-xl font-bold font-japanese transition-all ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>

                {/* Explanation feedback */}
                <AnimatePresence>
                  {selectedOption !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-2 border-t border-border space-y-3"
                    >
                      <p className="text-xs text-foreground/80 leading-relaxed bg-muted/40 p-3 rounded-xl border border-border">
                        💡 {QUIZ_QUESTIONS[quizIndex].explanation}
                      </p>
                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                      >
                        <span>{quizIndex + 1 < QUIZ_QUESTIONS.length ? 'Next Question' : 'View Results'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* Quiz Results */
            <div className="rounded-2xl border border-border bg-surface p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-xl font-bold text-foreground">Dojo Quiz Completed!</h3>
              <p className="text-sm text-muted-foreground">
                You scored <strong className="text-foreground">{quizScore}</strong> out of{' '}
                <strong className="text-foreground">{QUIZ_QUESTIONS.length}</strong> on Particle Isomorphism.
              </p>
              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <RotateCcw className="w-4 h-4" />
                Practice Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
