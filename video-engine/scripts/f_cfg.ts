// Configurazione del master (scripts/cn_master_shots.py) per i reel della serie F (YTCN 22): work/ytcn22/<id>.json
// Uso: npx tsx scripts/f_cfg.ts F1-normale [F2-ciclista ...]   (senza argomenti: tutta la serie)
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { REELS22 } from "../src/cn/reels22";
mkdirSync("work/ytcn22", { recursive: true }); mkdirSync("public/ytcn22/masters", { recursive: true });
const ids = process.argv.slice(2);
for (const r of REELS22.filter((x) => !ids.length || ids.includes(x.id))) {
  const p = r.props, extraPath = `work/ytcn22/${r.id}_extra.json`;
  const extra = existsSync(extraPath) ? JSON.parse(readFileSync(extraPath, "utf8")) : {}; // crops / lead / stretch / broll a mano
  writeFileSync(`work/ytcn22/${r.id}.json`, JSON.stringify({ id: r.id, src: `public/${p.src}`, out: `public/${p.master}`, shots: "work/ytcn22_shots.json", srcSize: [1920, 1080],
    blendFrames: p.blendFrames, tail: p.tailSeconds ?? 0.5, tailLive: p.tailLive ?? (p.tailSeconds ?? 0.5), segments: p.segments, crops: {}, ...extra }, null, 1));
  console.log(r.id, p.segments.map((s) => `${s.from}-${s.to}`).join(" "));
}
