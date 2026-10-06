"use client";

import { useEffect, type ReactNode } from "react";
import { useApp } from "@/lib/store";

export function AppShell({ children }: { children: ReactNode }) {
  const theme = useApp((s) => s.theme);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);
  return <>{children}</>;
}
