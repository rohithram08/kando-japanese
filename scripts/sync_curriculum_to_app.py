# scripts/sync_curriculum_to_app.py
import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(ROOT_DIR, 'content')
LOCALES_DIR = os.path.join(ROOT_DIR, 'src', 'locales')
BACKEND_DIR = os.path.join(ROOT_DIR, 'backend')

def load_json(path):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print('=== 1. SYNCING TRANSLATIONS TO src/locales/{en,ta,hi}/curriculum.json ===')
for lang in ['en', 'ta', 'hi']:
    loc_path = os.path.join(LOCALES_DIR, lang, 'curriculum.json')
    curriculum_data = load_json(loc_path)
    
    # Load all content translation files
    for entity in ['vocabulary', 'kanji', 'grammar', 'lessons']:
        entity_path = os.path.join(CONTENT_DIR, 'translations', lang, f'{entity}.json')
        entity_data = load_json(entity_path)
        for k, v in entity_data.items():
            curriculum_data[k] = v
            
    save_json(loc_path, curriculum_data)
    print(f'[SAVED] {loc_path} ({len(curriculum_data)} entries)')

print('\n=== 2. GENERATING backend/src/data/lessonsData.ts WITH 250 LESSONS ===')
lessons_data_by_level = {'N1': [], 'N2': [], 'N3': [], 'N4': [], 'N5': []}
en_lessons_trans = load_json(os.path.join(CONTENT_DIR, 'translations', 'en', 'lessons.json'))

for lvl in ['n1', 'n2', 'n3', 'n4', 'n5']:
    lvl_upper = lvl.upper()
    lessons_list = load_json(os.path.join(CONTENT_DIR, 'lessons', f'{lvl}.json'))
    for l in lessons_list:
        lid = l['id']
        trans = en_lessons_trans.get(lid, {})
        
        # Merge pure content with English title, description, culturalNote, and dialogues
        dialogue = []
        for d in l.get('dialogue', []):
            dialogue.append({
                'speaker': d.get('speaker', 'Speaker'),
                'jp': d.get('jp', ''),
                'en': d.get('en', '')
            })
            
        exercises = l.get('exercises', [])
        
        lessons_data_by_level[lvl_upper].append({
            'id': lid,
            'title': trans.get('title', l.get('title', '')),
            'titleJp': l.get('titleJp', l.get('title', '')),
            'level': lvl_upper,
            'order': l.get('order', 1),
            'duration': l.get('duration', '30 min'),
            'xp': l.get('xp', 50),
            'description': trans.get('description', l.get('description', '')),
            'vocabulary': l.get('vocabulary', []),
            'grammar': l.get('grammar', []),
            'dialogue': dialogue,
            'exercises': exercises,
            'culturalNote': trans.get('culturalNote', l.get('culturalNote', '')),
            'kanji': l.get('kanji', [])
        })

# Write to backend/src/data/lessonsData.ts
backend_lessons_path = os.path.join(BACKEND_DIR, 'src', 'data', 'lessonsData.ts')
ts_code = f"""// Auto-generated from authoritative curriculum data files
export interface DialogueLine {{
  speaker: string;
  jp: string;
  en: string;
}}

export interface LessonExercise {{
  type: string;
  question?: string;
  sentence?: string;
  items?: string[];
  options?: string[];
  answer: string | string[];
  [key: string]: any;
}}

export interface RawLesson {{
  id: string;
  title: string;
  titleJp?: string;
  level: string;
  order: number;
  duration?: string;
  xp?: number;
  description?: string;
  vocabulary: (string | any)[];
  grammar: (string | any)[];
  dialogue?: DialogueLine[];
  exercises?: LessonExercise[];
  culturalNote?: string;
  kanji?: (string | any)[];
}}

export const LESSONS_DATA: Record<string, RawLesson[]> = {json.dumps(lessons_data_by_level, ensure_ascii=False, indent=2)};
"""

with open(backend_lessons_path, 'w', encoding='utf-8') as f:
    f.write(ts_code)
print(f'[SAVED] {backend_lessons_path} (250 lessons, 50 per level)')

print('\n=== 3. SYNC COMPLETED SUCCESSFULLY ===')
