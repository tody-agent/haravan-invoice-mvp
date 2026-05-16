import subprocess
import sys

with open('pitch_context.md', 'r') as f:
    context = f.read()

prompt = f"""Dựa vào nội dung tài liệu sau:
{context}

Hãy viết 1 tài liệu Pitch Deck + Tính năng + Roadmap + Research cho dự án Haravan Invoice Wrapper.
Áp dụng framework StoryBrand SB7 và Cialdini (từ cm-content-factory).
Bao gồm:
1. Executive Summary & Vấn đề (Hook, Nỗi đau khách hàng & NĐ 70/2025).
2. Giải pháp Haravan Invoice (Vũ khí cạnh tranh vs MISA).
3. Các tính năng cốt lõi (từ coding & design prompts).
4. Roadmap (Q1-Q4) chi tiết.
5. Chiến lược Sales (Battlecard vs MISA).
Xuất ra định dạng Markdown thật chuyên nghiệp.
"""

# Call genspark
result = subprocess.run(['genspark', 'chat', 'ask', prompt, '--model', 'claude-opus-4-7'], capture_output=True, text=True)
with open('pitch_deck_final.md', 'w') as f:
    f.write(result.stdout)
    if result.stderr:
        f.write("\n\n--- ERRORS ---\n" + result.stderr)
print("Finished running genspark.")
