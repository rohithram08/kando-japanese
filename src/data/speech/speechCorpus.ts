// src/data/speech/speechCorpus.ts
// ─────────────────────────────────────────────────────────────────────────────
// Kando Japanese — Speech Lab Corpus & Daily 10 Random Word Generator
// Draws from the 7,805-word curriculum bank (1,500+ words per JLPT N5-N1 level)
// plus expanded sentences, pitch minimal pairs, verb forms, and shadowing drills.
// ─────────────────────────────────────────────────────────────────────────────

import {
  contentProvider,
  type JLPTLevel,
  type LocalizedVocabularyItem,
  type SupportedLanguage,
} from '../../content/provider'

export const SPEECH_LEVELS: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1']

export interface SpeechPracticeItem {
  id: string
  jp: string
  word?: string
  reading: string
  romaji: string
  en: string
  meaning?: string
  pos?: string
  level: JLPTLevel | string
  exampleJp?: string
  exampleReading?: string
  exampleEn?: string
  contrast?: string
  pitchTag?: string
}

export interface SpeechTrackMeta {
  id: 'daily_10' | 'word_bank' | 'sentences' | 'minimal_pairs' | 'verbs' | 'shadowing'
  titleKey: string
  titleDefault: string
  shortLabel: string
  description: string
  requiresLevelPool?: boolean
}

export const SPEECH_TRACK_ORDER: SpeechTrackMeta[] = [
  {
    id: 'daily_10',
    titleKey: 'speech.track_daily_10',
    titleDefault: 'Daily 10 Words',
    shortLabel: 'Daily 10',
    description: '10 random daily words at your JLPT level',
    requiresLevelPool: true,
  },
  {
    id: 'word_bank',
    titleKey: 'speech.track_word_bank',
    titleDefault: '1,000+ Word Explorer',
    shortLabel: '1,500+ Words',
    description: 'Search & drill every word in your JLPT curriculum with audio & examples',
    requiresLevelPool: true,
  },
  {
    id: 'sentences',
    titleKey: 'speech.track_sentences',
    titleDefault: 'Everyday Sentences',
    shortLabel: 'Sentences',
    description: 'Natural phrases for daily conversation, travel, work, and polite requests',
  },
  {
    id: 'minimal_pairs',
    titleKey: 'speech.track_minimal_pairs',
    titleDefault: 'Pitch Minimal Pairs',
    shortLabel: 'Pitch Pairs',
    description: 'High/low Tokyo pitch accent contrasts that change word meaning',
  },
  {
    id: 'verbs',
    titleKey: 'speech.track_verbs',
    titleDefault: 'Verbs & Forms',
    shortLabel: 'Verbs',
    description: 'Essential action verbs with polite, te-form, and spoken usage rhythm',
  },
  {
    id: 'shadowing',
    titleKey: 'speech.track_shadowing',
    titleDefault: 'Shadowing & Twisters',
    shortLabel: 'Shadowing',
    description: 'Speed, rhythm, and articulation drills including classic Hayakuchikotoba',
  },
]

// ── Static Curated Tracks ───────────────────────────────────────────────────

export const EVERYDAY_SENTENCES: SpeechPracticeItem[] = [
  { id: 's1', jp: 'おはようございます', reading: 'おはようございます', romaji: 'Ohayou gozaimasu', en: 'Good morning', level: 'N5' },
  { id: 's2', jp: 'ありがとうございます', reading: 'ありがとうございます', romaji: 'Arigatou gozaimasu', en: 'Thank you very much', level: 'N5' },
  { id: 's3', jp: '日本語を勉強しています', reading: 'にほんごをべんきょうしています', romaji: 'Nihongo wo benkyou shite imasu', en: 'I am studying Japanese', level: 'N5' },
  { id: 's4', jp: 'もう一度言ってください', reading: 'もういちどいってください', romaji: 'Mou ichido itte kudasai', en: 'Please say it again', level: 'N5' },
  { id: 's5', jp: 'わかりません', reading: 'わかりません', romaji: 'Wakarimasen', en: "I don't understand", level: 'N5' },
  { id: 's6', jp: 'すみません、どこですか', reading: 'すみません、どこですか', romaji: 'Sumimasen, doko desu ka', en: 'Excuse me, where is it?', level: 'N5' },
  { id: 's7', jp: 'いくらですか', reading: 'いくらですか', romaji: 'Ikura desu ka', en: 'How much is it?', level: 'N5' },
  { id: 's8', jp: '電車はどこですか', reading: 'でんしゃはどこですか', romaji: 'Densha wa doko desu ka', en: 'Where is the train?', level: 'N5' },
  { id: 's9', jp: 'お会計お願いします', reading: 'おかいけいおねがいします', romaji: 'Okaikei onegaishimasu', en: 'Check, please', level: 'N5' },
  { id: 's10', jp: 'おすすめは何ですか', reading: 'おすすめはなんですか', romaji: 'Osusume wa nan desu ka', en: 'What do you recommend?', level: 'N5' },
  { id: 's11', jp: '駅までどのくらいかかりますか', reading: 'えきまでどのくらいかかりますか', romaji: 'Eki made dono kurai kakarimasu ka', en: 'How long does it take to the station?', level: 'N4' },
  { id: 's12', jp: '写真を撮ってもいいですか', reading: 'しゃしんをとってもいいですか', romaji: 'Shashin wo totte mo ii desu ka', en: 'May I take a photo?', level: 'N4' },
  { id: 's13', jp: '少しゆっくり話していただけますか', reading: 'すこしゆっくりはなしていただけますか', romaji: 'Sukoshi yukkuri hanashite itadakemasu ka', en: 'Could you speak a little slower?', level: 'N4' },
  { id: 's14', jp: '今日はとても忙しいですね', reading: 'きょうはとてもいそがしいですね', romaji: 'Kyou wa totemo isogashii desu ne', en: "It's very busy today, isn't it?", level: 'N4' },
  { id: 's15', jp: '予約を変更したいのですが', reading: 'よやくをへんこうしたいのですが', romaji: 'Yoyaku wo henkou shitai no desu ga', en: 'I would like to change my reservation...', level: 'N3' },
  { id: 's16', jp: 'お疲れ様でした', reading: 'おつかれさまでした', romaji: 'Otsukaresama deshita', en: 'Thank you for your hard work', level: 'N3' },
  { id: 's17', jp: 'お忙しいところ恐れ入ります', reading: 'おいそがしいところおそれいります', romaji: 'Oisogashii tokoro osoreirimasu', en: 'Excuse me for bothering you while you are busy', level: 'N2' },
  { id: 's18', jp: 'ご確認のほどよろしくお願いいたします', reading: 'ごかくにんのほどよろしくおねがいいたします', romaji: 'Gokakunin no hodo yoroshiku onegai itashimasu', en: 'Thank you kindly for checking', level: 'N2' },
  { id: 's19', jp: 'ご期待に沿えるよう努めます', reading: 'ごきたいにそえるようつとめます', romaji: 'Gokitai ni soeru you tsutomemasu', en: 'I will strive to meet your expectations', level: 'N1' },
  { id: 's20', jp: 'おっしゃる通りです', reading: 'おっしゃるとおりです', romaji: 'Ossharu toori desu', en: 'It is just as you say', level: 'N2' },
  { id: 's21', jp: '明日の朝、連絡します', reading: 'あしたのあさ、れんらくします', romaji: 'Ashita no asa, renraku shimasu', en: "I'll contact you tomorrow morning", level: 'N4' },
  { id: 's22', jp: 'カードは使えますか', reading: 'かーどはつかえますか', romaji: 'Kaado wa tsukaemasu ka', en: 'Can I pay by card?', level: 'N4' },
  { id: 's23', jp: '日本語が上手ですね', reading: 'にほんごがじょうずですね', romaji: 'Nihongo ga jouzu desu ne', en: 'Your Japanese is very good!', level: 'N5' },
  { id: 's24', jp: 'まだ慣れていません', reading: 'まだなれていません', romaji: 'Mada narete imasen', en: "I'm not used to it yet", level: 'N3' },
]

export const MINIMAL_PAIR_ITEMS: SpeechPracticeItem[] = [
  { id: 'mp1_1', jp: '箸', word: '箸', reading: 'はし', romaji: 'hashi', pitchTag: '① H-L', en: 'chopsticks (Atamadaka: H-L)', level: 'N5', contrast: '箸 (chopsticks [①]) vs 橋 (bridge [②]) vs 端 (edge [⓪])' },
  { id: 'mp1_2', jp: '橋', word: '橋', reading: 'はし', romaji: 'hashi', pitchTag: '② L-H-L', en: 'bridge (Odaka: L-H + drop on particle)', level: 'N5', contrast: '箸 (chopsticks [①]) vs 橋 (bridge [②]) vs 端 (edge [⓪])' },
  { id: 'mp1_3', jp: '端', word: '端', reading: 'はし', romaji: 'hashi', pitchTag: '⓪ L-H-H', en: 'edge / corner (Heiban: L-H, stays high on particle)', level: 'N4', contrast: '箸 (chopsticks [①]) vs 橋 (bridge [②]) vs 端 (edge [⓪])' },
  { id: 'mp2_1', jp: '雨', word: '雨', reading: 'あめ', romaji: 'ame', pitchTag: '① H-L', en: 'rain (Atamadaka: H-L)', level: 'N5', contrast: '雨 (rain [①]) vs 飴 (candy [⓪])' },
  { id: 'mp2_2', jp: '飴', word: '飴', reading: 'あめ', romaji: 'ame', pitchTag: '⓪ L-H', en: 'candy (Heiban: L-H, flat pitch)', level: 'N4', contrast: '雨 (rain [①]) vs 飴 (candy [⓪])' },
  { id: 'mp3_1', jp: '神', word: '神', reading: 'かみ', romaji: 'kami', pitchTag: '① H-L', en: 'god / deity (Atamadaka: H-L)', level: 'N4', contrast: '神 (god [①]) vs 紙 / 髪 (paper / hair [②])' },
  { id: 'mp3_2', jp: '紙', word: '紙', reading: 'かみ', romaji: 'kami', pitchTag: '② L-H-L', en: 'paper (Odaka: L-H + drop on particle)', level: 'N5', contrast: '神 (god [①]) vs 紙 / 髪 (paper / hair [②])' },
  { id: 'mp4_1', jp: '熱い', word: '熱い', reading: 'あつい', romaji: 'atsui', pitchTag: '② L-H-L', en: 'hot (temperature)', level: 'N5', contrast: '熱い (hot [②]) vs 厚い (thick [⓪/②])' },
  { id: 'mp4_2', jp: '帰る', word: '帰る', reading: 'かえる', romaji: 'kaeru', pitchTag: '① H-L-L', en: 'to return home (Atamadaka: H-L-L)', level: 'N5', contrast: '帰る (return home [①]) vs 変える (change [⓪]) vs 蛙 (frog [⓪])' },
  { id: 'mp4_3', jp: '変える', word: '変える', reading: 'かえる', romaji: 'kaeru', pitchTag: '⓪ L-H-H', en: 'to change something (Heiban: L-H-H)', level: 'N4', contrast: '帰る (return home [①]) vs 変える (change [⓪]) vs 蛙 (frog [⓪])' },
  { id: 'mp5_1', jp: '切る', word: '切る', reading: 'きる', romaji: 'kiru', pitchTag: '① H-L', en: 'to cut (Atamadaka: H-L)', level: 'N5', contrast: '切る (to cut [①]) vs 着る (to wear [⓪])' },
  { id: 'mp5_2', jp: '着る', word: '着る', reading: 'きる', romaji: 'kiru', pitchTag: '⓪ L-H', en: 'to wear (Heiban: L-H)', level: 'N5', contrast: '切る (to cut [①]) vs 着る (to wear [⓪])' },
  { id: 'mp6_1', jp: '今朝', word: '今朝', reading: 'けさ', romaji: 'kesa', pitchTag: '① H-L', en: 'this morning (Atamadaka: H-L)', level: 'N5', contrast: '今朝 (this morning [①]) vs 袈裟 (monk robe [⓪])' },
  { id: 'mp6_2', jp: '酒', word: '酒', reading: 'さけ', romaji: 'sake', pitchTag: '⓪ L-H', en: 'sake / alcohol (Heiban: L-H)', level: 'N5', contrast: '酒 (alcohol [⓪]) vs 鮭 (salmon [①])' },
  { id: 'mp6_3', jp: '鮭', word: '鮭', reading: 'さけ', romaji: 'sake', pitchTag: '① H-L', en: 'salmon (Atamadaka: H-L)', level: 'N4', contrast: '酒 (alcohol [⓪]) vs 鮭 (salmon [①])' },
  { id: 'mp7_1', jp: '雲', word: '雲', reading: 'くも', romaji: 'kumo', pitchTag: '① H-L', en: 'cloud (Atamadaka: H-L)', level: 'N4', contrast: '雲 (cloud [①]) vs 蜘蛛 (spider [⓪/①])' },
  { id: 'mp7_2', jp: '柿', word: '柿', reading: 'かき', romaji: 'kaki', pitchTag: '⓪ L-H', en: 'persimmon (Heiban: L-H)', level: 'N3', contrast: '柿 (persimmon [⓪]) vs 牡蠣 (oyster [①]) vs 垣 (fence [②])' },
  { id: 'mp7_3', jp: '牡蠣', word: '牡蠣', reading: 'かき', romaji: 'kaki', pitchTag: '① H-L', en: 'oyster (Atamadaka: H-L)', level: 'N3', contrast: '柿 (persimmon [⓪]) vs 牡蠣 (oyster [①]) vs 垣 (fence [②])' },
  { id: 'mp8_1', jp: '花', word: '花', reading: 'はな', romaji: 'hana', pitchTag: '② L-H-L', en: 'flower (Odaka: drops after particle)', level: 'N5', contrast: '花 (flower [②]) vs 鼻 (nose [⓪])' },
  { id: 'mp8_2', jp: '鼻', word: '鼻', reading: 'はな', romaji: 'hana', pitchTag: '⓪ L-H-H', en: 'nose (Heiban: flat pitch on particle)', level: 'N5', contrast: '花 (flower [②]) vs 鼻 (nose [⓪])' },
]

export const VERB_DRILLS: SpeechPracticeItem[] = [
  { id: 'v1', jp: '食べる', word: '食べる', reading: 'たべる', romaji: 'taberu', en: 'to eat (Ichidan / Ru-verb)', level: 'N5', exampleJp: '朝ごはんを食べます。', exampleEn: 'I eat breakfast.' },
  { id: 'v2', jp: '行く', word: '行く', reading: 'いく', romaji: 'iku', en: 'to go (Godan)', level: 'N5', exampleJp: '明日、学校へ行きます。', exampleEn: 'I am going to school tomorrow.' },
  { id: 'v3', jp: 'する', word: 'する', reading: 'する', romaji: 'suru', en: 'to do (Irregular)', level: 'N5', exampleJp: '週末に運動をします。', exampleEn: 'I exercise on weekends.' },
  { id: 'v4', jp: '来る', word: '来る', reading: 'くる', romaji: 'kuru', en: 'to come (Irregular)', level: 'N5', exampleJp: '友だちが家に来ます。', exampleEn: 'My friend is coming to my house.' },
  { id: 'v5', jp: '見る', word: '見る', reading: 'みる', romaji: 'miru', en: 'to see / watch (Ichidan)', level: 'N5', exampleJp: '映画を見たいです。', exampleEn: 'I want to watch a movie.' },
  { id: 'v6', jp: '飲む', word: '飲む', reading: 'のむ', romaji: 'nomu', en: 'to drink (Godan)', level: 'N5', exampleJp: 'お茶を飲みませんか。', exampleEn: "Won't you have some tea?" },
  { id: 'v7', jp: '話す', word: '話す', reading: 'はなす', romaji: 'hanasu', en: 'to speak / talk (Godan)', level: 'N5', exampleJp: '毎日日本語を話します。', exampleEn: 'I speak Japanese every day.' },
  { id: 'v8', jp: '聞く', word: '聞く', reading: 'きく', romaji: 'kiku', en: 'to listen / ask (Godan)', level: 'N5', exampleJp: '音楽を聞きながら勉強します。', exampleEn: 'I study while listening to music.' },
  { id: 'v9', jp: '読む', word: '読む', reading: 'よむ', romaji: 'yomu', en: 'to read (Godan)', level: 'N5', exampleJp: '毎朝新聞を読みます。', exampleEn: 'I read the newspaper every morning.' },
  { id: 'v10', jp: '書く', word: '書く', reading: 'かく', romaji: 'kaku', en: 'to write (Godan)', level: 'N5', exampleJp: 'ノートに漢字を書きました。', exampleEn: 'I wrote kanji in my notebook.' },
  { id: 'v11', jp: '覚える', word: '覚える', reading: 'おぼえる', romaji: 'oboeru', en: 'to memorize / remember', level: 'N4', exampleJp: '新しい言葉を十個覚えました。', exampleEn: 'I memorized ten new words.' },
  { id: 'v12', jp: '決める', word: '決める', reading: 'きめる', romaji: 'kimeru', en: 'to decide', level: 'N4', exampleJp: '来月の予定を決めましょう。', exampleEn: "Let's decide next month's schedule." },
  { id: 'v13', jp: '続ける', word: '続ける', reading: 'つづける', romaji: 'tsuzukeru', en: 'to continue', level: 'N4', exampleJp: '毎日練習を続けています。', exampleEn: 'I continue practicing every day.' },
  { id: 'v14', jp: '説明する', word: '説明する', romaji: 'setsumei suru', reading: 'せつめいする', en: 'to explain', level: 'N4', exampleJp: 'わかりやすく説明します。', exampleEn: 'I will explain it clearly.' },
  { id: 'v15', jp: '確認する', word: '確認する', reading: 'かくにんする', romaji: 'kakunin suru', en: 'to confirm / check', level: 'N3', exampleJp: 'メールの内容を確認してください。', exampleEn: 'Please check the contents of the email.' },
  { id: 'v16', jp: '集中する', word: '集中する', reading: 'しゅうちゅうする', romaji: 'shuuchuu suru', en: 'to concentrate', level: 'N3', exampleJp: '発音に集中して聞きましょう。', exampleEn: "Let's listen and focus on pronunciation." },
  { id: 'v17', jp: '提案する', word: '提案する', reading: 'ていあんする', romaji: 'teian suru', en: 'to propose / suggest', level: 'N2', exampleJp: '新しい計画を提案しました。', exampleEn: 'I proposed a new plan.' },
  { id: 'v18', jp: '把握する', word: '把握する', reading: 'はあくする', romaji: 'haaku suru', en: 'to grasp / understand fully', level: 'N1', exampleJp: '全体の状況を把握する必要があります。', exampleEn: 'We need to grasp the overall situation.' },
]

export const SHADOWING_ITEMS: SpeechPracticeItem[] = [
  { id: 'sh1', jp: 'すもももももももものうち', reading: 'すもももももももものうち', romaji: 'Sumomo mo momo mo momo no uchi', en: 'Plums and peaches are both types of peaches (Classic vowel rhythm twister)', level: 'N5' },
  { id: 'sh2', jp: '生麦生米生卵', reading: 'なまむぎなまごめなまたまご', romaji: 'Nama mugi nama gome nama tamago', en: 'Raw wheat, raw rice, raw egg (M/G/T consonant agility)', level: 'N4' },
  { id: 'sh3', jp: '東京特許許可局', reading: 'とうきょうときょきょかきょく', romaji: 'Toukyou tokkyo kyokakyoku', en: 'Tokyo Patent Approval Bureau (Long vowels + geminate っ + ょ)', level: 'N3' },
  { id: 'sh4', jp: '隣の客はよく柿食う客だ', reading: 'となりのきゃくはよくかきくうきゃくだ', romaji: 'Tonari no kyaku wa yoku kaki kuu kyaku da', en: 'The guest next door eats lots of persimmons (Kya/Kaku glide drill)', level: 'N4' },
  { id: 'sh5', jp: 'そうですね、ちなみに今はどうですか', reading: 'そうですね、ちなみにいまはどうですか', romaji: 'Sou desu ne, chinami ni ima wa dou desu ka', en: 'Let me see — by the way, how is it right now?', level: 'N3' },
  { id: 'sh6', jp: 'ちょっと待ってくださいね', reading: 'ちょっとまってくださいね', romaji: 'Chotto matte kudasai ne', en: 'Just a moment, please (Double consonant っ timing)', level: 'N5' },
  { id: 'sh7', jp: '赤パジャマ青パジャマ黄パジャマ', reading: 'あかぱじゃまあおぱじゃまきぱじゃま', romaji: 'Aka pajama ao pajama ki pajama', en: 'Red pajamas, blue pajamas, yellow pajamas', level: 'N5' },
  { id: 'sh8', jp: '実は前から興味があったんです', reading: 'じつはまえからきょうみがあったんです', romaji: 'Jitsu wa mae kara kyoumi ga atta n desu', en: 'To tell the truth, I was interested in it from before', level: 'N3' },
  { id: 'sh9', jp: '坊主が屏風に上手に坊主の絵を描いた', reading: 'ぼうずがびょうぶにじょうずにぼうずのえをかいた', romaji: 'Bouzu ga byoubu ni jouzu ni bouzu no e wo kaita', en: 'A monk skillfully drew a monk on a folding screen', level: 'N2' },
  { id: 'sh10', jp: 'おっしゃっている意味がよくわかります', reading: 'おっしゃっているいみがよくわかります', romaji: 'Osshatte iru imi ga yoku wakarimasu', en: 'I completely understand what you mean', level: 'N2' },
  { id: 'sh11', jp: 'このたびは大変お世話になりました', reading: 'このたびはたいへんおせわになりました', romaji: 'Kono tabi wa taihen osewa ni narimashita', en: 'Thank you very much for all your help this time', level: 'N2' },
  { id: 'sh12', jp: 'あきらめずに続けることが一番大切です', reading: 'あきらめずにつづけることがいちばんたいせつです', romaji: 'Akiramezu ni tsuzukeru koto ga ichiban taisetsu desu', en: 'Continuing without giving up is the most important thing', level: 'N4' },
]

// ── Curriculum Pool (1,500+ words per JLPT level) ──────────────────────────

const poolCache = new Map<string, SpeechPracticeItem[]>()

function mapVocabItemToSpeech(item: LocalizedVocabularyItem): SpeechPracticeItem {
  return {
    id: item.id,
    jp: item.word,
    word: item.word,
    reading: item.reading || item.word,
    romaji: item.romaji || '',
    en: item.meaning || '',
    meaning: item.meaning || '',
    pos: item.pos || 'word',
    level: item.level,
    exampleJp: item.example?.jp || '',
    exampleReading: item.example?.reading || '',
    exampleEn: item.example?.translated || item.example?.en || '',
  }
}

export function getLevelWordPool(
  level: JLPTLevel = 'N5',
  lang: SupportedLanguage = 'en'
): SpeechPracticeItem[] {
  const normalizedLevel: JLPTLevel = SPEECH_LEVELS.includes(level) ? level : 'N5'
  const key = `${normalizedLevel}:${lang}`
  const cached = poolCache.get(key)
  if (cached) return cached

  const raw = contentProvider.getVocabulary(normalizedLevel, lang)
  const mapped = raw
    .filter((v) => v && v.word && (v.reading || v.word))
    .map(mapVocabItemToSpeech)

  poolCache.set(key, mapped)
  return mapped
}

export function getLevelWordCount(level: JLPTLevel = 'N5'): number {
  return getLevelWordPool(level, 'en').length
}

export function getAllLevelWordCounts(): Record<JLPTLevel, number> {
  return {
    N5: getLevelWordCount('N5'),
    N4: getLevelWordCount('N4'),
    N3: getLevelWordCount('N3'),
    N2: getLevelWordCount('N2'),
    N1: getLevelWordCount('N1'),
  }
}

// ── Deterministic Seeded Daily 10 Random Selector ──────────────────────────

export function getLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function hashSeed(str: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function getDailyRandomWords(
  level: JLPTLevel = 'N5',
  dateKey: string = getLocalDateKey(),
  lang: SupportedLanguage = 'en',
  batchOffset: number = 0,
  count: number = 10
): SpeechPracticeItem[] {
  const pool = getLevelWordPool(level, lang)
  if (pool.length === 0) return []

  const targetCount = Math.min(count, pool.length)
  const rng = mulberry32(hashSeed(`${dateKey}:${level}:${batchOffset}`))

  // Build index permutation using partial Fisher-Yates so every word has equal probability
  const indices = Array.from({ length: pool.length }, (_, idx) => idx)
  const picked: SpeechPracticeItem[] = []
  const seenSurface = new Set<string>()

  let limit = indices.length
  while (picked.length < targetCount && limit > 0) {
    const swapIdx = Math.floor(rng() * limit)
    const chosenIndex = indices[swapIdx]
    indices[swapIdx] = indices[limit - 1]
    limit -= 1

    const candidate = pool[chosenIndex]
    const surfaceKey = `${candidate.word}|${candidate.reading}`
    if (seenSurface.has(surfaceKey)) continue
    seenSurface.add(surfaceKey)
    picked.push(candidate)
  }

  return picked
}

const LEVEL_RANK: Record<string, number> = { N5: 0, N4: 1, N3: 2, N2: 3, N1: 4 }

export function getStaticTrackItems(
  trackId: SpeechTrackMeta['id'],
  preferredLevel: JLPTLevel = 'N5',
  allowedLevels: JLPTLevel[] = SPEECH_LEVELS
): SpeechPracticeItem[] {
  let base: SpeechPracticeItem[] = []
  if (trackId === 'sentences') base = EVERYDAY_SENTENCES
  else if (trackId === 'minimal_pairs') base = MINIMAL_PAIR_ITEMS
  else if (trackId === 'verbs') base = VERB_DRILLS
  else if (trackId === 'shadowing') base = SHADOWING_ITEMS
  else return []

  const allowedSet = new Set(allowedLevels)
  const gated = base.filter((item) => !item.level || allowedSet.has(item.level as JLPTLevel))

  const targetRank = LEVEL_RANK[preferredLevel] ?? 0
  return [...gated].sort((a, b) => {
    const distA = Math.abs((LEVEL_RANK[a.level] ?? 0) - targetRank)
    const distB = Math.abs((LEVEL_RANK[b.level] ?? 0) - targetRank)
    return distA - distB
  })
}
