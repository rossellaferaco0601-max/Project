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
  const n = el.items.length, rowH = 98, Hh = 90 + n * rowH + 8;
  return (
    <div style={panel(s, out, Hh)}>
      <div style={head}>{el.title}</div>
      {el.items.map((it, i) => {
        const f0 = cueF(el, i, fps, 0.6 + i * 0.8);
        const k = easeOut((local - f0) / 26), level = el.fill ? 0.26 + 0.74 * k : 1 - 0.74 * k;   // si svuota (o, con `fill`, si riempie) in poco meno di un secondo
        const col = el.fill ? (k > 0.45 ? BRAND.lime : "rgba(255,255,255,0.6)") : k > 0.45 ? CORAL : BRAND.lime;
        return (
          <div key={i} style={{ position: "absolute", left: 36, right: 36, top: 86 + i * rowH, height: rowH - 14 }}>
            <div style={{ position: "absolute", left: 0, top: 0, fontWeight: 900, fontSize: 66, lineHeight: "84px", textTransform: "uppercase", zIndex: 2, paddingLeft: 22, textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>{it}</div>
            <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ width: `${level * 100}%`, height: "100%", background: col, opacity: 0.55, borderRadius: 18 }} />
            </div>
            <div style={{ position: "absolute", right: 18, top: 0, lineHeight: "84px", fontWeight: 900, fontSize: 60, color: col, opacity: clamp01((local - f0) / 8) }}>{el.fill ? "↑" : "↓"}</div>
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
  const f0 = cueF(el, 0, fps, 0.3), f1 = cueF(el, 1, fps, el.dur * 0.5);
  const a = spring({ frame: local - f0, fps, config: { damping: 13, stiffness: 190 } });
  const b = spring({ frame: local - f1, fps, config: { damping: 9, stiffness: 120, mass: 1 } });
  const tilt = -6 * a + 15 * b; // gradi: prima pende a sinistra (la promessa), poi a destra (il prezzo)
  const rad = (tilt * Math.PI) / 180, arm = 215, cx = PANEL_W / 2, cy = 126;
  const lx = cx - arm * Math.cos(rad), ly = cy - arm * Math.sin(rad), rx = cx + arm * Math.cos(rad), ry = cy + arm * Math.sin(rad);
  const plate = (x: number, y: number, text: string, col: string, k: number) => (
    <div style={{ position: "absolute", left: x - 215, top: y + 10, width: 430, textAlign: "center", opacity: clamp01(k * 1.4) }}>
      <div style={{ margin: "0 auto", width: 4, height: 34, background: "rgba(255,255,255,0.6)" }} />
      <div style={{ display: "inline-block", minWidth: 240, background: col, color: BRAND.ink, fontWeight: 900, fontSize: Math.min(68, Math.floor(640 / Math.max(7, text.length))), lineHeight: 1, textTransform: "uppercase", whiteSpace: "nowrap", padding: "20px 22px", borderRadius: 20 }}>{text}</div>
    </div>
  );
  return (
    <div style={panel(s, out, 372)}>
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
        const hot = i === last;
        return <div key={i} style={{ background: hot ? BRAND.lime : "rgba(11,15,10,0.9)", color: hot ? BRAND.ink : BRAND.white, border: `5px solid ${BRAND.lime}`, borderRadius: 999, padding: "14px 36px", fontWeight: 900, fontSize: Math.min(72, Math.floor(1300 / Math.max(10, it.length))), lineHeight: 1, textTransform: "uppercase", whiteSpace: "nowrap", transform: `scale(${local >= on[i] ? 0.6 + 0.4 * k : 0})`, opacity: local >= on[i] ? 1 : 0 }}>{it}</div>;
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
