"use client";

import { useMemo, useState } from "react";
import { useScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { FileClock, Check, X as XIcon } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export default function HRTimesheetsPage() {
  const { timesheets, employees } = useScope();
  const approve = useApp((s) => s.approveTimesheet);
  const reject = useApp((s) => s.rejectTimesheet);
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => timesheets.filter((t) => status === "all" || t.status === status), [timesheets, status]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Timesheets" description="Project hours, billable hours, approvals." icon={<FileClock size={16} />} />
      <DateRangeFilter />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["Submitted", "Approved", "Rejected", "Draft"] as const).map((s) => (
          <button key={s} onClick={() => setStatus(status === s ? "all" : s)} className={`kpi-card text-left ${status === s ? "!border-blue-500" : ""}`}>
            <div className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider font-medium">{s}</div>
            <div className="text-2xl font-bold mt-1">{timesheets.filter((t) => t.status === s).length}</div>
          </button>
        ))}
      </div>

      <div className="section-card !p-0">
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>Employee</th><th>Date</th><th>Project</th><th>Task</th><th>Hours</th><th>Billable</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.slice(0, 30).map((t) => {
                const e = employees.find((x) => x.employeeId === t.employeeId);
                return (
                  <tr key={t.id}>
                    <td><div className="flex items-center gap-2"><Avatar name={e?.name ?? t.employeeId} size={28} /><div><div className="text-sm font-medium">{e?.name ?? t.employeeId}</div><div className="text-[10px] text-[color:var(--text-muted)]">{t.employeeId}</div></div></div></td>
                    <td className="text-[color:var(--text-muted)]">{t.date}</td>
                    <td>{t.project}</td>
                    <td className="text-[color:var(--text-muted)] text-xs">{t.task}</td>
                    <td><span className="font-semibold">{t.hours}</span></td>
                    <td>{t.billable ? <span className="badge badge-success">Billable</span> : <span className="badge badge-muted">Non-billable</span>}</td>
                    <td><span className={`badge ${t.status === "Approved" ? "badge-success" : t.status === "Rejected" ? "badge-danger" : t.status === "Draft" ? "badge-muted" : "badge-warning"}`}>{t.status}</span></td>
                    <td>
                      {t.status === "Submitted" ? (
                        <div className="flex gap-1.5">
                          <button onClick={() => approve(t.id, "HR")} className="btn btn-success !text-xs !py-1 !px-2"><Check size={12} /></button>
                          <button onClick={() => reject(t.id, "HR")} className="btn btn-danger !text-xs !py-1 !px-2"><XIcon size={12} /></button>
                        </div>
                      ) : <span className="text-xs text-[color:var(--text-muted)]">{t.approvedBy ?? "—"}</span>}
                    </td>
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
