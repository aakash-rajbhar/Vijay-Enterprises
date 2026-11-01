export type GridVariant =
  | "none"
  | "frame"
  | "split-5-7"
  | "split-4-8"
  | "split-7-5"
  | "split-half"
  | "cols-3"
  | "cols-4"
  | "hero"
  | "closing-cta";

export type GridProps = {
  theme?: "dark" | "light" | "mist";
  onImage?: boolean;
  variant?: GridVariant;
  className?: string;
  showCrosshairs?: boolean;
};

function Crosshair({ className = "" }: { className?: string }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 select-none ${className}`}
    >
      <line x1="4.5" y1="0" x2="4.5" y2="9" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="4.5" x2="9" y2="4.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function GridLines({
  theme = "dark",
  onImage = false,
  variant = "frame",
  className = "",
  showCrosshairs = true,
}: GridProps) {
  if (variant === "none") return null;

  const dark = theme === "dark";
  const edge = onImage ? "border-white/15" : dark ? "border-white/10" : "border-ink/10";
  const rule = onImage ? "bg-white/15" : dark ? "bg-white/10" : "bg-ink/10";
  const crosshairColor = onImage ? "text-white/30" : dark ? "text-white/20" : "text-ink/20";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden ${className}`}
    >
      <div className={`relative mx-auto h-full w-full max-w-[1360px] border-x ${edge}`}>
        {/* Corner registration crosshairs for symmetrical CAD/architectural framing */}
        {showCrosshairs && (
          <>
            <Crosshair className={`top-0 left-0 ${crosshairColor}`} />
            <Crosshair className={`top-0 left-full ${crosshairColor}`} />
            <Crosshair className={`top-full left-0 ${crosshairColor}`} />
            <Crosshair className={`top-full left-full ${crosshairColor}`} />
          </>
        )}

        {/* Section-specific layout divisions */}
        {variant === "split-5-7" && (
          <>
            <span
              className={`absolute top-0 left-[41.6667%] hidden h-full w-px md:block ${rule}`}
            />
            {showCrosshairs && (
              <>
                <Crosshair className={`top-0 left-[41.6667%] hidden md:block ${crosshairColor}`} />
                <Crosshair
                  className={`top-full left-[41.6667%] hidden md:block ${crosshairColor}`}
                />
              </>
            )}
          </>
        )}

        {variant === "split-4-8" && (
          <>
            <span
              className={`absolute top-0 left-[33.3333%] hidden h-full w-px md:block ${rule}`}
            />
            {showCrosshairs && (
              <>
                <Crosshair className={`top-0 left-[33.3333%] hidden md:block ${crosshairColor}`} />
                <Crosshair
                  className={`top-full left-[33.3333%] hidden md:block ${crosshairColor}`}
                />
              </>
            )}
          </>
        )}

        {variant === "split-7-5" && (
          <>
            <span
              className={`absolute top-0 left-[58.3333%] hidden h-full w-px md:block ${rule}`}
            />
            {showCrosshairs && (
              <>
                <Crosshair className={`top-0 left-[58.3333%] hidden md:block ${crosshairColor}`} />
                <Crosshair
                  className={`top-full left-[58.3333%] hidden md:block ${crosshairColor}`}
                />
              </>
            )}
          </>
        )}

        {variant === "split-half" && (
          <>
            <span className={`absolute top-0 left-1/2 hidden h-full w-px md:block ${rule}`} />
            {showCrosshairs && (
              <>
                <Crosshair className={`top-0 left-1/2 hidden md:block ${crosshairColor}`} />
                <Crosshair className={`top-full left-1/2 hidden md:block ${crosshairColor}`} />
              </>
            )}
          </>
        )}

        {variant === "cols-3" && (
          <>
            <span className={`absolute top-0 left-1/3 hidden h-full w-px md:block ${rule}`} />
            <span className={`absolute top-0 left-2/3 hidden h-full w-px md:block ${rule}`} />
            {showCrosshairs && (
              <>
                <Crosshair className={`top-0 left-1/3 hidden md:block ${crosshairColor}`} />
                <Crosshair className={`top-0 left-2/3 hidden md:block ${crosshairColor}`} />
                <Crosshair className={`top-full left-1/3 hidden md:block ${crosshairColor}`} />
                <Crosshair className={`top-full left-2/3 hidden md:block ${crosshairColor}`} />
              </>
            )}
          </>
        )}

        {variant === "cols-4" && (
          <>
            <span className={`absolute top-0 left-1/4 hidden h-full w-px md:block ${rule}`} />
            <span className={`absolute top-0 left-1/2 hidden h-full w-px md:block ${rule}`} />
            <span className={`absolute top-0 left-3/4 hidden h-full w-px md:block ${rule}`} />
            {showCrosshairs && (
              <>
                <Crosshair className={`top-0 left-1/4 hidden md:block ${crosshairColor}`} />
                <Crosshair className={`top-0 left-1/2 hidden md:block ${crosshairColor}`} />
                <Crosshair className={`top-0 left-3/4 hidden md:block ${crosshairColor}`} />
                <Crosshair className={`top-full left-1/4 hidden md:block ${crosshairColor}`} />
                <Crosshair className={`top-full left-1/2 hidden md:block ${crosshairColor}`} />
                <Crosshair className={`top-full left-3/4 hidden md:block ${crosshairColor}`} />
              </>
            )}
          </>
        )}

        {variant === "hero" && (
          <>
            {/* Top architectural datum line aligning with metadata bar */}
            <div className={`absolute inset-x-0 top-20 hidden h-px md:top-24 md:block ${rule}`} />
            {showCrosshairs && (
              <>
                <Crosshair
                  className={`top-20 left-0 hidden md:top-24 md:block ${crosshairColor}`}
                />
                <Crosshair
                  className={`top-20 left-full hidden md:top-24 md:block ${crosshairColor}`}
                />
              </>
            )}
          </>
        )}

        {variant === "closing-cta" && (
          <>
            {/* Clean top datum line framing the closing statement */}
            <div className={`absolute inset-x-0 top-0 h-px ${rule}`} />
          </>
        )}
      </div>
    </div>
  );
}
