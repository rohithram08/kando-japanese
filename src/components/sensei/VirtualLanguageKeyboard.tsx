import React, { useState } from 'react';
import { Delete, Space, X, ArrowUp } from 'lucide-react';

export type KeyboardLanguage = 'ta' | 'hi' | 'ja' | 'en' | 'ko' | 'zh' | 'es';

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

const ENGLISH_QWERTY = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

const ENGLISH_NUMS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '?', '!', '.', ','];

const KOREAN_KEYS = {
  consonants: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'ㄲ', 'ㄸ', 'ㅃ', 'ㅆ', 'ㅉ'],
  vowels: ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ', 'ㅐ', 'ㅒ', 'ㅔ', 'ㅖ', 'ㅢ', 'ㅘ', 'ㅝ']
};

const CHINESE_KEYS = {
  pinyinTones: [
    'ā', 'á', 'ǎ', 'à',
    'ē', 'é', 'ě', 'è',
    'ī', 'í', 'ǐ', 'ì',
    'ō', 'ó', 'ǒ', 'ò',
    'ū', 'ú', 'ǔ', 'ù',
    'ǖ', 'ǘ', 'ǚ', 'ǜ'
  ],
  commonHanzi: [
    '你', '好', '我', '的', '是', '在', '不', '了', '人', '有',
    '和', '这', '中', '大', '国', '上', '个', '们', '到', '说'
  ]
};

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
    if (lang === 'ko' || lang.includes('korean')) return 'ko';
    if (lang === 'zh' || lang.includes('chinese')) return 'zh';
    if (lang === 'es' || lang.includes('spanish')) return 'es';
    if (lang === 'en' || lang.includes('english')) return 'en';
    return 'ta';
  };

  const [activeLang, setActiveLang] = useState<KeyboardLanguage>(normalizeInitial(initialLanguage));
  const [jaMode, setJaMode] = useState<'hira' | 'kata'>('hira');
  const [capsLock, setCapsLock] = useState<boolean>(false);

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="mt-2 pt-2 border-t border-slate-700/60 flex flex-col gap-1.5 animate-fadeIn"
    >
      {/* Scrollable Language Switcher Tabs */}
      <div className="flex items-center justify-between gap-1 pb-1">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0.5 max-w-[210px] sm:max-w-[230px]">
          <button
            type="button"
            onClick={() => setActiveLang('ta')}
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
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
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
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
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
              activeLang === 'ja'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/60 border border-transparent'
            }`}
          >
            日本語
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
              activeLang === 'en'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/60 border border-transparent'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('ko')}
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
              activeLang === 'ko'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/60 border border-transparent'
            }`}
          >
            한국어
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('zh')}
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
              activeLang === 'zh'
                ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/60 border border-transparent'
            }`}
          >
            中文
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('es')}
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
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
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          title="Close keyboard"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Submode toggles */}
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
      <div className="max-h-[110px] sm:max-h-[120px] overflow-y-auto scrollbar-thin pr-0.5 select-none">
        {/* TAMIL */}
        {activeLang === 'ta' && (
          <div className="space-y-1">
            <div className="flex items-center gap-1 flex-wrap">
              {TAMIL_KEYS.signs.map((k, i) => (
                <button
                  key={`sign-${i}`}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-5 h-5 rounded bg-slate-800/80 hover:bg-amber-600/40 text-amber-200 text-[11px] font-semibold flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {TAMIL_KEYS.vowels.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-5 h-5 rounded bg-slate-800/90 hover:bg-amber-600/40 text-slate-100 text-[11px] font-semibold flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {TAMIL_KEYS.consonants.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-5 h-5 rounded bg-slate-800/70 hover:bg-amber-600/40 text-slate-200 text-[11px] font-medium flex items-center justify-center border border-slate-700/50 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* HINDI */}
        {activeLang === 'hi' && (
          <div className="space-y-1">
            <div className="flex items-center gap-1 flex-wrap">
              {HINDI_KEYS.matras.map((k, i) => (
                <button
                  key={`matra-${i}`}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-5 h-5 rounded bg-slate-800/80 hover:bg-sky-600/40 text-sky-200 text-[11px] font-semibold flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {HINDI_KEYS.vowels.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-5 h-5 rounded bg-slate-800/90 hover:bg-sky-600/40 text-slate-100 text-[11px] font-semibold flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {HINDI_KEYS.consonants.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-5 h-5 rounded bg-slate-800/70 hover:bg-sky-600/40 text-slate-200 text-[11px] font-medium flex items-center justify-center border border-slate-700/50 active:scale-95 transition-all"
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
                className="w-5 h-5 rounded bg-slate-800/80 hover:bg-pink-600/40 text-slate-100 text-[11px] font-japanese flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
              >
                {k}
              </button>
            ))}
          </div>
        )}

        {/* ENGLISH QWERTY */}
        {activeLang === 'en' && (
          <div className="space-y-1">
            <div className="flex items-center gap-1 flex-wrap">
              {ENGLISH_NUMS.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onInsertChar(num)}
                  className="w-4 h-5 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center justify-center border border-slate-700/50"
                >
                  {num}
                </button>
              ))}
            </div>
            {ENGLISH_QWERTY.map((row, rIdx) => (
              <div key={rIdx} className="flex items-center gap-1 justify-center">
                {rIdx === 2 && (
                  <button
                    type="button"
                    onClick={() => setCapsLock(!capsLock)}
                    className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center border transition-all ${
                      capsLock ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title="Caps Lock"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                )}
                {row.map((char) => {
                  const displayChar = capsLock ? char.toUpperCase() : char;
                  return (
                    <button
                      key={char}
                      type="button"
                      onClick={() => onInsertChar(displayChar)}
                      className="w-5 h-5 rounded bg-slate-800/90 hover:bg-indigo-600/40 text-slate-100 text-[11px] font-medium flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
                    >
                      {displayChar}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* KOREAN HANGUL */}
        {activeLang === 'ko' && (
          <div className="space-y-1">
            <div className="flex items-center gap-1 flex-wrap">
              {KOREAN_KEYS.consonants.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-5 h-5 rounded bg-slate-800/80 hover:bg-purple-600/40 text-slate-100 text-[11px] font-semibold flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {KOREAN_KEYS.vowels.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-5 h-5 rounded bg-slate-800/70 hover:bg-purple-600/40 text-purple-200 text-[11px] font-semibold flex items-center justify-center border border-slate-700/50 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CHINESE PINYIN & CHARACTERS */}
        {activeLang === 'zh' && (
          <div className="space-y-1">
            <div className="flex items-center gap-1 flex-wrap">
              {CHINESE_KEYS.pinyinTones.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-5 h-5 rounded bg-slate-800/80 hover:bg-red-600/40 text-red-200 text-[11px] font-medium flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {CHINESE_KEYS.commonHanzi.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => onInsertChar(k)}
                  className="w-5 h-5 rounded bg-slate-800/90 hover:bg-red-600/40 text-slate-100 text-[11px] font-medium flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SPANISH */}
        {activeLang === 'es' && (
          <div className="flex items-center gap-1 flex-wrap py-0.5">
            {SPANISH_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onInsertChar(k)}
                className="w-6 h-6 rounded bg-slate-800/90 hover:bg-emerald-600/40 text-slate-100 text-xs font-semibold flex items-center justify-center border border-slate-700/60 active:scale-95 transition-all"
              >
                {k}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action Control Row (Space, Backspace, Clear) */}
      <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => onInsertChar(' ')}
          className="flex-1 py-0.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-medium flex items-center justify-center gap-1 border border-slate-700 active:scale-95 transition-all"
        >
          <Space className="w-3 h-3 text-slate-400" />
          <span>Space</span>
        </button>

        <button
          type="button"
          onClick={onBackspace}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-medium flex items-center justify-center gap-1 border border-slate-700 active:scale-95 transition-all"
          title="Backspace"
        >
          <Delete className="w-3 h-3 text-slate-400" />
          <span>Del</span>
        </button>

        <button
          type="button"
          onClick={onClear}
          className="px-1.5 py-0.5 rounded bg-slate-800/60 hover:bg-red-950/60 hover:text-red-300 text-slate-400 text-[10px] font-medium border border-slate-700 active:scale-95 transition-all"
          title="Clear text"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
export default VirtualLanguageKeyboard;
