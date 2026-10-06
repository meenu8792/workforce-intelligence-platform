"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  User, Employee, AttendanceRecord, LeaveRequest, ShiftRecord, TimesheetEntry,
  SalaryRecord, Issue, NotificationItem, AuditEntry, Role, DatasetMeta, DateRange,
} from "./types";
import {
  buildDemoEmployees, buildAttendance, buildLeaves, buildShifts,
  buildTimesheets, buildSalaries, buildIssues, buildNotifications, buildAudit,
} from "./seed";
import { todayISO, isoDaysAgo, randomId } from "./utils";
import { resolveShiftWindow, evaluateCheckIn, overtimeMinutes, describeLateness, toMinutes } from "./shifts";

interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface AppState {
  // auth
  users: User[];
  currentUserId: string | null;
  isAuthenticated: boolean;
  hasOnboarded: boolean; // visited the title page

  // data
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  shifts: ShiftRecord[];
  timesheets: TimesheetEntry[];
  salaries: SalaryRecord[];
  issues: Issue[];
  notifications: NotificationItem[];
  audit: AuditEntry[];

  // ui
  dateRange: DateRange;
  theme: "light" | "dark";
  datasetMeta: DatasetMeta | null;
  toasts: ToastItem[];

  // auth actions
  register: (input: { username: string; email: string; password: string; confirmPassword: string }) => { ok: boolean; error?: string };
  login: (input: { identifier: string; password: string; role: Role }) => { ok: boolean; error?: string; user?: User };
  logout: () => void;
  setOnboarded: (v: boolean) => void;

  // ui actions
  setDateRange: (r: DateRange) => void;
  setTheme: (t: "light" | "dark") => void;
  pushToast: (t: Omit<ToastItem, "id">) => void;
  dismissToast: (id: string) => void;

  // data actions
  importDataset: (rows: Record<string, unknown>[], meta: Omit<DatasetMeta, "uploadedOn" | "uploadedBy" | "validRecords" | "duplicates" | "missing">) => void;
  resetDataset: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  approveLeave: (id: string, by: string) => void;
  rejectLeave: (id: string, by: string) => void;
  applyLeave: (input: Omit<LeaveRequest, "id" | "status" | "appliedOn">) => void;
  updateProfile: (patch: Partial<User>) => void;
  changePassword: (oldP: string, newP: string) => { ok: boolean; error?: string };
  addIssue: (input: Omit<Issue, "id" | "status" | "createdOn" | "priority"> & { priority?: Issue["priority"] }) => void;
  resolveIssue: (id: string) => void;
  acknowledgeSalary: (id: string) => void;
  approveTimesheet: (id: string, by: string) => void;
  rejectTimesheet: (id: string, by: string) => void;
  submitTimesheet: (input: Omit<TimesheetEntry, "id" | "status">) => void;
  addEmployee: (e: Omit<Employee, "id" | "source">) => void;
  removeEmployee: (id: string) => void;
  checkIn: (input: { employeeId: string; source: "Biometric" | "Face" | "GPS" | "QR" | "Manual" }) => {
    ok: boolean; error?: string; recordId?: string;
    status?: "Present" | "Late"; shiftName?: string; minutesLate?: number;
    startsAt?: string; endsAt?: string;
  };
  checkOut: (employeeId: string) => { ok: boolean; error?: string; overtime?: number; hours?: number };
  resetTodayAttendance: (employeeId: string) => void;
}

function buildInitialDataset() {
  const employees = buildDemoEmployees(120);
  const attendance = buildAttendance(employees, 60);
  const leaves = buildLeaves(employees);
  const shifts = buildShifts(employees, 30);
  const timesheets = buildTimesheets(employees);
  const salaries = buildSalaries(employees);
  const issues = buildIssues(employees);
  const notifications = buildNotifications();
  const audit = buildAudit();
  return { employees, attendance, leaves, shifts, timesheets, salaries, issues, notifications, audit };
}

const init = buildInitialDataset();

const defaultMeta: DatasetMeta = {
  fileName: "demo_workforce_dataset",
  uploadedOn: new Date().toISOString(),
  uploadedBy: "system",
  records: init.employees.length,
  validRecords: init.employees.length,
  duplicates: 0,
  missing: 0,
  columns: [
    "employeeId","name","email","gender","age","department","designation","joiningDate",
    "yearsOfExperience","location","manager","salary","performanceScore","attendancePct",
    "skills","trainingCompleted","trainingRequired","engagement","shift","project",
    "attritionRisk","workHours","overtime","leaveBalance","status","promotionEligible",
  ],
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: randomId("u"),
          username: "admin",
          email: "admin@nexora.com",
          password: "Admin@123",
          role: "admin",
          createdAt: new Date().toISOString(),
        },
        {
          id: randomId("u"),
          username: "hr_lead",
          email: "hr@nexora.com",
          password: "Hr@12345",
          role: "hr",
          createdAt: new Date().toISOString(),
        },
        {
          id: randomId("u"),
          username: "manager",
          email: "manager@nexora.com",
          password: "Manager@123",
          role: "manager",
          employeeId: "EMP-1000",
          createdAt: new Date().toISOString(),
        },
        {
          id: randomId("u"),
          username: "employee",
          email: "employee@nexora.com",
          password: "Employee@123",
          role: "employee",
          employeeId: "EMP-1001",
          createdAt: new Date().toISOString(),
        },
      ],
      currentUserId: null,
      isAuthenticated: false,
      hasOnboarded: false,

      employees: init.employees,
      attendance: init.attendance,
      leaves: init.leaves,
      shifts: init.shifts,
      timesheets: init.timesheets,
      salaries: init.salaries,
      issues: init.issues,
      notifications: init.notifications,
      audit: init.audit,

      dateRange: { from: isoDaysAgo(29), to: todayISO() },
      theme: "light",
      datasetMeta: defaultMeta,
      toasts: [],

      register: (input) => {
        const { username, email, password, confirmPassword } = input;
        if (!username.trim() || !email.trim() || !password || !confirmPassword) {
          return { ok: false, error: "Please fill in all fields." };
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return { ok: false, error: "Please enter a valid email address." };
        }
        if (password !== confirmPassword) {
          return { ok: false, error: "Passwords do not match." };
        }
        const strength = passwordStrength(password);
        if (strength.score < 3) {
          return { ok: false, error: "Password is too weak. Please meet all the requirements." };
        }
        const exists = get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) return { ok: false, error: "This email is already registered. Please log in." };
        const unameExists = get().users.find((u) => u.username.toLowerCase() === username.toLowerCase());
        if (unameExists) return { ok: false, error: "This username is already taken." };
        const u: User = {
          id: randomId("u"),
          username: username.trim(),
          email: email.trim(),
          password,
          role: "employee",
          employeeId: get().employees[Math.floor(Math.random() * get().employees.length)]?.employeeId,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ users: [...s.users, u] }));
        return { ok: true };
      },

      login: (input) => {
        const { identifier, password, role } = input;
        if (!identifier.trim() || !password) return { ok: false, error: "Please enter your credentials." };
        const user = get().users.find(
          (u) => (u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase()) && u.password === password,
        );
        if (!user) return { ok: false, error: "Invalid username/email or password." };
        if (user.role !== role) {
          return { ok: false, error: "You do not have permission to access this dashboard." };
        }
        set({ currentUserId: user.id, isAuthenticated: true });
        set((s) => ({
          audit: [{ id: randomId("a"), actor: user.username, role: user.role, action: "Logged in", timestamp: new Date().toISOString() }, ...s.audit],
        }));
        return { ok: true, user };
      },

      logout: () => {
        const u = get().users.find((x) => x.id === get().currentUserId);
        if (u) {
          set((s) => ({
            audit: [{ id: randomId("a"), actor: u.username, role: u.role, action: "Logged out", timestamp: new Date().toISOString() }, ...s.audit],
          }));
        }
        set({ currentUserId: null, isAuthenticated: false });
      },

      setOnboarded: (v) => set({ hasOnboarded: v }),

      setDateRange: (r) => {
        if (r.from && r.to && r.from > r.to) {
          get().pushToast({ message: "From date cannot be after To date.", type: "error" });
          return;
        }
        set({ dateRange: r });
      },
      setTheme: (t) => {
        set({ theme: t });
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", t);
        }
      },
      pushToast: (t) => {
        const id = randomId("t");
        const item: ToastItem = { id, ...t };
        set((s) => ({ toasts: [...s.toasts, item] }));
        if (typeof window !== "undefined") {
          const dur = t.duration ?? 3500;
          window.setTimeout(() => {
            set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
          }, dur);
        }
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),

      importDataset: (rows, meta) => {
        // Map flexible columns
        const lower = (k: string) => k.toLowerCase().trim().replace(/\s+/g, "_");
        const mapKey = (k: string) => lower(k);

        const mapped: Employee[] = [];
        let valid = 0;
        let missing = 0;
        const seenIds = new Set<string>();

        for (const row of rows) {
          const r: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(row)) r[mapKey(k)] = v;
          const empId = String(r.employee_id ?? r.employeeid ?? r.emp_id ?? r.empid ?? r.id ?? `EMP-${1000 + mapped.length}`).trim();
          if (!empId) { missing++; continue; }
          if (seenIds.has(empId)) continue;
          seenIds.add(empId);

          const name = String(r.name ?? r.employee_name ?? r.full_name ?? "Unknown");
          if (!name || name === "Unknown") missing++;

          const parseNum = (v: unknown) => {
            if (v == null || v === "") return undefined;
            const n = Number(String(v).replace(/[, ]/g, ""));
            return isNaN(n) ? undefined : n;
          };

          const skills = String(r.skills ?? r.skill ?? "")
            .split(/[,;|]/)
            .map((x) => x.trim())
            .filter(Boolean);

          const performanceScore = Math.max(0, Math.min(100, parseNum(r.performance_score ?? r.performance) ?? 70));
          const attendancePct = Math.max(0, Math.min(100, parseNum(r.attendance ?? r.attendance_pct ?? r.attendance_percentage) ?? 85));
          const engagement = Math.max(0, Math.min(100, parseNum(r.engagement ?? r.engagement_score) ?? 70));
          const yearsOfExperience = parseNum(r.years_of_experience ?? r.experience ?? r.experience_years) ?? 0;
          const salary = parseNum(r.salary ?? r.base_salary ?? r.ctc) ?? 600000;
          const age = parseNum(r.age);
          const workHours = parseNum(r.working_hours ?? r.work_hours) ?? 8;
          const overtime = parseNum(r.overtime) ?? 0;
          const trainingCompleted = parseNum(r.training_completed) ?? 0;
          const trainingRequired = parseNum(r.training_required) ?? 4;

          const riskRaw = String(r.attrition_risk ?? r.attrition ?? "").toLowerCase();
          const attritionRisk: Employee["attritionRisk"] = riskRaw.startsWith("h") ? "High" : riskRaw.startsWith("m") ? "Medium" : "Low";

          const statusRaw = String(r.status ?? "").toLowerCase();
          const status: Employee["status"] = statusRaw.includes("leave") ? "On Leave" : statusRaw.includes("inactive") ? "Inactive" : "Active";

          const shiftRaw = String(r.shift ?? "Morning");
          const shift = (["Morning", "Evening", "Night", "Rotational"] as const).includes(shiftRaw as never) ? shiftRaw as Employee["shift"] : "Morning";

          mapped.push({
            id: randomId("emp"),
            employeeId: empId,
            name,
            email: String(r.email ?? `${empId.toLowerCase()}@nexora.com`),
            gender: (r.gender as string) ?? undefined,
            age: age ?? undefined,
            department: String(r.department ?? "Operations"),
            designation: String(r.designation ?? r.role ?? "Employee"),
            role: String(r.role ?? r.designation ?? "Employee"),
            joiningDate: r.joining_date ? new Date(String(r.joining_date)).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            yearsOfExperience,
            location: String(r.location ?? "Bengaluru"),
            manager: r.manager ? String(r.manager) : undefined,
            managerId: r.manager_id ? String(r.manager_id) : undefined,
            salary,
            performanceScore,
            attendancePct,
            skills,
            trainingCompleted,
            trainingRequired,
            engagement,
            shift,
            project: String(r.project ?? "Internal"),
            attritionRisk,
            workHours,
            overtime,
            leaveBalance: parseNum(r.leave_balance) ?? 10,
            status,
            promotionEligible: performanceScore > 80 && attendancePct > 85 && yearsOfExperience > 3,
            source: "uploaded",
          });
          valid++;
        }

        // rebuild attendance, leaves etc. for the new employees
        const attendance = buildAttendance(mapped, 60);
        const leaves = buildLeaves(mapped);
        const shifts = buildShifts(mapped, 30);
        const timesheets = buildTimesheets(mapped);
        const salaries = buildSalaries(mapped);
        const issues = buildIssues(mapped);

        set({
          employees: mapped,
          attendance,
          leaves,
          shifts,
          timesheets,
          salaries,
          issues,
          datasetMeta: {
            fileName: meta.fileName,
            uploadedOn: new Date().toISOString(),
            uploadedBy: "System Admin",
            records: rows.length,
            validRecords: valid,
            duplicates: rows.length - mapped.length,
            missing,
            columns: Object.keys(rows[0] ?? {}),
          },
        });
        set((s) => ({
          audit: [{ id: randomId("a"), actor: "System Admin", role: "admin", action: `Imported dataset ${meta.fileName}`, timestamp: new Date().toISOString(), meta: { rows: rows.length, valid } }, ...s.audit],
          notifications: [
            { id: randomId("n"), title: "Dataset imported", message: `${mapped.length} records loaded from ${meta.fileName}.`, type: "success", timestamp: new Date().toISOString(), read: false, category: "system" },
            ...s.notifications,
          ],
        }));
      },

      resetDataset: () => {
        const fresh = buildInitialDataset();
        set({
          employees: fresh.employees,
          attendance: fresh.attendance,
          leaves: fresh.leaves,
          shifts: fresh.shifts,
          timesheets: fresh.timesheets,
          salaries: fresh.salaries,
          issues: fresh.issues,
          datasetMeta: { ...defaultMeta, uploadedOn: new Date().toISOString(), uploadedBy: "system" },
        });
        get().pushToast({ message: "Dataset reset to demo data.", type: "info" });
      },

      markNotificationRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllNotificationsRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      approveLeave: (id, by) => {
        set((s) => ({
          leaves: s.leaves.map((l) => (l.id === id ? { ...l, status: "Approved", approvedBy: by } : l)),
        }));
        const lv = get().leaves.find((l) => l.id === id);
        if (lv) {
          set((s) => ({
            notifications: [
              { id: randomId("n"), title: "Leave approved", message: `${lv.employeeName}'s leave from ${lv.fromDate} to ${lv.toDate} approved.`, type: "success", timestamp: new Date().toISOString(), read: false, category: "leave" },
              ...s.notifications,
            ],
          }));
        }
      },
      rejectLeave: (id, by) => {
        set((s) => ({
          leaves: s.leaves.map((l) => (l.id === id ? { ...l, status: "Rejected", approvedBy: by } : l)),
        }));
        const lv = get().leaves.find((l) => l.id === id);
        if (lv) {
          set((s) => ({
            notifications: [
              { id: randomId("n"), title: "Leave rejected", message: `${lv.employeeName}'s leave from ${lv.fromDate} to ${lv.toDate} rejected.`, type: "warning", timestamp: new Date().toISOString(), read: false, category: "leave" },
              ...s.notifications,
            ],
          }));
        }
      },
      applyLeave: (input) => {
        const lv: LeaveRequest = {
          ...input,
          id: randomId("lv"),
          status: "Pending",
          appliedOn: todayISO(),
        };
        set((s) => ({ leaves: [lv, ...s.leaves] }));
        get().pushToast({ message: "Leave request submitted for approval.", type: "success" });
      },
      updateProfile: (patch) => {
        const uid = get().currentUserId;
        if (!uid) return;
        set((s) => ({ users: s.users.map((u) => (u.id === uid ? { ...u, ...patch } : u)) }));
        get().pushToast({ message: "Profile updated successfully.", type: "success" });
      },
      changePassword: (oldP, newP) => {
        const uid = get().currentUserId;
        const u = get().users.find((x) => x.id === uid);
        if (!u) return { ok: false, error: "No active session." };
        if (u.password !== oldP) return { ok: false, error: "Current password is incorrect." };
        if (passwordStrength(newP).score < 3) return { ok: false, error: "New password is too weak." };
        set((s) => ({ users: s.users.map((x) => (x.id === uid ? { ...x, password: newP } : x)) }));
        return { ok: true };
      },
      addIssue: (input) => {
        const issue: Issue = {
          ...input,
          id: randomId("iss"),
          status: "Open",
          createdOn: todayISO(),
          priority: input.priority ?? "Medium",
        };
        set((s) => ({ issues: [issue, ...s.issues] }));
        get().pushToast({ message: "Issue submitted to HR. We'll review and respond shortly.", type: "success" });
      },
      resolveIssue: (id) => {
        set((s) => ({
          issues: s.issues.map((i) => (i.id === id ? { ...i, status: "Resolved", resolvedOn: todayISO() } : i)),
        }));
        get().pushToast({ message: "Issue marked as resolved.", type: "success" });
      },
      acknowledgeSalary: (id) => {
        set((s) => ({
          salaries: s.salaries.map((x) => (x.id === id ? { ...x, acknowledged: true } : x)),
        }));
        get().pushToast({ message: "Salary acknowledged. Thank you.", type: "success" });
      },
      approveTimesheet: (id, by) => {
        set((s) => ({
          timesheets: s.timesheets.map((t) => (t.id === id ? { ...t, status: "Approved", approvedBy: by } : t)),
        }));
      },
      rejectTimesheet: (id, by) => {
        set((s) => ({
          timesheets: s.timesheets.map((t) => (t.id === id ? { ...t, status: "Rejected", approvedBy: by } : t)),
        }));
      },
      submitTimesheet: (input) => {
        const t: TimesheetEntry = { ...input, id: randomId("ts"), status: "Submitted" };
        set((s) => ({ timesheets: [t, ...s.timesheets] }));
        get().pushToast({ message: "Timesheet submitted for approval.", type: "success" });
      },
      addEmployee: (e) => {
        const emp: Employee = { ...e, id: randomId("emp"), source: "demo" };
        set((s) => ({ employees: [emp, ...s.employees] }));
        get().pushToast({ message: `Employee ${emp.name} added.`, type: "success" });
      },
      removeEmployee: (id) => {
        set((s) => ({ employees: s.employees.filter((e) => e.id !== id) }));
        get().pushToast({ message: "Employee removed.", type: "info" });
      },
      checkIn: ({ employeeId, source }) => {
        const today = new Date().toISOString().split("T")[0];
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const time = `${hh}:${mm}`;
        const nowMin = now.getHours() * 60 + now.getMinutes();

        const emp = get().employees.find((e) => e.employeeId === employeeId);
        const roster = get().shifts.find((s) => s.employeeId === employeeId && s.date === today);
        const win = resolveShiftWindow(emp?.shift, roster?.shift);
        if (!win) {
          return { ok: false, error: "You are not rostered for a shift today (Off day). Check-in is not required." };
        }

        const existing = get().attendance.find((a) => a.employeeId === employeeId && a.date === today);
        if (existing?.checkIn && !existing.checkOut) {
          return { ok: false, error: "You have already checked in today. Please check out first." };
        }
        if (existing?.checkIn && existing.checkOut) {
          return { ok: false, error: "Attendance already completed for today. Use \"Reset today\" to record a new session." };
        }

        const ev = evaluateCheckIn(win, nowMin);
        if (ev.state === "early") {
          return { ok: false, error: `Check-in for the ${win.name} shift (${win.start}–${win.end}) opens at ${ev.opensAt}. Please try again then.` };
        }

        const isLate = ev.state === "late" || ev.state === "closed";
        const newRec: AttendanceRecord = {
          id: randomId("att"),
          employeeId,
          date: today,
          status: isLate ? "Late" : "Present",
          checkIn: time,
          checkOut: undefined,
          workingHours: undefined,
          source,
        };
        if (existing) {
          set((s) => ({ attendance: s.attendance.map((a) => (a.id === existing.id ? newRec : a)) }));
        } else {
          set((s) => ({ attendance: [newRec, ...s.attendance] }));
        }

        get().pushToast({
          message: isLate
            ? `${win.name} shift · checked in at ${time} via ${source} — ${describeLateness(ev.minutesLate)} (grace until ${ev.graceUntil}).`
            : `${win.name} shift · checked in on time at ${time} via ${source}. Shift ends ${win.end}.`,
          type: isLate ? "warning" : "success",
          duration: 4500,
        });

        set((s) => ({
          notifications: [
            {
              id: randomId("n"),
              title: isLate ? "Late check-in recorded" : "Check-in recorded",
              message: `${emp?.name ?? employeeId} checked in at ${time} via ${source} for the ${win.name} shift (${win.start}–${win.end}).`,
              type: isLate ? "warning" : "success",
              timestamp: new Date().toISOString(),
              read: false,
              category: "attendance",
            },
            ...s.notifications,
          ],
        }));

        return {
          ok: true,
          recordId: newRec.id,
          status: newRec.status as "Present" | "Late",
          shiftName: win.name,
          minutesLate: ev.minutesLate,
          startsAt: win.start,
          endsAt: win.end,
        };
      },
      checkOut: (employeeId) => {
        const today = new Date().toISOString().split("T")[0];
        const rec = get().attendance.find((a) => a.employeeId === employeeId && a.date === today);
        if (!rec) return { ok: false, error: "You haven't checked in today." };
        if (!rec.checkIn) return { ok: false, error: "You haven't checked in today." };
        if (rec.checkOut) return { ok: false, error: "You have already checked out." };

        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const time = `${hh}:${mm}`;
        const nowMin = now.getHours() * 60 + now.getMinutes();

        const emp = get().employees.find((e) => e.employeeId === employeeId);
        const roster = get().shifts.find((s) => s.employeeId === employeeId && s.date === today);
        const win = resolveShiftWindow(emp?.shift, roster?.shift);

        // Worked minutes, handling a night shift that rolls past midnight.
        const inMin = toMinutes(rec.checkIn);
        let workedMin = nowMin - inMin;
        if (workedMin < 0) workedMin += 1440;
        const hours = Math.min(16, Math.max(0, workedMin / 60));

        const ot = win ? Math.max(0, overtimeMinutes(win, nowMin)) : 0;

        set((s) => ({
          attendance: s.attendance.map((a) =>
            a.id === rec.id ? { ...a, checkOut: time, workingHours: +hours.toFixed(2) } : a,
          ),
        }));

        get().pushToast({
          message: ot > 0
            ? `Checked out at ${time}. Worked ${hours.toFixed(2)}h including ${Math.round(ot)} min overtime.`
            : `Checked out at ${time}. Total worked: ${hours.toFixed(2)}h.`,
          type: "success",
          duration: 4500,
        });

        return { ok: true, overtime: Math.round(ot), hours: +hours.toFixed(2) };
      },
      resetTodayAttendance: (employeeId) => {
        const today = new Date().toISOString().split("T")[0];
        set((s) => ({ attendance: s.attendance.filter((a) => !(a.employeeId === employeeId && a.date === today)) }));
        get().pushToast({ message: "Today's attendance cleared. You can record a new check-in.", type: "info" });
      },
    }),
    {
      name: "wfi-store-v1",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage))),
      partialize: (s) => ({
        users: s.users,
        currentUserId: s.currentUserId,
        isAuthenticated: s.isAuthenticated,
        hasOnboarded: s.hasOnboarded,
        employees: s.employees,
        attendance: s.attendance,
        leaves: s.leaves,
        shifts: s.shifts,
        timesheets: s.timesheets,
        salaries: s.salaries,
        issues: s.issues,
        notifications: s.notifications,
        audit: s.audit,
        dateRange: s.dateRange,
        theme: s.theme,
        datasetMeta: s.datasetMeta,
      }),
    },
  ),
);

export function passwordStrength(pw: string) {
  const tests = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/';`~]/.test(pw),
  };
  const score = Object.values(tests).filter(Boolean).length;
  const label = score <= 2 ? "Weak" : score === 3 ? "Medium" : score === 4 ? "Strong" : "Very Strong";
  return { tests, score, label };
}

export function useCurrentUser() {
  return useApp((s) => s.users.find((u) => u.id === s.currentUserId) ?? null);
}

export function useMyEmployee() {
  const user = useCurrentUser();
  return useApp((s) => (user?.employeeId ? s.employees.find((e) => e.employeeId === user.employeeId) : undefined));
}
