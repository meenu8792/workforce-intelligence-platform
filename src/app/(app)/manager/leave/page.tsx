"use client";

import { useState } from "react";
import { useScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { CalendarDays, Check, X as XIcon } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export default function ManagerLeavePage() {
  const { leaves, employees } = useScope();
  const approve = useApp((s) => s.approveLeave);
  const reject = useApp((s) => s.rejectLeave);
  const [status, setStatus] = useState<string>("Pending");

  const filtered = leaves.filter((l) => status === "all" || l.status === status);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Leave Approvals" description="Review and act on leave requests from your team." icon={<CalendarDays size={16} />} />
      <DateRangeFilter />

      <div className="flex gap-2 flex-wrap">
        {["Pending", "Approved", "Rejected", "all"].map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`btn !text-sm ${status === s ? "btn-primary" : "btn-secondary"}`}>
            {s === "all" ? "All" : s} <span className="ml-1 opacity-70">({leaves.filter((l) => s === "all" || l.status === s).length})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((l) => {
          const e = employees.find((x) => x.employeeId === l.employeeId);
          return (
            <div key={l.id} className="section-card !p-4">
              <div className="flex items-start gap-3">
                <Avatar name={l.employeeName} size={42} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{l.employeeName}</div>
                  <div className="text-[10px] text-[color:var(--text-muted)]">{l.employeeId} · {e?.designation ?? ""}</div>
                </div>
                <span className={`badge ${l.status === "Approved" ? "badge-success" : l.status === "Rejected" ? "badge-danger" : "badge-warning"}`}>{l.status}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded bg-[color:var(--bg-soft)]"><div className="text-[color:var(--text-muted)]">Type</div><div className="font-semibold">{l.type}</div></div>
                <div className="p-2 rounded bg-[color:var(--bg-soft)]"><div className="text-[color:var(--text-muted)]">Days</div><div className="font-semibold">{l.days}</div></div>
                <div className="p-2 rounded bg-[color:var(--bg-soft)]"><div className="text-[color:var(--text-muted)]">Applied</div><div className="font-semibold">{l.appliedOn}</div></div>
              </div>
              <p className="text-xs text-[color:var(--text-muted)] mt-3 line-clamp-2">"{l.reason}"</p>
              <div className="text-xs text-[color:var(--text-muted)] mt-2">{l.fromDate} → {l.toDate}</div>
              {l.status === "Pending" && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-[color:var(--border)]">
                  <button onClick={() => approve(l.id, "Manager")} className="btn btn-success flex-1 !text-sm"><Check size={14} /> Approve</button>
                  <button onClick={() => reject(l.id, "Manager")} className="btn btn-danger flex-1 !text-sm"><XIcon size={14} /> Reject</button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <div className="section-card col-span-full text-center text-sm text-[color:var(--text-muted)]">No leave requests to show.</div>}
      </div>
    </div>
  );
}
