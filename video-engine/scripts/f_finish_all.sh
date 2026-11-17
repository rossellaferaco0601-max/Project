#!/usr/bin/env bash
# Serie F: finitura in coda. Per ogni ID:VERSIONE aspetta che scripts/f_queue.sh abbia finito il render grezzo (riga «DONE ID» nel log),
# poi fa la finitura (cn_finish.sh) e i controlli finali (f_qa.py). Uso: scripts/f_finish_all.sh out/ytcn22_queue.log F4-prezzi:v1 ...
set -uo pipefail
cd "$(dirname "$0")/.."; LOG="$1"; shift
for item in "$@"; do
  ID="${item%%:*}"; V="${item##*:}"
  until grep -q "=== DONE $ID " "$LOG"; do sleep 15; done
  echo "=== FINISH $ID $V $(date +%H:%M)"
  OUT=out/ytcn22 WK=work/ytcn22 WMODEL=large-v3-turbo scripts/cn_finish.sh "$ID" "$V" 2>&1 | grep -v "^\s*at \|Memory\|docker\|lower amount" | tail -4
  python3 scripts/f_qa.py "out/ytcn22/consegna/${ID}_${V}.mp4"
done
echo "=== ALL FINISHED"
