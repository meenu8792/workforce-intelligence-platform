"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { useScope } from "@/lib/selectors";
import { KpiCard } from "@/components/KpiCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Avatar } from "@/components/Avatar";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import {
  Users, UserCheck, Building2, Activity, TrendingDown, Wallet, Star, AlertTriangle,
  Database, Sparkles, ShieldCheck, Server, Cpu, FileBarChart, ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useRouter } from "next/navigation";

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#22c55e"];

export default function AdminDashboard() {
  const router = useRouter();
  const { employees, attendance, leaves, issues, range } = useScope();
  const meta = useApp((s) => s.datasetMeta);
  const audit = useApp((s) => s.audit);

  const kpis = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === "Active").length;
    const departments = new Set(employees.map((e) => e.department)).size;
    const presentDays = attendance.filter((a) => ["Present", "Late", "Half Day", "Early Checkout"].includes(a.status)).length;
    const attendanceRate = attendance.length ? (presentDays / attendance.length) * 100 : 0;
    const attritionRate = total ? (employees.filter((e) => e.attritionRisk === "High").length / total) * 100 : 0;
    const workforceCost = employees.reduce((a, b) => a + b.salary, 0);
    const avgPerformance = total ? employees.reduce((a, b) => a + b.performanceScore, 0) / total : 0;
    const gaps = employees.filter((e) => e.performanceScore < 70 || e.attritionRisk === "High").length;
    return { total, active, departments, attendanceRate, attritionRate, workforceCost, avgPerformance, gaps };
  }, [employees, attendance]);

  const departmentChart = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of employees) m[e.department] = (m[e.department] ?? 0) + 1;
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const attendanceTrend = useMemo(() => {
    const m: Record<string, { present: number; absent: number; date: string }> = {};
    for (const a of attendance) {
      const d = a.date;
      if (!m[d]) m[d] = { present: 0, absent: 0, date: d };
      if (["Present", "Late", "Half Day", "Early Checkout"].includes(a.status)) m[d].present++;
      else if (a.status === "Absent") m[d].absent++;
    }
    return Object.values(m).sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  }, [attendance]);

  const recentAudit = audit.slice(0, 6);
  const pendingIssues = issues.filter((i) => i.status !== "Resolved").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="System Admin Control Center"
        description="Centralized view of the entire platform. Upload datasets, monitor health, manage users, and oversee every workforce module."
        action={
          <button onClick={() => router.push("/admin/dataset")} className="btn btn-primary">
            <Database size={16} /> Upload Dataset
          </button>
        }
        icon={<Sparkles size={16} />}
      />

      <DateRangeFilter />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total Employees" value={kpis.total} icon={<Users size={16} />} accent="blue" />
        <KpiCard label="Active Employees" value={kpis.active} icon={<UserCheck size={16} />} accent="green" />
        <KpiCard label="Departments" value={kpis.departments} icon={<Building2 size={16} />} accent="purple" />
        <KpiCard label="Attendance Rate" value={kpis.attendanceRate} icon={<Activity size={16} />} accent="cyan" suffix="%" decimals={1} />
        <KpiCard label="Attrition Rate" value={kpis.attritionRate} icon={<TrendingDown size={16} />} accent="rose" suffix="%" decimals={1} />
        <KpiCard label="Workforce Cost" value={kpis.workforceCost} icon={<Wallet size={16} />} accent="amber" />
        <KpiCard label="Avg. Performance" value={kpis.avgPerformance} icon={<Star size={16} />} accent="green" suffix="%" decimals={1} />
        <KpiCard label="Workforce Gaps" value={kpis.gaps} icon={<AlertTriangle size={16} />} accent="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="section-card lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Attendance Trend</h3>
              <p className="text-xs text-[color:var(--text-muted)]">Last 14 days · based on current dataset ({range.from} → {range.to})</p>
            </div>
            <Activity size={18} className="text-cyan-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="presentG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="absentG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="present" stroke="#3b82f6" fill="url(#presentG)" strokeWidth={2} />
                <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="url(#absentG)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Workforce by Department</h3>
              <p className="text-xs text-[color:var(--text-muted)]">Distribution across organisation</p>
            </div>
            <Building2 size={18} className="text-violet-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={departmentChart} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85} paddingAngle={2}>
                  {departmentChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {departmentChart.slice(0, 8).map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="truncate">{d.name}</span>
                <span className="ml-auto text-[color:var(--text-muted)]">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="section-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">System Health</h3>
            <span className="badge badge-success"><span className="live-dot" /> Operational</span>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { name: "Database", value: "Connected", icon: Server, color: "text-emerald-500" },
              { name: "Authentication", value: "Active", icon: ShieldCheck, color: "text-emerald-500" },
              { name: "AI Engine", value: "Ready", icon: Cpu, color: "text-blue-500" },
              { name: "Last Backup", value: "2 hrs ago", icon: Database, color: "text-violet-500" },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[color:var(--text-muted)]"><s.icon size={14} /> {s.name}</span>
                <span className={`font-medium ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
          <button onClick={() => router.push("/admin/system")} className="btn btn-secondary w-full mt-4 !text-sm">View System Health <ArrowRight size={14} /></button>
        </div>

        <div className="section-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Dataset Status</h3>
            <Database size={18} className="text-blue-500" />
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between"><span className="text-[color:var(--text-muted)]">Source file</span><span className="font-medium text-xs">{meta?.fileName}</span></div>
            <div className="flex items-center justify-between"><span className="text-[color:var(--text-muted)]">Records</span><span className="font-medium">{meta?.records.toLocaleString()}</span></div>
            <div className="flex items-center justify-between"><span className="text-[color:var(--text-muted)]">Valid</span><span className="font-medium text-emerald-500">{meta?.validRecords.toLocaleString()}</span></div>
            <div className="flex items-center justify-between"><span className="text-[color:var(--text-muted)]">Duplicates</span><span className="font-medium text-amber-500">{meta?.duplicates}</span></div>
            <div className="flex items-center justify-between"><span className="text-[color:var(--text-muted)]">Missing</span><span className="font-medium text-rose-500">{meta?.missing}</span></div>
            <div className="flex items-center justify-between"><span className="text-[color:var(--text-muted)]">Last update</span><span className="font-medium text-xs">{meta ? new Date(meta.uploadedOn).toLocaleString() : "—"}</span></div>
          </div>
          <button onClick={() => router.push("/admin/dataset")} className="btn btn-secondary w-full mt-4 !text-sm">Manage Dataset <ArrowRight size={14} /></button>
        </div>

        <div className="section-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Pending Items</h3>
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <div className="space-y-2.5">
            <button onClick={() => router.push("/admin/audit")} className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[color:var(--bg-soft)] hover:bg-amber-500/10 transition">
              <span className="text-sm">Pending HR Issues</span>
              <span className="badge badge-warning">{pendingIssues}</span>
            </button>
            <button onClick={() => router.push("/admin/audit")} className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[color:var(--bg-soft)] hover:bg-blue-500/10 transition">
              <span className="text-sm">Audit Events</span>
              <span className="badge badge-info">{audit.length}</span>
            </button>
            <button onClick={() => router.push("/admin/users")} className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[color:var(--bg-soft)] hover:bg-violet-500/10 transition">
              <span className="text-sm">User Accounts</span>
              <span className="badge badge-purple">Manage</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="section-card lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Activity</h3>
            <button onClick={() => router.push("/admin/audit")} className="text-xs text-blue-500 hover:underline">View all</button>
          </div>
          <div className="space-y-2.5">
            {recentAudit.map((a) => (
              <div key={a.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-[color:var(--bg-soft)]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center text-xs font-semibold">
                  {a.actor.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{a.action}</div>
                  <div className="text-xs text-[color:var(--text-muted)]">{a.actor} · {a.role} · {new Date(a.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
            {recentAudit.length === 0 && <div className="text-sm text-[color:var(--text-muted)] text-center py-6">No recent activity.</div>}
          </div>
        </div>

        <div className="section-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Quick Actions</h3>
            <Sparkles size={18} className="text-violet-500" />
          </div>
          <div className="space-y-2">
            {[
              { label: "Upload workforce data", icon: Database, href: "/admin/dataset", color: "blue" },
              { label: "Add new employee", icon: Users, href: "/admin/employees", color: "green" },
              { label: "Generate report", icon: FileBarChart, href: "/admin/reports", color: "violet" },
              { label: "Review audit logs", icon: ShieldCheck, href: "/admin/audit", color: "amber" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => router.push(a.href)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-lg bg-[color:var(--bg-soft)] hover:bg-[color:var(--bg-elev)] border border-[color:var(--border)] hover:border-blue-500 transition text-left"
              >
                <div className={`p-1.5 rounded-md bg-${a.color}-500/10 text-${a.color}-500`}><a.icon size={14} /></div>
                <span className="text-sm font-medium">{a.label}</span>
                <ArrowRight size={14} className="ml-auto text-[color:var(--text-muted)]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
