"use client";

import { useMemo, useState } from "react";
import { useScope } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { CalendarDays, Check, X as XIcon, Search } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export default function HRLeavePage() {
  const { leaves, employees } = useScope();
  const approve = useApp((s) => s.approveLeave);
  const reject = useApp((s) => s.rejectLeave);
  const [status, setStatus] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return leaves.filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      if (!query) return true;
      return [l.employeeName, l.employeeId, l.type].some((s) => String(s).toLowerCase().includes(query.toLowerCase()));
    });
  }, [leaves, status, query]);

  const counts = useMemo(() => {
    return { Pending: leaves.filter((l) => l.status === "Pending").length, Approved: leaves.filter((l) => l.status === "Approved").length, Rejected: leaves.filter((l) => l.status === "Rejected").length };
  }, [leaves]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Leave Management" description="Approve, reject, and track leave requests across the organisation." icon={<CalendarDays size={16} />} />
      <DateRangeFilter query={query} onQueryChange={setQuery} showSearch />

      <div className="grid grid-cols-3 gap-3">
        {(["Pending", "Approved", "Rejected"] as const).map((s) => (
          <button key={s} onClick={() => setStatus(status === s ? "all" : s)} className={`kpi-card text-left transition ${status === s ? "!border-blue-500" : ""}`}>
            <div className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider font-medium">{s}</div>
            <div className="text-2xl font-bold mt-1">{counts[s]}</div>
          </button>
        ))}
      </div>

      <div className="section-card !p-0">
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((l) => {
                const e = employees.find((x) => x.employeeId === l.employeeId);
                return (
                  <tr key={l.id}>
                    <td><div className="flex items-center gap-2"><Avatar name={l.employeeName} size={28} /><div><div className="text-sm font-medium">{l.employeeName}</div><div className="text-[10px] text-[color:var(--text-muted)]">{l.employeeId}</div></div></div></td>
                    <td>{l.type}</td>
                    <td className="text-[color:var(--text-muted)]">{l.fromDate}</td>
                    <td className="text-[color:var(--text-muted)]">{l.toDate}</td>
                    <td>{l.days}</td>
                    <td className="text-[color:var(--text-muted)] text-xs max-w-[200px] truncate">{l.reason}</td>
                    <td><span className={`badge ${l.status === "Approved" ? "badge-success" : l.status === "Rejected" ? "badge-danger" : "badge-warning"}`}>{l.status}</span></td>
                    <td>
                      {l.status === "Pending" ? (
                        <div className="flex gap-1.5">
                          <button onClick={() => approve(l.id, "HR")} className="btn btn-success !text-xs !py-1 !px-2"><Check size={12} /> Approve</button>
                          <button onClick={() => reject(l.id, "HR")} className="btn btn-danger !text-xs !py-1 !px-2"><XIcon size={12} /> Reject</button>
                        </div>
                      ) : (
                        <span className="text-xs text-[color:var(--text-muted)]">{l.approvedBy ?? "—"}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-6 text-center text-sm text-[color:var(--text-muted)]">No leave requests found.</div>}
      </div>
    </div>
  );
}
