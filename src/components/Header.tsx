"use client";

import { useState, useEffect, useRef } from "react";
import { useApp, useCurrentUser } from "@/lib/store";
import { Bell, Moon, Sun, Search, LogOut, Settings, User, ChevronDown, Menu, Sparkles } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Avatar } from "./Avatar";

export function Header({ onMenu }: { onMenu?: () => void }) {
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  const router = useRouter();
  const path = usePathname();
  const user = useCurrentUser();
  const logout = useApp((s) => s.logout);
  const notifications = useApp((s) => s.notifications);
  const markAll = useApp((s) => s.markAllNotificationsRead);
  const markOne = useApp((s) => s.markNotificationRead);

  const [openNotif, setOpenNotif] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    const t = () => setNow(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    t();
    const id = setInterval(t, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setOpenNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setOpenProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 sticky top-0 z-30 bg-[color:var(--bg-elev)] border-b border-[color:var(--border)] flex items-center px-4 gap-3">
      <button onClick={onMenu} className="md:hidden p-2 rounded-lg hover:bg-[color:var(--bg-soft)]" aria-label="Menu">
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
          <Sparkles size={18} />
        </div>
        <div className="hidden sm:block leading-tight">
          <div className="text-sm font-bold tracking-tight">Workforce Intelligence</div>
          <div className="text-[10px] uppercase tracking-wider text-[color:var(--text-muted)]">AI-Powered HR Platform</div>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-auto hidden md:block">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" />
          <input
            placeholder="Search employees, skills, departments..."
            className="input pl-9 !py-2 !text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.target as HTMLInputElement).value) {
                router.push(`/search?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
              }
            }}
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
          <span className="live-dot" /> Live · {now}
        </div>

        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-lg hover:bg-[color:var(--bg-soft)] transition"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setOpenNotif((v) => !v)}
            className="p-2 rounded-lg hover:bg-[color:var(--bg-soft)] transition relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-semibold">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
          {openNotif && (
            <div className="absolute right-0 mt-2 w-80 max-h-[480px] overflow-y-auto rounded-xl bg-[color:var(--bg-elev)] border border-[color:var(--border)] shadow-2xl animate-scale-in">
              <div className="flex items-center justify-between p-3 border-b border-[color:var(--border)]">
                <span className="font-semibold text-sm">Notifications</span>
                <button onClick={markAll} className="text-xs text-blue-500 hover:underline">Mark all read</button>
              </div>
              <div className="divide-y divide-[color:var(--border)]">
                {notifications.slice(0, 12).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markOne(n.id)}
                    className="w-full text-left p-3 hover:bg-[color:var(--bg-soft)] transition flex gap-3"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? "bg-transparent" : "bg-blue-500"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-[color:var(--text-muted)] line-clamp-2 mt-0.5">{n.message}</div>
                      <div className="text-[10px] text-[color:var(--text-muted)] mt-1">{new Date(n.timestamp).toLocaleString()}</div>
                    </div>
                  </button>
                ))}
                {notifications.length === 0 && (
                  <div className="p-6 text-center text-sm text-[color:var(--text-muted)]">No notifications yet</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setOpenProfile((v) => !v)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-[color:var(--bg-soft)] transition"
          >
            <Avatar name={user?.username ?? "?"} size={30} />
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-semibold capitalize">{user?.role} · {user?.username}</div>
              <div className="text-[10px] text-[color:var(--text-muted)]">{user?.email}</div>
            </div>
            <ChevronDown size={14} className="text-[color:var(--text-muted)]" />
          </button>
          {openProfile && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[color:var(--bg-elev)] border border-[color:var(--border)] shadow-2xl animate-scale-in overflow-hidden">
              <div className="p-3 border-b border-[color:var(--border)]">
                <div className="text-sm font-semibold capitalize">{user?.role}</div>
                <div className="text-xs text-[color:var(--text-muted)] truncate">{user?.email}</div>
              </div>
              <button onClick={() => { setOpenProfile(false); router.push("/settings"); }} className="w-full text-left px-3 py-2 text-sm hover:bg-[color:var(--bg-soft)] flex items-center gap-2">
                <Settings size={14} /> Settings
              </button>
              <button onClick={() => { setOpenProfile(false); router.push("/settings/profile"); }} className="w-full text-left px-3 py-2 text-sm hover:bg-[color:var(--bg-soft)] flex items-center gap-2">
                <User size={14} /> Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-rose-500/10 text-rose-500 flex items-center gap-2 border-t border-[color:var(--border)]"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
