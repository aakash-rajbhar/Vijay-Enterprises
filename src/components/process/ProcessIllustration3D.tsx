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
  const outlineDash = activeStage >= 1 ? `${s1 * 1100} 1100` : "0 1100";

  // Laser cut glow + path
  const cutGlowOpacity = activeStage === 2 ? Math.sin(s2 * Math.PI) * 0.9 : 0;
  const cutProgress = activeStage >= 2 ? s2 : 0;
  const partFillOpacity =
    activeStage >= 2
      ? Math.min(0.9, s2 * 0.5 + (activeStage >= 3 ? 0.4 : 0))
      : 0;

  // Shear - offcut slides away
  const offcutX = activeStage >= 3 ? s3 * 80 : 0;
  const offcutOpacity = activeStage >= 3 ? 1 - s3 * 0.9 : 1;
  const offcutRotation = activeStage >= 3 ? s3 * 4 : 0;

  // Bend - flange folds up (isometric perspective)
  const flangeScaleX = activeStage >= 4 ? 1 - s4 * 0.65 : 1;
  const flangeY = activeStage >= 4 ? -s4 * 20 : 0;
  const flangeSideOpacity = activeStage >= 4 ? s4 : 0;

  // Weld — bracket appears + seam glow
  const weldOpacity =
    activeStage === 5 ? s5 * 0.9 : activeStage >= 6 ? 0.45 : 0;
  const weldGlowActive = activeStage === 5;
  const bracketOpacity = activeStage >= 5 ? Math.min(1, s5 * 2.5) : 0;
  const sparkCount = 8;

  // Final fabrication - spotlight, lift, polish
  const spotlightOpacity = activeStage >= 6 ? s6 * 0.8 : 0;
  const partLift = activeStage >= 6 ? s6 * 16 : 0;
  const partScale = activeStage >= 6 ? 1 + s6 * 0.03 : 1;
  const edgeGlowOpacity = activeStage >= 6 ? s6 * 0.7 : 0;

  // Isometric base transform — the whole panel group rotates slightly
  const isoRotateX = 12 + progress * 4;
  const isoRotateZ = -8 + progress * 3;

  // Design features timing
  const holesOpacity = activeStage >= 1 ? Math.min(1, s1 * 2) : 0;
  const holesScale = activeStage >= 1 ? 0.85 + s1 * 0.15 : 0.85;
  const featuresOpacity = activeStage >= 1 ? Math.min(1, s1 * 1.8) : 0;
  const featuresFillOpacity = activeStage >= 2 ? Math.min(0.8, s2) : 0;

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
          x1="230"
          y1="200"
          x2="680"
          y2="450"
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
          <stop
            offset="0"
            stopColor="var(--color-steel-700)"
            stopOpacity="0.8"
          />
          <stop
            offset="1"
            stopColor="var(--color-steel-900)"
            stopOpacity="0.3"
          />
        </linearGradient>

        {/* Grid pattern */}
        <pattern
          id={ids.grid}
          width="44"
          height="44"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M44 0H0V44"
            fill="none"
            stroke="var(--color-steel-700)"
            strokeWidth="1"
          />
        </pattern>

        {/* Brush texture */}
        <pattern
          id={ids.brush}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
        >
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
          <stop
            offset="0.55"
            stopColor="var(--color-spark)"
            stopOpacity="0.05"
          />
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
          transform: `translate(450px, 325px) perspective(1200px) rotateX(${isoRotateX}deg) rotateZ(${isoRotateZ}deg) translate(-450px, -325px) translateY(${-partLift}px) scale(${partScale})`,
          transformOrigin: "450px 325px",
          transition: "transform 0.05s linear",
        }}
      >
        {/* Shadow beneath the part */}
        <path
          d="M324 248H620Q632 248 632 260V406Q632 418 620 418H324Q312 418 312 406V260Q312 248 324 248Z"
          transform="translate(4 16)"
          fill="var(--color-ink)"
          filter={`url(#${ids.shadow})`}
          opacity={spotlightOpacity * 0.6}
        />

        {/* ═══ Metal sheet base (smaller than original) ═══ */}
        <g opacity={sheetOpacity}>
          {/* Sheet shadow */}
          <path
            d="M242 200H680V450H242Q230 450 230 438V212Q230 200 242 200Z"
            transform="translate(0 10)"
            fill="var(--color-ink)"
          />
          {/* Main sheet body */}
          <path
            d="M242 200H680V450H242Q230 450 230 438V212Q230 200 242 200Z"
            fill={`url(#${ids.sheetGrad})`}
          />
          {/* Brush texture */}
          <rect
            x="230"
            y="200"
            width="450"
            height="250"
            fill={`url(#${ids.brush})`}
          />
          {/* Top highlight edge */}
          <path
            d="M242 200H680"
            stroke="var(--color-white)"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
          <path
            d="M230 212V438"
            stroke="var(--color-white)"
            strokeOpacity="0.05"
            strokeWidth="1"
          />

          {/* Top face — isometric thickness (8px) */}
          <path
            d="M230 200L242 192H692L680 200Z"
            fill={`url(#${ids.topGrad})`}
            opacity="0.5"
          />
          {/* Right face — isometric side */}
          <path
            d="M680 200L692 192V442L680 450Z"
            fill="var(--color-steel-900)"
            opacity="0.4"
          />
        </g>

        {/* ═══ Offcut strip — slides away on shear ═══ */}
        <g
          style={{
            transform: `translate(${offcutX}px, ${-offcutX * 0.15}px) rotate(${offcutRotation}deg)`,
            transformOrigin: "715px 325px",
            opacity: offcutOpacity,
            transition: "transform 0.05s linear, opacity 0.05s linear",
          }}
        >
          <path
            d="M679 200H738Q750 200 750 212V438Q750 450 738 450H679Z"
            transform="translate(0 10)"
            fill="var(--color-ink)"
          />
          <path
            d="M679 200H738Q750 200 750 212V438Q750 450 738 450H679Z"
            fill={`url(#${ids.sheetGrad})`}
          />
          <rect
            x="679"
            y="200"
            width="71"
            height="250"
            fill={`url(#${ids.brush})`}
          />
          <path
            d="M679 200H738"
            stroke="var(--color-white)"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
        </g>

        {/* Shear edge line */}
        {activeStage >= 3 && (
          <path
            d="M680 200V450"
            stroke="var(--color-white)"
            strokeOpacity={0.6 * Math.min(1, s3 * 2)}
            strokeWidth="1.5"
          />
        )}

        {/* Spotlight ellipse */}
        <ellipse
          cx="450"
          cy="325"
          rx="300"
          ry="190"
          fill={`url(#${ids.spotlight})`}
          opacity={spotlightOpacity}
        />

        {/* ═══ Part group ═══ */}
        <g>
          {/* Main part fill */}
          <path
            d="M324 248H565V418H324Q312 418 312 406V260Q312 248 324 248Z"
            fill={`url(#${ids.partGrad})`}
            opacity={partFillOpacity}
          />

          {/* Flange side face (visible when bent) */}
          <rect
            x="561"
            y="248"
            width="8"
            height="170"
            fill={`url(#${ids.sideGrad})`}
            opacity={flangeSideOpacity}
          />

          {/* ── Flange — folds on bend ── */}
          <g
            style={{
              transform: `scaleX(${flangeScaleX}) translateY(${flangeY}px)`,
              transformOrigin: "565px 333px",
              transition: "transform 0.05s linear",
            }}
          >
            <path
              d="M565 248H620Q632 248 632 260V406Q632 418 620 418H565Z"
              fill={`url(#${ids.partGrad})`}
              opacity={partFillOpacity}
            />
            {/* Flange outline */}
            <path
              d="M565 248H620Q632 248 632 260V406Q632 418 620 418H565Z"
              fill="none"
              stroke="var(--color-steel-300)"
              strokeOpacity={outlineOpacity * 0.8}
              strokeWidth="1.5"
              strokeDasharray={outlineDash}
            />
            {/* Flange cut edge */}
            <path
              d="M565 248H620Q632 248 632 260V406Q632 418 620 418H565Z"
              fill="none"
              stroke="var(--color-white)"
              strokeWidth="1.6"
              opacity={activeStage >= 2 ? s2 * 0.8 : 0}
            />
            {/* Flange mounting holes */}
            <g
              fill="var(--color-ink)"
              fillOpacity={featuresFillOpacity}
              stroke="var(--color-steel-300)"
              strokeWidth="1.2"
              opacity={featuresOpacity}
            >
              <circle cx="598" cy="283" r="7" />
              <circle cx="598" cy="383" r="7" />
            </g>

            {/* Flange top face (bent) */}
            {activeStage >= 4 && s4 > 0.3 && (
              <path
                d="M565 248L577 240H632Q644 240 644 252V394Q644 406 632 406H577L565 418Z"
                fill={`url(#${ids.topGrad})`}
                opacity={s4 * 0.4}
              />
            )}
          </g>

          {/* Main part outline */}
          <path
            d="M324 248H565V418H324Q312 418 312 406V260Q312 248 324 248Z"
            fill="none"
            stroke="var(--color-steel-300)"
            strokeOpacity={outlineOpacity * 0.8}
            strokeWidth="1.5"
            strokeDasharray={outlineDash}
          />

          {/* Main part cut edge */}
          <path
            d="M324 248H565V418H324Q312 418 312 406V260Q312 248 324 248Z"
            fill="none"
            stroke="var(--color-white)"
            strokeWidth="1.6"
            opacity={activeStage >= 2 ? s2 * 0.8 : 0}
          />

          {/* ═══ Industrial Design Features ═══ */}

          {/* Mounting holes (4) with countersink marks */}
          <g
            opacity={holesOpacity}
            style={{
              transform: `scale(${holesScale})`,
              transformOrigin: "440px 333px",
            }}
          >
            {/* Holes — filled dark once laser-cut */}
            <g
              fill="var(--color-ink)"
              fillOpacity={featuresFillOpacity}
              stroke="var(--color-steel-300)"
              strokeWidth="1.3"
            >
              <circle cx="365" cy="282" r="10" />
              <circle cx="515" cy="282" r="10" />
              <circle cx="365" cy="384" r="10" />
              <circle cx="515" cy="384" r="10" />
            </g>
            {/* Countersink marks (dashed outer rings) */}
            <g
              fill="none"
              stroke="var(--color-steel-300)"
              strokeWidth="0.8"
              strokeDasharray="3 5"
              strokeOpacity="0.5"
            >
              <circle cx="365" cy="282" r="14" />
              <circle cx="515" cy="282" r="14" />
              <circle cx="365" cy="384" r="14" />
              <circle cx="515" cy="384" r="14" />
            </g>
          </g>

          {/* Cross-hair center marks on holes */}
          <g
            stroke="var(--color-steel-300)"
            strokeOpacity={outlineOpacity * 0.2}
            strokeWidth="0.7"
            fill="none"
          >
            <path d="M351 282H379M365 268V296" />
            <path d="M501 282H529M515 268V296" />
            <path d="M351 384H379M365 370V398" />
            <path d="M501 384H529M515 370V398" />
          </g>

          {/* Ventilation / mounting slots (3 parallel) */}
          <g
            fill="var(--color-ink)"
            fillOpacity={featuresFillOpacity}
            stroke="var(--color-steel-300)"
            strokeWidth="1.2"
            opacity={featuresOpacity}
          >
            <rect x="412" y="310" width="56" height="7" rx="3.5" />
            <rect x="412" y="325" width="56" height="7" rx="3.5" />
            <rect x="412" y="340" width="56" height="7" rx="3.5" />
          </g>

          {/* Central oblong cutout */}
          <rect
            x="428"
            y="362"
            width="24"
            height="10"
            rx="5"
            fill="var(--color-ink)"
            fillOpacity={featuresFillOpacity}
            stroke="var(--color-steel-300)"
            strokeWidth="1.2"
            opacity={featuresOpacity}
          />

          {/* Corner relief holes at bend line */}
          <g
            fill="var(--color-ink)"
            fillOpacity={featuresFillOpacity}
            stroke="var(--color-steel-300)"
            strokeWidth="1"
            opacity={featuresOpacity}
          >
            <circle cx="565" cy="254" r="3.5" />
            <circle cx="565" cy="412" r="3.5" />
          </g>

          {/* Blueprint dimension lines */}
          <g
            stroke="var(--color-steel-300)"
            strokeOpacity={outlineOpacity * 0.25}
            strokeWidth="1"
            strokeDasharray="4 6"
            fill="none"
          >
            <path d="M365 282H515" />
            <path d="M365 384H515" />
            <path d="M365 296V370" />
            <path d="M515 296V370" />
            <path d="M440 305V355" />
          </g>

          {/* Fold line (dashed, visible during design) */}
          <path
            d="M565 248V418"
            fill="none"
            stroke="var(--color-steel-300)"
            strokeOpacity={
              activeStage >= 1 && activeStage < 4 ? 0.55 * outlineOpacity : 0
            }
            strokeWidth="1"
            strokeDasharray="7 7"
          />
          {/* Fold solid line (visible during bend) */}
          <path
            d="M565 248V418"
            fill="none"
            stroke="var(--color-white)"
            strokeOpacity={activeStage >= 4 ? s4 * 0.35 : 0}
            strokeWidth="1.5"
          />

          {/* ═══ Welded Mounting Tab (T-joint) ═══ */}
          {/* Separate bracket piece welded onto the part surface */}
          {activeStage >= 5 && (
            <g opacity={bracketOpacity}>
              {/* Tab shadow on part surface */}
              <rect
                x="415"
                y="252"
                width="46"
                height="4"
                rx="1"
                fill="var(--color-ink)"
                opacity="0.3"
              />
              {/* Tab front face (stands up from the base plate) */}
              <rect
                x="415"
                y="230"
                width="46"
                height="22"
                rx="2"
                fill="var(--color-steel-700)"
              />
              {/* Tab top face (isometric) */}
              <path
                d="M415 230L419 226H465L461 230Z"
                fill="var(--color-steel-500)"
                opacity="0.65"
              />
              {/* Tab right face */}
              <path
                d="M461 230L465 226V248L461 252Z"
                fill="var(--color-steel-900)"
                opacity="0.5"
              />
              {/* Tab edge highlight */}
              <path
                d="M415 230H461"
                stroke="var(--color-white)"
                strokeOpacity="0.1"
                strokeWidth="0.8"
              />
            </g>
          )}

          {/* Weld fillet seam at tab/body junction */}
          <g opacity={weldOpacity}>
            {/* Main horizontal weld seam */}
            <path
              d="M417 252H459"
              fill="none"
              stroke="var(--color-spark)"
              strokeWidth="2"
              strokeLinecap="round"
              filter={weldGlowActive ? `url(#${ids.glow})` : undefined}
            />
            <path
              d="M417 252H459"
              fill="none"
              stroke={
                weldGlowActive ? "var(--color-white)" : "var(--color-steel-500)"
              }
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeOpacity="0.9"
            />
            {/* Side fillet welds (visible only during active welding) */}
            {weldGlowActive && (
              <>
                <path
                  d="M415 252V234"
                  fill="none"
                  stroke="var(--color-spark)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter={`url(#${ids.glow})`}
                  opacity="0.5"
                />
                <path
                  d="M461 252V234"
                  fill="none"
                  stroke="var(--color-spark)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter={`url(#${ids.glow})`}
                  opacity="0.5"
                />
              </>
            )}
          </g>

          {/* Welding sparks — from tab/body junction */}
          {activeStage === 5 &&
            Array.from({ length: sparkCount }).map((_, i) => {
              const angle = (i / sparkCount) * Math.PI * 2 + 0.4;
              const t = s5;
              const dist = (18 + (i % 3) * 8) * t;
              const sparkOpacity =
                t > 0.2 && t < 0.85
                  ? Math.sin(((t - 0.2) / 0.65) * Math.PI)
                  : 0;
              return (
                <circle
                  key={i}
                  cx={438 + Math.cos(angle) * dist}
                  cy={252 + Math.sin(angle) * dist - 7 * t}
                  r={i % 2 === 0 ? 2.2 : 1.6}
                  fill={
                    i % 3 === 0 ? "var(--color-white)" : "var(--color-spark)"
                  }
                  opacity={sparkOpacity}
                />
              );
            })}

          {/* Laser cut glow path */}
          <path
            d="M324 248H620Q632 248 632 260V406Q632 418 620 418H324Q312 418 312 406V260Q312 248 324 248Z"
            fill="none"
            stroke="var(--color-spark)"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter={`url(#${ids.glow})`}
            opacity={cutGlowOpacity}
            strokeDasharray="30 1100"
            strokeDashoffset={-cutProgress * 1130}
          />

          {/* Final edge glow */}
          <path
            d="M324 248H620Q632 248 632 260V406Q632 418 620 418H324Q312 418 312 406V260Q312 248 324 248Z"
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
              x1="680"
              y1="180"
              x2="680"
              y2="470"
              stroke="var(--color-spark)"
              strokeWidth="3"
              strokeLinecap="round"
              filter={`url(#${ids.glow})`}
            />
            <rect
              x="674"
              y="180"
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
