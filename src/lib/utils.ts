import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(n: number, compact = false) {
  if (compact) {
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
    if (n >= 1e3) return `₹${(n / 1e3).toFixed(1)}K`;
    return `₹${n}`;
  }
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}

export function formatPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

export function randomId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function isoDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

export function daysBetween(from: string, to: string) {
  const a = new Date(from).getTime();
  const b = new Date(to).getTime();
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}

export function isInRange(dateISO: string, from: string, to: string) {
  if (!dateISO) return false;
  return dateISO >= from && dateISO <= to;
}

export function clampPct(n: number) {
  return Math.max(0, Math.min(100, n));
}

export function pickAvatarColor(name: string) {
  const colors = [
    ["#3b82f6", "#06b6d4"],
    ["#8b5cf6", "#ec4899"],
    ["#10b981", "#3b82f6"],
    ["#f59e0b", "#ef4444"],
    ["#06b6d4", "#8b5cf6"],
    ["#ec4899", "#f59e0b"],
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return colors[h % colors.length];
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
