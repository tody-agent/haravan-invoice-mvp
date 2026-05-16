#!/usr/bin/env python3
"""Clean Genspark box-drawing output into proper Markdown."""
import re

INPUT = 'research/HARAVAN_INVOICE_RESEARCH.md'
OUTPUT_FINAL = 'research/HARAVAN_INVOICE_FINAL.md'

with open(INPUT, 'r', encoding='utf-8') as f:
    raw = f.read()

lines = raw.split('\n')
cleaned = []
for line in lines:
    s = line.rstrip()
    
    # Skip any line that is purely box borders (╭─╮ or ╰─╯ with optional text like model name)
    if s.startswith('╭') and s.endswith('╮'):
        continue
    if s.startswith('╰') and s.endswith('╯'):
        continue
    
    # Strip box side borders: "│ content │" or "│content│"  
    if s.startswith('│'):
        inner = s[len('│'):]  # remove leading │
        if inner.endswith('│'):
            inner = inner[:-len('│')]  # remove trailing │
        # Remove up to 2 leading spaces
        if inner.startswith('  '):
            inner = inner[2:]
        elif inner.startswith(' '):
            inner = inner[1:]
        inner = inner.rstrip()
        cleaned.append(inner)
    else:
        cleaned.append(s)

# Remove "Using model:" lines
cleaned = [l for l in cleaned if not l.strip().startswith('Using model:')]

# Remove "Claude Opus 4.7" standalone header lines (already stripped from box)
cleaned_final = []
for line in cleaned:
    if re.match(r'^\s*Claude Opus 4\.7\s*$', line):
        continue
    cleaned_final.append(line)

# Collapse 3+ blank lines into 2
result = []
blank_count = 0
for line in cleaned_final:
    if line.strip() == '':
        blank_count += 1
        if blank_count <= 2:
            result.append('')
    else:
        blank_count = 0
        result.append(line)

# Convert ASCII-art tables to markdown-friendly format
# Replace ─ separators with --- for markdown tables
text = '\n'.join(result).strip()

with open(OUTPUT_FINAL, 'w', encoding='utf-8') as f:
    f.write(text + '\n')

# Also split into individual part files
# Parts are separated by empty PHẦN headers or explicit "PART" mentions
part_markers = list(re.finditer(r'PHẦN [A-F] –|PHẦN B .* \(PART \d\)', text))

# Simple approach: split by "KẾT THÚC PART" or "PHẦN" markers into logical parts
# Part 1: from start to "CỤM 4" (PHẦN A + Cụm 1,2,3)
# Part 2: CỤM 4,5,6
# Part 3: CỤM 7,8,9
# Part 4: CỤM 10,11,12
# Part 5: PHẦN C,D,E,F

cum_markers = [(m.start(), m.group()) for m in re.finditer(r'CỤM \d+[: –]|PHẦN [C-F] –', text)]
# Find positions
split_positions = []
for pos, label in cum_markers:
    if 'CỤM 4' in label and ':' in label:
        split_positions.append(('part2', pos))
    elif 'CỤM 7' in label and ':' in label:
        split_positions.append(('part3', pos))  
    elif 'CỤM 10' in label and ':' in label:
        split_positions.append(('part4', pos))
    elif 'PHẦN C' in label:
        split_positions.append(('part5', pos))

parts = {}
prev_pos = 0
prev_name = 'part1'
for name, pos in split_positions:
    parts[prev_name] = text[prev_pos:pos].strip()
    prev_pos = pos
    prev_name = name
parts[prev_name] = text[prev_pos:].strip()

for name, content in parts.items():
    path = f'research/results/{name}.md'
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content + '\n')
    lc = content.count('\n') + 1
    print(f"  {name}: {lc} lines, {len(content)} bytes → {path}")

total_lines = text.count('\n') + 1
print(f"\n✅ Final: {total_lines} lines, {len(text)} bytes → {OUTPUT_FINAL}")
