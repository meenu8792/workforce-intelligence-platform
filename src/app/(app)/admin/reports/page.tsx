"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { FileBarChart, Download, Printer, Search, BarChart3, Users, Calendar, Wallet, TrendingUp, AlertTriangle, Layers, Activity, Briefcase } from "lucide-react";
import { useApp } from "@/lib/store";
import { useScope } from "@/lib/selectors";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie } from "recharts";

type ReportKey = "attendance" | "leave" | "overtime" | "performance" | "attrition" | "shift" | "payroll" | "department" | "skillgap" | "forecast";

const REPORTS: { key: ReportKey; title: string; desc: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string }[] = [
  { key: "attendance", title: "Attendance Report", desc: "Present, absent, late, and patterns.", icon: Calendar, color: "from-blue-500/15 to-cyan-500/15 text-blue-500" },
  { key: "leave", title: "Leave Summary", desc: "Approved, pending and rejected leave.", icon: Calendar, color: "from-emerald-500/15 to-teal-500/15 text-emerald-500" },
  { key: "overtime", title: "Overtime Report", desc: "Overtime hours and distribution.", icon: Activity, color: "from-amber-500/15 to-orange-500/15 text-amber-500" },
  { key: "performance", title: "Performance Report", desc: "Performance scores and KPI achievement.", icon: TrendingUp, color: "from-violet-500/15 to-purple-500/15 text-violet-500" },
  { key: "attrition", title: "Attrition Report", desc: "Predicted attrition risk distribution.", icon: AlertTriangle, color: "from-rose-500/15 to-pink-500/15 text-rose-500" },
  { key: "shift", title: "Shift Utilisation", desc: "Shift allocation and utilisation.", icon: Layers, color: "from-cyan-500/15 to-blue-500/15 text-cyan-500" },
  { key: "payroll", title: "Payroll Summary", desc: "Salary inputs, incentives, deductions.", icon: Wallet, color: "from-emerald-500/15 to-green-500/15 text-emerald-500" },
  { key: "department", title: "Department Performance", desc: "Departmental performance and cost.", icon: Briefcase, color: "from-indigo-500/15 to-blue-500/15 text-indigo-500" },
  { key: "skillgap", title: "Skill Gap Report", desc: "Skills in demand vs supply.", icon: BarChart3, color: "from-fuchsia-500/15 to-pink-500/15 text-fuchsia-500" },
  { key: "forecast", title: "Workforce Forecast", desc: "Projected workforce requirement.", icon: TrendingUp, color: "from-sky-500/15 to-blue-500/15 text-sky-500" },
];

export default function AdminReportsPage() {
  const [active, setActive] = useState<ReportKey | null>(null);
  const { employees, attendance, leaves, salaries, range } = useScope();

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Reports" description="Generate, export, and print detailed workforce reports. All reports respect the active date range." icon={<FileBarChart size={16} />} />

      <DateRangeFilter />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {REPORTS.map((r) => (
          <button key={r.key} onClick={() => setActive(r.key)} className="section-card !p-4 text-left hover:!border-blue-500 transition group">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-3`}>
              <r.icon size={18} />
            </div>
            <div className="font-semibold text-sm group-hover:text-blue-500 transition">{r.title}</div>
            <div className="text-xs text-[color:var(--text-muted)] mt-1">{r.desc}</div>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-blue-500 font-medium">
              <Download size={12} /> Open report
            </div>
          </button>
        ))}
      </div>

      {active && <ReportView reportKey={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function ReportView({ reportKey, onClose }: { reportKey: ReportKey; onClose: () => void }) {
  const { employees, attendance, leaves, salaries } = useScope();
  const report = REPORTS.find((r) => r.key === reportKey)!;

  const exportCSV = (rows: (string | number)[][], filename: string) => {
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    if (reportKey === "attendance") {
      const inRange = attendance;
      const present = inRange.filter((a) => a.status === "Present").length;
      const absent = inRange.filter((a) => a.status === "Absent").length;
      const late = inRange.filter((a) => a.status === "Late").length;
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-3 text-sm">
            <Stat label="Total" value={inRange.length} />
            <Stat label="Present" value={present} color="emerald" />
            <Stat label="Absent" value={absent} color="rose" />
            <Stat label="Late" value={late} color="amber" />
          </div>
          <div className="overflow-x-auto rounded-lg border border-[color:var(--border)]">
            <table className="table">
              <thead><tr><th>Employee</th><th>Date</th><th>Status</th><th>Source</th></tr></thead>
              <tbody>
                {inRange.slice(0, 25).map((a) => {
                  const e = employees.find((x) => x.employeeId === a.employeeId);
                  return (
                    <tr key={a.id}><td>{e?.name ?? a.employeeId}</td><td>{a.date}</td><td><span className="badge badge-info">{a.status}</span></td><td>{a.source ?? "—"}</td></tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button className="btn btn-secondary !text-sm" onClick={() => exportCSV([["Employee","Date","Status","Source"], ...attendance.slice(0, 500).map((a) => [employees.find((e) => e.employeeId === a.employeeId)?.name ?? a.employeeId, a.date, a.status, a.source ?? ""])], "attendance.csv")}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      );
    }
    if (reportKey === "leave") {
      const byStatus = { Approved: 0, Pending: 0, Rejected: 0 };
      for (const l of leaves) byStatus[l.status]++;
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <Stat label="Approved" value={byStatus.Approved} color="emerald" />
            <Stat label="Pending" value={byStatus.Pending} color="amber" />
            <Stat label="Rejected" value={byStatus.Rejected} color="rose" />
          </div>
          <div className="overflow-x-auto rounded-lg border border-[color:var(--border)]">
            <table className="table">
              <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr></thead>
              <tbody>
                {leaves.slice(0, 30).map((l) => (
                  <tr key={l.id}><td>{l.employeeName}</td><td>{l.type}</td><td>{l.fromDate}</td><td>{l.toDate}</td><td>{l.days}</td><td><span className={`badge ${l.status === "Approved" ? "badge-success" : l.status === "Rejected" ? "badge-danger" : "badge-warning"}`}>{l.status}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (reportKey === "overtime") {
      const sorted = [...employees].sort((a, b) => b.overtime - a.overtime).slice(0, 15);
      return (
        <div className="space-y-3">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={sorted}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="var(--text-muted)" angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="overtime" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto rounded-lg border border-[color:var(--border)]">
            <table className="table">
              <thead><tr><th>Employee</th><th>Department</th><th>Overtime (hrs)</th></tr></thead>
              <tbody>
                {sorted.map((e) => <tr key={e.id}><td>{e.name}</td><td>{e.department}</td><td>{e.overtime}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (reportKey === "performance") {
      const buckets = { "0-40": 0, "40-60": 0, "60-75": 0, "75-90": 0, "90-100": 0 };
      for (const e of employees) {
        const s = e.performanceScore;
        if (s < 40) buckets["0-40"]++;
        else if (s < 60) buckets["40-60"]++;
        else if (s < 75) buckets["60-75"]++;
        else if (s < 90) buckets["75-90"]++;
        else buckets["90-100"]++;
      }
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2 text-sm">
            {Object.entries(buckets).map(([k, v]) => <Stat key={k} label={k} value={v} />)}
          </div>
          <div className="overflow-x-auto rounded-lg border border-[color:var(--border)]">
            <table className="table">
              <thead><tr><th>Employee</th><th>Department</th><th>Performance</th><th>Attendance</th></tr></thead>
              <tbody>
                {[...employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 20).map((e) => (
                  <tr key={e.id}><td>{e.name}</td><td>{e.department}</td><td><span className="font-medium text-emerald-500">{e.performanceScore}%</span></td><td>{e.attendancePct}%</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (reportKey === "attrition") {
      const high = employees.filter((e) => e.attritionRisk === "High").length;
      const med = employees.filter((e) => e.attritionRisk === "Medium").length;
      const low = employees.length - high - med;
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <Stat label="Low" value={low} color="emerald" />
            <Stat label="Medium" value={med} color="amber" />
            <Stat label="High" value={high} color="rose" />
          </div>
          <div className="overflow-x-auto rounded-lg border border-[color:var(--border)]">
            <table className="table">
              <thead><tr><th>Employee</th><th>Department</th><th>Tenure</th><th>Performance</th><th>Risk</th></tr></thead>
              <tbody>
                {employees.filter((e) => e.attritionRisk !== "Low").slice(0, 30).map((e) => (
                  <tr key={e.id}><td>{e.name}</td><td>{e.department}</td><td>{e.yearsOfExperience}y</td><td>{e.performanceScore}%</td><td><span className={`badge ${e.attritionRisk === "High" ? "badge-danger" : "badge-warning"}`}>{e.attritionRisk}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (reportKey === "shift") {
      const counts: Record<string, number> = {};
      for (const e of employees) counts[e.shift] = (counts[e.shift] ?? 0) + 1;
      const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
      return (
        <div className="space-y-3">
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                  {data.map((_, i) => <Cell key={i} fill={["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981"][i % 4]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }
    if (reportKey === "payroll") {
      const total = salaries.reduce((a, b) => a + b.netPay, 0);
      const base = salaries.reduce((a, b) => a + b.baseSalary, 0);
      const ot = salaries.reduce((a, b) => a + b.overtime, 0);
      const inc = salaries.reduce((a, b) => a + b.incentives, 0);
      const bon = salaries.reduce((a, b) => a + b.bonus, 0);
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <Stat label="Base" value={`₹${(base / 1e5).toFixed(0)}L`} />
            <Stat label="Overtime" value={`₹${(ot / 1e5).toFixed(0)}L`} color="amber" />
            <Stat label="Incentives" value={`₹${(inc / 1e5).toFixed(0)}L`} color="blue" />
            <Stat label="Bonus" value={`₹${(bon / 1e5).toFixed(0)}L`} color="emerald" />
          </div>
          <div className="text-sm">Total payroll input: <span className="font-bold text-emerald-500">₹{(total / 1e5).toFixed(1)}L</span></div>
          <p className="text-xs text-[color:var(--text-muted)]">Note: this represents payroll INPUTS derived from attendance, overtime, incentives and bonuses. Actual payroll processing is not performed unless a real payroll integration is configured.</p>
        </div>
      );
    }
    if (reportKey === "department") {
      const data = Array.from(new Set(employees.map((e) => e.department))).map((dept) => {
        const list = employees.filter((e) => e.department === dept);
        return { dept, count: list.length, avgPerf: list.length ? list.reduce((a, b) => a + b.performanceScore, 0) / list.length : 0, cost: list.reduce((a, b) => a + b.salary, 0) };
      });
      return (
        <div className="overflow-x-auto rounded-lg border border-[color:var(--border)]">
          <table className="table">
            <thead><tr><th>Department</th><th>Headcount</th><th>Avg Performance</th><th>Cost</th></tr></thead>
            <tbody>
              {data.map((d) => <tr key={d.dept}><td className="font-medium">{d.dept}</td><td>{d.count}</td><td>{d.avgPerf.toFixed(0)}%</td><td>₹{(d.cost / 1e5).toFixed(1)}L</td></tr>)}
            </tbody>
          </table>
        </div>
      );
    }
    if (reportKey === "skillgap") {
      const counts: Record<string, number> = {};
      for (const e of employees) for (const s of e.skills) counts[s] = (counts[s] ?? 0) + 1;
      const data = Object.entries(counts).sort((a, b) => a[1] - b[1]).slice(0, 15);
      return (
        <div className="overflow-x-auto rounded-lg border border-[color:var(--border)]">
          <table className="table">
            <thead><tr><th>Skill</th><th>Available</th><th>Gap indication</th></tr></thead>
            <tbody>
              {data.map(([s, c]) => (
                <tr key={s}><td className="font-medium">{s}</td><td>{c}</td><td><span className={`badge ${c < 5 ? "badge-danger" : c < 12 ? "badge-warning" : "badge-success"}`}>{c < 5 ? "High gap" : c < 12 ? "Medium gap" : "Adequate"}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (reportKey === "forecast") {
      return (
        <div className="space-y-3">
          <p className="text-sm">Current workforce: <b>{employees.length}</b>. Projected requirement (15% growth model): <b>{Math.round(employees.length * 1.15)}</b>. Potential gap: <b className="text-rose-500">+{Math.round(employees.length * 0.15)}</b>.</p>
          <p className="text-xs text-[color:var(--text-muted)]">Predicted figure — final decision should be made by HR/management.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="section-card animate-scale-in">
      <div className="flex items-start justify-between mb-4 pb-4 border-b border-[color:var(--border)]">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center`}>
            <report.icon size={18} />
          </div>
          <div>
            <h3 className="font-semibold">{report.title}</h3>
            <p className="text-xs text-[color:var(--text-muted)]">{report.desc}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn btn-secondary !text-sm"><Printer size={14} /> Print</button>
          <button onClick={onClose} className="btn btn-ghost !text-sm">Close</button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: React.ReactNode; color?: "emerald" | "amber" | "rose" | "blue" }) {
  const map = { emerald: "text-emerald-500", amber: "text-amber-500", rose: "text-rose-500", blue: "text-blue-500" } as const;
  return (
    <div className="rounded-lg bg-[color:var(--bg-soft)] p-3 text-center">
      <div className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider font-medium">{label}</div>
      <div className={`text-lg font-bold mt-0.5 ${color ? map[color] : ""}`}>{value}</div>
    </div>
  );
}
