// Serie F: dove mettere ogni grafica della zona normale. Per ogni grafica: il mento più basso mentre è a schermo, il bordo alto più alto
// ammesso (mento + 0,022), l'altezza della grafica, lo spostamento `dy` consigliato e l'aria che resta sopra i sottotitoli.
// Regola (Ross 18/11): tra grafiche e sottotitoli almeno ~100 px; tutto dentro le zone sicure di Instagram (sottotitoli sopra 1500 px).
// Uso: npx tsx scripts/f_place.ts F4-prezzi [...]     ✗ = aria sotto i 90 px (accorciare la grafica o spostarla in un altro momento)
import { readFileSync } from "node:fs";
import { ALL as REELS22, dirOf } from "./f_series";
import { layout, remapWords, resolveStart, tailFrames } from "../src/cn/timeline";
const FULL = new Set(["orbit", "drill", "guide", "pair", "lifebar", "fulltext", "slides", "renew", "versus", "plan", "wall", "side", "bill", "split", "takeaway"]);
/** altezza in px (a scala 1) di ogni grafica della zona */
export const heightOf = (el: any): number => {
  switch (el.kind) {
    case "kinetic": return 20 + el.words.reduce((a: number, _: string, i: number) => a + (i === (el.accentIndex ?? el.words.length - 1) ? 143 : 92), 0);
    case "title": { const m = Math.max(...el.lines.map((l: string) => l.length)), sz = Math.min(98, Math.floor(1750 / m)); return 10 + el.lines.length * (sz * 1.02 + 24) + (el.lines.length - 1) * 14; }
    case "stamp": { const m = Math.max(...el.lines.map((l: string) => l.length)), sz = Math.min(78, Math.floor(1560 / m)); return 6 + el.lines.length * (sz * 1.02 + 24 + 12) + 6 + Math.min(96, Math.floor(1380 / Math.max(8, el.stamp.length))) + 42 + 14; }
    case "question": return 235; case "chips": return 6 + Math.ceil(el.items.join("").length / 20) * 112; case "switches": return 96 + el.items.length * 98;
    case "chat": return el.messages.length <= 2 ? 392 : 432; case "slam": return 350; case "cycle": return 190; case "pressure": return 336;
    case "drain": return 86 + el.items.length * 84; case "progress": return 340; case "lights": return 400; case "loop": return 392; case "stat": return 250;
    case "widget": return 110 + el.lines.length * 64; case "counter": return 250; case "bigstrike": return 260; case "journey": return 96 + el.items.length * 98;
    case "scale2": return 372; case "grid4": return 394; case "checklist": return el.items.length * (el.big ? 112 : 78); case "receipt": return 376; case "quad": return el.foot ? 370 : 270; case "rise": return 250;
    case "fog": return 20 + el.lines.length * 124; case "layers": return 350; case "hangtag": return 312; case "gust": return 280; case "rings": return 336; case "gem": return 336; case "kin": return 12 + el.words.length * 140; case "dose": return (el.tags ? 100 : 0) + 240; case "ticks": return el.items.length * 118; case "duel": return 244;
    case "nametag": return 230; default: return 400;
  }
};
for (const r of REELS22.filter((x) => process.argv.slice(2).includes(x.id))) {
  const p = r.props, serie: [number, number][] = JSON.parse(readFileSync(`public/${p.master.replace(".mp4", "_mento.json")}`, "utf8"));
  const { items } = layout(p.segments, p.blendFrames, tailFrames(p.tailSeconds));
  const words = remapWords(p.words, items, p.wordFix, p.wordOffset);
  const base = 845 + (p.gfxShift ?? 0), sc = p.gfxScale ?? 1, capTop = 1920 * 0.735 - 46 + (p.capShift ?? 0);
  console.log(`\n${r.id}: zona da ${base} px, sottotitoli da ${Math.round(capTop)} a ${Math.round(capTop + 92)} px`);
  p.elements.forEach((el: any) => {
    const a = resolveStart(el, words) / 30, b = a + el.dur;
    if (FULL.has(el.kind) || el.kind === "topword") { console.log(`  ${a.toFixed(2).padStart(6)}-${b.toFixed(2).padStart(6)} ${el.kind.padEnd(10)} (fuori zona)`); return; }
    const c = serie.filter(([t]) => t >= a - 0.04 && t <= b + 0.04).map(([, y]) => y); const chin = c.length ? Math.max(...c) : 0.45;
    const h = heightOf(el) * sc, minTop = Math.round((chin + 0.022) * 1920);
    const want = Math.min(0, Math.round(capTop - 100 - h - base)), dy = el.hideCaps ? (el.dy ?? 0) : Math.max(minTop - base, want);
    const top = base + (el.dy ?? 0), gap = capTop - (top + h);
    console.log(`  ${a.toFixed(2).padStart(6)}-${b.toFixed(2).padStart(6)} ${el.kind.padEnd(10)} mento ${chin.toFixed(3)} alt ${Math.round(h)} | dy ora ${el.dy ?? 0} → bordo ${top} (min ${minTop}) aria ${Math.round(gap)}${el.hideCaps ? " (sottotitoli spenti)" : ""} | consigliato dy ${dy} → aria ${Math.round(capTop - (base + dy + h))}${top < minTop - 1 ? "  ✗ SUL VOLTO" : ""}${!el.hideCaps && gap < 90 ? "  ✗ poca aria" : ""}`);
  });
}
