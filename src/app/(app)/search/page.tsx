"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { Search as SearchIcon, Filter } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Modal } from "@/components/Modal";
import { EmployeeProfile } from "../admin/employees/page";
import type { Employee } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SearchInner() {
  const sp = useSearchParams();
  const employees = useApp((s) => s.employees);
  const [q, setQ] = useState(sp?.get("q") ?? "");
  const [dept, setDept] = useState("all");
  const [role, setRole] = useState("all");
  const [selected, setSelected] = useState<Employee | null>(null);

  const departments = useMemo(() => Array.from(new Set(employees.map((e) => e.department))).sort(), [employees]);

  const results = useMemo(() => {
    if (!q && dept === "all" && role === "all") return employees.slice(0, 30);
    return employees.filter((e) => {
      if (dept !== "all" && e.department !== dept) return false;
      if (role !== "all" && e.role !== role) return false;
      if (!q) return true;
      const t = q.toLowerCase();
      return [e.name, e.employeeId, e.email, e.department, e.designation, e.location, e.manager, e.project, ...e.skills].some((s) => String(s).toLowerCase().includes(t));
    });
  }, [employees, q, dept, role]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Search" description="Find employees, departments, skills, projects, and more." icon={<SearchIcon size={16} />} />

      <div className="section-card !p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="input pl-9" autoFocus />
          </div>
          <select className="input !w-auto cursor-pointer" value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="all">All departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="input !w-auto cursor-pointer" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="all">All roles</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="text-xs text-[color:var(--text-muted)] mt-3">{results.length} results</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {results.map((e) => (
          <button key={e.id} onClick={() => setSelected(e)} className="section-card !p-4 text-left hover:!border-blue-500 transition">
            <div className="flex items-center gap-3">
              <Avatar name={e.name} size={40} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{e.name}</div>
                <div className="text-[10px] text-[color:var(--text-muted)]">{e.employeeId} · {e.designation}</div>
                <div className="text-[10px] text-[color:var(--text-muted)]">{e.department} · {e.location}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2.5">
              {e.skills.slice(0, 4).map((s) => <span key={s} className="tag !text-[10px]">{s}</span>)}
            </div>
          </button>
        ))}
        {results.length === 0 && <div className="section-card col-span-full text-center text-sm text-[color:var(--text-muted)]">No results found.</div>}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Employee Profile" size="lg">
        {selected && <EmployeeProfile employee={selected} />}
      </Modal>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="p-6 text-sm text-[color:var(--text-muted)]">Loading…</div>}><SearchInner /></Suspense>;
}
