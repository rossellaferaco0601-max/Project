import React from "react";
import { useVideoConfig, spring } from "remotion";
import type { Element } from "./types";
import { BRAND, PANEL_X, PANEL_W, GFX_TOP } from "./types";
import { useInOut } from "./Elements3D";

/* Serie F (YTCN 22, «Il costo invisibile degli infortuni»): animazioni dei concetti, ognuna usata in un solo reel.
   `loop` = il ciclo che si richiude (ciclo degli infortuni), `drain` = livelli che si svuotano (energia, umore, forma),
   `progress` = la barra dei progressi che si riempie e poi torna a zero, `scale2` = bilancia (a che prezzo?).
   Tutte nella zona grafiche (scatola scura, scritte ≥ 64 px), agganciate alle parole con `cues`. */

const FONT = "Blinker, sans-serif";
const CORAL = "#FF6B4A";
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
type P<K extends Element["kind"]> = { el: Extract<Element, { kind: K }>; start: number };
const cueF = (el: Element, i: number, fps: number, def: number) => Math.round((el.onAt?.[i] ?? def) * fps);
const panel = (s: number, out: number, h: number): React.CSSProperties => ({ position: "absolute", left: PANEL_X, width: PANEL_W, top: GFX_TOP, height: h, borderRadius: 30, background: "rgba(11,15,10,0.9)", fontFamily: FONT, color: BRAND.white, opacity: out * Math.min(1, s * 1.3), transform: `translateY(${(1 - s) * 40}px)`, overflow: "hidden" });
const head: React.CSSProperties = { position: "absolute", top: 20, left: 0, width: "100%", textAlign: "center", fontWeight: 900, fontSize: 44, textTransform: "uppercase", letterSpacing: 3, color: BRAND.lime };

/* ---------- ciclo: quattro tappe ai vertici, una alla volta sulla parola detta; poi un punto gira e il ciclo si richiude ---------- */
export const Loop: React.FC<P<"loop">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, s, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const Hh = 392, n = el.items.length; // 4 tappe: in alto a sinistra → in alto a destra → in basso a destra → in basso a sinistra
  const cw = 395, chH = 116, pos = [[20, 90], [465, 90], [465, 256], [20, 256]];
  const on = el.items.map((_, i) => cueF(el, i, fps, 0.5 + i * 0.9));
  const closed = local >= on[n - 1] + 10;
  // ciclo chiuso: le frecce si accendono a turno, in senso orario (un giro ogni 1,6 s)
  const chase = closed ? Math.floor(((local - on[n - 1] - 10) / (fps * 0.4)) % 4) : -1;
  const arrows = ["→", "↓", "←", "↑"], apos = [[412, 126], [634, 208], [412, 292], [190, 208]];
  return (
    <div style={panel(s, out, Hh)}>
      <div style={head}>{el.title}</div>
      {el.items.map((it, i) => {
        const k = spring({ frame: local - on[i], fps, config: { damping: 12, stiffness: 210, mass: 0.7 } }), lit = local >= on[i];
        const last = i === n - 1;
        const size = Math.min(66, Math.floor(640 / Math.max(7, ...el.items.map((x) => x.length))));
        return (
          <div key={i} style={{ position: "absolute", left: pos[i][0], top: pos[i][1], width: cw, height: chH, borderRadius: 22, boxSizing: "border-box", border: `5px solid ${lit ? (last ? CORAL : BRAND.lime) : "rgba(255,255,255,0.16)"}`, background: lit ? (last ? "rgba(255,107,74,0.2)" : "rgba(149,255,0,0.13)") : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${lit ? 0.88 + 0.12 * k : 1})` }}>
            <div style={{ fontWeight: 900, fontSize: size, lineHeight: 1, textTransform: "uppercase", whiteSpace: "nowrap", color: lit ? BRAND.white : "rgba(255,255,255,0)" }}>{it}</div>
          </div>
        );
      })}
      {arrows.map((a, i) => {
        const lit = local >= (i < n - 1 ? on[i + 1] : on[n - 1] + 10);
        return <div key={i} style={{ position: "absolute", left: apos[i][0], top: apos[i][1], width: 56, textAlign: "center", fontWeight: 900, fontSize: 44, lineHeight: 1, color: chase === i ? BRAND.white : lit ? (i === n - 1 ? CORAL : BRAND.lime) : "rgba(255,255,255,0.18)", transform: `scale(${chase === i ? 1.25 : 1})` }}>{a}</div>;
      })}
    </div>
  );
};

/* ---------- livelli che si svuotano: ogni barra parte piena (lime) e scende (corallo) quando Daniele nomina la voce ---------- */
export const Drain: React.FC<P<"drain">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, s, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const n = el.items.length, rowH = 84, Hh = 80 + n * rowH + 6;
  return (
    <div style={panel(s, out, Hh)}>
      <div style={head}>{el.title}</div>
      {el.items.map((it, i) => {
        const f0 = cueF(el, i, fps, 0.6 + i * 0.8);
        const k = easeOut((local - f0) / 26), level = el.fill ? 0.26 + 0.74 * k : 1 - 0.74 * k;   // si svuota (o, con `fill`, si riempie) in poco meno di un secondo
        const col = el.fill ? (k > 0.45 ? BRAND.lime : "rgba(255,255,255,0.6)") : k > 0.45 ? CORAL : BRAND.lime;
        return (
          <div key={i} style={{ position: "absolute", left: 36, right: 36, top: 78 + i * rowH, height: rowH - 12 }}>
            <div style={{ position: "absolute", left: 0, top: 0, fontWeight: 900, fontSize: 66, lineHeight: "72px", textTransform: "uppercase", zIndex: 2, paddingLeft: 22, textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>{it}</div>
            <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ width: `${level * 100}%`, height: "100%", background: col, opacity: 0.55, borderRadius: 18 }} />
            </div>
            <div style={{ position: "absolute", right: 18, top: 0, lineHeight: "72px", fontWeight: 900, fontSize: 56, color: col, opacity: clamp01((local - f0) / 8) }}>{el.fill ? "↑" : "↓"}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- progressi: la barra si riempie (primo aggancio), poi crolla a zero (secondo aggancio) e cambia la scritta ---------- */
export const Progress: React.FC<P<"progress">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, s, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const f0 = cueF(el, 0, fps, 0.3), f1 = cueF(el, 1, fps, el.dur * 0.55);
  const fill = easeOut((local - f0) / Math.max(20, (f1 - f0) * 0.8));
  const drop = easeOut((local - f1) / 9), level = fill * (1 - drop);
  const dropped = local >= f1;
  const kick = dropped ? Math.exp(-(local - f1) / 5) * Math.sin((local - f1) * 1.7) * 14 : 0;
  const pop = spring({ frame: local - f1, fps, config: { damping: 9, stiffness: 240, mass: 0.6 } });
  return (
    <div style={{ ...panel(s, out, 340), transform: `translate(${kick}px, ${(1 - s) * 40}px)` }}>
      <div style={{ ...head, color: dropped ? CORAL : BRAND.lime }}>{dropped ? el.after : el.title}</div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 100, height: 96, borderRadius: 48, background: "rgba(255,255,255,0.1)", overflow: "hidden", border: "4px solid rgba(255,255,255,0.22)", boxSizing: "border-box" }}>
        <div style={{ width: `${level * 100}%`, height: "100%", background: BRAND.lime, borderRadius: 48 }} />
      </div>
      {/* tacche dei mesi */}
      {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 40 + ((PANEL_W - 80) * (i + 1)) / 7, top: 100, width: 4, height: 96, background: "rgba(11,15,10,0.55)" }} />)}
      <div style={{ position: "absolute", left: 0, width: "100%", top: 214, textAlign: "center", fontWeight: 900, fontSize: 96, lineHeight: 1, textTransform: "uppercase", color: dropped ? BRAND.white : BRAND.white, transform: `scale(${dropped ? 0.8 + 0.2 * pop : 1})` }}>
        {dropped ? el.zero : el.label}
      </div>
    </div>
  );
};

/* ---------- bilancia: a sinistra quello che ti promettono, a destra quello che paghi; il piatto di destra scende al secondo aggancio ---------- */
export const Scale2: React.FC<P<"scale2">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, s, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const tilted = el.from === "tilted";   // riparte già inclinata dalla parte del prezzo (stesso pannello dopo uno stacco di inquadratura)
  const f0 = cueF(el, 0, fps, 0.3), f1 = cueF(el, 1, fps, el.dur * 0.5);
  const a = tilted ? 1 : spring({ frame: local - f0, fps, config: { damping: 13, stiffness: 190 } });
  const b = tilted ? 1 : spring({ frame: local - f1, fps, config: { damping: 9, stiffness: 120, mass: 1 } });
  // la bilancia non sta mai ferma: il braccio dondola piano (più ampio quando un piatto è appena sceso)
  const t = (local + (el.phase ?? 0)) / fps;
  const sway = (1.6 + 1.4 * b) * Math.sin(t * Math.PI * 2 / 1.7) + 0.6 * Math.sin(t * Math.PI * 2 / 0.9);
  const tilt = -6 * a + 15 * b + sway * Math.min(1, local / 10 + (tilted ? 1 : 0)); // gradi: prima pende a sinistra (la promessa), poi a destra (il prezzo)
  const rad = (tilt * Math.PI) / 180, arm = 215, cx = PANEL_W / 2, cy = 126;
  const lx = cx - arm * Math.cos(rad), ly = cy - arm * Math.sin(rad), rx = cx + arm * Math.cos(rad), ry = cy + arm * Math.sin(rad);
  const plate = (x: number, y: number, text: string, col: string, k: number) => (
    <div style={{ position: "absolute", left: x - 215, top: y + 10, width: 430, textAlign: "center", opacity: clamp01(k * 1.4) }}>
      <div style={{ margin: "0 auto", width: 4, height: 34, background: "rgba(255,255,255,0.6)" }} />
      <div style={{ display: "inline-block", minWidth: 240, background: col, color: BRAND.ink, fontWeight: 900, fontSize: Math.min(68, Math.floor(640 / Math.max(7, text.length))), lineHeight: 1, textTransform: "uppercase", whiteSpace: "nowrap", padding: "20px 22px", borderRadius: 20 }}>{text}</div>
    </div>
  );
  return (
    <div style={{ ...panel(tilted ? 1 : s, out, 372), ...(tilted ? { opacity: out } : {}) }}>
      <div style={head}>{el.title}</div>
      <svg width={PANEL_W} height={372} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={BRAND.white} strokeWidth={10} strokeLinecap="round" />
        <path d={`M${cx - 26} ${cy + 46} L${cx} ${cy} L${cx + 26} ${cy + 46} Z`} fill={BRAND.white} />
      </svg>
      {plate(lx, ly, el.left, BRAND.lime, a)}
      {plate(rx, ry, el.right, CORAL, b)}
    </div>
  );
};

/* ---------- timbro: la frase su targhe scure, poi il giudizio piomba sopra come un timbro (in lime o corallo) ---------- */
export const Stamp: React.FC<P<"stamp">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const maxLen = Math.max(...el.lines.map((l) => l.length)), size = Math.min(78, Math.floor(1560 / maxLen));
  const col = el.tone === "coral" ? CORAL : BRAND.lime, n = el.lines.length;
  const fs = cueF(el, n, fps, 0.9 + n * 0.3), f = local - fs;
  const sSize = Math.min(96, Math.floor(1380 / Math.max(8, el.stamp.length)));
  const sc = f < 0 ? 0 : f < 5 ? 2.6 - 1.6 * (f / 5) * (f / 5) : 1 + 0.06 * Math.exp(-(f - 5) / 3) * Math.cos((f - 5) * 1.4);
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: GFX_TOP + 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: FONT, opacity: out }}>
      {el.lines.map((l, i) => {
        const k = easeOut((local - cueF(el, i, fps, i * 0.2)) / 12);
        return <div key={i} style={{ background: "rgba(11,15,10,0.88)", borderRadius: 16, padding: "12px 34px", fontWeight: 900, fontSize: size, lineHeight: 1.02, textTransform: "uppercase", color: BRAND.white, whiteSpace: "nowrap", opacity: k, transform: `translateY(${(1 - k) * 40}px)` }}>{l}</div>;
      })}
      <div style={{ marginTop: 6, border: `9px solid ${col}`, borderRadius: 20, padding: "12px 34px", background: "rgba(11,15,10,0.92)", color: col, fontWeight: 900, fontSize: sSize, lineHeight: 1, textTransform: "uppercase", letterSpacing: 2, whiteSpace: "nowrap", transform: `rotate(-4deg) scale(${sc})`, opacity: f < 0 ? 0 : clamp01((f + 1) / 2) }}>{el.stamp}</div>
    </div>
  );
};

/* ---------- pillole che si accumulano: ogni voce entra sulla parola detta; l'ultima arrivata è piena (lime), le altre scure ---------- */
export const Chips: React.FC<P<"chips">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const on = el.items.map((_, i) => cueF(el, i, fps, 0.2 + i * 0.7));
  let last = -1; on.forEach((f, i) => { if (local >= f) last = i; });
  return (
    <div style={{ position: "absolute", left: 60, width: 960, top: GFX_TOP + 6, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, fontFamily: FONT, opacity: out }}>
      {el.items.map((it, i) => {
        const k = spring({ frame: local - on[i], fps, config: { damping: 11, stiffness: 220, mass: 0.6 } });
        const hot = i === last, col = el.strike ? CORAL : BRAND.lime, cut = el.strike && local >= on[i] + 14;   // strike: voci che si perdono (corallo, barrate poco dopo)
        return <div key={i} style={{ background: hot ? col : "rgba(11,15,10,0.9)", color: hot ? BRAND.ink : BRAND.white, border: `5px solid ${col}`, textDecoration: cut ? "line-through" : "none", textDecorationThickness: 7, borderRadius: 999, padding: "14px 36px", fontWeight: 900, fontSize: Math.min(72, Math.floor(1300 / Math.max(10, it.length))), lineHeight: 1, textTransform: "uppercase", whiteSpace: "nowrap", transform: `scale(${local >= on[i] ? 0.6 + 0.4 * k : 0})`, opacity: local >= on[i] ? 1 : 0 }}>{it}</div>;
      })}
    </div>
  );
};

/* ---------- interruttori che si spengono: ogni voce parte accesa e si spegne sulla parola detta ---------- */
export const Switches: React.FC<P<"switches">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, s, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const n = el.items.length, rowH = 98;
  return (
    <div style={panel(s, out, 88 + n * rowH + 8)}>
      <div style={head}>{el.title}</div>
      {el.items.map((it, i) => {
        const k = spring({ frame: local - cueF(el, i, fps, 0.8 + i * 0.8), fps, config: { damping: 14, stiffness: 240, mass: 0.5 } });
        const off = clamp01(k);
        return (
          <div key={i} style={{ position: "absolute", left: 40, right: 40, top: 84 + i * rowH, height: rowH - 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 900, fontSize: Math.min(68, Math.floor(1050 / Math.max(9, ...el.items.map((x) => x.length)))), lineHeight: 1, textTransform: "uppercase", color: off > 0.5 ? "rgba(255,255,255,0.5)" : BRAND.white, textDecoration: off > 0.5 ? "line-through" : "none", textDecorationColor: CORAL, whiteSpace: "nowrap" }}>{it}</div>
            <div style={{ width: 132, height: 70, borderRadius: 35, background: off > 0.5 ? "rgba(255,255,255,0.18)" : BRAND.lime, position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 7, left: 69 - 62 * off, width: 56, height: 56, borderRadius: 28, background: off > 0.5 ? CORAL : BRAND.white }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- pressione: senza valvola di sfogo la barra sale dal lime al corallo e il pannello trema; a fine corsa cambia la scritta ---------- */
export const Pressure: React.FC<P<"pressure">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const durF = Math.round(el.dur * fps);
  const { local, s, out, visible } = useInOut(start, durF);
  if (!visible) return null;
  const f1 = cueF(el, 0, fps, el.dur * 0.55);
  const level = 0.14 + 0.86 * clamp01(local / Math.max(20, f1 + 10)) ** 1.4;
  const hot = local >= f1;
  const col = level > 0.8 ? CORAL : level > 0.5 ? "#FFB020" : BRAND.lime;
  const shake = level > 0.55 ? Math.sin(local * 2.3) * 7 * (level - 0.55) / 0.45 : 0;
  const pop = spring({ frame: local - f1, fps, config: { damping: 9, stiffness: 240, mass: 0.6 } });
  return (
    <div style={{ ...panel(s, out, 336), transform: `translate(${shake}px, ${(1 - s) * 40}px)` }}>
      <div style={{ ...head, color: hot ? CORAL : BRAND.lime }}>{el.title}</div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 96, height: 92, borderRadius: 46, background: "rgba(255,255,255,0.1)", overflow: "hidden", border: "4px solid rgba(255,255,255,0.22)", boxSizing: "border-box" }}>
        <div style={{ width: `${level * 100}%`, height: "100%", background: col, borderRadius: 46 }} />
      </div>
      <div style={{ position: "absolute", left: 0, width: "100%", top: 208, textAlign: "center", fontWeight: 900, fontSize: Math.min(96, Math.floor(1300 / Math.max(8, (hot ? el.end : el.label).length))), lineHeight: "100px", textTransform: "uppercase", transform: `scale(${hot ? 0.8 + 0.2 * pop : 1})` }}>{hot ? el.end : el.label}</div>
    </div>
  );
};

/* ---------- percorso passo dopo passo: una linea verticale che scende da una tappa all'altra, ogni tappa sulla parola detta ---------- */
export const Journey: React.FC<P<"journey">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, s, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const n = el.items.length, rowH = 98, y0 = 132;
  const on = el.items.map((_, i) => cueF(el, i, fps, 0.6 + i * 0.9));
  let prog = 0; // avanzamento della linea, in tappe
  on.forEach((f, i) => { if (i > 0) prog = Math.max(prog, i - 1 + easeOut((local - f + 10) / 10)); });
  return (
    <div style={panel(s, out, 88 + n * rowH + 8)}>
      <div style={head}>{el.title}</div>
      <div style={{ position: "absolute", left: 71, top: y0, width: 10, height: (n - 1) * rowH, background: "rgba(255,255,255,0.14)", borderRadius: 5 }} />
      <div style={{ position: "absolute", left: 71, top: y0, width: 10, height: Math.min(n - 1, prog) * rowH, background: BRAND.lime, borderRadius: 5 }} />
      {el.items.map((it, i) => {
        const lit = local >= on[i], k = spring({ frame: local - on[i], fps, config: { damping: 11, stiffness: 220, mass: 0.6 } });
        return (
          <div key={i} style={{ position: "absolute", left: 40, right: 30, top: y0 - 36 + i * rowH, height: 72, display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ width: 72, height: 72, borderRadius: 36, flexShrink: 0, background: lit ? BRAND.lime : "#1d241a", border: `5px solid ${lit ? BRAND.lime : "rgba(255,255,255,0.25)"}`, boxSizing: "border-box", color: BRAND.ink, fontWeight: 900, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${lit ? 0.75 + 0.25 * k : 1})` }}>{lit ? i + 1 : ""}</div>
            <div style={{ fontWeight: 900, fontSize: Math.min(70, Math.floor(1200 / Math.max(10, it.length))), lineHeight: 1, textTransform: "uppercase", whiteSpace: "nowrap", color: BRAND.white, opacity: lit ? clamp01(k * 1.5) : 0, transform: `translateX(${lit ? (1 - k) * 40 : 0}px)` }}>{it}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- scontrino: «il conto» dei prezzi da pagare. Dalla fessura esce la carta e stampa una riga per ogni prezzo, sulla parola detta;
   si vedono le ultime tre righe (la carta scorre verso il basso e la più vecchia esce dal bordo strappato). Sta sotto il mento, il video resta
   a tutto schermo (Ross 18/11: niente elenco a lato su fondo scuro) ---------- */
const INK = "#0B0F0A";
const zig = (w: number, y: number, n = 28) => { let d = `M0 0 L${w} 0 L${w} ${y}`; for (let i = n; i >= 0; i--) d += ` L${(w * i) / n} ${y + (i % 2 ? 14 : 0)}`; return d + " Z"; };
export const Receipt: React.FC<P<"receipt">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, s, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const LH = 92, SHOW = 3, PW = 820, n = el.items.length;
  const on = el.items.map((_, i) => cueF(el, i, fps, 0.6 + i * 1.2));
  let count = 0, feed = 0; // righe già stampate e avanzamento (0-1) della riga in stampa
  on.forEach((f, i) => { if (local >= f) { count = i + 1; feed = easeOut((local - f) / 9); } });
  const printing = feed < 1 && count > 0;
  const size = Math.min(66, Math.floor(1120 / Math.max(10, ...el.items.map((x) => x.length))));
  const rows = Math.min(SHOW, count - 1 + feed), paperH = Math.max(0, rows * LH + (count ? 20 : 0));
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: GFX_TOP, height: 60 + SHOW * LH + 40, fontFamily: FONT, opacity: out * Math.min(1, s * 1.3), transform: `translateY(${(1 - s) * 30}px)` }}>
      {/* carta */}
      <div style={{ position: "absolute", left: (1080 - PW) / 2, top: 48, width: PW, height: paperH + 14, overflow: "hidden" }}>
        <svg width={PW} height={paperH + 14} style={{ position: "absolute", left: 0, top: 0 }}><path d={zig(PW, paperH)} fill={BRAND.cream} /></svg>
        {el.items.map((it, i) => {
          if (i >= count) return null;
          const age = count - 1 - i;                          // 0 = la riga appena stampata
          const y = 16 + (age - 1 + feed) * LH + (age === 0 ? 0 : 0);
          const top = age === 0 ? 16 - (1 - feed) * LH : y;    // la nuova scende da sotto la fessura, le altre scalano di una riga
          return (
            <div key={i} style={{ position: "absolute", left: 26, right: 20, top, height: LH - 10, display: "flex", alignItems: "center", gap: 18, borderBottom: "3px dashed rgba(11,15,10,0.22)", boxSizing: "border-box" }}>
              <div style={{ width: 60, height: 60, borderRadius: 30, background: BRAND.green, color: BRAND.white, fontWeight: 900, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontWeight: 900, fontSize: size, lineHeight: 1, textTransform: "uppercase", color: INK, whiteSpace: "nowrap", letterSpacing: -0.5 }}>{it}</div>
            </div>
          );
        })}
      </div>
      {/* fessura della stampante, con il titolo */}
      <div style={{ position: "absolute", left: (1080 - 900) / 2, top: 0, width: 900, height: 66, borderRadius: 18, background: "rgba(11,15,10,0.94)", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, boxShadow: "0 6px 0 rgba(0,0,0,0.35)" }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: printing ? BRAND.lime : "rgba(149,255,0,0.45)", boxShadow: printing ? `0 0 14px ${BRAND.lime}` : "none" }} />
        <div style={{ fontWeight: 900, fontSize: 42, letterSpacing: 2, textTransform: "uppercase", color: BRAND.white, whiteSpace: "nowrap" }}>{el.title}</div>
        <div style={{ fontWeight: 900, fontSize: 40, color: BRAND.lime, minWidth: 70, textAlign: "right" }}>{count}/{n}</div>
      </div>
    </div>
  );
};

/* ---------- il conto intero, a tutto schermo: sale dal basso come la CTA (stesso verde del brand, niente fondo scuro), mostra tutte le voci
   e il totale e resta fermo finché la CTA lo copre. Chiude il reel senza mostrare l'inquadratura successiva del video di partenza ---------- */
export const Bill: React.FC<P<"bill">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const durF = Math.round(el.dur * fps);
  const { local, visible } = useInOut(start, durF);
  if (!visible) return null;
  const up = 1 - Math.pow(1 - clamp01(local / 9), 3);
  const size = Math.min(76, Math.floor(1120 / Math.max(10, ...el.items.map((x) => x.length))));
  const LH = 124, PW = 900, top = 230, ph = 150 + el.items.length * LH + 160;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, background: BRAND.green, transform: `translateY(${(1 - up) * 100}%)`, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: (1080 - PW) / 2, top, width: PW, height: ph + 14 }}>
        <svg width={PW} height={ph + 14} style={{ position: "absolute", left: 0, top: 0 }}><path d={zig(PW, ph, 34)} fill={BRAND.cream} /></svg>
        <div style={{ position: "absolute", left: 0, width: PW, top: 34, textAlign: "center", fontWeight: 900, fontSize: 58, letterSpacing: 2, textTransform: "uppercase", color: INK }}>{el.title}</div>
        <div style={{ position: "absolute", left: 40, right: 40, top: 118, borderTop: "4px dashed rgba(11,15,10,0.3)" }} />
        {el.items.map((it, i) => {
          const k = easeOut((local - 8 - i * 4) / 8);
          return (
            <div key={i} style={{ position: "absolute", left: 44, right: 40, top: 142 + i * LH, height: LH - 14, display: "flex", alignItems: "center", gap: 22, opacity: k, transform: `translateX(${(1 - k) * -30}px)` }}>
              <div style={{ width: 76, height: 76, borderRadius: 38, background: BRAND.green, color: BRAND.white, fontWeight: 900, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontWeight: 900, fontSize: size, lineHeight: 1, textTransform: "uppercase", color: INK, whiteSpace: "nowrap" }}>{it}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 40, right: 40, top: 150 + el.items.length * LH, borderTop: "4px dashed rgba(11,15,10,0.3)" }} />
        <div style={{ position: "absolute", left: 0, width: PW, top: 176 + el.items.length * LH, textAlign: "center", fontWeight: 900, fontSize: 76, textTransform: "uppercase", color: BRAND.green, opacity: easeOut((local - 30) / 8) }}>{el.total}</div>
      </div>
    </div>
  );
};

/* ---------- quattro caselle (2×2): ogni casella si accende sulla parola detta; il testo sta SEMPRE dentro la casella (due righe, corpo
   calcolato sulla riga più lunga). Sotto, la chiusa in una pillola ---------- */
const two = (t: string) => { const w = t.split(" "); if (w.length < 2 || t.length <= 10) return [t]; let best = 1, bl = 99; for (let c = 1; c < w.length; c++) { const m = Math.max(w.slice(0, c).join(" ").length, w.slice(c).join(" ").length); if (m < bl) { bl = m; best = c; } } return [w.slice(0, best).join(" "), w.slice(best).join(" ")]; };
export const Quad: React.FC<P<"quad">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const TW = 432, TH = 126, GX = 16, GY = 14, items = el.items.slice(0, 4);
  const on = [0, 1, 2, 3, 4].map((i) => cueF(el, i, fps, 0.3 + i * 0.9));
  let last = -1; on.slice(0, 4).forEach((f, i) => { if (local >= f) last = i; });
  const longest = Math.max(...items.flatMap((x) => two(x).map((l) => l.length)));
  const size = Math.min(58, Math.floor((TW - 64 - 62) / (0.6 * longest)));
  const kf = spring({ frame: local - on[4], fps, config: { damping: 12, stiffness: 210, mass: 0.6 } });
  return (
    <div style={{ position: "absolute", left: PANEL_X, width: PANEL_W, top: GFX_TOP, fontFamily: FONT, opacity: out }}>
      {items.map((it, i) => {
        const lit = local >= on[i], hot = i === last && local < on[4];
        const k = spring({ frame: local - on[i], fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });
        return (
          <div key={i} style={{ position: "absolute", left: (i % 2) * (TW + GX), top: Math.floor(i / 2) * (TH + GY), width: TW, height: TH, borderRadius: 24, boxSizing: "border-box", overflow: "hidden", border: `5px solid ${lit ? BRAND.lime : "rgba(255,255,255,0.22)"}`, background: hot ? BRAND.lime : "rgba(11,15,10,0.9)", display: "flex", alignItems: "center", gap: 16, padding: "0 18px", transform: `scale(${lit ? 0.9 + 0.1 * k : 1})` }}>
            <div style={{ width: 62, height: 62, borderRadius: 31, flexShrink: 0, background: hot ? INK : lit ? BRAND.lime : "rgba(255,255,255,0.14)", color: hot ? BRAND.lime : INK, fontWeight: 900, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <div style={{ fontWeight: 900, fontSize: size, lineHeight: 1.04, textTransform: "uppercase", color: hot ? INK : BRAND.white, opacity: lit ? 1 : 0 }}>
              {two(it).map((l, j) => <div key={j} style={{ whiteSpace: "nowrap" }}>{l}</div>)}
            </div>
          </div>
        );
      })}
      {el.foot ? (
        <div style={{ position: "absolute", left: 0, width: PANEL_W, top: 2 * TH + GY + 20, textAlign: "center", opacity: local >= on[4] ? 1 : 0, transform: `scale(${0.7 + 0.3 * kf})` }}>
          <div style={{ display: "inline-block", background: BRAND.lime, color: INK, fontWeight: 900, fontSize: Math.min(60, Math.floor(1300 / Math.max(12, el.foot.length))), lineHeight: 1, padding: "14px 34px", borderRadius: 18, textTransform: "uppercase", whiteSpace: "nowrap" }}>{el.foot}</div>
        </div>
      ) : null}
    </div>
  );
};

/* ---------- «aumento il rischio»: una freccia corallo che sale di scatto sulla parola e riparte a ogni nuova voce; a destra la parola
   grande e sotto la voce del momento (una alla volta, sulla parola detta) ---------- */
export const Rise: React.FC<P<"rise">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, s, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const f0 = cueF(el, 0, fps, 0.2);
  const on = el.lines.map((_, i) => cueF(el, i + 1, fps, 1.0 + i * 1.2));
  let idx = -1; on.forEach((f, i) => { if (local >= f) idx = i; });
  const grow = spring({ frame: local - f0, fps, config: { damping: 10, stiffness: 170, mass: 0.7 } });
  const lastHit = idx >= 0 ? on[idx] : f0, pump = Math.exp(-Math.max(0, local - lastHit) / 5) * (local >= lastHit ? 1 : 0);
  const AH = 216, h = AH * (0.25 + 0.75 * clamp01(grow)) * (1 + 0.08 * pump);
  const kl = spring({ frame: local - lastHit, fps, config: { damping: 13, stiffness: 220, mass: 0.6 } });
  const line = idx >= 0 ? el.lines[idx] : "";
  return (
    <div style={{ position: "absolute", left: 90, width: 900, top: GFX_TOP, height: 250, fontFamily: FONT, opacity: out * Math.min(1, s * 1.4) }}>
      <svg width={170} height={250} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <rect x={62} y={240 - h + 56} width={46} height={Math.max(0, h - 56)} rx={10} fill={CORAL} />
        <path d={`M85 ${240 - h} L150 ${240 - h + 74} L20 ${240 - h + 74} Z`} fill={CORAL} />
      </svg>
      <div style={{ position: "absolute", left: 190, top: 4, fontWeight: 900, fontSize: 124, lineHeight: 1, textTransform: "uppercase", color: BRAND.white, textShadow: "0 6px 0 rgba(11,15,10,0.85), 0 10px 26px rgba(0,0,0,0.7)", transform: `scale(${1 + 0.05 * pump})`, transformOrigin: "left center", whiteSpace: "nowrap" }}>{el.label}</div>
      {line ? (
        <div style={{ position: "absolute", left: 190, top: 142, background: "rgba(11,15,10,0.92)", borderLeft: `12px solid ${CORAL}`, borderRadius: 16, padding: "14px 30px", fontWeight: 900, fontSize: Math.min(72, Math.floor(1150 / Math.max(10, line.length))), lineHeight: 1, textTransform: "uppercase", color: BRAND.white, whiteSpace: "nowrap", opacity: clamp01(kl * 1.6), transform: `translateX(${(1 - kl) * 40}px)` }}>{line}</div>
      ) : null}
    </div>
  );
};
