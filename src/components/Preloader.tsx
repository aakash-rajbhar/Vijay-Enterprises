"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Preloader() {
  const [phase, setPhase] = useState<"loading" | "split" | "done">("loading");
  const [count, setCount] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }
    if (sessionStorage.getItem("ve-preloaded")) {
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }

    let c = 0;
    const iv = setInterval(() => {
      c += Math.random() * 18 + 12;
      if (c >= 100) {
        c = 100;
        clearInterval(iv);
        setTimeout(() => setPhase("split"), 250);
        setTimeout(() => {
          setPhase("done");
          sessionStorage.setItem("ve-preloaded", "1");
        }, 650);
      }
      setCount(Math.floor(c));
    }, 70);

    return () => clearInterval(iv);
  }, [reduced]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none" aria-hidden="true">
      <div className={`absolute inset-0 bg-ink transition-transform duration-[650ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${phase === "split" ? "-translate-x-full" : "translate-x-0"}`} />
      <div className={`absolute inset-0 bg-ink transition-transform duration-[650ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${phase === "split" ? "translate-x-full" : "translate-x-0"}`} />
      {phase === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-[2px] w-[200px] overflow-hidden bg-steel-900">
              <div className="h-full bg-spark transition-all" style={{ width: `${count}%` }} />
            </div>
            <span className="font-mono text-xs tabular-nums text-steel-300">{count.toString().padStart(2, "0")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
