"use client";

import Link from "next/link";
import { Sparkles, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 network-bg">
      <div className="section-card max-w-md text-center animate-scale-in !p-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <Sparkles size={28} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-2">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex justify-center gap-2 mt-5">
          <Link href="/" className="btn btn-primary"><Home size={14} /> Home</Link>
          <Link href="/login" className="btn btn-secondary"><ArrowLeft size={14} /> Login</Link>
        </div>
      </div>
    </div>
  );
}
