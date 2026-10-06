"use client";

import { useMemo } from "react";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { LineChart, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

export default function HRForecastPage() {
  const { employees } = useScope();
  const data = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of employees) map[e.department] = (map[e.department] ?? 0) + 1;
    return Object.entries(map).map(([dept, current]) => {
      const growth = 1 + (Math.random() * 0.2 - 0.05);
      const required = Math.round(current * growth);
      return { dept, current, required, gap: required - current };
    });
  }, [employees]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Workforce Forecasting" description="Project future workforce demand based on current distribution and growth signals. Predictions are clearly labelled as estimates." icon={<LineChart size={16} />} />
      <DateRangeFilter />

      <div className="section-card">
        <h3 className="font-semibold mb-3">Departmental forecast</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="dept" tick={{ fontSize: 10 }} stroke="var(--text-muted)" angle={-20} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="current" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Current" />
              <Bar dataKey="required" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Required" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Sparkles size={14} className="text-violet-500" /> AI Recommendations</h3>
        <div className="space-y-2">
          {data.map((d) => (
            <div key={d.dept} className={`p-3 rounded-xl flex items-start gap-3 ${d.gap > 0 ? "bg-rose-500/5 border border-rose-500/20" : "bg-emerald-500/5 border border-emerald-500/20"}`}>
              <div className={`p-1.5 rounded-md ${d.gap > 0 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                {d.gap > 0 ? <AlertTriangle size={14} /> : <TrendingUp size={14} />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{d.dept}</div>
                <div className="text-xs text-[color:var(--text-muted)]">
                  Current: {d.current} · Required: {d.required} · Gap: {d.gap > 0 ? `+${d.gap}` : d.gap}.
                  {" "}{d.gap > 0 ? "Recommendation: consider workforce expansion or strategic reallocation." : "Workforce level is healthy for projected demand."}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
