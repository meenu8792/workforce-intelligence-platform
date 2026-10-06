"use client";

import { useApp } from "@/lib/store";
import { SectionHeader } from "@/components/SectionHeader";
import { Server, Cpu, Database, Cloud, ShieldCheck, Activity, HardDrive, Wifi, RefreshCcw } from "lucide-react";

export default function SystemHealthPage() {
  const meta = useApp((s) => s.datasetMeta);
  const audit = useApp((s) => s.audit);

  const services = [
    { name: "Database (PostgreSQL)", status: "Operational", latency: "12ms", icon: Database, color: "emerald" },
    { name: "Authentication Service", status: "Operational", latency: "8ms", icon: ShieldCheck, color: "emerald" },
    { name: "AI Engine", status: "Ready", latency: "142ms", icon: Cpu, color: "blue" },
    { name: "File Storage", status: "Operational", latency: "23ms", icon: HardDrive, color: "emerald" },
    { name: "Notifications", status: "Operational", latency: "18ms", icon: Activity, color: "emerald" },
    { name: "Backup Service", status: "Last run 2h ago", latency: "—", icon: Cloud, color: "violet" },
    { name: "CDN", status: "Operational", latency: "31ms", icon: Wifi, color: "emerald" },
    { name: "Email Gateway", status: "Operational", latency: "210ms", icon: Server, color: "amber" },
  ];

  const integrations = [
    { name: "Biometric Devices", status: "Connected", count: 14 },
    { name: "Payroll Software", status: "Syncing", count: 1 },
    { name: "SAP ERP", status: "Connected", count: 1 },
    { name: "Microsoft Teams", status: "Connected", count: 1 },
    { name: "Slack", status: "Connected", count: 1 },
    { name: "Active Directory", status: "Connected", count: 1 },
    { name: "Oracle HRMS", status: "Disconnected", count: 0 },
    { name: "Google Workspace", status: "Connected", count: 1 },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="System Health" description="Real-time status of platform services, integrations and infrastructure." icon={<Server size={16} />} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="section-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Platform services</h3>
            <span className="badge badge-success"><span className="live-dot" /> All systems operational</span>
          </div>
          <div className="space-y-2">
            {services.map((s) => (
              <div key={s.name} className="flex items-center justify-between p-2.5 rounded-lg bg-[color:var(--bg-soft)]">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-md bg-${s.color}-500/10 text-${s.color}-500`}>
                    <s.icon size={14} />
                  </div>
                  <span className="text-sm font-medium">{s.name}</span>
                </div>
                <div className="text-xs text-right">
                  <div className="font-medium">{s.status}</div>
                  <div className="text-[color:var(--text-muted)]">{s.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="section-card">
            <h3 className="font-semibold mb-3">Integrations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {integrations.map((i) => (
                <div key={i.name} className="flex items-center justify-between p-2.5 rounded-lg bg-[color:var(--bg-soft)] text-sm">
                  <span className="font-medium">{i.name}</span>
                  <span className={`badge ${i.status === "Connected" ? "badge-success" : i.status === "Syncing" ? "badge-info" : "badge-muted"}`}>{i.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <h3 className="font-semibold mb-3">Last activity</h3>
            <div className="space-y-2 text-sm">
              {audit.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-start gap-2 p-2 rounded-lg bg-[color:var(--bg-soft)]">
                  <RefreshCcw size={14} className="mt-0.5 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{a.action}</div>
                    <div className="text-[10px] text-[color:var(--text-muted)]">{a.actor} · {new Date(a.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <h3 className="font-semibold mb-3">Storage</h3>
            <div className="text-sm space-y-2">
              <Row k="Dataset records" v={meta?.records.toLocaleString() ?? "—"} />
              <Row k="Active employees" v={(meta?.validRecords ?? 0).toLocaleString()} />
              <Row k="Last backup" v="2 hours ago" />
              <Row k="Storage used" v="312 MB" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[color:var(--text-muted)]">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
