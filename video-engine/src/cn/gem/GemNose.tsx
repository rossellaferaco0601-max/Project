import React from "react";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function lerpColor(
  c1: [number, number, number],
  c2: [number, number, number],
  f: number
): string {
  const factor = Math.max(0, Math.min(1, f));
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * factor);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * factor);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

function cubicBezier(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  s: number
): { x: number; y: number } {
  const t = Math.max(0, Math.min(1, s));
  const cx = 3 * (p1.x - p0.x);
  const bx = 3 * (p2.x - p1.x) - cx;
  const ax = p3.x - p0.x - cx - bx;

  const cy = 3 * (p1.y - p0.y);
  const by = 3 * (p2.y - p1.y) - cy;
  const ay = p3.y - p0.y - cy - by;

  const x = ax * t * t * t + bx * t * t + cx * t + p0.x;
  const y = ay * t * t * t + by * t * t + cy * t + p0.y;
  return { x, y };
}

function getAirwayPoint(u: number): { x: number; y: number } {
  const normU = Math.max(0, Math.min(1, u));

  if (normU < 0.3) {
    const s = normU / 0.3;
    return cubicBezier(
      { x: 35, y: 144 },
      { x: 80, y: 144 },
      { x: 130, y: 144 },
      { x: 168, y: 144 },
      s
    );
  } else if (normU < 0.6) {
    const s = (normU - 0.3) / 0.3;
    return cubicBezier(
      { x: 168, y: 144 },
      { x: 198, y: 144 },
      { x: 228, y: 110 },
      { x: 246, y: 125 },
      s
    );
  } else {
    const s = (normU - 0.6) / 0.4;
    return cubicBezier(
      { x: 246, y: 125 },
      { x: 258, y: 135 },
      { x: 254, y: 195 },
      { x: 254, y: 270 },
      s
    );
  }
}

export const GemNose: React.FC<{
  t: number;
  labels: [string, string, string];
  cues: [number, number, number];
}> = ({ t, labels, cues }) => {
  const fontStyle: React.CSSProperties = {
    fontFamily: "Blinker, sans-serif",
    fontWeight: 900,
  };

  const COLD_RGB: [number, number, number] = [184, 215, 234];
  const WARM1_RGB: [number, number, number] = [255, 176, 32];
  const WARM2_RGB: [number, number, number] = [255, 107, 74];

  const numParticles = 18;
  const particles = Array.from({ length: numParticles }).map((_, i) => {
    const phase = i / numParticles;
    const u = (t * 0.32 + phase) % 1.0;
    const pos = getAirwayPoint(u);

    let color: string;
    if (u < 0.3) {
      color = lerpColor(COLD_RGB, WARM1_RGB, (u / 0.3) * 0.25);
    } else if (u < 0.65) {
      color = lerpColor(COLD_RGB, WARM1_RGB, 0.25 + ((u - 0.3) / 0.35) * 0.75);
    } else {
      color = lerpColor(WARM1_RGB, WARM2_RGB, (u - 0.65) / 0.35);
    }

    const radius = lerp(3.2, 6.5, u);
    const opacity = u < 0.06 ? u / 0.06 : u > 0.92 ? (1 - u) / 0.08 : 1;

    const trailPos = getAirwayPoint(Math.max(0, u - 0.025));

    return { pos, trailPos, color, radius, opacity, u };
  });

  let activeIndex = -1;
  for (let k = 0; k < 3; k++) {
    if (t >= cues[k]) {
      activeIndex = k;
    }
  }

  const lungPulse = 0.2 + 0.12 * Math.sin(t * 3.5);

  return (
    <svg viewBox="0 0 880 330" width={880} height={330}>
      <defs>
        <filter id="glow-warm" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-dot" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="airway-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B8D7EA" stopOpacity={0.15} />
          <stop offset="50%" stopColor="#FFB020" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#FF6B4A" stopOpacity={0.25} />
        </linearGradient>
      </defs>

      {/* Main Panel Background */}
      <rect
        x="0"
        y="0"
        width="880"
        height="330"
        rx="30"
        fill="#0B0F0A"
        fillOpacity={0.9}
      />

      {/* LEFT SECTION: Human Profile Silhouette & Airway */}
      <g>
        {/* Soft Glowing Lungs */}
        <g opacity={lungPulse} filter="url(#glow-warm)">
          {/* Left Lung */}
          <path
            d="M 252 262 C 238 262, 218 268, 212 284 C 208 296, 226 304, 242 296 C 250 292, 252 276, 252 262 Z"
            fill="#FF6B4A"
          />
          {/* Right Lung */}
          <path
            d="M 256 262 C 270 262, 290 268, 296 284 C 300 296, 282 304, 266 296 C 258 292, 256 276, 256 262 Z"
            fill="#FF6B4A"
          />
        </g>

        {/* Airway Internal Channel Guide */}
        <path
          d="M 35 144 L 168 144 C 198 144, 228 110, 246 125 C 258 135, 254 195, 254 270"
          fill="none"
          stroke="url(#airway-grad)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Human Head & Neck Side-Profile Silhouette */}
        <path
          d="M 230 35 C 195 35, 182 60, 178 88 C 176 96, 170 106, 163 112 C 153 122, 140 126, 138 130 C 137 136, 155 144, 168 144 C 176 144, 178 150, 182 153 C 176 156, 175 158, 176 160 C 182 163, 182 168, 178 173 C 172 182, 170 195, 180 205 C 195 218, 220 228, 225 245 L 225 304 L 335 304 C 335 250, 348 175, 325 105 C 305 45, 260 35, 230 35 Z"
          fill="#F4F1E5"
          fillOpacity={0.16}
          stroke="#F4F1E5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Animated Particles flowing through airway */}
        {particles.map((p, idx) => (
          <g key={idx} opacity={p.opacity}>
            {/* Motion streak line */}
            <line
              x1={p.trailPos.x}
              y1={p.trailPos.y}
              x2={p.pos.x}
              y2={p.pos.y}
              stroke={p.color}
              strokeWidth={p.radius * 1.5}
              strokeLinecap="round"
              opacity={0.5}
            />
            {/* Main particle head */}
            <circle
              cx={p.pos.x}
              cy={p.pos.y}
              r={p.radius}
              fill={p.color}
              filter={p.u > 0.4 ? "url(#glow-warm)" : undefined}
            />
          </g>
        ))}

        {/* Far-left Snowflake Mark (Rotating 6-line asterisk) */}
        <g transform={`translate(42, 144) rotate(${(t * 40) % 360})`}>
          {[0, 60, 120].map((angle) => (
            <line
              key={angle}
              x1="-9"
              y1="0"
              x2="9"
              y2="0"
              transform={`rotate(${angle})`}
              stroke="#B8D7EA"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <circle
              key={angle}
              cx={7.5 * Math.cos((angle * Math.PI) / 180)}
              cy={7.5 * Math.sin((angle * Math.PI) / 180)}
              r="1"
              fill="#B8D7EA"
            />
          ))}
        </g>
      </g>

      {/* RIGHT SECTION: 3 Rows of Labels */}
      <g transform="translate(480, 0)">
        {labels.map((label, i) => {
          const rowY = 75 + i * 90;
          const dt = t - cues[i];
          const hasAppeared = dt >= 0;

          const progress = hasAppeared ? Math.min(1, dt / 0.35) : 0;
          const ease = 1 - Math.pow(1 - progress, 3);

          const slideX = (1 - ease) * 30;
          const opacity = ease;

          const isLatest = i === activeIndex;
          const isPast = i < activeIndex;

          let dotFill = "#2A363F";
          let dotRadius = 7;
          let textColor = "#4A5568";

          if (isLatest) {
            dotFill = "#95FF00";
            dotRadius = 9;
            textColor = "#FFFFFF";
          } else if (isPast) {
            dotFill = "#52606D";
            dotRadius = 7;
            textColor = "#D0D7DE";
          } else if (hasAppeared) {
            dotFill = "#95FF00";
            dotRadius = 9;
            textColor = "#FFFFFF";
          }

          return (
            <g
              key={i}
              transform={`translate(${slideX}, ${rowY})`}
              opacity={opacity}
            >
              {/* Icon Dot */}
              <circle
                cx="24"
                cy="0"
                r={dotRadius}
                fill={dotFill}
                filter={isLatest ? "url(#glow-dot)" : undefined}
              />
              {isLatest && (
                <circle
                  cx="24"
                  cy="0"
                  r={dotRadius + 4}
                  fill="none"
                  stroke="#95FF00"
                  strokeWidth="1.5"
                  opacity={0.5 + 0.3 * Math.sin(t * 6)}
                />
              )}

              {/* Label Text */}
              <text
                x="50"
                y="0"
                fill={textColor}
                fontSize="44"
                dominantBaseline="central"
                style={fontStyle}
              >
                {label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
