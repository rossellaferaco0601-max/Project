// Mountain climber (circuito in casa, G5). La stesura di Gemini (work/ytcn26/gemini/prompt_GemClimber.txt) aveva le gambe piegate al
// contrario: la figura è stata ridisegnata a mano con la stessa regia (tavola alta di profilo, ginocchia al petto alternate) e gli stessi
// agganci: [0] addome, [1] spalle e braccia, [2] flessori dell'anca, [3] piedi, [4] calore interno.
import React from "react";

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
type V = [number, number];
const lerp = (a: V, b: V, k: number): V => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
/** ginocchio di una gamba a due segmenti lunghi L (piega verso +x, cioè verso il petto) */
const knee = (hip: V, foot: V, L: number): V => {
  const dx = foot[0] - hip[0], dy = foot[1] - hip[1], d = Math.min(2 * L - 0.01, Math.hypot(dx, dy)), h = Math.sqrt(L * L - (d / 2) * (d / 2));
  const mx = hip[0] + (dx / Math.hypot(dx, dy)) * (d / 2), my = hip[1] + (dy / Math.hypot(dx, dy)) * (d / 2);
  return [mx + (dy / Math.hypot(dx, dy)) * h, my - (dx / Math.hypot(dx, dy)) * h];
};
const Limb: React.FC<{ a: V; b: V; w: number; c: string; back?: boolean }> = ({ a, b, w, c, back }) => (
  <g opacity={back ? 0.62 : 1}>
    <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#F4F1E5" strokeWidth={w + 4} strokeLinecap="round" />
    <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={c} strokeWidth={w} strokeLinecap="round" />
  </g>
);

export const GemClimber: React.FC<{ t: number; uid: string; cues: number[] }> = ({ t, uid, cues }) => {
  const cue = (i: number) => cues[i] ?? Infinity;
  const on = (i: number) => ease((t - cue(i)) / 0.5);
  const F = 1.5, ph = t * F * 2 * Math.PI, a = 0.5 + 0.5 * Math.sin(ph), b = 1 - a;   // quanto ogni gamba è portata avanti (0 = distesa)
  const sm = (x: number) => x * x * (3 - 2 * x);
  const bounce = 3 * Math.abs(Math.sin(ph));
  const sh: V = [222, 146 - bounce * 0.4], hip: V = [118, 190 - bounce], hand: V = [228, 250], head: V = [250, 122 - bounce * 0.4];
  const back: V = [26, 250], front: V = [128, 232], L = 57;
  const footA = lerp(back, front, sm(a)), footB = lerp(back, front, sm(b));
  const kA = knee(hip, footA, L), kB = knee(hip, footB, L);
  const dark = "#3A4640", lime = "#95FF00";
  const core = on(0), upper = on(1), flex = on(2), feet = on(3), heat = on(4);
  const mid = lerp(sh, hip, 0.42), driving = a > b ? kA : kB;
  const land = (x: number) => Math.exp(-((1 - x) * (1 - x)) * 0) * clamp(1 - sm(x) * 4);   // 1 quando il piede è tornato dietro
  return (
    <svg viewBox="0 0 300 300" width={300} height={300} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`${uid}-heat`}><stop offset="0%" stopColor="#FFB020" stopOpacity={0.75} /><stop offset="100%" stopColor="#FF6B4A" stopOpacity={0} /></radialGradient>
      </defs>
      <line x1={8} y1={262} x2={292} y2={262} stroke="rgba(244,241,229,0.35)" strokeWidth={4} strokeLinecap="round" />
      {heat > 0 ? <ellipse cx={170} cy={168} rx={110 * heat} ry={64 * heat} fill={`url(#${uid}-heat)`} opacity={0.75 + 0.2 * Math.sin(t * 4)} /> : null}
      {/* gamba e braccio dietro */}
      <Limb a={hip} b={kB} w={22} c={dark} back /><Limb a={kB} b={footB} w={20} c={dark} back />
      <Limb a={[sh[0] - 8, sh[1] + 4]} b={[hand[0] - 14, hand[1]]} w={18} c={upper > 0 ? "#5B8F2E" : dark} back />
      {/* busto */}
      <Limb a={sh} b={hip} w={34} c={heat > 0.5 ? "#C98A1E" : dark} />
      {core > 0 ? <line x1={mid[0]} y1={mid[1]} x2={hip[0] + 6} y2={hip[1] - 2} stroke={lime} strokeWidth={22} strokeLinecap="round" opacity={core * (0.55 + 0.3 * Math.abs(Math.sin(ph)))} /> : null}
      {/* gamba e braccio davanti */}
      <Limb a={hip} b={kA} w={24} c={dark} /><Limb a={kA} b={footA} w={22} c={dark} />
      <Limb a={sh} b={hand} w={20} c={upper > 0 ? "#6FAE2E" : dark} />
      {upper > 0 ? <circle cx={sh[0]} cy={sh[1]} r={20 + 3 * Math.sin(t * 5)} fill="none" stroke={lime} strokeWidth={5} opacity={upper * 0.9} /> : null}
      <circle cx={hand[0]} cy={hand[1] - 4} r={11} fill="#E7B899" stroke="#F4F1E5" strokeWidth={2} />
      <circle cx={head[0]} cy={head[1]} r={23} fill="#E7B899" stroke="#F4F1E5" strokeWidth={2} />
      {/* flessori dell'anca: anello sull'anca, più vivo quando un ginocchio arriva al petto */}
      {flex > 0 ? <g opacity={flex}><circle cx={hip[0] + 8} cy={hip[1] + 8} r={26 + 8 * Math.max(sm(a), sm(b))} fill="none" stroke={lime} strokeWidth={6} /><circle cx={driving[0]} cy={driving[1]} r={9} fill={lime} /></g> : null}
      {/* piedi: anello quando il piede torna a terra */}
      {feet > 0 ? [footA, footB].map((f, i) => { const k = land(i ? b : a); return <circle key={i} cx={f[0]} cy={f[1]} r={14 + 16 * (1 - k)} fill="none" stroke={lime} strokeWidth={5} opacity={feet * k} />; }) : null}
      <circle cx={footA[0]} cy={footA[1]} r={10} fill="#F4F1E5" /><circle cx={footB[0]} cy={footB[1]} r={9} fill="#F4F1E5" opacity={0.6} />
      {/* calore che sale dalla schiena */}
      {heat > 0 ? [0, 1, 2].map((i) => { const p = (t * 0.9 + i / 3) % 1, x = 120 + i * 44, y = 150 - p * 60; return <path key={i} d={`M${x} ${y} q 9 -11 0 -22 q -9 -11 0 -22`} fill="none" stroke="#FFB020" strokeWidth={5} strokeLinecap="round" opacity={heat * Math.sin(p * Math.PI)} />; }) : null}
    </svg>
  );
};
