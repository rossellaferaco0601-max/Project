#!/usr/bin/env bash
# Serie F (YTCN 22): coda dei render, un reel alla volta. Per ogni ID:VERSIONE cerca i fotogrammi da copertina (cn_smile.py) e renderizza
# il file grezzo out/ytcn22/<ID>_<V>_raw.mp4; la finitura (audio, anteprima, copertina, didascalia, ritrascrizione) si fa dopo con
#   OUT=out/ytcn22 WK=work/ytcn22 WMODEL=large-v3-turbo scripts/cn_finish.sh ID V
# Uso: scripts/f_queue.sh F1-normale:v2 F2-ciclista:v1 ...
set -uo pipefail
cd "$(dirname "$0")/.."; mkdir -p out/ytcn22
for item in "$@"; do
  ID="${item%%:*}"; V="${item##*:}"; case "$ID" in G*) Y=ytcn26;; *) Y=ytcn22;; esac; mkdir -p "out/$Y"   # serie F = YTCN 22, serie G = YTCN 26
  echo "=== START $ID $V $(date +%H:%M)"
  [ -f "public/$Y/masters/${ID}_sorriso.json" ] || ../.claude/skills/effects/.venv/bin/python scripts/cn_smile.py "public/$Y/masters/$ID.mp4" 2>/dev/null | head -1
  rm -f "out/$Y/${ID}_${V}_raw.mp4"
  npx remotion render "$ID" "out/$Y/${ID}_${V}_raw.mp4" --codec=h264 --crf=18 --log=error 2>&1 | grep -v "Memory\|docker\|lower amount" | tail -2
  ls -la "out/$Y/${ID}_${V}_raw.mp4" | awk '{print $5}'
  echo "=== DONE $ID $(date +%H:%M)"
done
echo "=== QUEUE FINISHED"
