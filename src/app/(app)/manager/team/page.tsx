"use client";

import { useMemo, useState } from "react";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Avatar } from "@/components/Avatar";
import { Users, Search } from "lucide-react";
import { Modal } from "@/components/Modal";
import { EmployeeProfile } from "@/app/(app)/admin/employees/page";
import type { Employee } from "@/lib/types";

export default function ManagerTeamPage() {
  const { employees } = useScope();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);

  const filtered = useMemo(() => employees.filter((e) => !query || [e.name, e.employeeId, e.email, e.designation, ...e.skills].some((s) => String(s).toLowerCase().includes(query.toLowerCase()))), [employees, query]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="My Team" description={`${employees.length} members in your team.`} icon={<Users size={16} />} />
      <DateRangeFilter query={query} onQueryChange={setQuery} showSearch />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((e) => (
          <button key={e.id} onClick={() => setSelected(e)} className="section-card !p-4 text-left hover:!border-blue-500 transition">
            <div className="flex items-start gap-3">
              <Avatar name={e.name} size={42} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{e.name}</div>
                <div className="text-[10px] text-[color:var(--text-muted)]">{e.employeeId} · {e.designation}</div>
              </div>
              <span className={`badge ${e.status === "Active" ? "badge-success" : "badge-warning"}`}>{e.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
              <div className="text-center p-1.5 rounded bg-[color:var(--bg-soft)]">
                <div className="text-[10px] text-[color:var(--text-muted)]">Perf</div>
                <div className="font-bold text-emerald-500">{e.performanceScore}%</div>
              </div>
              <div className="text-center p-1.5 rounded bg-[color:var(--bg-soft)]">
                <div className="text-[10px] text-[color:var(--text-muted)]">Att</div>
                <div className="font-bold text-blue-500">{e.attendancePct}%</div>
              </div>
              <div className="text-center p-1.5 rounded bg-[color:var(--bg-soft)]">
                <div className="text-[10px] text-[color:var(--text-muted)]">Risk</div>
                <div className={`font-bold ${e.attritionRisk === "High" ? "text-rose-500" : e.attritionRisk === "Medium" ? "text-amber-500" : "text-emerald-500"}`}>{e.attritionRisk[0]}</div>
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && <div className="section-card col-span-full text-center text-sm text-[color:var(--text-muted)]">No team members found.</div>}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Employee Profile" size="lg">
        {selected && <EmployeeProfile employee={selected} />}
      </Modal>
    </div>
  );
}
