"use client";

import { useMyEmployee } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { TrendingUp, Star, Sparkles, Target, Activity, Award } from "lucide-react";

export default function MyPerformancePage() {
  const me = useMyEmployee();
  if (!me) return null;

  const kpis = [
    { label: "Performance Score", value: me.performanceScore, suffix: "%", color: "from-emerald-500/15 text-emerald-500" },
    { label: "Attendance", value: me.attendancePct, suffix: "%", color: "from-blue-500/15 text-blue-500" },
    { label: "Engagement", value: me.engagement, suffix: "%", color: "from-violet-500/15 text-violet-500" },
    { label: "Productivity", value: me.workHours * 10, suffix: "%", color: "from-cyan-500/15 text-cyan-500" },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="My Performance" description="Performance scorecard, KPIs and AI-powered career insight." icon={<TrendingUp size={16} />} />

      <div className="section-card !p-5 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white">
            <Star size={28} />
          </div>
          <div>
            <div className="text-xs text-[color:var(--text-muted)]">Overall performance score</div>
            <div className="text-3xl font-bold">{me.performanceScore}<span className="text-base text-[color:var(--text-muted)]">/100</span></div>
            <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">Calculated from attendance, engagement, productivity, training and project contribution.</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="kpi-card">
            <div className={`inline-block p-1.5 rounded-md bg-gradient-to-br ${k.color} mb-2`}><Target size={14} /></div>
            <div className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider font-medium">{k.label}</div>
            <div className="text-2xl font-bold mt-1">{k.value}{k.suffix}</div>
            <div className="progress-bar mt-2"><div className="progress-fill" style={{ width: `${Math.min(100, k.value)}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3">KPI breakdown</h3>
          <div className="space-y-2.5 text-sm">
            {[
              { label: "Goal completion", value: me.performanceScore - 5 },
              { label: "Project contribution", value: Math.min(100, me.performanceScore + 3) },
              { label: "Skill development", value: (me.trainingCompleted / Math.max(1, me.trainingRequired)) * 100 },
              { label: "Attendance", value: me.attendancePct },
              { label: "Engagement", value: me.engagement },
            ].map((k) => (
              <div key={k.label}>
                <div className="flex justify-between mb-1"><span className="text-[color:var(--text-muted)]">{k.label}</span><span className="font-medium">{k.value.toFixed(0)}%</span></div>
                <div className="progress-bar h-1.5"><div className="progress-fill" style={{ width: `${k.value}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Sparkles size={14} className="text-violet-500" /> AI Performance Insight</h3>
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/5 to-blue-500/5 border border-violet-500/20">
            {me.performanceScore > 80 && me.attendancePct > 90 ? (
              <p className="text-sm text-[color:var(--text-muted)]">{me.name}, you demonstrate strong and consistent performance. The system recommends considering you for performance review or additional recognition. Final decision should be made by authorized HR/management.</p>
            ) : me.performanceScore > 70 ? (
              <p className="text-sm text-[color:var(--text-muted)]">You are performing steadily. Focusing on closing training gaps and improving engagement will unlock more growth opportunities.</p>
            ) : (
              <p className="text-sm text-[color:var(--text-muted)]">Consider prioritising attendance and engaging with mentors. Targeted training on key skills will significantly improve your performance trajectory.</p>
            )}
          </div>
          <div className="mt-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-[color:var(--text-muted)]">
            <Award size={12} className="inline text-amber-500" /> Note: AI recommendations are decision-support only. Final appraisal, bonus, and promotion decisions should be made by HR/management.
          </div>
        </div>
      </div>
    </div>
  );
}
