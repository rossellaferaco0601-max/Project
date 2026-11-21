// Illustrazione scritta da Gemini (gemini-flash) su indicazioni di regia (work/ytcn26/gemini/prompt_GemHouse.txt); scritte e agganci in Elements10.
import React from "react";

export const GemHouse: React.FC<{ t: number; uid: string; cues: number[] }> = ({ t, uid, cues }) => {
  const cue = (i: number) => (cues[i] ?? Infinity);
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);
  const lerp = (v0: number, v1: number, f: number) => v0 + f * (v1 - v0);

  const tDraw = easeOut(clamp(t / 0.6, 0, 1));
  const tWarmGlow = easeOut(clamp((t - cue(0)) / 0.6, 0, 1));
  const tTimer = clamp((t - cue(1)) / 2.5, 0, 1);
  const tWarmBody = easeOut(clamp((t - cue(2)) / 0.6, 0, 1));
  const tPulse = Math.max(0, t - cue(3));
  const tOpen = easeOut(clamp((t - cue(4)) / 0.5, 0, 1));
  const tSnowFade = lerp(1, 0.4, easeOut(clamp((t - cue(4)) / 0.5, 0, 1)));

  const bob = Math.sin(t * 3) * 3;
  const breathe = 1 + Math.sin(t * 2) * 0.02;
  const armMove = Math.sin(t * 4) * 0.3;
  const legMove = Math.sin(t * 4) * 15;

  const housePath = "M 40 260 V 140 L 150 50 L 260 140 V 260 H 40";
  const dashArray = 800;

  const snowflakes = Array.from({ length: 18 }).map((_, i) => ({
    x: ((i * 47) % 280) + 10,
    y: ((i * 83 + t * 60) % 320) - 20,
    s: 2 + (i % 3),
    o: (i % 2 === 0 ? 0.8 : 0.4) * tSnowFade
  }));

  const heatWaves = Array.from({ length: 3 }).map((_, i) => {
    const progress = ((t * 0.8 + i * 0.33) % 1);
    return {
      x: 140 + i * 10,
      y: 110 - progress * 40,
      op: Math.sin(progress * Math.PI) * tWarmBody,
    };
  });

  return (
    <svg viewBox="0 0 300 300" width={300} height={300} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`${uid}-warmth`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB020" stopOpacity={0.4 * tWarmGlow} />
          <stop offset="100%" stopColor="#FFB020" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-glow`}>
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outside elements */}
      <g>
        {snowflakes.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#B8D7EA" opacity={s.o} />
        ))}
        <path
          d="M 270 60 Q 290 65 275 75 M 10 40 Q 30 35 15 25"
          stroke="#B8D7EA"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity={0.3 * tSnowFade}
        />
      </g>

      {/* House Interior Glow */}
      <path d={housePath} fill={`url(#${uid}-warmth)`} />

      {/* House Outline */}
      <path
        d={housePath}
        fill="none"
        stroke="#F4F1E5"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashArray}
        strokeDashoffset={dashArray * (1 - tDraw)}
      />

      {/* Door */}
      <g transform={`translate(260, 260) scale(${1 - tOpen * 0.9}, 1) translate(-260, -260)`}>
        <rect x="215" y="170" width="35" height="90" fill="#49762E" stroke="#F4F1E5" strokeWidth="3" />
        <circle cx="225" cy="215" r="3" fill="#FFB020" />
      </g>
      {tOpen > 0 && (
        <rect 
          x="250" y="170" width="10" height="90" 
          fill="#95FF00" opacity={tOpen * 0.4} filter={`url(#${uid}-glow)`} 
        />
      )}

      {/* Timer Ring */}
      {tTimer > 0 && (
        <g transform="translate(150, 185)">
          <circle
            cx="0" cy="0" r="75"
            fill="none"
            stroke="#95FF00"
            strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 75}`}
            strokeDashoffset={2 * Math.PI * 75 * (1 - tTimer)}
            opacity="0.4"
            transform="rotate(-90)"
          />
          <line 
            x1="0" y1="0" 
            x2={Math.cos(tTimer * Math.PI * 2 - Math.PI / 2) * 70} 
            y2={Math.sin(tTimer * Math.PI * 2 - Math.PI / 2) * 70} 
            stroke="#95FF00" strokeWidth="4" strokeLinecap="round"
          />
        </g>
      )}

      {/* Heat Waves */}
      {heatWaves.map((w, i) => (
        <path
          key={i}
          d={`M ${w.x} ${w.y} Q ${w.x + 5} ${w.y - 10} ${w.x} ${w.y - 20}`}
          fill="none"
          stroke="#FF6B4A"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={w.op}
        />
      ))}

      {/* Runner Figure */}
      <g transform={`translate(150, ${200 + bob}) scale(${breathe}) translate(-150, -200)`}>
        {/* Legs */}
        <g strokeLinecap="round" strokeWidth="22" strokeLinejoin="round">
          {/* Leg L */}
          <path d={`M 138 200 L 138 ${230 - Math.max(0, legMove)} L 138 260`} stroke="#F4F1E5" strokeWidth="26" />
          <path d={`M 138 200 L 138 ${230 - Math.max(0, legMove)} L 138 260`} stroke="#3A4640" />
          <path d={`M 138 200 L 138 ${230 - Math.max(0, legMove)} L 138 260`} stroke="#B8D7EA" opacity={1 - tWarmBody} strokeWidth="10" />
          <path d={`M 138 200 L 138 ${230 - Math.max(0, legMove)} L 138 260`} stroke="#FFB020" opacity={tWarmBody} strokeWidth="10" />
          
          {/* Leg R */}
          <path d={`M 162 200 L 162 ${230 - Math.max(0, -legMove)} L 162 260`} stroke="#F4F1E5" strokeWidth="26" />
          <path d={`M 162 200 L 162 ${230 - Math.max(0, -legMove)} L 162 260`} stroke="#3A4640" />
          <path d={`M 162 200 L 162 ${230 - Math.max(0, -legMove)} L 162 260`} stroke="#B8D7EA" opacity={1 - tWarmBody} strokeWidth="10" />
          <path d={`M 162 200 L 162 ${230 - Math.max(0, -legMove)} L 162 260`} stroke="#FFB020" opacity={tWarmBody} strokeWidth="10" />
        </g>

        {/* Torso */}
        <path d="M 150 145 L 150 205" stroke="#F4F1E5" strokeWidth="48" strokeLinecap="round" />
        <path d="M 150 145 L 150 205" stroke="#3A4640" strokeWidth="44" strokeLinecap="round" />
        <path d="M 150 145 L 150 205" stroke="#B8D7EA" opacity={1 - tWarmBody} strokeWidth="20" strokeLinecap="round" />
        <path d="M 150 145 L 150 205" stroke="#FFB020" opacity={tWarmBody} strokeWidth="20" strokeLinecap="round" />

        {/* Arms */}
        <g strokeLinecap="round" strokeWidth="18" strokeLinejoin="round">
          {/* Arm L */}
          <path d={`M 130 155 L ${110 - armMove * 20} ${175 + armMove * 30} L ${115 - armMove * 10} 205`} stroke="#F4F1E5" strokeWidth="22" />
          <path d={`M 130 155 L ${110 - armMove * 20} ${175 + armMove * 30} L ${115 - armMove * 10} 205`} stroke="#3A4640" />
          <path d={`M 130 155 L ${110 - armMove * 20} ${175 + armMove * 30} L ${115 - armMove * 10} 205`} stroke="#B8D7EA" opacity={1 - tWarmBody} strokeWidth="8" />
          <path d={`M 130 155 L ${110 - armMove * 20} ${175 + armMove * 30} L ${115 - armMove * 10} 205`} stroke="#FFB020" opacity={tWarmBody} strokeWidth="8" />
          
          {/* Arm R */}
          <path d={`M 170 155 L ${190 + armMove * 20} ${175 - armMove * 30} L ${185 + armMove * 10} 205`} stroke="#F4F1E5" strokeWidth="22" />
          <path d={`M 170 155 L ${190 + armMove * 20} ${175 - armMove * 30} L ${185 + armMove * 10} 205`} stroke="#3A4640" />
          <path d={`M 170 155 L ${190 + armMove * 20} ${175 - armMove * 30} L ${185 + armMove * 10} 205`} stroke="#B8D7EA" opacity={1 - tWarmBody} strokeWidth="8" />
          <path d={`M 170 155 L ${190 + armMove * 20} ${175 - armMove * 30} L ${185 + armMove * 10} 205`} stroke="#FFB020" opacity={tWarmBody} strokeWidth="8" />
        </g>

        {/* Head and Hands */}
        <circle cx="150" cy="120" r="18" fill="#F4F1E5" />
        <circle cx="150" cy="120" r="15" fill="#E7B899" />
        <circle cx={115 - armMove * 10} cy="210" r="9" fill="#F4F1E5" />
        <circle cx={115 - armMove * 10} cy="210" r="7" fill="#E7B899" />
        <circle cx={185 + armMove * 10} cy="210" r="9" fill="#F4F1E5" />
        <circle cx={185 + armMove * 10} cy="210" r="7" fill="#E7B899" />
      </g>

      {/* Circulation Pulse Dots */}
      {tPulse > 0 && (
        <g opacity={Math.min(1, tPulse * 2)}>
          <circle cx="150" cy={160 + Math.sin(tPulse * 5) * 20} r="4" fill="#FF6B4A" filter={`url(#${uid}-glow)`} />
          <circle cx={130 + Math.sin(tPulse * 6) * 10} cy={220 + Math.cos(tPulse * 6) * 20} r="3" fill="#FF6B4A" />
          <circle cx={170 - Math.sin(tPulse * 6) * 10} cy={220 + Math.cos(tPulse * 6) * 20} r="3" fill="#FF6B4A" />
        </g>
      )}
    </svg>
  );
};
