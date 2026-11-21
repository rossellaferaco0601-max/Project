// Illustrazione scritta da Gemini (gemini-flash) su indicazioni di regia (work/ytcn26/gemini/prompt_GemLunge.txt); scritte e agganci in Elements10.
import React from "react";

export const GemLunge: React.FC<{ t: number; uid: string; cues: number[] }> = ({ t, uid, cues }) => {
  const cue = (i: number) => cues[i] ?? Infinity;

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  const easeOut = (v: number) => 1 - Math.pow(1 - clamp(v, 0, 1), 3);
  const lerp = (a: number, b: number, f: number) => a + (b - a) * f;

  // Cue progress values
  const c0 = easeOut((t - cue(0)) / 0.5);
  const c1 = easeOut((t - cue(1)) / 0.5);
  const c2 = clamp((t - cue(2)) / 2.0, 0, 1); // Thermometer fill over 2s
  const c3 = easeOut((t - cue(3)) / 0.5);

  // Lunge Loop Kinematics (2.6s per rep, continuous loop)
  const repDuration = 2.6;
  const cycle = (t % repDuration) / repDuration;
  const repIndex = Math.floor(t / repDuration);
  const isRightFront = repIndex % 2 === 0;

  // Lunge depth & stride phase curve
  const phase = Math.sin(cycle * Math.PI);
  const depth = Math.pow(phase, 1.6); // Smooth dip
  const stride = phase * 46;

  // Base positions
  const baseHipX = 145;
  const standHipY = 152;
  const lungeHipY = 194;
  const hipY = lerp(standHipY, lungeHipY, depth) + Math.sin(t * 3) * 1.5; // Idle wobble
  const hipX = baseHipX;

  // Ankle positions
  const floorY = 246;
  const frontAnkleX = hipX + stride;
  const backAnkleX = hipX - stride * 0.9;

  // Lift foot slightly during movement transitions
  const lift = Math.sin(cycle * Math.PI * 2) * 4 * (1 - depth);

  const rightFootTarget = isRightFront
    ? { x: frontAnkleX, y: floorY }
    : { x: backAnkleX, y: floorY - depth * 4 + Math.max(0, lift) };

  const leftFootTarget = isRightFront
    ? { x: backAnkleX, y: floorY - depth * 4 + Math.max(0, lift) }
    : { x: frontAnkleX, y: floorY };

  // IK Solver
  const solveIK = (
    hx: number,
    hy: number,
    ax: number,
    ay: number,
    l1: number,
    l2: number,
    bendRight: boolean
  ) => {
    const dx = ax - hx;
    const dy = ay - hy;
    const dist = Math.max(1, Math.min(l1 + l2 - 0.2, Math.hypot(dx, dy)));
    const angle = Math.atan2(dy, dx);
    const cosA = clamp((l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist), -1, 1);
    const alpha = Math.acos(cosA);
    const kneeAngle = angle + (bendRight ? alpha : -alpha);
    return {
      kx: hx + l1 * Math.cos(kneeAngle),
      ky: hy + l1 * Math.sin(kneeAngle),
    };
  };

  const legL1 = 45;
  const legL2 = 45;

  const rightKnee = solveIK(hipX, hipY, rightFootTarget.x, rightFootTarget.y, legL1, legL2, true);
  const leftKnee = solveIK(hipX, hipY, leftFootTarget.x, leftFootTarget.y, legL1, legL2, true);

  // Upper body & arms kinematics
  const torsoTilt = lerp(0, 0.08, depth); // Slight forward tilt when lunging
  const headX = hipX + Math.sin(torsoTilt) * 45;
  const headY = hipY - Math.cos(torsoTilt) * 45 - 20;

  const shoulderX = hipX + 4;
  const shoulderY = hipY - 32;

  // Arms swing opposite to legs (runner posture)
  const armSwing = Math.sin(cycle * Math.PI * 2) * 0.5 * (isRightFront ? 1 : -1);
  const rElbow = {
    x: shoulderX + Math.cos(1.2 - armSwing) * 22,
    y: shoulderY + Math.sin(1.2 - armSwing) * 22,
  };
  const rHand = {
    x: rElbow.x + Math.cos(0.2 - armSwing) * 20,
    y: rElbow.y + Math.sin(0.2 - armSwing) * 20,
  };

  const lElbow = {
    x: shoulderX + Math.cos(1.2 + armSwing) * 22,
    y: shoulderY + Math.sin(1.2 + armSwing) * 22,
  };
  const lHand = {
    x: lElbow.x + Math.cos(0.2 + armSwing) * 20,
    y: lElbow.y + Math.sin(0.2 + armSwing) * 20,
  };

  // Cue 0 Aura
  const auraPulse = 1 + 0.06 * Math.sin(t * 4);

  // Cue 1 Thigh/Glute Pulse
  const musclePulse = c1 * depth * (0.5 + 0.5 * Math.sin(t * 8));

  // Cue 2 Heat Waves
  const heatWaveOffset = (t * 40) % 60;

  // Cue 3 Timer Arc Sweep
  const timerAngle = c3 * 360;
  const timerRad = (timerAngle - 90) * (Math.PI / 180);
  const timerArcX = 255 + 16 * Math.cos(timerRad);
  const timerArcY = 45 + 16 * Math.sin(timerRad);
  const largeArcFlag = timerAngle > 180 ? 1 : 0;

  return (
    <svg viewBox="0 0 300 300" width={300} height={300} style={{ overflow: "visible" }}>
      <defs>
        {/* Soft Lime Glow for Cue 0 */}
        <filter id={`${uid}-lime-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
        </filter>

        {/* Muscle Glow Gradient for Cue 1 */}
        <radialGradient id={`${uid}-muscle-grad`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB020" stopOpacity={0.9} />
          <stop offset="70%" stopColor="#95FF00" stopOpacity={0.6} />
          <stop offset="100%" stopColor="#95FF00" stopOpacity={0} />
        </radialGradient>

        {/* Thermometer Gradient for Cue 2 */}
        <linearGradient id={`${uid}-thermo-grad`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#B8D7EA" />
          <stop offset="60%" stopColor="#FFB020" />
          <stop offset="100%" stopColor="#FFB020" />
        </linearGradient>
      </defs>

      {/* Cue 0: Gentle Lime Aura */}
      {c0 > 0 && (
        <circle
          cx={hipX}
          cy={hipY - 15}
          r={70 * auraPulse}
          fill="#95FF00"
          opacity={0.25 * c0}
          filter={`url(#${uid}-lime-glow)`}
        />
      )}

      {/* Floor Shadow / Platform */}
      <ellipse cx={hipX} cy={floorY + 6} rx={75} ry={8} fill="#3A4640" opacity={0.3} />
      <line x1={20} y1={floorY + 6} x2={280} y2={floorY + 6} stroke="#3A4640" strokeWidth={3} strokeLinecap="round" />

      {/* Layer 1: Back Leg */}
      <g stroke="#3A4640" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round">
        {/* Outline */}
        <path
          d={`M ${hipX} ${hipY} L ${leftKnee.kx} ${leftKnee.ky} L ${leftFootTarget.x} ${leftFootTarget.y}`}
          stroke="#F4F1E5"
          strokeWidth={24}
          fill="none"
        />
        <path
          d={`M ${hipX} ${hipY} L ${leftKnee.kx} ${leftKnee.ky} L ${leftFootTarget.x} ${leftFootTarget.y}`}
          fill="none"
        />
      </g>

      {/* Layer 2: Back Arm */}
      <g stroke="#3A4640" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round">
        <path
          d={`M ${shoulderX} ${shoulderY} L ${lElbow.x} ${lElbow.y} L ${lHand.x} ${lHand.y}`}
          stroke="#F4F1E5"
          strokeWidth={20}
          fill="none"
        />
        <path
          d={`M ${shoulderX} ${shoulderY} L ${lElbow.x} ${lElbow.y} L ${lHand.x} ${lHand.y}`}
          fill="none"
        />
      </g>
      <circle cx={lHand.x} cy={lHand.y} r={8} fill="#E7B899" />

      {/* Layer 3: Torso & Head */}
      <g>
        {/* Torso Outline */}
        <path
          d={`M ${hipX} ${hipY + 5} L ${shoulderX} ${shoulderY}`}
          stroke="#F4F1E5"
          strokeWidth={28}
          strokeLinecap="round"
        />
        {/* Torso Body */}
        <path
          d={`M ${hipX} ${hipY + 5} L ${shoulderX} ${shoulderY}`}
          stroke="#3A4640"
          strokeWidth={24}
          strokeLinecap="round"
        />

        {/* Head */}
        <circle cx={headX} cy={headY} r={18} fill="#F4F1E5" />
        <circle cx={headX} cy={headY} r={16} fill="#E7B899" />
      </g>

      {/* Layer 4: Front Leg */}
      <g stroke="#3A4640" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round">
        <path
          d={`M ${hipX} ${hipY} L ${rightKnee.kx} ${rightKnee.ky} L ${rightFootTarget.x} ${rightFootTarget.y}`}
          stroke="#F4F1E5"
          strokeWidth={26}
          fill="none"
        />
        <path
          d={`M ${hipX} ${hipY} L ${rightKnee.kx} ${rightKnee.ky} L ${rightFootTarget.x} ${rightFootTarget.y}`}
          fill="none"
        />
      </g>

      {/* Layer 5: Front Arm */}
      <g stroke="#3A4640" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round">
        <path
          d={`M ${shoulderX} ${shoulderY} L ${rElbow.x} ${rElbow.y} L ${rHand.x} ${rHand.y}`}
          stroke="#F4F1E5"
          strokeWidth={22}
          fill="none"
        />
        <path
          d={`M ${shoulderX} ${shoulderY} L ${rElbow.x} ${rElbow.y} L ${rHand.x} ${rHand.y}`}
          fill="none"
        />
      </g>
      <circle cx={rHand.x} cy={rHand.y} r={9} fill="#E7B899" />

      {/* Cue 1: Thigh & Glute Heat Activation Overlay */}
      {c1 > 0 && (
        <g opacity={musclePulse}>
          <circle cx={hipX} cy={hipY + 5} r={22} fill={`url(#${uid}-muscle-grad)`} />
          <circle cx={(hipX + rightKnee.kx) / 2} cy={(hipY + rightKnee.ky) / 2} r={18} fill={`url(#${uid}-muscle-grad)`} />
          <circle cx={(hipX + leftKnee.kx) / 2} cy={(hipY + leftKnee.ky) / 2} r={18} fill={`url(#${uid}-muscle-grad)`} />
        </g>
      )}

      {/* Cue 2: Thermometer on Left & Heat Waves Above */}
      {c2 > 0 && (
        <g opacity={c2}>
          {/* Heat Waves above head */}
          <g stroke="#FFB020" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.7}>
            {[-20, 0, 20].map((dx, i) => {
              const wy = headY - 30 - ((heatWaveOffset + i * 20) % 45);
              const waveAlpha = Math.sin((wy - (headY - 75)) / 45 * Math.PI);
              return (
                <path
                  key={i}
                  d={`M ${headX + dx - 4} ${wy} Q ${headX + dx} ${wy - 6} ${headX + dx + 4} ${wy}`}
                  opacity={Math.max(0, waveAlpha)}
                />
              );
            })}
          </g>

          {/* Thermometer Tube */}
          <rect x={26} y={130} width={12} height={80} rx={6} fill="#0B0F0A" stroke="#F4F1E5" strokeWidth={2} />
          {/* Fill Liquid ( Ice Blue -> Amber, 0 to 75% height ) */}
          <rect
            x={28}
            y={210 - c2 * 55}
            width={8}
            height={c2 * 55}
            rx={4}
            fill={`url(#${uid}-thermo-grad)`}
          />
          {/* Bottom Bulb */}
          <circle cx={32} cy={215} r={12} fill="#F4F1E5" />
          <circle cx={32} cy={215} r={10} fill="#B8D7EA" />
          <circle cx={32} cy={215} r={10} fill={`url(#${uid}-thermo-grad)`} opacity={clamp(c2 * 1.5, 0, 1)} />
        </g>
      )}

      {/* Cue 3: Timer Arc in Top Right */}
      {c3 > 0 && (
        <g transform={`translate(255, 45) scale(${1 + 0.15 * Math.sin(c3 * Math.PI)}) translate(-255, -45)`}>
          <circle cx={255} cy={45} r={16} fill="none" stroke="#3A4640" strokeWidth={4} opacity={0.4} />
          {timerAngle > 0 && (
            <path
              d={
                timerAngle >= 360
                  ? "M 255 29 A 16 16 0 1 1 254.99 29"
                  : `M 255 29 A 16 16 0 ${largeArcFlag} 1 ${timerArcX} ${timerArcY}`
              }
              fill="none"
              stroke="#95FF00"
              strokeWidth={4}
              strokeLinecap="round"
            />
          )}
          <circle cx={255} cy={45} r={3} fill="#95FF00" />
        </g>
      )}
    </svg>
  );
};
