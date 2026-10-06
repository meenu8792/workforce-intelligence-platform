"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { useScope } from "@/lib/selectors";
import { KpiCard } from "@/components/KpiCard";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Users, UserPlus, TrendingDown, Activity, Star, Heart, Briefcase, Brain, AlertTriangle, ArrowRight, Calendar, BarChart3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, Cell, LineChart, Line, PieChart, Pie, Legend } from "recharts";
import { useRouter } from "next/navigation";

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#22c55e"];

export default function HRDashboard() {
  const router = useRouter();
  const { employees, attendance, leaves, issues, range } = useScope();
  const todayISO = new Date().toISOString().split("T")[0];
  const todayAtt = attendance.filter((a) => a.date === todayISO);

  const kpis = useMemo(() => {
    const total = employees.length;
    const newJoiners = employees.filter((e) => {
      const d = new Date(e.joiningDate);
      const months = (new Date().getFullYear() - d.getFullYear()) * 12 + new Date().getMonth() - d.getMonth();
      return months <= 6;
    }).length;
    const attrition = total ? (employees.filter((e) => e.attritionRisk === "High").length / total) * 100 : 0;
    const present = todayAtt.filter((a) => a.status === "Present" || a.status === "Late").length;
    const onLeave = todayAtt.filter((a) => a.status === "On Leave").length;
    const absent = todayAtt.filter((a) => a.status === "Absent").length;
    const avgPerf = total ? employees.reduce((a, b) => a + b.performanceScore, 0) / total : 0;
    const avgEng = total ? employees.reduce((a, b) => a + b.engagement, 0) / total : 0;
    const gaps = employees.filter((e) => e.trainingCompleted < e.trainingRequired).length;
    return { total, newJoiners, attrition, present, onLeave, absent, avgPerf, avgEng, gaps };
  }, [employees, attendance, todayAtt]);

  const byDept = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of employees) m[e.department] = (m[e.department] ?? 0) + 1;
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [employees]);

  const trend = useMemo(() => {
    const m: Record<string, { date: string; present: number; absent: number }> = {};
    for (const a of attendance) {
      if (!m[a.date]) m[a.date] = { date: a.date, present: 0, absent: 0 };
      if (a.status === "Present" || a.status === "Late") m[a.date].present++;
      else if (a.status === "Absent") m[a.date].absent++;
    }
    return Object.values(m).sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  }, [attendance]);

  const attritionTrend = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of employees) m[e.department] = (m[e.department] ?? 0) + (e.attritionRisk === "High" ? 3 : e.attritionRisk === "Medium" ? 1 : 0);
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const perfDistribution = useMemo(() => {
    const buckets = { "0-40": 0, "40-60": 0, "60-75": 0, "75-90": 0, "90-100": 0 };
    for (const e of employees) {
      const s = e.performanceScore;
      if (s < 40) buckets["0-40"]++;
      else if (s < 60) buckets["40-60"]++;
      else if (s < 75) buckets["60-75"]++;
      else if (s < 90) buckets["75-90"]++;
      else buckets["90-100"]++;
    }
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [employees]);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="HR Analytics Dashboard" description="Company-wide workforce visibility — talent, performance, attrition, and engagement." icon={<BarChart3 size={16} />} />

      <DateRangeFilter />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total Employees" value={kpis.total} icon={<Users size={16} />} accent="blue" />
        <KpiCard label="New Joiners (6m)" value={kpis.newJoiners} icon={<UserPlus size={16} />} accent="green" />
        <KpiCard label="Attrition Risk" value={kpis.attrition} icon={<TrendingDown size={16} />} accent="rose" suffix="%" decimals={1} />
        <KpiCard label="Present Today" value={kpis.present} icon={<Activity size={16} />} accent="cyan" />
        <KpiCard label="Avg Performance" value={kpis.avgPerf} suffix="%" decimals={1} icon={<Star size={16} />} accent="purple" />
        <KpiCard label="Engagement" value={kpis.avgEng} suffix="%" decimals={1} icon={<Heart size={16} />} accent="rose" />
        <KpiCard label="Open Positions" value={12} icon={<Briefcase size={16} />} accent="amber" />
        <KpiCard label="Skill Gaps" value={kpis.gaps} icon={<Brain size={16} />} accent="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="section-card lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Attendance Trend</h3>
            <button onClick={() => router.push("/hr/attendance")} className="text-xs text-blue-500 hover:underline flex items-center gap-1">View details <ArrowRight size={11} /></button>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.5} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                  <linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} /><stop offset="100%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--text-muted)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="present" stroke="#10b981" fill="url(#p)" strokeWidth={2} name="Present" />
                <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="url(#a)" strokeWidth={2} name="Absent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Performance Distribution</h3>
            <button onClick={() => router.push("/hr/performance")} className="text-xs text-blue-500 hover:underline">Open</button>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={perfDistribution}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="var(--text-muted)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {perfDistribution.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3">Workforce by Department</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={byDept}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="var(--text-muted)" angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3">Attrition Risk by Department</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={attritionTrend} layout="vertical">
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} stroke="var(--text-muted)" width={80} />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3">Today at a glance</h3>
          <div className="space-y-2.5 text-sm">
            <DashRow label="Present" value={kpis.present} color="emerald" />
            <DashRow label="On Leave" value={kpis.onLeave} color="amber" />
            <DashRow label="Absent" value={kpis.absent} color="rose" />
            <DashRow label="Open Issues" value={issues.filter((i) => i.status !== "Resolved").length} color="blue" />
            <DashRow label="Pending Leave" value={leaves.filter((l) => l.status === "Pending").length} color="violet" />
          </div>
          <button onClick={() => router.push("/hr/issues")} className="btn btn-secondary w-full mt-4 !text-sm">Open HR Issues <ArrowRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}

function DashRow({ label, value, color }: { label: string; value: number; color: "emerald" | "amber" | "rose" | "blue" | "violet" }) {
  const map = { emerald: "bg-emerald-500", amber: "bg-amber-500", rose: "bg-rose-500", blue: "bg-blue-500", violet: "bg-violet-500" } as const;
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-[color:var(--bg-soft)]">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${map[color]}`} />
        <span className="text-[color:var(--text-muted)]">{label}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
