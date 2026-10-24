"use client";

import { memo, useId } from "react";

const MAIN_SHEET_PATH = "M162 170H690V470H162Q150 470 150 458V182Q150 170 162 170Z";
const STRIP_SHEET_PATH = "M689.5 170H748Q760 170 760 182V458Q760 470 748 470H689.5Z";
const MAIN_PART_PATH = "M284 220H560V440H284Q270 440 270 426V234Q270 220 284 220Z";
const FLANGE_PART_PATH = "M560 220H616Q630 220 630 234V426Q630 440 616 440H560Z";
const PART_PATH =
  "M284 220H616Q630 220 630 234V426Q630 440 616 440H284Q270 440 270 426V234Q270 220 284 220Z";

function ProcessIllustrationBase() {
  const uid = useId().replace(/:/g, "");
  const ids = {
    sheet: `${uid}-sheet`,
    part: `${uid}-part`,
    side: `${uid}-side`,
    grid: `${uid}-grid`,
    brush: `${uid}-brush`,
    glow: `${uid}-glow`,
    shadow: `${uid}-shadow`,
    spot: `${uid}-spot`,
    vignette: `${uid}-vignette`,
    bg: `${uid}-bg`,
    clipMain: `${uid}-clip-main`,
    clipStrip: `${uid}-clip-strip`,
  };

  return (
    <svg
      viewBox="0 0 900 640"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={ids.sheet}
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
        <linearGradient id={ids.part} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="var(--color-steel-700)" />
          <stop offset="0.55" stopColor="var(--color-steel-900)" />
          <stop offset="1" stopColor="var(--color-graphite)" />
        </linearGradient>
        <linearGradient id={ids.side} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-graphite)" />
          <stop offset="0.55" stopColor="var(--color-steel-900)" />
          <stop offset="1" stopColor="var(--color-steel-700)" />
        </linearGradient>
        <radialGradient id={ids.spot} cx="50%" cy="48%" r="55%">
          <stop offset="0" stopColor="var(--color-white)" stopOpacity="0.14" />
          <stop offset="0.55" stopColor="var(--color-spark)" stopOpacity="0.05" />
          <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ids.vignette} cx="50%" cy="50%" r="70%">
          <stop offset="0.4" stopColor="var(--color-ink)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0.72" />
        </radialGradient>
        <radialGradient id={ids.bg} cx="50%" cy="45%" r="65%">
          <stop offset="0" stopColor="var(--color-steel-900)" stopOpacity="0.7" />
          <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0" />
        </radialGradient>
        <pattern id={ids.grid} width="44" height="44" patternUnits="userSpaceOnUse">
          <path
            d="M44 0H0V44"
            fill="none"
            stroke="var(--color-steel-700)"
            strokeWidth="1"
          />
        </pattern>
        <pattern id={ids.brush} width="7" height="7" patternUnits="userSpaceOnUse">
          <path
            d="M0 0V7"
            stroke="var(--color-white)"
            strokeOpacity="0.028"
            strokeWidth="1"
          />
        </pattern>
        <filter id={ids.glow} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={ids.shadow} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <clipPath id={ids.clipMain}>
          <path d={MAIN_SHEET_PATH} />
        </clipPath>
        <clipPath id={ids.clipStrip}>
          <path d={STRIP_SHEET_PATH} />
        </clipPath>
      </defs>

      <rect width="900" height="640" fill="var(--color-graphite)" />
      <rect width="900" height="640" fill={`url(#${ids.bg})`} />
      <g data-grid>
        <rect x="-80" y="-60" width="1060" height="760" fill={`url(#${ids.grid})`} opacity="0.65" />
      </g>

      <g data-sheet>
        <g>
          <path d={MAIN_SHEET_PATH} transform="translate(0 9)" fill="var(--color-ink)" />
          <path d={MAIN_SHEET_PATH} fill={`url(#${ids.sheet})`} />
          <g clipPath={`url(#${ids.clipMain})`}>
            <rect x="150" y="170" width="540" height="300" fill={`url(#${ids.brush})`} />
          </g>
          <path d="M162 170H690" stroke="var(--color-white)" strokeOpacity="0.12" strokeWidth="1" />
          <path d="M150 182V458" stroke="var(--color-white)" strokeOpacity="0.05" strokeWidth="1" />
        </g>

        <g data-offcut>
          <path d={STRIP_SHEET_PATH} transform="translate(0 9)" fill="var(--color-ink)" />
          <path d={STRIP_SHEET_PATH} fill={`url(#${ids.sheet})`} />
          <g clipPath={`url(#${ids.clipStrip})`}>
            <rect x="689.5" y="170" width="70.5" height="300" fill={`url(#${ids.brush})`} />
          </g>
          <path d="M689.5 170H748" stroke="var(--color-white)" strokeOpacity="0.12" strokeWidth="1" />
        </g>

        <path
          data-shear-edge
          d="M690 170V470"
          stroke="var(--color-white)"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          opacity="0"
        />
      </g>

      <ellipse
        data-spotlight
        cx="450"
        cy="330"
        rx="300"
        ry="190"
        fill={`url(#${ids.spot})`}
        opacity="0"
      />

      <g data-part-shadow opacity="0">
        <path
          d={PART_PATH}
          transform="translate(0 16)"
          fill="var(--color-ink)"
          filter={`url(#${ids.shadow})`}
        />
      </g>

      <g data-part>
        <path data-part-fill d={MAIN_PART_PATH} fill={`url(#${ids.part})`} opacity="0" />

        <rect
          data-flange-side
          x="556"
          y="220"
          width="9"
          height="220"
          fill={`url(#${ids.side})`}
          opacity="0"
        />

        <g data-flange>
          <path data-part-fill d={FLANGE_PART_PATH} fill={`url(#${ids.part})`} opacity="0" />
          <path
            data-outline-flange
            d={FLANGE_PART_PATH}
            fill="none"
            stroke="var(--color-steel-300)"
            strokeOpacity="0.8"
            strokeWidth="1.5"
          />
          <path
            data-cut-edge
            d={FLANGE_PART_PATH}
            fill="none"
            stroke="var(--color-white)"
            strokeWidth="1.6"
            opacity="0"
          />
          <g data-hole-outline opacity="0" fill="none" stroke="var(--color-steel-300)" strokeWidth="1.3">
            <circle cx="595" cy="275" r="8" />
            <circle cx="595" cy="385" r="8" />
          </g>
        </g>

        <path
          data-outline-main
          d={MAIN_PART_PATH}
          fill="none"
          stroke="var(--color-steel-300)"
          strokeOpacity="0.8"
          strokeWidth="1.5"
        />
        <path
          data-cut-edge
          d={MAIN_PART_PATH}
          fill="none"
          stroke="var(--color-white)"
          strokeWidth="1.6"
          opacity="0"
        />

        <g
          data-holes
          opacity="0"
          fill="var(--color-ink)"
          fillOpacity="0"
          stroke="var(--color-steel-300)"
          strokeWidth="1.3"
        >
          <circle cx="330" cy="275" r="12" />
          <circle cx="500" cy="275" r="12" />
          <circle cx="330" cy="385" r="12" />
          <circle cx="500" cy="385" r="12" />
          <rect x="405" y="318" width="80" height="24" rx="12" />
        </g>

        <g
          data-blueprint-detail
          opacity="0"
          stroke="var(--color-steel-300)"
          strokeOpacity="0.28"
          strokeWidth="1"
          strokeDasharray="4 6"
          fill="none"
        >
          <path d="M300 275H360M330 245V305M470 275H530M500 245V305" />
          <path d="M300 385H360M330 355V415M470 385H530M500 355V415" />
          <path d="M395 330H495" />
        </g>

        <path
          data-fold
          d="M560 220V440"
          fill="none"
          stroke="var(--color-steel-300)"
          strokeOpacity="0.55"
          strokeWidth="1"
          strokeDasharray="7 7"
          opacity="0"
        />
        <path
          data-fold-solid
          d="M560 220V440"
          fill="none"
          stroke="var(--color-white)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          opacity="0"
        />

        <g data-weld opacity="0">
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

        <g fill="var(--color-spark)">
          <circle data-spark cx="560" cy="330" r="2.4" />
          <circle data-spark cx="560" cy="330" r="1.8" />
          <circle data-spark cx="560" cy="330" r="2.1" />
          <circle data-spark cx="560" cy="330" r="1.4" fill="var(--color-white)" />
          <circle data-spark cx="560" cy="330" r="1.7" />
          <circle data-spark cx="560" cy="330" r="2" fill="var(--color-white)" />
        </g>

        <path
          data-cut-glow
          d={PART_PATH}
          fill="none"
          stroke="var(--color-spark)"
          strokeWidth="3.2"
          strokeLinecap="round"
          filter={`url(#${ids.glow})`}
          opacity="0"
        />

        <path
          data-part-edge
          d={PART_PATH}
          fill="none"
          stroke="var(--color-white)"
          strokeOpacity="0.7"
          strokeWidth="1.4"
          opacity="0"
        />
      </g>

      <g data-shear-blade opacity="0">
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
        <rect x="684" y="150" width="12" height="5" rx="2.5" fill="var(--color-spark)" />
      </g>

      <rect width="900" height="640" fill={`url(#${ids.vignette})`} />
      <g stroke="var(--color-steel-500)" strokeOpacity="0.5" strokeWidth="1">
        <path d="M28 44V28H44" fill="none" />
        <path d="M856 596V612H872" fill="none" />
      </g>
    </svg>
  );
}

export const ProcessIllustration = memo(ProcessIllustrationBase);
