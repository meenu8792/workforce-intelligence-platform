"use client";

import { useMyEmployee } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { BookOpen, Sparkles, GraduationCap, Clock, CheckCircle2 } from "lucide-react";

export default function MyLearningPage() {
  const me = useMyEmployee();
  if (!me) return null;
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="My Learning" description="AI-recommended training programs and learning progress." icon={<BookOpen size={16} />} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="kpi-card"><div className="text-xs text-[color:var(--text-muted)] uppercase">Completed</div><div className="text-2xl font-bold text-emerald-500">{me.trainingCompleted}</div></div>
        <div className="kpi-card"><div className="text-xs text-[color:var(--text-muted)] uppercase">Required</div><div className="text-2xl font-bold">{me.trainingRequired}</div></div>
        <div className="kpi-card"><div className="text-xs text-[color:var(--text-muted)] uppercase">Progress</div><div className="text-2xl font-bold text-blue-500">{((me.trainingCompleted / Math.max(1, me.trainingRequired)) * 100).toFixed(0)}%</div></div>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-3">Active learning</h3>
        <div className="space-y-2">
          {[
            { name: "Advanced React Patterns", progress: 65, eta: "5 days left" },
            { name: "Cloud Architecture Fundamentals", progress: 30, eta: "14 days left" },
            { name: "Effective Communication", progress: 85, eta: "2 days left" },
          ].map((c) => (
            <div key={c.name} className="p-3 rounded-xl bg-[color:var(--bg-soft)]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold">{c.name}</span>
                <span className="text-xs text-[color:var(--text-muted)] flex items-center gap-1"><Clock size={11} /> {c.eta}</span>
              </div>
              <div className="progress-bar h-1.5"><div className="progress-fill" style={{ width: `${c.progress}%` }} /></div>
              <div className="text-[10px] text-[color:var(--text-muted)] mt-1">{c.progress}% complete</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Sparkles size={14} className="text-violet-500" /> AI Recommended Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: "System Design Interview", reason: "For your role in " + me.department },
            { name: "Leadership Foundations", reason: "Based on your performance trajectory" },
            { name: "Data-Driven Decision Making", reason: "Most in-demand skill in your department" },
            { name: "Public Speaking & Storytelling", reason: "Aligns with your engagement growth" },
          ].map((c) => (
            <div key={c.name} className="p-3 rounded-xl bg-[color:var(--bg-soft)] hover:bg-violet-500/5 transition">
              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-md bg-violet-500/10 text-violet-500"><GraduationCap size={14} /></div>
                <div>
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{c.reason}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
