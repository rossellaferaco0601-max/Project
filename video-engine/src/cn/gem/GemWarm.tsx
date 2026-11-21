// Illustrazione scritta da Gemini (gemini-flash) su indicazioni di regia (work/ytcn26/gemini/prompt_GemWarm.txt); scritte e agganci in Elements10.
import React from "react";

export const GemWarm: React.FC<{ t: number; uid: string; cues: number[] }> = ({
  t,
  uid,
  cues,
}) => {
  const cue = (i: number) => cues[i] ?? Infinity;

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

  const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x, 0, 1), 3);

  const easeOutBack = (x: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    const n = clamp(x, 0, 1) - 1;
    return 1 + c3 * Math.pow(n, 3) + c1 * Math.pow(n, 2);
  };

  const parseHex = (hex: string): [number, number, number] => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];

  const lerpColor = (c1: string, c2: string, p: number) => {
    const [r1, g1, b1] = parseHex(c1);
    const [r2, g2, b2] = parseHex(c2);
    const tClamped = clamp(p, 0, 1);
    const r = Math.round(r1 + (r2 - r1) * tClamped);
    const g = Math.round(g1 + (g2 - g1) * tClamped);
    const b = Math.round(b1 + (b2 - b1) * tClamped);
    return `rgb(${r},${g},${b})`;
  };

  // Cues
  const c0 = cue(0);
  const c1 = cue(1);
  const c2 = cue(2);

  // Warmup transition (c1): 2.0s duration
  const warmProg = easeOut(clamp((t - c1) / 2.0, 0, 1));
  const activeColor = lerpColor("#B8D7EA", "#FFB020", warmProg);
  const auraColor = lerpColor("#B8D7EA", "#FF6B4A", warmProg);

  // Tremble / shivering intensity
  let trembleAmp = 0.8;
  if (t >= c0 && t < c1) {
    const ramp = easeOut(clamp((t - c0) / 0.5, 0, 1));
    trembleAmp = 0.8 + ramp * 2.2;
  } else if (t >= c1) {
    const fade = 1 - easeOut(clamp((t - c1) / 0.7, 0, 1));
    trembleAmp = 3.0 * fade;
  }
  const jitterX = Math.sin(t * 68) * trembleAmp;
  const jitterY = Math.cos(t * 54) * (trembleAmp * 0.4);

  // Clock progression
  const clockAngleDeg = warmProg * 120; // 0 to 120 deg (1/3 dial)
  const clockAngleRad = (clockAngleDeg * Math.PI) / 180;
  const clockCenter = { x: 150, y: 148 };
  const clockR = 98;

  // Clock hand end position
  const handEndX = clockCenter.x + 72 * Math.sin(clockAngleRad);
  const handEndY = clockCenter.y - 72 * Math.cos(clockAngleRad);

  // Clock swept arc path
  const arcEndX = clockCenter.x + clockR * Math.sin(clockAngleRad);
  const arcEndY = clockCenter.y - clockR * Math.cos(clockAngleRad);
  const largeArcFlag = clockAngleDeg > 180 ? 1 : 0;
  const arcPath =
    clockAngleDeg > 0.5
      ? `M ${clockCenter.x} ${clockCenter.y - clockR} A ${clockR} ${clockR} 0 ${largeArcFlag} 1 ${arcEndX} ${arcEndY}`
      : "";

  // Runner kinematics: continuous running cycle
  const runFreq = 2.2;
  const tc = t * runFreq * 2 * Math.PI;

  const hipX = 142 + jitterX;
  const hipY = 170 + Math.abs(Math.sin(tc)) * -7 + jitterY;
  const shoulderX = hipX + 14;
  const shoulderY = hipY - 44;
  const headX = shoulderX + 12;
  const headY = shoulderY - 20;

  // Leg kinematics helper
  const getLeg = (phase: number) => {
    const thigh = Math.sin(tc + phase) * 0.62 + 0.22;
    const kneeBend = Math.max(0, -Math.sin(tc + phase - 0.4)) * 1.35 + 0.25;
    const kneeX = hipX + Math.sin(thigh) * 31;
    const kneeY = hipY + Math.cos(thigh) * 31;
    const shinAngle = thigh - kneeBend;
    const ankleX = kneeX - Math.sin(shinAngle) * 30;
    const ankleY = kneeY + Math.cos(shinAngle) * 30;
    const footX = ankleX + 12;
    const footY = ankleY + 4;
    return { kneeX, kneeY, ankleX, ankleY, footX, footY };
  };

  // Arm kinematics helper
  const getArm = (phase: number) => {
    const upper = -Math.sin(tc + phase) * 0.58 + 0.35;
    const elbowX = shoulderX + Math.sin(upper) * 24;
    const elbowY = shoulderY + Math.cos(upper) * 24;
    const forearmAngle = upper + 1.25;
    const handX = elbowX + Math.sin(forearmAngle) * 22;
    const handY = elbowY - Math.cos(forearmAngle) * 22;
    return { elbowX, elbowY, handX, handY };
  };

  const farLeg = getLeg(Math.PI);
  const nearLeg = getLeg(0);
  const farArm = getArm(0);
  const nearArm = getArm(Math.PI);

  // Checkmark popup at cue(2)
  const checkScale = t >= c2 ? easeOutBack(clamp((t - c2) / 0.55, 0, 1)) : 0;

  // Heat waves rising from back
  const heatOpacity = clamp((warmProg - 0.25) / 0.75, 0, 0.85);

  // Shiver lines before warm
  const shiverOpacity = clamp(trembleAmp / 2.5, 0, 1) * (1 - warmProg);

  // Idle breath for aura
  const auraPulse = Math.sin(t * 3.5) * 6;

  return (
    <svg
      viewBox="0 0 300 300"
      width={300}
      height={300}
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id={`${uid}-aura`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={auraColor} stopOpacity="0.45" />
          <stop offset="60%" stopColor={auraColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={auraColor} stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* CLOCK DIAL (Behind Runner) */}
      <circle
        cx={clockCenter.x}
        cy={clockCenter.y}
        r={clockR}
        fill="none"
        stroke="#F4F1E5"
        strokeWidth="2.5"
        strokeOpacity="0.32"
      />

      {/* Clock 12 ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const rad = (i * 30 * Math.PI) / 180;
        const x1 = clockCenter.x + (clockR - 4) * Math.sin(rad);
        const y1 = clockCenter.y - (clockR - 4) * Math.cos(rad);
        const x2 = clockCenter.x + (clockR - 12) * Math.sin(rad);
        const y2 = clockCenter.y - (clockR - 12) * Math.cos(rad);
        const isMajor = i % 3 === 0;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#F4F1E5"
            strokeWidth={isMajor ? 3 : 1.5}
            strokeOpacity={isMajor ? 0.75 : 0.35}
            strokeLinecap="round"
          />
        );
      })}

      {/* Clock Swept Lime Arc */}
      {arcPath && (
        <path
          d={arcPath}
          fill="none"
          stroke="#95FF00"
          strokeWidth="6"
          strokeLinecap="round"
          filter={`url(#${uid}-glow)`}
        />
      )}

      {/* Clock Hand */}
      <line
        x1={clockCenter.x}
        y1={clockCenter.y}
        x2={handEndX}
        y2={handEndY}
        stroke={warmProg > 0.05 ? "#95FF00" : "#F4F1E5"}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle
        cx={clockCenter.x}
        cy={clockCenter.y}
        r="5.5"
        fill="#F4F1E5"
      />

      {/* AURA (from cue(2) or warm glow) */}
      {t >= c2 && (
        <circle
          cx={hipX + 5}
          cy={hipY - 20}
          r={78 + auraPulse}
          fill={`url(#${uid}-aura)`}
        />
      )}

      {/* HEAT WAVES (Rising from back) */}
      {heatOpacity > 0.02 &&
        [-18, -4, 10].map((offsetX, idx) => {
          const wavePhase = (t * 2.2 + idx * 0.45) % 1;
          const startY = shoulderY + 8 - wavePhase * 36;
          const curY = startY;
          const curX = shoulderX + offsetX - 16;
          const waveAmp = Math.sin(t * 8 + idx * 2) * 4;
          return (
            <path
              key={idx}
              d={`M ${curX} ${curY} Q ${curX + waveAmp} ${curY - 14} ${curX} ${curY - 28}`}
              fill="none"
              stroke="#FF6B4A"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeOpacity={heatOpacity * (1 - wavePhase)}
            />
          );
        })}

      {/* SNOWFLAKES (Before / during freezing) */}
      {1 - warmProg > 0.05 &&
        [
          { x0: 50, speed: 38, y0: 45, r: 2.8 },
          { x0: 95, speed: 45, y0: 110, r: 3.5 },
          { x0: 215, speed: 32, y0: 80, r: 2.2 },
          { x0: 260, speed: 42, y0: 160, r: 3.0 },
        ].map((flake, idx) => {
          const fx = ((flake.x0 - t * flake.speed) % 270) + 15;
          const fy = ((flake.y0 + t * 18 + Math.sin(t * 3 + idx) * 8) % 260) + 20;
          return (
            <g
              key={idx}
              transform={`translate(${fx}, ${fy})`}
              opacity={(1 - warmProg) * 0.85}
            >
              <circle cx="0" cy="0" r={flake.r} fill="#B8D7EA" />
              <line x1="-4" y1="0" x2="4" y2="0" stroke="#B8D7EA" strokeWidth="1" />
              <line x1="0" y1="-4" x2="0" y2="4" stroke="#B8D7EA" strokeWidth="1" />
            </g>
          );
        })}

      {/* SHIVER MARKS (Around runner shoulders) */}
      {shiverOpacity > 0.05 && (
        <g opacity={shiverOpacity} stroke="#B8D7EA" strokeWidth="2.5" strokeLinecap="round">
          <path
            d={`M ${shoulderX - 22 + jitterX} ${shoulderY - 12} l 4 4 l -4 4 l 4 4`}
            fill="none"
          />
          <path
            d={`M ${shoulderX - 28 + jitterX * 0.8} ${shoulderY + 6} l 3 3 l -3 3 l 3 3`}
            fill="none"
          />
          <path
            d={`M ${shoulderX + 22 - jitterX} ${shoulderY - 16} l -4 4 l 4 4 l -4 4`}
            fill="none"
          />
        </g>
      )}

      {/* RUNNER FIGURE */}
      {/* 1. Far Leg (Back) */}
      <path
        d={`M ${hipX} ${hipY} L ${farLeg.kneeX} ${farLeg.kneeY} L ${farLeg.ankleX} ${farLeg.ankleY}`}
        fill="none"
        stroke="#F4F1E5"
        strokeWidth="23"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${hipX} ${hipY} L ${farLeg.kneeX} ${farLeg.kneeY} L ${farLeg.ankleX} ${farLeg.ankleY}`}
        fill="none"
        stroke="#27312C"
        strokeWidth="19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={farLeg.footX}
        cy={farLeg.footY}
        r="8"
        fill="#95FF00"
      />

      {/* 2. Far Arm (Back) */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${farArm.elbowX} ${farArm.elbowY} L ${farArm.handX} ${farArm.handY}`}
        fill="none"
        stroke="#F4F1E5"
        strokeWidth="21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${shoulderX} ${shoulderY} L ${farArm.elbowX} ${farArm.elbowY} L ${farArm.handX} ${farArm.handY}`}
        fill="none"
        stroke="#27312C"
        strokeWidth="17"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={farArm.handX} cy={farArm.handY} r="7" fill="#E7B899" />

      {/* 3. Torso (Running Suit with Temperature-Tinted Accent) */}
      <line
        x1={hipX}
        y1={hipY}
        x2={shoulderX}
        y2={shoulderY}
        stroke="#F4F1E5"
        strokeWidth="26"
        strokeLinecap="round"
      />
      <line
        x1={hipX}
        y1={hipY}
        x2={shoulderX}
        y2={shoulderY}
        stroke="#3A4640"
        strokeWidth="22"
        strokeLinecap="round"
      />
      {/* Dynamic Chest Warmth Core */}
      <line
        x1={hipX * 0.45 + shoulderX * 0.55}
        y1={hipY * 0.45 + shoulderY * 0.55}
        x2={shoulderX}
        y2={shoulderY}
        stroke={activeColor}
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* 4. Head & Beanie */}
      <circle
        cx={headX}
        cy={headY}
        r="15"
        fill="#E7B899"
        stroke="#F4F1E5"
        strokeWidth="2"
      />
      {/* Running Beanie: adapts colour to temperature */}
      <path
        d={`M ${headX - 14} ${headY - 2} A 15 15 0 0 1 ${headX + 13} ${headY - 6} L ${headX + 11} ${headY - 14} A 15 15 0 0 0 ${headX - 12} ${headY - 10} Z`}
        fill={activeColor}
      />

      {/* 5. Near Leg (Front) */}
      <path
        d={`M ${hipX} ${hipY} L ${nearLeg.kneeX} ${nearLeg.kneeY} L ${nearLeg.ankleX} ${nearLeg.ankleY}`}
        fill="none"
        stroke="#F4F1E5"
        strokeWidth="23"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${hipX} ${hipY} L ${nearLeg.kneeX} ${nearLeg.kneeY} L ${nearLeg.ankleX} ${nearLeg.ankleY}`}
        fill="none"
        stroke="#3A4640"
        strokeWidth="19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Side leg speed stripe */}
      <path
        d={`M ${hipX + 1} ${hipY} L ${nearLeg.kneeX + 1} ${nearLeg.kneeY}`}
        fill="none"
        stroke={activeColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Running shoe */}
      <path
        d={`M ${nearLeg.ankleX - 4} ${nearLeg.ankleY + 4} L ${nearLeg.footX + 4} ${nearLeg.footY + 4}`}
        stroke="#95FF00"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* 6. Near Arm (Front) */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${nearArm.elbowX} ${nearArm.elbowY} L ${nearArm.handX} ${nearArm.handY}`}
        fill="none"
        stroke="#F4F1E5"
        strokeWidth="21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${shoulderX} ${shoulderY} L ${nearArm.elbowX} ${nearArm.elbowY} L ${nearArm.handX} ${nearArm.handY}`}
        fill="none"
        stroke="#3A4640"
        strokeWidth="17"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1={shoulderX}
        y1={shoulderY}
        x2={nearArm.elbowX}
        y2={nearArm.elbowY}
        stroke={activeColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx={nearArm.handX} cy={nearArm.handY} r="7.5" fill="#E7B899" />

      {/* CHECKMARK POPUP (Cue 2: Dressed Right) */}
      {checkScale > 0.01 && (
        <g
          transform={`translate(244, 52) scale(${checkScale})`}
          filter={`url(#${uid}-glow)`}
        >
          <circle cx="0" cy="0" r="22" fill="#95FF00" />
          <path
            d="M -9 0 L -3 6 L 10 -7"
            fill="none"
            stroke="#0B0F0A"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
};
