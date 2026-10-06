"use client";

import { useMemo, useState } from "react";
import { useApp, useCurrentUser } from "@/lib/store";
import { useScope } from "@/lib/selectors";
import { KpiCard } from "@/components/KpiCard";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Avatar } from "@/components/Avatar";
import {
  Users, Activity, CalendarX, CalendarDays, Clock, TrendingUp, Star, Briefcase,
  Sparkles, AlertTriangle, ArrowRight, CheckCircle2, X as XIcon, BarChart3, Search,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from "recharts";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal";
import { EmployeeProfile } from "@/app/(app)/admin/employees/page";
import type { Employee, LeaveRequest } from "@/lib/types";

export default function ManagerDashboard() {
  const router = useRouter();
  const user = useCurrentUser();
  const { employees, attendance, leaves, timesheets, range } = useScope();
  const approve = useApp((s) => s.approveLeave);
  const reject = useApp((s) => s.rejectLeave);

  const todayISO = new Date().toISOString().split("T")[0];
  const todayAtt = attendance.filter((a) => a.date === todayISO);

  const kpis = useMemo(() => {
    const present = todayAtt.filter((a) => a.status === "Present" || a.status === "Late").length;
    const absent = todayAtt.filter((a) => a.status === "Absent").length;
    const onLeave = todayAtt.filter((a) => a.status === "On Leave").length;
    const overtime = employees.reduce((a, b) => a + b.overtime, 0);
    const avgPerf = employees.length ? employees.reduce((a, b) => a + b.performanceScore, 0) / employees.length : 0;
    const avgProd = employees.length ? employees.reduce((a, b) => a + b.workHours, 0) / employees.length : 0;
    const util = avgProd > 0 ? Math.min(100, (avgProd / 9) * 100) : 0;
    return { present, absent, onLeave, overtime, avgPerf, util, pendingLeaves: leaves.filter((l) => l.status === "Pending").length };
  }, [employees, todayAtt, leaves]);

  const performanceRanking = [...employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 5);
  const radar = useMemo(() => [
    { metric: "Performance", value: employees.reduce((a, b) => a + b.performanceScore, 0) / Math.max(1, employees.length) },
    { metric: "Attendance", value: employees.reduce((a, b) => a + b.attendancePct, 0) / Math.max(1, employees.length) },
    { metric: "Productivity", value: (employees.reduce((a, b) => a + b.workHours, 0) / Math.max(1, employees.length)) * 10 },
    { metric: "Engagement", value: employees.reduce((a, b) => a + b.engagement, 0) / Math.max(1, employees.length) },
  ], [employees]);

  const attendanceTrend = useMemo(() => {
    const m: Record<string, { date: string; present: number; absent: number }> = {};
    for (const a of attendance) {
      if (!m[a.date]) m[a.date] = { date: a.date, present: 0, absent: 0 };
      if (a.status === "Present" || a.status === "Late") m[a.date].present++;
      else if (a.status === "Absent") m[a.date].absent++;
    }
    return Object.values(m).sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  }, [attendance]);

  const skillDist = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of employees) for (const s of e.skills) m[s] = (m[s] ?? 0) + 1;
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [employees]);

  const pendingLeaves = useMemo(() => leaves.filter((l) => l.status === "Pending").slice(0, 5), [leaves]);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [query, setQuery] = useState("");

  const filteredTeam = useMemo(() => {
    if (!query) return employees;
    const q = query.toLowerCase();
    return employees.filter((e) => [e.name, e.employeeId, e.designation, e.department, ...e.skills].some((s) => String(s).toLowerCase().includes(q)));
  }, [employees, query]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title={`Welcome back, ${user?.username}`}
        description={`Team overview · ${employees.length} members · ${todayISO}`}
        icon={<Briefcase size={16} />}
        action={
          <button onClick={() => router.push("/manager/team")} className="btn btn-primary">
            <Users size={14} /> Open My Team
          </button>
        }
      />

      <DateRangeFilter query={query} onQueryChange={setQuery} showSearch />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Team Size" value={employees.length} icon={<Users size={16} />} accent="blue" />
        <KpiCard label="Present Today" value={kpis.present} icon={<Activity size={16} />} accent="green" />
        <KpiCard label="Absent" value={kpis.absent} icon={<CalendarX size={16} />} accent="rose" />
        <KpiCard label="On Leave" value={kpis.onLeave} icon={<CalendarDays size={16} />} accent="amber" />
        <KpiCard label="Avg Performance" value={kpis.avgPerf} suffix="%" decimals={1} icon={<Star size={16} />} accent="purple" />
        <KpiCard label="Team Overtime" value={kpis.overtime} suffix="h" icon={<Clock size={16} />} accent="cyan" />
        <KpiCard label="Utilisation" value={kpis.util} suffix="%" decimals={0} icon={<TrendingUp size={16} />} accent="green" />
        <button onClick={() => router.push("/manager/leave")} className="kpi-card text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] font-medium">Pending Approvals</span>
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500"><AlertTriangle size={14} /></div>
          </div>
          <div className="text-2xl font-bold">{kpis.pendingLeaves}</div>
          <div className="mt-1 text-[10px] text-blue-500 flex items-center gap-1">Review <ArrowRight size={10} /></div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="section-card lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Team attendance trend</h3>
            <button onClick={() => router.push("/manager/attendance")} className="text-xs text-blue-500 hover:underline flex items-center gap-1">View details <ArrowRight size={11} /></button>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="mp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.5} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                  <linearGradient id="ma" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} /><stop offset="100%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--text-muted)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="present" stroke="#10b981" fill="url(#mp)" strokeWidth={2} name="Present" />
                <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="url(#ma)" strokeWidth={2} name="Absent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-[color:var(--text-muted)] mt-2">Range: {range.from} → {range.to}</p>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Sparkles size={14} className="text-violet-500" /> AI Team Insights</h3>
          <div className="space-y-2.5 text-sm">
            {employees.filter((e) => e.overtime > 20).length > 0 && (
              <Insight title="Workload balancing" body={`${employees.filter((e) => e.overtime > 20).length} employees may require workload balancing due to high overtime.`} color="amber" />
            )}
            {employees.filter((e) => e.performanceScore > 85).length > 0 && (
              <Insight title="High performers" body={`${employees.filter((e) => e.performanceScore > 85).length} employees show consistently high productivity — consider for recognition.`} color="emerald" />
            )}
            {employees.filter((e) => e.trainingCompleted < e.trainingRequired).length > 0 && (
              <Insight title="Training required" body={`${employees.filter((e) => e.trainingCompleted < e.trainingRequired).length} employees may require additional training to close skill gaps.`} color="violet" />
            )}
            {employees.filter((e) => e.attritionRisk === "High").length > 0 && (
              <Insight title="Attrition risk" body={`${employees.filter((e) => e.attritionRisk === "High").length} employees flagged as high risk — recommend 1:1 conversation.`} color="rose" />
            )}
            {employees.length === 0 && <p className="text-sm text-[color:var(--text-muted)] text-center py-4">No team data available for this date range.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><BarChart3 size={14} /> Top team skills</h3>
          <div className="space-y-2">
            {skillDist.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="text-xs w-24 truncate text-[color:var(--text-muted)]">{s.name}</span>
                <div className="flex-1 progress-bar"><div className="progress-fill" style={{ width: `${(s.value / Math.max(1, employees.length)) * 100}%` }} /></div>
                <span className="text-xs font-semibold w-6 text-right">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3">Team health radar</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <RadarChart data={radar}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fontSize: 9 }} stroke="var(--text-muted)" />
                <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2"><CalendarDays size={14} className="text-amber-500" /> Pending leave</h3>
            <span className="badge badge-warning">{pendingLeaves.length}</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {pendingLeaves.map((l) => (
              <div key={l.id} className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <Avatar name={l.employeeName} size={28} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{l.employeeName}</div>
                    <div className="text-[10px] text-[color:var(--text-muted)]">{l.type} · {l.days}d · {l.fromDate}</div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => approve(l.id, "Manager")} className="btn btn-success !text-[11px] !py-1 !px-2 flex-1"><CheckCircle2 size={12} /> Approve</button>
                  <button onClick={() => reject(l.id, "Manager")} className="btn btn-danger !text-[11px] !py-1 !px-2 flex-1"><XIcon size={12} /> Reject</button>
                </div>
              </div>
            ))}
            {pendingLeaves.length === 0 && <div className="text-center text-sm text-[color:var(--text-muted)] py-4">No pending requests.</div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="section-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Team performance ranking</h3>
            <button onClick={() => router.push("/manager/performance")} className="text-xs text-blue-500 hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {performanceRanking.map((e, i) => (
              <button key={e.id} onClick={() => setSelectedEmp(e)} className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[color:var(--bg-soft)] hover:bg-blue-500/5 transition text-left">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-bold flex items-center justify-center">{i + 1}</div>
                <Avatar name={e.name} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{e.name}</div>
                  <div className="text-[11px] text-[color:var(--text-muted)]">{e.designation} · {e.project}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-500">{e.performanceScore}%</div>
                  <div className="w-16 h-1.5 rounded-full bg-[color:var(--bg)] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${e.performanceScore}%` }} />
                  </div>
                </div>
              </button>
            ))}
            {performanceRanking.length === 0 && <div className="text-center text-sm text-[color:var(--text-muted)] py-6">No team members in this scope.</div>}
          </div>
        </div>

        <div className="section-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Team directory</h3>
            <span className="text-xs text-[color:var(--text-muted)]">{filteredTeam.length} of {employees.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {filteredTeam.slice(0, 12).map((e) => (
              <button key={e.id} onClick={() => setSelectedEmp(e)} className="flex items-center gap-2 p-2 rounded-lg bg-[color:var(--bg-soft)] hover:bg-blue-500/5 transition text-left">
                <Avatar name={e.name} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{e.name}</div>
                  <div className="text-[10px] text-[color:var(--text-muted)] truncate">{e.designation}</div>
                </div>
                <span className={`badge ${e.status === "Active" ? "badge-success" : "badge-warning"} !text-[9px]`}>{e.status}</span>
              </button>
            ))}
            {filteredTeam.length === 0 && <div className="col-span-full text-center text-sm text-[color:var(--text-muted)] py-4">No team members match your search.</div>}
          </div>
        </div>
      </div>

      <Modal open={!!selectedLeave} onClose={() => setSelectedLeave(null)} title="Leave request" size="md">
        {selectedLeave && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar name={selectedLeave.employeeName} size={42} />
              <div>
                <div className="font-semibold">{selectedLeave.employeeName}</div>
                <div className="text-xs text-[color:var(--text-muted)]">{selectedLeave.employeeId} · {selectedLeave.type}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2.5 rounded bg-[color:var(--bg-soft)]"><div className="text-[10px] text-[color:var(--text-muted)]">From</div><div className="font-semibold">{selectedLeave.fromDate}</div></div>
              <div className="p-2.5 rounded bg-[color:var(--bg-soft)]"><div className="text-[10px] text-[color:var(--text-muted)]">To</div><div className="font-semibold">{selectedLeave.toDate}</div></div>
              <div className="p-2.5 rounded bg-[color:var(--bg-soft)]"><div className="text-[10px] text-[color:var(--text-muted)]">Days</div><div className="font-semibold">{selectedLeave.days}</div></div>
              <div className="p-2.5 rounded bg-[color:var(--bg-soft)]"><div className="text-[10px] text-[color:var(--text-muted)]">Applied</div><div className="font-semibold">{selectedLeave.appliedOn}</div></div>
            </div>
            <div>
              <div className="text-[10px] text-[color:var(--text-muted)]">Reason</div>
              <p className="text-sm mt-1">{selectedLeave.reason}</p>
            </div>
            <div className="flex gap-2 pt-3 border-t border-[color:var(--border)]">
              <button onClick={() => { approve(selectedLeave.id, "Manager"); setSelectedLeave(null); }} className="btn btn-success flex-1"><CheckCircle2 size={14} /> Approve</button>
              <button onClick={() => { reject(selectedLeave.id, "Manager"); setSelectedLeave(null); }} className="btn btn-danger flex-1"><XIcon size={14} /> Reject</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!selectedEmp} onClose={() => setSelectedEmp(null)} title="Employee Profile" size="lg">
        {selectedEmp && <EmployeeProfile employee={selectedEmp} />}
      </Modal>
    </div>
  );
}

function Insight({ title, body, color }: { title: string; body: string; color: "emerald" | "amber" | "rose" | "violet" }) {
  const map = { emerald: "bg-emerald-500/5 border-emerald-500/20", amber: "bg-amber-500/5 border-amber-500/20", rose: "bg-rose-500/5 border-rose-500/20", violet: "bg-violet-500/5 border-violet-500/20" } as const;
  return (
    <div className={`p-2.5 rounded-lg border ${map[color]}`}>
      <div className="text-xs font-semibold mb-0.5">{title}</div>
      <div className="text-[11px] text-[color:var(--text-muted)] leading-relaxed">{body}</div>
    </div>
  );
}
