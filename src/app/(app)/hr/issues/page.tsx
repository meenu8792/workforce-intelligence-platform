"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { AlertTriangle, CheckCircle2, Filter, Search, Clock } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { formatDistanceToNow } from "@/lib/date";

export default function HRIssuesPage() {
  const issues = useApp((s) => s.issues);
  const resolve = useApp((s) => s.resolveIssue);
  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = issues.filter((i) => {
    if (status !== "all" && i.status !== status) return false;
    if (category !== "all" && i.category !== category) return false;
    if (query && ![i.subject, i.raisedByName, i.description].some((s) => String(s).toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="HR Issues Center" description="Issues raised by employees, salary acknowledgements and queries." icon={<AlertTriangle size={16} />} />

      <div className="section-card !p-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search issues..." className="input pl-9 !py-2 !text-sm" />
          </div>
          <select className="input !w-auto !py-2 !text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All status</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select className="input !w-auto !py-2 !text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            <option value="Salary">Salary</option>
            <option value="Attendance">Attendance</option>
            <option value="Leave">Leave</option>
            <option value="Shift">Shift</option>
            <option value="Payslip">Payslip</option>
            <option value="Profile">Profile</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((i) => (
          <div key={i.id} className="section-card !p-4">
            <div className="flex items-start gap-3 mb-2">
              <Avatar name={i.raisedByName} size={36} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{i.raisedByName}</div>
                <div className="text-[10px] text-[color:var(--text-muted)]">{i.raisedBy}</div>
              </div>
              <span className={`badge ${i.priority === "High" ? "badge-danger" : i.priority === "Medium" ? "badge-warning" : "badge-muted"}`}>{i.priority}</span>
            </div>
            <div className="flex items-center gap-2 mb-2 text-xs text-[color:var(--text-muted)]">
              <span className="badge badge-info">{i.category}</span>
              <span className="flex items-center gap-1"><Clock size={10} /> {formatDistanceToNow(i.createdOn)}</span>
            </div>
            <div className="text-sm font-medium mb-1">{i.subject}</div>
            <p className="text-xs text-[color:var(--text-muted)] line-clamp-2 mb-3">{i.description}</p>
            <div className="flex items-center justify-between pt-3 border-t border-[color:var(--border)]">
              <span className={`badge ${i.status === "Resolved" ? "badge-success" : i.status === "Assigned" ? "badge-info" : i.status === "Under Review" ? "badge-warning" : "badge-danger"}`}>{i.status}</span>
              {i.status !== "Resolved" && (
                <button onClick={() => resolve(i.id)} className="btn btn-success !text-xs !py-1 !px-2"><CheckCircle2 size={12} /> Resolve</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="section-card text-center text-sm text-[color:var(--text-muted)]">No issues match the current filter.</div>}
    </div>
  );
}
