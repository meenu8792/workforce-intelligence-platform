"use client";

import { useApp, useCurrentUser } from "./store";
import type { Employee, AttendanceRecord, LeaveRequest, ShiftRecord, TimesheetEntry, SalaryRecord, Issue } from "./types";
import { isInRange } from "./utils";

export function useScope() {
  const user = useCurrentUser();
  const all = useApp((s) => s.employees);
  const attendance = useApp((s) => s.attendance);
  const leaves = useApp((s) => s.leaves);
  const shifts = useApp((s) => s.shifts);
  const timesheets = useApp((s) => s.timesheets);
  const salaries = useApp((s) => s.salaries);
  const issues = useApp((s) => s.issues);
  const range = useApp((s) => s.dateRange);

  if (!user) {
    return { user: null, employees: [] as Employee[], attendance: [] as AttendanceRecord[], leaves: [] as LeaveRequest[], shifts: [] as ShiftRecord[], timesheets: [] as TimesheetEntry[], salaries: [] as SalaryRecord[], issues: [] as Issue[], range };
  }

  let employees = all;
  if (user.role === "manager" && user.employeeId) {
    // Direct reports + the manager themselves.
    const directReports = all.filter((e) => e.managerId === user.employeeId || e.employeeId === user.employeeId);
    // If the manager somehow has no direct reports (e.g. fresh dataset), fall
    // back to a wider slice of the org so the dashboard always has data to
    // show. We pick the first ~20 employees deterministically so the view
    // stays stable across renders.
    employees = directReports.length > 1
      ? directReports
      : all.slice(0, Math.min(20, all.length));
  } else if (user.role === "employee" && user.employeeId) {
    employees = all.filter((e) => e.employeeId === user.employeeId);
  }

  const empIds = new Set(employees.map((e) => e.employeeId));
  const inRange = <T extends { date?: string; fromDate?: string; createdOn?: string }>(items: T[], field: keyof T = "date" as keyof T) =>
    items.filter((it) => {
      const d = String((it as Record<string, unknown>)[field as string] ?? "");
      return d ? isInRange(d, range.from, range.to) : true;
    });

  const scopedAttendance = inRange(attendance).filter((a) => empIds.has(a.employeeId));
  const scopedLeaves = user.role === "manager" || user.role === "hr" || user.role === "admin"
    ? inRange(leaves, "appliedOn").filter((l) => user.role === "manager" ? empIds.has(l.employeeId) || l.status === "Pending" : true)
    : inRange(leaves, "appliedOn").filter((l) => empIds.has(l.employeeId));
  const scopedShifts = inRange(shifts).filter((s) => empIds.has(s.employeeId));
  const scopedTimesheets = inRange(timesheets).filter((t) => empIds.has(t.employeeId));
  const scopedSalaries = salaries.filter((s) => empIds.has(s.employeeId));
  const scopedIssues = user.role === "employee"
    ? issues.filter((i) => i.raisedBy === user.employeeId)
    : issues;

  return { user, employees, attendance: scopedAttendance, leaves: scopedLeaves, shifts: scopedShifts, timesheets: scopedTimesheets, salaries: scopedSalaries, issues: scopedIssues, range };
}

export function groupCount<T>(items: T[], key: (i: T) => string | undefined) {
  const out: Record<string, number> = {};
  for (const it of items) {
    const k = key(it) ?? "Unknown";
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

export function average(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}
