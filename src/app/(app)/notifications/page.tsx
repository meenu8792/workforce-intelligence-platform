"use client";

import { useApp } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { Bell, Check } from "lucide-react";
import { formatDistanceToNow } from "@/lib/date";

export default function NotificationsPage() {
  const notifications = useApp((s) => s.notifications);
  const markAll = useApp((s) => s.markAllNotificationsRead);
  const markOne = useApp((s) => s.markNotificationRead);

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Notifications" description="All your platform notifications in one place." icon={<Bell size={16} />}
        action={<button onClick={markAll} className="btn btn-secondary !text-sm"><Check size={14} /> Mark all read</button>}
      />

      <div className="section-card !p-0">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-sm text-[color:var(--text-muted)]">You&apos;re all caught up.</div>
        ) : (
          <div className="divide-y divide-[color:var(--border)]">
            {notifications.map((n) => (
              <button key={n.id} onClick={() => markOne(n.id)} className={`w-full text-left p-4 flex items-start gap-3 transition ${n.read ? "opacity-70" : "bg-blue-500/[0.02]"}`}>
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? "bg-transparent" : "bg-blue-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{n.title}</div>
                  <div className="text-xs text-[color:var(--text-muted)] mt-0.5">{n.message}</div>
                  <div className="text-[10px] text-[color:var(--text-muted)] mt-1">{formatDistanceToNow(n.timestamp)}</div>
                </div>
                <span className={`badge ${n.type === "success" ? "badge-success" : n.type === "warning" ? "badge-warning" : n.type === "danger" ? "badge-danger" : "badge-info"}`}>{n.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
