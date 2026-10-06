"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { ShieldCheck, Search, Download, Filter } from "lucide-react";

export default function AuditLogsPage() {
  const audit = useApp((s) => s.audit);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string>("all");

  const filtered = audit.filter((a) => {
    if (role !== "all" && a.role !== role) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return [a.actor, a.action, a.role].some((s) => String(s).toLowerCase().includes(q));
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Audit Logs" description="Immutable trail of important platform events and user actions." icon={<ShieldCheck size={16} />}
        action={<button className="btn btn-secondary"><Download size={14} /> Export</button>}
      />

      <div className="section-card !p-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by actor, action..." className="input pl-9 !py-2 !text-sm" />
          </div>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input !w-auto !py-2 !text-sm">
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </div>
      </div>

      <div className="section-card !p-0">
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>Actor</th><th>Role</th><th>Action</th><th>Time</th></tr></thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td className="font-medium">{a.actor}</td>
                  <td><span className="badge badge-muted capitalize">{a.role}</span></td>
                  <td>{a.action}</td>
                  <td className="text-[color:var(--text-muted)] text-xs">{new Date(a.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-6 text-center text-sm text-[color:var(--text-muted)]">No audit events found.</div>}
      </div>
    </div>
  );
}
