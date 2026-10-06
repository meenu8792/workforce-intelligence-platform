"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { SectionHeader, EmptyState } from "@/components/SectionHeader";
import { Avatar } from "@/components/Avatar";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Modal } from "@/components/Modal";
import { Users, Search, Filter, Download, X, MapPin, Briefcase, Award, AlertTriangle, TrendingUp, Building2, Calendar, Mail, Phone, Sparkles } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { Employee } from "@/lib/types";

export default function AdminEmployeesPage() {
  const employees = useApp((s) => s.employees);
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<string>("all");
  const [risk, setRisk] = useState<string>("all");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const departments = useMemo(() => Array.from(new Set(employees.map((e) => e.department))).sort(), [employees]);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      if (dept !== "all" && e.department !== dept) return false;
      if (risk !== "all" && e.attritionRisk !== risk) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return [e.name, e.employeeId, e.email, e.department, e.designation, e.location, e.manager, ...e.skills].some((s) => String(s ?? "").toLowerCase().includes(q));
    });
  }, [employees, dept, risk, query]);

  const exportCSV = () => {
    const headers = ["Employee ID", "Name", "Email", "Department", "Designation", "Location", "Joining Date", "Experience", "Salary", "Performance", "Attendance", "Attrition Risk", "Skills"];
    const rows = filtered.map((e) => [e.employeeId, e.name, e.email, e.department, e.designation, e.location, e.joiningDate, e.yearsOfExperience, e.salary, e.performanceScore, e.attendancePct, e.attritionRisk, e.skills.join("; ")]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "employees_export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader
        title="Employee Management"
        description="Complete directory of all employees. Click any row to view the detailed profile."
        icon={<Users size={16} />}
        action={
          <div className="flex gap-2">
            <button onClick={exportCSV} className="btn btn-secondary"><Download size={14} /> Export CSV</button>
          </div>
        }
      />

      <div className="section-card !p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, ID, email, department, skill..." className="input pl-9 !py-2 !text-sm" />
          </div>
          <select value={dept} onChange={(e) => setDept(e.target.value)} className="input !w-auto !py-2 !text-sm cursor-pointer">
            <option value="all">All departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={risk} onChange={(e) => setRisk(e.target.value)} className="input !w-auto !py-2 !text-sm cursor-pointer">
            <option value="all">All risk levels</option>
            <option value="Low">Low risk</option>
            <option value="Medium">Medium risk</option>
            <option value="High">High risk</option>
          </select>
        </div>
      </div>

      <div className="section-card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th><th>Department</th><th>Designation</th><th>Location</th><th>Joining</th><th>Experience</th><th>Performance</th><th>Attendance</th><th>Attrition</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((e) => (
                <tr key={e.id} className="cursor-pointer" onClick={() => setSelected(e)}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={e.name} size={32} />
                      <div>
                        <div className="font-medium">{e.name}</div>
                        <div className="text-[11px] text-[color:var(--text-muted)]">{e.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>{e.department}</td>
                  <td className="text-[color:var(--text-muted)]">{e.designation}</td>
                  <td><div className="flex items-center gap-1 text-[color:var(--text-muted)]"><MapPin size={12} /> {e.location}</div></td>
                  <td className="text-[color:var(--text-muted)]">{new Date(e.joiningDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</td>
                  <td>{e.yearsOfExperience}y</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-[color:var(--bg-soft)] overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${e.performanceScore}%` }} />
                      </div>
                      <span className="text-xs font-medium">{e.performanceScore}%</span>
                    </div>
                  </td>
                  <td>{e.attendancePct}%</td>
                  <td>
                    <span className={`badge ${e.attritionRisk === "High" ? "badge-danger" : e.attritionRisk === "Medium" ? "badge-warning" : "badge-success"}`}>
                      {e.attritionRisk}
                    </span>
                  </td>
                  <td><span className={`badge ${e.status === "Active" ? "badge-success" : "badge-warning"}`}>{e.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 50 && <div className="p-3 text-center text-xs text-[color:var(--text-muted)] border-t border-[color:var(--border)]">Showing first 50 of {filtered.length}. Refine your search to see more.</div>}
        {filtered.length === 0 && (
          <div className="p-6"><EmptyState title="No employees found" message="Try adjusting your filters or uploading a new dataset." icon={<Search />} /></div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Employee Profile" size="lg">
        {selected && <EmployeeProfile employee={selected} />}
      </Modal>
    </div>
  );
}

export function EmployeeProfile({ employee: e }: { employee: Employee }) {
  const attendance = useApp((s) => s.attendance.filter((a) => a.employeeId === e.employeeId));
  const leaves = useApp((s) => s.leaves.filter((l) => l.employeeId === e.employeeId));
  const timesheets = useApp((s) => s.timesheets.filter((t) => t.employeeId === e.employeeId));
  const presentCount = attendance.filter((a) => a.status === "Present" || a.status === "Late").length;
  const absentCount = attendance.filter((a) => a.status === "Absent").length;
  const lateCount = attendance.filter((a) => a.status === "Late").length;
  const totalHours = timesheets.reduce((a, b) => a + b.hours, 0);
  const billableHours = timesheets.filter((t) => t.billable).reduce((a, b) => a + b.hours, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-[color:var(--border)]">
        <Avatar name={e.name} size={64} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-lg font-bold">{e.name}</h3>
            <span className="badge badge-info">{e.employeeId}</span>
          </div>
          <p className="text-sm text-[color:var(--text-muted)]">{e.designation} · {e.department}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="tag"><Mail size={11} /> {e.email}</span>
            <span className="tag"><MapPin size={11} /> {e.location}</span>
            <span className="tag"><Briefcase size={11} /> {e.yearsOfExperience}y exp</span>
            <span className="tag"><Calendar size={11} /> Joined {new Date(e.joiningDate).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[color:var(--text-muted)]">Status</div>
          <span className={`badge ${e.status === "Active" ? "badge-success" : "badge-warning"}`}>{e.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ProfileStat label="Performance" value={`${e.performanceScore}%`} icon={<TrendingUp size={14} />} accent="emerald" />
        <ProfileStat label="Attendance" value={`${e.attendancePct}%`} icon={<Calendar size={14} />} accent="blue" />
        <ProfileStat label="Engagement" value={`${e.engagement}%`} icon={<Sparkles size={14} />} accent="violet" />
        <ProfileStat label="Attrition Risk" value={e.attritionRisk} icon={<AlertTriangle size={14} />} accent={e.attritionRisk === "High" ? "rose" : e.attritionRisk === "Medium" ? "amber" : "emerald"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[color:var(--border)] p-4">
          <h4 className="text-sm font-semibold mb-3">Personal information</h4>
          <dl className="text-sm space-y-2">
            <Row k="Gender" v={e.gender ?? "—"} />
            <Row k="Age" v={e.age ?? "—"} />
            <Row k="Manager" v={e.manager ?? "—"} />
            <Row k="Employee Type" v="Full-time" />
          </dl>
        </div>
        <div className="rounded-xl border border-[color:var(--border)] p-4">
          <h4 className="text-sm font-semibold mb-3">Employment</h4>
          <dl className="text-sm space-y-2">
            <Row k="Department" v={e.department} />
            <Row k="Designation" v={e.designation} />
            <Row k="Shift" v={e.shift} />
            <Row k="Project" v={e.project} />
            <Row k="CTC" v={formatCurrency(e.salary)} />
          </dl>
        </div>
      </div>

      <div className="rounded-xl border border-[color:var(--border)] p-4">
        <h4 className="text-sm font-semibold mb-3">Skills & training</h4>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {e.skills.map((s) => <span key={s} className="tag">{s}</span>)}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-[color:var(--text-muted)]">Training:</span>
          <div className="flex-1 progress-bar"><div className="progress-fill" style={{ width: `${(e.trainingCompleted / Math.max(1, e.trainingRequired)) * 100}%` }} /></div>
          <span className="font-medium">{e.trainingCompleted}/{e.trainingRequired}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ProfileStat label="Present (recent)" value={presentCount} accent="emerald" />
        <ProfileStat label="Absent (recent)" value={absentCount} accent="rose" />
        <ProfileStat label="Late (recent)" value={lateCount} accent="amber" />
        <ProfileStat label="Total hours" value={totalHours.toFixed(0)} accent="blue" />
      </div>

      <div className="rounded-xl border border-[color:var(--border)] p-4">
        <h4 className="text-sm font-semibold mb-3">Recent leave history</h4>
        {leaves.length === 0 ? <p className="text-sm text-[color:var(--text-muted)]">No leave records found.</p> : (
          <div className="space-y-2">
            {leaves.slice(0, 4).map((l) => (
              <div key={l.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-[color:var(--bg-soft)]">
                <div>
                  <div className="font-medium">{l.type} · {l.days}d</div>
                  <div className="text-xs text-[color:var(--text-muted)]">{l.fromDate} → {l.toDate}</div>
                </div>
                <span className={`badge ${l.status === "Approved" ? "badge-success" : l.status === "Rejected" ? "badge-danger" : "badge-warning"}`}>{l.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[color:var(--border)] p-4 bg-gradient-to-br from-violet-500/5 to-blue-500/5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-violet-500" />
          <h4 className="text-sm font-semibold">AI Career & Reward Insight</h4>
        </div>
        <p className="text-sm text-[color:var(--text-muted)]">
          {(() => {
            if (e.performanceScore > 85 && e.attendancePct > 90 && e.yearsOfExperience > 3) {
              return `${e.name} demonstrates strong and consistent performance with high attendance and meaningful tenure. Recommendation: consider for performance review or additional recognition. Final decision should be made by authorized HR/management.`;
            }
            if (e.performanceScore > 70) {
              return `${e.name} shows steady performance. Consider targeted skill development to unlock further growth opportunities.`;
            }
            return `${e.name} would benefit from focused training and mentoring to improve performance outcomes.`;
          })()}
        </p>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[color:var(--text-muted)]">{k}</dt>
      <dd className="font-medium text-right">{v}</dd>
    </div>
  );
}

function ProfileStat({ label, value, icon, accent }: { label: string; value: React.ReactNode; icon?: React.ReactNode; accent: "blue" | "emerald" | "amber" | "rose" | "violet" }) {
  const map = {
    blue: "from-blue-500/10 text-blue-500",
    emerald: "from-emerald-500/10 text-emerald-500",
    amber: "from-amber-500/10 text-amber-500",
    rose: "from-rose-500/10 text-rose-500",
    violet: "from-violet-500/10 text-violet-500",
  } as const;
  return (
    <div className="rounded-xl border border-[color:var(--border)] p-3">
      <div className="flex items-center gap-2 text-xs text-[color:var(--text-muted)] mb-1">
        {icon && <span className={`p-1 rounded-md bg-gradient-to-br ${map[accent]}`}>{icon}</span>}
        {label}
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
