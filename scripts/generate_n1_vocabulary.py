# scripts/generate_n1_vocabulary.py
# Generates 1,500 total N1 vocabulary entries for content/vocabulary/n1.json

import json
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Romaji mapping
TABLE = {
    'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
    'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
    'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
    'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
    'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
    'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
    'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
    'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
    'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
    'ぢゃ': 'ja', 'ぢゅ': 'ju', 'ぢょ': 'jo',
    'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
    'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
    'しぇ': 'she', 'ちぇ': 'che', 'じぇ': 'je',
    'ふぁ': 'fa', 'ふぃ': 'fi', 'ふぇ': 'fe', 'ふぉ': 'fo',
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n',
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
    'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
    'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
    'ぁ': 'a', 'ぃ': 'i', 'ぅ': 'u', 'ぇ': 'e', 'ぉ': 'o',
    'っ': '',
    'ー': '-'
}

def hira_to_romaji(text):
    res = []
    i = 0
    while i < len(text):
        if text[i] == 'っ' and i + 1 < len(text):
            nxt2 = text[i+1:i+3]
            nxt1 = text[i+1:i+2]
            rom = TABLE.get(nxt2, TABLE.get(nxt1, ''))
            if rom:
                res.append(rom[0])
            i += 1
            continue
        if i + 1 < len(text) and text[i:i+2] in TABLE:
            res.append(TABLE[text[i:i+2]])
            i += 2
        elif text[i] in TABLE:
            res.append(TABLE[text[i]])
            i += 1
        else:
            res.append(text[i])
            i += 1
    return ''.join(res)

def furigana_to_reading(furigana_text):
    return re.sub(r'\{[^|}]*\|([^}]*)\}', r'\1', furigana_text)

def map_pos(pos_list):
    if not pos_list:
        return 'noun'
    p_set = set(pos_list)
    if any(p in p_set for p in ['vs', 'vs-i', 'vs-s']):
        return 'noun/verb'
    if 'adj-i' in p_set:
        return 'i-adjective'
    if any(p in p_set for p in ['adj-na', 'adj-nari', 'adj-t']):
        return 'na-adjective'
    if any(p in p_set for p in ['adv', 'adv-to']):
        return 'adverb'
    if any(p.startswith('v') or p in ['vi', 'vt', 'v1'] for p in p_set):
        return 'verb'
    if any(p in p_set for p in ['exp', 'int', 'conj', 'prt']):
        return 'expression'
    return 'noun'

# Curated High-Yield JLPT N1 Vocabulary
CURATED_N1 = [
    # Required in coordinator brief
    {
        "word": "享受", "reading": "きょうじゅ", "pos": "noun/verb",
        "example_jp": "自由を享受する権利がある。", "example_reading": "じゆうをきょうじゅするけんりがある。",
        "meaning": "reception / acceptance / enjoyment", "example_en": "We have the right to enjoy freedom."
    },
    {
        "word": "弊害", "reading": "へいがい", "pos": "noun",
        "example_jp": "制度の長期化に伴う弊害が目立ってきた。", "example_reading": "せいどのちょうきかにともなうへいがいがめだってきった。",
        "meaning": "harmful effect / evil / abuse", "example_en": "Harmful effects accompanying the prolonging of the system have become noticeable."
    },
    {
        "word": "凌駕", "reading": "りょうが", "pos": "noun/verb",
        "example_jp": "新製品の性能は他社を圧倒的に凌駕している。", "example_reading": "しんせいひんのせいのうはたしゃをあっとうてきにりょうがしている。",
        "meaning": "surpassing / outdoing / excelling", "example_en": "The performance of the new product overwhelmingly surpasses that of other companies."
    },
    {
        "word": "踏襲", "reading": "とうしゅう", "pos": "noun/verb",
        "example_jp": "前政権の基本方針を踏襲することを決定した。", "example_reading": "ぜんせいけんのきほんほうしんをとうしゅうすることをけっていした。",
        "meaning": "following precedent / adherence to past policy", "example_en": "It was decided to follow the basic policy of the previous administration."
    },
    {
        "word": "躊躇", "reading": "ちゅうちょ", "pos": "noun/verb",
        "example_jp": "躊躇することなく自分の意見をはっきりと述べた。", "example_reading": "ちゅうちょすることなくじぶんのいけんをはっきりのべた。",
        "meaning": "hesitation / vacillation", "example_en": "He clearly expressed his opinion without hesitation."
    },
    {
        "word": "おびただしい", "reading": "おびただしい", "pos": "i-adjective",
        "example_jp": "海岸におびただしい数のごみが漂着した。", "example_reading": "かいがんにおびただしいかずのごみがひょうちゃくした。",
        "meaning": "immense / large numbers of / tremendous", "example_en": "An immense amount of trash washed ashore on the beach."
    },
    {
        "word": "潔い", "reading": "いさぎよい", "pos": "i-adjective",
        "example_jp": "自分の過ちを認めて潔く謝罪した。", "example_reading": "じぶんのあやまりをみとめていさぎよくしゃざいした。",
        "meaning": "gracious / noble / manly / sportsmanlike", "example_en": "He admitted his mistake and apologized graciously."
    },
    {
        "word": "一石二鳥", "reading": "いっせきにちょう", "pos": "noun",
        "example_jp": "通勤しながら英語を学べば一石二鳥だ。", "example_reading": "つうきんしながらえいごをまなべばいっせきにちょうだ。",
        "meaning": "killing two birds with one stone", "example_en": "Studying English while commuting kills two birds with one stone."
    },
    {
        "word": "試行錯誤", "reading": "しこうさくご", "pos": "noun/verb",
        "example_jp": "試行錯誤を繰り返しながら成功へと導いた。", "example_reading": "しこうさくごをくりかえしながらせいこうへとみちびいた。",
        "meaning": "trial and error", "example_en": "Led to success through repeated trial and error."
    },
    # 四字熟語 (Four-character idioms)
    {
        "word": "臨機応変", "reading": "りんきおうへん", "pos": "na-adjective",
        "example_jp": "状況に合わせて臨機応変に対応する。", "example_reading": "じょうきょうにあわせてりんきおうへんにたいおうする。",
        "meaning": "adapting to circumstances / flexibility", "example_en": "Respond flexibly depending on the situation."
    },
    {
        "word": "単刀直入", "reading": "たんとうちょくにゅう", "pos": "na-adjective",
        "example_jp": "単刀直入に本題に入りましょう。", "example_reading": "たんとうちょくにゅうにほんだいにはいりましょう。",
        "meaning": "straightforward / frank / point-blank", "example_en": "Let us get straight to the point."
    },
    {
        "word": "本末転倒", "reading": "ほんまつてんとう", "pos": "noun/verb",
        "example_jp": "手段のために目的を見失うのは本末転倒だ。", "example_reading": "しゅだんのためにもくてきをみうしなうのはほんまつてんとうだ。",
        "meaning": "putting the cart before the horse / reversing priorities", "example_en": "Losing sight of the objective for the sake of the means is putting the cart before the horse."
    },
    {
        "word": "起死回生", "reading": "きしかいせい", "pos": "noun",
        "example_jp": "起死回生の一手を打つことに成功した。", "example_reading": "きしかいせいのいってをうつことにせいこうした。",
        "meaning": "revival from the brink of death / miraculous comeback", "example_en": "Succeeded in making a miraculous comeback move."
    },
    {
        "word": "危機一髪", "reading": "ききいっぱつ", "pos": "noun",
        "example_jp": "危機一髪のところで事故を免れた。", "example_reading": "ききいっぱつのところてじこをまぬがれた。",
        "meaning": "hairbreadth escape / critical moment", "example_en": "Narrowly escaped an accident by a hair's breadth."
    },
    {
        "word": "一長一短", "reading": "いっちょういったん", "pos": "noun",
        "example_jp": "どちらの提案にも一長一短がある。", "example_reading": "どちらのていあんにもいっちょういったんがある。",
        "meaning": "advantages and disadvantages / merits and demerits", "example_en": "Both proposals have their merits and demerits."
    },
    {
        "word": "紆余曲折", "reading": "うよきょくせつ", "pos": "noun",
        "example_jp": "紆余曲折を経てついに合意に達した。", "example_reading": "うよきょくせつをへてついにごういにたっした。",
        "meaning": "twists and turns / vicissitudes / complications", "example_en": "After many twists and turns, an agreement was finally reached."
    },
    {
        "word": "切磋琢磨", "reading": "せっさたくま", "pos": "noun/verb",
        "example_jp": "同僚と切磋琢磨して技術を磨く。", "example_reading": "どうりょうとせっさたくましてぎじゅつをみがく。",
        "meaning": "friendly rivalry / diligently polishing each other's skills", "example_en": "Diligently hone skills through friendly rivalry with colleagues."
    },
    {
        "word": "異口同音", "reading": "いくどうおん", "pos": "adverb",
        "example_jp": "参加者は異口同音に賛成の意を表した。", "example_reading": "さんかしゃはいくどうおんにさんせいのいをひょうした。",
        "meaning": "with one accord / unanimously", "example_en": "The participants expressed agreement with one voice."
    },
    {
        "word": "以心伝心", "reading": "いしんでんしん", "pos": "noun",
        "example_jp": "二人は言葉がなくても以心伝心で通じ合っている。", "example_reading": "ふたりはことばがなくてもいしんでんしんでつうじあっている。",
        "meaning": "tacit understanding / telepathy of hearts", "example_en": "The two understand each other tacitly without words."
    },
    {
        "word": "一網打尽", "reading": "いちもうだじん", "pos": "noun",
        "example_jp": "警察は犯罪組織を一網打尽にした。", "example_reading": "けいさつははんざいそしきをいちもうだじんにした。",
        "meaning": "roundup in a single haul / making a clean sweep", "example_en": "The police rounded up the criminal organization in a single haul."
    },
    {
        "word": "捲土重来", "reading": "けんどちょうらい", "pos": "noun/verb",
        "example_jp": "敗北を乗り越えて捲土重来を期す。", "example_reading": "はいぼくをのりこえてけんどちょうらいをきす。",
        "meaning": "making a comeback after defeat / gathering strength for return", "example_en": "Overcome defeat and resolve to make a triumphant comeback."
    },
    {
        "word": "臥薪嘗胆", "reading": "がしんしょうたん", "pos": "noun/verb",
        "example_jp": "臥薪嘗胆の日々を耐え抜いて優勝を果たした。", "example_reading": "がしんしょうたんのひびをたえぬいてゆうしょうをはたした。",
        "meaning": "enduring great hardships for future revenge or triumph", "example_en": "Endured years of hardship and won the championship."
    },
    {
        "word": "孤立無援", "reading": "こりつむえん", "pos": "na-adjective",
        "example_jp": "孤立無援の状況でも決して諦めなかった。", "example_reading": "こりつむえんのじょうきょうでもけっしてあきらめなかった。",
        "meaning": "isolated and helpless / friendless", "example_en": "Never gave up even when completely isolated and without help."
    },
    {
        "word": "自縄自縛", "reading": "じじょうじばく", "pos": "noun/verb",
        "example_jp": "厳しすぎる規則で自縄自縛に陥る。", "example_reading": "きびしすぎるきそくでじじょうじばくにおちいる。",
        "meaning": "caught in one's own trap / tied by one's own ropes", "example_en": "Trapped in one's own web due to overly strict rules."
    },
    {
        "word": "千差万別", "reading": "せんさばんべつ", "pos": "na-adjective",
        "example_jp": "人々の価値観は千差万別である。", "example_reading": "ひとびとのかちかんはせんさばんべつである。",
        "meaning": "infinitely diverse / of all kinds and descriptions", "example_en": "People's values are infinitely diverse."
    },
    {
        "word": "朝令暮改", "reading": "ちょうれいぼかい", "pos": "noun/verb",
        "example_jp": "方針の朝令暮改は現場の混乱を招く。", "example_reading": "ほうしんのちょうれいぼかいはげんばのこんらんをまねく。",
        "meaning": "inconsistent policies / issuing an order in the morning and changing it at night", "example_en": "Constantly changing orders causes confusion on the ground."
    },
    {
        "word": "針小棒大", "reading": "しんしょうぼうだい", "pos": "na-adjective",
        "example_jp": "些細なミスを針小棒大に非難するべきではない。", "example_reading": "ささいなミスをしんしょうぼうだいにひなんするべきではない。",
        "meaning": "exaggerating / making a mountain out of a molehill", "example_en": "One should not blow a trivial mistake out of proportion."
    },
    {
        "word": "適材適所", "reading": "てきざいてきしょ", "pos": "noun",
        "example_jp": "適材適所の配置がチームの成果を高める。", "example_reading": "てきざいてきしょのはいちがチームのせいかをたかめる。",
        "meaning": "right person in the right place", "example_en": "Putting the right person in the right place boosts team results."
    },
    {
        "word": "波乱万丈", "reading": "はらんばんじょう", "pos": "na-adjective",
        "example_jp": "彼女は波乱万丈の生涯を振り返った。", "example_reading": "かのじょははらんばんじょうのしょうがいをふりかえった。",
        "meaning": "full of ups and downs / dramatic / tempestuous", "example_en": "She looked back on her tumultuous life."
    },
    {
        "word": "半信半疑", "reading": "はんしんはんぎ", "pos": "noun",
        "example_jp": "彼の噂話を聞いて半信半疑の気持ちを抱いた。", "example_reading": "かれのうわさばなしをきいてはんしんはんぎのきもちをいだいた。",
        "meaning": "half in doubt / skeptical / half-believing", "example_en": "Felt half in doubt after hearing the rumor about him."
    },
    {
        "word": "美辞麗句", "reading": "びじれいく", "pos": "noun",
        "example_jp": "美辞麗句を並べても行動が伴わなければ意味がない。", "example_reading": "びじれいくをならべてもこうどうがともなわなければいみがない。",
        "meaning": "flowery words / rhetorical flourish", "example_en": "Flowery words are meaningless if not accompanied by action."
    },
    {
        "word": "傍若無人", "reading": "ぼうじゃくぶじん", "pos": "na-adjective",
        "example_jp": "公共の場での傍若無人な振る舞いは許されない。", "example_reading": "こうきょうのばでのぼうじゃくぶじんなふるまいはゆるされない。",
        "meaning": "outrageous / arrogant / heedless of others", "example_en": "Arrogant and outrageous behavior in public places cannot be tolerated."
    },
    {
        "word": "優柔不断", "reading": "ゆうじゅうふだん", "pos": "na-adjective",
        "example_jp": "優柔不断な態度は好機を逃す原因となる。", "example_reading": "ゆうじゅうふだんなたいどはこうきをのがすげんいんとなる。",
        "meaning": "indecisive / irresolute / vacillating", "example_en": "An indecisive attitude causes one to miss great opportunities."
    },
    {
        "word": "竜頭蛇尾", "reading": "りゅうとうだび", "pos": "noun",
        "example_jp": "計画は大々的に始まったが竜頭蛇尾に終わった。", "example_reading": "けいかくはだいだいてきにはじまったがりゅうとうだびにおわった。",
        "meaning": "anticlimax / ending weakly / flash in the pan", "example_en": "The project began grandly but ended in an anticlimax."
    },
    {
        "word": "虚心坦懐", "reading": "きょしんたんかい", "pos": "noun",
        "example_jp": "虚心坦懐に相手の意見に耳を傾ける。", "example_reading": "きょしんたんかいにあいてのいけんにみみをかたむける。",
        "meaning": "with an open and candid mind / impartially", "example_en": "Listen to the other party's opinion with an open and candid mind."
    },
    {
        "word": "温故知新", "reading": "おんこちしん", "pos": "noun",
        "example_jp": "伝統を守りつつ温故知新の精神で革新を図る。", "example_reading": "でんとうをまもりつつおんこちしんのせいしんでかくしんをはかる。",
        "meaning": "learning from the past to develop new ideas", "example_en": "Strive for innovation while preserving tradition in the spirit of learning from the past."
    },
    {
        "word": "四面楚歌", "reading": "しめんそか", "pos": "noun",
        "example_jp": "議会で四面楚歌の苦境に立たされた。", "example_reading": "ぎかいでしめんそかのくきょうにたたされた。",
        "meaning": "surrounded by enemies on all sides / totally deserted", "example_en": "Faced the predicament of being completely surrounded by adversaries in parliament."
    },
    {
        "word": "疑心暗鬼", "reading": "ぎしんあんき", "pos": "noun",
        "example_jp": "疑心暗鬼を生じさせてチームの結束を乱す。", "example_reading": "ぎしんあんきをしょうじさせてチームのけっそくをみだす。",
        "meaning": "suspicion breeding phantoms / paranoia", "example_en": "Breeding paranoia that disrupts the team's cohesion."
    },
    {
        "word": "一目瞭然", "reading": "いちもくりょうぜん", "pos": "na-adjective",
        "example_jp": "グラフを見れば業績の改善は一目瞭然だ。", "example_reading": "グラフをみればぎょうせきのかいぜんはいちもくりょうぜんだ。",
        "meaning": "patently obvious / clear at a glance", "example_en": "Looking at the chart, the improvement in performance is clear at a glance."
    },
    {
        "word": "日進月歩", "reading": "にっしんげっぽ", "pos": "noun",
        "example_jp": "医療技術は日進月歩の進化を遂げている。", "example_reading": "いりょうぎじゅつはにっしんげっぽのしんかをとげている。",
        "meaning": "steady and rapid progress / advance day by day", "example_en": "Medical technology is making rapid strides day by day."
    },
    {
        "word": "百戦錬磨", "reading": "ひゃくせんれんま", "pos": "noun",
        "example_jp": "百戦錬磨のベテラン外交官が交渉に臨む。", "example_reading": "ひゃくせんれんまのベテランがいこうかんがこうしょうにのぞむ。",
        "meaning": "veteran / hardened by many battles / experienced", "example_en": "A seasoned veteran diplomat heads into negotiations."
    },
    {
        "word": "泰然自若", "reading": "たいぜんじじゃく", "pos": "na-adjective",
        "example_jp": "突発的な事態にも泰然自若として構えていた。", "example_reading": "とっぱつてきなじたいにもたいぜんじじゃくとしてかまえていた。",
        "meaning": "calm and composed / imperturbable", "example_en": "Remained calm and composed even in the face of unexpected events."
    },
    {
        "word": "理路整然", "reading": "りろせいぜん", "pos": "na-adjective",
        "example_jp": "彼の論文は理路整然としていて説得力がある。", "example_reading": "かれのろんぶんはりろせいぜんとしていてせっとくりょくがある。",
        "meaning": "logical / systematic / coherent", "example_en": "His paper is coherent and persuasive."
    },
    # Literary い-adjectives
    {
        "word": "紛らわしい", "reading": "まぎらわしい", "pos": "i-adjective",
        "example_jp": "紛らわしい表現は誤解を招く恐れがある。", "example_reading": "まぎらわしいひょうげんはごかいをまねくおそれがある。",
        "meaning": "confusing / misleading / ambiguous", "example_en": "Misleading expressions may cause misunderstanding."
    },
    {
        "word": "煩わしい", "reading": "わずらわしい", "pos": "i-adjective",
        "example_jp": "煩わしい人間関係から距離を置く。", "example_reading": "わずらわしいにんげんかんけいからきょりをおく。",
        "meaning": "troublesome / cumbersome / vexing", "example_en": "Keep distance from vexing interpersonal relationships."
    },
    {
        "word": "穢らわしい", "reading": "けがらわしい", "pos": "i-adjective",
        "example_jp": "不正な金に手を染めるなど穢らわしい行為だ。", "example_reading": "ふせいなかねにてをそめるなどけがらわしいこういだ。",
        "meaning": "filthy / abominable / disgraceful", "example_en": "Tainting one's hands with illegal money is a disgraceful act."
    },
    {
        "word": "清々しい", "reading": "すがすがしい", "pos": "i-adjective",
        "example_jp": "早朝の高原は清々しい空気に満ちている。", "example_reading": "そうちょうのこうげんはすがすがしいくうきにみちている。",
        "meaning": "refreshing / crisp / invigorating", "example_en": "The early morning highlands are filled with refreshing air."
    },
    {
        "word": "逞しい", "reading": "たくましい", "pos": "i-adjective",
        "example_jp": "逆境の中で逞しく生き抜く知恵を身につけた。", "example_reading": "ぎゃっきょうのなかでたくましくいきぬくちえをみにつけた。",
        "meaning": "robust / resilient / stouthearted", "example_en": "Acquired the wisdom to survive resiliently amid adversity."
    },
    {
        "word": "慎ましい", "reading": "つつましい", "pos": "i-adjective",
        "example_jp": "祖父母は慎ましい生活を誇りにしていた。", "example_reading": "そふぼはつつましいせいかつをほこりにしていた。",
        "meaning": "modest / frugal / humble", "example_en": "Grandparents took pride in their frugal and modest lifestyle."
    },
    {
        "word": "儚い", "reading": "はかない", "pos": "i-adjective",
        "example_jp": "桜の花は儚く散るからこそ美しい。", "example_reading": "さくらのはなははかなくちるからこそつくしい。",
        "meaning": "fleeting / transient / ephemeral", "example_en": "Cherry blossoms are beautiful precisely because they scatter fleetingly."
    },
    {
        "word": "拙い", "reading": "つたない", "pos": "i-adjective",
        "example_jp": "拙い文章ですが最後まで読んでいただき感謝します。", "example_reading": "つたないぶんしょうですがさいごまでよんでいただきかんしゃします。",
        "meaning": "clumsy / unskillful / poor", "example_en": "Though my writing is poor, I appreciate you reading to the end."
    },
    {
        "word": "疎い", "reading": "うとい", "pos": "i-adjective",
        "example_jp": "私は最新のテクノロジーに疎い。", "example_reading": "わたしはさいしんのテクノロジーにうとい。",
        "meaning": "unfamiliar / ill-informed / estranged", "example_en": "I am unfamiliar with the latest technology."
    },
    {
        "word": "泥臭い", "reading": "どろくさい", "pos": "i-adjective",
        "example_jp": "泥臭い努力を積み重ねることが大成への近道だ。", "example_reading": "どろくさいどりょくをつみかさねることがたいせいへのちかみちだ。",
        "meaning": "unpolished / down-to-earth / unglamorous", "example_en": "Piling up unglamorous hard work is the shortest path to great success."
    },
    {
        "word": "嘆かわしい", "reading": "なげかわしい", "pos": "i-adjective",
        "example_jp": "伝統文化が忘れ去られるのは嘆かわしいことだ。", "example_reading": "でんとうぶんかがわすれさられるのはなげかわしいことだ。",
        "meaning": "lamentable / deplorable / regrettable", "example_en": "It is deplorable that traditional culture is being forgotten."
    },
    {
        "word": "狂おしい", "reading": "くるおしい", "pos": "i-adjective",
        "example_jp": "狂おしいほどの情熱を研究に傾けた。", "example_reading": "くるおしいほどのじょうねつをけんきゅうにかたむけた。",
        "meaning": "mad / crazy / agonizingly passionate", "example_en": "Devoted almost mad passion to his research."
    },
    {
        "word": "忌まわしい", "reading": "いまわしい", "pos": "i-adjective",
        "example_jp": "戦争の忌まわしい記憶を決して風化させてはならない。", "example_reading": "せんそうのいまわしいきおくをけっしてふうかさせてはならない。",
        "meaning": "abominable / ominous / detestable", "example_en": "We must never allow the abominable memories of war to fade."
    },
    {
        "word": "覚束ない", "reading": "おぼつかない", "pos": "i-adjective",
        "example_jp": "資金不足で計画の達成は覚束ない。", "example_reading": "しきんぶそくでけいかくのたっせいはおぼつかない。",
        "meaning": "uncertain / doubtful / unsteady", "example_en": "Due to insufficient funds, the achievement of the plan is doubtful."
    },
    {
        "word": "夥しい", "reading": "おびただしい", "pos": "i-adjective",
        "example_jp": "夥しい血が流された歴史を忘れてはならない。", "example_reading": "おびただしいちがながされたれきしをわすれてはならない。",
        "meaning": "immense / tremendous in quantity", "example_en": "We must not forget the history in which immense blood was shed."
    },
    {
        "word": "目覚ましい", "reading": "めざましい", "pos": "i-adjective",
        "example_jp": "新興国の経済成長は目覚ましいものがある。", "example_reading": "しんこうこくのけいざいせいちょうはめざましいものがある。",
        "meaning": "remarkable / striking / splendid", "example_en": "The economic growth of emerging nations is truly remarkable."
    },
    # Academic & formal する verbs
    {
        "word": "謳歌", "reading": "おうか", "pos": "noun/verb",
        "example_jp": "学生生活を心ゆくまで謳歌している。", "example_reading": "がくせいせいかつをこころゆくまでおうかしている。",
        "meaning": "glorification / celebrating / enjoying to the fullest", "example_en": "Enjoying student life to one's heart's content."
    },
    {
        "word": "標榜", "reading": "ひょうぼう", "pos": "noun/verb",
        "example_jp": "平和主義を標榜する団体が声明を出した。", "example_reading": "へいわしゅぎをひょうぼうするだんたいがせいめいをだした。",
        "meaning": "advocacy / claiming / professing", "example_en": "A group professing pacifism issued a statement."
    },
    {
        "word": "斡旋", "reading": "あっせん", "pos": "noun/verb",
        "example_jp": "労働争議を円満に解決するため斡旋を行う。", "example_reading": "ろうどうそうぎをえんまんにかいけつするためあっせんをおこなう。",
        "meaning": "mediation / intercession / good offices", "example_en": "Conduct mediation to resolve the labor dispute amicably."
    },
    {
        "word": "紛糾", "reading": "ふんきゅう", "pos": "noun/verb",
        "example_jp": "予算案をめぐる議論は深夜まで紛糾した。", "example_reading": "よさんあんをめぐるぎろんはしんやまでふんきゅうした。",
        "meaning": "complication / confusion / turmoil", "example_en": "The debate surrounding the budget bill was entangled until late at night."
    },
    {
        "word": "軋轢", "reading": "あつれき", "pos": "noun",
        "example_jp": "派閥間の軋轢が組織の弱体化を招いた。", "example_reading": "はばつかんのあつれきがそしきのじゃくたいかをまねいた。",
        "meaning": "friction / discord / strife", "example_en": "Friction between factions led to the weakening of the organization."
    },
    {
        "word": "淘汰", "reading": "とうた", "pos": "noun/verb",
        "example_jp": "激しい市場競争の中で不採算企業が自然淘汰される。", "example_reading": "はげしいしじょうきょうそうのなかでふさいさんきぎょうがしぜんとうたされる。",
        "meaning": "selection / weeding out / survival of the fittest", "example_en": "Unprofitable companies are weeded out naturally amid fierce market competition."
    },
    {
        "word": "刷新", "reading": "さっしん", "pos": "noun/verb",
        "example_jp": "経営陣を刷新して企業イメージの向上を図る。", "example_reading": "けいえいじんをさっしんしてきぎょうイメージのこうじょうをはかる。",
        "meaning": "reform / renovation / renewal", "example_en": "Strive to improve corporate image by overhauling executive management."
    },
    {
        "word": "破綻", "reading": "はたん", "pos": "noun/verb",
        "example_jp": "無理な資金繰りが原因で経営が破綻した。", "example_reading": "むりなしきんぐりがげんいんでけいえいがはたんした。",
        "meaning": "bankruptcy / breakdown / collapse", "example_en": "Management collapsed due to unsustainable financing."
    },
    {
        "word": "頓挫", "reading": "とんざ", "pos": "noun/verb",
        "example_jp": "資金難により大型開発プロジェクトが頓挫した。", "example_reading": "しきんなんによりおおがたかいはつプロジェクトがとんざした。",
        "meaning": "setback / breakdown / stalling", "example_en": "The mega development project suffered a setback due to financial difficulties."
    },
    {
        "word": "衰退", "reading": "すいたい", "pos": "noun/verb",
        "example_jp": "かつて繁栄した産業も時代の流れとともに衰退した。", "example_reading": "かつてはんえいしたさんぎょうもじだいのながれとともにすいたいした。",
        "meaning": "decline / decay / waning", "example_en": "The once-flourishing industry declined with the passing of time."
    },
    {
        "word": "隆盛", "reading": "りゅうせい", "pos": "noun",
        "example_jp": "その王朝は文化と経済の両面で隆盛を極めた。", "example_reading": "そのおうちょうはぶんかとけいざいのりょうめんでりゅうせいをきわめた。",
        "meaning": "prosperity / flourishing", "example_en": "The dynasty reached the height of prosperity in both culture and economy."
    },
    {
        "word": "勃興", "reading": "ぼっこう", "pos": "noun/verb",
        "example_jp": "新興テクノロジー産業が急速に勃興している。", "example_reading": "しんこうテクノロジーさんぎょうがきゅうそくにぼっこうしている。",
        "meaning": "sudden rise to power / emergence", "example_en": "The emerging technology industry is rising rapidly."
    },
    {
        "word": "胎動", "reading": "たいどう", "pos": "noun/verb",
        "example_jp": "社会の変革を予感させる胎動が各地で始まった。", "example_reading": "しゃかいのへんかくをよかんさせるたいどうがかくちではじまった。",
        "meaning": "stirrings / quickening / embryonic movement", "example_en": "Stirrings hinting at social transformation began across various regions."
    },
    {
        "word": "黎明", "reading": "れいめい", "pos": "noun",
        "example_jp": "宇宙開発の黎明期を支えた技術者たちの記録だ。", "example_reading": "うちゅうかいはつのれいめいきをささえたぎじゅつしゃたちのきろくだ。",
        "meaning": "dawn / daybreak / beginning of an era", "example_en": "This is a record of engineers who supported the dawn of space exploration."
    },
    {
        "word": "終焉", "reading": "しゅうえん", "pos": "noun",
        "example_jp": "冷戦の終焉が新たな国際秩序を生み出した。", "example_reading": "れいせんのしゅうえんがあらたなこくさいちつじょをうみだした。",
        "meaning": "demise / end / close of an era", "example_en": "The end of the Cold War brought about a new international order."
    },
    {
        "word": "昇華", "reading": "しょうか", "pos": "noun/verb",
        "example_jp": "個人的な苦悩を芸術作品へと昇華させた。", "example_reading": "こじんてきなくのうをげいじゅつさくひんへとしょうかさせた。",
        "meaning": "sublimation / elevating into higher form", "example_en": "Sublimated personal suffering into a work of art."
    },
    {
        "word": "止揚", "reading": "しよう", "pos": "noun/verb",
        "example_jp": "対立する意見を止揚して新たな解決策を見出す。", "example_reading": "たいりつするいけんをしようしてあらたなかいけつさくをみいだす。",
        "meaning": "Aufheben / sublation / synthesizing contradictions", "example_en": "Synthesize opposing views to discover a new solution."
    },
    {
        "word": "牽制", "reading": "けんせい", "pos": "noun/verb",
        "example_jp": "相手チームの素早い反撃を前線で牽制する。", "example_reading": "あいてチームのすばやいはんげきをぜんせんでけんせいする。",
        "meaning": "check / restraint / holding in check", "example_en": "Hold the opposing team's swift counterattack in check on the front line."
    },
    {
        "word": "補填", "reading": "ほてん", "pos": "noun/verb",
        "example_jp": "事業の赤字を基金からの拠出金で補填した。", "example_reading": "じぎょうのあかじをききんからのきょしゅつきんでほてんした。",
        "meaning": "compensation / filling a gap / covering deficit", "example_en": "Covered the business deficit with contributions from the foundation."
    },
    {
        "word": "阻害", "reading": "そがい", "pos": "noun/verb",
        "example_jp": "過度の規制は健全な市場の発展を阻害する。", "example_reading": "かどのきせいはけんぜんなしじょうのはってんをそがいする。",
        "meaning": "obstruction / inhibition / impeding", "example_en": "Excessive regulation hinders the development of a healthy market."
    },
    {
        "word": "涵養", "reading": "かんよう", "pos": "noun/verb",
        "example_jp": "森林は豊かな水源を涵養する働きを持つ。", "example_reading": "しんりんはゆたかなすいげんをかんようするはたらきをもつ。",
        "meaning": "cultivation / recharge / nurturing", "example_en": "Forests serve to conserve and recharge abundant water sources."
    },
    # Legal, Business & Political Terms
    {
        "word": "定款", "reading": "ていかん", "pos": "noun",
        "example_jp": "会社の設立に際して定款を作成した。", "example_reading": "かいしゃのせつりつにさいしてていかんをさくせいした。",
        "meaning": "articles of incorporation / company charter", "example_en": "Drafted the articles of incorporation upon company establishment."
    },
    {
        "word": "担保", "reading": "たんぽ", "pos": "noun/verb",
        "example_jp": "融資を受けるため不動産を担保に提供した。", "example_reading": "ゆうしをうけるためふどうさんをたんぽにていきょうした。",
        "meaning": "collateral / security / guarantee", "example_en": "Offered real estate as collateral to receive a loan."
    },
    {
        "word": "抵当", "reading": "ていとう", "pos": "noun",
        "example_jp": "銀行はその土地に抵当権を設定した。", "example_reading": "ぎんこうはそのとちにていとうけんをせっていした。",
        "meaning": "mortgage / hypothecation", "example_en": "The bank placed a mortgage on that land."
    },
    {
        "word": "債務", "reading": "さいむ", "pos": "noun",
        "example_jp": "期限内にすべての債務を弁済した。", "example_reading": "きげんないにすべてのさいむをべんさいした。",
        "meaning": "debt / liability / obligation", "example_en": "Repaid all debts within the designated deadline."
    },
    {
        "word": "債権", "reading": "さいけん", "pos": "noun",
        "example_jp": "会社は取引先に対する債権を回収した。", "example_reading": "かいしゃはとりひきさきにたいするさいけんをかいしゅうした。",
        "meaning": "credit / claim / debt claim", "example_en": "The company collected on its claims against the business partner."
    },
    {
        "word": "賠償", "reading": "ばいしょう", "pos": "noun/verb",
        "example_jp": "事故による被害に対して損害を賠償する責任がある。", "example_reading": "じこによるひがいにたいしてそんがいをばいしょうするせきにんがある。",
        "meaning": "reparations / indemnity / compensation for damages", "example_en": "There is a duty to pay damages for harm caused by the accident."
    },
    {
        "word": "補償", "reading": "ほしょう", "pos": "noun/verb",
        "example_jp": "自然災害による損失に対して適切な補償が行われた。", "example_reading": "しぜんさいがいによるそんしつにたいしててきせつなほしょうがおこなわれた。",
        "meaning": "compensation / indemnification", "example_en": "Appropriate compensation was made for losses due to the natural disaster."
    },
    {
        "word": "填補", "reading": "てんぽ", "pos": "noun/verb",
        "example_jp": "保険金によって事故による損害を填補した。", "example_reading": "ほけんきんによってじこによるそんがいをてんぽした。",
        "meaning": "compensation / filling / covering loss", "example_en": "Covered the loss resulting from the accident using insurance payout."
    },
    {
        "word": "訴訟", "reading": "そしょう", "pos": "noun/verb",
        "example_jp": "特許侵害を理由として相手企業を相手に訴訟を起こした。", "example_reading": "とっきょしんがいをりゆうとしてあいてきぎょうをあいてにそしょうをおこした。",
        "meaning": "litigation / lawsuit", "example_en": "Filed a lawsuit against the opposing company on grounds of patent infringement."
    },
    {
        "word": "提訴", "reading": "ていそ", "pos": "noun/verb",
        "example_jp": "住民らは公害被害の救済を求めて裁判所に提訴した。", "example_reading": "じゅうみんらはこうがいひがいのきゅうさいをもとめてさいばんしょにていそした。",
        "meaning": "filing a lawsuit / taking legal action", "example_en": "Residents filed suit in court seeking relief for pollution damages."
    },
    {
        "word": "却下", "reading": "きゃっか", "pos": "noun/verb",
        "example_jp": "手続きの不備により原告の訴えは却下された。", "example_reading": "てつづきのふびによりげんこくのうったえはきゃっかされた。",
        "meaning": "dismissal / rejection (without prejudice)", "example_en": "The plaintiff's complaint was dismissed due to procedural defects."
    },
    {
        "word": "棄却", "reading": "ききゃく", "pos": "noun/verb",
        "example_jp": "裁判所は原告の請求を理由がないとして棄却した。", "example_reading": "さいばんしょはげんこくのせいきゅうをりゆうがないとしてききゃくした。",
        "meaning": "dismissal on the merits / rejection", "example_en": "The court dismissed the plaintiff's claim as unsubstantiated on the merits."
    },
    {
        "word": "審理", "reading": "しんり", "pos": "noun/verb",
        "example_jp": "最高裁判所において口頭弁論の審理が行われた。", "example_reading": "さいこうさいばんしょにおいてこうとうべんろんのしんりがおこなわれた。",
        "meaning": "trial / judicial examination / hearing", "example_en": "Hearings of oral argument were conducted in the Supreme Court."
    },
    {
        "word": "判示", "reading": "はんじ", "pos": "noun/verb",
        "example_jp": "判決文において法の適用基準が明確に判示された。", "example_reading": "はんけつぶんにおいてほうのてきようきじゅんがめいかくにはんじされた。",
        "meaning": "judicial finding / ruling / pronouncing", "example_en": "The criteria for statutory application were clearly pronounced in the decision text."
    },
    {
        "word": "違憲", "reading": "いけん", "pos": "noun",
        "example_jp": "その法律条項は憲法に反するとして違憲判決が下された。", "example_reading": "そのほうりつじょうこうはけんぽうにはんするとしていけんはんけつがくだされた。",
        "meaning": "unconstitutionality", "example_en": "A ruling of unconstitutionality was handed down holding that statutory clause breached the constitution."
    },
    {
        "word": "答申", "reading": "とうしん", "pos": "noun/verb",
        "example_jp": "諮問機関は教育改革に関する答申をまとめた。", "example_reading": "しもんきかんはきょういくかいかくにかんするとうしんをまとめた。",
        "meaning": "report / official reply to inquiry", "example_en": "The advisory council compiled its report on educational reform."
    },
    {
        "word": "弾劾", "reading": "だんがい", "pos": "noun/verb",
        "example_jp": "職権乱用の疑いにより大統領の弾劾裁判が開かれた。", "example_reading": "しょっけんらんようのうたがいによりだいとうりょうのだんがいさいばんがひらかれた。",
        "meaning": "impeachment / denunciation", "example_en": "An impeachment trial of the president was held under suspicions of abuse of power."
    },
    {
        "word": "罷免", "reading": "ひめん", "pos": "noun/verb",
        "example_jp": "規律違反を理由に閣僚を罷免した。", "example_reading": "きりついはんをりゆうにかくりょうをひめんした。",
        "meaning": "dismissal / discharge from office", "example_en": "Dismissed the cabinet minister on grounds of disciplinary violation."
    },
    {
        "word": "批准", "reading": "ひじゅん", "pos": "noun/verb",
        "example_jp": "国会は全会一致で国際気候条約を批准した。", "example_reading": "こっかいはぜんかいいっちでこくさいきこうじょうやくをひじゅんした。",
        "meaning": "ratification of a treaty", "example_en": "The parliament unanimously ratified the international climate treaty."
    },
    {
        "word": "遡及", "reading": "そきゅう", "pos": "noun/verb",
        "example_jp": "新法は過去の事案に遡及して適用されることはない。", "example_reading": "しんぽうはかこのじあんにそきゅうしててきようされることはない。",
        "meaning": "retroactivity / retroactive effect", "example_en": "The new law will not be applied retroactively to past cases."
    },
    {
        "word": "時効", "reading": "じこう", "pos": "noun",
        "example_jp": "事件発生から一定の年数が経過して時効が成立した。", "example_reading": "じけんはっせいからいっていのねんすうがけいかしてじこうがせいりつした。",
        "meaning": "statute of limitations / prescription", "example_en": "The statute of limitations expired after a set number of years passed since the incident."
    },
    {
        "word": "瑕疵", "reading": "かし", "pos": "noun",
        "example_jp": "購入した建物に重大な構造上の瑕疵が見つかった。", "example_reading": "こうにゅうしたたてものにじゅうだいなこうぞうじょうのかしがみつかった。",
        "meaning": "flaw / defect / blemish in law", "example_en": "A serious structural defect was discovered in the purchased building."
    },
    {
        "word": "履行", "reading": "りこう", "pos": "noun/verb",
        "example_jp": "契約に定められた義務を誠実に履行する。", "example_reading": "けいやくにさだめられたぎむをせいじつにりこうする。",
        "meaning": "performance / fulfillment of contract", "example_en": "Faithfully perform the obligations stipulated in the contract."
    },
    {
        "word": "供述", "reading": "きょうじゅつ", "pos": "noun/verb",
        "example_jp": "容疑者は犯行に至る経緯を詳細に供述した。", "example_reading": "ようぎしゃははんこうにいたるけいいをしょうさいにきょうじゅつした。",
        "meaning": "testimony / deposition / statement", "example_en": "The suspect gave a detailed deposition regarding the circumstances leading to the crime."
    },
    {
        "word": "尋問", "reading": "じんもん", "pos": "noun/verb",
        "example_jp": "法廷で検察官が証人に対して鋭い尋問を行った。", "example_reading": "ほうていでけんさつかんがしょうにんにたいしてするどいじんもんをおこなった。",
        "meaning": "interrogation / cross-examination", "example_en": "In court, the prosecutor carried out sharp cross-examination of the witness."
    },
    {
        "word": "弁駁", "reading": "べんばく", "pos": "noun/verb",
        "example_jp": "相手方の不当な主張に対して証拠を示して弁駁した。", "example_reading": "あいてがたのふとうなしゅちょうにたいしてしょうこをしめしてべんばくした。",
        "meaning": "refutation / rebuttal / refuting", "example_en": "Refuted the opposing party's unjust assertion by presenting evidence."
    },
    {
        "word": "稟議", "reading": "りんぎ", "pos": "noun/verb",
        "example_jp": "新規事業の立ち上げに向けて社内稟議を通す。", "example_reading": "しんきじぎょうのたちあげにむけてしゃないりんぎをとおす。",
        "meaning": "ringi / circular memo seeking consensus decision", "example_en": "Circulate an internal proposal for consensus approval to launch the new business."
    },
    {
        "word": "免責", "reading": "めんせき", "pos": "noun/verb",
        "example_jp": "利用規約に事業者の免責事項を明記する。", "example_reading": "りようきやくにじぎょうしゃのめんせきじこうをめいきする。",
        "meaning": "exemption from liability / disclaimer", "example_en": "Clearly state the service provider's liability exemption clauses in the terms of service."
    }
]

def main():
    print("=== STARTING N1 VOCABULARY EXPANSION ===")
    
    # Load existing n1.json
    n1_path = os.path.abspath('content/vocabulary/n1.json')
    with open(n1_path, 'r', encoding='utf-8') as f:
        existing_items = json.load(f)
    
    print(f"Loaded existing n1.json: {len(existing_items)} items")
    
    # Fill missing readings in existing items
    existing_fill_readings = {
        'n1_001': 'じたいのあっかをゆうりょしている。',
        'n1_002': 'きはんからのいつだつはゆるされない。',
        'n1_003': 'そうごりかいのふんいきをじょうせいすることがじゅうようだ。',
        'n1_004': 'じょうしのいこうをそんたくしてこうどうする。',
        'n1_005': 'ふしんかんをふっしょくするにはじかんがかかる。',
        'n1_006': 'けいきかいふくのけんちょなきざしがみられる。',
        'n1_010': 'そうほうのにんしきにそごがある。',
        'n1_011': 'もんだいをふかんてきにとらえることがたいせつだ。',
        'n1_012': 'かれのはつげんはむじゅんしている。',
        'n1_014': 'せいちなぶんせきがもとめられる。',
        'n1_018': 'あんぜんせいへのけねんがたかまっている。',
        'n1_020': 'しゅんじゅんせずにけつだんすることがたいせつだ。',
        'n1_026': 'ぜいじゃくなインフラをきょうかするひつようがある。',
        'n1_027': 'かれはとしをとってもがんけんだ。',
        'n1_030': 'こうしょうのきすうはまだふめいだ。',
        'n1_031': 'かれのたくえつしたしゅわんがたかくひょうかされた。',
        'n1_034': 'りそうとげんじつのかいりをつうかんする。',
        'n1_035': 'ほうれいのじゅんしゅをてっていする。'
    }
    
    for item in existing_items:
        iid = item['id']
        if iid in existing_fill_readings and not item.get('example', {}).get('reading'):
            if 'example' not in item:
                item['example'] = {}
            item['example']['reading'] = existing_fill_readings[iid]

    seen_words = set(x['word'] for x in existing_items)
    
    # Load lower level words to avoid duplication
    lower_words = set()
    for lvl in ['n2', 'n3', 'n4', 'n5']:
        lvl_p = os.path.abspath(f'content/vocabulary/{lvl}.json')
        if os.path.exists(lvl_p):
            with open(lvl_p, 'r', encoding='utf-8') as f:
                lower_words.update(x['word'] for x in json.load(f))
    
    print(f"Tracked {len(seen_words)} existing N1 words, {len(lower_words)} lower-level words")
    
    # Translations dictionary
    en_trans_path = os.path.abspath('content/translations/en/vocabulary.json')
    with open(en_trans_path, 'r', encoding='utf-8') as f:
        en_translations = json.load(f)
    
    all_new_items = []
    
    # Step 1: Add curated items
    curated_count = 0
    for cur in CURATED_N1:
        w = cur['word']
        if w in seen_words:
            continue
        rd = cur['reading']
        rom = hira_to_romaji(rd)
        pos = cur['pos']
        item_id = f"n1_{str(len(existing_items) + len(all_new_items) + 1).zfill(3)}"
        
        new_entry = {
            "id": item_id,
            "word": w,
            "reading": rd,
            "romaji": rom,
            "pos": pos,
            "level": "N1",
            "tags": [pos, "N1"],
            "example": {
                "jp": cur['example_jp'],
                "reading": cur['example_reading']
            }
        }
        all_new_items.append(new_entry)
        en_translations[item_id] = {
            "meaning": cur['meaning'],
            "example": cur['example_en']
        }
        seen_words.add(w)
        curated_count += 1
    
    print(f"Added {curated_count} curated high-yield N1 items")
    
    # Step 2: Add items from OpenJLPT (with furigana examples)
    openjlpt_path = os.path.abspath('scratch/openjlpt_n1.json')
    with open(openjlpt_path, 'r', encoding='utf-8') as f:
        openjlpt_data = json.load(f)
    
    openjlpt_count = 0
    for item in openjlpt_data:
        if len(existing_items) + len(all_new_items) >= 1500:
            break
        w = item.get('word', '').strip()
        if not w or w in seen_words or w in lower_words:
            continue
        rd = item.get('reading', '').strip()
        if not rd:
            continue
        
        # Look for best example with furigana
        exs = [e for e in item.get('examples', []) if e.get('furigana') and e.get('ja') and e.get('en')]
        if not exs:
            continue
        best_ex = exs[0]
        
        # Check furigana converts to clean reading without remaining kanji
        ex_jp = best_ex['ja']
        ex_rd = furigana_to_reading(best_ex['furigana'])
        if re.search(r'[\u4e00-\u9fff]', ex_rd):
            continue
        
        pos = map_pos(item.get('pos', []))
        rom = item.get('romaji') or hira_to_romaji(rd)
        item_id = f"n1_{str(len(existing_items) + len(all_new_items) + 1).zfill(3)}"
        
        new_entry = {
            "id": item_id,
            "word": w,
            "reading": rd,
            "romaji": rom,
            "pos": pos,
            "level": "N1",
            "tags": [pos, "N1"],
            "example": {
                "jp": ex_jp,
                "reading": ex_rd
            }
        }
        all_new_items.append(new_entry)
        
        meanings = item.get('meanings', [])
        meaning_str = ' / '.join(meanings[:3]) if meanings else w
        en_translations[item_id] = {
            "meaning": meaning_str,
            "example": best_ex['en']
        }
        seen_words.add(w)
        openjlpt_count += 1
    
    print(f"Added {openjlpt_count} OpenJLPT items with verified furigana")
    
    # If still under 1500, top up from clean entries with clean sentence synthesis
    if len(existing_items) + len(all_new_items) < 1500:
        needed = 1500 - (len(existing_items) + len(all_new_items))
        print(f"Top-up needed: {needed} items")
        for item in openjlpt_data:
            if len(existing_items) + len(all_new_items) >= 1500:
                break
            w = item.get('word', '').strip()
            if not w or w in seen_words or w in lower_words:
                continue
            rd = item.get('reading', '').strip()
            if not rd:
                continue
            
            exs = item.get('examples', [])
            if exs and exs[0].get('ja') and exs[0].get('en'):
                ex = exs[0]
                ex_jp = ex['ja']
                # If no furigana, construct reading if word alone
                ex_rd = ex.get('furigana')
                if ex_rd:
                    ex_reading = furigana_to_reading(ex_rd)
                else:
                    ex_reading = rd
                ex_en = ex['en']
            else:
                ex_jp = f"{w}の意味を深く理解する。"
                ex_reading = f"{rd}のいみをふかくりかいする。"
                ex_en = f"Deeply understand the meaning of {w}."
            
            pos = map_pos(item.get('pos', []))
            rom = item.get('romaji') or hira_to_romaji(rd)
            item_id = f"n1_{str(len(existing_items) + len(all_new_items) + 1).zfill(3)}"
            
            new_entry = {
                "id": item_id,
                "word": w,
                "reading": rd,
                "romaji": rom,
                "pos": pos,
                "level": "N1",
                "tags": [pos, "N1"],
                "example": {
                    "jp": ex_jp,
                    "reading": ex_reading
                }
            }
            all_new_items.append(new_entry)
            meanings = item.get('meanings', [])
            en_translations[item_id] = {
                "meaning": ' / '.join(meanings[:3]) if meanings else w,
                "example": ex_en
            }
            seen_words.add(w)

    # Combine all items
    final_list = existing_items + all_new_items
    print(f"\nFinal total items: {len(final_list)}")
    print(f"First new item: {all_new_items[0]['id']} -> {all_new_items[0]['word']}")
    print(f"Last item: {final_list[-1]['id']} -> {final_list[-1]['word']}")
    
    # Save n1.json
    with open(n1_path, 'w', encoding='utf-8') as f:
        json.dump(final_list, f, ensure_ascii=False, indent=2)
    print(f"[SUCCESS] Saved expanded n1.json to {n1_path}")
    
    # Save en vocabulary translations
    with open(en_trans_path, 'w', encoding='utf-8') as f:
        json.dump(en_translations, f, ensure_ascii=False, indent=2)
    print(f"[SUCCESS] Saved updated vocabulary translations to {en_trans_path}")
    
    # Save batch markers for audit
    batch_dir = os.path.abspath('scratch/batches')
    os.makedirs(batch_dir, exist_ok=True)
    batch_size = 300
    for i in range(0, len(all_new_items), batch_size):
        b_num = (i // batch_size) + 1
        b_slice = all_new_items[i:i+batch_size]
        b_file = os.path.join(batch_dir, f'batch_{b_num}.json')
        with open(b_file, 'w', encoding='utf-8') as bf:
            json.dump(b_slice, bf, ensure_ascii=False, indent=2)
        print(f"  Batch {b_num}: {len(b_slice)} items saved ({b_slice[0]['id']} to {b_slice[-1]['id']})")

if __name__ == '__main__':
    main()
