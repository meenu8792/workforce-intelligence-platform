"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { SectionHeader, EmptyState } from "@/components/SectionHeader";
import { Avatar } from "@/components/Avatar";
import { UserCog, Plus, Search, Trash2, Shield } from "lucide-react";
import type { Role } from "@/lib/types";
import { randomId } from "@/lib/utils";
import { Modal } from "@/components/Modal";

export default function AdminUsersPage() {
  const users = useApp((s) => s.users);
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const pushToast = useApp((s) => s.pushToast);

  const filtered = users.filter((u) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return [u.username, u.email, u.role].some((s) => String(s).toLowerCase().includes(q));
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <SectionHeader title="Users & Roles" description="Manage user accounts, assign roles, and control platform access." icon={<UserCog size={16} />}
        action={<button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> New User</button>}
      />

      <div className="section-card !p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users..." className="input pl-9 !py-2 !text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((u) => (
          <div key={u.id} className="section-card !p-4">
            <div className="flex items-start gap-3">
              <Avatar name={u.username} size={42} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{u.username}</div>
                <div className="text-xs text-[color:var(--text-muted)] truncate">{u.email}</div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`badge ${u.role === "admin" ? "badge-purple" : u.role === "hr" ? "badge-info" : u.role === "manager" ? "badge-warning" : "badge-muted"}`}>
                    <Shield size={10} /> {u.role.toUpperCase()}
                  </span>
                  {u.employeeId && <span className="badge badge-muted">{u.employeeId}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-[color:var(--border)]">
              <button className="btn btn-ghost flex-1 !text-xs" onClick={() => pushToast({ message: "Reset password link sent to user.", type: "info" })}>Reset password</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create new user" size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => { pushToast({ message: "User account created. (Demo: a new account would be added to the store.)", type: "success" }); setShowAdd(false); }}>Create user</button>
          </>
        }
      >
        <NewUserForm />
      </Modal>
    </div>
  );
}

function NewUserForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("employee");
  return (
    <div className="space-y-3">
      <div><label className="label">Username</label><input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. anita.kapoor" /></div>
      <div><label className="label">Email</label><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="anita@nexora.com" /></div>
      <div><label className="label">Role</label>
        <select className="input" value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="hr">HR</option>
          <option value="admin">System Admin</option>
        </select>
      </div>
      <p className="text-xs text-[color:var(--text-muted)]">A temporary password will be generated and emailed to the user.</p>
    </div>
  );
}
