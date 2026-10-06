"use client";

import { useState } from "react";
import { useApp, useCurrentUser } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { User, Bell, Monitor, Shield, Lock, Sun, Moon, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { passwordStrength } from "@/lib/store";

export default function SettingsPage() {
  const [tab, setTab] = useState<"profile" | "theme" | "notifications" | "display" | "security">("profile");
  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Settings" description="Manage your account, preferences and security." icon={<Monitor size={16} />} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="section-card !p-3">
          {([
            { k: "profile", label: "Profile", icon: User },
            { k: "theme", label: "Theme", icon: Sun },
            { k: "notifications", label: "Notifications", icon: Bell },
            { k: "display", label: "Display", icon: Monitor },
            { k: "security", label: "Privacy & Security", icon: Shield },
          ] as const).map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={cn("w-full flex items-center gap-2.5 p-2.5 rounded-lg text-sm font-medium transition text-left", tab === t.k ? "bg-blue-500/10 text-blue-500" : "hover:bg-[color:var(--bg-soft)] text-[color:var(--text)]")}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          {tab === "profile" && <ProfileTab />}
          {tab === "theme" && <ThemeTab />}
          {tab === "notifications" && <NotificationsTab />}
          {tab === "display" && <DisplayTab />}
          {tab === "security" && <SecurityTab />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const user = useCurrentUser();
  const update = useApp((s) => s.updateProfile);
  const pushToast = useApp((s) => s.pushToast);
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  return (
    <div className="section-card space-y-4">
      <h3 className="font-semibold">Profile details</h3>
      <div>
        <label className="label">Username</label>
        <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="label">Role</label>
        <input className="input" value={user?.role ?? ""} disabled />
      </div>
      <div className="flex justify-end">
        <button onClick={() => update({ username, email })} className="btn btn-primary"><Save size={14} /> Save changes</button>
      </div>
    </div>
  );
}

function ThemeTab() {
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  return (
    <div className="section-card space-y-4">
      <h3 className="font-semibold">Theme</h3>
      <p className="text-sm text-[color:var(--text-muted)]">Choose your preferred appearance. The selection is saved across sessions.</p>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setTheme("light")} className={`p-4 rounded-xl border-2 transition text-left ${theme === "light" ? "border-blue-500 bg-blue-500/5" : "border-[color:var(--border)]"}`}>
          <div className="flex items-center gap-2 mb-2"><Sun size={18} className="text-amber-500" /><span className="font-semibold">Light Mode</span></div>
          <div className="h-20 rounded-lg bg-gradient-to-br from-white to-slate-100 border border-slate-200" />
        </button>
        <button onClick={() => setTheme("dark")} className={`p-4 rounded-xl border-2 transition text-left ${theme === "dark" ? "border-blue-500 bg-blue-500/5" : "border-[color:var(--border)]"}`}>
          <div className="flex items-center gap-2 mb-2"><Moon size={18} className="text-blue-400" /><span className="font-semibold">Dark Mode</span></div>
          <div className="h-20 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800" />
        </button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({ alerts: true, email: true, inApp: true, sound: false, push: false });
  return (
    <div className="section-card space-y-3">
      <h3 className="font-semibold">Notification preferences</h3>
      {([
        { k: "alerts", label: "In-app alerts", desc: "Show toast notifications in the dashboard." },
        { k: "email", label: "Email notifications", desc: "Receive key updates via email." },
        { k: "inApp", label: "In-app notifications", desc: "Updates appear in the notification center." },
        { k: "sound", label: "Sound effects", desc: "Play a sound for new notifications." },
        { k: "push", label: "Push notifications", desc: "Browser push (where supported)." },
      ] as const).map((s) => (
        <div key={s.k} className="flex items-center justify-between p-3 rounded-lg bg-[color:var(--bg-soft)]">
          <div>
            <div className="text-sm font-medium">{s.label}</div>
            <div className="text-xs text-[color:var(--text-muted)]">{s.desc}</div>
          </div>
          <button onClick={() => setSettings((p) => ({ ...p, [s.k]: !p[s.k] }))} className={cn("relative w-11 h-6 rounded-full transition", settings[s.k] ? "bg-blue-500" : "bg-[color:var(--border-strong)]")}>
            <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition", settings[s.k] ? "left-5" : "left-0.5")} />
          </button>
        </div>
      ))}
    </div>
  );
}

function DisplayTab() {
  const [density, setDensity] = useState<"compact" | "comfortable">("comfortable");
  const [dateFmt, setDateFmt] = useState("DD/MM/YYYY");
  return (
    <div className="section-card space-y-3">
      <h3 className="font-semibold">Display preferences</h3>
      <div>
        <label className="label">Layout density</label>
        <div className="grid grid-cols-2 gap-2">
          {(["comfortable", "compact"] as const).map((d) => (
            <button key={d} onClick={() => setDensity(d)} className={cn("p-3 rounded-lg border text-sm font-medium capitalize transition", density === d ? "border-blue-500 bg-blue-500/5 text-blue-500" : "border-[color:var(--border)]")}>{d}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">Date format</label>
        <select className="input" value={dateFmt} onChange={(e) => setDateFmt(e.target.value)}>
          <option>DD/MM/YYYY</option>
          <option>MM/DD/YYYY</option>
          <option>YYYY-MM-DD</option>
        </select>
      </div>
    </div>
  );
}

function SecurityTab() {
  const changePassword = useApp((s) => s.changePassword);
  const pushToast = useApp((s) => s.pushToast);
  const [oldP, setOldP] = useState("");
  const [newP, setNewP] = useState("");
  const [enable2FA, setEnable2FA] = useState(false);
  const strength = passwordStrength(newP);

  const submit = () => {
    const r = changePassword(oldP, newP);
    if (r.ok) {
      pushToast({ message: "Password changed successfully.", type: "success" });
      setOldP(""); setNewP("");
    } else {
      pushToast({ message: r.error ?? "Could not change password.", type: "error" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="section-card space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><Lock size={14} /> Change password</h3>
        <div>
          <label className="label">Current password</label>
          <input type="password" className="input" value={oldP} onChange={(e) => setOldP(e.target.value)} />
        </div>
        <div>
          <label className="label">New password</label>
          <input type="password" className="input" value={newP} onChange={(e) => setNewP(e.target.value)} />
          {newP && <div className="mt-2 text-xs flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-[color:var(--bg-soft)] overflow-hidden flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={cn("flex-1 rounded-full", i <= strength.score ? (strength.score <= 2 ? "bg-rose-500" : strength.score === 3 ? "bg-amber-500" : "bg-emerald-500") : "bg-transparent")} />
              ))}
            </div>
            <span className="font-medium">{strength.label}</span>
          </div>}
        </div>
        <div className="flex justify-end">
          <button onClick={submit} className="btn btn-primary"><Save size={14} /> Update password</button>
        </div>
      </div>

      <div className="section-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Two-factor authentication (2FA)</h3>
            <p className="text-xs text-[color:var(--text-muted)]">Add an extra layer of security to your account.</p>
          </div>
          <button onClick={() => setEnable2FA((v) => !v)} className={cn("relative w-11 h-6 rounded-full transition", enable2FA ? "bg-blue-500" : "bg-[color:var(--border-strong)]")}>
            <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition", enable2FA ? "left-5" : "left-0.5")} />
          </button>
        </div>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-2">Active sessions</h3>
        <div className="space-y-2">
          {[
            { device: "Chrome on macOS", location: "Bengaluru, IN", time: "Now" },
            { device: "Safari on iOS", location: "Bengaluru, IN", time: "2 hours ago" },
          ].map((s) => (
            <div key={s.device} className="flex items-center justify-between p-2.5 rounded-lg bg-[color:var(--bg-soft)] text-sm">
              <div>
                <div className="font-medium">{s.device}</div>
                <div className="text-[11px] text-[color:var(--text-muted)]">{s.location} · {s.time}</div>
              </div>
              <button className="text-xs text-rose-500 hover:underline">Sign out</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
