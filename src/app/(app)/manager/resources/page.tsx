"use client";

import { useMemo } from "react";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Briefcase, Users } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

export default function ManagerResourcesPage() {
  const { employees, timesheets } = useScope();

  const byProject = useMemo(() => {
    const m: Record<string, { project: string; hours: number; members: Set<string> }> = {};
    for (const t of timesheets) {
      if (!m[t.project]) m[t.project] = { project: t.project, hours: 0, members: new Set() };
      m[t.project].hours += t.hours;
      m[t.project].members.add(t.employeeId);
    }
    return Object.values(m).map((x) => ({ project: x.project, hours: x.hours, members: x.members.size }));
  }, [timesheets]);

  const workloads = useMemo(() => employees.map((e) => {
    const tHrs = timesheets.filter((t) => t.employeeId === e.employeeId).reduce((a, b) => a + b.hours, 0);
    return { name: e.name, hours: tHrs, project: e.project, ot: e.overtime };
  }).sort((a, b) => b.hours - a.hours), [employees, timesheets]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Resource Planning" description="Project allocation, workload distribution and team utilisation." icon={<Briefcase size={16} />} />
      <DateRangeFilter />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3">Project allocation</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={byProject}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="project" tick={{ fontSize: 10 }} stroke="var(--text-muted)" angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="hours" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Hours" />
                <Bar dataKey="members" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Members" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Users size={14} className="text-blue-500" /> Workload distribution</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {workloads.slice(0, 12).map((w) => {
              const util = Math.min(100, (w.hours / 80) * 100);
              return (
                <div key={w.name} className="p-2.5 rounded-lg bg-[color:var(--bg-soft)]">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar name={w.name} size={26} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{w.name}</div>
                      <div className="text-[10px] text-[color:var(--text-muted)]">{w.project} · {w.ot}h OT</div>
                    </div>
                    <span className="text-xs font-medium">{w.hours.toFixed(0)}h</span>
                  </div>
                  <div className="progress-bar h-1.5"><div className="progress-fill" style={{ width: `${util}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
