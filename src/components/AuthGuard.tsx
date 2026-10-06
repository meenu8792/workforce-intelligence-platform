"use client";

import { useApp, useCurrentUser } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ShieldAlert } from "lucide-react";

export function AuthGuard({ children, roles }: { children: ReactNode; roles?: ("admin" | "hr" | "manager" | "employee")[] }) {
  const user = useCurrentUser();
  const isAuth = useApp((s) => s.isAuthenticated);
  const router = useRouter();
  const path = usePathname();
  // Wait for Zustand persist to rehydrate before deciding where to send the user.
  // Without this, the very first render shows isAuthenticated=false (the default
  // state) and we immediately redirect to /login — kicking the user out the
  // instant they successfully sign in.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuth) {
      router.replace(`/login?from=${encodeURIComponent(path)}`);
    }
  }, [hydrated, isAuth, router, path]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
          <p className="mt-3 text-sm text-[color:var(--text-muted)]">Loading workspace…</p>
        </div>
      </div>
    );
  }

  if (!isAuth || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
          <p className="mt-3 text-sm text-[color:var(--text-muted)]">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="section-card max-w-md text-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-lg font-bold mb-1.5">Permission denied</h2>
          <p className="text-sm text-[color:var(--text-muted)]">You don&apos;t have permission to access this section. Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function TitleGuard({ children }: { children: ReactNode }) {
  const isAuth = useApp((s) => s.isAuthenticated);
  const hasOnboarded = useApp((s) => s.hasOnboarded);
  const router = useRouter();
  useEffect(() => {
    if (isAuth && !hasOnboarded) {
      // fine — landing page for authenticated user
    }
  }, [isAuth, hasOnboarded, router]);
  return <>{children}</>;
}
