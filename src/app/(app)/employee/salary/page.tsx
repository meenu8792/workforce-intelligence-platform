"use client";

import { useState } from "react";
import { useMyEmployee, useApp } from "@/lib/store";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { Wallet, CheckCircle2, Download, AlertCircle, FileText, Printer } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Modal } from "@/components/Modal";
import type { SalaryRecord } from "@/lib/types";

export default function MySalaryPage() {
  const me = useMyEmployee();
  const ack = useApp((s) => s.acknowledgeSalary);
  const addIssue = useApp((s) => s.addIssue);
  const pushToast = useApp((s) => s.pushToast);
  const { salaries } = useScope();
  const mySal = me ? salaries.filter((s) => s.employeeId === me.employeeId).sort((a, b) => b.month.localeCompare(a.month)) : [];

  const [showIssue, setShowIssue] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [previewing, setPreviewing] = useState<SalaryRecord | null>(null);

  function buildPayslipHTML(s: SalaryRecord) {
    const monthLabel = new Date(s.month + "-01").toLocaleDateString("en", { month: "long", year: "numeric" });
    return `<!doctype html>
<html><head><meta charset="utf-8"/><title>Payslip — ${me?.name ?? "Employee"} — ${monthLabel}</title>
<style>
  body{font-family:'Inter',-apple-system,Segoe UI,Roboto,sans-serif;background:#f6f8fc;padding:32px;color:#0b1220;margin:0}
  .card{max-width:760px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden}
  .header{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;padding:28px 32px}
  .header h1{margin:0;font-size:24px;letter-spacing:-.01em}
  .header .sub{opacity:.85;font-size:13px;margin-top:4px}
  .body{padding:28px 32px}
  .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eef2f7;font-size:14px}
  .row:last-child{border-bottom:0}
  .row .label{color:#64748b}
  .row .val{font-weight:600}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:18px 0 6px}
  .panel{background:#f6f8fc;border:1px solid #e2e8f0;border-radius:12px;padding:18px}
  .panel h3{margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#64748b;font-weight:600}
  .net{margin-top:18px;padding:18px;background:linear-gradient(135deg,#10b981,#06b6d4);color:#fff;border-radius:12px;display:flex;justify-content:space-between;align-items:center}
  .net .label{font-size:12px;text-transform:uppercase;letter-spacing:.06em;opacity:.85}
  .net .val{font-size:28px;font-weight:700;letter-spacing:-.01em}
  .footer{padding:16px 32px;background:#f6f8fc;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center}
  .pill{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600}
  .pill.ok{background:#d1fae5;color:#047857}
  .pill.warn{background:#fef3c7;color:#b45309}
  .pill.info{background:#dbeafe;color:#1d4ed8}
</style></head><body>
<div class="card">
  <div class="header">
    <h1>Nexora Workforce — Payslip</h1>
    <div class="sub">${monthLabel} · Generated ${new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
  </div>
  <div class="body">
    <div class="grid2">
      <div class="panel">
        <h3>Employee</h3>
        <div class="row"><span class="label">Name</span><span class="val">${me?.name ?? "—"}</span></div>
        <div class="row"><span class="label">Employee ID</span><span class="val">${me?.employeeId ?? "—"}</span></div>
        <div class="row"><span class="label">Department</span><span class="val">${me?.department ?? "—"}</span></div>
        <div class="row"><span class="label">Designation</span><span class="val">${me?.designation ?? "—"}</span></div>
        <div class="row"><span class="label">Location</span><span class="val">${me?.location ?? "—"}</span></div>
      </div>
      <div class="panel">
        <h3>Pay period</h3>
        <div class="row"><span class="label">Month</span><span class="val">${monthLabel}</span></div>
        <div class="row"><span class="label">Pay date</span><span class="val">Last working day of ${monthLabel}</span></div>
        <div class="row"><span class="label">Status</span><span class="val"><span class="pill ${s.status === "Credited" ? "ok" : s.status === "Processing" ? "warn" : "info"}">${s.status}</span></span></div>
        <div class="row"><span class="label">Acknowledged</span><span class="val">${s.acknowledged ? "Yes" : "Pending"}</span></div>
      </div>
    </div>
    <div class="panel" style="margin-top:18px">
      <h3>Earnings &amp; deductions</h3>
      <div class="row"><span class="label">Base salary</span><span class="val">${formatCurrency(s.baseSalary)}</span></div>
      <div class="row"><span class="label">Overtime</span><span class="val">${formatCurrency(s.overtime)}</span></div>
      <div class="row"><span class="label">Incentives</span><span class="val">${formatCurrency(s.incentives)}</span></div>
      <div class="row"><span class="label">Bonus</span><span class="val">${formatCurrency(s.bonus)}</span></div>
      <div class="row"><span class="label">Leave deduction</span><span class="val" style="color:#ef4444">− ${formatCurrency(s.leaveDeduction)}</span></div>
    </div>
    <div class="net"><div><div class="label">Net pay</div><div class="val">${formatCurrency(s.netPay)}</div></div><div style="text-align:right;font-size:11px;opacity:.85">Payslip ID<br/>${s.id}</div></div>
    <p style="font-size:11px;color:#94a3b8;margin-top:14px">Note: This is a system-generated payslip. Actual payroll processing is performed by the integrated payroll system. Please contact HR for any discrepancies.</p>
  </div>
  <div class="footer">Nexora Workforce Intelligence · Confidential</div>
</div>
</body></html>`;
  }

  function downloadPayslip(s: SalaryRecord) {
    if (!me) return;
    const monthLabel = new Date(s.month + "-01").toLocaleDateString("en", { month: "long", year: "numeric" });
    const html = buildPayslipHTML(s);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Payslip_${me.employeeId}_${s.month}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    pushToast({ message: `Payslip for ${monthLabel} downloaded.`, type: "success" });
  }

  function printPayslip(s: SalaryRecord) {
    if (!me) return;
    const html = buildPayslipHTML(s);
    const w = window.open("", "_blank");
    if (!w) {
      pushToast({ message: "Pop-up blocked. Please allow pop-ups to print.", type: "error" });
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 300);
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Salary & Payslips" description="Your monthly salary information, payslips and acknowledgements." icon={<Wallet size={16} />} />

      <div className="section-card !p-5 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5">
        <div className="text-xs text-[color:var(--text-muted)]">Annual CTC</div>
        <div className="text-3xl font-bold mt-1">{me ? formatCurrency(me.salary) : "—"}</div>
        <div className="text-[11px] text-[color:var(--text-muted)] mt-1">Note: This is payroll INPUT information. Actual payroll processing is performed by the integrated payroll system.</div>
      </div>

      <div className="space-y-3">
        {mySal.map((s) => (
          <div key={s.id} className="section-card">
            <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
              <div>
                <div className="text-xs text-[color:var(--text-muted)]">{new Date(s.month + "-01").toLocaleDateString("en", { month: "long", year: "numeric" })}</div>
                <div className="text-2xl font-bold mt-0.5">{formatCurrency(s.netPay)}</div>
                <div className="text-[11px] mt-1">
                  <span className={`badge ${s.status === "Credited" ? "badge-success" : s.status === "Processing" ? "badge-warning" : "badge-muted"}`}>{s.status}</span>
                  {s.acknowledged && <span className="badge badge-info ml-1">Acknowledged</span>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {!s.acknowledged && s.status === "Credited" && (
                  <button onClick={() => ack(s.id)} className="btn btn-success !text-sm"><CheckCircle2 size={14} /> Acknowledge</button>
                )}
                {s.status === "Credited" && (
                  <button onClick={() => setShowIssue(true)} className="btn btn-secondary !text-sm"><AlertCircle size={14} /> Report Issue</button>
                )}
                <button onClick={() => setPreviewing(s)} className="btn btn-secondary !text-sm"><FileText size={14} /> Preview</button>
                <button onClick={() => printPayslip(s)} className="btn btn-secondary !text-sm"><Printer size={14} /> Print</button>
                <button onClick={() => downloadPayslip(s)} className="btn btn-primary !text-sm"><Download size={14} /> Download Payslip</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              <Cell label="Base" value={formatCurrency(s.baseSalary)} />
              <Cell label="Overtime" value={formatCurrency(s.overtime)} color="amber" />
              <Cell label="Incentives" value={formatCurrency(s.incentives)} color="blue" />
              <Cell label="Bonus" value={formatCurrency(s.bonus)} color="emerald" />
              <Cell label="Deductions" value={formatCurrency(s.leaveDeduction)} color="rose" />
            </div>
          </div>
        ))}
        {mySal.length === 0 && <div className="section-card text-center text-sm text-[color:var(--text-muted)]">No salary records available.</div>}
      </div>

      {previewing && me && (
        <Modal open onClose={() => setPreviewing(null)} title={`Payslip — ${new Date(previewing.month + "-01").toLocaleDateString("en", { month: "long", year: "numeric" })}`} size="lg"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => printPayslip(previewing)}><Printer size={14} /> Print</button>
              <button className="btn btn-primary" onClick={() => downloadPayslip(previewing)}><Download size={14} /> Download</button>
            </>
          }
        >
          <div className="bg-white text-slate-900 rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white p-6">
              <div className="text-lg font-bold">Nexora Workforce — Payslip</div>
              <div className="text-xs opacity-85 mt-0.5">{new Date(previewing.month + "-01").toLocaleDateString("en", { month: "long", year: "numeric" })}</div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Employee</div>
                  <div className="flex justify-between py-1"><span className="text-slate-500">Name</span><span className="font-semibold">{me.name}</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-500">Employee ID</span><span className="font-semibold">{me.employeeId}</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-500">Department</span><span className="font-semibold">{me.department}</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-500">Designation</span><span className="font-semibold">{me.designation}</span></div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Pay period</div>
                  <div className="flex justify-between py-1"><span className="text-slate-500">Month</span><span className="font-semibold">{new Date(previewing.month + "-01").toLocaleDateString("en", { month: "long", year: "numeric" })}</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-500">Status</span><span className={`pill ${previewing.status === "Credited" ? "ok" : "warn"}`}>{previewing.status}</span></div>
                  <div className="flex justify-between py-1"><span className="text-slate-500">Acknowledged</span><span className="font-semibold">{previewing.acknowledged ? "Yes" : "Pending"}</span></div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Earnings &amp; deductions</div>
                <div className="flex justify-between py-1.5 border-b border-slate-200"><span className="text-slate-500">Base salary</span><span className="font-semibold">{formatCurrency(previewing.baseSalary)}</span></div>
                <div className="flex justify-between py-1.5 border-b border-slate-200"><span className="text-slate-500">Overtime</span><span className="font-semibold">{formatCurrency(previewing.overtime)}</span></div>
                <div className="flex justify-between py-1.5 border-b border-slate-200"><span className="text-slate-500">Incentives</span><span className="font-semibold">{formatCurrency(previewing.incentives)}</span></div>
                <div className="flex justify-between py-1.5 border-b border-slate-200"><span className="text-slate-500">Bonus</span><span className="font-semibold">{formatCurrency(previewing.bonus)}</span></div>
                <div className="flex justify-between py-1.5"><span className="text-slate-500">Leave deduction</span><span className="font-semibold text-rose-500">− {formatCurrency(previewing.leaveDeduction)}</span></div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white rounded-xl p-4 flex justify-between items-center">
                <div>
                  <div className="text-[10px] uppercase tracking-wider opacity-85">Net pay</div>
                  <div className="text-2xl font-bold">{formatCurrency(previewing.netPay)}</div>
                </div>
                <div className="text-[10px] opacity-80 text-right">Payslip ID<br />{previewing.id}</div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {showIssue && me && (
        <div className="modal-backdrop" onClick={() => setShowIssue(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-3">Report salary issue</h3>
            <div className="space-y-3">
              <div><label className="label">Category</label>
                <select className="input" defaultValue="Salary">
                  <option>Salary</option><option>Payslip</option><option>Attendance</option><option>Leave</option><option>Other</option>
                </select>
              </div>
              <div><label className="label">Describe your issue</label>
                <textarea className="input" rows={4} value={issueText} onChange={(e) => setIssueText(e.target.value)} placeholder="e.g. My salary has not been credited." />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2 pt-4 border-t border-[color:var(--border)]">
              <button className="btn btn-secondary" onClick={() => setShowIssue(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { addIssue({ raisedBy: me.employeeId, raisedByName: me.name, category: "Salary", subject: "Salary issue reported by employee", description: issueText || "Employee reported a salary issue." }); setShowIssue(false); setIssueText(""); }}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Cell({ label, value, color }: { label: string; value: string; color?: "amber" | "blue" | "emerald" | "rose" }) {
  const map = { amber: "text-amber-500", blue: "text-blue-500", emerald: "text-emerald-500", rose: "text-rose-500" } as const;
  return (
    <div className="p-2 rounded bg-[color:var(--bg-soft)]">
      <div className="text-[10px] text-[color:var(--text-muted)] uppercase">{label}</div>
      <div className={`text-sm font-semibold ${color ? map[color] : ""}`}>{value}</div>
    </div>
  );
}
