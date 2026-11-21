// Contagiri dell'intensità (corsa di riscaldamento): disegnato a mano con la stessa firma delle illustrazioni di Gemini ({ t, uid, cues }).
// cues: [0] l'ago scende nella zona bassa (lime), [1] passi lenti sotto il quadrante (velocità della camminata),
// [2] tre nodi che si accendono (tendini, articolazioni, muscoli), [3] impulso che corre lungo la linea in basso (sistema nervoso).
import React from "react";

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const pt = (cx: number, cy: number, r: number, deg: number): [number, number] => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)];
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => { const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1); return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`; };

export const GaugeArt: React.FC<{ t: number; uid: string; cues: number[] }> = ({ t, uid, cues }) => {
  const cue = (i: number) => cues[i] ?? Infinity;
  const CX = 150, CY = 168, R = 118;
  const low = ease((t - cue(0)) / 0.6);
  // prima dell'aggancio l'ago oscilla a metà-alto; poi scende nella zona bassa e resta lì, con un piccolo respiro
  const before = 62 + 22 * Math.sin(t * 3.1) + 6 * Math.sin(t * 8.3);
  const after = 158 + 5 * Math.sin(t * 2.2);
  const ang = before + (after - before) * low;
  const [nx, ny] = pt(CX, CY, R - 26, ang);
  const step = t >= cue(1) ? (t - cue(1)) * 1.6 : -1;
  const nodes = [0, 1, 2].map((i) => clamp((t - cue(2) - i * 0.28) / 0.3));
  const pulse = t >= cue(3) ? ((t - cue(3)) * 0.9) % 1 : -1;
  return (
    <svg viewBox="0 0 300 300" width={300} height={300} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#95FF00" /><stop offset="100%" stopColor="#49762E" /></linearGradient>
      </defs>
      <path d={arc(CX, CY, R, 180, 0)} fill="none" stroke="rgba(244,241,229,0.16)" strokeWidth={26} strokeLinecap="round" />
      <path d={arc(CX, CY, R, 180, 128)} fill="none" stroke={`url(#${uid}-g)`} strokeWidth={26} strokeLinecap="round" opacity={0.45 + 0.55 * low} />
      <path d={arc(CX, CY, R, 120, 62)} fill="none" stroke="#F4F1E5" strokeWidth={26} opacity={0.55 - 0.3 * low} />
      <path d={arc(CX, CY, R, 54, 0)} fill="none" stroke="#FF6B4A" strokeWidth={26} strokeLinecap="round" opacity={0.85 - 0.5 * low} />
      {[180, 150, 120, 90, 60, 30, 0].map((a) => { const [x0, y0] = pt(CX, CY, R - 20, a), [x1, y1] = pt(CX, CY, R - 34, a); return <line key={a} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#F4F1E5" strokeWidth={3} strokeLinecap="round" opacity={0.6} />; })}
      <line x1={CX} y1={CY} x2={nx} y2={ny} stroke={low > 0.5 ? "#95FF00" : "#F4F1E5"} strokeWidth={10} strokeLinecap="round" />
      <circle cx={CX} cy={CY} r={17} fill="#F4F1E5" /><circle cx={CX} cy={CY} r={7} fill="#0B0F0A" />
      {low > 0 ? <circle cx={pt(CX, CY, R, 158)[0]} cy={pt(CX, CY, R, 158)[1]} r={20 + 5 * Math.sin(t * 4)} fill="none" stroke="#95FF00" strokeWidth={4} opacity={0.7 * low} /> : null}
      {/* passi lenti */}
      {step >= 0 ? [0, 1].map((i) => { const on = Math.floor(step) % 2 === i, k = step % 1; return <ellipse key={i} cx={120 + i * 60} cy={214 - (on ? 9 * Math.sin(k * Math.PI) : 0)} rx={22} ry={11} fill="#F4F1E5" opacity={on ? 1 : 0.45} />; }) : null}
      {/* tre nodi + linea dell'impulso */}
      <line x1={44} y1={262} x2={256} y2={262} stroke="rgba(244,241,229,0.3)" strokeWidth={5} strokeLinecap="round" opacity={t >= cue(2) ? 1 : 0} />
      {nodes.map((k, i) => (k > 0 ? <g key={i}><circle cx={60 + i * 90} cy={262} r={15 * (0.6 + 0.4 * ease(k)) + 2 * Math.sin(t * 5 + i)} fill="#95FF00" /><circle cx={60 + i * 90} cy={262} r={26} fill="none" stroke="#95FF00" strokeWidth={3} opacity={0.5 * (1 - k) + 0.25} /></g> : null))}
      {pulse >= 0 ? <circle cx={44 + pulse * 212} cy={262} r={9} fill="#F4F1E5" /> : null}
    </svg>
  );
};
