"use client";

import { useMemo } from "react";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Avatar } from "@/components/Avatar";
import { Brain, Sparkles, BookOpen, Trophy, GraduationCap } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

export default function HRTalentPage() {
  const { employees } = useScope();

  const skillFreq = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of employees) for (const s of e.skills) m[s] = (m[s] ?? 0) + 1;
    return Object.entries(m).map(([skill, count]) => ({ skill, count })).sort((a, b) => b.count - a.count);
  }, [employees]);

  const appraisalCandidates = useMemo(() => employees
    .filter((e) => e.performanceScore > 80 && e.attendancePct > 85 && e.yearsOfExperience > 3)
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 8), [employees]);

  const promotionReady = useMemo(() => employees
    .filter((e) => e.promotionEligible)
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 6), [employees]);

  const trainingGap = useMemo(() => employees
    .filter((e) => e.trainingCompleted < e.trainingRequired)
    .sort((a, b) => (a.trainingCompleted / Math.max(1, a.trainingRequired)) - (b.trainingCompleted / Math.max(1, b.trainingRequired)))
    .slice(0, 8), [employees]);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Talent Intelligence" description="Skill coverage, appraisal candidates, training needs, and promotion readiness." icon={<Brain size={16} />} />
      <DateRangeFilter />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-1 flex items-center gap-2"><Trophy size={14} className="text-amber-500" /> Appraisal candidates</h3>
          <p className="text-xs text-[color:var(--text-muted)] mb-3">Strong performance + attendance + tenure.</p>
          <div className="space-y-2">
            {appraisalCandidates.map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-[color:var(--bg-soft)]">
                <Avatar name={e.name} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{e.name}</div>
                  <div className="text-[11px] text-[color:var(--text-muted)]">{e.designation} · {e.department}</div>
                </div>
                <div className="text-xs text-right">
                  <div className="font-semibold text-emerald-500">{e.performanceScore}%</div>
                  <div className="text-[color:var(--text-muted)]">perf · {e.attendancePct}% att</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-1 flex items-center gap-2"><Sparkles size={14} className="text-violet-500" /> Promotion ready</h3>
          <p className="text-xs text-[color:var(--text-muted)] mb-3">Eligible employees based on multi-factor scoring.</p>
          <div className="space-y-2">
            {promotionReady.map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-gradient-to-r from-violet-500/5 to-blue-500/5 border border-violet-500/20">
                <Avatar name={e.name} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{e.name}</div>
                  <div className="text-[11px] text-[color:var(--text-muted)]">{e.designation} → Senior {e.designation}</div>
                </div>
                <span className="badge badge-purple">Ready</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3">Top skills in workforce</h3>
          <div className="h-72">
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
          <h3 className="font-semibold mb-1 flex items-center gap-2"><GraduationCap size={14} className="text-rose-500" /> Training gap</h3>
          <p className="text-xs text-[color:var(--text-muted)] mb-3">Employees most behind on required training.</p>
          <div className="space-y-2">
            {trainingGap.map((e) => {
              const pct = (e.trainingCompleted / Math.max(1, e.trainingRequired)) * 100;
              return (
                <div key={e.id} className="p-2.5 rounded-lg bg-[color:var(--bg-soft)]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Avatar name={e.name} size={26} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{e.name}</div>
                      <div className="text-[10px] text-[color:var(--text-muted)]">{e.department}</div>
                    </div>
                    <span className="text-xs font-medium">{e.trainingCompleted}/{e.trainingRequired}</span>
                  </div>
                  <div className="progress-bar h-1.5"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
