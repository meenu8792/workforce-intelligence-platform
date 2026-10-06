"use client";

import { useMyEmployee } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { BookOpen, Sparkles } from "lucide-react";

export default function MySkillsPage() {
  const me = useMyEmployee();
  if (!me) return null;
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="My Skills" description="Your current skill set, competency levels, and required skill gaps." icon={<BookOpen size={16} />} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="kpi-card"><div className="text-xs text-[color:var(--text-muted)] uppercase">Total skills</div><div className="text-2xl font-bold">{me.skills.length}</div></div>
        <div className="kpi-card"><div className="text-xs text-[color:var(--text-muted)] uppercase">Intermediate+</div><div className="text-2xl font-bold">{Math.max(1, me.skills.length - 1)}</div></div>
        <div className="kpi-card"><div className="text-xs text-[color:var(--text-muted)] uppercase">Skill gap</div><div className="text-2xl font-bold text-amber-500">2</div></div>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-3">Current skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {me.skills.map((s, i) => {
            const levels = ["Beginner", "Intermediate", "Advanced"];
            const level = levels[i % 3];
            const pct = (i % 3) * 30 + 40;
            return (
              <div key={s} className="p-3 rounded-lg bg-[color:var(--bg-soft)]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{s}</span>
                  <span className={`badge ${level === "Advanced" ? "badge-success" : level === "Intermediate" ? "badge-info" : "badge-warning"}`}>{level}</span>
                </div>
                <div className="progress-bar h-1.5"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Sparkles size={14} className="text-violet-500" /> Skill gap & training recommendations</h3>
        <div className="space-y-2">
          {[
            { skill: "Advanced React", current: "Intermediate", required: "Advanced", rec: "Frontend Engineering Path" },
            { skill: "Cloud (AWS)", current: "Beginner", required: "Intermediate", rec: "AWS Solutions Architect training" },
            { skill: "Data Analysis", current: "—", required: "Intermediate", rec: "Data Foundations course" },
          ].map((g) => (
            <div key={g.skill} className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center gap-3">
              <div className="flex-1">
                <div className="text-sm font-semibold">{g.skill}</div>
                <div className="text-xs text-[color:var(--text-muted)]">Current: {g.current} · Required: {g.required}</div>
              </div>
              <span className="badge badge-warning">{g.rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
