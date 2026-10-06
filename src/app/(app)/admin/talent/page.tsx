"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { Brain, AlertTriangle, Sparkles, Target, BookOpen, GraduationCap, Trophy } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ScatterChart, Scatter, ZAxis } from "recharts";
import { Avatar } from "@/components/Avatar";

export default function TalentIntelligencePage() {
  const { employees } = useScope();
  const [selected, setSelected] = useState<string | null>(null);

  const skillFreq = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of employees) for (const s of e.skills) m[s] = (m[s] || 0) + 1;
    return Object.entries(m).map(([skill, count]) => ({ skill, count })).sort((a, b) => b.count - a.count);
  }, [employees]);

  const appraisalCandidates = useMemo(() => {
    return employees
      .filter((e) => e.performanceScore > 80 && e.attendancePct > 85 && e.yearsOfExperience > 3)
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, 8);
  }, [employees]);

  const trainingNeeds = useMemo(() => {
    return employees
      .filter((e) => e.trainingCompleted < e.trainingRequired)
      .sort((a, b) => (a.trainingCompleted / Math.max(1, a.trainingRequired)) - (b.trainingCompleted / Math.max(1, b.trainingRequired)))
      .slice(0, 8);
  }, [employees]);

  const performanceScatter = useMemo(() => {
    return employees.map((e) => ({ x: e.performanceScore, y: e.engagement, z: e.salary / 5000, name: e.name }));
  }, [employees]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Talent Intelligence" description="AI-driven skill mapping, appraisal recommendations, and training needs analysis." icon={<Brain size={16} />} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-1 flex items-center gap-2"><Trophy size={14} className="text-amber-500" /> Appraisal & Bonus Candidates</h3>
          <p className="text-xs text-[color:var(--text-muted)] mb-3">Top performers with strong attendance and tenure — eligible for review.</p>
          <div className="space-y-2">
            {appraisalCandidates.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e.id)}
                className="w-full text-left p-2.5 rounded-lg bg-[color:var(--bg-soft)] hover:bg-amber-500/10 transition flex items-center gap-3"
              >
                <Avatar name={e.name} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{e.name}</div>
                  <div className="text-[11px] text-[color:var(--text-muted)]">{e.designation} · {e.yearsOfExperience}y exp</div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold text-emerald-500">{e.performanceScore}%</div>
                  <div className="text-[color:var(--text-muted)]">perf</div>
                </div>
              </button>
            ))}
            {appraisalCandidates.length === 0 && <p className="text-sm text-[color:var(--text-muted)] text-center py-4">No candidates match the criteria.</p>}
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-1 flex items-center gap-2"><BookOpen size={14} className="text-rose-500" /> Training Needs</h3>
          <p className="text-xs text-[color:var(--text-muted)] mb-3">Employees with the highest training gap relative to requirement.</p>
          <div className="space-y-2">
            {trainingNeeds.map((e) => {
              const pct = (e.trainingCompleted / Math.max(1, e.trainingRequired)) * 100;
              return (
                <div key={e.id} className="p-2.5 rounded-lg bg-[color:var(--bg-soft)]">
                  <div className="flex items-center gap-3 mb-1.5">
                    <Avatar name={e.name} size={28} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{e.name}</div>
                      <div className="text-[11px] text-[color:var(--text-muted)]">{e.designation}</div>
                    </div>
                    <div className="text-xs font-medium">{e.trainingCompleted}/{e.trainingRequired}</div>
                  </div>
                  <div className="progress-bar h-1.5"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
            {trainingNeeds.length === 0 && <p className="text-sm text-[color:var(--text-muted)] text-center py-4">All employees are up to date with training.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3">Top skills in workforce</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={skillFreq.slice(0, 10)}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="skill" tick={{ fontSize: 10 }} stroke="var(--text-muted)" angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-1">Performance vs Engagement</h3>
          <p className="text-xs text-[color:var(--text-muted)] mb-3">Bubble size reflects compensation.</p>
          <div className="h-64">
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid stroke="var(--border)" />
                <XAxis type="number" dataKey="x" name="Performance" unit="%" stroke="var(--text-muted)" domain={[0, 100]} />
                <YAxis type="number" dataKey="y" name="Engagement" unit="%" stroke="var(--text-muted)" domain={[0, 100]} />
                <ZAxis type="number" dataKey="z" range={[40, 250]} />
                <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                  <div className="bg-[color:var(--bg-elev)] border border-[color:var(--border)] p-2 rounded text-xs">
                    <div className="font-medium">{(payload[0].payload as { name?: string }).name}</div>
                    <div>Performance: {payload[0].payload.x}%</div>
                    <div>Engagement: {payload[0].payload.y}%</div>
                  </div>
                ) : null} />
                <Scatter data={performanceScatter} fill="#8b5cf6" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
