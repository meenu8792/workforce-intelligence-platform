"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp, passwordStrength } from "@/lib/store";
import { Sparkles, User, Mail, Lock, Check, X as XIcon, ArrowRight, Eye, EyeOff, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const register = useApp((s) => s.register);
  const setOnboarded = useApp((s) => s.setOnboarded);
  const pushToast = useApp((s) => s.pushToast);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const strength = passwordStrength(password);
  const strengthColors: Record<number, string> = { 0: "bg-rose-500", 1: "bg-rose-500", 2: "bg-amber-500", 3: "bg-blue-500", 4: "bg-emerald-500", 5: "bg-emerald-500" };
  const strengthLabels: Record<number, string> = { 0: "—", 1: "Weak", 2: "Weak", 3: "Medium", 4: "Strong", 5: "Very Strong" };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    setTimeout(() => {
      const r = register({ username, email, password, confirmPassword: confirm });
      setBusy(false);
      if (!r.ok) {
        setError(r.error ?? "Registration failed");
        return;
      }
      setSuccess(true);
      pushToast({ message: "Registration successful! You can now log in.", type: "success" });
      setTimeout(() => router.push("/login"), 1200);
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
        <Link href="/login" onClick={() => setOnboarded(true)} className="btn btn-secondary !text-sm">
          <LogIn size={16} /> Sign in instead
        </Link>
      </nav>

      <div className="relative z-10 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="text-sm text-[color:var(--text-muted)] mt-1.5">Join the AI-powered workforce platform</p>
          </div>

          <div className="section-card !p-6 md:!p-8 animate-slide-up">
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3 animate-scale-in">
                  <Check size={28} className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold">Registration successful!</h3>
                <p className="text-sm text-[color:var(--text-muted)] mt-1.5">Redirecting you to the login page…</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="label">Username</label>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-10 rounded-lg bg-[color:var(--bg-soft)] border border-[color:var(--border)] flex items-center justify-center text-[color:var(--text-muted)] shrink-0">
                      <User size={15} />
                    </div>
                    <input className="input flex-1" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="label">Email ID</label>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-10 rounded-lg bg-[color:var(--bg-soft)] border border-[color:var(--border)] flex items-center justify-center text-[color:var(--text-muted)] shrink-0">
                      <Mail size={15} />
                    </div>
                    <input type="email" className="input flex-1" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="label">Create password</label>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-10 rounded-lg bg-[color:var(--bg-soft)] border border-[color:var(--border)] flex items-center justify-center text-[color:var(--text-muted)] shrink-0">
                      <Lock size={15} />
                    </div>
                    <input type={showPw ? "text" : "password"} className="input flex-1 pr-10" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="button" onClick={() => setShowPw((v) => !v)} className="-ml-9 p-1.5 text-[color:var(--text-muted)] hover:text-blue-500 shrink-0" aria-label="Toggle password visibility">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* strength bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-[color:var(--bg-soft)] overflow-hidden flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={cn("flex-1 rounded-full transition-all duration-300", i <= strength.score ? strengthColors[strength.score] : "bg-transparent")} />
                      ))}
                    </div>
                    <span className={cn("text-xs font-medium", strength.score <= 2 ? "text-rose-500" : strength.score === 3 ? "text-amber-500" : strength.score === 4 ? "text-blue-500" : "text-emerald-500")}>
                      {strengthLabels[strength.score]}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {[
                      { ok: strength.tests.length, label: "Minimum 8 characters" },
                      { ok: strength.tests.upper, label: "At least one uppercase letter" },
                      { ok: strength.tests.lower, label: "At least one lowercase letter" },
                      { ok: strength.tests.number, label: "At least one number" },
                      { ok: strength.tests.special, label: "At least one special character" },
                    ].map((t) => (
                      <div key={t.label} className={cn("flex items-center gap-1.5", t.ok ? "text-emerald-500" : "text-[color:var(--text-muted)]")}>
                        {t.ok ? <Check size={12} /> : <XIcon size={12} />}
                        <span>{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Confirm password</label>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-10 rounded-lg bg-[color:var(--bg-soft)] border border-[color:var(--border)] flex items-center justify-center text-[color:var(--text-muted)] shrink-0">
                      <Lock size={15} />
                    </div>
                    <input type={showPw ? "text" : "password"} className={cn("input flex-1", confirm && confirm !== password && "border-rose-500")} placeholder="Confirm your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                  </div>
                  {confirm && confirm !== password && (
                    <p className="text-xs text-rose-500 mt-1.5">Passwords do not match.</p>
                  )}
                </div>

                {error && (
                  <div className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 animate-fade-in">{error}</div>
                )}

                <button type="submit" className="btn btn-primary w-full !py-3" disabled={busy}>
                  {busy ? "Creating account…" : <>Register <ArrowRight size={16} /></>}
                </button>

                <div className="text-center text-sm text-[color:var(--text-muted)]">
                  Already have an account? <Link href="/login" className="text-blue-500 font-medium hover:underline">Sign in</Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
