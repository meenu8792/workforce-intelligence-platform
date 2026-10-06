"use client";

import { useState } from "react";
import { useMyEmployee, useApp } from "@/lib/store";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { FileClock, Plus, Trash2 } from "lucide-react";
import { todayISO } from "@/lib/utils";

export default function MyTimesheetPage() {
  const me = useMyEmployee();
  const submit = useApp((s) => s.submitTimesheet);
  const { timesheets } = useScope();
  const myTs = me ? timesheets.filter((t) => t.employeeId === me.employeeId) : [];

  const [project, setProject] = useState(me?.project ?? "Internal");
  const [task, setTask] = useState("Development");
  const [hours, setHours] = useState(2);
  const [date, setDate] = useState(todayISO());
  const [billable, setBillable] = useState(true);

  const onSubmit = () => {
    if (!me) return;
    if (hours <= 0) return;
    submit({ employeeId: me.employeeId, date, project, task, hours, billable });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="My Timesheet" description="Log project hours and submit for approval." icon={<FileClock size={16} />} />

      <div className="section-card">
        <h3 className="font-semibold mb-3">Log new entry</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div><label className="label">Date</label><input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div><label className="label">Project</label>
            <select className="input" value={project} onChange={(e) => setProject(e.target.value)}>
              <option>Helios CRM</option><option>Atlas Migration</option><option>Nova Analytics</option><option>Orion Mobile</option><option>Phoenix AI</option><option>Aegis Security</option><option>Zephyr Internal</option><option>Lighthouse Reporting</option><option>Internal</option>
            </select>
          </div>
          <div><label className="label">Task</label>
            <select className="input" value={task} onChange={(e) => setTask(e.target.value)}>
              {["Development", "Design", "Review", "Testing", "Documentation", "Meetings"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label className="label">Hours</label><input type="number" min="0" max="12" step="0.5" className="input" value={hours} onChange={(e) => setHours(Number(e.target.value))} /></div>
          <div className="flex flex-col">
            <label className="label">Billable</label>
            <select className="input" value={billable ? "yes" : "no"} onChange={(e) => setBillable(e.target.value === "yes")}>
              <option value="yes">Billable</option>
              <option value="no">Non-billable</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button onClick={onSubmit} className="btn btn-primary"><Plus size={14} /> Submit entry</button>
        </div>
      </div>

      <div className="section-card !p-0">
        <div className="p-4 border-b border-[color:var(--border)]"><h3 className="font-semibold">Recent entries</h3></div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>Date</th><th>Project</th><th>Task</th><th>Hours</th><th>Billable</th><th>Status</th></tr></thead>
            <tbody>
              {myTs.slice(0, 20).map((t) => (
                <tr key={t.id}>
                  <td className="text-[color:var(--text-muted)]">{t.date}</td>
                  <td>{t.project}</td>
                  <td className="text-[color:var(--text-muted)] text-xs">{t.task}</td>
                  <td><span className="font-semibold">{t.hours}</span></td>
                  <td>{t.billable ? <span className="badge badge-success">Billable</span> : <span className="badge badge-muted">Non-billable</span>}</td>
                  <td><span className={`badge ${t.status === "Approved" ? "badge-success" : t.status === "Rejected" ? "badge-danger" : "badge-warning"}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {myTs.length === 0 && <div className="p-6 text-center text-sm text-[color:var(--text-muted)]">No timesheet entries yet.</div>}
      </div>
    </div>
  );
}
