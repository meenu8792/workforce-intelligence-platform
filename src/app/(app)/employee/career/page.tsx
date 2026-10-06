"use client";

import { useMyEmployee } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { Sparkles, TrendingUp, Award, BookOpen, Target, Briefcase } from "lucide-react";

export default function MyCareerPage() {
  const me = useMyEmployee();
  if (!me) return null;

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Career Growth" description="AI-powered career path recommendations and growth opportunities." icon={<Sparkles size={16} />} />

      <div className="section-card !p-5 bg-gradient-to-br from-violet-500/5 via-blue-500/5 to-cyan-500/5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white"><Sparkles size={20} /></div>
          <div>
            <h3 className="text-lg font-bold">AI Career Recommendation</h3>
            <p className="text-sm text-[color:var(--text-muted)] mt-1.5">
              {me.performanceScore > 80 && me.attendancePct > 90 && me.yearsOfExperience > 3 ? (
                <>{me.name}, based on your consistent performance ({me.performanceScore}%), strong attendance ({me.attendancePct}%) and {me.yearsOfExperience} years of experience, you may be ready for a promotion to <b>Senior {me.designation}</b> or a cross-functional leadership role. Recommendation: discuss with your manager. Final decision should be made by HR/management.</>
              ) : me.performanceScore > 70 ? (
                <>You are on a steady growth path. Continue building depth in {me.skills[0] ?? "your core skill"} and consider taking on stretch projects to accelerate your trajectory.</>
              ) : (
                <>Focus on closing training gaps and improving your engagement score. The AI coach will recommend personalised next steps as your performance improves.</>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-emerald-500" /> Promotion path</h3>
          <div className="space-y-2.5 text-sm">
            <Stage label={me.designation} status="current" />
            <Stage label={`Senior ${me.designation}`} status={me.promotionEligible ? "ready" : "future"} />
            <Stage label={`${me.designation} Lead`} status="future" />
            <Stage label={`Engineering Manager`} status="future" />
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Target size={14} className="text-blue-500" /> Goals for next quarter</h3>
          <div className="space-y-2.5 text-sm">
            <Goal label="Complete React advanced course" />
            <Goal label="Lead one cross-team project" />
            <Goal label="Mentor a junior team member" />
            <Goal label="Improve performance score to 90%+" />
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Award size={14} className="text-amber-500" /> Recognition signals</h3>
          <div className="space-y-2.5 text-sm">
            <Signal text="Top performance contributor this quarter" color="emerald" />
            <Signal text="100% project milestone achievement" color="blue" />
            <Signal text="Consistently exceeds attendance targets" color="violet" />
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Briefcase size={14} className="text-cyan-500" /> Suggested next roles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[`Senior ${me.designation}`, `${me.department} Lead`, "Cross-functional Program Manager"].map((r) => (
            <div key={r} className="p-3 rounded-xl bg-[color:var(--bg-soft)] hover:bg-cyan-500/5 transition">
              <div className="text-sm font-semibold">{r}</div>
              <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">Match score: {Math.round(60 + Math.random() * 30)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stage({ label, status }: { label: string; status: "current" | "ready" | "future" }) {
  const map = { current: "bg-blue-500/10 text-blue-500 border-blue-500/30", ready: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30", future: "bg-[color:var(--bg-soft)] text-[color:var(--text-muted)] border-[color:var(--border)]" } as const;
  return (
    <div className={`p-2.5 rounded-lg border ${map[status]}`}>
      <div className="text-xs font-medium">{label}</div>
      <div className="text-[10px] opacity-80 mt-0.5">{status === "current" ? "You are here" : status === "ready" ? "Ready to discuss" : "Future path"}</div>
    </div>
  );
}

function Goal({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-[color:var(--bg-soft)]">
      <div className="w-4 h-4 rounded border-2 border-blue-500/40" />
      <span className="text-xs">{label}</span>
    </div>
  );
}

function Signal({ text, color }: { text: string; color: "emerald" | "blue" | "violet" }) {
  const map = { emerald: "bg-emerald-500/5 border-emerald-500/20 text-emerald-500", blue: "bg-blue-500/5 border-blue-500/20 text-blue-500", violet: "bg-violet-500/5 border-violet-500/20 text-violet-500" } as const;
  return (
    <div className={`p-2.5 rounded-lg border ${map[color]} text-xs font-medium`}>
      {text}
    </div>
  );
}
