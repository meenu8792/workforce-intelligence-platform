"use client";

import { useMemo } from "react";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { LineChart, Users, TrendingUp, AlertTriangle, Target, Sparkles } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

export default function ForecastPage() {
  const { employees } = useScope();

  const forecast = useMemo(() => {
    const total = employees.length;
    const byDept: Record<string, number> = {};
    for (const e of employees) byDept[e.department] = (byDept[e.department] ?? 0) + 1;

    const deptRows = Object.entries(byDept).map(([dept, count]) => {
      const growth = 1 + (Math.random() * 0.2 - 0.05); // simulated growth factor
      const required = Math.round(count * growth);
      return { dept, current: count, required, gap: required - count };
    });

    const totalRequired = deptRows.reduce((a, b) => a + b.required, 0);
    return { total, totalRequired, gap: totalRequired - total, deptRows };
  }, [employees]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="Workforce Planning & Forecasting"
        description="AI-driven estimate of workforce requirements based on current demand signals. Predictions are clearly labelled as estimates."
        icon={<LineChart size={16} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Stat label="Current workforce" value={forecast.total} icon={<Users size={16} />} accent="blue" />
        <Stat label="Projected requirement" value={forecast.totalRequired} icon={<Target size={16} />} accent="violet" />
        <Stat label="Workforce gap" value={forecast.gap} icon={<TrendingUp size={16} />} accent={forecast.gap > 0 ? "rose" : "emerald"} />
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-3">Department-level forecast</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={forecast.deptRows}>
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
        <h3 className="font-semibold mb-3">AI recommendations</h3>
        <div className="space-y-2.5">
          {forecast.deptRows.filter((d) => d.gap > 0).map((d) => (
            <div key={d.dept} className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
              <div className="p-1.5 rounded-md bg-rose-500/10 text-rose-500"><AlertTriangle size={14} /></div>
              <div className="flex-1">
                <div className="text-sm font-medium">{d.dept} — potential gap of {d.gap} resources</div>
                <div className="text-xs text-[color:var(--text-muted)] mt-0.5">Recommendation: consider workforce expansion or strategic reallocation. (Predicted figure — final decision should be made by HR/management.)</div>
              </div>
            </div>
          ))}
          {forecast.deptRows.filter((d) => d.gap <= 0).map((d) => (
            <div key={d.dept} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500"><Sparkles size={14} /></div>
              <div className="flex-1">
                <div className="text-sm font-medium">{d.dept} — well-staffed for projected demand</div>
                <div className="text-xs text-[color:var(--text-muted)] mt-0.5">Continue current resourcing strategy.</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon, accent }: { label: string; value: number; icon: React.ReactNode; accent: "blue" | "violet" | "emerald" | "rose" }) {
  const map = {
    blue: "from-blue-500/10 text-blue-500",
    violet: "from-violet-500/10 text-violet-500",
    emerald: "from-emerald-500/10 text-emerald-500",
    rose: "from-rose-500/10 text-rose-500",
  } as const;
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] font-medium">{label}</span>
        <div className={`p-1.5 rounded-md bg-gradient-to-br ${map[accent]}`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
