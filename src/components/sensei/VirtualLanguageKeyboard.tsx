import React, { useState } from 'react';
import { Delete, Space, X, Globe } from 'lucide-react';

export type KeyboardLanguage = 'ta' | 'hi' | 'ja' | 'es';

interface VirtualLanguageKeyboardProps {
  initialLanguage?: string;
  onInsertChar: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onClose: () => void;
}

const TAMIL_KEYS = {
  vowels: ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ', 'ஃ'],
  signs: ['்', 'ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ'],
  consonants: [
    'க', 'ங', 'ச', 'ஞ', 'ட', 'ண',
    'த', 'ந', 'ப', 'ம', 'ய', 'ர',
    'ல', 'வ', 'ழ', 'ள', 'ற', 'ன',
    'ஜ', 'ஷ', 'ஸ', 'ஹ', 'க்ஷ', 'ஸ்ரீ'
  ]
};

const HINDI_KEYS = {
  vowels: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'],
  matras: ['्', 'ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', 'ं', 'ः', 'ँ'],
  consonants: [
    'क', 'ख', 'ग', 'घ', 'ङ',
    'च', 'छ', 'ज', 'झ', 'ञ',
    'ट', 'ठ', 'ड', 'ढ', 'ण',
    'त', 'थ', 'द', 'ध', 'न',
    'प', 'फ', 'ब', 'भ', 'म',
    'य', 'र', 'ल', 'व',
    'श', 'ष', 'स', 'ह',
    'क्ष', 'त्र', 'ज्ञ'
  ]
};

const JAPANESE_HIRAGANA = [
  'あ', 'い', 'う', 'え', 'お',
  'か', 'き', 'く', 'け', 'こ',
  'さ', 'し', 'す', 'せ', 'そ',
  'た', 'ち', 'つ', 'て', 'と',
  'な', 'に', 'ぬ', 'ね', 'の',
  'は', 'ひ', 'ふ', 'へ', 'ほ',
  'ま', 'み', 'む', 'め', 'も',
  'や', 'ゆ', 'よ', 'わ', 'を',
  'ら', 'り', 'る', 'れ', 'ろ', 'ん',
  'が', 'ぎ', 'ぐ', 'げ', 'ご',
  'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
  'だ', 'ぢ', 'づ', 'で', 'ど',
  'ば', 'び', 'ぶ', 'べ', 'ぼ',
  'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ',
  'っ', 'ゃ', 'ゅ', 'ょ'
];

const JAPANESE_KATAKANA = [
  'ア', 'イ', 'ウ', 'エ', 'オ',
  'カ', 'キ', 'ク', 'ケ', 'コ',
  'サ', 'シ', 'ス', 'セ', 'ソ',
  'タ', 'チ', 'ツ', 'テ', 'ト',
  'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
  'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
  'マ', 'ミ', 'ム', 'メ', 'モ',
  'ヤ', 'ユ', 'ヨ', 'ワ', 'ヲ',
  'ラ', 'リ', 'ル', 'レ', 'ロ', 'ン',
  'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
  'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
  'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
  'バ', 'ビ', 'ブ', 'ベ', 'ボ',
  'パ', 'ピ', 'プ', 'ペ', 'ポ',
  'ッ', 'ャ', 'ュ', 'ョ', 'ー'
];

const SPANISH_KEYS = [
  'á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡',
  'Á', 'É', 'Í', 'Ó', 'Ú', 'Ü', 'Ñ'
];

export function VirtualLanguageKeyboard({
  initialLanguage = 'ta',
  onInsertChar,
  onBackspace,
  onClear,
  onClose,
}: VirtualLanguageKeyboardProps) {
  const normalizeInitial = (lang: string): KeyboardLanguage => {
    if (lang === 'hi' || lang.includes('hindi')) return 'hi';
    if (lang === 'ja' || lang.includes('japan')) return 'ja';
    if (lang === 'es' || lang.includes('spanish')) return 'es';
    return 'ta'; // default to Tamil
  };

  const [activeLang, setActiveLang] = useState<KeyboardLanguage>(normalizeInitial(initialLanguage));
  const [jaMode, setJaMode] = useState<'hira' | 'kata'>('hira');

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="mt-2 pt-2 border-t border-slate-700/60 flex flex-col gap-1.5 animate-fadeIn"
    >
      {/* Language Switcher Tabs */}
      <div className="flex items-center justify-between gap-1 pb-1">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0.5">
          <button
            type="button"
            onClick={() => setActiveLang('ta')}
            className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold transition-all ${
              activeLang === 'ta'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/60 border border-transparent'
            }`}
          >
            தமிழ்
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('hi')}
            className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold transition-all ${
              activeLang === 'hi'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/60 border border-transparent'
            }`}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('ja')}
            className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold transition-all ${
              activeLang === 'ja'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/60 border border-transparent'
            }`}
          >
            日本語
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('es')}
            className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold transition-all ${
              activeLang === 'es'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/60 border border-transparent'
            }`}
          >
            Español
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close keyboard"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Japanese Hiragana / Katakana Toggle */}
      {activeLang === 'ja' && (
        <div className="flex items-center gap-1.5 px-0.5">
          <button
            type="button"
            onClick={() => setJaMode('hira')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
              jaMode === 'hira' ? 'bg-pink-500 text-white shadow-xs' : 'bg-slate-800 text-slate-300'
            }`}
          >
            ひらがな (Hiragana)
          </button>
          <button
            type="button"
            onClick={() => setJaMode('kata')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
              jaMode === 'kata' ? 'bg-pink-500 text-white shadow-xs' : 'bg-slate-800 text-slate-300'
            }`}
          >
            カタカナ (Katakana)
          </button>
        </div>
      )}

      {/* Key Matrix Container */}
      <div className="max-h-[115px] sm:max-h-[125px] overflow-y-auto scrollbar-thin pr-1 select-none">
        {/* TAMIL */}
        {activeLang === 'ta' && (
          <div className="space-y-1.5">
            {/* Signs / Pulli */}
            <div className="flex items-center gap-1 flex-wrap">
              {TAMIL_KEYS.signs.map((k, i) => (
                <button
                  key={`sign-${i}`}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-6 h-6 rounded bg-slate-800/80 hover:bg-amber-600/40 text-amber-200 text-xs font-semibold flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
            {/* Vowels */}
            <div className="flex items-center gap-1 flex-wrap">
              {TAMIL_KEYS.vowels.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-6 h-6 rounded bg-slate-800/90 hover:bg-amber-600/40 text-slate-100 text-xs font-semibold flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
            {/* Consonants */}
            <div className="flex items-center gap-1 flex-wrap">
              {TAMIL_KEYS.consonants.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-6 h-6 rounded bg-slate-800/70 hover:bg-amber-600/40 text-slate-200 text-xs font-medium flex items-center justify-center border border-slate-700/50 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* HINDI */}
        {activeLang === 'hi' && (
          <div className="space-y-1.5">
            {/* Matras */}
            <div className="flex items-center gap-1 flex-wrap">
              {HINDI_KEYS.matras.map((k, i) => (
                <button
                  key={`matra-${i}`}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-6 h-6 rounded bg-slate-800/80 hover:bg-sky-600/40 text-sky-200 text-xs font-semibold flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
            {/* Vowels */}
            <div className="flex items-center gap-1 flex-wrap">
              {HINDI_KEYS.vowels.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-6 h-6 rounded bg-slate-800/90 hover:bg-sky-600/40 text-slate-100 text-xs font-semibold flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
            {/* Consonants */}
            <div className="flex items-center gap-1 flex-wrap">
              {HINDI_KEYS.consonants.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-6 h-6 rounded bg-slate-800/70 hover:bg-sky-600/40 text-slate-200 text-xs font-medium flex items-center justify-center border border-slate-700/50 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* JAPANESE */}
        {activeLang === 'ja' && (
          <div className="flex items-center gap-1 flex-wrap">
            {(jaMode === 'hira' ? JAPANESE_HIRAGANA : JAPANESE_KATAKANA).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onInsertChar(k)}
                className="w-6 h-6 rounded bg-slate-800/80 hover:bg-pink-600/40 text-slate-100 text-xs font-japanese flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
              >
                {k}
              </button>
            ))}
          </div>
        )}

        {/* SPANISH */}
        {activeLang === 'es' && (
          <div className="flex items-center gap-1.5 flex-wrap py-1">
            {SPANISH_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onInsertChar(k)}
                className="w-7 h-7 rounded bg-slate-800/90 hover:bg-emerald-600/40 text-slate-100 text-sm font-semibold flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
              >
                {k}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action Control Row (Space, Backspace, Clear) */}
      <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => onInsertChar(' ')}
          className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center justify-center gap-1 border border-slate-700 active:scale-95 transition-all"
        >
          <Space className="w-3.5 h-3.5 text-slate-400" />
          <span>Space</span>
        </button>

        <button
          type="button"
          onClick={onBackspace}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center justify-center gap-1 border border-slate-700 active:scale-95 transition-all"
          title="Backspace"
        >
          <Delete className="w-3.5 h-3.5 text-slate-400" />
          <span>Del</span>
        </button>

        <button
          type="button"
          onClick={onClear}
          className="px-2 py-1 rounded-lg bg-slate-800/60 hover:bg-red-950/60 hover:text-red-300 text-slate-400 text-[10.5px] font-medium border border-slate-700 active:scale-95 transition-all"
          title="Clear text"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
export default VirtualLanguageKeyboard;
