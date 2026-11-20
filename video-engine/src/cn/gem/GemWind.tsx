// Illustrazione scritta da Gemini (gemini-flash, 20/11) su indicazioni di regia; le scritte le mette Elements10.
import React from "react";

interface GemWindProps {
  t: number;
  uid: string;
  gust: number;
}

interface RibbonData {
  d: string;
  len: number;
  dash: number;
  width: number;
  color: string;
  speed: number;
  phase: number;
  gustOnly: boolean;
  central: boolean;
}

interface ParticleData {
  y: number;
  amp: number;
  freq: number;
  speed: number;
  phase: number;
  size: number;
  rotSpeed: number;
  type: "asterisk" | "dot";
  gustOnly: boolean;
}

const RIBBONS: RibbonData[] = [
  {
    d: "M -120,35 C 100,20 250,55 420,30 C 580,10 720,45 820,25 C 840,20 850,5 835,-5 C 820,-15 810,5 825,12",
    len: 1000,
    dash: 320,
    width: 6,
    color: "#FFFFFF",
    speed: 220,
    phase: 0,
    gustOnly: false,
    central: false,
  },
  {
    d: "M -150,65 C 80,50 220,80 380,55 C 540,30 680,75 800,50 C 825,40 835,25 820,15 C 805,5 795,25 810,32",
    len: 1050,
    dash: 280,
    width: 5,
    color: "#B8D7EA",
    speed: 190,
    phase: 300,
    gustOnly: false,
    central: false,
  },
  {
    d: "M -100,90 C 120,75 280,105 450,80 C 600,60 740,95 840,75 C 860,65 870,50 855,40 C 840,30 830,50 845,57",
    len: 1020,
    dash: 350,
    width: 7,
    color: "#FFFFFF",
    speed: 260,
    phase: 150,
    gustOnly: true,
    central: false,
  },
  {
    d: "M -130,125 C 120,110 260,140 430,120 C 590,105 710,135 820,115 C 840,110 850,95 835,88 C 820,80 810,100 825,105",
    len: 980,
    dash: 220,
    width: 4,
    color: "#B8D7EA",
    speed: 180,
    phase: 500,
    gustOnly: false,
    central: true,
  },
  {
    d: "M -150,150 C 100,135 250,165 410,145 C 570,130 680,160 780,140 C 800,135 810,120 795,112 C 780,105 770,125 785,130",
    len: 1000,
    dash: 240,
    width: 4,
    color: "#FFFFFF",
    speed: 240,
    phase: 200,
    gustOnly: true,
    central: true,
  },
  {
    d: "M -110,175 C 90,160 240,190 400,170 C 560,150 700,185 810,165 C 830,155 840,140 825,130 C 810,120 800,140 815,148",
    len: 1030,
    dash: 300,
    width: 8,
    color: "#B8D7EA",
    speed: 230,
    phase: 650,
    gustOnly: true,
    central: false,
  },
  {
    d: "M -140,205 C 110,220 270,185 440,210 C 610,230 730,190 830,215 C 850,220 860,235 845,242 C 830,248 820,230 835,222",
    len: 1010,
    dash: 340,
    width: 6,
    color: "#FFFFFF",
    speed: 210,
    phase: 400,
    gustOnly: false,
    central: false,
  },
  {
    d: "M -160,228 C 70,213 220,238 390,223 C 550,208 690,233 790,218 C 810,213 820,198 805,191 C 790,183 785,203 798,208",
    len: 990,
    dash: 260,
    width: 5,
    color: "#B8D7EA",
    speed: 200,
    phase: 750,
    gustOnly: false,
    central: false,
  },
  {
    d: "M -100,240 C 150,250 320,225 500,242 C 660,255 760,230 850,240 C 870,242 875,250 860,254 C 845,257 840,245 852,243",
    len: 1040,
    dash: 310,
    width: 7,
    color: "#FFFFFF",
    speed: 250,
    phase: 850,
    gustOnly: true,
    central: false,
  },
];

const PARTICLES: ParticleData[] = [
  { y: 30, amp: 12, freq: 1.2, speed: 0.28, phase: 0.05, size: 10, rotSpeed: 1.5, type: "asterisk", gustOnly: false },
  { y: 55, amp: 8, freq: 1.8, speed: 0.32, phase: 0.22, size: 6, rotSpeed: 0, type: "dot", gustOnly: false },
  { y: 75, amp: 15, freq: 1.0, speed: 0.35, phase: 0.45, size: 11, rotSpeed: -2.0, type: "asterisk", gustOnly: true },
  { y: 95, amp: 6, freq: 2.1, speed: 0.25, phase: 0.68, size: 5, rotSpeed: 0, type: "dot", gustOnly: false },
  { y: 115, amp: 10, freq: 1.4, speed: 0.30, phase: 0.85, size: 8, rotSpeed: 1.2, type: "asterisk", gustOnly: true },
  { y: 135, amp: 7, freq: 1.6, speed: 0.27, phase: 0.12, size: 5, rotSpeed: 0, type: "dot", gustOnly: false },
  { y: 155, amp: 14, freq: 1.1, speed: 0.33, phase: 0.38, size: 9, rotSpeed: -1.8, type: "asterisk", gustOnly: true },
  { y: 175, amp: 9, freq: 1.9, speed: 0.29, phase: 0.58, size: 6, rotSpeed: 0, type: "dot", gustOnly: false },
  { y: 195, amp: 16, freq: 1.3, speed: 0.34, phase: 0.76, size: 12, rotSpeed: 2.2, type: "asterisk", gustOnly: false },
  { y: 215, amp: 10, freq: 1.5, speed: 0.31, phase: 0.92, size: 7, rotSpeed: -1.4, type: "asterisk", gustOnly: false },
  { y: 40, amp: 18, freq: 0.9, speed: 0.38, phase: 0.31, size: 10, rotSpeed: 2.5, type: "asterisk", gustOnly: true },
  { y: 85, amp: 5, freq: 2.5, speed: 0.26, phase: 0.52, size: 5, rotSpeed: 0, type: "dot", gustOnly: true },
  { y: 165, amp: 12, freq: 1.7, speed: 0.36, phase: 0.19, size: 8, rotSpeed: -2.1, type: "asterisk", gustOnly: true },
  { y: 225, amp: 7, freq: 2.0, speed: 0.30, phase: 0.63, size: 6, rotSpeed: 0, type: "dot", gustOnly: false },
];

export const GemWind: React.FC<GemWindProps> = ({ t, uid, gust }) => {
  const dt = Math.max(0, t - gust);
  const ramp = Math.min(1, dt / 0.4);
  const gFactor = ramp * ramp * (3 - 2 * ramp);

  let T_anim: number;
  if (t < gust) {
    T_anim = t;
  } else if (t < gust + 0.4) {
    const d = t - gust;
    T_anim = gust + d + 1.4 * ((d * d) / 0.8);
  } else {
    T_anim = gust + 0.68 + 2.4 * (t - gust - 0.4);
  }

  const baseOpacity = 0.55 + 0.45 * gFactor;
  const tiltAngle = gFactor * 2.2;

  const renderAsteriskShape = (size: number, strokeColor: string, strokeW: number) => {
    const r = size / 2;
    const rCos = r * 0.5;
    const rSin = r * 0.866025;
    return (
      <g stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round">
        <line x1={-r} y1={0} x2={r} y2={0} />
        <line x1={-rCos} y1={-rSin} x2={rCos} y2={rSin} />
        <line x1={-rCos} y1={rSin} x2={rCos} y2={-rSin} />
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 880 250"
      width={880}
      height={250}
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id={`${uid}-softGlow`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>

      <g transform={`rotate(${tiltAngle} 440 125)`}>
        {RIBBONS.map((r, i) => {
          const visMultiplier = r.gustOnly ? gFactor : 1.0;
          const centralMultiplier = r.central ? 0.45 : 1.0;
          const finalOpacity = baseOpacity * visMultiplier * centralMultiplier;

          if (finalOpacity <= 0.001) return null;

          const dashOffset = -((T_anim * r.speed + r.phase) % r.len);
          const dashArray = `${r.dash} ${r.len - r.dash}`;

          return (
            <g key={`ribbon-${i}`}>
              <path
                d={r.d}
                fill="none"
                stroke="#0B0F0A"
                strokeWidth={r.width}
                strokeOpacity={finalOpacity * 0.5}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset - 3}
                strokeLinecap="round"
                transform="translate(3, 3)"
              />
              <path
                d={r.d}
                fill="none"
                stroke={r.color}
                strokeWidth={r.width}
                strokeOpacity={finalOpacity}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {PARTICLES.map((p, i) => {
          const visMultiplier = p.gustOnly ? gFactor : 1.0;
          if (visMultiplier <= 0.001) return null;

          const progress = ((T_anim * p.speed + p.phase) % 1.0 + 1.0) % 1.0;
          const x = -60 + progress * 1000;
          const y = p.y + Math.sin(progress * Math.PI * 2 * p.freq) * p.amp;

          const edgeFade = Math.sin(Math.min(1, Math.max(0, (x + 40) / 960)) * Math.PI);
          const inCenterX = x > 180 && x < 700;
          const inCenterY = y > 40 && y < 210;
          const centralFactor = inCenterX && inCenterY ? 0.35 : 1.0;

          const pOpacity = baseOpacity * visMultiplier * edgeFade * centralFactor;
          if (pOpacity <= 0.001) return null;

          const rotation = (T_anim * p.rotSpeed * 360 + i * 45) % 360;

          return (
            <g key={`particle-${i}`}>
              <g
                transform={`translate(${x + 3}, ${y + 3}) rotate(${rotation})`}
                opacity={pOpacity * 0.5}
              >
                {p.type === "dot" ? (
                  <circle cx={0} cy={0} r={p.size / 2} fill="#0B0F0A" />
                ) : (
                  renderAsteriskShape(p.size, "#0B0F0A", 2.2)
                )}
              </g>

              <g
                transform={`translate(${x}, ${y}) rotate(${rotation})`}
                opacity={pOpacity}
              >
                {p.type === "dot" ? (
                  <circle cx={0} cy={0} r={p.size / 2} fill="#F4F1E5" />
                ) : (
                  renderAsteriskShape(p.size, "#F4F1E5", 1.5)
                )}
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
