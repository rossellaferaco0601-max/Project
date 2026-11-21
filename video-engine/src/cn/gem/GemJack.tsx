// Illustrazione scritta da Gemini (gemini-flash) su indicazioni di regia (work/ytcn26/gemini/prompt_GemJack.txt); scritte e agganci in Elements10.
import React from "react";

export const GemJack: React.FC<{ t: number; uid: string; cues: number[] }> = ({ t, uid, cues }) => {
  const cue = (i: number) => (cues[i] ?? Infinity);
  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
  const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
  const easeOut = (v: number) => 1 - Math.pow(1 - clamp(v, 0, 1), 3);
  const easeOutBack = (v: number) => {
    const x = clamp(v, 0, 1);
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  };

  const p0 = easeOut((t - cue(0)) / 0.5);
  const p1 = easeOut((t - cue(1)) / 0.5);
  const p2 = easeOut((t - cue(2)) / 0.6);
  const p3 = easeOutBack((t - cue(3)) / 0.5);
  const p4 = easeOutBack((t - cue(4)) / 0.4);
  const p5 = easeOutBack((t - cue(5)) / 0.4);

  const jjSpeed = 1.3 * 2 * Math.PI;
  const rawPhase = Math.sin(t * jjSpeed);
  const activePhase = (rawPhase + 1) / 2;

  const legSpread = lerp(lerp(4, 26, activePhase), 8, p2);
  const armAngleDeg = lerp(lerp(18, 155, activePhase), 12, p2);
  const jumpHeight = lerp(Math.max(0, rawPhase) * 16, Math.abs(Math.sin(t * 3)) * 3, p2);
  const breath = Math.sin(t * 4) * 1.5;

  const groundY = 255;
  const hipY = 165 - jumpHeight + breath;
  const hipX = 150;

  const headY = hipY - 68;
  const headX = 150;

  const legRad = (legSpread * Math.PI) / 180;
  const lAnkleX = hipX - 14 - Math.sin(legRad) * 65;
  const rAnkleX = hipX + 14 + Math.sin(legRad) * 65;
  const ankleY = groundY - jumpHeight;

  const lKneeX = (hipX - 14 + lAnkleX) / 2 - 4;
  const rKneeX = (hipX + 14 + rAnkleX) / 2 + 4;
  const kneeY = (hipY + 20 + ankleY) / 2;

  const shoulderY = hipY - 38;
  const lShoulderX = hipX - 22;
  const rShoulderX = hipX + 22;

  const armRad = (armAngleDeg * Math.PI) / 180;
  const armLen1 = 30;
  const armLen2 = 28;

  const lElbowX = lShoulderX - Math.sin(armRad) * armLen1;
  const lElbowY = shoulderY + Math.cos(armRad) * armLen1;
  const lHandX = lElbowX - Math.sin(armRad * 0.9) * armLen2;
  const lHandY = lElbowY + Math.cos(armRad * 0.9) * armLen2;

  const rElbowX = rShoulderX + Math.sin(armRad) * armLen1;
  const rElbowY = shoulderY + Math.cos(armRad) * armLen1;
  const rHandX = rElbowX + Math.sin(armRad * 0.9) * armLen2;
  const rHandY = rElbowY + Math.cos(armRad * 0.9) * armLen2;

  const auraRadius = 85 + Math.sin(t * 5) * 4;

  const springCompress = 1 - (jumpHeight / 16) * 0.4;
  const renderSpring = (cx: number, cy: number) => {
    const h = 22 * springCompress;
    const w = 10;
    const pts = [
      `${cx},${cy - h / 2}`,
      `${cx - w},${cy - h / 4}`,
      `${cx + w},${cy}`,
      `${cx - w},${cy + h / 4}`,
      `${cx},${cy + h / 2}`,
    ].join(" ");
    return (
      <polyline
        points={pts}
        fill="none"
        stroke="#95FF00"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  const impactPulse = Math.max(0, -rawPhase) * p1;

  const dt2 = Math.max(0, t - cue(2));
  const sweat1X = headX - 24 - dt2 * 35;
  const sweat1Y = headY - 10 - dt2 * 10 + dt2 * dt2 * 60;
  const sweat2X = headX + 26 + dt2 * 40;
  const sweat2Y = headY - 15 - dt2 * 8 + dt2 * dt2 * 60;

  const auraGradId = `${uid}-auraGrad`;
  const jacketGradId = `${uid}-jacketGrad`;

  return (
    <svg viewBox="0 0 300 300" width={300} height={300} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={auraGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB020" stopOpacity={0.85 * p0} />
          <stop offset="60%" stopColor="#FF6B4A" stopOpacity={0.4 * p0} />
          <stop offset="100%" stopColor="#FF6B4A" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={jacketGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4F1E5" />
          <stop offset="100%" stopColor="#E2DFCFC" />
        </linearGradient>
      </defs>

      {/* Floor Line */}
      <line x1={30} y1={groundY + 12} x2={270} y2={groundY + 12} stroke="#49762E" strokeWidth={4} strokeLinecap="round" opacity={0.6} />

      {/* Cue 0: Warm Aura */}
      {p0 > 0 && (
        <circle
          cx={150}
          cy={hipY - 20}
          r={auraRadius * p0}
          fill={`url(#${auraGradId})`}
        />
      )}

      {/* Body Shadows / Grounding */}
      <ellipse
        cx={150}
        cy={groundY + 12}
        rx={lerp(50, 25, jumpHeight / 16)}
        ry={6}
        fill="#0B0F0A"
        opacity={0.3}
      />

      {/* Figure Group */}
      <g>
        {/* Legs Outline (Cream 2px border effect) */}
        <path
          d={`M ${hipX - 14} ${hipY + 10} Q ${lKneeX} ${kneeY} ${lAnkleX} ${ankleY}`}
          fill="none"
          stroke="#F4F1E5"
          strokeWidth={24}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M ${hipX + 14} ${hipY + 10} Q ${rKneeX} ${kneeY} ${rAnkleX} ${ankleY}`}
          fill="none"
          stroke="#F4F1E5"
          strokeWidth={24}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Legs Core (Pants) */}
        <path
          d={`M ${hipX - 14} ${hipY + 10} Q ${lKneeX} ${kneeY} ${lAnkleX} ${ankleY}`}
          fill="none"
          stroke="#3A4640"
          strokeWidth={20}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M ${hipX + 14} ${hipY + 10} Q ${rKneeX} ${kneeY} ${rAnkleX} ${ankleY}`}
          fill="none"
          stroke="#3A4640"
          strokeWidth={20}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Arms Outline */}
        <path
          d={`M ${lShoulderX} ${shoulderY} L ${lElbowX} ${lElbowY} L ${lHandX} ${lHandY}`}
          fill="none"
          stroke="#F4F1E5"
          strokeWidth={22}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M ${rShoulderX} ${shoulderY} L ${rElbowX} ${rElbowY} L ${rHandX} ${rHandY}`}
          fill="none"
          stroke="#F4F1E5"
          strokeWidth={22}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Arms Core */}
        <path
          d={`M ${lShoulderX} ${shoulderY} L ${lElbowX} ${lElbowY} L ${lHandX} ${lHandY}`}
          fill="none"
          stroke={p3 > 0.1 ? "#F4F1E5" : "#3A4640"}
          strokeWidth={18}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M ${rShoulderX} ${shoulderY} L ${rElbowX} ${rElbowY} L ${rHandX} ${rHandY}`}
          fill="none"
          stroke={p3 > 0.1 ? "#F4F1E5" : "#3A4640"}
          strokeWidth={18}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Torso */}
        <path
          d={`M ${hipX - 18} ${hipY + 10} L ${hipX + 18} ${hipY + 10} L ${rShoulderX} ${shoulderY} L ${lShoulderX} ${shoulderY} Z`}
          fill="#3A4640"
          stroke="#F4F1E5"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Cue 3: Windproof Jacket */}
        {p3 > 0 && (
          <g transform={`scale(${p3})`} style={{ transformOrigin: `150px ${hipY - 15}px` }}>
            <path
              d={`M ${hipX - 20} ${hipY + 12} L ${hipX + 20} ${hipY + 12} L ${rShoulderX + 2} ${shoulderY - 2} L ${lShoulderX - 2} ${shoulderY - 2} Z`}
              fill={`url(#${jacketGradId})`}
              stroke="#F4F1E5"
              strokeWidth={2}
              strokeLinejoin="round"
            />
            {/* Lime Zip */}
            <line x1={150} y1={shoulderY - 2} x2={150} y2={hipY + 12} stroke="#95FF00" strokeWidth={3.5} strokeLinecap="round" />
            {/* Jacket Collar */}
            <path d={`M ${150 - 10} ${shoulderY - 2} L 150 ${shoulderY + 6} L ${150 + 10} ${shoulderY - 2}`} fill="none" stroke="#95FF00" strokeWidth={2} />
          </g>
        )}

        {/* Head */}
        <circle cx={headX} cy={headY} r={18} fill="#E7B899" stroke="#F4F1E5" strokeWidth={2} />

        {/* Cue 5: Headband */}
        {p5 > 0 && (
          <g transform={`scale(${p5})`} style={{ transformOrigin: `${headX}px ${headY - 4}px` }}>
            <rect x={headX - 18} y={headY - 10} width={36} height={10} rx={4} fill="#95FF00" />
            <circle cx={headX} cy={headY - 5} r={3} fill="#49762E" />
          </g>
        )}

        {/* Hands */}
        <circle cx={lHandX} cy={lHandY} r={8} fill={p4 > 0.1 ? "#95FF00" : "#E7B899"} stroke="#F4F1E5" strokeWidth={2} />
        <circle cx={rHandX} cy={rHandY} r={8} fill={p4 > 0.1 ? "#95FF00" : "#E7B899"} stroke="#F4F1E5" strokeWidth={2} />
      </g>

      {/* Cue 1: Tendon Springs & Flashes */}
      {p1 > 0 && (
        <g opacity={p1}>
          <g transform={`translate(${lAnkleX}, ${ankleY - 6})`}>
            {renderSpring(0, 0)}
            {impactPulse > 0.1 && (
              <circle cx={0} cy={6} r={12 * impactPulse} fill="none" stroke="#95FF00" strokeWidth={2} opacity={1 - impactPulse} />
            )}
          </g>
          <g transform={`translate(${rAnkleX}, ${ankleY - 6})`}>
            {renderSpring(0, 0)}
            {impactPulse > 0.1 && (
              <circle cx={0} cy={6} r={12 * impactPulse} fill="none" stroke="#95FF00" strokeWidth={2} opacity={1 - impactPulse} />
            )}
          </g>
        </g>
      )}

      {/* Cue 2: Sweat droplets flying off */}
      {p2 > 0 && dt2 < 1.2 && (
        <g>
          <circle cx={sweat1X} cy={sweat1Y} r={3.5} fill="#B8D7EA" opacity={clamp(1 - dt2 / 1.2, 0, 1)} />
          <circle cx={sweat2X} cy={sweat2Y} r={4} fill="#B8D7EA" opacity={clamp(1 - dt2 / 1.2, 0, 1)} />
        </g>
      )}

      {/* Cue 2: Top Right Checkmark Badge */}
      {p2 > 0 && (
        <g transform={`translate(242, 52) scale(${p2})`} style={{ transformOrigin: "242px 52px" }}>
          <circle cx={0} cy={0} r={22} fill="#95FF00" stroke="#F4F1E5" strokeWidth={2.5} />
          <path
            d="M -8 1 L -2 7 L 9 -5"
            fill="none"
            stroke="#0B0F0A"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
};
