"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { useApp } from "@/lib/store";
import type { Role } from "@/lib/types";
import { Sparkles, User, Lock, ArrowRight, Eye, EyeOff, LogIn, ChevronDown, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES: { value: Role; label: string; desc: string; demo?: string }[] = [
  { value: "admin", label: "System Admin", desc: "Full platform control, dataset upload, audit, integrations.", demo: "admin / Admin@123" },
  { value: "hr", label: "HR", desc: "Employee analytics, leave, performance, talent, reports.", demo: "hr_lead / Hr@12345" },
  { value: "manager", label: "Manager", desc: "Team attendance, leave approvals, performance, AI insights.", demo: "manager / Manager@123" },
  { value: "employee", label: "Employee", desc: "Personal dashboard, attendance, leave, skills, salary.", demo: "employee / Employee@123" },
];

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const login = useApp((s) => s.login);
  const setOnboarded = useApp((s) => s.setOnboarded);
  const pushToast = useApp((s) => s.pushToast);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!role) {
      setError("Please select your role before signing in.");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      const r = login({ identifier, password, role: role as Role });
      setBusy(false);
      if (!r.ok) {
        setError(r.error ?? "Login failed");
        return;
      }
      pushToast({ message: `Welcome back, ${r.user?.username}.`, type: "success" });
      // Honour the original destination if AuthGuard sent us here.
      const from = sp?.get("from");
      const fallback = role === "admin" ? "/admin" : role === "hr" ? "/hr" : role === "manager" ? "/manager" : "/employee";
      // Only honour `from` if it belongs to the role's own section so we don't
      // accidentally send a manager to an admin-only page.
      const ownSection = `/${role === "admin" ? "admin" : role}`;
      const dest = from && (from === ownSection || from.startsWith(ownSection + "/")) ? from : fallback;
      router.push(dest);
    }, 500);
  };

  return (
    <div className="min-h-screen relative network-bg">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <Link href="/" onClick={() => setOnboarded(true)} className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
            <Sparkles size={20} />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold">Nexora</div>
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--text-muted)]">Workforce AI</div>
          </div>
        </Link>
        <Link href="/register" onClick={() => setOnboarded(true)} className="btn btn-secondary !text-sm">Create account</Link>
      </nav>

      <div className="relative z-10 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sign in to continue</h1>
            <p className="text-sm text-[color:var(--text-muted)] mt-1.5">Access your AI-powered workforce dashboard</p>
          </div>

          <div className="section-card !p-6 md:!p-8 animate-slide-up">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="label">Username or Email ID</label>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-10 rounded-lg bg-[color:var(--bg-soft)] border border-[color:var(--border)] flex items-center justify-center text-[color:var(--text-muted)] shrink-0">
                    <User size={15} />
                  </div>
                  <input className="input flex-1" placeholder="Enter username or email ID" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-10 rounded-lg bg-[color:var(--bg-soft)] border border-[color:var(--border)] flex items-center justify-center text-[color:var(--text-muted)] shrink-0">
                    <Lock size={15} />
                  </div>
                  <input type={showPw ? "text" : "password"} className="input flex-1 pr-10" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="-ml-9 p-1.5 text-[color:var(--text-muted)] hover:text-blue-500 shrink-0" aria-label="Toggle password visibility">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Select your role</label>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-10 rounded-lg bg-[color:var(--bg-soft)] border border-[color:var(--border)] flex items-center justify-center text-[color:var(--text-muted)] shrink-0">
                    <ShieldCheck size={15} />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as Role)}
                      className="input pr-9 appearance-none cursor-pointer w-full"
                      required
                    >
                      <option value="">Select role</option>
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] pointer-events-none" />
                  </div>
                </div>
                {role && (
                  <p className="text-xs text-[color:var(--text-muted)] mt-1.5">
                    {ROLES.find((r) => r.value === role)?.desc}
                  </p>
                )}
              </div>

              {error && (
                <div className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 animate-fade-in">{error}</div>
              )}

              <button type="submit" className="btn btn-primary w-full !py-3" disabled={busy}>
                {busy ? "Signing in…" : <><LogIn size={16} /> Login <ArrowRight size={16} /></>}
              </button>

              <div className="text-center text-sm text-[color:var(--text-muted)]">
                Don&apos;t have an account? <Link href="/register" className="text-blue-500 font-medium hover:underline">Register</Link>
              </div>
            </form>
          </div>

          <div className="mt-5 section-card !p-4">
            <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] font-semibold mb-2">Demo credentials</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => { const [u, p] = (r.demo ?? "").split(" / "); setIdentifier(u); setPassword(p); setRole(r.value); }}
                  className="text-left p-2.5 rounded-lg bg-[color:var(--bg-soft)] hover:bg-blue-500/10 border border-[color:var(--border)] hover:border-blue-500 transition"
                >
                  <div className="text-xs font-semibold">{r.label}</div>
                  <div className="text-[10px] text-[color:var(--text-muted)] font-mono">{r.demo}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[color:var(--text-muted)]">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
