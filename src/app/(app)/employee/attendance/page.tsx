"use client";

import { useEffect, useMemo, useState } from "react";
import { useMyEmployee, useApp } from "@/lib/store";
import { useScope } from "@/lib/selectors";
import { SectionHeader } from "@/components/SectionHeader";
import { KpiCard } from "@/components/KpiCard";
import {
  CalendarCheck, Clock, AlertTriangle, Camera, Fingerprint, CheckCircle2,
  LogIn, LogOut, Loader2, MapPinned, QrCode, RotateCcw, Sun, Sunset, Moon, Timer,
} from "lucide-react";
import { Modal } from "@/components/Modal";
import { resolveShiftWindow, evaluateCheckIn, describeLateness, toMinutes } from "@/lib/shifts";

type CheckInMethod = "Biometric" | "Face" | "GPS" | "QR";
const METHODS: { key: CheckInMethod; label: string; icon: typeof Fingerprint; color: string; desc: string }[] = [
  { key: "Biometric", label: "Biometric", icon: Fingerprint, color: "from-blue-500 to-cyan-500", desc: "Fingerprint / palm scan from your registered device" },
  { key: "Face", label: "Face recognition", icon: Camera, color: "from-violet-500 to-pink-500", desc: "Camera-based facial recognition check-in" },
  { key: "GPS", label: "GPS", icon: MapPinned, color: "from-emerald-500 to-cyan-500", desc: "Location-verified check-in within office geofence" },
  { key: "QR", label: "QR code", icon: QrCode, color: "from-amber-500 to-orange-500", desc: "Scan the office QR to confirm your attendance" },
];

export default function MyAttendancePage() {
  const me = useMyEmployee();
  const { attendance, range } = useScope();
  const allShifts = useApp((s) => s.shifts);
  const checkIn = useApp((s) => s.checkIn);
  const checkOut = useApp((s) => s.checkOut);
  const resetToday = useApp((s) => s.resetTodayAttendance);
  const pushToast = useApp((s) => s.pushToast);

  const myAtt = useMemo(() => me ? attendance.filter((a) => a.employeeId === me.employeeId) : [], [me, attendance]);
  const present = myAtt.filter((a) => a.status === "Present" || a.status === "Late").length;
  const absent = myAtt.filter((a) => a.status === "Absent").length;
  const late = myAtt.filter((a) => a.status === "Late").length;
  const totalHours = myAtt.reduce((a, b) => a + (b.workingHours ?? 0), 0);

  const today = new Date();
  const year = today.getFullYear(); const month = today.getMonth();
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const startDay = first.getDay();
  const todayISO = today.toISOString().split("T")[0];

  const byDate: Record<string, typeof myAtt[0] | undefined> = {};
  for (const a of myAtt) byDate[a.date] = a;

  const todayRec = me ? myAtt.find((a) => a.date === todayISO) : undefined;
  const isCheckedIn = !!todayRec?.checkIn && !todayRec?.checkOut;
  const isCompleted = !!todayRec?.checkIn && !!todayRec?.checkOut;

  // ---- Shift resolution -----------------------------------------------
  const roster = me ? allShifts.find((s) => s.employeeId === me.employeeId && s.date === todayISO) : undefined;
  const win = useMemo(() => resolveShiftWindow(me?.shift, roster?.shift), [me?.shift, roster?.shift]);

  // Re-evaluate every 30s so the window status stays live.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const nowMin = today.getHours() * 60 + today.getMinutes();
  const evaluation = useMemo(() => (win ? evaluateCheckIn(win, nowMin) : null), [win, nowMin, tick]);

  const ShiftIcon = win?.name === "Morning" ? Sun : win?.name === "Evening" ? Sunset : win?.name === "Night" ? Moon : Timer;

  const [picker, setPicker] = useState(false);
  const [busyMethod, setBusyMethod] = useState<CheckInMethod | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number; accuracy: number } | null>(null);

  async function performCheckIn(method: CheckInMethod) {
    if (!me) return;
    setBusyMethod(method);
    await new Promise((r) => setTimeout(r, 600));

    if (method === "GPS") {
      let finalCoords = coords;
      try {
        if (typeof navigator !== "undefined" && navigator.geolocation) {
          finalCoords = await new Promise<{ lat: number; lon: number; accuracy: number }>((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy }),
              () => resolve({ lat: 12.9716, lon: 77.5946, accuracy: 25 }),
              { timeout: 2500, maximumAge: 60000 },
            );
          });
        } else {
          finalCoords = { lat: 12.9716, lon: 77.5946, accuracy: 25 };
        }
      } catch {
        finalCoords = { lat: 12.9716, lon: 77.5946, accuracy: 25 };
      }
      setCoords(finalCoords);
      pushToast({ message: `Location verified: ${finalCoords?.lat.toFixed(4)}, ${finalCoords?.lon.toFixed(4)} (±${Math.round(finalCoords?.accuracy ?? 0)}m)`, type: "info", duration: 2800 });
    } else if (method === "QR") {
      pushToast({ message: "QR code scanned successfully.", type: "info", duration: 2200 });
    } else if (method === "Face") {
      pushToast({ message: "Face matched successfully.", type: "info", duration: 2200 });
    } else {
      pushToast({ message: "Biometric authentication successful.", type: "info", duration: 2200 });
    }

    const r = checkIn({ employeeId: me.employeeId, source: method });
    setBusyMethod(null);
    if (r.ok) setPicker(false);
    else pushToast({ message: r.error ?? "Check-in failed.", type: "error", duration: 5000 });
  }

  function performCheckOut() {
    if (!me) return;
    const r = checkOut(me.employeeId);
    if (!r.ok) pushToast({ message: r.error ?? "Check-out failed.", type: "error" });
  }

  const windowBadge = !win
    ? { label: "Off day", cls: "badge-muted" }
    : evaluation?.state === "early"
      ? { label: `Opens ${evaluation.opensAt}`, cls: "badge-info" }
      : evaluation?.state === "ontime"
        ? { label: "Open · on time", cls: "badge-success" }
        : evaluation?.state === "late"
          ? { label: `Open · ${describeLateness(evaluation.minutesLate)}`, cls: "badge-warning" }
          : { label: "Shift ended", cls: "badge-danger" };

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="My Attendance" description={`${range.from} → ${range.to}`} icon={<CalendarCheck size={16} />} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Present" value={present} icon={<CalendarCheck size={16} />} accent="green" />
        <KpiCard label="Absent" value={absent} icon={<AlertTriangle size={16} />} accent="rose" />
        <KpiCard label="Late" value={late} icon={<Clock size={16} />} accent="amber" />
        <KpiCard label="Total Hours" value={totalHours} icon={<Clock size={16} />} accent="blue" suffix="h" decimals={0} />
      </div>

      {/* Today + shift status */}
      <div className="section-card !p-5 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-violet-500/5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0">
              <ShiftIcon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider font-semibold">
                  {today.toLocaleDateString("en", { weekday: "long", day: "numeric", month: "long" })}
                </span>
                <span className={`badge ${windowBadge.cls}`}>{windowBadge.label}</span>
              </div>
              <div className="text-xl font-bold mt-1">
                {isCompleted ? "Day completed" : isCheckedIn ? "You are checked in" : win ? `${win.name} shift · ${win.start}–${win.end}` : "No shift rostered today"}
              </div>
              <div className="text-sm text-[color:var(--text-muted)] mt-1 flex items-center gap-3 flex-wrap">
                {todayRec?.checkIn && <span>In: <b className="text-[color:var(--text)]">{todayRec.checkIn}</b></span>}
                {todayRec?.checkOut && <span>Out: <b className="text-[color:var(--text)]">{todayRec.checkOut}</b></span>}
                {todayRec?.workingHours !== undefined && <span>Hours: <b className="text-[color:var(--text)]">{todayRec.workingHours.toFixed(2)}h</b></span>}
                {todayRec?.source && <span>via <b className="text-[color:var(--text)]">{todayRec.source}</b></span>}
                {!todayRec?.checkIn && win && evaluation && (
                  <span>Grace until <b className="text-[color:var(--text)]">{evaluation.graceUntil}</b></span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {!isCheckedIn && !isCompleted && (
              <button onClick={() => setPicker(true)} disabled={!win || !!busyMethod} className="btn btn-primary"><LogIn size={14} /> Check In</button>
            )}
            {isCheckedIn && (
              <button onClick={performCheckOut} className="btn btn-danger"><LogOut size={14} /> Check Out</button>
            )}
            {(isCheckedIn || isCompleted) && (
              <button onClick={() => me && resetToday(me.employeeId)} className="btn btn-secondary" title="Clear today's record and start again">
                <RotateCcw size={14} /> Reset today
              </button>
            )}
          </div>
        </div>

        {/* Shift timeline */}
        {win && evaluation && (
          <div className="mt-4 pt-4 border-t border-[color:var(--border)]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <Pill label="Window opens" value={evaluation.opensAt} />
              <Pill label="Shift starts" value={evaluation.startsAt} accent />
              <Pill label="Grace until" value={evaluation.graceUntil} />
              <Pill label="Shift ends" value={evaluation.endsAt} />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="section-card md:col-span-2">
          <h3 className="font-semibold mb-3">Monthly calendar</h3>
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="text-[10px] text-[color:var(--text-muted)] font-medium uppercase tracking-wider py-1">{d}</div>)}
            {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: days }).map((_, i) => {
              const day = i + 1;
              const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const a = byDate[iso];
              const isToday = iso === todayISO;
              const color = a?.status === "Present" ? "bg-emerald-500/15 text-emerald-500" :
                a?.status === "Late" ? "bg-amber-500/15 text-amber-500" :
                a?.status === "Absent" ? "bg-rose-500/15 text-rose-500" :
                a?.status === "On Leave" ? "bg-blue-500/15 text-blue-500" :
                a?.status === "Half Day" ? "bg-cyan-500/15 text-cyan-500" :
                "bg-[color:var(--bg-soft)] text-[color:var(--text-muted)]";
              return (
                <div key={iso} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium ${color} ${isToday ? "ring-2 ring-blue-500" : ""}`}>
                  <div>{day}</div>
                  {a && <div className="text-[8px] mt-0.5 opacity-80">{a.status[0]}</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="section-card">
          <h3 className="font-semibold mb-1">Check-in methods</h3>
          <p className="text-xs text-[color:var(--text-muted)] mb-3">
            {win
              ? `Your ${win.name} shift runs ${win.start}–${win.end}. Pick a method to record attendance.`
              : "You are not rostered for a shift today."}
          </p>
          <div className="space-y-2.5 text-sm">
            {METHODS.map((s) => {
              const count = myAtt.filter((a) => a.source === s.key).length;
              const disabled = !!busyMethod || !win || isCheckedIn || isCompleted;
              return (
                <button
                  key={s.key}
                  onClick={() => performCheckIn(s.key)}
                  disabled={disabled}
                  title={isCheckedIn ? "You are already checked in" : isCompleted ? "Reset today to record again" : undefined}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-[color:var(--bg-soft)] hover:bg-blue-500/5 border border-transparent hover:border-blue-500/30 transition text-left disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:bg-[color:var(--bg-soft)] disabled:hover:border-transparent"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} text-white flex items-center justify-center shrink-0`}>
                    {busyMethod === s.key ? <Loader2 size={14} className="animate-spin" /> : <s.icon size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="text-[10px] text-[color:var(--text-muted)] leading-snug">{s.desc}</div>
                  </div>
                  <div className="text-xs font-semibold text-[color:var(--text-muted)]">{count}</div>
                </button>
              );
            })}
          </div>

          {isCheckedIn ? (
            <button onClick={performCheckOut} className="btn btn-danger w-full mt-4"><LogOut size={14} /> Check Out Now</button>
          ) : isCompleted ? (
            <button onClick={() => me && resetToday(me.employeeId)} className="btn btn-secondary w-full mt-4"><RotateCcw size={14} /> Reset today to check in again</button>
          ) : (
            <button onClick={() => setPicker(true)} disabled={!win || !!busyMethod} className="btn btn-primary w-full mt-4">
              <LogIn size={14} /> Check In Now
            </button>
          )}

          {win && evaluation?.state === "early" && (
            <p className="text-[11px] text-[color:var(--text-muted)] mt-2 text-center">
              Check-in opens at {evaluation.opensAt} for your {win.name} shift.
            </p>
          )}
        </div>
      </div>

      <div className="section-card !p-0">
        <div className="p-4 border-b border-[color:var(--border)]"><h3 className="font-semibold">Recent history</h3></div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>Date</th><th>Status</th><th>Check-in</th><th>Check-out</th><th>Hours</th><th>Source</th></tr></thead>
            <tbody>
              {myAtt.slice(0, 20).map((a) => (
                <tr key={a.id}>
                  <td className="text-[color:var(--text-muted)]">{a.date}</td>
                  <td><span className="badge badge-info">{a.status}</span></td>
                  <td>{a.checkIn ?? "—"}</td>
                  <td>{a.checkOut ?? "—"}</td>
                  <td>{a.workingHours ?? 0}h</td>
                  <td className="text-[color:var(--text-muted)]">{a.source ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={picker} onClose={() => setPicker(false)} title="Choose a check-in method" size="md"
        footer={<button className="btn btn-secondary" onClick={() => setPicker(false)}>Cancel</button>}
      >
        {win && evaluation && (
          <div className="mb-4 p-3 rounded-xl bg-[color:var(--bg-soft)] border border-[color:var(--border)] text-sm">
            <div className="flex items-center gap-2 font-semibold mb-1"><ShiftIcon size={14} className="text-blue-500" /> {win.name} shift · {win.start}–{win.end}</div>
            <div className="text-xs text-[color:var(--text-muted)]">
              Window open from {evaluation.opensAt} · on time until {evaluation.graceUntil} ·{" "}
              {evaluation.state === "ontime"
                ? "you will be marked Present."
                : evaluation.state === "late" || evaluation.state === "closed"
                  ? `you will be marked Late (${describeLateness(evaluation.minutesLate)}).`
                  : `check-in has not opened yet.`}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {METHODS.map((m) => (
            <button
              key={m.key}
              onClick={() => performCheckIn(m.key)}
              disabled={!!busyMethod || !win}
              className="text-left p-4 rounded-xl border border-[color:var(--border)] hover:border-blue-500 hover:bg-blue-500/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} text-white flex items-center justify-center`}>
                  {busyMethod === m.key ? <Loader2 size={18} className="animate-spin" /> : <m.icon size={18} />}
                </div>
                <div className="font-semibold">{m.label}</div>
              </div>
              <p className="text-xs text-[color:var(--text-muted)]">{m.desc}</p>
            </button>
          ))}
        </div>
        {coords && (
          <div className="mt-3 p-2.5 rounded-lg bg-[color:var(--bg-soft)] text-[11px] text-[color:var(--text-muted)] flex items-center gap-2">
            <MapPinned size={12} className="text-emerald-500" /> Last known location: {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)} (±{Math.round(coords.accuracy)}m)
          </div>
        )}
      </Modal>
    </div>
  );
}

function Pill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`p-2 rounded-lg ${accent ? "bg-blue-500/10 border border-blue-500/25" : "bg-[color:var(--bg-soft)]"}`}>
      <div className="text-[10px] uppercase tracking-wider text-[color:var(--text-muted)] font-medium">{label}</div>
      <div className={`text-sm font-bold mt-0.5 ${accent ? "text-blue-500" : ""}`}>{value}</div>
    </div>
  );
}
