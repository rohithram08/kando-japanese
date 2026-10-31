# Long-form (~10 minute) graded-reader stories

Stories are authored in a compact source format and **built** into the full reader format, so tokens, ids, highlights, pitch data and reading time can never drift.

```
content/stories/<level>/<story_id>.json   ← what you write
        │  node scripts/stories/build_expanded_stories.mjs n5
        ▼
src/data/reading/<level>_stories.json     ← what the app ships (replaced by id)
```

## Source format
| field | meaning |
|---|---|
| `sentences` | `[furigana, english, grammarNote?]` — furigana as `学[がく]生[せい]は …`; spaces only mark word chunks |
| `vocab` | `[surface, reading, meaning, partOfSpeech, forms?]` — `forms` = stems used in the text (`["食べ"]` for 食べます) |
| `elements` | highlighted learning elements: `vocabulary` / `grammar` / `particle` / `kanji`, with `in: [sentence numbers]` |
| `questions` | `type`, `q` (furigana allowed), `opts`, `ans`, `expl`, **`wrong`** (an explanation for every wrong option), `ref` (0-based sentence index) |

## Quality bar (enforced by the builder and by `longformStories.test.ts`)
24+ sentences · 14+ vocabulary words that really appear as clickable tokens · 8+ learning elements covering all four types · 8+ questions covering all five types · an explanation for every wrong answer · every kanji carries furigana · estimated 8–12 minutes.

**Reading time** = `characters × 0.75 s` (≈ 80 chars/min for an N5 learner) `+ 4 s per sentence + 20 s per learning element`.

## Review policy
Everything produced this way is marked `provenance.verified = false` and `reviewStatus = "ai_draft_pending_review"` until a native speaker signs it off. The dataset test refuses any unverified story that does not say so explicitly.

`scripts/build_all_250_stories.py` preserves these stories when it regenerates the template stories.
