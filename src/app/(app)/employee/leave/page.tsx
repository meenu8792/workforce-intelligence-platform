"use client";

import { useState } from "react";
import { useMyEmployee, useApp } from "@/lib/store";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { CalendarDays, Plus, Check, X as XIcon } from "lucide-react";

export default function MyLeavePage() {
  const me = useMyEmployee();
  const apply = useApp((s) => s.applyLeave);
  const { leaves } = useScope();
  const myLeaves = me ? leaves.filter((l) => l.employeeId === me.employeeId) : [];
  const pending = myLeaves.filter((l) => l.status === "Pending").length;
  const approved = myLeaves.filter((l) => l.status === "Approved").length;
  const rejected = myLeaves.filter((l) => l.status === "Rejected").length;

  const [show, setShow] = useState(false);
  const [type, setType] = useState("Casual");
  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [reason, setReason] = useState("");

  const submit = () => {
    if (!me) return;
    if (from > to) return;
    const days = Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1;
    apply({ employeeId: me.employeeId, employeeName: me.name, type: type as never, fromDate: from, toDate: to, days, reason: reason || "Personal" });
    setShow(false); setReason("");
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="My Leave" description="Apply for leave and track your request history." icon={<CalendarDays size={16} />}
        action={<button className="btn btn-primary" onClick={() => setShow(true)}><Plus size={14} /> Apply Leave</button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="kpi-card"><div className="text-xs uppercase text-[color:var(--text-muted)] font-medium">Balance</div><div className="text-2xl font-bold mt-1">{me?.leaveBalance ?? 0}d</div></div>
        <div className="kpi-card"><div className="text-xs uppercase text-[color:var(--text-muted)] font-medium">Pending</div><div className="text-2xl font-bold mt-1 text-amber-500">{pending}</div></div>
        <div className="kpi-card"><div className="text-xs uppercase text-[color:var(--text-muted)] font-medium">Approved</div><div className="text-2xl font-bold mt-1 text-emerald-500">{approved}</div></div>
        <div className="kpi-card"><div className="text-xs uppercase text-[color:var(--text-muted)] font-medium">Rejected</div><div className="text-2xl font-bold mt-1 text-rose-500">{rejected}</div></div>
      </div>

      <div className="section-card !p-0">
        <div className="p-4 border-b border-[color:var(--border)]"><h3 className="font-semibold">Leave history</h3></div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th></tr></thead>
            <tbody>
              {myLeaves.map((l) => (
                <tr key={l.id}>
                  <td>{l.type}</td>
                  <td className="text-[color:var(--text-muted)]">{l.fromDate}</td>
                  <td className="text-[color:var(--text-muted)]">{l.toDate}</td>
                  <td>{l.days}</td>
                  <td className="text-[color:var(--text-muted)] text-xs">{l.reason}</td>
                  <td><span className={`badge ${l.status === "Approved" ? "badge-success" : l.status === "Rejected" ? "badge-danger" : "badge-warning"}`}>{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {myLeaves.length === 0 && <div className="p-6 text-center text-sm text-[color:var(--text-muted)]">No leave records yet. Click "Apply Leave" to submit your first request.</div>}
      </div>

      {show && (
        <div className="modal-backdrop" onClick={() => setShow(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-3">Apply for leave</h3>
            <div className="space-y-3">
              <div><label className="label">Leave type</label>
                <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
                  {["Casual", "Sick", "Earned", "Unpaid", "Maternity", "Paternity"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="label">From</label><input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
                <div><label className="label">To</label><input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} /></div>
              </div>
              <div><label className="label">Reason</label><textarea className="input" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Briefly describe the reason for your leave..." /></div>
            </div>
            <div className="mt-4 flex justify-end gap-2 pt-4 border-t border-[color:var(--border)]">
              <button className="btn btn-secondary" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit}>Submit request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
