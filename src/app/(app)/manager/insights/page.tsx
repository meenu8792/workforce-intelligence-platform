"use client";

import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { DateRangeFilter } from "@/components/DateRangeFilter";
import { Sparkles, TrendingUp, AlertTriangle, Award, BookOpen } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export default function ManagerInsightsPage() {
  const { employees } = useScope();

  const highPerf = employees.filter((e) => e.performanceScore > 85).sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 5);
  const overworked = employees.filter((e) => e.overtime > 20).sort((a, b) => b.overtime - a.overtime).slice(0, 5);
  const trainingNeed = employees.filter((e) => e.trainingCompleted < e.trainingRequired).sort((a, b) => (a.trainingCompleted / Math.max(1, a.trainingRequired)) - (b.trainingCompleted / Math.max(1, b.trainingRequired))).slice(0, 5);
  const attritionRisk = employees.filter((e) => e.attritionRisk === "High").slice(0, 5);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="AI Team Insights" description="Predictive signals and recommendations based on the workforce dataset." icon={<Sparkles size={16} />} />
      <DateRangeFilter />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightCard title="High performers" icon={<Award size={14} />} color="emerald" count={highPerf.length} desc="Employees with consistent strong performance.">
          {highPerf.map((e) => <EmpRow key={e.id} e={e} value={`${e.performanceScore}%`} valueClass="text-emerald-500" />)}
        </InsightCard>
        <InsightCard title="Overworked" icon={<AlertTriangle size={14} />} color="amber" count={overworked.length} desc="Employees with sustained overtime.">
          {overworked.map((e) => <EmpRow key={e.id} e={e} value={`${e.overtime}h OT`} valueClass="text-amber-500" />)}
        </InsightCard>
        <InsightCard title="Training needed" icon={<BookOpen size={14} />} color="violet" count={trainingNeed.length} desc="Employees behind on required training.">
          {trainingNeed.map((e) => <EmpRow key={e.id} e={e} value={`${e.trainingCompleted}/${e.trainingRequired}`} valueClass="text-violet-500" />)}
        </InsightCard>
        <InsightCard title="Attrition risk" icon={<TrendingUp size={14} />} color="rose" count={attritionRisk.length} desc="Predicted risk of leaving the organisation.">
          {attritionRisk.map((e) => <EmpRow key={e.id} e={e} value={e.attritionRisk} valueClass="text-rose-500" />)}
        </InsightCard>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-2 flex items-center gap-2"><Sparkles size={14} className="text-violet-500" /> AI Recommendations</h3>
        <p className="text-xs text-[color:var(--text-muted)] mb-3">Final decision should be made by HR/management. These are AI-generated signals based on the current dataset.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Schedule 1:1 conversations with high-risk employees.",
            "Recognise top performers through formal recognition program.",
            "Reassign overtime-heavy employees to balance workload.",
            "Prioritise closing training gaps for the upcoming quarter.",
            "Review compensation for employees with high performance + tenure.",
            "Investigate common factors among medium-risk employees.",
          ].map((r) => (
            <div key={r} className="p-3 rounded-xl bg-[color:var(--bg-soft)] text-sm">{r}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, icon, color, count, desc, children }: { title: string; icon: React.ReactNode; color: "emerald" | "amber" | "violet" | "rose"; count: number; desc: string; children: React.ReactNode }) {
  const map = { emerald: "from-emerald-500/15 text-emerald-500", amber: "from-amber-500/15 text-amber-500", violet: "from-violet-500/15 text-violet-500", rose: "from-rose-500/15 text-rose-500" } as const;
  return (
    <div className="section-card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold flex items-center gap-2">{icon} {title}</h3>
          <p className="text-xs text-[color:var(--text-muted)]">{desc}</p>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-sm font-bold bg-gradient-to-br ${map[color]} to-transparent`}>{count}</div>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function EmpRow({ e, value, valueClass }: { e: { id: string; name: string; designation: string }; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-[color:var(--bg-soft)]">
      <Avatar name={e.name} size={30} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{e.name}</div>
        <div className="text-[10px] text-[color:var(--text-muted)] truncate">{e.designation}</div>
      </div>
      <span className={`text-sm font-bold ${valueClass ?? ""}`}>{value}</span>
    </div>
  );
}
