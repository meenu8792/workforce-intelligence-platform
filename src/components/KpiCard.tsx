"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export function KpiCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
  accent = "blue",
  suffix,
  decimals = 0,
}: {
  label: string;
  value: number;
  icon?: ReactNode;
  trend?: number;
  trendLabel?: string;
  accent?: "blue" | "green" | "amber" | "rose" | "purple" | "cyan";
  suffix?: string;
  decimals?: number;
}) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const from = displayed;
    const to = value;
    const dur = 700;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const accents: Record<string, string> = {
    blue: "from-blue-500/15 to-blue-500/0 text-blue-500",
    green: "from-emerald-500/15 to-emerald-500/0 text-emerald-500",
    amber: "from-amber-500/15 to-amber-500/0 text-amber-500",
    rose: "from-rose-500/15 to-rose-500/0 text-rose-500",
    purple: "from-violet-500/15 to-violet-500/0 text-violet-500",
    cyan: "from-cyan-500/15 to-cyan-500/0 text-cyan-500",
  };

  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] font-medium">{label}</span>
        {icon && (
          <div className={cn("p-2 rounded-lg bg-gradient-to-br", accents[accent])}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <div className="text-2xl font-bold tracking-tight">
          {decimals === 0 ? Math.round(displayed).toLocaleString() : displayed.toFixed(decimals)}
          {suffix && <span className="text-sm font-medium text-[color:var(--text-muted)] ml-0.5">{suffix}</span>}
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          <span className={cn("inline-flex items-center gap-0.5 font-medium", trend >= 0 ? "text-emerald-500" : "text-rose-500")}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
          {trendLabel && <span className="text-[color:var(--text-muted)]">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
