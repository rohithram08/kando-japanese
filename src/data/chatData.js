import {
  Coffee, UtensilsCrossed, ShoppingBag, Plane, Briefcase, Heart,
} from 'lucide-react'

// ─── Scenario presets ─────────────────────────────────────
export const SCENARIOS = [
  { id: 'free',       label: 'Free Talk',      Icon: Coffee,          color: 'from-blue-500 to-cyan-500',     desc: 'Open conversation on any topic' },
  { id: 'restaurant', label: 'Restaurant',     Icon: UtensilsCrossed, color: 'from-orange-500 to-red-500',    desc: 'Order food, ask about the menu' },
  { id: 'shopping',   label: 'Shopping',       Icon: ShoppingBag,     color: 'from-pink-500 to-rose-500',     desc: 'Buy items, ask prices & sizes' },
  { id: 'travel',     label: 'Travel',         Icon: Plane,           color: 'from-violet-500 to-purple-500', desc: 'Navigate stations, ask directions' },
  { id: 'work',       label: 'Workplace',      Icon: Briefcase,       color: 'from-emerald-500 to-teal-500',  desc: 'Office keigo & business talk' },
  { id: 'dating',     label: 'Making Friends', Icon: Heart,           color: 'from-rose-500 to-pink-500',     desc: 'Casual introductions & hobbies' },
]

// ─── Quick reply chips per scenario ───────────────────────
export const QUICK_REPLIES = {
  free:       ['こんにちは！', '元気ですか？', '趣味は何ですか？', '日本語を勉強しています'],
  restaurant: ['メニューをください', 'おすすめは何ですか？', 'これをください', 'お会計お願いします'],
  shopping:   ['これはいくらですか？', 'もっと安いのはありますか？', '試着してもいいですか？', 'カードで払えますか？'],
  travel:     ['すみません、駅はどこですか？', '東京行きの電車はどれですか？', '片道切符をください', 'この電車は新宿に止まりますか？'],
  work:       ['お疲れ様です', '会議は何時からですか？', 'ご確認お願いいたします', '承知いたしました'],
  dating:     ['はじめまして！', 'どこから来ましたか？', '趣味は何ですか？', '今度一緒に遊びませんか？'],
}

// ─── Hint suggestions per scenario ────────────────────────
export const HINTS = {
  free:       ['Try introducing yourself with 私は〇〇です', 'Ask about hobbies: 趣味は何ですか？', 'Talk about weather: 今日はいい天気ですね'],
  restaurant: ['Ask for recommendations: おすすめは？', 'Order with: 〇〇をお願いします', 'Ask for the check: お会計お願いします'],
  shopping:   ['Ask the price: いくらですか？', 'Ask for a discount: 安くなりますか？', 'Say you want it: これをください'],
  travel:     ['Ask for directions: 〇〇はどこですか？', 'Buy a ticket: 切符をください', 'Confirm: 〇〇に止まりますか？'],
  work:       ['Greet colleagues: お疲れ様です', 'Ask about schedule: 予定を教えてください', 'Confirm: かしこまりました'],
  dating:     ['Introduce yourself: 私は〇〇です', 'Ask where from: どちらからですか？', 'Suggest meeting: また会いましょう'],
}

// ─── Simulated AI responses per scenario ──────────────────
// Replace individual scenario arrays with real API calls when ready
export const AI_RESPONSES = {
  free: [
    { jp: 'こんにちは！今日はいい天気ですね。何について話しましょうか？', en: "Hello! It's nice weather today. What shall we talk about?", grammar: 'ね particle — seeking agreement', correction: null, newWords: ['天気 (てんき) — weather', '話す (はなす) — to talk'] },
    { jp: 'いいですね！私も日本語を教えるのが好きです。どのくらい勉強していますか？', en: "That's great! I also like teaching Japanese. How long have you been studying?", grammar: 'のが好き — expressing likes with verbs', correction: null, newWords: ['教える (おしえる) — to teach', '勉強 (べんきょう) — study'] },
    { jp: '素晴らしいですね！毎日少しずつ練習するのが大切ですよ。一緒に頑張りましょう！', en: "That's wonderful! Practicing a little every day is important. Let's do our best together!", grammar: 'のが大切 — expressing importance', correction: null, newWords: ['毎日 (まいにち) — every day', '練習 (れんしゅう) — practice', '頑張る (がんばる) — to do one\'s best'] },
    { jp: 'そうですか！好きな日本の食べ物はありますか？私はラーメンが大好きです。', en: "Is that so! Do you have a favorite Japanese food? I love ramen.", grammar: 'が大好き — expressing strong preference', correction: null, newWords: ['食べ物 (たべもの) — food', '大好き (だいすき) — love/really like'] },
  ],
  restaurant: [
    { jp: 'いらっしゃいませ！何名様ですか？お席にご案内いたします。', en: "Welcome! How many people? I'll show you to your seat.", grammar: '何名様 — polite counter for people', correction: null, newWords: ['席 (せき) — seat', '案内 (あんない) — guidance'] },
    { jp: '本日のおすすめは天ぷら定食です。とても人気がありますよ。お飲み物はいかがですか？', en: "Today's recommendation is the tempura set meal. It's very popular. Would you like a drink?", grammar: 'いかがですか — polite "how about"', correction: null, newWords: ['定食 (ていしょく) — set meal', '飲み物 (のみもの) — drink'] },
    { jp: 'かしこまりました。少々お待ちください。お水もお持ちしますね。', en: "Understood. Please wait a moment. I'll bring water as well.", grammar: 'お〜します — humble form of doing for someone', correction: null, newWords: ['少々 (しょうしょう) — a little/moment', '水 (みず) — water'] },
    { jp: 'お待たせいたしました。こちらが天ぷら定食です。ごゆっくりどうぞ。', en: "Sorry for the wait. Here is the tempura set meal. Please enjoy at your leisure.", grammar: 'お待たせいたしました — humble apology for waiting', correction: null, newWords: ['ごゆっくり — at your leisure'] },
  ],
  shopping: [
    { jp: 'いらっしゃいませ！何かお探しですか？新商品がたくさん入りましたよ。', en: "Welcome! Are you looking for something? We have lots of new items.", grammar: 'お探し — honorific form of 探す', correction: null, newWords: ['新商品 (しんしょうひん) — new product', '探す (さがす) — to look for'] },
    { jp: 'こちらは3,000円になります。色違いもございますよ。試着なさいますか？', en: "This one is 3,000 yen. We also have other colors. Would you like to try it on?", grammar: 'なさいますか — honorific question', correction: null, newWords: ['色違い (いろちがい) — different color', '試着 (しちゃく) — fitting/trying on'] },
    { jp: 'はい、試着室はあちらです。サイズが合わなければお声がけください。', en: "Yes, the fitting room is over there. If the size doesn't fit, please let me know.", grammar: '〜なければ — if not ~', correction: null, newWords: ['試着室 (しちゃくしつ) — fitting room', 'サイズ — size'] },
  ],
  travel: [
    { jp: '駅は、この道をまっすぐ行って、二つ目の信号を右に曲がってください。歩いて5分ぐらいです。', en: "For the station, go straight, turn right at the second light. About a 5-minute walk.", grammar: 'て-form for sequential directions', correction: null, newWords: ['信号 (しんごう) — traffic light', '曲がる (まがる) — to turn'] },
    { jp: '新宿行きは3番線から出ます。次の電車は10分後です。快速と各停がありますが、どちらがいいですか？', en: "Shinjuku-bound from platform 3. Next train in 10 min. Express or local — which do you prefer?", grammar: '〜行き — bound for ~', correction: null, newWords: ['快速 (かいそく) — express', '各停 (かくてい) — local'] },
    { jp: 'はい、この電車は新宿に止まりますよ。あと3駅です。降りるときにアナウンスがあります。', en: "Yes, it stops at Shinjuku. 3 more stations. There'll be an announcement when to get off.", grammar: 'とき — when ~', correction: null, newWords: ['降りる (おりる) — to get off', 'アナウンス — announcement'] },
  ],
  work: [
    { jp: 'お疲れ様です。明日の会議の資料はもう準備できましたか？部長が確認したいそうです。', en: "Good work. Are the materials for tomorrow's meeting ready? I hear the manager wants to check them.", grammar: '〜そうです — hearsay', correction: null, newWords: ['資料 (しりょう) — materials', '部長 (ぶちょう) — department manager'] },
    { jp: '会議は午後2時からです。会議室Bを予約してあります。プロジェクターも用意しましょうか？', en: "Meeting from 2 PM. Room B is reserved. Shall I prepare the projector too?", grammar: '〜しましょうか — offering to do something', correction: null, newWords: ['予約 (よやく) — reservation', '用意 (ようい) — preparation'] },
    { jp: 'かしこまりました。すぐに対応いたします。他にご指示はございますか？', en: "Understood. I'll handle it right away. Are there any other instructions?", grammar: 'ご指示 — honorific "instructions"', correction: null, newWords: ['対応 (たいおう) — handling', '指示 (しじ) — instructions'] },
  ],
  dating: [
    { jp: 'はじめまして！私はユキです。よろしくお願いします！どんな音楽が好きですか？', en: "Nice to meet you! I'm Yuki. What kind of music do you like?", grammar: 'どんな — what kind of', correction: null, newWords: ['音楽 (おんがく) — music'] },
    { jp: 'へぇ、面白いですね！私はJ-POPと料理が好きです。最近、新しいカフェを見つけました。', en: "Oh interesting! I like J-POP and cooking. I recently found a new café.", grammar: '〜を見つけました — found ~', correction: null, newWords: ['最近 (さいきん) — recently', '見つける (みつける) — to find'] },
    { jp: 'いいですね！今度一緒にそのカフェに行きませんか？週末は空いていますか？', en: "Great! Shall we go to that café together? Are you free on the weekend?", grammar: '〜ませんか — polite invitation', correction: null, newWords: ['週末 (しゅうまつ) — weekend', '空く (あく) — to be free'] },
  ],
}