// Shift rules used by the attendance check-in engine.
// A single source of truth so the store and the UI agree on timings.

export interface ShiftWindow {
  name: string;
  start: string;            // HH:MM — scheduled shift start
  end: string;              // HH:MM — scheduled shift end
  graceMinutes: number;     // how long after start you are still "on time"
  openMinutesBefore: number;// how early the check-in window opens
  crossesMidnight: boolean; // night shift ends the next calendar day
}

export const SHIFT_WINDOWS: Record<string, ShiftWindow> = {
  Morning: { name: "Morning", start: "09:00", end: "18:00", graceMinutes: 15, openMinutesBefore: 120, crossesMidnight: false },
  Evening: { name: "Evening", start: "14:00", end: "23:00", graceMinutes: 15, openMinutesBefore: 120, crossesMidnight: false },
  Night:   { name: "Night",   start: "22:00", end: "07:00", graceMinutes: 15, openMinutesBefore: 120, crossesMidnight: true },
};

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function toHHMM(total: number): string {
  const t = ((total % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

/**
 * Resolve which shift window applies right now.
 * - A "Rotational" employee uses today's rostered shift.
 * - "Off" (or an unknown value) returns null — no check-in allowed.
 */
export function resolveShiftWindow(employeeShift?: string, rosteredShift?: string): ShiftWindow | null {
  const candidate =
    employeeShift === "Rotational"
      ? (rosteredShift && rosteredShift !== "Off" ? rosteredShift : "Morning")
      : (employeeShift ?? "Morning");
  if (!candidate || candidate === "Off") return null;
  return SHIFT_WINDOWS[candidate] ?? SHIFT_WINDOWS.Morning;
}

export type CheckInState = "early" | "ontime" | "late" | "closed";

export interface CheckInEvaluation {
  state: CheckInState;
  minutesLate: number;   // 0 when on time / early
  opensAt: string;       // HH:MM the window opens
  startsAt: string;      // HH:MM scheduled start
  graceUntil: string;    // HH:MM last on-time minute
  endsAt: string;        // HH:MM scheduled end
}

/**
 * Compare "now" against the shift window.
 * Night shifts that run past midnight are normalised onto a 0–2880 scale.
 */
export function evaluateCheckIn(win: ShiftWindow, nowMinutes: number): CheckInEvaluation {
  const startM = toMinutes(win.start);
  const rawEnd = toMinutes(win.end);
  const endM = rawEnd + (win.crossesMidnight ? 1440 : 0);

  // If it's after midnight during a night shift, shift "now" into the same cycle.
  let n = nowMinutes;
  if (win.crossesMidnight && nowMinutes < rawEnd) n = nowMinutes + 1440;

  const openFrom = startM - win.openMinutesBefore;
  const graceEnd = startM + win.graceMinutes;

  const base = {
    opensAt: toHHMM(openFrom),
    startsAt: win.start,
    graceUntil: toHHMM(graceEnd),
    endsAt: win.end,
  };

  if (n < openFrom) return { state: "early", minutesLate: 0, ...base };
  if (n <= graceEnd) return { state: "ontime", minutesLate: 0, ...base };
  if (n <= endM) return { state: "late", minutesLate: n - startM, ...base };
  return { state: "closed", minutesLate: n - startM, ...base };
}

/** Minutes of overtime (or negative for an early checkout) against the shift end. */
export function overtimeMinutes(win: ShiftWindow, checkOutMinutes: number): number {
  const rawEnd = toMinutes(win.end);
  const endM = rawEnd + (win.crossesMidnight ? 1440 : 0);
  let n = checkOutMinutes;
  if (win.crossesMidnight && checkOutMinutes < rawEnd) n = checkOutMinutes + 1440;
  return n - endM;
}

export function describeLateness(minutes: number): string {
  if (minutes <= 0) return "on time";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min late`;
  return `${h}h ${m}m late`;
}
