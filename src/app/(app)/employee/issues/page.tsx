"use client";

import { useState } from "react";
import { useMyEmployee, useApp } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { AlertTriangle, Plus, Clock } from "lucide-react";
import { formatDistanceToNow } from "@/lib/date";

export default function MyIssuesPage() {
  const me = useMyEmployee();
  const addIssue = useApp((s) => s.addIssue);
  const issues = useApp((s) => s.issues);
  const myIssues = me ? issues.filter((i) => i.raisedBy === me.employeeId) : [];

  const [show, setShow] = useState(false);
  const [category, setCategory] = useState<"Salary" | "Attendance" | "Leave" | "Shift" | "Payslip" | "Profile" | "Other">("Salary");
  const [subject, setSubject] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");

  const submit = () => {
    if (!me || !subject) return;
    addIssue({ raisedBy: me.employeeId, raisedByName: me.name, category, subject, description: desc, priority });
    setShow(false); setSubject(""); setDesc("");
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="My Issues" description="Report issues and track the status of your HR queries." icon={<AlertTriangle size={16} />}
        action={<button className="btn btn-primary" onClick={() => setShow(true)}><Plus size={14} /> Report Issue</button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {myIssues.map((i) => (
          <div key={i.id} className="section-card">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-info">{i.category}</span>
                  <span className={`badge ${i.priority === "High" ? "badge-danger" : i.priority === "Medium" ? "badge-warning" : "badge-muted"}`}>{i.priority}</span>
                </div>
                <div className="font-semibold text-sm">{i.subject}</div>
              </div>
              <span className={`badge ${i.status === "Resolved" ? "badge-success" : i.status === "Assigned" ? "badge-info" : i.status === "Under Review" ? "badge-warning" : "badge-danger"}`}>{i.status}</span>
            </div>
            <p className="text-xs text-[color:var(--text-muted)] line-clamp-2">{i.description}</p>
            <div className="text-[10px] text-[color:var(--text-muted)] mt-2 flex items-center gap-1"><Clock size={10} /> {formatDistanceToNow(i.createdOn)}</div>
          </div>
        ))}
        {myIssues.length === 0 && <div className="section-card col-span-full text-center text-sm text-[color:var(--text-muted)]">No issues raised. Click "Report Issue" to submit one.</div>}
      </div>

      {show && (
        <div className="modal-backdrop" onClick={() => setShow(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-3">Report an issue</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">Category</label>
                  <select className="input" value={category} onChange={(e) => setCategory(e.target.value as never)}>
                    {["Salary", "Attendance", "Leave", "Shift", "Payslip", "Profile", "Other"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Priority</label>
                  <select className="input" value={priority} onChange={(e) => setPriority(e.target.value as never)}>
                    {["Low", "Medium", "High"].map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Subject</label>
                <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Short summary of the issue" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe your issue in detail..." />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2 pt-4 border-t border-[color:var(--border)]">
              <button className="btn btn-secondary" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit}>Submit issue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
