"use client";

import { useMemo, useState } from "react";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { TrendingUp, Search, Sparkles, Award } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export default function HRPerformancePage() {
  const { employees } = useScope();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("all");

  const departments = useMemo(() => Array.from(new Set(employees.map((e) => e.department))).sort(), [employees]);

  const filtered = useMemo(() => {
    return employees
      .filter((e) => dept === "all" || e.department === dept)
      .filter((e) => !query || [e.name, e.employeeId, e.designation].some((s) => String(s).toLowerCase().includes(query.toLowerCase())))
      .sort((a, b) => b.performanceScore - a.performanceScore);
  }, [employees, dept, query]);

  const top = filtered.slice(0, 5);
  const radarData = [
    { metric: "Performance", value: employees.reduce((a, b) => a + b.performanceScore, 0) / Math.max(1, employees.length) },
    { metric: "Attendance", value: employees.reduce((a, b) => a + b.attendancePct, 0) / Math.max(1, employees.length) },
    { metric: "Engagement", value: employees.reduce((a, b) => a + b.engagement, 0) / Math.max(1, employees.length) },
    { metric: "Productivity", value: (employees.reduce((a, b) => a + b.workHours, 0) / Math.max(1, employees.length)) * 10 },
    { metric: "Skill breadth", value: (employees.reduce((a, b) => a + b.skills.length, 0) / Math.max(1, employees.length)) * 10 },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Performance Management" description="KPI tracking, goal completion, productivity, and performance scorecards." icon={<TrendingUp size={16} />} />
      <DateRangeFilter query={query} onQueryChange={setQuery} showSearch />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3">Average workforce metrics</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fontSize: 9 }} stroke="var(--text-muted)" />
                <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section-card lg:col-span-2">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Award size={14} className="text-amber-500" /> Top performers</h3>
          <div className="space-y-2.5">
            {top.map((e, i) => (
              <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[color:var(--bg-soft)]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs font-bold flex items-center justify-center">{i + 1}</div>
                <Avatar name={e.name} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{e.name}</div>
                  <div className="text-[11px] text-[color:var(--text-muted)]">{e.designation} · {e.department}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-500">{e.performanceScore}%</div>
                  <div className="text-[10px] text-[color:var(--text-muted)]">performance</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-card !p-0">
        <div className="p-4 border-b border-[color:var(--border)] flex flex-wrap gap-2 items-center">
          <h3 className="font-semibold flex-1">All employees · ranked by performance</h3>
          <select className="input !w-auto !py-1.5 !text-xs" value={dept} onChange={(e) => setDept(e.target.value)}>
            <option value="all">All departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>Employee</th><th>Department</th><th>Performance</th><th>Attendance</th><th>Engagement</th><th>Training</th><th>Trend</th></tr></thead>
            <tbody>
              {filtered.slice(0, 30).map((e) => (
                <tr key={e.id}>
                  <td><div className="flex items-center gap-2"><Avatar name={e.name} size={28} /><div><div className="text-sm font-medium">{e.name}</div><div className="text-[10px] text-[color:var(--text-muted)]">{e.employeeId}</div></div></div></td>
                  <td className="text-[color:var(--text-muted)]">{e.department}</td>
                  <td><div className="flex items-center gap-2"><div className="w-16 h-1.5 rounded-full bg-[color:var(--bg-soft)] overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${e.performanceScore}%` }} /></div><span className="text-xs font-medium">{e.performanceScore}%</span></div></td>
                  <td>{e.attendancePct}%</td>
                  <td>{e.engagement}%</td>
                  <td><span className="text-xs">{e.trainingCompleted}/{e.trainingRequired}</span></td>
                  <td><span className={`badge ${e.performanceScore > 80 ? "badge-success" : e.performanceScore > 65 ? "badge-info" : "badge-warning"}`}>{e.performanceScore > 80 ? "↑ Up" : e.performanceScore > 65 ? "→ Stable" : "↓ Down"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
