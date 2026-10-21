# scripts/build_all_250_stories.py
# ─────────────────────────────────────────────────────────────────────────────
# Master Orchestrator: Compiles 50 Graded Stories for N5, N4, N3, N2, N1
# Total: 250 Graded Reader Stories
# ─────────────────────────────────────────────────────────────────────────────

import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, 'src', 'data', 'reading')
GENERATORS_DIR = os.path.join(ROOT_DIR, 'scripts', 'generators')

sys.path.append(GENERATORS_DIR)

from n5_generator import generate_n5_stories
from n4_generator import generate_n4_stories
from n3_generator import generate_n3_stories
from n2_generator import generate_n2_stories
from n1_generator import generate_n1_stories

print("=" * 60)
print("BUILDING 250 GRADED READER STORIES (50 per JLPT Level)")
print("=" * 60)

# 1. Load existing N5 stories (4 stories)
n5_existing_path = os.path.join(DATA_DIR, 'n5_stories.json')
n5_existing = []
if os.path.exists(n5_existing_path):
    with open(n5_existing_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        # Keep only the original 4 handcrafted stories
        n5_existing = [s for s in data if s['id'] in ['story_n5_01', 'story_n5_02', 'story_n5_03', 'story_n5_04']]
print(f"Loaded {len(n5_existing)} existing N5 base stories.")

# 2. Load existing N4 stories (2 stories)
n4_existing_path = os.path.join(DATA_DIR, 'n4_stories.json')
n4_existing = []
if os.path.exists(n4_existing_path):
    with open(n4_existing_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        # Keep original 2 handcrafted stories
        n4_existing = [s for s in data if s['id'] in ['story_n4_01', 'story_n4_02']]
print(f"Loaded {len(n4_existing)} existing N4 base stories.")

# 3. Generate 50 stories for each level
n5_all = generate_n5_stories(n5_existing)
n4_all = generate_n4_stories(n4_existing)
n3_all = generate_n3_stories()
n2_all = generate_n2_stories()
n1_all = generate_n1_stories()

assert len(n5_all) == 50, f"Expected 50 N5 stories, got {len(n5_all)}"
assert len(n4_all) == 50, f"Expected 50 N4 stories, got {len(n4_all)}"
assert len(n3_all) == 50, f"Expected 50 N3 stories, got {len(n3_all)}"
assert len(n2_all) == 50, f"Expected 50 N2 stories, got {len(n2_all)}"
assert len(n1_all) == 50, f"Expected 50 N1 stories, got {len(n1_all)}"

# 4. Save individual level files
def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Saved: {os.path.basename(path)} ({len(data)} stories, {os.path.getsize(path):,} bytes)")

save_json(os.path.join(DATA_DIR, 'n5_stories.json'), n5_all)
save_json(os.path.join(DATA_DIR, 'n4_stories.json'), n4_all)
save_json(os.path.join(DATA_DIR, 'n3_stories.json'), n3_all)
save_json(os.path.join(DATA_DIR, 'n2_stories.json'), n2_all)
save_json(os.path.join(DATA_DIR, 'n1_stories.json'), n1_all)

# 5. Save master aggregate catalog (250 stories)
all_stories = n5_all + n4_all + n3_all + n2_all + n1_all
save_json(os.path.join(DATA_DIR, 'stories.json'), all_stories)

print("=" * 60)
print(f"SUCCESS: 250 Graded Reader Stories successfully built across N5-N1!")
print(f"Total Stories: {len(all_stories)}")
print("=" * 60)
