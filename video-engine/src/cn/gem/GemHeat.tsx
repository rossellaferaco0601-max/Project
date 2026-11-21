// Illustrazione scritta da Gemini (gemini-flash) su indicazioni di regia (work/ytcn26/gemini/prompt_GemHeat.txt); scritte e agganci in Elements10.
import React from "react";

export const GemHeat: React.FC<{ t: number; uid: string; cues: number[] }> = ({ t, uid, cues }) => {
  const cue = (i: number) => (cues[i] ?? Infinity);

  const clamp = (v: number, min: number = 0, max: number = 1) => Math.min(Math.max(v, min), max);
  const easeOut = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
  const lerp = (a: number, b: number, factor: number) => a + (b - a) * factor;

  const lerpColor = (c1: [number, number, number], c2: [number, number, number], f: number): string => {
    const factor = clamp(f);
    const r = Math.round(lerp(c1[0], c2[0], factor));
    const g = Math.round(lerp(c1[1], c2[1], factor));
    const b = Math.round(lerp(c1[2], c2[2], factor));
    return `rgb(${r},${g},${b})`;
  };

  const p0 = easeOut((t - cue(0)) / 0.5);
  const p1 = easeOut((t - cue(1)) / 0.5);
  const p2 = easeOut((t - cue(2)) / 0.45);
  const p3 = easeOut((t - cue(3)) / 0.45);
  const p4 = easeOut((t - cue(4)) / 0.55);

  const bob = Math.sin(t * 3.2) * 1.8;
  const breath = Math.sin(t * 2.4) * 1.5;

  // Colors
  const RGB_SKIN: [number, number, number] = [231, 184, 153];
  const RGB_ICE: [number, number, number] = [184, 215, 234];

  // Coldness states
  const handColdness = clamp(p1 - p2);
  const headColdness = clamp(p1 * (1 - p3 * 0.85) * (1 - p4));

  const handColor = lerpColor(RGB_SKIN, RGB_ICE, handColdness);
  const headColor = lerpColor(RGB_SKIN, RGB_ICE, headColdness);

  // Core sizing
  const coreBase = 1 - 0.28 * p1 + 0.38 * p4;
  const coreScale = coreBase + breath * 0.04;

  // Joint and landmark positions
  const headX = 150;
  const headY = 66 + bob;

  const neckTopY = 86 + bob;
  const neckBottomY = 98 + bob;

  const lShoulder = { x: 114, y: 104 + bob };
  const rShoulder = { x: 186, y: 104 + bob };

  const lElbow = { x: 86, y: 140 + bob };
  const rElbow = { x: 214, y: 140 + bob };

  const lHand = { x: 64, y: 178 + bob };
  const rHand = { x: 236, y: 178 + bob };

  // Heat emission factor
  const headHeatAmount = clamp(p1 * (1 - p3 * 0.8) * (1 - p4));
  const handHeatAmount = clamp(p1 * (1 - p2));

  // Pulse effect (cue 0)
  const ringScale = 1 + ((t * 2.5) % 1) * 0.45;
  const ringOpacity = p0 * (1 - ((t * 2.5) % 1)) * (1 - p1 * 0.7);

  // Heat wave helper (parametric drifting wave)
  const renderWave = (startX: number, startY: number, angleDeg: number, seed: number, power: number) => {
    if (power <= 0.01) return null;
    const rad = (angleDeg * Math.PI) / 180;
    const progress = ((t * 1.2 + seed) % 1);
    const dist = progress * 42;
    const cx = startX + Math.cos(rad) * dist + Math.sin(t * 6 + seed * 4) * 4;
    const cy = startY + Math.sin(rad) * dist - progress * 10;
    const r = 2.5 + progress * 4;
    const alpha = (1 - progress) * power * 0.85;

    return (
      <circle
        key={`h-${seed}`}
        cx={cx}
        cy={cy}
        r={r}
        fill={progress > 0.5 ? "#FFB020" : "#FF6B4A"}
        opacity={alpha}
      />
    );
  };

  return (
    <svg viewBox="0 0 300 300" width={300} height={300} style={{ overflow: "visible" }}>
      <defs>
        {/* Core Warm Glow */}
        <radialGradient id={`${uid}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB020" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#FF6B4A" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FF6B4A" stopOpacity="0" />
        </radialGradient>

        {/* Aura gradient after hat */}
        <radialGradient id={`${uid}-aura`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB020" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#FF6B4A" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FF6B4A" stopOpacity="0" />
        </radialGradient>

        {/* Core Heat Filter */}
        <filter id={`${uid}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Cue 4 Soft Breathing Aura */}
      {p4 > 0 && (
        <circle
          cx={150}
          cy={145 + bob}
          r={(105 + Math.sin(t * 3) * 6) * p4}
          fill={`url(#${uid}-aura)`}
        />
      )}

      {/* Pulsing Highlight Rings from Cue 0 */}
      {p0 > 0 && ringOpacity > 0.02 && (
        <g stroke="#95FF00" strokeWidth="2.5" fill="none" opacity={ringOpacity}>
          <circle cx={headX} cy={headY} r={24 * ringScale} />
          <circle cx={lHand.x} cy={lHand.y} r={14 * ringScale} />
          <circle cx={rHand.x} cy={rHand.y} r={14 * ringScale} />
        </g>
      )}

      {/* Heat Escape Waves: Head */}
      {headHeatAmount > 0.01 && (
        <g>
          {renderWave(headX - 10, headY - 22, -90, 0.1, headHeatAmount)}
          {renderWave(headX, headY - 25, -90, 0.45, headHeatAmount)}
          {renderWave(headX + 10, headY - 22, -90, 0.78, headHeatAmount)}
          {renderWave(headX - 16, headY - 14, -110, 0.3, headHeatAmount * 0.7)}
          {renderWave(headX + 16, headY - 14, -70, 0.65, headHeatAmount * 0.7)}
        </g>
      )}

      {/* Heat Escape Waves: Hands */}
      {handHeatAmount > 0.01 && (
        <g>
          {renderWave(lHand.x, lHand.y, -120, 0.2, handHeatAmount)}
          {renderWave(lHand.x, lHand.y, -150, 0.55, handHeatAmount)}
          {renderWave(lHand.x, lHand.y, -80, 0.85, handHeatAmount)}
          {renderWave(rHand.x, rHand.y, -60, 0.35, handHeatAmount)}
          {renderWave(rHand.x, rHand.y, -30, 0.7, handHeatAmount)}
          {renderWave(rHand.x, rHand.y, -100, 0.95, handHeatAmount)}
        </g>
      )}

      {/* LEGS (Thighs to mid-thigh) */}
      <g strokeLinecap="round">
        {/* Left Thigh Base Outline & Cloth */}
        <line x1={133} y1={188 + bob} x2={127} y2={242 + bob} stroke="#F4F1E5" strokeWidth="24" />
        <line x1={133} y1={188 + bob} x2={127} y2={242 + bob} stroke="#3A4640" strokeWidth="20" />
        {/* Right Thigh Base Outline & Cloth */}
        <line x1={167} y1={188 + bob} x2={173} y2={242 + bob} stroke="#F4F1E5" strokeWidth="24" />
        <line x1={167} y1={188 + bob} x2={173} y2={242 + bob} stroke="#3A4640" strokeWidth="20" />
      </g>

      {/* ARMS - Under layer (outline) */}
      <g stroke="#F4F1E5" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={`M ${lShoulder.x} ${lShoulder.y} L ${lElbow.x} ${lElbow.y} L ${lHand.x} ${lHand.y}`} />
        <path d={`M ${rShoulder.x} ${rShoulder.y} L ${rElbow.x} ${rElbow.y} L ${rHand.x} ${rHand.y}`} />
      </g>

      {/* ARMS - Runner Jacket Fill */}
      <g stroke="#3A4640" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={`M ${lShoulder.x} ${lShoulder.y} L ${lElbow.x} ${lElbow.y} L ${lHand.x} ${lHand.y}`} />
        <path d={`M ${rShoulder.x} ${rShoulder.y} L ${rElbow.x} ${rElbow.y} L ${rHand.x} ${rHand.y}`} />
      </g>

      {/* NECK */}
      <line
        x1={headX}
        y1={neckTopY}
        x2={headX}
        y2={neckBottomY}
        stroke={headColor}
        strokeWidth="15"
        strokeLinecap="round"
      />

      {/* TORSO BASE */}
      {/* Outer clothes outline */}
      <path
        d={`M ${lShoulder.x - 2} ${lShoulder.y} 
            Q 150 ${lShoulder.y - 4} ${rShoulder.x + 2} ${rShoulder.y} 
            L 177 ${192 + bob} 
            L 123 ${192 + bob} Z`}
        fill="#3A4640"
        stroke="#F4F1E5"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* WARM INTERNAL CORE (Amber-Coral gradient radiating through athletic vest window) */}
      <ellipse
        cx={150}
        cy={146 + bob}
        rx={24 * coreScale}
        ry={36 * coreScale}
        fill={`url(#${uid}-core)`}
        filter={`url(#${uid}-glow)`}
      />
      {/* Core inner highlight node */}
      <ellipse
        cx={150}
        cy={142 + bob}
        rx={10 * coreScale}
        ry={15 * coreScale}
        fill="#FFB020"
        opacity={0.85}
      />

      {/* Vest Center Seam & Minimal Athletic Lines */}
      <line
        x1={150}
        y1={104 + bob}
        x2={150}
        y2={190 + bob}
        stroke="#95FF00"
        strokeWidth="2"
        strokeDasharray="4 3"
        opacity={0.7}
      />

      {/* HANDS */}
      {/* Left Hand Base */}
      <circle cx={lHand.x} cy={lHand.y} r={9.5} fill={handColor} stroke="#0B0F0A" strokeWidth="1.5" />
      {/* Right Hand Base */}
      <circle cx={rHand.x} cy={rHand.y} r={9.5} fill={handColor} stroke="#0B0F0A" strokeWidth="1.5" />

      {/* GLOVES (Cue 2: Pop onto hands) */}
      {p2 > 0 && (
        <g opacity={p2} transform={`scale(${1 + (1 - p2) * 0.3})`} style={{ transformOrigin: "150px 180px" }}>
          {/* Left Glove */}
          <g transform={`translate(${lHand.x}, ${lHand.y})`}>
            <circle r={11.5} fill="#F4F1E5" stroke="#3A4640" strokeWidth="2" />
            <rect x={-8} y={-11} width={16} height={6} rx={3} fill="#95FF00" />
            <circle cx={-3} cy={2} r={3} fill="#F4F1E5" />
          </g>
          {/* Right Glove */}
          <g transform={`translate(${rHand.x}, ${rHand.y})`}>
            <circle r={11.5} fill="#F4F1E5" stroke="#3A4640" strokeWidth="2" />
            <rect x={-8} y={-11} width={16} height={6} rx={3} fill="#95FF00" />
            <circle cx={3} cy={2} r={3} fill="#F4F1E5" />
          </g>
        </g>
      )}

      {/* HEAD */}
      {/* Ears */}
      <circle cx={headX - 20.5} cy={headY + 2} r={5} fill={headColor} stroke="#0B0F0A" strokeWidth="1.2" />
      <circle cx={headX + 20.5} cy={headY + 2} r={5} fill={headColor} stroke="#0B0F0A" strokeWidth="1.2" />
      {/* Head Main Circle */}
      <circle cx={headX} cy={headY} r={21} fill={headColor} stroke="#0B0F0A" strokeWidth="1.8" />

      {/* Stylized hair backdrop when bare */}
      {p4 < 1 && (
        <path
          d={`M ${headX - 18} ${headY - 4} Q ${headX} ${headY - 26} ${headX + 18} ${headY - 4} Q ${headX} ${headY - 14} ${headX - 18} ${headY - 4} Z`}
          fill="#3A4640"
          opacity={1 - p4}
        />
      )}

      {/* HEADBAND (Cue 3: Cover Forehead and Ears) */}
      {p3 > 0 && p4 < 1 && (
        <g opacity={p3 * (1 - p4)}>
          {/* Ear warmers */}
          <rect x={headX - 23.5} y={headY - 6} width={6} height={14} rx={3} fill="#95FF00" />
          <rect x={headX + 17.5} y={headY - 6} width={6} height={14} rx={3} fill="#95FF00" />
          {/* Forehead band */}
          <path
            d={`M ${headX - 21} ${headY - 2} Q ${headX} ${headY + 4} ${headX + 21} ${headY - 2} L ${headX + 20.5} ${headY - 10} Q ${headX} ${headY - 4} ${headX - 20.5} ${headY - 10} Z`}
            fill="#95FF00"
            stroke="#49762E"
            strokeWidth="1.2"
          />
        </g>
      )}

      {/* BEANIE HAT (Cue 4: Headband grows into full cream beanie with lime rim) */}
      {p4 > 0 && (
        <g opacity={p4} transform={`scale(${1 + (1 - p4) * 0.15})`} style={{ transformOrigin: `${headX}px ${headY}px` }}>
          {/* Hat Crown / Dome */}
          <path
            d={`M ${headX - 22} ${headY - 1} 
                C ${headX - 24} ${headY - 32}, ${headX + 24} ${headY - 32}, ${headX + 22} ${headY - 1} 
                Z`}
            fill="#F4F1E5"
            stroke="#0B0F0A"
            strokeWidth="1.8"
          />
          {/* Hat Fold Rim (Lime) */}
          <rect
            x={headX - 23.5}
            y={headY - 6}
            width={47}
            height={11}
            rx={5}
            fill="#95FF00"
            stroke="#49762E"
            strokeWidth="1.5"
          />
          {/* Top pom-pom button */}
          <circle cx={headX} cy={headY - 29} r={4.5} fill="#95FF00" />
          {/* Hat texture knit ribs */}
          <line x1={headX - 8} y1={headY - 26} x2={headX - 10} y2={headY - 6} stroke="#E7B899" strokeWidth="1.2" opacity={0.5} />
          <line x1={headX} y1={headY - 28} x2={headX} y2={headY - 6} stroke="#E7B899" strokeWidth="1.2" opacity={0.5} />
          <line x1={headX + 8} y1={headY - 26} x2={headX + 10} y2={headY - 6} stroke="#E7B899" strokeWidth="1.2" opacity={0.5} />
        </g>
      )}
    </svg>
  );
};

