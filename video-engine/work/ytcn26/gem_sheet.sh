#!/usr/bin/env bash
# Foglio di controllo di un'illustrazione di src/cn/gem con firma { t, uid, cues }: sei istanti (agganci a 0,5 · 1,5 · 2,5 · 3,5 · 4,5 · 5,5 s).
# Uso: work/ytcn26/gem_sheet.sh GemNose cartella_di_uscita   → cartella/GemNose.png
cd "$(dirname "$0")/../.."; N="$1"; O="$2"; mkdir -p "$O"
npx tsx work/ytcn26/gem_preview.tsx "$N" "$O/h" '{"cues":[0.5,1.5,2.5,3.5,4.5,5.5]}' 0.3,1.2,2.2,3.2,4.2,6.4 || exit 1
node -e "
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:330,height:350}});for(let i=0;i<6;i++){await p.goto('file://$O/h/${N}_'+i+'.html');await p.screenshot({path:'$O/h/${N}_'+i+'.png'})}await b.close()})()"
ffmpeg -v error -y $(for i in 0 1 2 3 4 5; do echo -i "$O/h/${N}_$i.png"; done) -filter_complex "xstack=grid=6x1" "$O/$N.png"
