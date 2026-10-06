"use client";

import { useMemo, useState } from "react";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Avatar } from "@/components/Avatar";
import { KpiCard } from "@/components/KpiCard";
import { CalendarCheck, AlertTriangle, ScanLine, Fingerprint, MapPin, Camera } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

export default function HRAttendancePage() {
  const { employees, attendance, range } = useScope();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("all");

  const departments = useMemo(() => Array.from(new Set(employees.map((e) => e.department))).sort(), [employees]);

  const kpis = useMemo(() => {
    const inRange = attendance;
    const present = inRange.filter((a) => a.status === "Present" || a.status === "Late" || a.status === "Half Day" || a.status === "Early Checkout").length;
    const absent = inRange.filter((a) => a.status === "Absent").length;
    const late = inRange.filter((a) => a.status === "Late").length;
    const halfDay = inRange.filter((a) => a.status === "Half Day").length;
    const rate = inRange.length ? (present / inRange.length) * 100 : 0;
    return { present, absent, late, halfDay, rate, total: inRange.length };
  }, [attendance]);

  const sourceDist = useMemo(() => {
    const m: Record<string, number> = {};
    for (const a of attendance) {
      const k = a.source ?? "Manual";
      m[k] = (m[k] ?? 0) + 1;
    }
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [attendance]);

  const anomalies = useMemo(() => {
    // Heuristic: employees with repeated late/absent in the range
    const byEmp: Record<string, { id: string; late: number; absent: number }> = {};
    for (const a of attendance) {
      if (!byEmp[a.employeeId]) byEmp[a.employeeId] = { id: a.employeeId, late: 0, absent: 0 };
      if (a.status === "Late") byEmp[a.employeeId].late++;
      if (a.status === "Absent") byEmp[a.employeeId].absent++;
    }
    return Object.values(byEmp)
      .filter((x) => x.late >= 3 || x.absent >= 2)
      .map((x) => ({ ...x, employee: employees.find((e) => e.employeeId === x.id) }))
      .filter((x) => x.employee)
      .slice(0, 8);
  }, [attendance, employees]);

  const filtered = useMemo(() => {
    return employees
      .filter((e) => dept === "all" || e.department === dept)
      .filter((e) => !query || [e.name, e.employeeId, e.email, e.department].some((s) => String(s).toLowerCase().includes(query.toLowerCase())))
      .slice(0, 25);
  }, [employees, dept, query]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Attendance Management" description="Track present, absent, late, and overtime across the entire organisation. Supports biometric, face, GPS and QR check-ins." icon={<CalendarCheck size={16} />} />

      <DateRangeFilter query={query} onQueryChange={setQuery} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="Present" value={kpis.present} accent="green" />
        <KpiCard label="Absent" value={kpis.absent} accent="rose" />
        <KpiCard label="Late" value={kpis.late} accent="amber" />
        <KpiCard label="Half Day" value={kpis.halfDay} accent="cyan" />
        <KpiCard label="Attendance %" value={kpis.rate} suffix="%" decimals={1} accent="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3">Attendance Sources</h3>
          <p className="text-xs text-[color:var(--text-muted)] mb-2">Distribution by check-in method (simulated).</p>
          <div className="space-y-2">
            {sourceDist.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  {s.name === "Biometric" ? <Fingerprint size={14} /> : s.name === "Face" ? <Camera size={14} /> : s.name === "GPS" ? <MapPin size={14} /> : s.name === "QR" ? <ScanLine size={14} /> : <CalendarCheck size={14} />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="progress-bar mt-1"><div className="progress-fill" style={{ width: `${(s.value / Math.max(1, kpis.total)) * 100}%` }} /></div>
                </div>
                <div className="text-sm font-semibold w-12 text-right">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> AI Anomaly Detection</h3>
            <span className="badge badge-warning">Demo</span>
          </div>
          <p className="text-xs text-[color:var(--text-muted)] mb-3">Heuristic flags based on repeated late arrivals or absences in the selected range. Not a trained model — demo only.</p>
          <div className="space-y-2">
            {anomalies.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <Avatar name={a.employee!.name} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.employee!.name}</div>
                  <div className="text-[11px] text-[color:var(--text-muted)]">{a.employee!.department} · {a.late} late, {a.absent} absent</div>
                </div>
                <span className="badge badge-warning">Review</span>
              </div>
            ))}
            {anomalies.length === 0 && <p className="text-sm text-[color:var(--text-muted)] text-center py-4">No anomalies detected in this range.</p>}
          </div>
        </div>
      </div>

      <div className="section-card !p-0">
        <div className="p-4 border-b border-[color:var(--border)] flex flex-wrap items-center gap-2">
          <h3 className="font-semibold flex-1">Recent attendance</h3>
          <select className="input !w-auto !py-1.5 !text-xs" value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="all">All departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>Employee</th><th>Department</th><th>Days Present</th><th>Days Absent</th><th>Days Late</th><th>Working Hours</th><th>Attendance</th></tr></thead>
            <tbody>
              {filtered.map((e) => {
                const eA = attendance.filter((a) => a.employeeId === e.employeeId);
                const present = eA.filter((a) => a.status === "Present" || a.status === "Late").length;
                const absent = eA.filter((a) => a.status === "Absent").length;
                const late = eA.filter((a) => a.status === "Late").length;
                const hours = eA.reduce((a, b) => a + (b.workingHours ?? 0), 0);
                return (
                  <tr key={e.id}>
                    <td><div className="flex items-center gap-2"><Avatar name={e.name} size={28} /><div><div className="text-sm font-medium">{e.name}</div><div className="text-[10px] text-[color:var(--text-muted)]">{e.employeeId}</div></div></div></td>
                    <td className="text-[color:var(--text-muted)]">{e.department}</td>
                    <td><span className="text-emerald-500 font-medium">{present}</span></td>
                    <td><span className="text-rose-500 font-medium">{absent}</span></td>
                    <td><span className="text-amber-500 font-medium">{late}</span></td>
                    <td>{hours.toFixed(0)} hrs</td>
                    <td><div className="flex items-center gap-2"><div className="w-16 h-1.5 rounded-full bg-[color:var(--bg-soft)] overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${e.attendancePct}%` }} /></div><span className="text-xs font-medium">{e.attendancePct}%</span></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
