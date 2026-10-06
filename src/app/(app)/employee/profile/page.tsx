"use client";

import { useMyEmployee } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { Avatar } from "@/components/Avatar";
import { Sparkles, Mail, MapPin, Briefcase, Calendar, Building2, Award, BookOpen } from "lucide-react";

export default function EmployeeProfilePage() {
  const me = useMyEmployee();
  if (!me) return <div className="section-card">No profile linked.</div>;
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="My Profile" description="Your personal and employment information." icon={<Briefcase size={16} />} />

      <div className="section-card">
        <div className="flex items-start gap-4">
          <Avatar name={me.name} size={80} />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold">{me.name}</h2>
            <p className="text-sm text-[color:var(--text-muted)]">{me.designation} · {me.department}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="tag"><Mail size={11} /> {me.email}</span>
              <span className="tag"><MapPin size={11} /> {me.location}</span>
              <span className="tag"><Briefcase size={11} /> {me.yearsOfExperience}y exp</span>
              <span className="tag"><Calendar size={11} /> Joined {new Date(me.joiningDate).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}</span>
            </div>
          </div>
          <span className="badge badge-success">{me.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="section-card">
          <h3 className="font-semibold mb-3">Personal</h3>
          <dl className="text-sm space-y-2">
            <Row k="Gender" v={me.gender ?? "—"} />
            <Row k="Age" v={me.age ?? "—"} />
            <Row k="Employee ID" v={me.employeeId} />
            <Row k="Manager" v={me.manager ?? "—"} />
          </dl>
        </div>
        <div className="section-card">
          <h3 className="font-semibold mb-3">Employment</h3>
          <dl className="text-sm space-y-2">
            <Row k="Department" v={me.department} />
            <Row k="Designation" v={me.designation} />
            <Row k="Shift" v={me.shift} />
            <Row k="Project" v={me.project} />
            <Row k="CTC" v={`₹${me.salary.toLocaleString()}`} />
          </dl>
        </div>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Award size={14} className="text-amber-500" /> Performance scorecard</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Score label="Performance" value={me.performanceScore} suffix="%" />
          <Score label="Attendance" value={me.attendancePct} suffix="%" />
          <Score label="Engagement" value={me.engagement} suffix="%" />
          <Score label="Productivity" value={me.workHours * 10} suffix="%" />
        </div>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><BookOpen size={14} className="text-blue-500" /> Skills</h3>
        <div className="flex flex-wrap gap-1.5">
          {me.skills.map((s) => <span key={s} className="tag">{s}</span>)}
        </div>
        <div className="mt-3 text-xs text-[color:var(--text-muted)]">Training progress: {me.trainingCompleted} of {me.trainingRequired} completed.</div>
        <div className="progress-bar mt-1.5"><div className="progress-fill" style={{ width: `${(me.trainingCompleted / Math.max(1, me.trainingRequired)) * 100}%` }} /></div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (<div className="flex items-center justify-between"><dt className="text-[color:var(--text-muted)]">{k}</dt><dd className="font-medium text-right">{v}</dd></div>);
}
function Score({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="p-3 rounded-xl bg-[color:var(--bg-soft)]">
      <div className="text-xs text-[color:var(--text-muted)] uppercase font-medium">{label}</div>
      <div className="text-xl font-bold mt-1">{value.toFixed(0)}{suffix}</div>
      <div className="progress-bar mt-1.5"><div className="progress-fill" style={{ width: `${Math.min(100, value)}%` }} /></div>
    </div>
  );
}
