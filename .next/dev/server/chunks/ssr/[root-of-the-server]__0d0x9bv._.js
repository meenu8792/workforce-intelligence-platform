module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clampPct",
    ()=>clampPct,
    "cn",
    ()=>cn,
    "daysBetween",
    ()=>daysBetween,
    "formatCurrency",
    ()=>formatCurrency,
    "formatNumber",
    ()=>formatNumber,
    "formatPct",
    ()=>formatPct,
    "initials",
    ()=>initials,
    "isInRange",
    ()=>isInRange,
    "isoDaysAgo",
    ()=>isoDaysAgo,
    "pickAvatarColor",
    ()=>pickAvatarColor,
    "randomId",
    ()=>randomId,
    "todayISO",
    ()=>todayISO
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatCurrency(n, compact = false) {
    if (compact) {
        if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
        if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
        if (n >= 1e3) return `₹${(n / 1e3).toFixed(1)}K`;
        return `₹${n}`;
    }
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(n);
}
function formatNumber(n) {
    return new Intl.NumberFormat("en-IN").format(n);
}
function formatPct(n, digits = 1) {
    return `${n.toFixed(digits)}%`;
}
function randomId(prefix = "id") {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function todayISO() {
    return new Date().toISOString().split("T")[0];
}
function isoDaysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
}
function daysBetween(from, to) {
    const a = new Date(from).getTime();
    const b = new Date(to).getTime();
    return Math.max(1, Math.round((b - a) / 86400000) + 1);
}
function isInRange(dateISO, from, to) {
    if (!dateISO) return false;
    return dateISO >= from && dateISO <= to;
}
function clampPct(n) {
    return Math.max(0, Math.min(100, n));
}
function pickAvatarColor(name) {
    const colors = [
        [
            "#3b82f6",
            "#06b6d4"
        ],
        [
            "#8b5cf6",
            "#ec4899"
        ],
        [
            "#10b981",
            "#3b82f6"
        ],
        [
            "#f59e0b",
            "#ef4444"
        ],
        [
            "#06b6d4",
            "#8b5cf6"
        ],
        [
            "#ec4899",
            "#f59e0b"
        ]
    ];
    let h = 0;
    for(let i = 0; i < name.length; i++)h = h * 31 + name.charCodeAt(i) >>> 0;
    return colors[h % colors.length];
}
function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map((p)=>p[0]?.toUpperCase() ?? "").join("");
}
}),
"[project]/src/lib/seed.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildAttendance",
    ()=>buildAttendance,
    "buildAudit",
    ()=>buildAudit,
    "buildDemoEmployees",
    ()=>buildDemoEmployees,
    "buildIssues",
    ()=>buildIssues,
    "buildLeaves",
    ()=>buildLeaves,
    "buildNotifications",
    ()=>buildNotifications,
    "buildSalaries",
    ()=>buildSalaries,
    "buildShifts",
    ()=>buildShifts,
    "buildTimesheets",
    ()=>buildTimesheets
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
;
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
    "Data & AI"
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
    "Recruiter"
];
const locations = [
    "Bengaluru",
    "Mumbai",
    "Hyderabad",
    "Pune",
    "Delhi NCR",
    "Chennai",
    "Remote"
];
const shifts = [
    "Morning",
    "Evening",
    "Night",
    "Rotational"
];
const projects = [
    "Helios CRM",
    "Atlas Migration",
    "Nova Analytics",
    "Orion Mobile",
    "Phoenix AI",
    "Aegis Security",
    "Zephyr Internal",
    "Lighthouse Reporting"
];
const skillPool = [
    "React",
    "Node.js",
    "TypeScript",
    "Python",
    "Go",
    "Java",
    "AWS",
    "GCP",
    "Kubernetes",
    "Docker",
    "SQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "GraphQL",
    "TensorFlow",
    "PyTorch",
    "Tableau",
    "Power BI",
    "Figma",
    "Adobe XD",
    "Sketch",
    "Product Strategy",
    "Agile",
    "Salesforce",
    "HubSpot",
    "Excel",
    "Financial Modeling",
    "Recruitment",
    "HR Analytics",
    "Customer Research",
    "Conflict Resolution",
    "Mentoring",
    "Stakeholder Management"
];
const firstNames = [
    "Aarav",
    "Diya",
    "Vihaan",
    "Ananya",
    "Reyansh",
    "Saanvi",
    "Arjun",
    "Aadhya",
    "Krishna",
    "Ishaan",
    "Priya",
    "Riya",
    "Rahul",
    "Neha",
    "Rohan",
    "Meera",
    "Aditya",
    "Pooja",
    "Karthik",
    "Tanvi",
    "Vikram",
    "Anjali",
    "Sandeep",
    "Kavya",
    "Manish",
    "Shreya",
    "Aman",
    "Roshni",
    "Suresh",
    "Ishita",
    "Nikhil",
    "Sneha",
    "Rakesh",
    "Divya",
    "Yash",
    "Maya",
    "Harsh",
    "Ritu",
    "Akash",
    "Tara",
    "Siddharth",
    "Nandini",
    "Abhishek",
    "Aishwarya",
    "Manoj",
    "Lakshmi",
    "Prakash",
    "Geeta",
    "Vivek",
    "Rekha"
];
const lastNames = [
    "Sharma",
    "Verma",
    "Patel",
    "Gupta",
    "Iyer",
    "Reddy",
    "Nair",
    "Khan",
    "Singh",
    "Kumar",
    "Rao",
    "Das",
    "Mehta",
    "Joshi",
    "Bose",
    "Banerjee",
    "Chatterjee",
    "Pillai",
    "Menon",
    "Mukherjee"
];
function pick(arr, i) {
    return arr[i % arr.length];
}
// Deterministic pseudo-random so the demo dataset is stable.
function seeded(seed) {
    let s = seed;
    return ()=>{
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
    };
}
function buildDemoEmployees(count = 120) {
    const rng = seeded(42);
    const list = [];
    for(let i = 0; i < count; i++){
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
        const skills = [];
        while(skills.length < skillCount){
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
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("emp"),
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
            managerId: i > 8 ? `EMP-${String(1000 + i % 8).padStart(4, "0")}` : undefined,
            manager: i > 8 ? `EMP-${String(1000 + i % 8).padStart(4, "0")}` : undefined,
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
            source: "demo"
        });
    }
    return list;
}
function buildAttendance(employees, days = 60) {
    const records = [];
    const rng = seeded(99);
    for (const e of employees){
        for(let d = 0; d < days; d++){
            const date = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isoDaysAgo"])(d);
            const r = rng();
            let status;
            if (r < 0.04) status = "Absent";
            else if (r < 0.1) status = "On Leave";
            else if (r < 0.16) status = "Late";
            else if (r < 0.18) status = "Half Day";
            else if (r < 0.2) status = "Early Checkout";
            else status = "Present";
            const srcRoll = rng();
            const source = srcRoll < 0.35 ? "Biometric" : srcRoll < 0.6 ? "Face" : srcRoll < 0.8 ? "QR" : srcRoll < 0.93 ? "GPS" : "Manual";
            records.push({
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("att"),
                employeeId: e.employeeId,
                date,
                status,
                checkIn: status === "Present" || status === "Late" ? `${8 + Math.floor(rng() * 2)}:${String(Math.floor(rng() * 60)).padStart(2, "0")}` : undefined,
                checkOut: status === "Present" || status === "Early Checkout" ? `${17 + Math.floor(rng() * 3)}:${String(Math.floor(rng() * 60)).padStart(2, "0")}` : undefined,
                workingHours: status === "Present" ? +(8 + rng()).toFixed(1) : status === "Half Day" ? 4 : 0,
                source
            });
        }
    }
    return records;
}
function buildLeaves(employees) {
    const rng = seeded(7);
    const out = [];
    const types = [
        "Casual",
        "Sick",
        "Earned",
        "Unpaid"
    ];
    for(let i = 0; i < 30; i++){
        const e = employees[Math.floor(rng() * employees.length)];
        const from = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isoDaysAgo"])(Math.floor(rng() * 25));
        const days = 1 + Math.floor(rng() * 4);
        const to = new Date(from);
        to.setDate(to.getDate() + days);
        const statusRoll = rng();
        const status = statusRoll < 0.5 ? "Pending" : statusRoll < 0.85 ? "Approved" : "Rejected";
        out.push({
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("lv"),
            employeeId: e.employeeId,
            employeeName: e.name,
            type: pick(types, Math.floor(rng() * types.length)),
            fromDate: from,
            toDate: to.toISOString().split("T")[0],
            days,
            reason: "Family event / personal work",
            status,
            appliedOn: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isoDaysAgo"])(Math.floor(rng() * 30) + 5),
            approvedBy: status !== "Pending" ? "HR Lead" : undefined,
            approverRole: status !== "Pending" ? "hr" : undefined
        });
    }
    return out;
}
function buildShifts(employees, days = 30) {
    const rng = seeded(13);
    const out = [];
    for (const e of employees){
        for(let d = 0; d < days; d++){
            const date = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isoDaysAgo"])(d);
            const shift = e.shift === "Rotational" ? pick([
                "Morning",
                "Evening",
                "Night"
            ], Math.floor(rng() * 3)) : rng() > 0.12 ? e.shift : "Off";
            const start = shift === "Morning" ? "09:00" : shift === "Evening" ? "14:00" : shift === "Night" ? "22:00" : "-";
            const end = shift === "Morning" ? "18:00" : shift === "Evening" ? "23:00" : shift === "Night" ? "07:00" : "-";
            out.push({
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("shift"),
                employeeId: e.employeeId,
                date,
                shift,
                startTime: start,
                endTime: end,
                overtime: rng() > 0.8 ? Math.round(rng() * 4) : 0
            });
        }
    }
    return out;
}
function buildTimesheets(employees) {
    const rng = seeded(21);
    const out = [];
    for(let i = 0; i < 120; i++){
        const e = employees[Math.floor(rng() * employees.length)];
        const date = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isoDaysAgo"])(Math.floor(rng() * 25));
        const project = e.project;
        const hours = +(1 + rng() * 7).toFixed(1);
        const statusRoll = rng();
        const status = statusRoll < 0.4 ? "Approved" : statusRoll < 0.75 ? "Submitted" : statusRoll < 0.9 ? "Rejected" : "Draft";
        out.push({
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("ts"),
            employeeId: e.employeeId,
            date,
            project,
            task: [
                "Development",
                "Design",
                "Review",
                "Testing",
                "Documentation",
                "Meetings"
            ][Math.floor(rng() * 6)],
            hours,
            billable: rng() > 0.3,
            status,
            approvedBy: status === "Approved" ? "Team Lead" : undefined
        });
    }
    return out;
}
function buildSalaries(employees) {
    const out = [];
    const months = [
        "2026-05",
        "2026-06",
        "2026-07",
        "2026-08",
        "2026-09"
    ];
    for (const e of employees){
        for (const m of months){
            const ot = Math.round(e.salary * 0.02 * (e.overtime / 30));
            const inc = Math.round(e.salary * 0.1 * (e.performanceScore / 100));
            const bon = e.performanceScore > 90 ? 10000 : 0;
            const ded = 0;
            const net = e.salary + ot + inc + bon - ded;
            const statusRoll = (e.employeeId.charCodeAt(4) + m.charCodeAt(5)) % 3;
            const status = statusRoll === 0 ? "Credited" : statusRoll === 1 ? "Processing" : "Credited";
            out.push({
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("sal"),
                employeeId: e.employeeId,
                month: m,
                baseSalary: e.salary,
                overtime: ot,
                incentives: inc,
                bonus: bon,
                leaveDeduction: ded,
                netPay: net,
                status,
                acknowledged: statusRoll === 0
            });
        }
    }
    return out;
}
function buildIssues(employees) {
    const rng = seeded(33);
    const out = [];
    const cats = [
        "Salary",
        "Attendance",
        "Leave",
        "Shift",
        "Payslip",
        "Profile",
        "Other"
    ];
    for(let i = 0; i < 14; i++){
        const e = employees[Math.floor(rng() * employees.length)];
        const cat = pick(cats, Math.floor(rng() * cats.length));
        const statusRoll = rng();
        const status = statusRoll < 0.35 ? "Open" : statusRoll < 0.65 ? "Under Review" : statusRoll < 0.85 ? "Assigned" : "Resolved";
        out.push({
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("iss"),
            raisedBy: e.employeeId,
            raisedByName: e.name,
            category: cat,
            subject: `${cat} issue raised for review`,
            description: "Employee reported an issue that needs verification by HR.",
            status,
            priority: rng() > 0.7 ? "High" : rng() > 0.4 ? "Medium" : "Low",
            createdOn: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isoDaysAgo"])(Math.floor(rng() * 20)),
            assignedTo: status !== "Open" ? "HR Operations" : undefined,
            resolvedOn: status === "Resolved" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["todayISO"])() : undefined
        });
    }
    return out;
}
function buildNotifications() {
    return [
        {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("n"),
            title: "Dataset ready",
            message: "Demo dataset is loaded. Upload a real file from System Admin to override.",
            type: "info",
            timestamp: new Date().toISOString(),
            read: false,
            category: "system"
        },
        {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("n"),
            title: "Welcome to AI Workforce Intelligence",
            message: "Try the Workforce Copilot from the floating button to ask anything.",
            type: "success",
            timestamp: new Date().toISOString(),
            read: false,
            category: "system"
        }
    ];
}
function buildAudit() {
    return [
        {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("a"),
            actor: "system",
            role: "admin",
            action: "Demo dataset initialised",
            timestamp: new Date().toISOString()
        }
    ];
}
}),
"[project]/src/lib/shifts.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Shift rules used by the attendance check-in engine.
// A single source of truth so the store and the UI agree on timings.
__turbopack_context__.s([
    "SHIFT_WINDOWS",
    ()=>SHIFT_WINDOWS,
    "describeLateness",
    ()=>describeLateness,
    "evaluateCheckIn",
    ()=>evaluateCheckIn,
    "overtimeMinutes",
    ()=>overtimeMinutes,
    "resolveShiftWindow",
    ()=>resolveShiftWindow,
    "toHHMM",
    ()=>toHHMM,
    "toMinutes",
    ()=>toMinutes
]);
const SHIFT_WINDOWS = {
    Morning: {
        name: "Morning",
        start: "09:00",
        end: "18:00",
        graceMinutes: 15,
        openMinutesBefore: 120,
        crossesMidnight: false
    },
    Evening: {
        name: "Evening",
        start: "14:00",
        end: "23:00",
        graceMinutes: 15,
        openMinutesBefore: 120,
        crossesMidnight: false
    },
    Night: {
        name: "Night",
        start: "22:00",
        end: "07:00",
        graceMinutes: 15,
        openMinutesBefore: 120,
        crossesMidnight: true
    }
};
function toMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
}
function toHHMM(total) {
    const t = (total % 1440 + 1440) % 1440;
    return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}
function resolveShiftWindow(employeeShift, rosteredShift) {
    const candidate = employeeShift === "Rotational" ? rosteredShift && rosteredShift !== "Off" ? rosteredShift : "Morning" : employeeShift ?? "Morning";
    if (!candidate || candidate === "Off") return null;
    return SHIFT_WINDOWS[candidate] ?? SHIFT_WINDOWS.Morning;
}
function evaluateCheckIn(win, nowMinutes) {
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
        endsAt: win.end
    };
    if (n < openFrom) return {
        state: "early",
        minutesLate: 0,
        ...base
    };
    if (n <= graceEnd) return {
        state: "ontime",
        minutesLate: 0,
        ...base
    };
    if (n <= endM) return {
        state: "late",
        minutesLate: n - startM,
        ...base
    };
    return {
        state: "closed",
        minutesLate: n - startM,
        ...base
    };
}
function overtimeMinutes(win, checkOutMinutes) {
    const rawEnd = toMinutes(win.end);
    const endM = rawEnd + (win.crossesMidnight ? 1440 : 0);
    let n = checkOutMinutes;
    if (win.crossesMidnight && checkOutMinutes < rawEnd) n = checkOutMinutes + 1440;
    return n - endM;
}
function describeLateness(minutes) {
    if (minutes <= 0) return "on time";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} min late`;
    return `${h}h ${m}m late`;
}
}),
"[project]/src/lib/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "passwordStrength",
    ()=>passwordStrength,
    "useApp",
    ()=>useApp,
    "useCurrentUser",
    ()=>useCurrentUser,
    "useMyEmployee",
    ()=>useMyEmployee
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/seed.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shifts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/shifts.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function buildInitialDataset() {
    const employees = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildDemoEmployees"])(120);
    const attendance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildAttendance"])(employees, 60);
    const leaves = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildLeaves"])(employees);
    const shifts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildShifts"])(employees, 30);
    const timesheets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildTimesheets"])(employees);
    const salaries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSalaries"])(employees);
    const issues = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildIssues"])(employees);
    const notifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildNotifications"])();
    const audit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildAudit"])();
    return {
        employees,
        attendance,
        leaves,
        shifts,
        timesheets,
        salaries,
        issues,
        notifications,
        audit
    };
}
const init = buildInitialDataset();
const defaultMeta = {
    fileName: "demo_workforce_dataset",
    uploadedOn: new Date().toISOString(),
    uploadedBy: "system",
    records: init.employees.length,
    validRecords: init.employees.length,
    duplicates: 0,
    missing: 0,
    columns: [
        "employeeId",
        "name",
        "email",
        "gender",
        "age",
        "department",
        "designation",
        "joiningDate",
        "yearsOfExperience",
        "location",
        "manager",
        "salary",
        "performanceScore",
        "attendancePct",
        "skills",
        "trainingCompleted",
        "trainingRequired",
        "engagement",
        "shift",
        "project",
        "attritionRisk",
        "workHours",
        "overtime",
        "leaveBalance",
        "status",
        "promotionEligible"
    ]
};
const useApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        users: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("u"),
                username: "admin",
                email: "admin@nexora.com",
                password: "Admin@123",
                role: "admin",
                createdAt: new Date().toISOString()
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("u"),
                username: "hr_lead",
                email: "hr@nexora.com",
                password: "Hr@12345",
                role: "hr",
                createdAt: new Date().toISOString()
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("u"),
                username: "manager",
                email: "manager@nexora.com",
                password: "Manager@123",
                role: "manager",
                employeeId: "EMP-1000",
                createdAt: new Date().toISOString()
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("u"),
                username: "employee",
                email: "employee@nexora.com",
                password: "Employee@123",
                role: "employee",
                employeeId: "EMP-1001",
                createdAt: new Date().toISOString()
            }
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
        dateRange: {
            from: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isoDaysAgo"])(29),
            to: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["todayISO"])()
        },
        theme: "light",
        datasetMeta: defaultMeta,
        toasts: [],
        register: (input)=>{
            const { username, email, password, confirmPassword } = input;
            if (!username.trim() || !email.trim() || !password || !confirmPassword) {
                return {
                    ok: false,
                    error: "Please fill in all fields."
                };
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return {
                    ok: false,
                    error: "Please enter a valid email address."
                };
            }
            if (password !== confirmPassword) {
                return {
                    ok: false,
                    error: "Passwords do not match."
                };
            }
            const strength = passwordStrength(password);
            if (strength.score < 3) {
                return {
                    ok: false,
                    error: "Password is too weak. Please meet all the requirements."
                };
            }
            const exists = get().users.find((u)=>u.email.toLowerCase() === email.toLowerCase());
            if (exists) return {
                ok: false,
                error: "This email is already registered. Please log in."
            };
            const unameExists = get().users.find((u)=>u.username.toLowerCase() === username.toLowerCase());
            if (unameExists) return {
                ok: false,
                error: "This username is already taken."
            };
            const u = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("u"),
                username: username.trim(),
                email: email.trim(),
                password,
                role: "employee",
                employeeId: get().employees[Math.floor(Math.random() * get().employees.length)]?.employeeId,
                createdAt: new Date().toISOString()
            };
            set((s)=>({
                    users: [
                        ...s.users,
                        u
                    ]
                }));
            return {
                ok: true
            };
        },
        login: (input)=>{
            const { identifier, password, role } = input;
            if (!identifier.trim() || !password) return {
                ok: false,
                error: "Please enter your credentials."
            };
            const user = get().users.find((u)=>(u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase()) && u.password === password);
            if (!user) return {
                ok: false,
                error: "Invalid username/email or password."
            };
            if (user.role !== role) {
                return {
                    ok: false,
                    error: "You do not have permission to access this dashboard."
                };
            }
            set({
                currentUserId: user.id,
                isAuthenticated: true
            });
            set((s)=>({
                    audit: [
                        {
                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("a"),
                            actor: user.username,
                            role: user.role,
                            action: "Logged in",
                            timestamp: new Date().toISOString()
                        },
                        ...s.audit
                    ]
                }));
            return {
                ok: true,
                user
            };
        },
        logout: ()=>{
            const u = get().users.find((x)=>x.id === get().currentUserId);
            if (u) {
                set((s)=>({
                        audit: [
                            {
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("a"),
                                actor: u.username,
                                role: u.role,
                                action: "Logged out",
                                timestamp: new Date().toISOString()
                            },
                            ...s.audit
                        ]
                    }));
            }
            set({
                currentUserId: null,
                isAuthenticated: false
            });
        },
        setOnboarded: (v)=>set({
                hasOnboarded: v
            }),
        setDateRange: (r)=>{
            if (r.from && r.to && r.from > r.to) {
                get().pushToast({
                    message: "From date cannot be after To date.",
                    type: "error"
                });
                return;
            }
            set({
                dateRange: r
            });
        },
        setTheme: (t)=>{
            set({
                theme: t
            });
            if (typeof document !== "undefined") {
                document.documentElement.setAttribute("data-theme", t);
            }
        },
        pushToast: (t)=>{
            const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("t");
            const item = {
                id,
                ...t
            };
            set((s)=>({
                    toasts: [
                        ...s.toasts,
                        item
                    ]
                }));
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        },
        dismissToast: (id)=>set((s)=>({
                    toasts: s.toasts.filter((x)=>x.id !== id)
                })),
        importDataset: (rows, meta)=>{
            // Map flexible columns
            const lower = (k)=>k.toLowerCase().trim().replace(/\s+/g, "_");
            const mapKey = (k)=>lower(k);
            const mapped = [];
            let valid = 0;
            let missing = 0;
            const seenIds = new Set();
            for (const row of rows){
                const r = {};
                for (const [k, v] of Object.entries(row))r[mapKey(k)] = v;
                const empId = String(r.employee_id ?? r.employeeid ?? r.emp_id ?? r.empid ?? r.id ?? `EMP-${1000 + mapped.length}`).trim();
                if (!empId) {
                    missing++;
                    continue;
                }
                if (seenIds.has(empId)) continue;
                seenIds.add(empId);
                const name = String(r.name ?? r.employee_name ?? r.full_name ?? "Unknown");
                if (!name || name === "Unknown") missing++;
                const parseNum = (v)=>{
                    if (v == null || v === "") return undefined;
                    const n = Number(String(v).replace(/[, ]/g, ""));
                    return isNaN(n) ? undefined : n;
                };
                const skills = String(r.skills ?? r.skill ?? "").split(/[,;|]/).map((x)=>x.trim()).filter(Boolean);
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
                const attritionRisk = riskRaw.startsWith("h") ? "High" : riskRaw.startsWith("m") ? "Medium" : "Low";
                const statusRaw = String(r.status ?? "").toLowerCase();
                const status = statusRaw.includes("leave") ? "On Leave" : statusRaw.includes("inactive") ? "Inactive" : "Active";
                const shiftRaw = String(r.shift ?? "Morning");
                const shift = [
                    "Morning",
                    "Evening",
                    "Night",
                    "Rotational"
                ].includes(shiftRaw) ? shiftRaw : "Morning";
                mapped.push({
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("emp"),
                    employeeId: empId,
                    name,
                    email: String(r.email ?? `${empId.toLowerCase()}@nexora.com`),
                    gender: r.gender ?? undefined,
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
                    source: "uploaded"
                });
                valid++;
            }
            // rebuild attendance, leaves etc. for the new employees
            const attendance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildAttendance"])(mapped, 60);
            const leaves = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildLeaves"])(mapped);
            const shifts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildShifts"])(mapped, 30);
            const timesheets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildTimesheets"])(mapped);
            const salaries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSalaries"])(mapped);
            const issues = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildIssues"])(mapped);
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
                    columns: Object.keys(rows[0] ?? {})
                }
            });
            set((s)=>({
                    audit: [
                        {
                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("a"),
                            actor: "System Admin",
                            role: "admin",
                            action: `Imported dataset ${meta.fileName}`,
                            timestamp: new Date().toISOString(),
                            meta: {
                                rows: rows.length,
                                valid
                            }
                        },
                        ...s.audit
                    ],
                    notifications: [
                        {
                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("n"),
                            title: "Dataset imported",
                            message: `${mapped.length} records loaded from ${meta.fileName}.`,
                            type: "success",
                            timestamp: new Date().toISOString(),
                            read: false,
                            category: "system"
                        },
                        ...s.notifications
                    ]
                }));
        },
        resetDataset: ()=>{
            const fresh = buildInitialDataset();
            set({
                employees: fresh.employees,
                attendance: fresh.attendance,
                leaves: fresh.leaves,
                shifts: fresh.shifts,
                timesheets: fresh.timesheets,
                salaries: fresh.salaries,
                issues: fresh.issues,
                datasetMeta: {
                    ...defaultMeta,
                    uploadedOn: new Date().toISOString(),
                    uploadedBy: "system"
                }
            });
            get().pushToast({
                message: "Dataset reset to demo data.",
                type: "info"
            });
        },
        markNotificationRead: (id)=>set((s)=>({
                    notifications: s.notifications.map((n)=>n.id === id ? {
                            ...n,
                            read: true
                        } : n)
                })),
        markAllNotificationsRead: ()=>set((s)=>({
                    notifications: s.notifications.map((n)=>({
                            ...n,
                            read: true
                        }))
                })),
        approveLeave: (id, by)=>{
            set((s)=>({
                    leaves: s.leaves.map((l)=>l.id === id ? {
                            ...l,
                            status: "Approved",
                            approvedBy: by
                        } : l)
                }));
            const lv = get().leaves.find((l)=>l.id === id);
            if (lv) {
                set((s)=>({
                        notifications: [
                            {
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("n"),
                                title: "Leave approved",
                                message: `${lv.employeeName}'s leave from ${lv.fromDate} to ${lv.toDate} approved.`,
                                type: "success",
                                timestamp: new Date().toISOString(),
                                read: false,
                                category: "leave"
                            },
                            ...s.notifications
                        ]
                    }));
            }
        },
        rejectLeave: (id, by)=>{
            set((s)=>({
                    leaves: s.leaves.map((l)=>l.id === id ? {
                            ...l,
                            status: "Rejected",
                            approvedBy: by
                        } : l)
                }));
            const lv = get().leaves.find((l)=>l.id === id);
            if (lv) {
                set((s)=>({
                        notifications: [
                            {
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("n"),
                                title: "Leave rejected",
                                message: `${lv.employeeName}'s leave from ${lv.fromDate} to ${lv.toDate} rejected.`,
                                type: "warning",
                                timestamp: new Date().toISOString(),
                                read: false,
                                category: "leave"
                            },
                            ...s.notifications
                        ]
                    }));
            }
        },
        applyLeave: (input)=>{
            const lv = {
                ...input,
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("lv"),
                status: "Pending",
                appliedOn: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["todayISO"])()
            };
            set((s)=>({
                    leaves: [
                        lv,
                        ...s.leaves
                    ]
                }));
            get().pushToast({
                message: "Leave request submitted for approval.",
                type: "success"
            });
        },
        updateProfile: (patch)=>{
            const uid = get().currentUserId;
            if (!uid) return;
            set((s)=>({
                    users: s.users.map((u)=>u.id === uid ? {
                            ...u,
                            ...patch
                        } : u)
                }));
            get().pushToast({
                message: "Profile updated successfully.",
                type: "success"
            });
        },
        changePassword: (oldP, newP)=>{
            const uid = get().currentUserId;
            const u = get().users.find((x)=>x.id === uid);
            if (!u) return {
                ok: false,
                error: "No active session."
            };
            if (u.password !== oldP) return {
                ok: false,
                error: "Current password is incorrect."
            };
            if (passwordStrength(newP).score < 3) return {
                ok: false,
                error: "New password is too weak."
            };
            set((s)=>({
                    users: s.users.map((x)=>x.id === uid ? {
                            ...x,
                            password: newP
                        } : x)
                }));
            return {
                ok: true
            };
        },
        addIssue: (input)=>{
            const issue = {
                ...input,
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("iss"),
                status: "Open",
                createdOn: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["todayISO"])(),
                priority: input.priority ?? "Medium"
            };
            set((s)=>({
                    issues: [
                        issue,
                        ...s.issues
                    ]
                }));
            get().pushToast({
                message: "Issue submitted to HR. We'll review and respond shortly.",
                type: "success"
            });
        },
        resolveIssue: (id)=>{
            set((s)=>({
                    issues: s.issues.map((i)=>i.id === id ? {
                            ...i,
                            status: "Resolved",
                            resolvedOn: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["todayISO"])()
                        } : i)
                }));
            get().pushToast({
                message: "Issue marked as resolved.",
                type: "success"
            });
        },
        acknowledgeSalary: (id)=>{
            set((s)=>({
                    salaries: s.salaries.map((x)=>x.id === id ? {
                            ...x,
                            acknowledged: true
                        } : x)
                }));
            get().pushToast({
                message: "Salary acknowledged. Thank you.",
                type: "success"
            });
        },
        approveTimesheet: (id, by)=>{
            set((s)=>({
                    timesheets: s.timesheets.map((t)=>t.id === id ? {
                            ...t,
                            status: "Approved",
                            approvedBy: by
                        } : t)
                }));
        },
        rejectTimesheet: (id, by)=>{
            set((s)=>({
                    timesheets: s.timesheets.map((t)=>t.id === id ? {
                            ...t,
                            status: "Rejected",
                            approvedBy: by
                        } : t)
                }));
        },
        submitTimesheet: (input)=>{
            const t = {
                ...input,
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("ts"),
                status: "Submitted"
            };
            set((s)=>({
                    timesheets: [
                        t,
                        ...s.timesheets
                    ]
                }));
            get().pushToast({
                message: "Timesheet submitted for approval.",
                type: "success"
            });
        },
        addEmployee: (e)=>{
            const emp = {
                ...e,
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("emp"),
                source: "demo"
            };
            set((s)=>({
                    employees: [
                        emp,
                        ...s.employees
                    ]
                }));
            get().pushToast({
                message: `Employee ${emp.name} added.`,
                type: "success"
            });
        },
        removeEmployee: (id)=>{
            set((s)=>({
                    employees: s.employees.filter((e)=>e.id !== id)
                }));
            get().pushToast({
                message: "Employee removed.",
                type: "info"
            });
        },
        checkIn: ({ employeeId, source })=>{
            const today = new Date().toISOString().split("T")[0];
            const now = new Date();
            const hh = String(now.getHours()).padStart(2, "0");
            const mm = String(now.getMinutes()).padStart(2, "0");
            const time = `${hh}:${mm}`;
            const nowMin = now.getHours() * 60 + now.getMinutes();
            const emp = get().employees.find((e)=>e.employeeId === employeeId);
            const roster = get().shifts.find((s)=>s.employeeId === employeeId && s.date === today);
            const win = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shifts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveShiftWindow"])(emp?.shift, roster?.shift);
            if (!win) {
                return {
                    ok: false,
                    error: "You are not rostered for a shift today (Off day). Check-in is not required."
                };
            }
            const existing = get().attendance.find((a)=>a.employeeId === employeeId && a.date === today);
            if (existing?.checkIn && !existing.checkOut) {
                return {
                    ok: false,
                    error: "You have already checked in today. Please check out first."
                };
            }
            if (existing?.checkIn && existing.checkOut) {
                return {
                    ok: false,
                    error: "Attendance already completed for today. Use \"Reset today\" to record a new session."
                };
            }
            const ev = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shifts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["evaluateCheckIn"])(win, nowMin);
            if (ev.state === "early") {
                return {
                    ok: false,
                    error: `Check-in for the ${win.name} shift (${win.start}–${win.end}) opens at ${ev.opensAt}. Please try again then.`
                };
            }
            const isLate = ev.state === "late" || ev.state === "closed";
            const newRec = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("att"),
                employeeId,
                date: today,
                status: isLate ? "Late" : "Present",
                checkIn: time,
                checkOut: undefined,
                workingHours: undefined,
                source
            };
            if (existing) {
                set((s)=>({
                        attendance: s.attendance.map((a)=>a.id === existing.id ? newRec : a)
                    }));
            } else {
                set((s)=>({
                        attendance: [
                            newRec,
                            ...s.attendance
                        ]
                    }));
            }
            get().pushToast({
                message: isLate ? `${win.name} shift · checked in at ${time} via ${source} — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shifts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["describeLateness"])(ev.minutesLate)} (grace until ${ev.graceUntil}).` : `${win.name} shift · checked in on time at ${time} via ${source}. Shift ends ${win.end}.`,
                type: isLate ? "warning" : "success",
                duration: 4500
            });
            set((s)=>({
                    notifications: [
                        {
                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["randomId"])("n"),
                            title: isLate ? "Late check-in recorded" : "Check-in recorded",
                            message: `${emp?.name ?? employeeId} checked in at ${time} via ${source} for the ${win.name} shift (${win.start}–${win.end}).`,
                            type: isLate ? "warning" : "success",
                            timestamp: new Date().toISOString(),
                            read: false,
                            category: "attendance"
                        },
                        ...s.notifications
                    ]
                }));
            return {
                ok: true,
                recordId: newRec.id,
                status: newRec.status,
                shiftName: win.name,
                minutesLate: ev.minutesLate,
                startsAt: win.start,
                endsAt: win.end
            };
        },
        checkOut: (employeeId)=>{
            const today = new Date().toISOString().split("T")[0];
            const rec = get().attendance.find((a)=>a.employeeId === employeeId && a.date === today);
            if (!rec) return {
                ok: false,
                error: "You haven't checked in today."
            };
            if (!rec.checkIn) return {
                ok: false,
                error: "You haven't checked in today."
            };
            if (rec.checkOut) return {
                ok: false,
                error: "You have already checked out."
            };
            const now = new Date();
            const hh = String(now.getHours()).padStart(2, "0");
            const mm = String(now.getMinutes()).padStart(2, "0");
            const time = `${hh}:${mm}`;
            const nowMin = now.getHours() * 60 + now.getMinutes();
            const emp = get().employees.find((e)=>e.employeeId === employeeId);
            const roster = get().shifts.find((s)=>s.employeeId === employeeId && s.date === today);
            const win = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shifts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveShiftWindow"])(emp?.shift, roster?.shift);
            // Worked minutes, handling a night shift that rolls past midnight.
            const inMin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shifts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toMinutes"])(rec.checkIn);
            let workedMin = nowMin - inMin;
            if (workedMin < 0) workedMin += 1440;
            const hours = Math.min(16, Math.max(0, workedMin / 60));
            const ot = win ? Math.max(0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shifts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["overtimeMinutes"])(win, nowMin)) : 0;
            set((s)=>({
                    attendance: s.attendance.map((a)=>a.id === rec.id ? {
                            ...a,
                            checkOut: time,
                            workingHours: +hours.toFixed(2)
                        } : a)
                }));
            get().pushToast({
                message: ot > 0 ? `Checked out at ${time}. Worked ${hours.toFixed(2)}h including ${Math.round(ot)} min overtime.` : `Checked out at ${time}. Total worked: ${hours.toFixed(2)}h.`,
                type: "success",
                duration: 4500
            });
            return {
                ok: true,
                overtime: Math.round(ot),
                hours: +hours.toFixed(2)
            };
        },
        resetTodayAttendance: (employeeId)=>{
            const today = new Date().toISOString().split("T")[0];
            set((s)=>({
                    attendance: s.attendance.filter((a)=>!(a.employeeId === employeeId && a.date === today))
                }));
            get().pushToast({
                message: "Today's attendance cleared. You can record a new check-in.",
                type: "info"
            });
        }
    }), {
    name: "wfi-store-v1",
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined),
    partialize: (s)=>({
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
            datasetMeta: s.datasetMeta
        })
}));
function passwordStrength(pw) {
    const tests = {
        length: pw.length >= 8,
        upper: /[A-Z]/.test(pw),
        lower: /[a-z]/.test(pw),
        number: /[0-9]/.test(pw),
        special: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/';`~]/.test(pw)
    };
    const score = Object.values(tests).filter(Boolean).length;
    const label = score <= 2 ? "Weak" : score === 3 ? "Medium" : score === 4 ? "Strong" : "Very Strong";
    return {
        tests,
        score,
        label
    };
}
function useCurrentUser() {
    return useApp((s)=>s.users.find((u)=>u.id === s.currentUserId) ?? null);
}
function useMyEmployee() {
    const user = useCurrentUser();
    return useApp((s)=>user?.employeeId ? s.employees.find((e)=>e.employeeId === user.employeeId) : undefined);
}
}),
"[project]/src/components/AppShell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppShell",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function AppShell({ children }) {
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useApp"])((s)=>s.theme);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (typeof document !== "undefined") {
            document.documentElement.setAttribute("data-theme", theme);
        }
    }, [
        theme
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[project]/src/components/Toast.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastHost",
    ()=>ToastHost
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.mjs [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.mjs [app-ssr] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>");
"use client";
;
;
;
const ICONS = {
    success: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
        size: 20,
        className: "text-emerald-500"
    }, void 0, false, {
        fileName: "[project]/src/components/Toast.tsx",
        lineNumber: 7,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    error: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
        size: 20,
        className: "text-rose-500"
    }, void 0, false, {
        fileName: "[project]/src/components/Toast.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    info: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
        size: 20,
        className: "text-blue-500"
    }, void 0, false, {
        fileName: "[project]/src/components/Toast.tsx",
        lineNumber: 9,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    warning: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
        size: 20,
        className: "text-amber-500"
    }, void 0, false, {
        fileName: "[project]/src/components/Toast.tsx",
        lineNumber: 10,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0))
};
function ToastHost() {
    const toasts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useApp"])((s)=>s.toasts);
    const dismiss = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useApp"])((s)=>s.dismissToast);
    if (!toasts.length) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "toast-container",
        children: toasts.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `toast toast-${t.type}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-0.5",
                        children: ICONS[t.type]
                    }, void 0, false, {
                        fileName: "[project]/src/components/Toast.tsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0",
                        children: [
                            t.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-semibold mb-0.5",
                                children: t.title
                            }, void 0, false, {
                                fileName: "[project]/src/components/Toast.tsx",
                                lineNumber: 23,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "opacity-90 leading-snug",
                                children: t.message
                            }, void 0, false, {
                                fileName: "[project]/src/components/Toast.tsx",
                                lineNumber: 24,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Toast.tsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>dismiss(t.id),
                        className: "opacity-60 hover:opacity-100 transition",
                        "aria-label": "Close",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/src/components/Toast.tsx",
                            lineNumber: 27,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Toast.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this)
                ]
            }, t.id, true, {
                fileName: "[project]/src/components/Toast.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/Toast.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0d0x9bv._.js.map