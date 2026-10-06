// Centralized domain types

export type Role = "admin" | "hr" | "manager" | "employee";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // demo only — never use plaintext in production
  role: Role;
  employeeId?: string; // links to a workforce record for manager/employee roles
  createdAt: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  gender?: "Male" | "Female" | "Other" | string;
  age?: number;
  department: string;
  designation: string;
  role: string;
  joiningDate: string; // ISO
  yearsOfExperience: number;
  location: string;
  manager?: string;
  managerId?: string;
  salary: number;
  performanceScore: number; // 0-100
  attendancePct: number;     // 0-100
  skills: string[];
  trainingCompleted: number;
  trainingRequired: number;
  engagement: number;        // 0-100
  shift: string;             // "Morning" | "Evening" | "Night" | "Rotational"
  project: string;
  attritionRisk: "Low" | "Medium" | "High";
  workHours: number;         // hours per day
  overtime: number;          // hours per month
  leaveBalance: number;      // days
  status: "Active" | "On Leave" | "Inactive";
  promotionEligible: boolean;
  source: "uploaded" | "demo";
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // ISO date
  status: "Present" | "Absent" | "Late" | "Half Day" | "On Leave" | "Early Checkout";
  checkIn?: string;
  checkOut?: string;
  workingHours?: number;
  source?: "Biometric" | "Face" | "GPS" | "QR" | "Manual";
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "Casual" | "Sick" | "Earned" | "Unpaid" | "Maternity" | "Paternity";
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedOn: string;
  approvedBy?: string;
  approverRole?: Role;
}

export interface ShiftRecord {
  id: string;
  employeeId: string;
  date: string;
  shift: "Morning" | "Evening" | "Night" | "Rotational" | "Off";
  startTime: string;
  endTime: string;
  overtime: number;
}

export interface TimesheetEntry {
  id: string;
  employeeId: string;
  date: string;
  project: string;
  task: string;
  hours: number;
  billable: boolean;
  status: "Submitted" | "Approved" | "Rejected" | "Draft";
  approvedBy?: string;
}

export interface Issue {
  id: string;
  raisedBy: string;       // employee id
  raisedByName: string;
  category: "Salary" | "Attendance" | "Leave" | "Shift" | "Payslip" | "Profile" | "Other";
  subject: string;
  description: string;
  status: "Open" | "Under Review" | "Assigned" | "Resolved";
  priority: "Low" | "Medium" | "High";
  createdOn: string;
  assignedTo?: string;
  resolvedOn?: string;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  month: string;        // YYYY-MM
  baseSalary: number;
  overtime: number;
  incentives: number;
  bonus: number;
  leaveDeduction: number;
  netPay: number;
  status: "Processing" | "Credited" | "On Hold";
  acknowledged: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "danger";
  timestamp: string;
  read: boolean;
  forRole?: Role;
  forUserId?: string;
  category?: string;
}

export interface AuditEntry {
  id: string;
  actor: string;
  role: Role;
  action: string;
  target?: string;
  timestamp: string;
  meta?: Record<string, unknown>;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface DatasetMeta {
  fileName: string;
  uploadedOn: string;
  uploadedBy: string;
  records: number;
  validRecords: number;
  duplicates: number;
  missing: number;
  columns: string[];
}
