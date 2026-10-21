# scripts/generate_all_graded_readers.py
# ─────────────────────────────────────────────────────────────────────────────
# 250 Graded Japanese Reader Stories Generator (50 for each JLPT level: N5, N4, N3, N2, N1)
# Fully aligned with Genki I & II, Minna no Nihongo, and JLPT Grammar Master.
# ─────────────────────────────────────────────────────────────────────────────

import os
import json
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
READING_DIR = os.path.join(ROOT_DIR, 'src', 'data', 'reading')

print("Starting 250 Graded Readers Generator...")
print("Target dir:", READING_DIR)
