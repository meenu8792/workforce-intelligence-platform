"use client";

import { useEffect, useRef, useState } from "react";
import { useApp, useCurrentUser } from "@/lib/store";
import { Bot, X, Send, Sparkles, Loader2 } from "lucide-react";
import { isInRange } from "@/lib/utils";

type Msg = { id: string; role: "user" | "ai"; text: string; data?: { label: string; value: string }[]; chart?: { type: "bar" | "list"; data: { label: string; value: number }[] }; ts: number };

function rand() { return Math.random().toString(36).slice(2, 10); }

function answer(question: string, ctx: ReturnType<typeof buildContext>): { text: string; data?: Msg["data"]; chart?: Msg["chart"] } {
  const q = question.toLowerCase();
  const { employees, attendance, leaves, role, me, scopeEmployees, dateRange } = ctx;

  if (q.includes("permission") || q.includes("salary") && q.includes("other")) {
    if (role === "employee") return { text: "You don't have permission to access other employees' salary information. You can only view your own." };
  }

  if (q.includes("absent") || q.includes("absent today") || q.includes("absent this month")) {
    const isToday = q.includes("today");
    if (isToday) {
      const today = new Date().toISOString().split("T")[0];
      const ids = new Set(attendance.filter((a) => a.date === today && a.status === "Absent").map((a) => a.employeeId));
      const list = employees.filter((e) => ids.has(e.employeeId));
      return {
        text: `Today, ${list.length} employees are marked absent across the organization.`,
        data: list.slice(0, 5).map((e) => ({ label: e.name, value: e.department })),
        chart: { type: "list", data: list.slice(0, 6).map((e) => ({ label: e.name, value: 1 })) },
      };
    }
    const inRange = attendance.filter((a) => isInRange(a.date, dateRange.from, dateRange.to) && a.status === "Absent");
    const ids = new Set(inRange.map((a) => a.employeeId));
    return { text: `Between ${dateRange.from} and ${dateRange.to}, ${inRange.length} absence records were logged across ${ids.size} unique employees.` };
  }

  if (q.includes("attrition") || q.includes("leaving") || q.includes("risk")) {
    const high = employees.filter((e) => e.attritionRisk === "High");
    const med = employees.filter((e) => e.attritionRisk === "Medium");
    return {
      text: `Predicted attrition risk: ${high.length} employees at HIGH risk, ${med.length} at MEDIUM risk, ${employees.length - high.length - med.length} at LOW risk. Recommendation: focus on engagement and workload balance.`,
      data: [
        { label: "High risk", value: String(high.length) },
        { label: "Medium risk", value: String(med.length) },
        { label: "Low risk", value: String(employees.length - high.length - med.length) },
      ],
    };
  }

  if (q.includes("performance") && (q.includes("top") || q.includes("high"))) {
    const sorted = [...employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 5);
    return {
      text: `Top 5 employees by performance score: ${sorted.map((s) => s.name + " (" + s.performanceScore + "%)").join(", ")}.`,
      data: sorted.map((s) => ({ label: s.name, value: `${s.performanceScore}%` })),
    };
  }

  if (q.includes("attendance") && (q.includes("rate") || q.includes("month"))) {
    const inRange = attendance.filter((a) => isInRange(a.date, dateRange.from, dateRange.to));
    const present = inRange.filter((a) => a.status === "Present" || a.status === "Late" || a.status === "Half Day" || a.status === "Early Checkout").length;
    const rate = inRange.length ? (present / inRange.length) * 100 : 0;
    return { text: `Attendance rate between ${dateRange.from} and ${dateRange.to} is ${rate.toFixed(1)}%. (Based on simulated AI calculation using current dataset.)` };
  }

  if (q.includes("skill gap") || q.includes("skills")) {
    const counts: Record<string, number> = {};
    for (const e of employees) for (const s of e.skills) counts[s] = (counts[s] || 0) + 1;
    const sorted = Object.entries(counts).sort((a, b) => a[1] - b[1]).slice(0, 5);
    return {
      text: `Least available skills in your workforce (potential skill gaps): ${sorted.map(([k, v]) => `${k} (${v})`).join(", ")}. Recommendation: plan targeted training or hiring.`,
      data: sorted.map(([k, v]) => ({ label: k, value: String(v) })),
    };
  }

  if (q.includes("department") && (q.includes("highest") || q.includes("lowest"))) {
    const counts: Record<string, number> = {};
    for (const e of employees) counts[e.department] = (counts[e.department] || 0) + 1;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top = sorted[0]; const low = sorted[sorted.length - 1];
    return { text: `Largest department: ${top[0]} (${top[1]} employees). Smallest: ${low[0]} (${low[1]} employees).` };
  }

  if (q.includes("leave") && (q.includes("pending") || q.includes("approval"))) {
    const pending = leaves.filter((l) => l.status === "Pending");
    return { text: `There are ${pending.length} pending leave requests awaiting approval.` };
  }

  if (q.includes("shift") && q.includes("recommend")) {
    return { text: "Based on current workload, skills and availability, the recommended shift allocation is to balance Morning and Evening shifts with 1 Night shift per week, prioritising employees with the highest attendance." };
  }

  if (q.includes("appraisal") || q.includes("bonus") || q.includes("promotion")) {
    const eligible = employees
      .filter((e) => e.performanceScore > 80 && e.attendancePct > 85 && e.yearsOfExperience > 3)
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, 5);
    if (eligible.length === 0) return { text: "No employees currently meet the appraisal eligibility criteria. Try adjusting the dataset or the date range." };
    return {
      text: `Eligible for appraisal review (strong performance + attendance + tenure): ${eligible.map((e) => e.name).join(", ")}. Recommendation: consider performance review and bonus within approved policy. Final decision should be made by HR/management.`,
      data: eligible.map((e) => ({ label: e.name, value: `${e.performanceScore}% / ${e.attendancePct}%` })),
    };
  }

  if (q.includes("staff") || q.includes("workforce") && (q.includes("forecast") || q.includes("need") || q.includes("gap"))) {
    const totals = employees.length;
    const forecast = Math.round(totals * 1.15);
    return { text: `Current workforce: ${totals}. Projected requirement (with 15% workload increase): ${forecast}. Potential gap: +${forecast - totals}. Recommendation: consider workforce expansion. (Predicted figure — final decision should be made by HR/management.)` };
  }

  if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
    return { text: `Hello! I'm your Workforce Copilot. I can answer questions about employees, attendance, attrition, skills, shifts, and more. Try asking: "How many employees are absent today?" or "Show me top performers."` };
  }

  if (q.includes("total") && (q.includes("employee") || q.includes("headcount"))) {
    return { text: `Current total employees in the system: ${employees.length}. Active: ${employees.filter((e) => e.status === "Active").length}.` };
  }

  if (q.includes("my") && (q.includes("leave") || q.includes("balance")) && role === "employee") {
    if (!me) return { text: "I couldn't find your linked employee record." };
    return { text: `${me.name}, your current leave balance is ${me.leaveBalance} days. Pending requests: ${leaves.filter((l) => l.employeeId === me.employeeId && l.status === "Pending").length}.` };
  }

  return {
    text: `I analysed your question against the workforce dataset. I can help with: total employees, attendance, top performers, attrition risk, skill gaps, leave approvals, appraisal recommendations, and workforce forecasts. Try one of those.`,
  };
}

function buildContext() {
  const state = useApp.getState();
  const user = state.users.find((u) => u.id === state.currentUserId);
  const me = user?.employeeId ? state.employees.find((e) => e.employeeId === user.employeeId) : undefined;
  const role = user?.role ?? "employee";
  const dateRange = state.dateRange;
  let scopeEmployees = state.employees;
  if (role === "manager" && user?.employeeId) {
    scopeEmployees = state.employees.filter((e) => e.managerId === user.employeeId || e.employeeId === user.employeeId);
  } else if (role === "employee" && user?.employeeId) {
    scopeEmployees = state.employees.filter((e) => e.employeeId === user.employeeId);
  }
  return { employees: scopeEmployees, attendance: state.attendance, leaves: state.leaves, role, me, scopeEmployees, dateRange };
}

export function WorkforceCopilot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: rand(), role: "ai", text: "Hi, I'm your Workforce Copilot. Ask me about attendance, attrition, top performers, leave status, skill gaps, and more.", ts: Date.now() },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = useCurrentUser();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading, open]);

  const send = () => {
    const q = input.trim();
    if (!q) return;
    const um: Msg = { id: rand(), role: "user", text: q, ts: Date.now() };
    setMsgs((m) => [...m, um]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const ctx = buildContext();
      const a = answer(q, ctx);
      const am: Msg = { id: rand(), role: "ai", text: a.text, data: a.data, chart: a.chart, ts: Date.now() };
      setMsgs((m) => [...m, am]);
      setLoading(false);
    }, 650);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 px-4 py-3 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white font-medium shadow-2xl shadow-blue-500/30 hover:scale-105 transition flex items-center gap-2 animate-pulse-glow"
        aria-label="Ask Workforce Copilot"
      >
        <Sparkles size={18} />
        <span className="hidden sm:inline">Ask Workforce AI</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-[color:var(--bg-elev)] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl border border-[color:var(--border)] flex flex-col h-[90vh] sm:h-[640px] animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-[color:var(--border)] bg-gradient-to-r from-blue-600/10 to-cyan-500/10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <div className="font-semibold text-sm">Workforce Copilot</div>
                  <div className="text-[10px] text-[color:var(--text-muted)]">AI assistant · respects {user?.role} permissions</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-[color:var(--bg-soft)]"><X size={18} /></button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white"
                      : "bg-[color:var(--bg-soft)] border border-[color:var(--border)]"
                  }`}>
                    {m.text}
                    {m.data && m.data.length > 0 && (
                      <div className="mt-2 grid grid-cols-1 gap-1">
                        {m.data.map((d, i) => (
                          <div key={i} className="flex items-center justify-between text-xs bg-[color:var(--bg-elev)]/50 rounded px-2 py-1">
                            <span className="font-medium">{d.label}</span>
                            <span className="opacity-80">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[color:var(--bg-soft)] border border-[color:var(--border)] rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-[color:var(--text-muted)]">
                    <Loader2 size={14} className="animate-spin" /> Analysing workforce data…
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-[color:var(--border)]">
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about your workforce…"
                  className="input !py-2.5"
                />
                <button type="submit" className="btn btn-primary !p-2.5" disabled={!input.trim() || loading}>
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
