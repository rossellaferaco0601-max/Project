// Illustrazione scritta da Gemini (gemini-flash, 20/11) su indicazioni di regia; le scritte le mette Elements10.
import React from "react";

export const GemRings: React.FC<{
  t: number;
  uid: string;
  on: [number, number, number];
  lock: number;
  warm: number;
}> = ({ t, uid, on, lock, warm }) => {
  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, val));
  const easeOutCubic = (p: number) => 1 - Math.pow(1 - clamp(p, 0, 1), 3);

  // Draw progress for each ring
  const drawP = on.map((onTime) => easeOutCubic((t - onTime) / 0.45));

  // Ring radii and arc parameters (300 degree arcs, 60 degree gaps)
  const radii = [58, 88, 118];
  const arcAngles = [300, 300, 300];
  const circumferences = radii.map((r) => 2 * Math.PI * r);
  const arcLengths = circumferences.map((c, i) => (c * arcAngles[i]) / 360);

  // Rotation math
  const freeSpeeds = [35, -25, 15]; // deg/sec
  const freeOffsets = [0, 120, 240]; // initial offsets
  const targetSpeed = 20; // common speed after lock
  const targetOffset = 45; // common gap alignment

  const lockEase = easeOutCubic((t - lock) / 0.6);

  const ringRotations = radii.map((_, i) => {
    const freeAngle = freeOffsets[i] + freeSpeeds[i] * t;
    const lockedAngle = targetOffset + targetSpeed * t;
    return (1 - lockEase) * freeAngle + lockEase * lockedAngle;
  });

  // Lock Pulse Event
  const pulseP = clamp((t - lock) / 0.5, 0, 1);
  const pulseR = 118 + pulseP * 30;
  const pulseOpacity = (1 - pulseP) * (t >= lock ? 0.85 : 0);

  // Core Dynamics
  const warmP = clamp((t - warm) / 0.4, 0, 1);
  const corePulse = warmP > 0 ? 1 + 0.055 * Math.sin((t - warm) * 5) : 1;
  const coreR = 30 * corePulse;

  // Heat Waves (rising inside inner ring r < 58)
  const heatWaves = [
    { x: -12, speed: 1.8, phase: 0 },
    { x: 0, speed: 2.2, phase: 1.5 },
    { x: 12, speed: 1.6, phase: 3.0 },
  ].map((w) => {
    const yOffset = -(((t * w.speed * 20 + w.phase * 10) % 32) - 16);
    const waveX = w.x + Math.sin(t * 4 + w.phase) * 3;
    return { x: waveX, y: yOffset };
  });

  // Wind Streaks outside outer ring (r ~ 133 to 143)
  const windP = easeOutCubic((t - lock) / 0.4);
  const windOffset = (t - lock) * 80;

  return (
    <svg
      viewBox="0 0 300 300"
      width={300}
      height={300}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Core Warm Radial Gradient */}
        <radialGradient
          id={`${uid}-warm-grad`}
          cx="50%"
          cy="50%"
          r="50%"
          fx="40%"
          fy="40%"
        >
          <stop offset="0%" stopColor="#FFD27A" />
          <stop offset="100%" stopColor="#FFB020" />
        </radialGradient>

        {/* Inner Ring Texture Pattern Mask */}
        <clipPath id={`${uid}-inner-clip`}>
          <circle cx={150} cy={150} r={58} strokeWidth={22} fill="none" />
        </clipPath>
      </defs>

      {/* CORE LAYER */}
      <g transform="translate(150, 150)">
        {/* Cool Core (t < warm) */}
        {warmP < 1 && (
          <circle
            cx={0}
            cy={0}
            r={30}
            fill="#6F8794"
            opacity={1 - warmP}
          />
        )}

        {/* Warm Core (t >= warm) */}
        {warmP > 0 && (
          <g opacity={warmP} transform={`scale(${corePulse})`}>
            <circle
              cx={0}
              cy={0}
              r={30}
              fill={`url(#${uid}-warm-grad)`}
            />
            {/* Soft inner glow */}
            <circle
              cx={0}
              cy={0}
              r={26}
              fill="none"
              stroke="#FFEAA7"
              strokeWidth={2}
              opacity={0.6}
            />
          </g>
        )}

        {/* Rising Heat Waves (trapped inside inner ring r < 58) */}
        {warmP > 0 && (
          <g opacity={warmP * 0.75}>
            {heatWaves.map((hw, idx) => (
              <path
                key={idx}
                d={`M ${hw.x} ${hw.y + 8} Q ${hw.x + 4} ${hw.y} ${hw.x} ${hw.y - 8}`}
                fill="none"
                stroke="#FFE599"
                strokeWidth={2}
                strokeLinecap="round"
                opacity={Math.max(0, 1 - Math.abs(hw.y) / 20)}
              />
            ))}
          </g>
        )}
      </g>

      {/* RINGS LAYER */}
      <g transform="translate(150, 150)">
        {/* 1. INNER RING (Base Layer: r=58, #B8D7EA) */}
        {drawP[0] > 0 && (
          <g transform={`rotate(${ringRotations[0]})`}>
            {/* Main Arc */}
            <circle
              cx={0}
              cy={0}
              r={58}
              fill="none"
              stroke="#B8D7EA"
              strokeWidth={22}
              strokeLinecap="round"
              strokeDasharray={`${arcLengths[0]} ${circumferences[0]}`}
              strokeDashoffset={arcLengths[0] * (1 - drawP[0])}
            />
            {/* Perforation Texture Dots */}
            <circle
              cx={0}
              cy={0}
              r={58}
              fill="none"
              stroke="#7AA6C2"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={`2 8`}
              strokeDashoffset={arcLengths[0] * (1 - drawP[0])}
              opacity={drawP[0]}
            />
          </g>
        )}

        {/* 2. MIDDLE RING (Insulating Vest: r=88, #49762E) */}
        {drawP[1] > 0 && (
          <g transform={`rotate(${ringRotations[1]})`}>
            {/* Main Arc */}
            <circle
              cx={0}
              cy={0}
              r={88}
              fill="none"
              stroke="#49762E"
              strokeWidth={22}
              strokeLinecap="round"
              strokeDasharray={`${arcLengths[1]} ${circumferences[1]}`}
              strokeDashoffset={arcLengths[1] * (1 - drawP[1])}
            />
            {/* Quilting Ticks Texture */}
            <circle
              cx={0}
              cy={0}
              r={88}
              fill="none"
              stroke="#2E4E1C"
              strokeWidth={14}
              strokeDasharray={`2 12`}
              strokeDashoffset={arcLengths[1] * (1 - drawP[1])}
              opacity={drawP[1] * 0.8}
            />
          </g>
        )}

        {/* 3. OUTER RING (Windproof Shell: r=118, #F4F1E5 + #95FF00 edge) */}
        {drawP[2] > 0 && (
          <g transform={`rotate(${ringRotations[2]})`}>
            {/* Main Outer Shell Arc */}
            <circle
              cx={0}
              cy={0}
              r={118}
              fill="none"
              stroke="#F4F1E5"
              strokeWidth={22}
              strokeLinecap="round"
              strokeDasharray={`${arcLengths[2]} ${circumferences[2]}`}
              strokeDashoffset={arcLengths[2] * (1 - drawP[2])}
            />
            {/* Thin Lime Outer Edge Arc */}
            <circle
              cx={0}
              cy={0}
              r={128.5}
              fill="none"
              stroke="#95FF00"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeDasharray={`${arcLengths[2] * (128.5 / 118)} ${
                circumferences[2] * (128.5 / 118)
              }`}
              strokeDashoffset={
                arcLengths[2] * (128.5 / 118) * (1 - drawP[2])
              }
            />
            {/* Zip-like Dashed Lime Center Line */}
            <circle
              cx={0}
              cy={0}
              r={118}
              fill="none"
              stroke="#95FF00"
              strokeWidth={2.5}
              strokeDasharray={`4 6`}
              strokeDashoffset={arcLengths[2] * (1 - drawP[2])}
              opacity={drawP[2] * 0.9}
            />
          </g>
        )}
      </g>

      {/* LOCK PULSE EFFECT */}
      {pulseOpacity > 0 && (
        <circle
          cx={150}
          cy={150}
          r={pulseR}
          fill="none"
          stroke="#95FF00"
          strokeWidth={3}
          opacity={pulseOpacity}
        />
      )}

      {/* WIND STREAKS (t >= lock, deflect around outer ring) */}
      {t >= lock && (
        <g opacity={windP * 0.75}>
          {[133, 137, 141, 145].map((r, i) => {
            const sweep = 70 + i * 15;
            const startAngle = 140 - i * 10 + (windOffset % 40);
            const circ = 2 * Math.PI * r;
            const dashArc = (circ * sweep) / 360;
            return (
              <circle
                key={i}
                cx={150}
                cy={150}
                r={r}
                fill="none"
                stroke="#B8D7EA"
                strokeWidth={1.5}
                strokeDasharray={`8 14 ${dashArc} ${circ}`}
                strokeDashoffset={-startAngle}
                strokeLinecap="round"
              />
            );
          })}
        </g>
      )}
    </svg>
  );
};
