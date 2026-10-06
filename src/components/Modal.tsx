"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, children, footer, size = "md" }: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onEsc); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal-content ${widths[size]}`} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[color:var(--bg-soft)]" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        )}
        <div>{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-2 pt-4 border-t border-[color:var(--border)]">{footer}</div>}
      </div>
    </div>
  );
}
