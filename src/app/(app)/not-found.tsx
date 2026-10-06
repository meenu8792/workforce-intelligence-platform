"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="section-card max-w-md text-center animate-scale-in !p-8">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-2">The page you&apos;re looking for doesn&apos;t exist.</p>
        <div className="flex justify-center gap-2 mt-5">
          <Link href="/" className="btn btn-primary"><Home size={14} /> Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
