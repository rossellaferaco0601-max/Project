// Configurazione del master (scripts/cn_master_shots.py) per i reel della serie F (YTCN 22): work/ytcn22/<id>.json
// Uso: npx tsx scripts/f_cfg.ts F1-normale [F2-ciclista ...]   (senza argomenti: tutta la serie)
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { ALL as REELS22, dirOf } from "./f_series";
const ids = process.argv.slice(2);
for (const r of REELS22.filter((x) => (!ids.length && x.id.startsWith("F")) || ids.includes(x.id))) {
  const p = r.props, Y = dirOf(r), extraPath = `work/${Y}/${r.id}_extra.json`;
  mkdirSync(`work/${Y}`, { recursive: true }); mkdirSync(`public/${Y}/masters`, { recursive: true });
  const extra = existsSync(extraPath) ? JSON.parse(readFileSync(extraPath, "utf8")) : {}; // crops / lead / stretch / broll a mano
  writeFileSync(`work/${Y}/${r.id}.json`, JSON.stringify({ id: r.id, src: `public/${p.src}`, out: `public/${p.master}`, shots: `work/${Y}_shots.json`, srcSize: [1920, 1080],
    blendFrames: p.blendFrames, tail: p.tailSeconds ?? 0.5, tailLive: p.tailLive ?? (p.tailSeconds ?? 0.5), segments: p.segments, crops: {}, ...extra }, null, 1));
  console.log(r.id, p.segments.map((s) => `${s.from}-${s.to}`).join(" "));
}
