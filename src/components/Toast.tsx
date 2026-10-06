"use client";

import { useApp } from "@/lib/store";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

const ICONS = {
  success: <CheckCircle2 size={20} className="text-emerald-500" />,
  error: <XCircle size={20} className="text-rose-500" />,
  info: <Info size={20} className="text-blue-500" />,
  warning: <AlertTriangle size={20} className="text-amber-500" />,
};

export function ToastHost() {
  const toasts = useApp((s) => s.toasts);
  const dismiss = useApp((s) => s.dismissToast);
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <div className="mt-0.5">{ICONS[t.type]}</div>
          <div className="flex-1 min-w-0">
            {t.title && <div className="font-semibold mb-0.5">{t.title}</div>}
            <div className="opacity-90 leading-snug">{t.message}</div>
          </div>
          <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100 transition" aria-label="Close">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
