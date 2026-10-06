"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { Building2, Users, Wallet, TrendingUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#22c55e", "#a855f7", "#0ea5e9"];

export default function DepartmentsPage() {
  const employees = useApp((s) => s.employees);

  const data = useMemo(() => {
    const map: Record<string, { name: string; count: number; cost: number; performance: number; totalP: number }> = {};
    for (const e of employees) {
      if (!map[e.department]) map[e.department] = { name: e.department, count: 0, cost: 0, performance: 0, totalP: 0 };
      map[e.department].count++;
      map[e.department].cost += e.salary;
      map[e.department].performance += e.performanceScore;
      map[e.department].totalP++;
    }
    return Object.values(map).map((d) => ({ ...d, avgPerformance: d.totalP ? d.performance / d.totalP : 0 })).sort((a, b) => b.count - a.count);
  }, [employees]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Departments" description="Distribution, cost and performance across organisational departments." icon={<Building2 size={16} />} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((d, i) => (
          <div key={d.name} className="section-card !p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{d.name}</h3>
                <p className="text-xs text-[color:var(--text-muted)]">{d.count} employees</p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${COLORS[i % COLORS.length]}20`, color: COLORS[i % COLORS.length] }}>
                <Building2 size={16} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-xs text-[color:var(--text-muted)] flex items-center gap-1"><Users size={11} /> Headcount</div>
                <div className="text-lg font-bold mt-0.5">{d.count}</div>
              </div>
              <div>
                <div className="text-xs text-[color:var(--text-muted)] flex items-center gap-1"><Wallet size={11} /> Cost</div>
                <div className="text-lg font-bold mt-0.5">{formatCurrency(d.cost, true)}</div>
              </div>
              <div>
                <div className="text-xs text-[color:var(--text-muted)] flex items-center gap-1"><TrendingUp size={11} /> Avg perf</div>
                <div className="text-lg font-bold mt-0.5">{d.avgPerformance.toFixed(0)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-3">Headcount by department</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 30 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--text-muted)" angle={-20} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
