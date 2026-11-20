// Serie F: mappa di lavoro di un reel — per ogni inquadratura del master (tempi del reel) il mento (mediana / massimo) e le parole dette,
// con il tempo di inizio di ogni frase. Serve per piazzare le grafiche (solo dove il mento sta sopra il bordo). Uso: npx tsx scripts/f_map.ts F2-ciclista
import { readFileSync } from "node:fs";
import { ALL as REELS22, dirOf } from "./f_series";
import { layout, remapWords, tailFrames } from "../src/cn/timeline";
for (const id of process.argv.slice(2)) {
  const r = REELS22.find((x) => x.id === id)!; const p = r.props;
  const { items, total } = layout(p.segments, p.blendFrames, tailFrames(p.tailSeconds));
  const words = remapWords(p.words, items, p.wordFix, p.wordOffset);
  const pz: { master: [number, number]; src: [number, number] }[] = JSON.parse(readFileSync(`public/${p.master.replace(".mp4", "_pezzi.json")}`, "utf8"));
  const serie: [number, number][] = JSON.parse(readFileSync(`public/${p.master.replace(".mp4", "_mento.json")}`, "utf8"));
  console.log(`\n=== ${id}: ${(total / 30).toFixed(2)} s`);
  for (const z of pz) {
    const [a, b] = z.master; const c = serie.filter(([t]) => t >= a && t < b).map(([, y]) => y).sort((x, y) => x - y);
    const ws = words.filter((w) => w.start / 30 >= a - 0.02 && w.start / 30 < b - 0.02);
    const txt = ws.map((w, i) => (i === 0 || /[.?!,]$/.test(ws[i - 1].text) ? `[${(w.start / 30).toFixed(1)}] ` : "") + w.text).join(" ");
    console.log(`${a.toFixed(2).padStart(6)}-${b.toFixed(2).padStart(6)} mento ${c.length ? c[Math.floor(c.length / 2)].toFixed(2) + "/" + c[c.length - 1].toFixed(2) : "  —  "} | ${txt}`);
  }
}
