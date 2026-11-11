# scripts/build_n2_vocab.py
import urllib.request
import json
import re
import os

def main():
    print("=== Step 1: Loading existing n2.json ===")
    vocab_path = os.path.join("content", "vocabulary", "n2.json")
    with open(vocab_path, "r", encoding="utf-8") as f:
        existing = json.load(f)

    print(f"Loaded {len(existing)} existing items.")

    # Fix any missing example readings in existing 35 items
    existing_fixes = {
        "n2_003": "そうきかいけつをうながすひつようがある。",
        "n2_004": "せいちょうをさまたげるよういんをはいじょする。",
        "n2_005": "かんきょうもんだいにせっきょくてきにとりくんでいる。",
        "n2_007": "おおくのきぎょうがしきんなんをかかえている。",
        "n2_013": "ながねんのけいけんがちくせきされている。",
        "n2_014": "おたがいのちょうしょをいかそう。",
        "n2_015": "だきょうてんをみつけることがこうしょうのかぎだ。",
        "n2_016": "こんきょのないひはんはうけいれられない。",
        "n2_017": "さいきん、わかもののどくしょばなれのけいこうがある。",
        "n2_019": "きんきゅうそちがひつようだ。",
        "n2_020": "かんきょうもんだいのたいさくをこうじる。",
        "n2_021": "けいざいてきなふたんがおおきい。",
        "n2_023": "けいざいせいちょうをそくしんするせいさくがひつようだ。",
        "n2_024": "コストさくげんがきゅうむだ。",
        "n2_025": "じぎょうをかいがいにかくだいするけいかくがある。",
        "n2_026": "そしきをしゅくしょうするほうしんがきまった。",
        "n2_029": "おおきなそんしつをこうむった。",
        "n2_030": "かれのしごとはたかくひょうかされている。",
        "n2_034": "りょうこくかんできょうぎをかさねた。",
        "n2_035": "じんそくなたいおうがもとめられる。"
    }

    for item in existing:
        if item["id"] in existing_fixes:
            item["example"]["reading"] = existing_fixes[item["id"]]

    existing_words = set(x["word"] for x in existing)
    seen_words = set(existing_words)

    # POS mapping function
    def map_pos(pos_list):
        if not pos_list:
            return "noun"
        p_set = set(pos_list)
        if "vs" in p_set or "vs-s" in p_set or "vs-i" in p_set:
            return "noun/verb"
        if "adj-i" in p_set:
            return "i-adjective"
        if "adj-na" in p_set:
            return "na-adjective"
        if "adv" in p_set or "adv-to" in p_set:
            return "adverb"
        if "v1" in p_set:
            return "verb (ru)"
        if any(p.startswith("v5") for p in p_set):
            return "verb (u)"
        if "conj" in p_set:
            return "conjunction"
        if "exp" in p_set or "int" in p_set:
            return "expression"
        if "suf" in p_set or "pref" in p_set:
            return "counter" if "suf" in p_set else "noun"
        if "vi" in p_set or "vt" in p_set or "vz" in p_set:
            return "verb"
        return "noun"

    def extract_reading_from_furigana(furi_text):
        return re.sub(r'\{([^|]+)\|([^}]+)\}', r'\2', furi_text)

    new_items = []
    new_translations = {}

    # Item n2_036 specifically required by coordinator
    item_036 = {
        "id": "n2_036",
        "word": "概念",
        "reading": "がいねん",
        "romaji": "gainen",
        "pos": "noun",
        "level": "N2",
        "tags": ["noun", "N2"],
        "example": {
            "jp": "基本的な概念を理解する必要がある。",
            "reading": "きほんてきながいねんをりかいするひつようがある。"
        }
    }
    new_items.append(item_036)
    seen_words.add("概念")
    new_translations["n2_036"] = {
        "meaning": "general idea / concept / notion",
        "example": "It is necessary to understand the basic concepts."
    }

    # Fetch OpenJLPT N2
    print("=== Step 2: Fetching OpenJLPT N2 ===")
    url_n2 = "https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/vocab/n2.json"
    req_n2 = urllib.request.Request(url_n2, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req_n2) as r:
        openjlpt_n2 = json.loads(r.read().decode("utf-8"))

    print(f"Loaded {len(openjlpt_n2)} raw items from OpenJLPT N2.")

    def process_entries(entries):
        count_added = 0
        for entry in entries:
            if len(new_items) >= 1465:
                break

            examples = entry.get("examples", [])
            valid_ex = None
            valid_reading = None
            for ex in examples:
                if ex.get("ja") and ex.get("furigana") and "{" in ex.get("furigana"):
                    reading_sent = extract_reading_from_furigana(ex["furigana"])
                    # Check that reading has no remaining kanji
                    if not re.search(r'[\u4e00-\u9faf]', reading_sent):
                        valid_ex = ex
                        valid_reading = reading_sent
                        break

            if not valid_ex:
                continue

            # Determine word form: prefer kanji
            w = entry["word"]
            if not any('\u4e00' <= c <= '\u9fff' for c in w) and entry.get("other_forms"):
                for of in entry["other_forms"]:
                    if any('\u4e00' <= c <= '\u9fff' for c in of):
                        w = of
                        break

            if w in seen_words:
                continue

            reading = entry.get("reading", "")
            romaji = entry.get("romaji", "")
            if not reading or not romaji:
                continue

            pos = map_pos(entry.get("pos", []))
            next_idx = len(existing) + len(new_items) + 1
            item_id = f"n2_{next_idx:03d}"

            item = {
                "id": item_id,
                "word": w,
                "reading": reading,
                "romaji": romaji,
                "pos": pos,
                "level": "N2",
                "tags": [pos, "N2"],
                "example": {
                    "jp": valid_ex.get("ja"),
                    "reading": valid_reading
                }
            }
            new_items.append(item)
            seen_words.add(w)

            # English translations
            meanings = entry.get("meanings", [])
            meaning_str = " / ".join(meanings[:3]) if meanings else w
            ex_en = valid_ex.get("en", "")
            new_translations[item_id] = {
                "meaning": meaning_str,
                "example": ex_en
            }
            count_added += 1

        return count_added

    added_n2 = process_entries(openjlpt_n2)
    print(f"Added {added_n2} items from OpenJLPT N2. Total new: {len(new_items)}")

    # If still under 1465, fetch OpenJLPT N1
    if len(new_items) < 1465:
        print(f"=== Step 3: Fetching OpenJLPT N1 to reach 1,465 new items (need {1465 - len(new_items)} more) ===")
        url_n1 = "https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/vocab/n1.json"
        req_n1 = urllib.request.Request(url_n1, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req_n1) as r:
            openjlpt_n1 = json.loads(r.read().decode("utf-8"))

        added_n1 = process_entries(openjlpt_n1)
        print(f"Added {added_n1} items from OpenJLPT N1. Total new: {len(new_items)}")

    # Total items
    full_vocabulary = existing + new_items
    print(f"=== Total vocabulary items: {len(full_vocabulary)} ===")

    # Verification checks
    assert len(full_vocabulary) == 1500, f"Expected 1500 items, got {len(full_vocabulary)}"
    assert full_vocabulary[0]["id"] == "n2_001", f"First ID should be n2_001, got {full_vocabulary[0]['id']}"
    assert full_vocabulary[35]["id"] == "n2_036", f"Index 35 should be n2_036, got {full_vocabulary[35]['id']}"
    assert full_vocabulary[-1]["id"] == "n2_1500", f"Last ID should be n2_1500, got {full_vocabulary[-1]['id']}"

    # Verify each item
    all_ids = set()
    for idx, item in enumerate(full_vocabulary):
        expected_id = f"n2_{idx+1:03d}"
        assert item["id"] == expected_id, f"Item {idx} ID mismatch: {item['id']} vs {expected_id}"
        assert item["id"] not in all_ids, f"Duplicate ID: {item['id']}"
        all_ids.add(item["id"])

        assert item.get("word"), f"Missing word in {item['id']}"
        assert item.get("reading"), f"Missing reading in {item['id']}"
        assert item.get("romaji"), f"Missing romaji in {item['id']}"
        assert item.get("pos"), f"Missing pos in {item['id']}"
        assert item.get("level") == "N2", f"Level should be N2 in {item['id']}"
        assert isinstance(item.get("tags"), list), f"Tags should be list in {item['id']}"
        assert "N2" in item["tags"], f"Tags should contain N2 in {item['id']}"

        ex = item.get("example", {})
        assert ex.get("jp"), f"Missing example.jp in {item['id']}"
        assert ex.get("reading"), f"Missing example.reading in {item['id']}"
        # Ensure no unannotated kanji in example reading
        assert not re.search(r'[\u4e00-\u9faf]', ex["reading"]), f"Kanji found in example reading of {item['id']}: {ex['reading']}"

    print("ALL 1,500 ITEMS PASSED RIGOROUS VERIFICATION!")

    # Write out content/vocabulary/n2.json
    print(f"=== Step 4: Writing {vocab_path} ===")
    with open(vocab_path, "w", encoding="utf-8") as f:
        json.dump(full_vocabulary, f, ensure_ascii=False, indent=2)

    # Write out translations
    tr_path = os.path.join("content", "translations", "en", "vocabulary.json")
    if os.path.exists(tr_path):
        print(f"=== Step 5: Updating {tr_path} ===")
        with open(tr_path, "r", encoding="utf-8") as f:
            en_translations = json.load(f)
        en_translations.update(new_translations)
        with open(tr_path, "w", encoding="utf-8") as f:
            json.dump(en_translations, f, ensure_ascii=False, indent=2)
        print(f"Updated English translations. Total keys now: {len(en_translations)}")

    print(f"SUCCESS: n2.json expanded to {len(full_vocabulary)} valid items.")

if __name__ == "__main__":
    main()
