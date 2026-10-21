# scripts/test_pdf_parse.py
import sys
import re
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

def parse_n4_grammar():
    path = r'D:\Downloads\JLPT N4 Grammar Master Ebook.pdf'
    reader = pypdf.PdfReader(path)
    
    # 1. Parse TOC
    toc_items = []
    for p in range(2, 7):
        text = reader.pages[p].extract_text()
        for line in text.split('\n'):
            line = line.strip()
            # E.g. '1 間 aida while; during; between 6'
            m = re.match(r'^(\d+)\s+([^\s]+)\s+([a-zA-Z~/\s\(\)]+?)\s+(.+?)\s+(\d+)\s*$', line)
            if m:
                toc_items.append({
                    'num': int(m.group(1)),
                    'pattern': m.group(2),
                    'romaji': m.group(3).strip(),
                    'meaning': m.group(4).strip(),
                    'page': int(m.group(5))
                })
    print(f'[N4 TOC] Extracted {len(toc_items)} grammar points.')
    return toc_items

def parse_n3_grammar():
    path = r'D:\Downloads\JLPT N3 Grammar Master.pdf'
    reader = pypdf.PdfReader(path)
    
    # In N3 TOC, items are formatted across lines:
    # '1', '上げる', 'ageru', 'to finish doing~', '8'
    all_lines = []
    for p in range(2, 9):
        text = reader.pages[p].extract_text()
        for l in text.split('\n'):
            l = l.strip()
            if l:
                all_lines.append(l)
                
    toc_items = []
    i = 0
    while i < len(all_lines):
        line = all_lines[i]
        if line.isdigit() and 1 <= int(line) <= 200:
            num = int(line)
            # Next should be pattern, romaji, meaning, page
            if i + 4 < len(all_lines) and all_lines[i+4].isdigit():
                pattern = all_lines[i+1]
                romaji = all_lines[i+2]
                meaning = all_lines[i+3]
                page = int(all_lines[i+4])
                toc_items.append({
                    'num': num,
                    'pattern': pattern,
                    'romaji': romaji,
                    'meaning': meaning,
                    'page': page
                })
                i += 5
                continue
        i += 1
        
    print(f'[N3 TOC] Extracted {len(toc_items)} grammar points.')
    return toc_items

def parse_n5_vocab():
    path = r'D:\Downloads\VocabList.N5.pdf'
    reader = pypdf.PdfReader(path)
    words = []
    for p in range(len(reader.pages)):
        text = reader.pages[p].extract_text()
        for line in text.split('\n'):
            parts = line.strip().split()
            # Format: Kanji Hiragana English (or Hiragana English if no kanji)
            if len(parts) >= 3 and not line.startswith('JLPT') and not line.startswith('Kanji'):
                kanji = parts[0]
                reading = parts[1]
                meaning = ' '.join(parts[2:])
                words.append({'word': kanji, 'reading': reading, 'en': meaning})
            elif len(parts) == 2 and not line.startswith('JLPT') and not line.startswith('Kanji'):
                words.append({'word': parts[0], 'reading': parts[0], 'en': parts[1]})
    print(f'[N5 Vocab] Extracted {len(words)} vocabulary words.')
    return words

def parse_n3_vocab():
    path = r'D:\Downloads\N3.VocabList.pdf'
    reader = pypdf.PdfReader(path)
    words = []
    for p in range(len(reader.pages)):
        text = reader.pages[p].extract_text()
        for line in text.split('\n'):
            parts = line.strip().split()
            if len(parts) >= 3 and not line.startswith('JLPT') and not line.startswith('Kanji') and 'cumulative' not in line:
                kanji = parts[0]
                reading = parts[1]
                meaning = ' '.join(parts[2:])
                words.append({'word': kanji, 'reading': reading, 'en': meaning})
            elif len(parts) == 2 and not line.startswith('JLPT') and not line.startswith('Kanji') and 'cumulative' not in line:
                words.append({'word': parts[0], 'reading': parts[0], 'en': parts[1]})
    print(f'[N3 Vocab] Extracted {len(words)} vocabulary words.')
    return words

if __name__ == '__main__':
    n4_g = parse_n4_grammar()
    n3_g = parse_n3_grammar()
    n5_v = parse_n5_vocab()
    n3_v = parse_n3_vocab()
