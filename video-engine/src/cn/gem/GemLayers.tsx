// Illustrazione dei tre strati per correre al freddo: prima stesura scritta da Gemini (gemini-flash, 20/11) su indicazioni di regia,
// poi rifinita a mano (gocce, vento che si ferma sulla giacca). Solo disegno: le scritte le mette l'elemento `layers` (Elements10).
import React from "react";

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const easeOutCubic = (x: number) => 1 - Math.pow(1 - clamp(x), 3);

export const GemLayers: React.FC<{
  t: number;
  uid: string;
  stage: 1 | 2 | 3;
  cue: number;
  fx: [number, number];
}> = ({ t, uid, stage, cue, fx }) => {
  const breathScale = 1 + Math.sin(t * 2.5) * 0.008;

  const getProgress = (layerIdx: number) => {
    if (stage > layerIdx) return 1;
    if (stage < layerIdx) return 0;
    return easeOutCubic((t - cue) / 0.5);
  };

  const getPopScale = (layerIdx: number) => {
    if (stage !== layerIdx) return 1;
    const elapsed = t - cue;
    if (elapsed < 0) return 1;
    if (elapsed <= 0.5) {
      return 1 + Math.sin((elapsed / 0.5) * Math.PI) * 0.02;
    }
    const popElapsed = elapsed - 0.5;
    if (popElapsed < 0.25) {
      return 1 + 0.035 * (1 - popElapsed / 0.25);
    }
    return 1;
  };

  const p1 = getProgress(1);
  const p2 = getProgress(2);
  const p3 = getProgress(3);

  const pop1 = getPopScale(1);
  const pop2 = getPopScale(2);
  const pop3 = getPopScale(3);

  const glowOpacity = 0.35 + Math.sin(t * 4) * 0.1;
  const vestOutlineOpacity = 0.35 + Math.sin(t * 5) * 0.15;

  return (
    <svg
      viewBox="0 0 320 320"
      width={320}
      height={320}
      style={{ overflow: "visible" }}
    >
      <defs>
        <clipPath id={`${uid}-clip-1`}>
          <rect x={30} y={280 - p1 * 240} width={260} height={p1 * 240 + 20} />
        </clipPath>
        <clipPath id={`${uid}-clip-2`}>
          <rect x={30} y={280 - p2 * 240} width={260} height={p2 * 240 + 20} />
        </clipPath>
        <clipPath id={`${uid}-clip-3`}>
          <rect x={30} y={280 - p3 * 240} width={260} height={p3 * 240 + 20} />
        </clipPath>

        <linearGradient id={`${uid}-l1-grad`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8CBBD8" />
          <stop offset="50%" stopColor="#B8D7EA" />
          <stop offset="100%" stopColor="#7AA6C2" />
        </linearGradient>

        <linearGradient id={`${uid}-l2-grad`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#31531E" />
          <stop offset="50%" stopColor="#49762E" />
          <stop offset="100%" stopColor="#2A471A" />
        </linearGradient>

        <linearGradient id={`${uid}-l3-grad`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E6E2D3" />
          <stop offset="50%" stopColor="#F4F1E5" />
          <stop offset="100%" stopColor="#DCD7C5" />
        </linearGradient>

        <radialGradient id={`${uid}-heat-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB020" stopOpacity={0.9} />
          <stop offset="60%" stopColor="#FF8000" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#FF5500" stopOpacity={0} />
        </radialGradient>
      </defs>

      <g transform={`translate(160, 160) scale(${breathScale}) translate(-160, -160)`}>
        {/* Skin: Neck and Hands */}
        <path
          d="M 148 48 C 148 42, 172 42, 172 48 L 174 72 L 146 72 Z"
          fill="#E7B899"
        />
        <circle cx={65} cy={254} r={8} fill="#E7B899" />
        <circle cx={255} cy={254} r={8} fill="#E7B899" />

        {/* LAYER 1: Base Layer (Blue Long-Sleeve) */}
        {p1 > 0 && (
          <g transform={`translate(160, 160) scale(${pop1}) translate(-160, -160)`}>
            <g clipPath={`url(#${uid}-clip-1)`}>
              {/* Long sleeves + Torso base */}
              <path
                d="M 144 64 C 152 70, 168 70, 176 64 L 228 76 C 242 120, 250 180, 254 248 L 238 250 C 234 185, 226 130, 204 110 L 204 248 L 116 248 L 116 110 C 94 130, 86 185, 82 250 L 66 248 C 70 180, 78 120, 92 76 Z"
                fill={`url(#${uid}-l1-grad)`}
                stroke="#6691AD"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
              {/* Round collar */}
              <path
                d="M 144 64 C 152 72, 168 72, 176 64 C 168 58, 152 58, 144 64 Z"
                fill="#7AA6C2"
                stroke="#537B96"
                strokeWidth={1}
              />
              {/* Sleeve seams */}
              <path
                d="M 92 76 C 104 94, 114 105, 116 110"
                fill="none"
                stroke="#6691AD"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
              <path
                d="M 228 76 C 216 94, 206 105, 204 110"
                fill="none"
                stroke="#6691AD"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
            </g>
          </g>
        )}

        {/* STAGE 1 FX: Inner Warm Glow & Heat Waves & Sweat Drops */}
        {stage === 1 && (
          <>
            {t >= fx[0] && (
              <g>
                <circle
                  cx={160}
                  cy={150}
                  r={42}
                  fill={`url(#${uid}-heat-glow)`}
                  opacity={glowOpacity}
                />
                {[0, 1, 2].map((hw) => {
                  const waveProgress = ((t * 1.4 + hw * 0.33) % 1);
                  const wy = 205 - waveProgress * 85;
                  const wx = 142 + hw * 18;
                  const opacity = Math.sin(waveProgress * Math.PI) * 0.75;
                  const dx = Math.sin(t * 5 + hw * 2) * 4;
                  return (
                    <path
                      key={`hw-${hw}`}
                      d={`M ${wx} ${wy} Q ${wx + dx} ${wy - 12}, ${wx} ${wy - 24}`}
                      fill="none"
                      stroke="#FFB020"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeOpacity={opacity}
                    />
                  );
                })}
              </g>
            )}

            {t >= fx[1] &&
              [0, 1, 2, 3, 4, 5].map((dropIdx) => {
                const isLeft = dropIdx % 2 === 0;
                const row = Math.floor(dropIdx / 2);
                const dropProg = ((t * 1.6 + dropIdx * 0.18) % 1);
                const startX = isLeft ? 145 : 175;
                const endX = isLeft ? 45 : 275;
                const startY = 120 + row * 35;
                const currX = startX + (endX - startX) * dropProg;
                const currY = startY + Math.sin(dropProg * Math.PI * 2) * 6;
                const opacity = Math.sin(dropProg * Math.PI) * 0.85;

                return (
                  <g key={`drop-${dropIdx}`} opacity={opacity}>
                    <circle cx={currX} cy={currY} r={5.5} fill="#B8D7EA" />
                    <circle cx={currX - 1.6} cy={currY - 1.6} r={1.8} fill="#FFFFFF" />
                  </g>
                );
              })}
          </>
        )}

        {/* LAYER 2: Insulating Vest (Green Sleeveless) */}
        {p2 > 0 && (
          <g transform={`translate(160, 160) scale(${pop2}) translate(-160, -160)`}>
            <g clipPath={`url(#${uid}-clip-2)`}>
              {/* Vest Body */}
              <path
                d="M 144 68 Q 160 78 176 68 L 210 74 C 200 100, 204 125, 204 125 L 206 256 L 114 256 L 114 125 C 114 125, 120 100, 110 74 Z"
                fill={`url(#${uid}-l2-grad)`}
                stroke="#2A471A"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
              {/* Quilting Lines */}
              {[102, 132, 162, 192, 222].map((qy) => (
                <path
                  key={`quilt-${qy}`}
                  d={`M 115 ${qy} Q 160 ${qy + 6} 205 ${qy}`}
                  fill="none"
                  stroke="#253D17"
                  strokeWidth={1.5}
                />
              ))}
              {/* Vest collar trim */}
              <path
                d="M 144 68 Q 160 78 176 68"
                fill="none"
                stroke="#85C45B"
                strokeWidth={2}
              />
            </g>
          </g>
        )}

        {/* STAGE 2 FX: Retained Heat Glow + Vest Hug Outline + Shoulder Vapour */}
        {stage === 2 && (
          <>
            {t >= fx[0] && (
              <g>
                <circle
                  cx={160}
                  cy={150}
                  r={45}
                  fill={`url(#${uid}-heat-glow)`}
                  opacity={glowOpacity}
                />
                {/* Heat held hugging outline */}
                <path
                  d="M 144 68 Q 160 78 176 68 L 210 74 C 200 100, 204 125, 204 125 L 206 256 L 114 256 L 114 125 C 114 125, 120 100, 110 74 Z"
                  fill="none"
                  stroke="#FFB020"
                  strokeWidth={6}
                  strokeOpacity={vestOutlineOpacity}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}

            {t >= fx[1] &&
              [0, 1, 2, 3].map((vIdx) => {
                const isLeft = vIdx % 2 === 0;
                const vProg = ((t * 1.2 + vIdx * 0.25) % 1);
                const baseX = isLeft ? 105 + vIdx * 6 : 215 - vIdx * 6;
                const wy = 72 - vProg * 45;
                const dx = Math.sin(t * 4 + vIdx) * 6;
                const opacity = Math.sin(vProg * Math.PI) * 0.6;

                return (
                  <path
                    key={`vapour-${vIdx}`}
                    d={`M ${baseX} ${wy + 15} Q ${baseX + dx} ${wy + 5}, ${baseX} ${wy}`}
                    fill="none"
                    stroke="#E3DFCF"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeOpacity={opacity}
                  />
                );
              })}
          </>
        )}

        {/* LAYER 3: Windproof Shell Jacket (Off-White / Lime Zip) */}
        {p3 > 0 && (
          <g transform={`translate(160, 160) scale(${pop3}) translate(-160, -160)`}>
            <g clipPath={`url(#${uid}-clip-3)`}>
              {/* Outer Shell + Sleeves */}
              <path
                d="M 140 66 L 160 106 L 180 66 L 230 74 C 244 120, 252 180, 256 244 L 239 246 C 235 185, 227 130, 206 112 L 206 242 L 114 242 L 114 112 C 93 130, 85 185, 81 246 L 64 244 C 68 180, 76 120, 90 74 Z"
                fill={`url(#${uid}-l3-grad)`}
                stroke="#C7C2B0"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
              {/* V-neck open lining */}
              <path
                d="M 140 66 L 160 106 L 180 66"
                fill="none"
                stroke="#95FF00"
                strokeWidth={2.5}
              />
              {/* Front Central Zip */}
              <line
                x1={160}
                y1={106}
                x2={160}
                y2={242}
                stroke="#95FF00"
                strokeWidth={2.5}
              />
              {/* Zip Puller */}
              <rect
                x={158}
                y={122}
                width={4}
                height={10}
                rx={2}
                fill="#0B0F0A"
                stroke="#95FF00"
                strokeWidth={1}
              />
              {/* Lime Hem Trim */}
              <line
                x1={114}
                y1={242}
                x2={206}
                y2={242}
                stroke="#95FF00"
                strokeWidth={2}
              />
            </g>
          </g>
        )}

        {/* STAGE 3 FX: Wind Deflection Streaks & Rain Drops + Shoulder Splashes */}
        {stage === 3 && (
          <>
            {t >= fx[0] &&
              [0, 1, 2, 3, 4].map((wIdx) => {
                const speed = 1.4;
                const wProg = ((t * speed + wIdx * 0.2) % 1);
                const startY = 75 + wIdx * 38;
                const startX = -62 + wProg * 72; // si ferma sul bordo della giacca: il vento non entra
                const isUpper = wIdx < 2;
                const deflectY = isUpper ? startY - 25 : startY + 25;
                const opacity = Math.sin(wProg * Math.PI) * 0.85;

                return (
                  <path
                    key={`wind-${wIdx}`}
                    d={`M ${startX} ${startY} Q ${startX + 45} ${startY}, ${startX + 75} ${deflectY}`}
                    fill="none"
                    stroke="#B8D7EA"
                    strokeWidth={3.5}
                    strokeDasharray="10 6"
                    strokeLinecap="round"
                    strokeOpacity={opacity}
                  />
                );
              })}

            {t >= fx[1] &&
              [0, 1, 2, 3, 4, 5].map((rIdx) => {
                const rProg = ((t * 1.8 + rIdx * 0.16) % 1);
                const isLeft = rIdx < 3;
                const targetX = isLeft ? 82 + rIdx * 14 : 208 + (rIdx - 3) * 14;
                const targetY = 70 + (rIdx % 3) * 3;
                const startY = targetY - 70;
                const currY = startY + rProg * 70;
                const isHit = rProg > 0.88;

                if (!isHit) {
                  return (
                    <line
                      key={`rain-${rIdx}`}
                      x1={targetX - 2}
                      y1={currY - 10}
                      x2={targetX}
                      y2={currY}
                      stroke="#B8D7EA"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeOpacity={0.8}
                    />
                  );
                }

                const splashProg = (rProg - 0.88) / 0.12;
                const splashOpacity = (1 - splashProg) * 0.9;
                const dx1 = isLeft ? -10 * splashProg : 10 * splashProg;
                const dx2 = isLeft ? -4 * splashProg : 4 * splashProg;
                const dy1 = -8 * splashProg;
                const dy2 = -12 * splashProg;

                return (
                  <g key={`splash-${rIdx}`} opacity={splashOpacity}>
                    <line
                      x1={targetX}
                      y1={targetY}
                      x2={targetX + dx1}
                      y2={targetY + dy1}
                      stroke="#B8D7EA"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                    <line
                      x1={targetX}
                      y1={targetY}
                      x2={targetX + dx2}
                      y2={targetY + dy2}
                      stroke="#FFFFFF"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}
          </>
        )}
      </g>
    </svg>
  );
};
