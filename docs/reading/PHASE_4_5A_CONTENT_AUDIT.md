# Phase 4.5A Content Audit: Sentence-by-Sentence Linguistic & Pedagogical Review

**Document Version:** 1.0.0  
**Audit Date:** October 2026  
**Audited Stories:** 6 stories (4 JLPT N5, 2 JLPT N4; 52 sentences total)  
**Corpus Files:** `src/data/reading/n5_stories.js`, `src/data/reading/n4_stories.js`

---

## 1. Executive Summary

This linguistic and pedagogical audit conducts an exhaustive, sentence-by-sentence evaluation of all six graded readers currently implemented in Nihongo Master. Each sentence has been scrutinized for:
1. **JLPT Level Alignment:** Grammatical structures, vocabulary frequency, and sentence complexity appropriate to N5 and N4.
2. **Authored Furigana Fidelity:** Explicit bracket notation `漢字[よみ]` validating correctly against `furiganaUtils.js` without ruby bleeding, misparsed compound kanji, or syntax anomalies.
3. **Interactive Tokenization & Dictionary Grounding:** Exact token splits matching vocabulary keys in `readingTokenizer.ts` and `VocabLookupModal.jsx`.
4. **Pitch-Accent Grounding:** Verified pitch contours referencing NHK Consensus / Kanjium CC BY-SA 4.0 (`VERIFIED_PITCH_DICTIONARY`), with unverified entries explicitly designated `pitchVerified: false`.
5. **Comprehension Quiz Validity:** Unambiguous questions, plausible distractors, verified zero-indexed answers, and exact sentence cross-references.

---

## 2. Story-by-Story Linguistic Audit

### 2.1. Story N5-01: 学生の一日 (A Student's Day)
- **ID:** `story_n5_01`
- **Level:** JLPT N5 | **Length:** 10 sentences | **Estimated Time:** 4 minutes
- **Setting:** Ken, an international student living in Tokyo, navigating his daily routine.

| Sentence ID | Japanese Surface | Authored Furigana | Grammatical Patterns Audited |
|---|---|---|---|
| `s01` | 私の名前はケンです。 | 私[わたし]の 名前[なまえ]は ケンです。 | Topic marker は + です (A は B です) |
| `s02` | 東京の大学の留学生です。 | 東京[とうきょう]の 大学[だいがく]の 留学生[りゅうがくせい]です。 | Associative particle の |
| `s03` | 毎朝七時に起きます。 | 毎朝[まいあさ] 七時[しちじ]に 起[お]きます。 | Temporal particle に with specific time |
| `s04` | 朝ご飯にパンを食べて、コーヒーを飲みます。 | 朝[あさ]ご飯[はん]に パンを 食[た]べて、コーヒーを 飲[の]みます。 | Purpose に + sequential て-form |
| `s05` | 八時半に電車で学校へ行きます。 | 八時[はちじ]半[はん]に 電車[でんしゃ]で 学校[がっこう]へ 行[い]きます。 | Means で + directional へ |
| `s06` | 九時から十二時まで日本語の授業があります。 | 九時[くじ]から 十二時[じゅうにじ]まで 日本語[にほんご]の 授業[じゅぎょう]が あります。 | Range から...まで + inanimate existence があります |
| `s07` | 昼休みに友達と学食で昼ご飯を食べます。 | 昼[ひる]休[やす]みに 友達[ともだち]と 学食[がくしょく]で 昼[ひる]ご飯[はん]を 食[た]べます。 | Companion と + action location で |
| `s08` | 午後は図書館で本を読みます。 | 午後[ごご]は 図書館[としょかん]で 本[ほん]を 読[よ]みます。 | Object を + action location で |
| `s09` | 夕方六時に寮へ帰ります。 | 夕方[ゆうがた] 六時[ろくじ]に 寮[りょう]へ 帰[かえ]ります。 | Directional verb 帰る with destination へ |
| `s10` | 今日も楽しい一日でした。 | 今日[きょう]も 楽[たの]しい 一日[いちにち]でした。 | Inclusive particle も + past copula でした |

- **Vocabulary & Pitch Accent:**
  - Verified Pitch Grounding: `私` (heiban/0), `名前` (heiban/0), `学生` (heiban/0), `東京` (heiban/0), `電車` (heiban/0), `学校` (heiban/0), `行く` (heiban/0), `帰る` (atamadaka/1), `本` (atamadaka/1), `コーヒー` (nakadaka/3).
  - Explicit Non-verified: `留学生`, `学食`.
- **Quiz Audit:**
  - `q01`: Wake-up time (7:00, answer index 1) -> References `s03`. Verified.
  - `q02`: Breakfast item (Bread & coffee, answer index 1) -> References `s04`. Verified.
  - `q03`: Commute mode (Train, answer index 2) -> References `s05`. Verified.
  - `q04`: Afternoon study location (Library, answer index 1) -> References `s08`. Verified.

---

### 2.2. Story N5-02: 喫茶店へ行く (Visiting a Café)
- **ID:** `story_n5_02`
- **Level:** JLPT N5 | **Length:** 10 sentences | **Estimated Time:** 4 minutes
- **Setting:** Yui enjoying a rainy Sunday afternoon at a neighborhood kissaten.

| Sentence ID | Japanese Surface | Authored Furigana | Grammatical Patterns Audited |
|---|---|---|---|
| `s01` | 日曜日の午後、雨が降っています。 | 日曜日[にちようび]の 午後[ごご]、雨[あめ]が 降[ふ]っています。 | Continuous state 〜ています (weather) |
| `s02` | 私は駅の近くの小さな喫茶店へ行きました。 | 私[わたし]は 駅[えき]の 近[ちか]くの 小[ちい]さな 喫茶店[きっさてん]へ 行[い]きました。 | Attributive adjective 小さな + motion へ行きました |
| `s03` | 店の中は静かで、ジャズの音楽が流れています。 | 店[みせ]の 中[なか]は 静[しず]かで、ジャズの 音楽[おんがく]が 流[なが]れています。 | な-adjective て-form conjunction (静かで) |
| `s04` | 窓の近くの席に座りました。 | 窓[まど]の 近[ちか]くの 席[せき]に 座[すわ]りました。 | Target particle に with 座る |
| `s05` | 店員さんがメニューと水を持ってきました。 | 店員[てんいん]さんが メニューと 水[みず]を 持[も]ってきました。 | Compound motion verb 持ってくる |
| `s06` | 「いらっしゃいませ。ご注文は何ですか。」 | 「いらっしゃいませ。ご注[ちゅう]文[もん]は 何[なん]ですか。」 | Honorific prefix ご〜 + polite customer service |
| `s07` | 「温かい緑茶と抹茶ケーキをお願いします。」 | 「温[あたた]かい 緑茶[りょくちゃ]と 抹茶[まっちゃ]ケーキを お願[ねが]いします。」 | Ordering formula 〜をお願いします |
| `s08` | 緑茶はとても美味しかったです。 | 緑茶[りょくちゃ]は とても 美味[おい]しかったです。 | い-adjective past inflection 〜かったです |
| `s09` | 私は一時間、好きな本を読みました。 | 私[わたし]は 一時間[いちじかん]、好[す]きな 本[ほん]を 読[よ]みました。 | Duration noun 一時間 used adverbially without particle |
| `s10` | 外は寒いですが、喫茶店の中はとても暖かいです。 | 外[そと]は 寒[さむ]いですが、喫茶店[きっさてん]の 中[なか]は とても 暖[あたた]かいです。 | Disjunctive conjunction 〜ですが |

- **Vocabulary & Pitch Accent:**
  - Verified Pitch Grounding: `雨` (atamadaka/1), `駅` (atamadaka/1), `水` (heiban/0), `本` (atamadaka/1).
  - Explicit Non-verified: `日曜日`, `音楽`, `美味しい`, `喫茶店`, `緑茶`, `抹茶`.
- **Quiz Audit:**
  - `q01`: Weather (Raining, answer index 1) -> References `s01`. Verified.
  - `q02`: Location (Near station, answer index 1) -> References `s02`. Verified.
  - `q03`: Order (Warm green tea & matcha cake, answer index 1) -> References `s07`. Verified.
  - `q04`: Activity (Reading favorite book, answer index 1) -> References `s09`. Verified.

---

### 2.3. Story N5-03: スーパーで買い物 (Shopping at the Supermarket)
- **ID:** `story_n5_03`
- **Level:** JLPT N5 | **Length:** 8 sentences | **Estimated Time:** 4 minutes
- **Setting:** Emi purchasing fresh ingredients to make homemade Japanese curry.

| Sentence ID | Japanese Surface | Authored Furigana | Grammatical Patterns Audited |
|---|---|---|---|
| `s01` | 今日の夕方、私はスーパーへ行きました。 | 今日[きょう]の 夕方[ゆうがた]、私[わたし]は スーパーへ 行[い]きました。 | Past motion towards a destination |
| `s02` | 今晩、おいしいカレーを作ります。 | 今晩[こんばん]、おいしい カレーを 作[つく]ります。 | Direct object marker を + transitive verb 作る |
| `s03` | まず、野菜の売り場で玉ねぎと人参を買いました。 | まず、野[や]菜[さい]の 売[う]り場[ば]で 玉[たま]ねぎと 人[にん]参[じん]を 買[か]いました。 | Sequential adverb まず + noun listing と + location で |
| `s04` | それから、肉の売り場で牛肉を選びました。 | それから、肉[にく]の 売[う]り場[ば]で 牛[ぎゅう]肉[にく]を 選[えら]びました。 | Sequential conjunction それから + transitive verb 選ぶ |
| `s05` | 「すみません、カレールーはどこですか」と店員に聞きました。 | 「すみません、カレールーは どこですか」と 店[てん]員[いん]に 聞[き]きました。 | Quotation particle と + listener target に |
| `s06` | 店員が笑顔で場所を教えてくれました。 | 店[てん]員[いん]が 笑[え]顔[がお]で 場[ば]所[しょ]を 教[おし]えてくれました。 | Benefactive auxiliary 〜てくれました |
| `s07` | レジでお金を払って、袋に商品を入れました。 | レジで お金[かね]を 払[はら]って、袋[ふくろ]に 商[しょう]品[ひん]を 入[い]れました。 | Action sequencing with て-form + container target に |
| `s08` | 家に帰って、早く料理を始めたいです。 | 家[いえ]に 帰[かえ]って、早[はや]く 料[りょう]理[り]を 始[はじ]めたいです。 | Desiderative inflection 〜たいです |

- **Vocabulary & Pitch Accent:**
  - Verified Pitch Grounding: `今日` (atamadaka/1), `私` (heiban/0), `行く` (heiban/0), `買う` (heiban/0), `肉` (odaka/2), `聞く` (heiban/0), `帰る` (atamadaka/1).
  - Explicit Non-verified: `夕方`, `スーパー`, `今晩`, `カレー`, `作る`, `野菜`, `売り場`, `玉ねぎ`, `人参`, `牛肉`, `選ぶ`, `店員`, `場所`, `教える`, `レジ`, `お金`, `払う`, `入れる`, `家`, `料理`.
- **Quiz Audit:**
  - `q01`: Dish being prepared (Curry, answer index 0) -> References `s02`. Verified.
  - `q02`: Veggies purchased (Onions & carrots, answer index 0) -> References `s03`. Verified.
  - `q03`: Question asked to clerk (Curry roux location, answer index 0) -> References `s05`. Verified.
  - `q04`: Payment place (Cash register, answer index 0) -> References `s07`. Verified.

---

### 2.4. Story N5-04: 公園へ散歩に行く (A Walk in the Park)
- **ID:** `story_n5_04`
- **Level:** JLPT N5 | **Length:** 8 sentences | **Estimated Time:** 4 minutes
- **Setting:** Daiki taking a calm Saturday stroll under blooming sakura.

| Sentence ID | Japanese Surface | Authored Furigana | Grammatical Patterns Audited |
|---|---|---|---|
| `s01` | 土曜日の朝、とてもいい天気です。 | 土曜日[どようび]の 朝[あさ]、とても いい 天[てん]気[き]です。 | Weather collocation いい天気 |
| `s02` | 空は青くて、暖かい風が吹いています。 | 空[そら]は 青[あお]くて、暖[あたた]かい 風[かぜ]が 吹[ふ]いています。 | い-adjective て-form conjunction (青くて) + continuous 〜ています |
| `s03` | 私は近くの公園へ散歩に行きました。 | 私[わたし]は 近[ちか]くの 公[こう]園[えん]へ 散[さん]歩[ぽ]に 行[い]きました。 | Purpose motion: Noun + に + 行く |
| `s04` | 公園にはきれいな桜の花がたくさん咲いています。 | 公[こう]園[えん]には きれいな 桜[さくら]の 花[はな]が たくさん 咲[さ]いています。 | Topic location marker には + state continuous 咲いている |
| `s05` | 子供たちが元気に走って、犬と遊んでいます。 | 子[こ]供[ども]たちが 元[げん]気[き]に 走[はし]って、犬[いぬ]と 遊[あそ]んでいます。 | な-adjective adverbial 元気に + pluralizer たち + て-form |
| `s06` | 私はスマートフォンで桜の写真を撮りました。 | 私[わたし]は スマートフォンで 桜[さくら]の 写[しゃ]真[しん]を 撮[と]りました。 | Instrument で + 写真を撮る |
| `s07` | ベンチに座って、冷たいお茶を飲みました。 | ベンチに 座[すわ]って、冷[つめ]たい お茶[ちゃ]を 飲[の]みました。 | Point of contact に + sequential て-form |
| `s08` | 静かで、とても気持ちがいい朝でした。 | 静[しず]かで、とても 気[き]持[も]ちが いい 朝[あさ]でした。 | な-adjective て-form (静かで) + idiomatic 気持ちがいい |

- **Vocabulary & Pitch Accent:**
  - Verified Pitch Grounding: `朝` (atamadaka/1), `いい` (atamadaka/1), `空` (atamadaka/1), `私` (heiban/0), `行く` (heiban/0), `花` (odaka/2), `子供` (heiban/0), `犬` (odaka/2), `写真` (heiban/0), `お茶` (heiban/0), `飲む` (atamadaka/1).
  - Explicit Non-verified: `土曜日`, `天気`, `青い`, `暖かい`, `風`, `吹く`, `近く`, `公園`, `散歩`, `桜`, `咲く`, `元気`, `走る`, `遊ぶ`, `撮る`, `ベンチ`, `座る`, `冷たい`, `静か`.
- **Quiz Audit:**
  - `q01`: Saturday morning weather (Very nice weather, answer index 0) -> References `s01`. Verified.
  - `q02`: Blossoming flowers (Sakura, answer index 0) -> References `s04`. Verified.
  - `q03`: Photo tool (Smartphone, answer index 0) -> References `s06`. Verified.
  - `q04`: Bench beverage (Cold tea, answer index 0) -> References `s07`. Verified.

---

### 2.5. Story N4-01: 初めての一人旅 (My First Solo Trip)
- **ID:** `story_n4_01`
- **Level:** JLPT N4 | **Length:** 8 sentences | **Estimated Time:** 5 minutes
- **Setting:** Maya navigating Kyoto Station alone and taking the bus to Kiyomizu-dera.

| Sentence ID | Japanese Surface | Authored Furigana | Grammatical Patterns Audited |
|---|---|---|---|
| `s01` | 先週の週末、私は新幹線に乗って京都へ行きました。 | 先[せん]週[しゅう]の 週[しゅう]末[まつ]、私[わたし]は 新[しん]幹[かん]線[せん]に 乗[の]って 京[きょう]都[と]へ 行[い]きました。 | Means に乗って + directional motion |
| `s02` | 一人で旅行するのはこれが初めてでした。 | 一[ひと]人[り]で 旅[りょ]行[こう]するのは これが 初[はじ]めてでした。 | Nominalization with のは + 初めてでした |
| `s03` | 京都駅に着いた時、人がとても多くて少し心配になりました。 | 京[きょう]都[と]駅[えき]に 着[つ]いた 時[とき]、人[ひと]が とても 多[おお]くて 少[すこ]し 心[しん]配[ぱい]に なりました。 | Temporal clause 〜た時 + change of state 〜になる |
| `s04` | 有名な清水寺へ行きたかったですが、バス停が分かりませんでした。 | 有[ゆう]名[めい]な 清[きよ]水[みず]寺[でら]へ 行[い]きたかったですが、バス停[てい]が 分[わ]かりませんでした。 | Past desire 〜たかった + disjunctive が |
| `s05` | 近くにいた駅員に「行き方を教えていただけませんか」と尋ねました。 | 近[ちか]くに いた 駅[えき]員[いん]に 「行[い]き方[かた]を 教[おし]えていただけませんか」と 尋[たず]ねました。 | Way of doing 〜方 + high-politeness request 〜ていただけませんか |
| `s06` | 駅員は笑顔で地図を渡して、乗り場を丁寧に案内してくれました。 | 駅[えき]員[いん]は 笑[え]顔[がお]で 地[ち]図[ず]を 渡[わた]して、乗[の]り場[ば]を 丁[てい]寧[ねい]に 案[あん]内[ない]してくれました。 | Sequential て-form + benefactive 〜てくれました |
| `s07` | 親切な説明のおかげで、迷わずに正しいバスに乗ることができました。 | 親[しん]切[せつ]な 説[せつ]明[めい]の おかげで、迷[まよ]わずに 正[ただ]しい バスに 乗[の]ることが できました。 | Causality 〜のおかげで + negative attendant 〜ずに + potential 〜ことができる *(Fixed stray backtick)* |
| `s08` | 窓から見える古い町並みを見ながら、一人で来てよかったと思いました。 | 窓[まど]から 見[み]える 古[ふる]い 町[まち]並[な]みを 見[み]ながら、一[ひと]人[り]で 来[き]てよかったと 思[おも]いました。 | Spontaneous/potential 見える + simultaneous action 〜ながら + evaluative 〜てよかった |

- **Defect Remediated:** In `s07`, an authored trailing backtick `` できました。` `` in the furigana string was identified and removed.
- **Vocabulary & Pitch Accent:**
  - Verified Pitch Grounding: `私` (heiban/0), `行く` (heiban/0), `古い` (nakadaka/2), `見る` (atamadaka/1), `来る` (atamadaka/1).
  - Explicit Non-verified: `先週`, `週末`, `新幹線`, `乗る`, `京都`, `一人`, `旅行する`, `初めて`, `京都駅`, `着く`, `時`, `多い`, `少し`, `心配`, `有名`, `清水寺`, `バス停`, `分かる`, `駅員`, `行き方`, `教える`, `尋ねる`, `笑顔`, `地図`, `渡す`, `乗り場`, `丁寧`, `案内する`, `親切`, `説明`, `迷う`, `正しい`, `窓`, `見える`, `町並み`, `思う`.
- **Quiz Audit:**
  - `q01`: Transportation to Kyoto (Shinkansen, answer index 0) -> References `s01`. Verified.
  - `q02`: Reason for worry at station (Crowd of people, answer index 0) -> References `s03`. Verified.
  - `q03`: Attendant's action (Handed map and guided to stop, answer index 0) -> References `s06`. Verified.
  - `q04`: Scenery from bus window (Historic townscape, answer index 0) -> References `s08`. Verified.

---

### 2.6. Story N4-02: 友達へのプレゼント (A Gift for a Friend)
- **ID:** `story_n4_02`
- **Level:** JLPT N4 | **Length:** 8 sentences | **Estimated Time:** 5 minutes
- **Setting:** Sora baking handmade matcha cookies for roommate Li's birthday with friendly baking advice.

| Sentence ID | Japanese Surface | Authored Furigana | Grammatical Patterns Audited |
|---|---|---|---|
| `s01` | 来週はルームメイトの李さんの誕生日です。 | 来[らい]週[しゅう]は ルームメイトの 李[り]さんの 誕[たん]生[じょう]日[び]です。 | Associative particles + proper name with honorific さん |
| `s02` | 何か特別なプレゼントをあげたいと思っていました。 | 何[なに]か 特[とく]別[べつ]な プレゼントを あげたいと 思[おも]っていました。 | Indefinite pronoun 何か + giving auxiliary あげる + prolonged intention 〜たいと思っていた |
| `s03` | 李さんは日本のお菓子が好きなので、自分でクッキーを作ってみることにしました。 | 李[り]さんは 日本[にほん]の お菓子[かし]が 好[す]きなので、自分[じぶん]で クッキーを 作[つく]ってみることに しました。 | Causal なので with な-adjective + trial 〜てみる + decision 〜ことにする |
| `s04` | 料理が得意な友達に電話して、おいしい抹茶クッキーの作り方を聞きました。 | 料[りょう]理[り]が 得[とく]意[い]な 友[とも]達[だち]に 電[でん]話[わ]して、おいしい 抹[まっ]茶[ちゃ]クッキーの 作[つく]り方[かた]を 聞[き]きました。 | Skill evaluation 〜が得意 + way of doing 〜作り方 |
| `s05` | 友達は「焼きすぎると固くなるから、火の強さに気をつけてね」と教えてくれました。 | 友[とも]達[だち]は 「焼[や]きすぎると 固[かた]くなるから、火[ひ]の 強[つよ]さに 気[き]をつけてね」と 教[おし]えてくれました。 | Excess 〜すぎる + conditional 〜と + causal から + benefactive 〜てくれる |
| `s06` | 私は丁寧に生地を作って、オーブンで焼きました。 | 私[わたし]は 丁[てい]寧[ねい]に 生[き]地[じ]を 作[つく]って、オーブンで 焼[や]きました。 | Adverbial form 丁寧に + means particle で |
| `s07` | 完成したクッキーを箱に入れて、短い手紙を添えました。 | 完[かん]成[せい]した クッキーを 箱[はこ]に 入[い]れて、短[みじか]い 手[て]紙[がみ]を 添[そ]えました。 | Relative clause 完成した + sequential て-form |
| `s08` | プレゼントを渡すと、李さんは「とてもおいしい！」と笑顔で喜んでくれました。 | プレゼントを 渡[わた]すと、李[り]さんは 「とても おいしい！」と 笑[え]顔[がお]で 喜[よろこ]んでくれました。 | Immediate consequence conditional 〜と + benefactive 〜てくれました |

- **Vocabulary & Pitch Accent:**
  - Verified Pitch Grounding: `日本` (nakadaka/2), `友達` (heiban/0), `聞く` (heiban/0), `私` (heiban/0), `手紙` (heiban/0).
  - Explicit Non-verified: `来週`, `誕生日`, `特別`, `プレゼント`, `あげる`, `思う`, `お菓子`, `好き`, `自分`, `クッキー`, `作る`, `料理`, `得意`, `電話する`, `抹茶`, `作り方`, `焼きすぎる`, `固い`, `火`, `強さ`, `気をつける`, `教える`, `丁寧`, `生地`, `オーブン`, `焼く`, `完成`, `箱`, `入れる`, `短い`, `添える`, `渡す`, `笑顔`, `喜ぶ`.
- **Quiz Audit:**
  - `q01`: Recipient of gift (Roommate Li, answer index 0) -> References `s01`. Verified.
  - `q02`: Motivation for cookies (Li loves Japanese sweets, answer index 0) -> References `s03`. Verified.
  - `q03`: Friend's advice (Control heat so they don't get hard, answer index 0) -> References `s05`. Verified.
  - `q04`: Reaction (Smiled and rejoiced saying delicious, answer index 0) -> References `s08`. Verified.

---

## 3. Linguistic Summary & Validation Statement

1. **Orthographic Accuracy:** All kanji and okurigana align with standard contemporary Japanese orthography (e.g., 食べる, 飲む, 案内する, 丁寧, 親切).
2. **Pedagogical Alignment:**
   - **N5 stories** strictly use simple sentence structures, 〜です/〜ます verbs, elementary conjunctions (`〜て`, `〜が`), and base particles (`は`, `が`, `を`, `に`, `へ`, `で`, `と`, `から`, `まで`).
   - **N4 stories** naturally introduce compound sentences, nominalization (`〜のは`), temporal clauses (`〜た時`), conditionals (`〜と`), benefactives (`〜てくれる`, `〜てあげる`), causative-trial forms (`〜てみる`), and polite requests (`〜ていただけませんか`).
3. **Furigana Validity:** Zero unmatched bracket pairs or malformed ruby tags across all 52 sentences.
