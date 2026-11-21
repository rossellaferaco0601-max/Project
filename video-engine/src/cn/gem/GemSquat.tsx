// Squat naturale dopo la corsa (G12). La stesura di Gemini (work/ytcn26/gemini/prompt_GemSquat.txt) non disegnava un vero squat profondo:
// la figura è stata ridisegnata a mano (profilo, talloni a terra, anche sotto le ginocchia) con la stessa regia e gli stessi agganci:
// [0] discesa nello squat, [1] casa attorno (al chiuso), [2] arco del tempo, [3] anelli su anche, ginocchia e caviglie (recupero).
import React from "react";

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (x: number) => { const k = clamp(x); return k * k * (3 - 2 * k); };
type V = [number, number];
const lerp = (a: V, b: V, k: number): V => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const Limb: React.FC<{ a: V; b: V; w: number; back?: boolean }> = ({ a, b, w, back }) => (
  <g opacity={back ? 0.6 : 1}>
    <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#F4F1E5" strokeWidth={w + 4} strokeLinecap="round" />
    <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#3A4640" strokeWidth={w} strokeLinecap="round" />
  </g>
);

export const GemSquat: React.FC<{ t: number; uid: string; cues: number[] }> = ({ t, uid, cues }) => {
  const cue = (i: number) => cues[i] ?? Infinity;
  const k = ease((t - cue(0)) / 0.9), house = clamp((t - cue(1)) / 0.7), timer = clamp((t - cue(2)) / 2.5), rec = clamp((t - cue(3)) / 0.5);
  const bob = 2.2 * Math.sin(t * 2.1), FL = 268, L = 62;
  // caviglia ferma; la tibia si inclina in avanti, l'anca scende dietro e sotto il ginocchio, il busto si piega un po' in avanti
  const ankle: V = [148, FL - 12], sa = (38 * k * Math.PI) / 180;
  const kn: V = [ankle[0] + L * Math.sin(sa), ankle[1] - L * Math.cos(sa)];
  const hipT = lerp([148, FL - 12 - 2 * L], [118, FL - 40], k), hd = Math.hypot(hipT[0] - kn[0], hipT[1] - kn[1]) || 1;
  const hip: V = [kn[0] + ((hipT[0] - kn[0]) / hd) * L, kn[1] + ((hipT[1] - kn[1]) / hd) * L + bob * k];
  const ta = (30 * k * Math.PI) / 180, T = 72;
  const sh: V = [hip[0] + T * Math.sin(ta), hip[1] - T * Math.cos(ta) + bob * 0.5];
  const head: V = [sh[0] + 30 * Math.sin(ta + 0.12), sh[1] - 30 * Math.cos(ta + 0.12)];
  const hand = lerp([sh[0] + 4, sh[1] + 74], [kn[0] + 22, kn[1] + 6], k), elbow = lerp([sh[0] + 2, sh[1] + 38], [(sh[0] + kn[0]) / 2 + 12, (sh[1] + kn[1]) / 2 + 16], k);
  const lime = "#95FF00", R = 132, C = 2 * Math.PI * R;
  return (
    <svg viewBox="0 0 300 300" width={300} height={300} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`${uid}-warm`}><stop offset="0%" stopColor="#FFB020" stopOpacity={0.5} /><stop offset="100%" stopColor="#FFB020" stopOpacity={0} /></radialGradient>
      </defs>
      {house > 0 ? (
        <g>
          <circle cx={150} cy={180} r={120} fill={`url(#${uid}-warm)`} opacity={house} />
          <path d="M 34 268 L 34 122 L 150 30 L 266 122 L 266 268" fill="none" stroke="#F4F1E5" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={640} strokeDashoffset={640 * (1 - house)} />
          {[0, 1, 2, 3].map((i) => { const p = (t * 0.35 + i * 0.27) % 1; return <circle key={i} cx={i % 2 ? 22 + i * 4 : 282 - i * 5} cy={30 + p * 200} r={3.5} fill="#B8D7EA" opacity={house * Math.sin(p * Math.PI)} />; })}
        </g>
      ) : null}
      <line x1={10} y1={FL} x2={290} y2={FL} stroke="rgba(244,241,229,0.4)" strokeWidth={4} strokeLinecap="round" />
      {timer > 0 ? (
        <g transform="rotate(-90 150 150)">
          <circle cx={150} cy={150} r={R} fill="none" stroke={lime} strokeWidth={10} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - 0.84 * timer)} />
        </g>
      ) : null}
      {/* gamba dietro, poi busto, gamba e braccio davanti */}
      <Limb a={[hip[0] - 4, hip[1]]} b={[kn[0] - 8, kn[1] + 3]} w={22} back /><Limb a={[kn[0] - 8, kn[1] + 3]} b={[ankle[0] - 10, ankle[1]]} w={20} back />
      <Limb a={hip} b={sh} w={32} />
      <Limb a={hip} b={kn} w={25} /><Limb a={kn} b={ankle} w={22} />
      <line x1={ankle[0] - 14} y1={FL - 7} x2={ankle[0] + 34} y2={FL - 7} stroke="#F4F1E5" strokeWidth={14} strokeLinecap="round" />
      <Limb a={sh} b={elbow} w={17} /><Limb a={elbow} b={hand} w={16} />
      <circle cx={hand[0]} cy={hand[1]} r={10} fill="#E7B899" stroke="#F4F1E5" strokeWidth={2} />
      <circle cx={head[0]} cy={head[1]} r={22} fill="#E7B899" stroke="#F4F1E5" strokeWidth={2} />
      {rec > 0 ? [hip, kn, ankle].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={17 + 4 * Math.sin(t * 4 + i * 1.3)} fill="none" stroke={lime} strokeWidth={5} opacity={rec} />) : null}
      {rec > 0 ? [0, 1, 2, 3].map((i) => { const p = (t * 0.6 + i * 0.25) % 1, x = 70 + i * 52, y = 230 - p * 120; return <path key={i} d={`M${x} ${y - 8} L${x + 3} ${y - 3} L${x + 8} ${y} L${x + 3} ${y + 3} L${x} ${y + 8} L${x - 3} ${y + 3} L${x - 8} ${y} L${x - 3} ${y - 3} Z`} fill={lime} opacity={rec * Math.sin(p * Math.PI)} />; }) : null}
    </svg>
  );
};
