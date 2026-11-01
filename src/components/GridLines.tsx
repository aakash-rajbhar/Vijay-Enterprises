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
  const edge = onImage
    ? "border-white/15"
    : dark
      ? "border-white/10"
      : "border-ink/10";
  const rule = onImage
    ? "bg-white/15"
    : dark
      ? "bg-white/10"
      : "bg-ink/10";
  const crosshairColor = onImage
    ? "text-white/30"
    : dark
      ? "text-white/20"
      : "text-ink/20";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden ${className}`}
    >
      <div
        className={`relative mx-auto h-full w-full max-w-[1360px] border-x ${edge}`}
      >
        {/* Corner registration crosshairs for symmetrical CAD/architectural framing */}
        {showCrosshairs && (
          <>
            <Crosshair className={`left-0 top-0 ${crosshairColor}`} />
            <Crosshair className={`left-full top-0 ${crosshairColor}`} />
            <Crosshair className={`left-0 top-full ${crosshairColor}`} />
            <Crosshair className={`left-full top-full ${crosshairColor}`} />
          </>
        )}

        {/* Section-specific layout divisions */}
        {variant === "split-5-7" && (
          <>
            <span
              className={`absolute left-[41.6667%] top-0 hidden h-full w-px md:block ${rule}`}
            />
            {showCrosshairs && (
              <>
                <Crosshair
                  className={`left-[41.6667%] top-0 hidden md:block ${crosshairColor}`}
                />
                <Crosshair
                  className={`left-[41.6667%] top-full hidden md:block ${crosshairColor}`}
                />
              </>
            )}
          </>
        )}

        {variant === "split-4-8" && (
          <>
            <span
              className={`absolute left-[33.3333%] top-0 hidden h-full w-px md:block ${rule}`}
            />
            {showCrosshairs && (
              <>
                <Crosshair
                  className={`left-[33.3333%] top-0 hidden md:block ${crosshairColor}`}
                />
                <Crosshair
                  className={`left-[33.3333%] top-full hidden md:block ${crosshairColor}`}
                />
              </>
            )}
          </>
        )}

        {variant === "split-7-5" && (
          <>
            <span
              className={`absolute left-[58.3333%] top-0 hidden h-full w-px md:block ${rule}`}
            />
            {showCrosshairs && (
              <>
                <Crosshair
                  className={`left-[58.3333%] top-0 hidden md:block ${crosshairColor}`}
                />
                <Crosshair
                  className={`left-[58.3333%] top-full hidden md:block ${crosshairColor}`}
                />
              </>
            )}
          </>
        )}

        {variant === "split-half" && (
          <>
            <span
              className={`absolute left-1/2 top-0 hidden h-full w-px md:block ${rule}`}
            />
            {showCrosshairs && (
              <>
                <Crosshair
                  className={`left-1/2 top-0 hidden md:block ${crosshairColor}`}
                />
                <Crosshair
                  className={`left-1/2 top-full hidden md:block ${crosshairColor}`}
                />
              </>
            )}
          </>
        )}

        {variant === "cols-3" && (
          <>
            <span
              className={`absolute left-1/3 top-0 hidden h-full w-px md:block ${rule}`}
            />
            <span
              className={`absolute left-2/3 top-0 hidden h-full w-px md:block ${rule}`}
            />
            {showCrosshairs && (
              <>
                <Crosshair
                  className={`left-1/3 top-0 hidden md:block ${crosshairColor}`}
                />
                <Crosshair
                  className={`left-2/3 top-0 hidden md:block ${crosshairColor}`}
                />
                <Crosshair
                  className={`left-1/3 top-full hidden md:block ${crosshairColor}`}
                />
                <Crosshair
                  className={`left-2/3 top-full hidden md:block ${crosshairColor}`}
                />
              </>
            )}
          </>
        )}

        {variant === "cols-4" && (
          <>
            <span
              className={`absolute left-1/4 top-0 hidden h-full w-px md:block ${rule}`}
            />
            <span
              className={`absolute left-1/2 top-0 hidden h-full w-px md:block ${rule}`}
            />
            <span
              className={`absolute left-3/4 top-0 hidden h-full w-px md:block ${rule}`}
            />
            {showCrosshairs && (
              <>
                <Crosshair
                  className={`left-1/4 top-0 hidden md:block ${crosshairColor}`}
                />
                <Crosshair
                  className={`left-1/2 top-0 hidden md:block ${crosshairColor}`}
                />
                <Crosshair
                  className={`left-3/4 top-0 hidden md:block ${crosshairColor}`}
                />
                <Crosshair
                  className={`left-1/4 top-full hidden md:block ${crosshairColor}`}
                />
                <Crosshair
                  className={`left-1/2 top-full hidden md:block ${crosshairColor}`}
                />
                <Crosshair
                  className={`left-3/4 top-full hidden md:block ${crosshairColor}`}
                />
              </>
            )}
          </>
        )}

        {variant === "hero" && (
          <>
            {/* Top architectural datum line aligning with metadata bar */}
            <div
              className={`absolute inset-x-0 top-20 hidden h-px md:top-24 md:block ${rule}`}
            />
            {showCrosshairs && (
              <>
                <Crosshair
                  className={`left-0 top-20 hidden md:top-24 md:block ${crosshairColor}`}
                />
                <Crosshair
                  className={`left-full top-20 hidden md:top-24 md:block ${crosshairColor}`}
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

