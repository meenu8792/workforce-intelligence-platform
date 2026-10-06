"use client";

import { useMyEmployee } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { Layers, Sun, Moon, Sunset, Sparkles } from "lucide-react";

export default function MyShiftsPage() {
  const me = useMyEmployee();
  if (!me) return null;

  const today = new Date();
  const year = today.getFullYear(); const month = today.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const first = new Date(year, month, 1);
  const startDay = first.getDay();

  const shift = me.shift;
  const ShiftIcon = shift === "Morning" ? Sun : shift === "Evening" ? Sunset : shift === "Night" ? Moon : Layers;

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="My Shifts" description="Your assigned shift and the upcoming calendar." icon={<Layers size={16} />} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="section-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-500/15 text-blue-500">
              <ShiftIcon size={20} />
            </div>
            <div>
              <div className="text-xs text-[color:var(--text-muted)]">Current Shift</div>
              <div className="text-xl font-bold">{shift}</div>
            </div>
          </div>
          <div className="text-xs text-[color:var(--text-muted)]">
            {shift === "Morning" && "09:00 - 18:00"}
            {shift === "Evening" && "14:00 - 23:00"}
            {shift === "Night" && "22:00 - 07:00"}
            {shift === "Rotational" && "Rotates weekly"}
          </div>
        </div>

        <div className="section-card md:col-span-2">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Sparkles size={14} className="text-violet-500" /> AI Shift Recommendation</h3>
          <p className="text-sm text-[color:var(--text-muted)]">Based on your attendance, workload and team requirements, we recommend maintaining your current <b>{shift}</b> shift. You have strong attendance and engagement, and your team is well-balanced.</p>
        </div>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-3">Shift calendar — {today.toLocaleDateString("en", { month: "long", year: "numeric" })}</h3>
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="text-[10px] text-[color:var(--text-muted)] uppercase py-1">{d}</div>)}
          {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: days }).map((_, i) => {
            const day = i + 1;
            const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = iso === today.toISOString().split("T")[0];
            return (
              <div key={iso} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium ${isToday ? "ring-2 ring-blue-500 bg-blue-500/10" : "bg-[color:var(--bg-soft)]"}`}>
                <div>{day}</div>
                <div className="text-[9px] mt-0.5 text-blue-500">{shift.slice(0, 3)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
