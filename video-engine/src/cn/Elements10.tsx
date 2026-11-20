import React from "react";
import { useVideoConfig, spring } from "remotion";
import type { Element } from "./types";
import { BRAND, PANEL_X, PANEL_W, GFX_TOP } from "./types";
import { useInOut } from "./Elements3D";
import { GemLayers } from "./gem/GemLayers";
import { GemRings } from "./gem/GemRings";
import { GemWind } from "./gem/GemWind";

/* Serie G (YTCN 26, «Correre al freddo»): RAPPRESENTAZIONI dei concetti. I disegni animati (cartella `gem/`) sono scritti da Gemini su
   indicazioni di regia e rifiniti a mano; qui stanno le scritte (≥ 60 px) e l'aggancio alle parole di Daniele (`cues`).
   `fog` = titolo che si condensa come il fiato al freddo, `layers` = i capi che si indossano uno sull'altro, `hangtag` = cartellino del capo
   che dondola, `gust` = raffica di vento sulle parole, `rings` = i tre strati che lavorano in sinergia attorno al calore,
   `duel` = due forze che si spingono (sudore contro gelo) e vengono cancellate. Ognuna usata in un solo reel. */

const FONT = "Blinker, sans-serif";
const INK = "#0B0F0A";
const CORAL = "#FF6B4A";
const ICE = "#B8D7EA";
const CREAM = "#F4F1E5";
const SHADOW = "0 6px 0 rgba(11,15,10,0.85), 0 10px 26px rgba(0,0,0,0.7)";
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
type P<K extends Element["kind"]> = { el: Extract<Element, { kind: K }>; start: number };
const cueF = (el: Element, i: number, fps: number, def: number) => Math.round((el.onAt?.[i] ?? def) * fps);
const panel = (s: number, out: number, h: number): React.CSSProperties => ({ position: "absolute", left: PANEL_X, width: PANEL_W, top: GFX_TOP, height: h, borderRadius: 30, background: "rgba(11,15,10,0.9)", fontFamily: FONT, color: BRAND.white, opacity: out * Math.min(1, s * 1.3), transform: `translateY(${(1 - s) * 40}px)`, overflow: "hidden" });
/** corpo più grande che fa stare la scritta (maiuscola, Blinker 900) nella larghezza data */
const fit = (text: string, w: number, max: number) => Math.min(max, Math.floor(w / (0.54 * Math.max(4, text.length))));

/* ---------- titolo che si condensa: ogni parola arriva sfocata e larga, come il fiato al freddo, e va a fuoco ---------- */
export const Fog: React.FC<P<"fog">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  let n = 0;
  return (
    <div style={{ position: "absolute", left: 60, width: 960, top: GFX_TOP, fontFamily: FONT, opacity: out, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {el.lines.map((line, li) => {
        const acc = line === el.accent, size = fit(line, acc ? 800 : 900, acc ? 104 : 90), first = n;
        const kp = clamp01((local - (3 + first * 4)) / 8);
        return (
          <div key={li} style={{ position: "relative", display: "flex", gap: size * 0.26, padding: acc ? "8px 34px 14px" : 0 }}>
            {acc ? <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: BRAND.lime, transform: `scaleX(${kp})`, transformOrigin: "left center" }} /> : null}
            {line.split(" ").map((w, wi) => {
              const k = clamp01((local - (3 + n++ * 4)) / 11);
              return <span key={wi} style={{ position: "relative", fontWeight: 900, fontSize: size, lineHeight: 1.04, textTransform: "uppercase", whiteSpace: "nowrap", color: acc ? INK : BRAND.white, textShadow: acc ? "none" : SHADOW, opacity: k, filter: `blur(${(1 - k) * 18}px)`, transform: `translateY(${(1 - k) * 16}px) scale(${1 + (1 - k) * 0.3})` }}>{w}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- i capi uno sull'altro: a sinistra il disegno (lo strato del momento si chiude dal basso sulla parola detta, poi i suoi effetti:
   calore, sudore, vento, pioggia), a destra il nome dello strato e, sotto, la targhetta che cambia a ogni parola chiave.
   cues: [strato, targhetta 1, targhetta 2, …] ---------- */
export const Layers: React.FC<P<"layers">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, s, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const cue = cueF(el, 0, fps, 0.25), on = el.chips.map((_, i) => cueF(el, i + 1, fps, 1.4 + i * 1.3));
  let idx = -1; on.forEach((f, i) => { if (local >= f) idx = i; });
  const kb = spring({ frame: local - cue, fps, config: { damping: 11, stiffness: 220, mass: 0.6 } });
  const kc = idx >= 0 ? spring({ frame: local - on[idx], fps, config: { damping: 12, stiffness: 230, mass: 0.55 } }) : 0;
  const chip = idx >= 0 ? el.chips[idx] : "", TW = 520;
  const size = Math.min(...el.lines.map((l) => fit(l, TW, 90)));
  return (
    <div style={panel(s, out, 320)}>
      <div style={{ position: "absolute", left: 4, top: 0, width: 320, height: 320, transform: "scale(1.34)", transformOrigin: "50% 49%" }}>
        <GemLayers t={local / fps} uid={`ly${start}`} stage={el.stage} cue={cue / fps} fx={[(on[0] ?? 9999) / fps, (on[1] ?? 9999) / fps]} />
      </div>
      <div style={{ position: "absolute", left: 16, top: 14, width: 66, height: 66, borderRadius: 33, background: BRAND.lime, color: INK, fontWeight: 900, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${local >= cue ? 0.6 + 0.4 * kb : 0})` }}>{el.stage}</div>
      <div style={{ position: "absolute", left: 334, top: 0, width: TW + 14, height: 320, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 16 }}>
        <div style={{ opacity: local >= cue ? clamp01(kb * 1.5) : 0, transform: `translateX(${(1 - (local >= cue ? kb : 0)) * 36}px)` }}>
          {el.lines.map((l, i) => <div key={i} style={{ fontWeight: 900, fontSize: size, lineHeight: 1.03, textTransform: "uppercase", whiteSpace: "nowrap" }}>{l}</div>)}
        </div>
        <div style={{ height: 92, display: "flex", alignItems: "center" }}>
          {chip ? <div style={{ background: BRAND.lime, color: INK, borderRadius: 16, padding: "10px 24px 13px", fontWeight: 900, fontSize: fit(chip, TW - 52, 74), lineHeight: 1, textTransform: "uppercase", whiteSpace: "nowrap", opacity: clamp01(kc * 1.6), transform: `scale(${0.8 + 0.2 * kc})`, transformOrigin: "left center" }}>{chip}</div> : null}
        </div>
      </div>
    </div>
  );
};

/* ---------- cartellino del capo: scende appeso al filo e dondola (pendolo smorzato); la seconda riga arriva sulla sua parola e gli dà
   un'altra spinta. cues: [cartellino, riga 2] ---------- */
export const HangTag: React.FC<P<"hangtag">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const f0 = cueF(el, 0, fps, 0.1), f1 = cueF(el, 1, fps, 1.4), t0 = Math.max(0, local - f0) / fps, t1 = Math.max(0, local - f1) / fps;
  const drop = spring({ frame: local - f0, fps, config: { damping: 13, stiffness: 150, mass: 0.7 } });
  const ang = 15 * Math.exp(-t0 * 1.4) * Math.cos(t0 * 6.2) + (local >= f1 ? 7 * Math.exp(-t1 * 2) * Math.sin(t1 * 8.5) : 0) + 1.2 * Math.sin(local / fps * 1.9);
  const W = 640, H = 262, k1 = spring({ frame: local - f1, fps, config: { damping: 12, stiffness: 230, mass: 0.55 } });
  const size = Math.min(...el.lines.map((l) => fit(l, W - 90, 84)));
  return (
    <div style={{ position: "absolute", left: (1080 - W) / 2, top: GFX_TOP + 26, width: W, height: H, fontFamily: FONT, opacity: out * clamp01((local - f0 + 1) / 3), transformOrigin: "50% -150px", transform: `translateY(${(drop - 1) * 360}px) rotate(${ang}deg)` }}>
      <svg width={W} height={200} style={{ position: "absolute", left: 0, top: -150, overflow: "visible" }}>
        <path d={`M${W / 2 - 3} 0 Q ${W / 2 - 26} 96 ${W / 2} 184`} fill="none" stroke={CREAM} strokeWidth={5} strokeLinecap="round" />
        <path d={`M${W / 2 + 3} 0 Q ${W / 2 + 26} 96 ${W / 2} 184`} fill="none" stroke={CREAM} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      </svg>
      <div style={{ position: "absolute", inset: 0, background: CREAM, borderRadius: 26, clipPath: "polygon(9% 0, 91% 0, 100% 22%, 100% 100%, 0 100%, 0 22%)", boxShadow: "0 14px 34px rgba(0,0,0,0.45)" }} />
      <div style={{ position: "absolute", left: 14, right: 14, top: 14, bottom: 14, border: `4px dashed rgba(73,118,46,0.55)`, borderRadius: 18, clipPath: "polygon(8% 0, 92% 0, 100% 21%, 100% 100%, 0 100%, 0 21%)" }} />
      <div style={{ position: "absolute", left: W / 2 - 19, top: 18, width: 38, height: 38, borderRadius: 19, background: "#49762E", boxShadow: `inset 0 0 0 9px ${CREAM}, inset 0 0 0 38px ${INK}` }} />
      <div style={{ position: "absolute", left: 0, width: W, top: 68, textAlign: "center", color: INK, fontWeight: 900, fontSize: size, lineHeight: 1.06, textTransform: "uppercase" }}>
        <div style={{ whiteSpace: "nowrap" }}>{el.lines[0]}</div>
        {el.lines[1] ? <div style={{ whiteSpace: "nowrap", color: "#35591F", opacity: local >= f1 ? clamp01(k1 * 1.6) : 0, transform: `scale(${0.8 + 0.2 * k1})` }}>{el.lines[1]}</div> : null}
      </div>
    </div>
  );
};

/* ---------- raffica: il vento attraversa la zona, le parole arrivano spinte da sinistra e restano piegate; sull'ultima parola la raffica
   si alza. cues: una per parola ---------- */
export const Gust: React.FC<P<"gust">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const on = el.words.map((_, i) => cueF(el, i, fps, 0.2 + i * 1.2)), t = local / fps, gust = on[on.length - 1] / fps;
  const strong = clamp01((t - gust) / 0.4);
  return (
    <div style={{ position: "absolute", left: PANEL_X, width: PANEL_W, top: GFX_TOP, height: 250, fontFamily: FONT, opacity: out }}>
      <div style={{ position: "absolute", inset: 0, opacity: clamp01(local / 6) }}><GemWind t={t} uid={`gw${start}`} gust={gust} /></div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
        {el.words.map((w, i) => {
          const k = spring({ frame: local - on[i], fps, config: { damping: 13, stiffness: 170, mass: 0.7 } });
          const lean = -(7 + 5 * strong) - 2.5 * Math.sin(t * 9 + i * 1.7) * (0.4 + 0.6 * strong);
          return <div key={i} style={{ fontWeight: 900, fontSize: fit(w, 640, 124), lineHeight: 0.98, textTransform: "uppercase", whiteSpace: "nowrap", color: i === el.words.length - 1 ? ICE : BRAND.white, textShadow: SHADOW, opacity: local >= on[i] ? clamp01(k * 1.8) : 0, transform: `translateX(${(1 - k) * -220 + 3 * Math.sin(t * 13 + i) * strong}px) skewX(${lean}deg)` }}>{w}</div>;
        })}
      </div>
    </div>
  );
};

/* ---------- sinergia: a sinistra i tre strati come anelli attorno al calore del corpo (prima girano ognuno per conto suo, poi si
   agganciano; il centro diventa caldo), a destra la frase del momento. cues: [anelli, aggancio = frase 2, calore = frase 3] ---------- */
export const Rings: React.FC<P<"rings">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, s, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const f0 = cueF(el, 0, fps, 0.2), lock = cueF(el, 1, fps, 2.2), warm = cueF(el, 2, fps, 3.8), on = [0, lock, warm];
  let idx = 0; on.forEach((f, i) => { if (i < el.phases.length && local >= f) idx = i; });
  const k = spring({ frame: local - on[idx], fps, config: { damping: 13, stiffness: 210, mass: 0.6 } });
  const lines = el.phases[idx], TW = 520, size = Math.min(...lines.map((l) => fit(l, TW, 96)));
  return (
    <div style={panel(s, out, 320)}>
      <div style={{ position: "absolute", left: 16, top: 10, width: 300, height: 300 }}>
        <GemRings t={local / fps} uid={`rg${start}`} on={[f0 / fps, f0 / fps + 0.3, f0 / fps + 0.6]} lock={lock / fps} warm={warm / fps} />
      </div>
      <div style={{ position: "absolute", left: 340, top: 0, width: TW, height: 320, display: "flex", flexDirection: "column", justifyContent: "center", opacity: clamp01(k * 1.6), transform: `translateX(${(1 - k) * 34}px)` }}>
        {lines.map((l, i) => <div key={i} style={{ fontWeight: 900, fontSize: size, lineHeight: 1.05, textTransform: "uppercase", whiteSpace: "nowrap", color: idx === el.phases.length - 1 && i === 0 ? BRAND.lime : BRAND.white }}>{l}</div>)}
      </div>
    </div>
  );
};

/* ---------- due forze che si spingono: i due blocchi entrano dai lati, si scontrano al centro e il confine va avanti e indietro; sull'ultima
   parola una riga lime li cancella. cues: [scontro, parola sinistra, parola destra, cancellatura] ---------- */
export const Duel: React.FC<P<"duel">> = ({ el, start }) => {
  const { fps } = useVideoConfig();
  const { local, out, visible } = useInOut(start, Math.round(el.dur * fps));
  if (!visible) return null;
  const f0 = cueF(el, 0, fps, 0.1), fl = cueF(el, 1, fps, 0.6), fr = cueF(el, 2, fps, 1.4), fx = cueF(el, 3, fps, 2.2), t = Math.max(0, local - f0) / fps;
  const W = 880, H = 190, arrive = spring({ frame: local - f0, fps, config: { damping: 14, stiffness: 240, mass: 0.6 } });
  const done = clamp01((local - fx) / 7);
  const split = 0.5 + (0.085 * Math.sin(t * 5.4) + 0.03 * Math.sin(t * 13.1)) * (1 - done) * clamp01(t * 2);
  const hit = Math.exp(-Math.max(0, local - f0 - 5) / 4) * (local >= f0 + 5 ? 1 : 0), sx = W * split;
  const word = (txt: string, w: number, f: number, col: string) => <div style={{ fontWeight: 900, fontSize: fit(txt, w - 70, 104), lineHeight: 1, textTransform: "uppercase", whiteSpace: "nowrap", color: col, opacity: clamp01((local - f) / 4), transform: `scale(${1 + 0.12 * Math.exp(-Math.max(0, local - f) / 5)})` }}>{txt}</div>;
  return (
    <div style={{ position: "absolute", left: PANEL_X, width: W, top: GFX_TOP + 20, height: H, fontFamily: FONT, opacity: out * clamp01((local - f0 + 1) / 3), transform: `scale(${1 + 0.03 * hit})` }}>
      <div style={{ position: "absolute", left: (arrive - 1) * 500, top: 0, width: sx - 5, height: H, borderRadius: "30px 8px 8px 30px", background: `linear-gradient(90deg, #FFB020, ${CORAL})`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", filter: `saturate(${1 - 0.6 * done})`, opacity: 1 - 0.12 * done }}>{word(el.left, W * 0.42, fl, INK)}</div>
      <div style={{ position: "absolute", left: sx + 5 + (1 - arrive) * 500, top: 0, width: W - sx - 5, height: H, borderRadius: "8px 30px 30px 8px", background: `linear-gradient(90deg, ${ICE}, #7FB2D4)`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", filter: `saturate(${1 - 0.6 * done})`, opacity: 1 - 0.12 * done }}>{word(el.right, W * 0.42, fr, INK)}</div>
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: (1 - done) * clamp01(t * 3) }}>
        {[0, 1, 2, 3].map((i) => { const y = 24 + i * 47, j = 9 * Math.sin(t * 17 + i * 2.1); return <path key={i} d={`M${sx - 16 + j} ${y} L${sx + 12 - j} ${y + 16} L${sx - 10 + j} ${y + 30}`} fill="none" stroke={BRAND.white} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />; })}
      </svg>
      <div style={{ position: "absolute", left: -24, top: H / 2 - 6, width: W + 48, height: 12, borderRadius: 6, background: BRAND.lime, boxShadow: `0 0 0 4px ${INK}`, transform: `rotate(-7deg) scaleX(${done})`, transformOrigin: "left center" }} />
    </div>
  );
};
