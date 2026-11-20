// Serie F (YTCN 22): volto libero grafica per grafica. Per ogni grafica non a tutto schermo confronta il mento più basso (serie *_mento.json
// di cn_facecheck.py) con il bordo alto della grafica: zona normale = (845 + gfxShift + dy) / 1920, fascia di `topword` = 0,652 (o `y`).
// Controlla anche i sottotitoli: dove sono accesi, il mento deve restare sopra il bordo alto della scatola dei sottotitoli.
// Uso: npx tsx scripts/f_facecheck.ts F1-normale [...]
import { readFileSync } from "node:fs";
import { ALL as REELS22, dirOf } from "./f_series";
import { layout, remapWords, resolveStart, tailFrames } from "../src/cn/timeline";
const FULL = new Set(["orbit", "drill", "guide", "pair", "lifebar", "fulltext", "slides", "renew", "versus", "plan", "wall", "side", "bill", "split"]);
let bad = 0;
for (const r of REELS22.filter((x) => !process.argv.slice(2).length || process.argv.slice(2).includes(x.id))) {
  const p = r.props, serie: [number, number][] = JSON.parse(readFileSync(`public/${p.master.replace(".mp4", "_mento.json")}`, "utf8"));
  const { items, total } = layout(p.segments, p.blendFrames, tailFrames(p.tailSeconds));
  const words = remapWords(p.words, items, p.wordFix, p.wordOffset);
  const capTop = (1920 * 0.735 - 46 + (p.capShift ?? 0)) / 1920; // scatola dei sottotitoli: 92 px attorno al centro della fascia
  const win: { a: number; b: number; kind: string; top: number; hide: boolean; full: boolean }[] = p.elements.flatMap((el: any) => {
    const a = resolveStart(el, words) / 30, b = a + el.dur;
    const top = el.kind === "topword" ? (el.zone === "strip" ? 0.652 : el.y ?? 0.07) : (845 + (p.gfxShift ?? 0) + (el.dy ?? 0)) / 1920;
    const full = FULL.has(el.kind);
    // grafica che scende a metà (`shiftAt`): due finestre, ognuna con il suo bordo; i sottotitoli possono spegnersi solo nella seconda
    if (el.shiftAt !== undefined) return [{ a, b: a + el.shiftAt - 0.04, kind: el.kind, top, hide: false, full }, { a: a + el.shiftAt, b, kind: el.kind + "↓", top: top + (el.shiftDy ?? 0) / 1920, hide: el.hideCapsFrom !== undefined, full }];
    return [{ a, b, kind: el.kind, top, hide: !!el.hideCaps, full }];
  });
  console.log(`\n${r.id}: sottotitoli da ${capTop.toFixed(3)}`);
  for (const w of win) {
    if (w.full) continue;
    const c = serie.filter(([t]) => t >= w.a - 0.04 && t <= w.b + 0.04).map(([, y]) => y); if (!c.length) continue;
    const ok = Math.max(...c) < w.top - 0.004; if (!ok) bad++;
    console.log(`  ${w.a.toFixed(2).padStart(6)}-${w.b.toFixed(2).padStart(6)} ${w.kind.padEnd(10)} bordo ${w.top.toFixed(3)} mento max ${Math.max(...c).toFixed(3)} ${ok ? "ok" : "✗ TOCCA IL VOLTO"}`);
  }
  // sottotitoli: fuori dalle grafiche che li spengono, da capFrom alla fine; le schede laterali/tutto schermo rimpiccioliscono o coprono il video
  const capBad = serie.filter(([t, y]) => t >= (p.capFrom ?? 0) && t < total / 30 - 0.5 && y > capTop - 0.004 && !win.some((w) => (w.hide || w.full) && t >= w.a - 0.07 && t <= w.b + 0.07));
  if (capBad.length) { bad++; console.log(`  ✗ sottotitoli sul mento a: ${capBad.map(([t, y]) => `${t}s (${y.toFixed(2)})`).join(", ")}`); } else console.log("  sottotitoli: mento sempre sopra");
}
console.log(bad ? `\n✗ ${bad} problemi` : "\n✓ volto sempre libero"); process.exit(bad ? 1 : 0);
