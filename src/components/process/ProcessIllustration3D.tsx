"use client";

import { memo, useId } from "react";

/**
 * Isometric 3D-style SVG of a metal panel that morphs through
 * the seven fabrication stages, driven entirely by CSS custom-properties
 * set from the parent via inline style `--stage-progress: 0…1`.
 *
 * No GSAP dependency — pure SVG + CSS transforms + inline style overrides.
 * The parent component maps scroll position → `--stage-progress` on the wrapper.
 */
function ProcessIllustration3DBase({
  progress = 0,
  activeStage = 0,
}: {
  progress: number;
  activeStage: number;
}) {
  const uid = useId().replace(/:/g, "");
  const ids = {
    sheetGrad: `${uid}-sg`,
    partGrad: `${uid}-pg`,
    sideGrad: `${uid}-sd`,
    topGrad: `${uid}-tg`,
    grid: `${uid}-gr`,
    glow: `${uid}-gl`,
    shadow: `${uid}-sh`,
    spotlight: `${uid}-sp`,
    vignette: `${uid}-vi`,
    brush: `${uid}-br`,
  };

  // Derive sub-stage floats (0-1) for each stage
  const stageCount = 7;
  const stageProgress = (stage: number) => {
    const start = stage / stageCount;
    const end = (stage + 1) / stageCount;
    return Math.max(0, Math.min(1, (progress - start) / (end - start)));
  };

  // stage 0: Raw sheet
  const s1 = stageProgress(1); // Design
  const s2 = stageProgress(2); // Laser cut
  const s3 = stageProgress(3); // Shear
  const s4 = stageProgress(4); // Bend
  const s5 = stageProgress(5); // Weld
  const s6 = stageProgress(6); // Fabricate

  // ---- Derived animation values ----

  // Sheet metal base - starts flat, gradually reveals design outlines
  const sheetOpacity = activeStage >= 6 ? 0.3 + 0.7 * (1 - s6) : 1;

  // Blueprint outlines
  const outlineOpacity = activeStage >= 1 ? Math.min(1, s1 * 1.5) : 0;
  const outlineDash = activeStage >= 1 ? `${s1 * 800} 800` : "0 800";

  // Laser cut glow + path
  const cutGlowOpacity = activeStage === 2 ? Math.sin(s2 * Math.PI) * 0.9 : 0;
  const cutProgress = activeStage >= 2 ? s2 : 0;
  const partFillOpacity =
    activeStage >= 2 ? Math.min(0.9, s2 * 0.5 + (activeStage >= 3 ? 0.4 : 0)) : 0;

  // Shear - offcut slides away
  const offcutX = activeStage >= 3 ? s3 * 80 : 0;
  const offcutOpacity = activeStage >= 3 ? 1 - s3 * 0.9 : 1;
  const offcutRotation = activeStage >= 3 ? s3 * 4 : 0;

  // Bend - flange folds up (isometric perspective)
  const flangeScaleX = activeStage >= 4 ? 1 - s4 * 0.65 : 1;
  const flangeY = activeStage >= 4 ? -s4 * 20 : 0;
  const flangeSideOpacity = activeStage >= 4 ? s4 : 0;

  // Weld - seam glow
  const weldOpacity = activeStage >= 5 ? s5 * 0.9 : 0;
  const sparkCount = 6;

  // Final fabrication - spotlight, lift, polish
  const spotlightOpacity = activeStage >= 6 ? s6 * 0.8 : 0;
  const partLift = activeStage >= 6 ? s6 * 16 : 0;
  const partScale = activeStage >= 6 ? 1 + s6 * 0.03 : 1;
  const edgeGlowOpacity = activeStage >= 6 ? s6 * 0.7 : 0;

  // Isometric base transform — the whole panel group rotates slightly
  const isoRotateX = 12 + progress * 4;
  const isoRotateZ = -8 + progress * 3;

  // Holes design elements
  const holesOpacity = activeStage >= 1 ? Math.min(1, s1 * 2) : 0;
  const holesScale = activeStage >= 1 ? 0.85 + s1 * 0.15 : 0.85;

  return (
    <svg
      viewBox="0 0 900 640"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      style={{ willChange: "transform" }}
    >
      <defs>
        {/* Sheet metal gradient */}
        <linearGradient
          id={ids.sheetGrad}
          gradientUnits="userSpaceOnUse"
          x1="150"
          y1="170"
          x2="760"
          y2="490"
        >
          <stop offset="0" stopColor="var(--color-steel-700)" />
          <stop offset="0.45" stopColor="var(--color-steel-900)" />
          <stop offset="1" stopColor="var(--color-graphite)" />
        </linearGradient>

        {/* Part gradient */}
        <linearGradient id={ids.partGrad} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="var(--color-steel-700)" />
          <stop offset="0.55" stopColor="var(--color-steel-900)" />
          <stop offset="1" stopColor="var(--color-graphite)" />
        </linearGradient>

        {/* Side face gradient (for bent flange) */}
        <linearGradient id={ids.sideGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-graphite)" />
          <stop offset="0.55" stopColor="var(--color-steel-900)" />
          <stop offset="1" stopColor="var(--color-steel-700)" />
        </linearGradient>

        {/* Top face for isometric depth */}
        <linearGradient id={ids.topGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-steel-700)" stopOpacity="0.8" />
          <stop offset="1" stopColor="var(--color-steel-900)" stopOpacity="0.3" />
        </linearGradient>

        {/* Grid pattern */}
        <pattern id={ids.grid} width="44" height="44" patternUnits="userSpaceOnUse">
          <path
            d="M44 0H0V44"
            fill="none"
            stroke="var(--color-steel-700)"
            strokeWidth="1"
          />
        </pattern>

        {/* Brush texture */}
        <pattern id={ids.brush} width="7" height="7" patternUnits="userSpaceOnUse">
          <path
            d="M0 0V7"
            stroke="var(--color-white)"
            strokeOpacity="0.028"
            strokeWidth="1"
          />
        </pattern>

        {/* Glow filter */}
        <filter id={ids.glow} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Shadow filter */}
        <filter id={ids.shadow} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" />
        </filter>

        {/* Spotlight radial gradient */}
        <radialGradient id={ids.spotlight} cx="50%" cy="46%" r="55%">
          <stop offset="0" stopColor="var(--color-white)" stopOpacity="0.14" />
          <stop offset="0.55" stopColor="var(--color-spark)" stopOpacity="0.05" />
          <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0" />
        </radialGradient>

        {/* Vignette */}
        <radialGradient id={ids.vignette} cx="50%" cy="50%" r="70%">
          <stop offset="0.4" stopColor="var(--color-ink)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0.72" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="900" height="640" fill="var(--color-graphite)" />

      {/* Animated grid - parallax layer */}
      <g
        style={{
          transform: `translate(${-progress * 22}px, ${-progress * 14}px)`,
          transition: "transform 0.1s linear",
        }}
      >
        <rect
          x="-80"
          y="-60"
          width="1060"
          height="760"
          fill={`url(#${ids.grid})`}
          opacity={0.5 + (activeStage >= 6 ? -0.15 * s6 : 0)}
        />
      </g>

      {/* Isometric part group — the core transforming element */}
      <g
        style={{
          transform: `translate(450px, 320px) perspective(1200px) rotateX(${isoRotateX}deg) rotateZ(${isoRotateZ}deg) translate(-450px, -320px) translateY(${-partLift}px) scale(${partScale})`,
          transformOrigin: "450px 330px",
          transition: "transform 0.05s linear",
        }}
      >
        {/* Shadow beneath the part */}
        <path
          d="M284 220H616Q630 220 630 234V426Q630 440 616 440H284Q270 440 270 426V234Q270 220 284 220Z"
          transform="translate(4 18)"
          fill="var(--color-ink)"
          filter={`url(#${ids.shadow})`}
          opacity={spotlightOpacity * 0.6}
        />

        {/* Metal sheet base */}
        <g opacity={sheetOpacity}>
          {/* Main sheet body */}
          <path
            d="M162 170H690V470H162Q150 470 150 458V182Q150 170 162 170Z"
            transform="translate(0 9)"
            fill="var(--color-ink)"
          />
          <path
            d="M162 170H690V470H162Q150 470 150 458V182Q150 170 162 170Z"
            fill={`url(#${ids.sheetGrad})`}
          />
          {/* Brush texture */}
          <rect x="150" y="170" width="540" height="300" fill={`url(#${ids.brush})`} />
          {/* Top highlight edge */}
          <path
            d="M162 170H690"
            stroke="var(--color-white)"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
          <path
            d="M150 182V458"
            stroke="var(--color-white)"
            strokeOpacity="0.05"
            strokeWidth="1"
          />

          {/* Top face — isometric thickness (6px tall) */}
          <path
            d="M150 170L162 162H702L690 170Z"
            fill={`url(#${ids.topGrad})`}
            opacity="0.5"
          />
          {/* Right face — isometric side */}
          <path
            d="M690 170L702 162V462L690 470Z"
            fill="var(--color-steel-900)"
            opacity="0.4"
          />
        </g>

        {/* Offcut strip — slides away on shear */}
        <g
          style={{
            transform: `translate(${offcutX}px, ${-offcutX * 0.15}px) rotate(${offcutRotation}deg)`,
            transformOrigin: "725px 320px",
            opacity: offcutOpacity,
            transition: "transform 0.05s linear, opacity 0.05s linear",
          }}
        >
          <path
            d="M689.5 170H748Q760 170 760 182V458Q760 470 748 470H689.5Z"
            transform="translate(0 9)"
            fill="var(--color-ink)"
          />
          <path
            d="M689.5 170H748Q760 170 760 182V458Q760 470 748 470H689.5Z"
            fill={`url(#${ids.sheetGrad})`}
          />
          <rect
            x="689.5"
            y="170"
            width="70.5"
            height="300"
            fill={`url(#${ids.brush})`}
          />
          <path
            d="M689.5 170H748"
            stroke="var(--color-white)"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
        </g>

        {/* Shear edge line */}
        {activeStage >= 3 && (
          <path
            d="M690 170V470"
            stroke="var(--color-white)"
            strokeOpacity={0.6 * Math.min(1, s3 * 2)}
            strokeWidth="1.5"
          />
        )}

        {/* Spotlight ellipse */}
        <ellipse
          cx="450"
          cy="330"
          rx="300"
          ry="190"
          fill={`url(#${ids.spotlight})`}
          opacity={spotlightOpacity}
        />

        {/* Part group with fill */}
        <g>
          {/* Main part fill */}
          <path
            d="M284 220H560V440H284Q270 440 270 426V234Q270 220 284 220Z"
            fill={`url(#${ids.partGrad})`}
            opacity={partFillOpacity}
          />

          {/* Flange side face (visible when bent) */}
          <rect
            x="556"
            y="220"
            width="9"
            height="220"
            fill={`url(#${ids.sideGrad})`}
            opacity={flangeSideOpacity}
          />

          {/* Flange — folds on bend */}
          <g
            style={{
              transform: `scaleX(${flangeScaleX}) translateY(${flangeY}px)`,
              transformOrigin: "560px 330px",
              transition: "transform 0.05s linear",
            }}
          >
            <path
              d="M560 220H616Q630 220 630 234V426Q630 440 616 440H560Z"
              fill={`url(#${ids.partGrad})`}
              opacity={partFillOpacity}
            />
            {/* Flange outline */}
            <path
              d="M560 220H616Q630 220 630 234V426Q630 440 616 440H560Z"
              fill="none"
              stroke="var(--color-steel-300)"
              strokeOpacity={outlineOpacity * 0.8}
              strokeWidth="1.5"
              strokeDasharray={outlineDash}
            />
            {/* Flange cut edge */}
            <path
              d="M560 220H616Q630 220 630 234V426Q630 440 616 440H560Z"
              fill="none"
              stroke="var(--color-white)"
              strokeWidth="1.6"
              opacity={activeStage >= 2 ? s2 * 0.8 : 0}
            />
            {/* Flange holes */}
            <g
              fill="none"
              stroke="var(--color-steel-300)"
              strokeWidth="1.3"
              opacity={outlineOpacity}
            >
              <circle cx="595" cy="275" r="8" />
              <circle cx="595" cy="385" r="8" />
            </g>

            {/* Flange top face (bent) */}
            {activeStage >= 4 && s4 > 0.3 && (
              <path
                d="M560 220L572 212H628Q642 212 642 226V418Q642 432 628 432H572L560 440Z"
                fill={`url(#${ids.topGrad})`}
                opacity={s4 * 0.4}
              />
            )}
          </g>

          {/* Main part outline */}
          <path
            d="M284 220H560V440H284Q270 440 270 426V234Q270 220 284 220Z"
            fill="none"
            stroke="var(--color-steel-300)"
            strokeOpacity={outlineOpacity * 0.8}
            strokeWidth="1.5"
            strokeDasharray={outlineDash}
          />

          {/* Main part cut edge */}
          <path
            d="M284 220H560V440H284Q270 440 270 426V234Q270 220 284 220Z"
            fill="none"
            stroke="var(--color-white)"
            strokeWidth="1.6"
            opacity={activeStage >= 2 ? s2 * 0.8 : 0}
          />

          {/* Mounting holes */}
          <g
            fill="var(--color-ink)"
            fillOpacity="0"
            stroke="var(--color-steel-300)"
            strokeWidth="1.3"
            opacity={holesOpacity}
            style={{
              transform: `scale(${holesScale})`,
              transformOrigin: "415px 330px",
            }}
          >
            <circle cx="330" cy="275" r="12" />
            <circle cx="500" cy="275" r="12" />
            <circle cx="330" cy="385" r="12" />
            <circle cx="500" cy="385" r="12" />
            <rect x="405" y="318" width="80" height="24" rx="12" />
          </g>

          {/* Blueprint dimension lines */}
          <g
            stroke="var(--color-steel-300)"
            strokeOpacity={outlineOpacity * 0.28}
            strokeWidth="1"
            strokeDasharray="4 6"
            fill="none"
          >
            <path d="M300 275H360M330 245V305M470 275H530M500 245V305" />
            <path d="M300 385H360M330 355V415M470 385H530M500 355V415" />
            <path d="M395 330H495" />
          </g>

          {/* Fold line */}
          <path
            d="M560 220V440"
            fill="none"
            stroke="var(--color-steel-300)"
            strokeOpacity={activeStage >= 1 && activeStage < 4 ? 0.55 * outlineOpacity : 0}
            strokeWidth="1"
            strokeDasharray="7 7"
          />
          {/* Fold solid line */}
          <path
            d="M560 220V440"
            fill="none"
            stroke="var(--color-white)"
            strokeOpacity={activeStage >= 4 ? s4 * 0.35 : 0}
            strokeWidth="1.5"
          />

          {/* Weld seam */}
          <g opacity={weldOpacity}>
            <path
              d="M560 252V408"
              fill="none"
              stroke="var(--color-spark)"
              strokeWidth="4"
              strokeLinecap="round"
              filter={`url(#${ids.glow})`}
            />
            <path
              d="M560 252V408"
              fill="none"
              stroke="var(--color-white)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeOpacity="0.9"
            />
          </g>

          {/* Welding sparks */}
          {activeStage === 5 &&
            Array.from({ length: sparkCount }).map((_, i) => {
              const angle = (i / sparkCount) * Math.PI * 2 + 0.4;
              const t = s5;
              const dist = (18 + (i % 3) * 8) * t;
              const sparkOpacity = t > 0.2 && t < 0.85 ? Math.sin((t - 0.2) / 0.65 * Math.PI) : 0;
              return (
                <circle
                  key={i}
                  cx={560 + Math.cos(angle) * dist}
                  cy={330 + Math.sin(angle) * dist - 7 * t}
                  r={i % 2 === 0 ? 2.2 : 1.6}
                  fill={i % 3 === 0 ? "var(--color-white)" : "var(--color-spark)"}
                  opacity={sparkOpacity}
                />
              );
            })}

          {/* Laser cut glow path */}
          <path
            d="M284 220H616Q630 220 630 234V426Q630 440 616 440H284Q270 440 270 426V234Q270 220 284 220Z"
            fill="none"
            stroke="var(--color-spark)"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter={`url(#${ids.glow})`}
            opacity={cutGlowOpacity}
            strokeDasharray={`30 800`}
            strokeDashoffset={-cutProgress * 830}
          />

          {/* Final edge glow */}
          <path
            d="M284 220H616Q630 220 630 234V426Q630 440 616 440H284Q270 440 270 426V234Q270 220 284 220Z"
            fill="none"
            stroke="var(--color-white)"
            strokeOpacity={edgeGlowOpacity}
            strokeWidth="1.4"
          />
        </g>

        {/* Shear blade */}
        {activeStage === 3 && (
          <g opacity={s3 < 0.5 ? s3 * 2 : 1 - (s3 - 0.5) * 2}>
            <line
              x1="690"
              y1="150"
              x2="690"
              y2="490"
              stroke="var(--color-spark)"
              strokeWidth="3"
              strokeLinecap="round"
              filter={`url(#${ids.glow})`}
            />
            <rect
              x="684"
              y="150"
              width="12"
              height="5"
              rx="2.5"
              fill="var(--color-spark)"
            />
          </g>
        )}
      </g>

      {/* Vignette overlay */}
      <rect width="900" height="640" fill={`url(#${ids.vignette})`} />

      {/* Corner brackets */}
      <g stroke="var(--color-steel-500)" strokeOpacity="0.5" strokeWidth="1">
        <path d="M28 44V28H44" fill="none" />
        <path d="M856 596V612H872" fill="none" />
      </g>
    </svg>
  );
}

export const ProcessIllustration3D = memo(ProcessIllustration3DBase);
