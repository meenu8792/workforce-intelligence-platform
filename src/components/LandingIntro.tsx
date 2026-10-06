"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { Sparkles, ArrowRight, LogIn, UserPlus, Network, Brain, BarChart3, Users, ShieldCheck } from "lucide-react";

export function LandingIntro() {
  const router = useRouter();
  const setOnboarded = useApp((s) => s.setOnboarded);
  const [phase, setPhase] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setMouse({ x: ((e.clientX - r.left) / r.width - 0.5) * 30, y: ((e.clientY - r.top) / r.height - 0.5) * 30 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const goLogin = () => { setOnboarded(true); router.push("/login"); };
  const goRegister = () => { setOnboarded(true); router.push("/register"); };

  return (
    <div ref={ref} className="relative min-h-screen w-full overflow-hidden network-bg">
      {/* animated grid background */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* floating nodes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="node" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
        {NODES.map((n, i) => (
          <g key={i}>
            <line x1={n.x} y1={n.y} x2={NODES[(i + 1) % NODES.length].x} y2={NODES[(i + 1) % NODES.length].y} stroke="url(#line)" strokeWidth="1" opacity="0.4" />
            <circle cx={n.x} cy={n.y} r="3" fill="#3b82f6" className="animate-network" style={{ animationDelay: `${i * 0.15}s` }} />
            <circle cx={n.x} cy={n.y} r="14" fill="url(#node)" />
          </g>
        ))}
        {/* Travelling dots */}
        {NODES.map((_, i) => (
          <circle key={`p-${i}`} r="2" fill="#06b6d4" className="animate-float" style={{ animationDelay: `${i * 0.4}s`, animationDuration: "8s" }}>
            <animateMotion dur={`${10 + (i % 5)}s`} repeatCount="indefinite" path={motionPath(i)} />
          </circle>
        ))}
      </svg>

      {/* floating cards */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden md:block absolute top-[18%] left-[10%] animate-float" style={{ animationDelay: "0.2s", animationDuration: "7s" }}>
          <div className="glass rounded-xl p-3 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-medium"><Users size={14} className="text-blue-500" /> Workforce</div>
            <div className="text-2xl font-bold mt-1">12,480</div>
            <div className="text-[10px] text-emerald-500">+8.4%</div>
          </div>
        </div>
        <div className="hidden md:block absolute top-[30%] right-[8%] animate-float" style={{ animationDelay: "1.2s", animationDuration: "9s" }}>
          <div className="glass rounded-xl p-3 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-medium"><Brain size={14} className="text-violet-500" /> AI Insight</div>
            <div className="text-sm mt-1">Attrition risk ↓ 4.2%</div>
            <div className="text-[10px] text-[color:var(--text-muted)]">3 high-risk flagged</div>
          </div>
        </div>
        <div className="hidden md:block absolute bottom-[20%] left-[14%] animate-float" style={{ animationDelay: "0.8s", animationDuration: "8s" }}>
          <div className="glass rounded-xl p-3 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-medium"><BarChart3 size={14} className="text-cyan-500" /> Productivity</div>
            <div className="w-32 h-1.5 bg-[color:var(--bg-soft)] rounded-full mt-1.5">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: "78%" }} />
            </div>
            <div className="text-[10px] text-[color:var(--text-muted)] mt-1">78% efficiency</div>
          </div>
        </div>
        <div className="hidden md:block absolute bottom-[18%] right-[14%] animate-float" style={{ animationDelay: "1.6s", animationDuration: "10s" }}>
          <div className="glass rounded-xl p-3 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-medium"><ShieldCheck size={14} className="text-emerald-500" /> Compliance</div>
            <div className="text-sm mt-1">GDPR · 100%</div>
          </div>
        </div>
      </div>

      {/* top nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
            <Sparkles size={20} />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold">Nexora</div>
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--text-muted)]">Workforce AI</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={goLogin} className="btn btn-ghost !text-sm">
            <LogIn size={16} /> <span className="hidden sm:inline">Login</span>
          </button>
          <button onClick={goRegister} className="btn btn-primary !text-sm">
            <UserPlus size={16} /> <span className="hidden sm:inline">Register</span>
          </button>
        </div>
      </nav>

      {/* hero */}
      <div className="relative z-10 px-6 md:px-12 pt-12 md:pt-20 pb-16 max-w-6xl mx-auto text-center" style={{ transform: `translate(${mouse.x * 0.2}px, ${mouse.y * 0.2}px)` }}>
        <div className={`transition-all duration-1000 ${phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-medium mb-6">
            <Network size={12} /> AI Workforce Operating System
          </div>
        </div>

        <h1 className={`text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] transition-all duration-1000 delay-200 ${phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="block">AI-Powered</span>
          <span className="block gradient-text">Workforce Management</span>
          <span className="block mt-1">&amp; Talent Intelligence</span>
        </h1>

        <p className={`mt-6 text-base md:text-lg text-[color:var(--text-muted)] max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          From workforce data to intelligent decisions. Automate operations, predict attrition, analyse skill gaps, and make smarter HR decisions with AI.
        </p>

        <div className={`mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-1000 delay-500 ${phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <button onClick={goLogin} className="btn btn-primary !text-base !px-6 !py-3 shadow-xl shadow-blue-500/30">
            Enter System <ArrowRight size={18} />
          </button>
          <button onClick={goRegister} className="btn btn-secondary !text-base !px-6 !py-3">
            Create Account
          </button>
        </div>

        <div className={`mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto transition-all duration-1000 delay-700 ${phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {[
            { label: "Real-time Analytics", icon: BarChart3, color: "text-blue-500" },
            { label: "AI Predictions", icon: Brain, color: "text-violet-500" },
            { label: "Attrition Risk", icon: ShieldCheck, color: "text-emerald-500" },
            { label: "Smart Insights", icon: Sparkles, color: "text-cyan-500" },
          ].map((f) => (
            <div key={f.label} className="glass rounded-xl p-3 flex items-center gap-2.5 justify-center">
              <f.icon size={16} className={f.color} />
              <span className="text-xs font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* workflow strip */}
      <div className={`relative z-10 px-6 md:px-12 pb-12 max-w-6xl mx-auto transition-all duration-1000 delay-900 ${phase >= 3 ? "opacity-100" : "opacity-0"}`}>
        <div className="glass rounded-2xl p-5 md:p-6">
          <div className="text-center text-xs uppercase tracking-wider text-[color:var(--text-muted)] font-semibold mb-4">Centralized Intelligence Flow</div>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2 items-center">
            {["Employee Data", "Attendance", "Automation", "AI Analysis", "Predictions", "Recommendations", "Decisions"].map((s, i, arr) => (
              <div key={s} className="flex flex-col items-center gap-1.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 || i === arr.length - 1 ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white" : "bg-[color:var(--bg-soft)] border border-[color:var(--border)]"}`}>
                  {i + 1}
                </div>
                <div className="text-[10px] text-center font-medium">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const NODES = [
  { x: 120, y: 150 }, { x: 320, y: 90 }, { x: 520, y: 200 }, { x: 760, y: 120 },
  { x: 940, y: 240 }, { x: 1080, y: 400 }, { x: 980, y: 580 }, { x: 800, y: 660 },
  { x: 560, y: 700 }, { x: 320, y: 640 }, { x: 140, y: 500 }, { x: 220, y: 340 },
];

function motionPath(i: number) {
  const n = NODES;
  const a = n[i % n.length]; const b = n[(i + 1) % n.length]; const c = n[(i + 3) % n.length];
  return `M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${(a.y + b.y) / 2 - 80} ${b.x} ${b.y} T ${c.x} ${c.y}`;
}
