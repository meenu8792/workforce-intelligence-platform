"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export function SectionHeader({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          {icon && <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/15 to-cyan-500/15 text-blue-500">{icon}</div>}
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        </div>
        {description && <p className="text-sm text-[color:var(--text-muted)] max-w-2xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({ title, message, action, icon }: { title: string; message: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className={cn("text-center py-12 px-6")}>
      {icon && <div className="inline-flex p-3 rounded-full bg-[color:var(--bg-soft)] mb-3 text-[color:var(--text-muted)]">{icon}</div>}
      <h3 className="font-semibold text-base mb-1">{title}</h3>
      <p className="text-sm text-[color:var(--text-muted)] max-w-md mx-auto">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="space-y-1">
      <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] font-medium">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
      {hint && <div className="text-[10px] text-[color:var(--text-muted)]">{hint}</div>}
    </div>
  );
}
