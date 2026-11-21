#!/usr/bin/env bash
# Chiede a Gemini la stesura di un'illustrazione (prompt in work/ytcn26/gemini/prompt_<Nome>.txt) e la salva in src/cn/gem/<Nome>.tsx.
# I modelli flash sono spesso saturi (503): fino a 8 tentativi. Uso: work/ytcn26/gemini/ask.sh GemNose [GemHeat ...]
cd "$(dirname "$0")/../../.."
for N in "$@"; do
  for try in 1 2 3 4 5 6 7 8; do
    GEMINI_MODEL=gemini-3.8-flash,gemini-3.7-flash,gemini-3.5-flash,gemini-3-flash-preview,gemini-flash-latest python3 scripts/gemini.py testo "$(cat work/ytcn26/gemini/prompt_$N.txt)" > work/ytcn26/gemini/$N.raw 2> work/ytcn26/gemini/$N.err && [ -s work/ytcn26/gemini/$N.raw ] && break
    sleep 20
  done
  if [ -s work/ytcn26/gemini/$N.raw ]; then { echo "// Illustrazione scritta da Gemini (gemini-flash) su indicazioni di regia (work/ytcn26/gemini/prompt_$N.txt); scritte e agganci in Elements10."; sed -e '/^```/d' work/ytcn26/gemini/$N.raw; } > src/cn/gem/$N.tsx; echo "ok $N"; else echo "FALLITO $N"; fi
done
