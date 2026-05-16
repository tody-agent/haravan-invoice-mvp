#!/bin/bash
echo "Starting research part 1..."
genspark chat ask "$(cat research/prompts/prompt_part1.txt)" --model claude-opus-4-7 --raw > research/results/part1.md
echo "Finished part 1. Starting part 2..."
genspark chat ask "$(cat research/prompts/prompt_part2.txt)" --model claude-opus-4-7 --raw > research/results/part2.md
echo "Finished part 2. Starting part 3..."
genspark chat ask "$(cat research/prompts/prompt_part3.txt)" --model claude-opus-4-7 --raw > research/results/part3.md
echo "Finished part 3. Starting part 4..."
genspark chat ask "$(cat research/prompts/prompt_part4.txt)" --model claude-opus-4-7 --raw > research/results/part4.md
echo "Finished part 4. Starting part 5..."
genspark chat ask "$(cat research/prompts/prompt_part5.txt)" --model claude-opus-4-7 --raw > research/results/part5.md
echo "Finished part 5."

cat research/results/part1.md research/results/part2.md research/results/part3.md research/results/part4.md research/results/part5.md > research/HARAVAN_INVOICE_RESEARCH.md
echo "All done. Combined file saved to research/HARAVAN_INVOICE_RESEARCH.md"
