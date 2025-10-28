import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const defaultUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@campus.edu",
    role: "student",
    status: "active",
    lastLogin: "2h ago",
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria@campus.edu",
    role: "teacher",
    status: "active",
    lastLogin: "35m ago",
  },
  {
    id: 3,
    name: "Prof. Smith",
    email: "smith@campus.edu",
    role: "staff",
    status: "suspended",
    lastLogin: "1d ago",
  },
  {
    id: 4,
    name: "Security Desk",
    email: "security@campus.edu",
    role: "admin",
    status: "active",
    lastLogin: "Online",
  },
];

function SectionCard({ title, children, actions }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.06] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-lg">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="ml-auto flex flex-wrap gap-2">{actions}</div>
      </div>
      {children}
    </div>
  );
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState(defaultUsers);
  const [userSearch, setUserSearch] = useState("");

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  const toggleUserStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "suspended" : "active",
            }
          : user
      )
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
    >
      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15 transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-sm text-white/60">
                Manage users and permissions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold">{user?.name}</p>
            <div className="h-8 w-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 text-white">
        <SectionCard
          title="User Management"
          actions={
            <button
              onClick={() => alert("Bulk import feature coming soon")}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/60"
            >
              + Import Users
            </button>
          }
        >
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                placeholder="Search by name or email…"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/40"
              />
              <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
                <option>All Roles</option>
                <option>Students</option>
                <option>Teachers</option>
                <option>Staff</option>
                <option>Admins</option>
              </select>
              <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
                <option>All Status</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-6 border-b border-white/10 bg-black/30 px-4 py-3 text-xs font-semibold text-white/60">
                <span className="col-span-2">User</span>
                <span>Role</span>
                <span>Status</span>
                <span>Last Login</span>
                <span className="text-center">Actions</span>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="grid grid-cols-6 items-center border-b border-white/5 bg-black/20 px-4 py-4 text-sm last:border-b-0 hover:bg-black/30 transition-colors"
                  >
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="rounded-xl border border-white/10 bg-white/5 flex h-10 w-10 items-center justify-center text-xs font-bold">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{u.name}</p>
                        <p className="text-xs text-white/50">{u.email}</p>
                      </div>
                    </div>
                    <select
                      value={u.role}
                      onChange={(e) =>
                        setUsers((prev) =>
                          prev.map((user) =>
                            user.id === u.id
                              ? { ...user, role: e.target.value }
                              : user
                          )
                        )
                      }
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-center text-xs font-semibold ${
                        u.status === "active"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {u.status}
                    </span>
                    <span className="text-xs text-white/60">{u.lastLogin}</span>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition hover:opacity-80 ${
                          u.status === "active"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {u.status === "active" ? "Suspend" : "Restore"}
                      </button>
                      <button
                        onClick={() =>
                          alert(`Delete user ${u.name}?`) &&
                          setUsers((prev) =>
                            prev.filter((user) => user.id !== u.id)
                          )
                        }
                        className="rounded-lg border border-white/20 px-3 py-1 text-xs font-semibold text-red-300 hover:border-red-500/50 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="User Statistics">
          <div className="grid gap-4 text-sm sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                Total Users
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {users.length}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                Active
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-300">
                {users.filter((u) => u.status === "active").length}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                Suspended
              </p>
              <p className="mt-2 text-2xl font-bold text-red-300">
                {users.filter((u) => u.status === "suspended").length}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                Students
              </p>
              <p className="mt-2 text-2xl font-bold text-blue-300">
                {users.filter((u) => u.role === "student").length}
              </p>
            </div>
          </div>
        </SectionCard>
      </main>
    </div>
  );
}

