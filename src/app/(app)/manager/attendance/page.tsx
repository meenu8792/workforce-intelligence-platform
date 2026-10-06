"use client";

import { useMemo } from "react";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { CalendarCheck, AlertTriangle } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export default function ManagerAttendancePage() {
  const { employees, attendance, range } = useScope();

  const kpis = useMemo(() => {
    const present = attendance.filter((a) => a.status === "Present" || a.status === "Late").length;
    const absent = attendance.filter((a) => a.status === "Absent").length;
    const late = attendance.filter((a) => a.status === "Late").length;
    const rate = attendance.length ? (present / attendance.length) * 100 : 0;
    return { present, absent, late, rate };
  }, [attendance]);

  const anomalies = useMemo(() => {
    const m: Record<string, { id: string; late: number; absent: number; total: number }> = {};
    for (const a of attendance) {
      if (!m[a.employeeId]) m[a.employeeId] = { id: a.employeeId, late: 0, absent: 0, total: 0 };
      m[a.employeeId].total++;
      if (a.status === "Late") m[a.employeeId].late++;
      if (a.status === "Absent") m[a.employeeId].absent++;
    }
    return Object.values(m)
      .filter((x) => x.late >= 3 || x.absent >= 2)
      .map((x) => ({ ...x, employee: employees.find((e) => e.employeeId === x.id) }))
      .filter((x) => x.employee)
      .slice(0, 8);
  }, [attendance, employees]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Team Attendance" description={`Range: ${range.from} → ${range.to}`} icon={<CalendarCheck size={16} />} />
      <DateRangeFilter />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="kpi-card"><div className="text-xs text-[color:var(--text-muted)] uppercase font-medium">Present</div><div className="text-2xl font-bold text-emerald-500 mt-1">{kpis.present}</div></div>
        <div className="kpi-card"><div className="text-xs text-[color:var(--text-muted)] uppercase font-medium">Absent</div><div className="text-2xl font-bold text-rose-500 mt-1">{kpis.absent}</div></div>
        <div className="kpi-card"><div className="text-xs text-[color:var(--text-muted)] uppercase font-medium">Late</div><div className="text-2xl font-bold text-amber-500 mt-1">{kpis.late}</div></div>
        <div className="kpi-card"><div className="text-xs text-[color:var(--text-muted)] uppercase font-medium">Rate</div><div className="text-2xl font-bold text-blue-500 mt-1">{kpis.rate.toFixed(1)}%</div></div>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> Anomalies</h3>
        <div className="space-y-2">
          {anomalies.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <Avatar name={a.employee!.name} size={32} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{a.employee!.name}</div>
                <div className="text-[10px] text-[color:var(--text-muted)]">{a.late} late, {a.absent} absent of {a.total} days</div>
              </div>
              <span className="badge badge-warning">Review</span>
            </div>
          ))}
          {anomalies.length === 0 && <div className="text-center text-sm text-[color:var(--text-muted)] py-4">No anomalies in this range.</div>}
        </div>
      </div>

      <div className="section-card !p-0">
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>Employee</th><th>Designation</th><th>Present</th><th>Absent</th><th>Late</th><th>Attendance</th></tr></thead>
            <tbody>
              {employees.map((e) => {
                const eA = attendance.filter((a) => a.employeeId === e.employeeId);
                const present = eA.filter((a) => a.status === "Present" || a.status === "Late").length;
                const absent = eA.filter((a) => a.status === "Absent").length;
                const late = eA.filter((a) => a.status === "Late").length;
                return (
                  <tr key={e.id}>
                    <td><div className="flex items-center gap-2"><Avatar name={e.name} size={28} /><span className="text-sm font-medium">{e.name}</span></div></td>
                    <td className="text-[color:var(--text-muted)] text-xs">{e.designation}</td>
                    <td><span className="text-emerald-500 font-medium">{present}</span></td>
                    <td><span className="text-rose-500 font-medium">{absent}</span></td>
                    <td><span className="text-amber-500 font-medium">{late}</span></td>
                    <td><div className="flex items-center gap-2"><div className="w-16 h-1.5 rounded-full bg-[color:var(--bg-soft)] overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${e.attendancePct}%` }} /></div><span className="text-xs">{e.attendancePct}%</span></div></td>
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
