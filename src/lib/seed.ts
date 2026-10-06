import type {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  ShiftRecord,
  TimesheetEntry,
  SalaryRecord,
  Issue,
  NotificationItem,
  AuditEntry,
} from "./types";
import { randomId, todayISO, isoDaysAgo } from "./utils";

const departments = [
  "Engineering",
  "Product",
  "Design",
  "Sales",
  "Marketing",
  "Customer Success",
  "Finance",
  "Human Resources",
  "Operations",
  "Data & AI",
];
const designations = [
  "Software Engineer",
  "Senior Engineer",
  "Tech Lead",
  "Engineering Manager",
  "Product Manager",
  "UI/UX Designer",
  "Sales Executive",
  "Marketing Manager",
  "HR Business Partner",
  "Data Scientist",
  "Operations Lead",
  "Customer Success Manager",
  "Finance Analyst",
  "Recruiter",
];
const locations = ["Bengaluru", "Mumbai", "Hyderabad", "Pune", "Delhi NCR", "Chennai", "Remote"];
const shifts = ["Morning", "Evening", "Night", "Rotational"] as const;
const projects = [
  "Helios CRM",
  "Atlas Migration",
  "Nova Analytics",
  "Orion Mobile",
  "Phoenix AI",
  "Aegis Security",
  "Zephyr Internal",
  "Lighthouse Reporting",
];
const skillPool = [
  "React", "Node.js", "TypeScript", "Python", "Go", "Java", "AWS", "GCP", "Kubernetes",
  "Docker", "SQL", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "TensorFlow", "PyTorch",
  "Tableau", "Power BI", "Figma", "Adobe XD", "Sketch", "Product Strategy", "Agile",
  "Salesforce", "HubSpot", "Excel", "Financial Modeling", "Recruitment", "HR Analytics",
  "Customer Research", "Conflict Resolution", "Mentoring", "Stakeholder Management",
];
const firstNames = [
  "Aarav", "Diya", "Vihaan", "Ananya", "Reyansh", "Saanvi", "Arjun", "Aadhya", "Krishna", "Ishaan",
  "Priya", "Riya", "Rahul", "Neha", "Rohan", "Meera", "Aditya", "Pooja", "Karthik", "Tanvi",
  "Vikram", "Anjali", "Sandeep", "Kavya", "Manish", "Shreya", "Aman", "Roshni", "Suresh", "Ishita",
  "Nikhil", "Sneha", "Rakesh", "Divya", "Yash", "Maya", "Harsh", "Ritu", "Akash", "Tara",
  "Siddharth", "Nandini", "Abhishek", "Aishwarya", "Manoj", "Lakshmi", "Prakash", "Geeta", "Vivek", "Rekha",
];
const lastNames = [
  "Sharma", "Verma", "Patel", "Gupta", "Iyer", "Reddy", "Nair", "Khan", "Singh", "Kumar",
  "Rao", "Das", "Mehta", "Joshi", "Bose", "Banerjee", "Chatterjee", "Pillai", "Menon", "Mukherjee",
];

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length];
}

// Deterministic pseudo-random so the demo dataset is stable.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function buildDemoEmployees(count = 120): Employee[] {
  const rng = seeded(42);
  const list: Employee[] = [];
  for (let i = 0; i < count; i++) {
    const first = pick(firstNames, Math.floor(rng() * firstNames.length));
    const last = pick(lastNames, Math.floor(rng() * lastNames.length));
    const name = `${first} ${last}`;
    const department = pick(departments, Math.floor(rng() * departments.length));
    const designation = pick(designations, Math.floor(rng() * designations.length));
    const location = pick(locations, Math.floor(rng() * locations.length));
    const yearsExp = +(rng() * 14 + 0.5).toFixed(1);
    const yearsAtCompany = +(rng() * 6 + 0.2).toFixed(1);
    const joinDate = new Date();
    joinDate.setDate(joinDate.getDate() - Math.floor(yearsAtCompany * 365));
    const skillCount = 3 + Math.floor(rng() * 4);
    const skills: string[] = [];
    while (skills.length < skillCount) {
      const s = skillPool[Math.floor(rng() * skillPool.length)];
      if (!skills.includes(s)) skills.push(s);
    }
    const performance = Math.round(55 + rng() * 40);
    const attendance = Math.round(70 + rng() * 28);
    const engagement = Math.round(50 + rng() * 45);
    const salary = Math.round((4 + rng() * 22) * 100000 / 1000) * 1000;
    const riskRoll = rng();
    const attritionRisk = riskRoll > 0.85 ? "High" : riskRoll > 0.6 ? "Medium" : "Low";
    const shift = pick(shifts, Math.floor(rng() * shifts.length));
    const project = pick(projects, Math.floor(rng() * projects.length));
    const trainingRequired = 4 + Math.floor(rng() * 5);
    const trainingCompleted = Math.floor(trainingRequired * (0.3 + rng() * 0.7));
    list.push({
      id: randomId("emp"),
      employeeId: `EMP-${String(1000 + i).padStart(4, "0")}`,
      name,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@nexora.com`,
      gender: rng() > 0.45 ? "Male" : "Female",
      age: Math.floor(24 + rng() * 28),
      department,
      designation,
      role: designation,
      joiningDate: joinDate.toISOString().split("T")[0],
      yearsOfExperience: yearsExp,
      location,
      managerId: i > 8 ? `EMP-${String(1000 + (i % 8)).padStart(4, "0")}` : undefined,
      manager: i > 8 ? `EMP-${String(1000 + (i % 8)).padStart(4, "0")}` : undefined,
      salary,
      performanceScore: performance,
      attendancePct: attendance,
      skills,
      trainingCompleted,
      trainingRequired,
      engagement,
      shift,
      project,
      attritionRisk,
      workHours: +(7.5 + rng() * 1.5).toFixed(1),
      overtime: Math.round(rng() * 30),
      leaveBalance: Math.floor(rng() * 12) + 2,
      status: rng() > 0.92 ? "On Leave" : "Active",
      promotionEligible: performance > 80 && attendance > 85 && yearsExp > 3,
      source: "demo",
    });
  }
  return list;
}

export function buildAttendance(employees: Employee[], days = 60): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const rng = seeded(99);
  for (const e of employees) {
    for (let d = 0; d < days; d++) {
      const date = isoDaysAgo(d);
      const r = rng();
      let status: AttendanceRecord["status"];
      if (r < 0.04) status = "Absent";
      else if (r < 0.1) status = "On Leave";
      else if (r < 0.16) status = "Late";
      else if (r < 0.18) status = "Half Day";
      else if (r < 0.2) status = "Early Checkout";
      else status = "Present";
      const srcRoll = rng();
      const source: AttendanceRecord["source"] =
        srcRoll < 0.35 ? "Biometric" :
        srcRoll < 0.6 ? "Face" :
        srcRoll < 0.8 ? "QR" :
        srcRoll < 0.93 ? "GPS" : "Manual";
      records.push({
        id: randomId("att"),
        employeeId: e.employeeId,
        date,
        status,
        checkIn: status === "Present" || status === "Late" ? `${8 + Math.floor(rng() * 2)}:${String(Math.floor(rng() * 60)).padStart(2, "0")}` : undefined,
        checkOut: status === "Present" || status === "Early Checkout" ? `${17 + Math.floor(rng() * 3)}:${String(Math.floor(rng() * 60)).padStart(2, "0")}` : undefined,
        workingHours: status === "Present" ? +(8 + rng()).toFixed(1) : status === "Half Day" ? 4 : 0,
        source,
      });
    }
  }
  return records;
}

export function buildLeaves(employees: Employee[]): LeaveRequest[] {
  const rng = seeded(7);
  const out: LeaveRequest[] = [];
  const types: LeaveRequest["type"][] = ["Casual", "Sick", "Earned", "Unpaid"];
  for (let i = 0; i < 30; i++) {
    const e = employees[Math.floor(rng() * employees.length)];
    const from = isoDaysAgo(Math.floor(rng() * 25));
    const days = 1 + Math.floor(rng() * 4);
    const to = new Date(from);
    to.setDate(to.getDate() + days);
    const statusRoll = rng();
    const status: LeaveRequest["status"] = statusRoll < 0.5 ? "Pending" : statusRoll < 0.85 ? "Approved" : "Rejected";
    out.push({
      id: randomId("lv"),
      employeeId: e.employeeId,
      employeeName: e.name,
      type: pick(types, Math.floor(rng() * types.length)),
      fromDate: from,
      toDate: to.toISOString().split("T")[0],
      days,
      reason: "Family event / personal work",
      status,
      appliedOn: isoDaysAgo(Math.floor(rng() * 30) + 5),
      approvedBy: status !== "Pending" ? "HR Lead" : undefined,
      approverRole: status !== "Pending" ? "hr" : undefined,
    });
  }
  return out;
}

export function buildShifts(employees: Employee[], days = 30): ShiftRecord[] {
  const rng = seeded(13);
  const out: ShiftRecord[] = [];
  for (const e of employees) {
    for (let d = 0; d < days; d++) {
      const date = isoDaysAgo(d);
      const shift: ShiftRecord["shift"] = e.shift === "Rotational"
        ? pick(["Morning", "Evening", "Night"] as const, Math.floor(rng() * 3))
        : (rng() > 0.12 ? (e.shift as ShiftRecord["shift"]) : "Off");
      const start = shift === "Morning" ? "09:00" : shift === "Evening" ? "14:00" : shift === "Night" ? "22:00" : "-";
      const end   = shift === "Morning" ? "18:00" : shift === "Evening" ? "23:00" : shift === "Night" ? "07:00" : "-";
      out.push({
        id: randomId("shift"),
        employeeId: e.employeeId,
        date,
        shift,
        startTime: start,
        endTime: end,
        overtime: rng() > 0.8 ? Math.round(rng() * 4) : 0,
      });
    }
  }
  return out;
}

export function buildTimesheets(employees: Employee[]): TimesheetEntry[] {
  const rng = seeded(21);
  const out: TimesheetEntry[] = [];
  for (let i = 0; i < 120; i++) {
    const e = employees[Math.floor(rng() * employees.length)];
    const date = isoDaysAgo(Math.floor(rng() * 25));
    const project = e.project;
    const hours = +(1 + rng() * 7).toFixed(1);
    const statusRoll = rng();
    const status: TimesheetEntry["status"] = statusRoll < 0.4 ? "Approved" : statusRoll < 0.75 ? "Submitted" : statusRoll < 0.9 ? "Rejected" : "Draft";
    out.push({
      id: randomId("ts"),
      employeeId: e.employeeId,
      date,
      project,
      task: ["Development", "Design", "Review", "Testing", "Documentation", "Meetings"][Math.floor(rng() * 6)],
      hours,
      billable: rng() > 0.3,
      status,
      approvedBy: status === "Approved" ? "Team Lead" : undefined,
    });
  }
  return out;
}

export function buildSalaries(employees: Employee[]): SalaryRecord[] {
  const out: SalaryRecord[] = [];
  const months = ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09"];
  for (const e of employees) {
    for (const m of months) {
      const ot = Math.round(e.salary * 0.02 * (e.overtime / 30));
      const inc = Math.round(e.salary * 0.1 * (e.performanceScore / 100));
      const bon = e.performanceScore > 90 ? 10000 : 0;
      const ded = 0;
      const net = e.salary + ot + inc + bon - ded;
      const statusRoll = (e.employeeId.charCodeAt(4) + m.charCodeAt(5)) % 3;
      const status: SalaryRecord["status"] = statusRoll === 0 ? "Credited" : statusRoll === 1 ? "Processing" : "Credited";
      out.push({
        id: randomId("sal"),
        employeeId: e.employeeId,
        month: m,
        baseSalary: e.salary,
        overtime: ot,
        incentives: inc,
        bonus: bon,
        leaveDeduction: ded,
        netPay: net,
        status,
        acknowledged: statusRoll === 0,
      });
    }
  }
  return out;
}

export function buildIssues(employees: Employee[]): Issue[] {
  const rng = seeded(33);
  const out: Issue[] = [];
  const cats: Issue["category"][] = ["Salary", "Attendance", "Leave", "Shift", "Payslip", "Profile", "Other"];
  for (let i = 0; i < 14; i++) {
    const e = employees[Math.floor(rng() * employees.length)];
    const cat = pick(cats, Math.floor(rng() * cats.length));
    const statusRoll = rng();
    const status: Issue["status"] = statusRoll < 0.35 ? "Open" : statusRoll < 0.65 ? "Under Review" : statusRoll < 0.85 ? "Assigned" : "Resolved";
    out.push({
      id: randomId("iss"),
      raisedBy: e.employeeId,
      raisedByName: e.name,
      category: cat,
      subject: `${cat} issue raised for review`,
      description: "Employee reported an issue that needs verification by HR.",
      status,
      priority: rng() > 0.7 ? "High" : rng() > 0.4 ? "Medium" : "Low",
      createdOn: isoDaysAgo(Math.floor(rng() * 20)),
      assignedTo: status !== "Open" ? "HR Operations" : undefined,
      resolvedOn: status === "Resolved" ? todayISO() : undefined,
    });
  }
  return out;
}

export function buildNotifications(): NotificationItem[] {
  return [
    { id: randomId("n"), title: "Dataset ready", message: "Demo dataset is loaded. Upload a real file from System Admin to override.", type: "info", timestamp: new Date().toISOString(), read: false, category: "system" },
    { id: randomId("n"), title: "Welcome to AI Workforce Intelligence", message: "Try the Workforce Copilot from the floating button to ask anything.", type: "success", timestamp: new Date().toISOString(), read: false, category: "system" },
  ];
}

export function buildAudit(): AuditEntry[] {
  return [
    { id: randomId("a"), actor: "system", role: "admin", action: "Demo dataset initialised", timestamp: new Date().toISOString() },
  ];
}
