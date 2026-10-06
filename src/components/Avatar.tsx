"use client";

import { initials, pickAvatarColor } from "@/lib/utils";

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const [c1, c2] = pickAvatarColor(name);
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold text-white shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
      }}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}
