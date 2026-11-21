// Illustrazione scritta da Gemini (gemini-flash) su indicazioni di regia (work/ytcn26/gemini/prompt_GemNose.txt); scritte e agganci in Elements10.
import React from "react";

export const GemNose: React.FC<{ t: number; uid: string; cues: number[] }> = ({
  t,
  uid,
  cues,
}) => {
  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));
  const easeOut = (v: number) => 1 - Math.pow(1 - clamp(v, 0, 1), 3);
  const lerp = (a: number, b: number, f: number) => a + (b - a) * f;

  const cue = (i: number) => cues[i] ?? Infinity;

  const wP = easeOut((t - cue(0)) / 0.5); // Warmth
  const hP = easeOut((t - cue(1)) / 0.5); // Humidity
  const fP = easeOut((t - cue(2)) / 0.5); // Filter
  const pP = easeOut((t - cue(3)) / 0.5); // Protect

  const hexToRgb = (hex: string): [number, number, number] => {
    if (hex.startsWith("rgb")) { const n = hex.match(/\d+/g) ?? ["0", "0", "0"]; return [Number(n[0]), Number(n[1]), Number(n[2])]; }   // ritocco a mano: accetta anche un colore già mescolato
    const num = parseInt(hex.replace("#", ""), 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  const lerpColor = (c1: string, c2: string, factor: number) => {
    const f = clamp(factor, 0, 1);
    const [r1, g1, b1] = hexToRgb(c1);
    const [r2, g2, b2] = hexToRgb(c2);
    return `rgb(${Math.round(lerp(r1, r2, f))},${Math.round(
      lerp(g1, g2, f)
    )},${Math.round(lerp(b1, b2, f))})`;
  };

  // Idle movement
  const breath = Math.sin(t * 2.2) * 1.5;
  const breathScale = 1 + Math.sin(t * 2.2) * 0.006;

  // Airway polyline points
  const airwayPts: [number, number][] = [
    [15, 118],
    [76, 118],
    [112, 102],
    [142, 114],
    [158, 142],
    [160, 205],
    [160, 235],
  ];

  const getPolylineDistances = (pts: [number, number][]) => {
    const dists = [0];
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i][0] - pts[i - 1][0];
      const dy = pts[i][1] - pts[i - 1][1];
      dists.push(dists[i - 1] + Math.sqrt(dx * dx + dy * dy));
    }
    return dists;
  };

  const airwayDists = getPolylineDistances(airwayPts);
  const totalAirwayLen = airwayDists[airwayDists.length - 1];

  const getPointOnAirway = (u: number): { x: number; y: number } => {
    const targetD = clamp(u, 0, 1) * totalAirwayLen;
    for (let i = 0; i < airwayDists.length - 1; i++) {
      if (targetD >= airwayDists[i] && targetD <= airwayDists[i + 1]) {
        const segLen = airwayDists[i + 1] - airwayDists[i];
        const segFactor = segLen > 0 ? (targetD - airwayDists[i]) / segLen : 0;
        return {
          x: lerp(airwayPts[i][0], airwayPts[i + 1][0], segFactor),
          y: lerp(airwayPts[i][1], airwayPts[i + 1][1], segFactor),
        };
      }
    }
    return { x: airwayPts[airwayPts.length - 1][0], y: airwayPts[airwayPts.length - 1][1] };
  };

  // Profile path: Side-profile facing left
  const profilePath = `
    M 215 285
    Q 240 215 242 145
    Q 240 30 148 30
    Q 108 30 96 70
    Q 86 98 64 110
    C 58 114 66 124 82 123
    C 86 124 82 136 80 142
    C 78 147 88 147 90 149
    C 86 164 92 180 112 188
    L 132 285
    Z
  `;

  // Lung paths
  const leftLungPath = `M 152 235 C 135 240 125 255 128 273 C 130 285 145 288 155 280 C 158 265 157 248 152 235 Z`;
  const rightLungPath = `M 168 235 C 185 240 195 255 192 273 C 190 285 175 288 165 280 C 162 265 163 248 168 235 Z`;

  // Airflow particles (16 count)
  const particles = Array.from({ length: 16 }).map((_, i) => {
    const phase = (i / 16 + t * 0.32) % 1;
    const pt = getPointOnAirway(phase);

    // Color progression along path when warmed
    let pColor = "#B8D7EA";
    if (wP > 0) {
      if (phase < 0.2) {
        pColor = "#B8D7EA";
      } else if (phase < 0.55) {
        const factor = (phase - 0.2) / 0.35;
        pColor = lerpColor("#B8D7EA", "#FFB020", factor);
      } else {
        const factor = (phase - 0.55) / 0.45;
        pColor = lerpColor("#FFB020", "#FF6B4A", factor);
      }
      pColor = lerpColor("#B8D7EA", pColor, wP);
    }

    const r = lerp(4, 6, wP * phase);
    return { ...pt, color: pColor, r, phase };
  });

  // Droplets for Humidity
  const droplets = Array.from({ length: 5 }).map((_, i) => {
    const dPhase = (i / 5 + t * 0.4) % 1;
    const u = 0.2 + dPhase * 0.25; // inside nasal cavity
    const pt = getPointOnAirway(u);
    const offsetY = Math.sin(t * 3 + i) * 3;
    return { x: pt.x + (i % 2 === 0 ? 3 : -3), y: pt.y + offsetY, opacity: Math.sin(dPhase * Math.PI) };
  });

  // Dust specks for Filter
  const dustSpecks = Array.from({ length: 4 }).map((_, i) => {
    const speed = 0.4 + i * 0.05;
    const progress = (t * speed + i * 0.25) % 1;
    let x = lerp(-10, 76, progress);
    let y = 118 + Math.sin(progress * 8 + i) * 4;
    let opacity = 0.8;
    let bounced = false;

    if (fP > 0 && progress > 0.65) {
      bounced = true;
      const bounceF = (progress - 0.65) / 0.35;
      x = 76 - bounceF * 20;
      y = 118 - Math.sin(bounceF * Math.PI) * 16;
      opacity = (1 - bounceF) * fP;
    }

    return { x, y, opacity, bounced };
  });

  // Snowflake rotation
  const snowAngle = t * 40;

  return (
    <svg
      viewBox="0 0 300 300"
      width={300}
      height={300}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Nasal Cavity Warm Glow */}
        <radialGradient
          id={`${uid}-nasalGlow`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor="#FFB020" stopOpacity={0.7 * wP} />
          <stop offset="60%" stopColor="#FF6B4A" stopOpacity={0.3 * wP} />
          <stop offset="100%" stopColor="#FFB020" stopOpacity={0} />
        </radialGradient>

        {/* Cold Nasal Glow */}
        <radialGradient
          id={`${uid}-coldGlow`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor="#B8D7EA" stopOpacity={0.4 * (1 - wP)} />
          <stop offset="100%" stopColor="#B8D7EA" stopOpacity={0} />
        </radialGradient>

        {/* Lungs Warm Glow */}
        <radialGradient
          id={`${uid}-lungGlow`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor="#FF6B4A" stopOpacity={0.6 * wP} />
          <stop offset="70%" stopColor="#FFB020" stopOpacity={0.3 * wP} />
          <stop offset="100%" stopColor="#FF6B4A" stopOpacity={0} />
        </radialGradient>
      </defs>

      <g transform={`translate(0, ${breath}) scale(1, ${breathScale})`}>
        {/* Head Silhouette Base */}
        <path
          d={profilePath}
          fill="#F4F1E5"
          fillOpacity={0.16}
          stroke="#F4F1E5"
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Cold glow inside nasal cavity */}
        {wP < 1 && (
          <circle
            cx={115}
            cy={105}
            r={30}
            fill={`url(#${uid}-coldGlow)`}
          />
        )}

        {/* Warm glow inside nasal cavity */}
        {wP > 0 && (
          <circle
            cx={115}
            cy={105}
            r={32}
            fill={`url(#${uid}-nasalGlow)`}
          />
        )}

        {/* Airway Tunnel Outline */}
        <path
          d={`M 15 118 L 76 118 Q 112 102 142 114 Q 158 142 160 205 L 160 235`}
          fill="none"
          stroke={lerpColor("#B8D7EA", "#FFB020", wP)}
          strokeWidth={14}
          strokeOpacity={0.15}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Lungs Base */}
        <path
          d={leftLungPath}
          fill={wP > 0 ? "#FF6B4A" : "#B8D7EA"}
          fillOpacity={0.25 + wP * 0.2}
          stroke="#F4F1E5"
          strokeWidth={1.5}
          strokeOpacity={0.5}
        />
        <path
          d={rightLungPath}
          fill={wP > 0 ? "#FF6B4A" : "#B8D7EA"}
          fillOpacity={0.25 + wP * 0.2}
          stroke="#F4F1E5"
          strokeWidth={1.5}
          strokeOpacity={0.5}
        />

        {/* Warm Lungs Inner Glow */}
        {wP > 0 && (
          <circle
            cx={160}
            cy={260}
            r={35}
            fill={`url(#${uid}-lungGlow)`}
          />
        )}

        {/* Jagged Icy Spikes in Lungs (Before cue 0) */}
        {wP < 1 && (
          <g opacity={(1 - wP) * (0.6 + Math.sin(t * 8) * 0.2)} stroke="#B8D7EA" strokeWidth={1.5} fill="none">
            <path d="M 135 255 L 140 250 L 142 260 L 148 248 L 150 262 L 154 252" />
            <path d="M 166 252 L 170 262 L 173 248 L 178 260 L 180 250 L 185 255" />
            <path d="M 138 270 L 144 265 L 147 274 L 152 268" />
            <path d="M 168 268 L 173 274 L 176 265 L 182 270" />
          </g>
        )}

        {/* Water Droplets (Cue 1: Humidifies) */}
        {hP > 0 && (
          <g opacity={hP}>
            {droplets.map((d, i) => (
              <g key={i} transform={`translate(${d.x}, ${d.y})`} opacity={d.opacity}>
                <path
                  d="M 0 -3 C 2 -1 2 2 0 4 C -2 2 -2 -1 0 -3 Z"
                  fill="#B8D7EA"
                />
                <circle cx={-0.5} cy={0} r={0.7} fill="#F4F1E5" opacity={0.8} />
              </g>
            ))}
          </g>
        )}

        {/* Airflow Particles Stream */}
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={p.color}
            opacity={0.85}
          />
        ))}

        {/* Filter Mesh at Nostril (Cue 2: Filters) */}
        {fP > 0 && (
          <g opacity={fP} transform="translate(73, 110)">
            <rect
              x={0}
              y={0}
              width={6}
              height={16}
              rx={2}
              fill="#95FF00"
              fillOpacity={0.2}
              stroke="#95FF00"
              strokeWidth={1.5}
            />
            <line x1={3} y1={0} x2={3} y2={16} stroke="#95FF00" strokeWidth={1} />
            <line x1={0} y1={5} x2={6} y2={5} stroke="#95FF00" strokeWidth={1} />
            <line x1={0} y1={11} x2={6} y2={11} stroke="#95FF00" strokeWidth={1} />
          </g>
        )}

        {/* Dust Specks Bouncing Off Filter */}
        {fP > 0 &&
          dustSpecks.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={2}
              fill="#3A4640"
              stroke="#F4F1E5"
              strokeWidth={0.5}
              opacity={d.opacity}
            />
          ))}

        {/* Lung Protection Pulse (Cue 3: Protects) */}
        {pP > 0 && (
          <g opacity={pP * (0.55 + Math.sin(t * 5) * 0.35)}>
            <path
              d={leftLungPath}
              fill="none"
              stroke="#95FF00"
              strokeWidth={3 + Math.sin(t * 5) * 1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={rightLungPath}
              fill="none"
              stroke="#95FF00"
              strokeWidth={3 + Math.sin(t * 5) * 1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </g>

      {/* Rotating Snowflake Mark (Cold Air Incoming Outside Nose) */}
      <g transform={`translate(32, 118) rotate(${snowAngle})`}>
        {Array.from({ length: 6 }).map((_, i) => {
          const rad = (i * 60 * Math.PI) / 180;
          const x2 = Math.cos(rad) * 11;
          const y2 = Math.sin(rad) * 11;
          const bx1 = Math.cos(rad) * 7 + Math.cos(rad + Math.PI / 4) * 3;
          const by1 = Math.sin(rad) * 7 + Math.sin(rad + Math.PI / 4) * 3;
          const bx2 = Math.cos(rad) * 7 + Math.cos(rad - Math.PI / 4) * 3;
          const by2 = Math.sin(rad) * 7 + Math.sin(rad - Math.PI / 4) * 3;

          return (
            <g key={i}>
              <line
                x1={0}
                y1={0}
                x2={x2}
                y2={y2}
                stroke="#B8D7EA"
                strokeWidth={1.8}
                strokeLinecap="round"
              />
              <line
                x1={Math.cos(rad) * 7}
                y1={Math.sin(rad) * 7}
                x2={bx1}
                y2={by1}
                stroke="#B8D7EA"
                strokeWidth={1.4}
                strokeLinecap="round"
              />
              <line
                x1={Math.cos(rad) * 7}
                y1={Math.sin(rad) * 7}
                x2={bx2}
                y2={by2}
                stroke="#B8D7EA"
                strokeWidth={1.4}
                strokeLinecap="round"
              />
            </g>
          );
        })}
        <circle cx={0} cy={0} r={2} fill="#F4F1E5" />
      </g>
    </svg>
  );
};
