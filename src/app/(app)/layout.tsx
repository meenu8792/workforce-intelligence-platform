"use client";

import { AppLayout } from "@/components/Sidebar";
import { WorkforceCopilot } from "@/components/WorkforceCopilot";
import { AuthGuard } from "@/components/AuthGuard";
import { usePathname } from "next/navigation";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  // Settings has its own sub-layout (no sidebar) for some sub-pages? We keep sidebar everywhere for consistency.
  void path;
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
      <WorkforceCopilot />
    </AuthGuard>
  );
}
