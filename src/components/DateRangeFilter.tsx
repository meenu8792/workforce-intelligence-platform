"use client";

import { useApp } from "@/lib/store";
import { Calendar, RotateCcw, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { todayISO, isoDaysAgo } from "@/lib/utils";

const QUICK = [
  { label: "Today", get: () => ({ from: todayISO(), to: todayISO() }) },
  { label: "Yesterday", get: () => ({ from: isoDaysAgo(1), to: isoDaysAgo(1) }) },
  { label: "Last 7 Days", get: () => ({ from: isoDaysAgo(6), to: todayISO() }) },
  { label: "Last 30 Days", get: () => ({ from: isoDaysAgo(29), to: todayISO() }) },
  { label: "This Month", get: () => {
      const d = new Date(); const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, "0");
      return { from: `${y}-${m}-01`, to: todayISO() };
  } },
  { label: "Last Month", get: () => {
      const d = new Date(); d.setDate(0); const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, "0");
      return { from: `${y}-${m}-01`, to: new Date(y, d.getMonth() + 1, 0).toISOString().split("T")[0] };
  } },
  { label: "This Quarter", get: () => {
      const d = new Date(); const q = Math.floor(d.getMonth() / 3);
      const start = new Date(d.getFullYear(), q * 3, 1);
      return { from: start.toISOString().split("T")[0], to: todayISO() };
  } },
  { label: "This Year", get: () => ({ from: `${new Date().getFullYear()}-01-01`, to: todayISO() }) },
];

export function DateRangeFilter({ onSearch, query, onQueryChange, showSearch = true }: {
  onSearch?: () => void;
  query?: string;
  onQueryChange?: (v: string) => void;
  showSearch?: boolean;
}) {
  const range = useApp((s) => s.dateRange);
  const setRange = useApp((s) => s.setDateRange);
  const [from, setFrom] = useState(range.from);
  const [to, setTo] = useState(range.to);

  useEffect(() => { setFrom(range.from); setTo(range.to); }, [range.from, range.to]);

  const apply = () => {
    setRange({ from, to });
    if (onSearch) onSearch();
  };

  const reset = () => {
    const def = { from: isoDaysAgo(29), to: todayISO() };
    setFrom(def.from); setTo(def.to);
    setRange(def);
  };

  return (
    <div className="section-card !p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={16} className="text-blue-500" />
        <span className="font-semibold text-sm">Custom Date Range</span>
        <span className="ml-auto text-xs text-[color:var(--text-muted)]">
          {range.from} → {range.to}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="input !w-auto !py-2 !text-sm" />
        <span className="text-[color:var(--text-muted)] text-sm">to</span>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="input !w-auto !py-2 !text-sm" />
        <button onClick={apply} className="btn btn-primary !py-2 !text-sm">Apply</button>
        <button onClick={reset} className="btn btn-secondary !py-2 !text-sm">
          <RotateCcw size={14} /> Reset
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {QUICK.map((q) => (
          <button
            key={q.label}
            onClick={() => { const r = q.get(); setFrom(r.from); setTo(r.to); setRange(r); if (onSearch) onSearch(); }}
            className="tag hover:!border-blue-500 hover:!text-blue-500 transition cursor-pointer"
          >
            {q.label}
          </button>
        ))}
      </div>
      {showSearch && (
        <div className="mt-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" />
            <input
              value={query ?? ""}
              onChange={(e) => onQueryChange?.(e.target.value)}
              placeholder="Search by name, ID, department, skill..."
              className="input pl-9 !py-2 !text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
