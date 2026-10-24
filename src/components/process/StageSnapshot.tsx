"use client";

import { useId } from "react";

export function StageSnapshot({ stage }: { stage: number }) {
  const uid = useId().replace(/:/g, "");
  const is = (n: number) => stage >= n;
  const gridId = `${uid}-g`;
  const sheetId = `${uid}-s`;
  const partId = `${uid}-p`;

  const flangeTransform = is(4)
    ? "translate(254 120) scale(0.3 1) translate(-254 -120)"
    : undefined;

  return (
    <svg
      viewBox="0 0 400 240"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={sheetId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-steel-700)" />
          <stop offset="0.5" stopColor="var(--color-steel-900)" />
          <stop offset="1" stopColor="var(--color-graphite)" />
        </linearGradient>
        <linearGradient id={partId} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="var(--color-steel-700)" />
          <stop offset="0.6" stopColor="var(--color-steel-900)" />
          <stop offset="1" stopColor="var(--color-graphite)" />
        </linearGradient>
        <pattern id={gridId} width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M20 0H0V20"
            fill="none"
            stroke="var(--color-steel-700)"
            strokeOpacity="0.8"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect width="400" height="240" fill="var(--color-graphite)" />
      <rect width="400" height="240" fill={`url(#${gridId})`} opacity="0.5" />

      <g opacity={is(6) ? 0.4 : 1}>
        <rect x="36" y="36" width="328" height="168" rx="10" fill={`url(#${sheetId})`} />
        <path
          d="M46 36H364"
          stroke="var(--color-white)"
          strokeOpacity="0.12"
          strokeWidth="1"
        />
        {is(3) && (
          <g>
            <rect x="336" y="36" width="28" height="168" rx="0" fill={`url(#${sheetId})`} />
            <path
              d="M336 36H364"
              stroke="var(--color-white)"
              strokeOpacity="0.12"
              strokeWidth="1"
              transform="translate(6 0)"
            />
            <path
              d="M336 36V204"
              stroke="var(--color-white)"
              strokeOpacity="0.4"
              strokeWidth="1"
              transform="translate(14 -6) rotate(6)"
            />
          </g>
        )}
      </g>

      {is(6) && (
        <ellipse
          cx="200"
          cy="120"
          rx="130"
          ry="80"
          fill="var(--color-white)"
          opacity="0.08"
        />
      )}

      <g transform={is(6) ? "translate(0 -6)" : undefined}>
        <path
          d="M104 68H254V172H104Q98 172 98 166V74Q98 68 104 68Z"
          fill={is(1) ? `url(#${partId})` : "none"}
          opacity={is(1) ? (is(6) ? 0.95 : 0.8) : 0}
        />
        <g transform={flangeTransform}>
          <path
            d="M254 68H291Q296 68 296 73V167Q296 172 291 172H254Z"
            fill={is(1) ? `url(#${partId})` : "none"}
            opacity={is(1) ? (is(6) ? 0.95 : 0.8) : 0}
          />
          <path
            d="M254 68H291Q296 68 296 73V167Q296 172 291 172H254Z"
            fill="none"
            stroke={is(5) ? "var(--color-spark)" : "var(--color-white)"}
            strokeOpacity={is(5) ? 0.6 : is(2) ? 1 : 0.7}
            strokeWidth={is(2) ? 1.6 : 1.2}
            strokeDasharray={is(2) ? undefined : is(1) ? "5 5" : undefined}
          />
          {is(4) && (
            <path
              d="M254 68H262V172H254Z"
              fill="var(--color-ink)"
              opacity="0.9"
            />
          )}
          {is(5) && (
            <circle cx="275" cy="120" r="2.4" fill="var(--color-spark)" />
          )}
        </g>

        <path
          d="M104 68H254V172H104Q98 172 98 166V74Q98 68 104 68Z"
          fill="none"
          stroke={is(5) ? "var(--color-spark)" : "var(--color-white)"}
          strokeOpacity={is(5) ? 0.6 : is(2) ? 1 : 0.7}
          strokeWidth={is(2) ? 1.6 : 1.2}
          strokeDasharray={is(2) ? undefined : is(1) ? "5 5" : undefined}
        />

        <g
          opacity={is(1) ? (is(2) ? 1 : 0.7) : 0}
          fill={is(2) ? "var(--color-ink)" : "none"}
          stroke="var(--color-white)"
          strokeWidth="1.1"
        >
          <circle cx="128" cy="92" r="5" />
          <circle cx="200" cy="92" r="5" />
          <circle cx="128" cy="148" r="5" />
          <circle cx="200" cy="148" r="5" />
        </g>

        {is(2) && !is(4) && (
          <circle cx="254" cy="68" r="2.2" fill="var(--color-spark)" />
        )}

        {is(3) && (
          <path
            d="M254 68H290"
            stroke="var(--color-spark)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {is(5) && (
          <g fill="var(--color-spark)">
            <circle cx="254" cy="108" r="1.4" />
            <circle cx="254" cy="134" r="1.6" />
            <circle cx="254" cy="120" r="1.2" fill="var(--color-white)" />
          </g>
        )}

        {is(1) && !is(2) && (
          <path
            d="M254 68V172"
            stroke="var(--color-white)"
            strokeOpacity="0.5"
            strokeDasharray="4 4"
          />
        )}
      </g>

      <g stroke="var(--color-white)" strokeOpacity="0.5" strokeWidth="1">
        <path d="M16 24V16H24" fill="none" />
        <path d="M376 216V224H384" fill="none" />
      </g>
    </svg>
  );
}
