"use client";

import { useMemo } from "react";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Layers, Sparkles } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie } from "recharts";

export default function HRShiftsPage() {
  const { employees, shifts } = useScope();

  const shiftDist = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of employees) m[e.shift] = (m[e.shift] ?? 0) + 1;
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const overtime = useMemo(() => {
    return [...employees].sort((a, b) => b.overtime - a.overtime).slice(0, 8);
  }, [employees]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Shift Management" description="Shift allocation, rotation, overtime, and AI-recommended schedules." icon={<Layers size={16} />} />
      <DateRangeFilter />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3">Shift distribution</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={shiftDist} dataKey="value" nameKey="name" innerRadius={45} outerRadius={90} paddingAngle={2}>
                  {shiftDist.map((_, i) => <Cell key={i} fill={["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981"][i % 4]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3">Shift records in range</h3>
          <div className="space-y-2 text-sm">
            {(["Morning", "Evening", "Night", "Rotational", "Off"] as const).map((s) => {
              const count = shifts.filter((x) => x.shift === s).length;
              return (
                <div key={s} className="flex items-center justify-between p-2 rounded-lg bg-[color:var(--bg-soft)]">
                  <span className="font-medium">{s}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Sparkles size={14} className="text-violet-500" /> AI recommended allocation</h3>
          <p className="text-xs text-[color:var(--text-muted)] mb-3">Based on attendance, workload and team requirements.</p>
          <div className="space-y-2 text-sm">
            <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20">Maintain 40% Morning / 35% Evening / 15% Night / 10% Rotational split for optimal coverage.</div>
            <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">Reassign {overtime[0]?.name ?? "high-overtime employees"} from Night shift to reduce burnout risk.</div>
            <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">Consider rotational shift for newly-joined employees for skill breadth.</div>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-3">Top overtime contributors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {overtime.map((e) => (
            <div key={e.id} className="p-3 rounded-xl bg-[color:var(--bg-soft)] flex items-center gap-3">
              <Avatar name={e.name} size={36} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{e.name}</div>
                <div className="text-[10px] text-[color:var(--text-muted)]">{e.shift} · {e.project}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-amber-500">{e.overtime}h</div>
                <div className="text-[10px] text-[color:var(--text-muted)]">OT</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
