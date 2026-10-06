"use client";

import { useMemo } from "react";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Avatar } from "@/components/Avatar";
import { AlertTriangle, Sparkles, TrendingDown } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export default function HRAttritionPage() {
  const { employees } = useScope();

  const dist = useMemo(() => {
    const m = { Low: 0, Medium: 0, High: 0 };
    for (const e of employees) m[e.attritionRisk]++;
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const high = useMemo(() => employees.filter((e) => e.attritionRisk === "High").sort((a, b) => b.performanceScore - a.performanceScore), [employees]);
  const medium = useMemo(() => employees.filter((e) => e.attritionRisk === "Medium").slice(0, 10), [employees]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Attrition Analytics" description="Predicted attrition risk based on performance, attendance, engagement, workload, and tenure signals." icon={<AlertTriangle size={16} />} />
      <DateRangeFilter />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3">Risk distribution</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dist} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85} paddingAngle={2}>
                  {dist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {dist.map((d, i) => (
              <div key={d.name} className="text-center p-2 rounded-lg bg-[color:var(--bg-soft)]">
                <div className="text-xs text-[color:var(--text-muted)]">{d.name}</div>
                <div className="text-lg font-bold" style={{ color: COLORS[i] }}>{d.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card lg:col-span-2">
          <h3 className="font-semibold mb-3">High-risk employees</h3>
          <p className="text-xs text-[color:var(--text-muted)] mb-3">Predicted risk — final decision should be made by HR/management.</p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {high.map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20">
                <Avatar name={e.name} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{e.name}</div>
                  <div className="text-[11px] text-[color:var(--text-muted)]">{e.department} · {e.yearsOfExperience}y exp · {e.attendancePct}% att</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {e.performanceScore < 70 && <span className="badge badge-warning !text-[9px]">Low perf</span>}
                    {e.engagement < 60 && <span className="badge badge-warning !text-[9px]">Low engagement</span>}
                    {e.overtime > 20 && <span className="badge badge-warning !text-[9px]">High overtime</span>}
                    {e.attendancePct < 80 && <span className="badge badge-warning !text-[9px]">Low attendance</span>}
                  </div>
                </div>
                <span className="badge badge-danger">High risk</span>
              </div>
            ))}
            {high.length === 0 && <p className="text-sm text-[color:var(--text-muted)] text-center py-4">No high-risk employees identified.</p>}
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Sparkles size={14} className="text-violet-500" /> AI Retention Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: "Improve engagement", desc: "Conduct stay interviews and pulse surveys for high-risk employees." },
            { title: "Balance workload", desc: "Identify employees with sustained overtime and rebalance assignments." },
            { title: "Recognition program", desc: "Roll out a recognition program for medium-risk high performers." },
            { title: "Career pathing", desc: "Define clear growth paths for employees with 2+ years tenure." },
            { title: "Skill investment", desc: "Fund training programs for the most at-risk skill clusters." },
            { title: "Comp review", desc: "Benchmark compensation for high-performers in high-risk segments." },
          ].map((r) => (
            <div key={r.title} className="p-3 rounded-xl bg-[color:var(--bg-soft)] hover:bg-violet-500/5 transition">
              <div className="text-sm font-semibold mb-1">{r.title}</div>
              <div className="text-xs text-[color:var(--text-muted)]">{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
