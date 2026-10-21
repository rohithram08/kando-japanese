# scripts/generators/common.py
import re

PROVENANCE = {
    'author': 'Kando Japanese Pedagogical Team',
    'license': 'Proprietary / CC BY-NC-SA 4.0 Educational',
    'curationNotes': 'Contextual graded reader integrating vocabulary, grammar, particles, kanji, and comprehension quizzes.',
    'verified': True
}

def to_furigana(word, reading):
    if not word or not reading:
        return word
    # Strip matching suffix okurigana
    i = 1
    while i <= len(word) and i <= len(reading) and word[-i] == reading[-i]:
        i += 1
    i -= 1
    if i > 0:
        kanji_part = word[:-i]
        reading_part = reading[:-i]
        okurigana = word[-i:]
        return f'{kanji_part}[{reading_part}]{okurigana}'
    else:
        return f'{word}[{reading}]'

def parse_tokens(furigana_str, valid_vocab_keys=None):
    chunks = re.findall(r'([^\s\[\]]+(?:\[[^\]]+\])?|\S+)', furigana_str)
    tokens = []
    clean_punct = lambda s: re.sub(r'[、。「」！？\s]', '', s)
    for c in chunks:
        m = re.match(r'^([^\[]+)\[([^\]]+)\](.*)$', c)
        if m:
            surface = clean_punct(m.group(1) + m.group(3))
            base_key = clean_punct(m.group(1))
            cleaned_text = clean_punct(c)
            is_valid = bool(surface and (valid_vocab_keys is None or surface in valid_vocab_keys or base_key in valid_vocab_keys))
            if is_valid:
                v_key = surface if (valid_vocab_keys and surface in valid_vocab_keys) else base_key
                tokens.append({
                    'text': cleaned_text,
                    'surface': surface,
                    'isWord': True,
                    'vocabKey': v_key
                })
            else:
                tokens.append({'text': c, 'surface': surface or c})
        else:
            surface = clean_punct(c)
            if valid_vocab_keys and surface in valid_vocab_keys:
                tokens.append({
                    'text': surface,
                    'surface': surface,
                    'isWord': True,
                    'vocabKey': surface
                })
            else:
                tokens.append({'text': c, 'surface': c})
    return tokens

def extract_plain_japanese(furigana_str):
    return re.sub(r'\[[^\]]+\]', '', furigana_str).replace(' ', '')

def make_story(story_id, title, title_furigana, english_title, level, description, sentences_def, vocab_list, elements_def, questions_def):
    # Prepare set of valid vocabulary surfaces
    valid_vocab_keys = {v['surface'] for v in vocab_list}
    valid_vocab_keys.update({v.get('vocabRefId') for v in vocab_list if v.get('vocabRefId')})

    sentences = []
    for idx, s in enumerate(sentences_def, start=1):
        furi = s['furigana']
        jp = s.get('japanese') or extract_plain_japanese(furi)
        s_id = f"{story_id}_s{str(idx).zfill(2)}"
        sentences.append({
            'id': s_id,
            'order': idx,
            'japanese': jp,
            'furigana': furi,
            'translation': s['translation'],
            'grammarNotes': s.get('grammarNotes', ''),
            'tokens': parse_tokens(furi, valid_vocab_keys),
            'learningElementIds': s.get('learningElementIds', [])
        })

    vocabulary = []
    for v in vocab_list:
        v_obj = {
            'surface': v['surface'],
            'reading': v['reading'],
            'meaning': v['meaning'],
            'partOfSpeech': v.get('partOfSpeech', 'noun'),
            'jlptLevel': level,
            'pitchVerified': False
        }
        if v.get('pitchVerified'):
            v_obj['pitchVerified'] = True
            v_obj['pitchPattern'] = v['pitchPattern']
            v_obj['pitchDropPosition'] = v.get('pitchDropPosition', 0)
        vocabulary.append(v_obj)

    learning_elements = []
    for e_idx, el in enumerate(elements_def, start=1):
        el_id = f"el_{story_id.replace('story_', '')}_{str(e_idx).zfill(2)}"
        learning_elements.append({
            'id': el_id,
            'type': el['type'],
            'text': el['text'],
            'surface': el.get('surface', el['text']),
            'reading': el.get('reading', ''),
            'meaning': el['meaning'],
            'roleInStory': el['roleInStory'],
            'mechanicsExplanation': el['mechanicsExplanation'],
            'exampleSentence': el['exampleSentence'],
            'jlptLevel': level,
            'pitchPattern': el.get('pitchPattern', 'heiban')
        })

    questions = []
    for q_idx, q in enumerate(questions_def, start=1):
        q_id = f"{story_id}_q{str(q_idx).zfill(2)}"
        questions.append({
            'id': q_id,
            'type': q.get('type', 'comprehension'),
            'question': q['question'],
            'questionFurigana': q.get('questionFurigana', q['question']),
            'options': q['options'],
            'correctAnswer': q['correctAnswer'],
            'explanation': q['explanation'],
            'wrongExplanations': q.get('wrongExplanations', {}),
            'referencedSentenceIndex': q.get('referencedSentenceIndex', 0)
        })

    return {
        'id': story_id,
        'title': title,
        'titleFurigana': title_furigana,
        'englishTitle': english_title,
        'level': level,
        'description': description,
        'estimatedMinutes': 10,
        'published': True,
        'provenance': PROVENANCE,
        'sentences': sentences,
        'vocabulary': vocabulary,
        'learningElements': learning_elements,
        'questions': questions
    }
