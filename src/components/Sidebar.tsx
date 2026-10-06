"use client";

import { useState } from "react";
import { useApp, useCurrentUser } from "@/lib/store";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "./Header";
import {
  LayoutDashboard, Users, CalendarCheck, CalendarDays, FileClock, Wallet, BarChart3,
  Bell, Settings, LogOut, Sparkles, Briefcase, AlertTriangle, UserCog, ShieldCheck,
  Activity, Database, Brain, ClipboardList, LineChart, User, BookOpen, TrendingUp,
  Building2, Layers, FileBarChart, Network, BookUser, Eye,
} from "lucide-react";
import type { Role } from "@/lib/types";

type NavItem = { label: string; href: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge?: string };

const NAV: Record<Role, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Dataset Manager", href: "/admin/dataset", icon: Database },
    { label: "Employees", href: "/admin/employees", icon: Users },
    { label: "Users & Roles", href: "/admin/users", icon: UserCog },
    { label: "Departments", href: "/admin/departments", icon: Building2 },
    { label: "Workforce Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Talent Intelligence", href: "/admin/talent", icon: Brain },
    { label: "Workforce Planning", href: "/admin/forecast", icon: LineChart },
    { label: "System Health", href: "/admin/system", icon: Activity },
    { label: "Audit Logs", href: "/admin/audit", icon: ShieldCheck },
    { label: "Reports", href: "/admin/reports", icon: FileBarChart },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  hr: [
    { label: "Dashboard", href: "/hr", icon: LayoutDashboard },
    { label: "Employees", href: "/hr/employees", icon: Users },
    { label: "Attendance", href: "/hr/attendance", icon: CalendarCheck },
    { label: "Leave Management", href: "/hr/leave", icon: CalendarDays },
    { label: "Shift Management", href: "/hr/shifts", icon: Layers },
    { label: "Timesheets", href: "/hr/timesheets", icon: FileClock },
    { label: "Performance", href: "/hr/performance", icon: TrendingUp },
    { label: "Talent Intelligence", href: "/hr/talent", icon: Brain },
    { label: "Attrition Analytics", href: "/hr/attrition", icon: AlertTriangle },
    { label: "Workforce Planning", href: "/hr/forecast", icon: LineChart },
    { label: "HR Issues", href: "/hr/issues", icon: AlertTriangle },
    { label: "Reports", href: "/hr/reports", icon: FileBarChart },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  manager: [
    { label: "Dashboard", href: "/manager", icon: LayoutDashboard },
    { label: "My Team", href: "/manager/team", icon: Users },
    { label: "Team Attendance", href: "/manager/attendance", icon: CalendarCheck },
    { label: "Leave Approvals", href: "/manager/leave", icon: CalendarDays },
    { label: "Timesheets", href: "/manager/timesheets", icon: FileClock },
    { label: "Shifts", href: "/manager/shifts", icon: Layers },
    { label: "Performance", href: "/manager/performance", icon: TrendingUp },
    { label: "Resource Planning", href: "/manager/resources", icon: Briefcase },
    { label: "AI Team Insights", href: "/manager/insights", icon: Sparkles },
    { label: "Reports", href: "/manager/reports", icon: FileBarChart },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  employee: [
    { label: "Dashboard", href: "/employee", icon: LayoutDashboard },
    { label: "My Profile", href: "/employee/profile", icon: User },
    { label: "My Attendance", href: "/employee/attendance", icon: CalendarCheck },
    { label: "My Leave", href: "/employee/leave", icon: CalendarDays },
    { label: "My Shifts", href: "/employee/shifts", icon: Layers },
    { label: "My Timesheet", href: "/employee/timesheet", icon: FileClock },
    { label: "My Performance", href: "/employee/performance", icon: TrendingUp },
    { label: "My Skills", href: "/employee/skills", icon: BookOpen },
    { label: "My Learning", href: "/employee/learning", icon: BookUser },
    { label: "Career Growth", href: "/employee/career", icon: Sparkles },
    { label: "Salary & Payslips", href: "/employee/salary", icon: Wallet },
    { label: "Report Issue", href: "/employee/issues", icon: AlertTriangle },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
};

export function Sidebar({ onNavigate, mobileOpen = false }: { onNavigate?: () => void; mobileOpen?: boolean }) {
  const user = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();
  const logout = useApp((s) => s.logout);
  const items = user ? NAV[user.role] : [];

  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar transform transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        flex flex-col
      `}
    >
      <div className="h-16 px-5 flex items-center gap-2.5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
          <Sparkles size={18} />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold text-white">Nexora</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Workforce AI</div>
        </div>
      </div>

      <div className="px-3 py-3 border-b border-white/5">
        <div className="px-3 py-2 rounded-lg bg-white/5 text-xs">
          <div className="text-slate-400 mb-0.5">Logged in as</div>
          <div className="text-white font-semibold capitalize">{user?.role}</div>
          <div className="text-slate-500 text-[10px] truncate">{user?.email}</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {items.map((it) => {
          const active = pathname === it.href || (it.href !== "/admin" && it.href !== "/hr" && it.href !== "/manager" && it.href !== "/employee" && pathname.startsWith(it.href + "/")) || pathname === it.href;
          const Icon = it.icon;
          return (
            <button
              key={it.href}
              onClick={() => { router.push(it.href); onNavigate?.(); }}
              className={`sidebar-link w-full text-left ${active ? "active" : ""}`}
            >
              <Icon size={17} />
              <span className="flex-1">{it.label}</span>
              {it.badge && <span className="badge badge-info !text-[10px]">{it.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => { logout(); router.push("/login"); }}
          className="sidebar-link w-full text-left !text-rose-300 hover:!bg-rose-500/10"
        >
          <LogOut size={17} />
          <span>Sign out</span>
        </button>
        <div className="px-3 mt-3 text-[10px] text-slate-500">
          v1.0 · Centralized Workforce Data Engine
        </div>
      </div>
    </aside>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobile, setMobile] = useState(false);
  return (
    <div className="min-h-screen flex">
      <Sidebar mobileOpen={mobile} onNavigate={() => setMobile(false)} />
      {mobile && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobile(false)} />}
      <div className="flex-1 min-w-0 flex flex-col">
        <Header onMenu={() => setMobile((v) => !v)} />
        <main className="flex-1 px-4 md:px-6 py-6 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
