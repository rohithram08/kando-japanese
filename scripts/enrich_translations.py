# scripts/enrich_translations.py
import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(ROOT_DIR, 'content')

def load_json(rel_path):
    p = os.path.join(CONTENT_DIR, rel_path)
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_json(rel_path, data):
    p = os.path.join(CONTENT_DIR, rel_path)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'[SAVED] {rel_path} ({len(data)} entries)')

print('=== 1. ENRICHING EN KANJI TRANSLATIONS ===')
en_kanji = load_json('translations/en/kanji.json')
levels = ['n5', 'n4', 'n3', 'n2', 'n1']

for lvl in levels:
    k_list = load_json(f'kanji/{lvl}.json')
    for k in k_list:
        kid = k.get('id')
        if not kid:
            continue
        if kid not in en_kanji:
            # Derive meaning from examples or existing meaning field
            meaning = k.get('meaning')
            if not meaning:
                examples = k.get('examples', [])
                # Look for an example that matches the kanji character itself
                exact_match = next((ex.get('meaning') for ex in examples if ex.get('word') == k.get('kanji')), None)
                if exact_match:
                    meaning = exact_match
                elif examples and examples[0].get('meaning'):
                    meaning = examples[0].get('meaning')
                else:
                    meaning = k.get('kanji', '')
            en_kanji[kid] = {'meaning': meaning}

save_json('translations/en/kanji.json', en_kanji)

print('=== 2. ENRICHING EN GRAMMAR TRANSLATIONS ===')
en_grammar = load_json('translations/en/grammar.json')

for lvl in levels:
    g_list = load_json(f'grammar/{lvl}.json')
    for g in g_list:
        gid = g.get('id')
        if not gid:
            continue
        if gid not in en_grammar:
            meaning = g.get('meaning')
            explanation = g.get('explanation')
            examples = g.get('examples', [])
            ex_en = examples[0].get('en') if examples and isinstance(examples[0], dict) else ''
            
            if not meaning:
                tags = [t for t in g.get('tags', []) if t not in ['N1', 'N2', 'N3', 'N4', 'N5']]
                pattern = g.get('pattern', '')
                romaji = g.get('romaji', '')
                if tags:
                    meaning = f"{pattern} ({', '.join(tags)})"
                elif romaji:
                    meaning = f"{pattern} ({romaji})"
                else:
                    meaning = pattern
            
            if not explanation:
                formation = g.get('formation', '')
                explanation = f"Grammar pattern {g.get('pattern', '')}. Formation: {formation}" if formation else f"Grammar pattern {g.get('pattern', '')}"
                
            en_grammar[gid] = {
                'meaning': meaning,
                'explanation': explanation,
                'example': ex_en or ''
            }

save_json('translations/en/grammar.json', en_grammar)

print('=== 3. ENRICHING EN VOCABULARY TRANSLATIONS ===')
en_vocab = load_json('translations/en/vocabulary.json')

for lvl in levels:
    v_list = load_json(f'vocabulary/{lvl}.json')
    for v in v_list:
        vid = v.get('id')
        if not vid:
            continue
        if vid not in en_vocab:
            meaning = v.get('meaning') or v.get('word', '')
            ex_en = ''
            if isinstance(v.get('example'), dict):
                ex_en = v['example'].get('en', '')
            en_vocab[vid] = {
                'meaning': meaning,
                'example': ex_en
            }

save_json('translations/en/vocabulary.json', en_vocab)
print('Done!')
