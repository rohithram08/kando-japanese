# scripts/validate_n1_vocabulary.py
import json
import re
import sys

def validate():
    print("=== VALIDATING N1 VOCABULARY FILE ===")
    
    with open('content/vocabulary/n1.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print(f"Total count: {len(data)}")
    assert len(data) == 1500, f"Expected 1500 items, got {len(data)}"
    
    expected_keys = {"id", "word", "reading", "romaji", "pos", "level", "tags", "example"}
    kanji_regex = re.compile(r'[\u4e00-\u9fff]')
    brace_regex = re.compile(r'[{|}]')
    
    seen_ids = set()
    errors = []
    
    for i, item in enumerate(data):
        idx = i + 1
        expected_id = f"n1_{str(idx).zfill(3)}"
        
        # ID check
        if item.get("id") != expected_id:
            errors.append(f"Item {i}: expected ID {expected_id}, got {item.get('id')}")
        seen_ids.add(item.get("id"))
        
        # Level check
        if item.get("level") != "N1":
            errors.append(f"Item {expected_id}: level is not N1 ({item.get('level')})")
            
        # Tags check
        tags = item.get("tags", [])
        if "N1" not in tags:
            errors.append(f"Item {expected_id}: 'N1' not in tags ({tags})")
            
        # Word check
        word = item.get("word", "")
        if not word:
            errors.append(f"Item {expected_id}: empty word")
            
        # Reading check
        reading = item.get("reading", "")
        if not reading:
            errors.append(f"Item {expected_id}: empty reading")
        elif kanji_regex.search(reading):
            errors.append(f"Item {expected_id}: kanji found in reading '{reading}'")
            
        # Romaji check
        romaji = item.get("romaji", "")
        if not romaji:
            errors.append(f"Item {expected_id}: empty romaji")
            
        # POS check
        pos = item.get("pos", "")
        if not pos:
            errors.append(f"Item {expected_id}: empty pos")
            
        # Example check
        ex = item.get("example")
        if not isinstance(ex, dict):
            errors.append(f"Item {expected_id}: example is not a dict")
        else:
            jp = ex.get("jp", "")
            if not jp:
                errors.append(f"Item {expected_id}: empty example.jp")
            ex_rd = ex.get("reading", "")
            if not ex_rd:
                errors.append(f"Item {expected_id}: empty example.reading")
            elif kanji_regex.search(ex_rd):
                errors.append(f"Item {expected_id}: kanji found in example.reading '{ex_rd}'")
            elif brace_regex.search(ex_rd):
                errors.append(f"Item {expected_id}: unresolved furigana markup in example.reading '{ex_rd}'")

    print(f"Total validation checks performed: {len(data) * 8}")
    if errors:
        print(f"FAILED with {len(errors)} errors:")
        for e in errors[:20]:
            print("  ", e)
        sys.exit(1)
    else:
        print("ALL 1500 ITEMS PASSED SCHEMA VALIDATION!")
        
    # Check translations
    print("\n=== VALIDATING TRANSLATIONS ===")
    with open('content/translations/en/vocabulary.json', 'r', encoding='utf-8') as f:
        en_trans = json.load(f)
        
    missing_trans = [x['id'] for x in data if x['id'] not in en_trans or not en_trans[x['id']].get('meaning')]
    if missing_trans:
        print(f"Warning: {len(missing_trans)} items missing translation meanings")
    else:
        print(f"ALL 1500 ITEMS HAVE VALID TRANSLATIONS IN content/translations/en/vocabulary.json!")

if __name__ == '__main__':
    validate()
