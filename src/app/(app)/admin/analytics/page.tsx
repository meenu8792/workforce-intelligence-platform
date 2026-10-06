"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { KpiCard } from "@/components/KpiCard";
import { BarChart3, Users, TrendingUp, AlertTriangle, Activity, Wallet } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#22c55e"];

export default function WorkforceAnalyticsPage() {
  const { employees, attendance, range } = useScope();

  const kpis = useMemo(() => {
    const present = attendance.filter((a) => ["Present", "Late", "Half Day", "Early Checkout"].includes(a.status)).length;
    const rate = attendance.length ? (present / attendance.length) * 100 : 0;
    const high = employees.filter((e) => e.attritionRisk === "High").length;
    const cost = employees.reduce((a, b) => a + b.salary, 0);
    return { rate, high, cost, total: employees.length };
  }, [employees, attendance]);

  const byDept = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of employees) m[e.department] = (m[e.department] ?? 0) + 1;
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const byLocation = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of employees) m[e.location] = (m[e.location] ?? 0) + 1;
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const trend = useMemo(() => {
    const m: Record<string, { date: string; attendance: number; productivity: number }> = {};
    for (const a of attendance) {
      if (!m[a.date]) m[a.date] = { date: a.date, attendance: 0, productivity: 0 };
      m[a.date].attendance += a.status === "Present" || a.status === "Late" ? 1 : 0;
    }
    const empIds = new Set(employees.map((e) => e.employeeId));
    return Object.values(m).sort((a, b) => a.date.localeCompare(b.date)).slice(-21).map((d) => ({
      ...d,
      productivity: empIds.size > 0 ? (d.attendance / empIds.size) * 100 : 0,
    }));
  }, [attendance, employees]);

  const radar = useMemo(() => {
    const avg = (k: keyof typeof employees[0]) => employees.length ? (employees.reduce((a, b) => a + Number(b[k] ?? 0), 0) / employees.length) : 0;
    return [
      { metric: "Performance", value: avg("performanceScore") },
      { metric: "Attendance", value: avg("attendancePct") },
      { metric: "Engagement", value: avg("engagement") },
      { metric: "Productivity", value: avg("workHours") * 10 },
      { metric: "Skill Coverage", value: (employees.reduce((a, b) => a + b.skills.length, 0) / Math.max(1, employees.length)) * 8 },
    ];
  }, [employees]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Workforce Analytics" description="Cross-functional analytics combining attendance, performance, cost, and engagement signals." icon={<BarChart3 size={16} />} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Attendance" value={kpis.rate} suffix="%" decimals={1} icon={<Activity size={16} />} accent="blue" />
        <KpiCard label="High Risk" value={kpis.high} icon={<AlertTriangle size={16} />} accent="rose" />
        <KpiCard label="Headcount" value={kpis.total} icon={<Users size={16} />} accent="green" />
        <KpiCard label="Workforce Cost" value={kpis.cost} icon={<Wallet size={16} />} accent="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3">Attendance & Productivity Trend</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--text-muted)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="attendance" stroke="#3b82f6" fill="url(#aG)" strokeWidth={2} />
                <Area type="monotone" dataKey="productivity" stroke="#10b981" fill="url(#pG)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-[color:var(--text-muted)] mt-2">Range: {range.from} → {range.to}</p>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3">Workforce by Department</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={byDept}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="var(--text-muted)" angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {byDept.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3">Workforce by Location</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={byLocation} layout="vertical">
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="var(--text-muted)" width={80} />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="value" fill="#06b6d4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3">Workforce Health Radar</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <RadarChart data={radar}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fontSize: 10 }} stroke="var(--text-muted)" />
                <Radar name="Health" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
