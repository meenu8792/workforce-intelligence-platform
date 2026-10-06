"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/settings");
  }, [router]);
  return <div className="p-6 text-sm text-[color:var(--text-muted)]">Redirecting to settings…</div>;
}
