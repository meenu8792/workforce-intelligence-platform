"use client";

import { useMemo, useState } from "react";
import { useApp, useCurrentUser, useMyEmployee } from "@/lib/store";
import { useScope } from "@/lib/selectors";
import { KpiCard } from "@/components/KpiCard";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Avatar } from "@/components/Avatar";
import { CalendarCheck, Clock, Calendar, Star, BookOpen, TrendingUp, Wallet, Sparkles, ArrowRight, Award, CheckCircle2, Sun, Moon, Sunset } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
  const user = useCurrentUser();
  const me = useMyEmployee();
  const router = useRouter();
  const applyLeave = useApp((s) => s.applyLeave);
  const { employees, attendance, leaves, timesheets, salaries } = useScope();

  const today = new Date().toISOString().split("T")[0];
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const todayAtt = me ? attendance.filter((a) => a.employeeId === me.employeeId && a.date === today)[0] : undefined;
  const monthSalary = me ? salaries.find((s) => s.employeeId === me.employeeId && s.month === "2026-09") : undefined;
  const recentLeaves = me ? leaves.filter((l) => l.employeeId === me.employeeId).slice(0, 3) : [];
  const myTimesheets = me ? timesheets.filter((t) => t.employeeId === me.employeeId).slice(0, 5) : [];
  const myShifts = me ? attendance.filter((a) => a.employeeId === me.employeeId).slice(0, 7) : [];

  const [showApply, setShowApply] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual");
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [reason, setReason] = useState("");

  const submitLeave = () => {
    if (!me) return;
    if (from > to) return;
    const days = Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1;
    applyLeave({ employeeId: me.employeeId, employeeName: me.name, type: leaveType as never, fromDate: from, toDate: to, days, reason: reason || "Personal" });
    setShowApply(false);
    setReason("");
  };

  if (!me) {
    return (
      <div className="section-card text-center py-12">
        <h2 className="text-lg font-bold">No employee record linked</h2>
        <p className="text-sm text-[color:var(--text-muted)] mt-1">Your account is not yet linked to an employee record. Contact HR.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="section-card !p-5 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-violet-500/5">
        <div className="flex items-center gap-4">
          <Avatar name={me.name} size={56} />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-[color:var(--text-muted)]">{greeting},</div>
            <h1 className="text-2xl font-bold">{me.name}</h1>
            <div className="text-xs text-[color:var(--text-muted)] mt-0.5">{me.designation} · {me.department} · {me.employeeId}</div>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="badge badge-success"><span className="live-dot" /> {me.status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard label="Today" value={todayAtt ? (todayAtt.status === "Present" || todayAtt.status === "Late" ? 1 : 0) : 0} icon={<CalendarCheck size={16} />} accent="green" />
        <KpiCard label="Current Shift" value={me.shift === "Morning" ? 1 : me.shift === "Evening" ? 2 : me.shift === "Night" ? 3 : 4} icon={<Clock size={16} />} accent="blue" />
        <KpiCard label="Leave Balance" value={me.leaveBalance} icon={<Calendar size={16} />} accent="amber" suffix="d" />
        <KpiCard label="Working Hrs" value={me.workHours} icon={<Clock size={16} />} accent="cyan" decimals={1} />
        <KpiCard label="Performance" value={me.performanceScore} icon={<Star size={16} />} accent="purple" suffix="%" />
        <KpiCard label="Training" value={(me.trainingCompleted / Math.max(1, me.trainingRequired)) * 100} icon={<BookOpen size={16} />} accent="green" suffix="%" decimals={0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3">Today at a glance</h3>
          <div className="space-y-2 text-sm">
            <InfoRow label="Check-in" value={todayAtt?.checkIn ?? "—"} />
            <InfoRow label="Check-out" value={todayAtt?.checkOut ?? "—"} />
            <InfoRow label="Working hours" value={todayAtt?.workingHours ? `${todayAtt.workingHours}h` : "—"} />
            <InfoRow label="Source" value={todayAtt?.source ?? "—"} />
            <InfoRow label="Shift" value={me.shift} />
            <InfoRow label="Project" value={me.project} />
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3">Quick actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <ActionBtn icon={<CalendarCheck size={16} />} label="Check In" onClick={() => router.push("/employee/attendance")} />
            <ActionBtn icon={<Calendar size={16} />} label="Apply Leave" onClick={() => setShowApply(true)} highlight />
            <ActionBtn icon={<FileIcon />} label="Timesheet" onClick={() => router.push("/employee/timesheet")} />
            <ActionBtn icon={<Wallet size={16} />} label="Payslip" onClick={() => router.push("/employee/salary")} />
            <ActionBtn icon={<Sparkles size={16} />} label="Copilot" onClick={() => { const btn = document.querySelector('[aria-label="Ask Workforce Copilot"]') as HTMLElement; btn?.click(); }} />
            <ActionBtn icon={<AlertIcon />} label="Report" onClick={() => router.push("/employee/issues")} />
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3">Latest salary</h3>
          {monthSalary ? (
            <div className="space-y-2 text-sm">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
                <div className="text-xs text-[color:var(--text-muted)]">September 2026</div>
                <div className="text-2xl font-bold mt-1">₹{(monthSalary.netPay / 100000).toFixed(2)}L</div>
                <div className="text-[11px] text-emerald-500 mt-1"><CheckCircle2 size={11} className="inline" /> {monthSalary.status}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded bg-[color:var(--bg-soft)]"><div className="text-[color:var(--text-muted)]">Base</div><div className="font-semibold">₹{(monthSalary.baseSalary / 100000).toFixed(1)}L</div></div>
                <div className="p-2 rounded bg-[color:var(--bg-soft)]"><div className="text-[color:var(--text-muted)]">OT</div><div className="font-semibold">₹{(monthSalary.overtime / 1000).toFixed(0)}K</div></div>
                <div className="p-2 rounded bg-[color:var(--bg-soft)]"><div className="text-[color:var(--text-muted)]">Bonus</div><div className="font-semibold">₹{(monthSalary.bonus / 1000).toFixed(0)}K</div></div>
              </div>
            </div>
          ) : <p className="text-sm text-[color:var(--text-muted)]">No salary record yet.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="section-card lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2"><Award size={14} className="text-amber-500" /> My recent leave</h3>
            <button onClick={() => router.push("/employee/leave")} className="text-xs text-blue-500 hover:underline flex items-center gap-1">View all <ArrowRight size={11} /></button>
          </div>
          {recentLeaves.length === 0 ? <p className="text-sm text-[color:var(--text-muted)]">No leave records yet.</p> : (
            <div className="space-y-2">
              {recentLeaves.map((l) => (
                <div key={l.id} className="flex items-center justify-between p-2.5 rounded-lg bg-[color:var(--bg-soft)]">
                  <div>
                    <div className="text-sm font-medium">{l.type} · {l.days}d</div>
                    <div className="text-[10px] text-[color:var(--text-muted)]">{l.fromDate} → {l.toDate}</div>
                  </div>
                  <span className={`badge ${l.status === "Approved" ? "badge-success" : l.status === "Rejected" ? "badge-danger" : "badge-warning"}`}>{l.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3">AI Career Insight</h3>
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/5 to-blue-500/5 border border-violet-500/20">
            <Sparkles size={14} className="text-violet-500 mb-1" />
            {me.performanceScore > 80 && me.attendancePct > 90 ? (
              <p className="text-sm text-[color:var(--text-muted)]">Based on your strong performance and attendance, you may be considered for performance review or additional recognition. Final decision should be made by HR/management.</p>
            ) : me.performanceScore > 70 ? (
              <p className="text-sm text-[color:var(--text-muted)]">You&apos;re performing steadily. Consider learning a high-demand skill like React, Python or AWS to unlock further growth.</p>
            ) : (
              <p className="text-sm text-[color:var(--text-muted)]">Focus on closing training gaps and improving attendance — both will significantly impact your career trajectory.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3">Upcoming shifts (next 7 days)</h3>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date(); d.setDate(d.getDate() + i);
              const iso = d.toISOString().split("T")[0];
              return (
                <div key={iso} className="p-2 rounded-lg bg-[color:var(--bg-soft)] text-center">
                  <div className="text-[10px] text-[color:var(--text-muted)] uppercase">{d.toLocaleDateString("en", { weekday: "short" })}</div>
                  <div className="text-sm font-bold">{d.getDate()}</div>
                  <div className="text-[10px] mt-0.5 text-blue-500">{me.shift}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3">Recent timesheets</h3>
          {myTimesheets.length === 0 ? <p className="text-sm text-[color:var(--text-muted)]">No timesheet entries yet.</p> : (
            <div className="space-y-1.5">
              {myTimesheets.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-[color:var(--bg-soft)] text-sm">
                  <div>
                    <div className="font-medium">{t.task}</div>
                    <div className="text-[10px] text-[color:var(--text-muted)]">{t.project} · {t.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{t.hours}h</div>
                    <div className="text-[10px] text-[color:var(--text-muted)]">{t.billable ? "Billable" : "Non-billable"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showApply && (
        <div className="modal-backdrop" onClick={() => setShowApply(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-3">Apply for leave</h3>
            <div className="space-y-3">
              <div>
                <label className="label">Leave type</label>
                <select className="input" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                  {["Casual", "Sick", "Earned", "Unpaid", "Maternity", "Paternity"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="label">From</label><input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
                <div><label className="label">To</label><input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} /></div>
              </div>
              <div>
                <label className="label">Reason</label>
                <textarea className="input" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Briefly describe the reason for your leave..." />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2 pt-4 border-t border-[color:var(--border)]">
              <button className="btn btn-secondary" onClick={() => setShowApply(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitLeave}>Submit request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[color:var(--text-muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, highlight }: { icon: React.ReactNode; label: string; onClick: () => void; highlight?: boolean }) {
  return (
    <button onClick={onClick} className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition border ${highlight ? "bg-gradient-to-br from-blue-500/15 to-cyan-500/15 border-blue-500/30 text-blue-500" : "bg-[color:var(--bg-soft)] border-[color:var(--border)] hover:border-blue-500/40"}`}>
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function FileIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function AlertIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
