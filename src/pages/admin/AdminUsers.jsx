import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminHeader from "../../apps/admin/components/AdminHeader";
import { adminApi } from "../../apps/shared/utils/api";
import { useToast } from "../../components/Toast";

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
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getUsers();
      setUsers(response.users || response.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.message || "Failed to load users");
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !userSearch ||
        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          u.status !== false &&
          u.status !== "suspended") ||
        (statusFilter === "suspended" &&
          (u.status === false || u.status === "suspended"));

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, userSearch, roleFilter, statusFilter]);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "active" || currentStatus === true ? false : true;
      await adminApi.updateUserStatus(userId, newStatus);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, status: newStatus ? "active" : "suspended" }
            : u
        )
      );
      showToast(
        `User ${newStatus ? "activated" : "suspended"} successfully`,
        "success"
      );
    } catch (err) {
      console.error("Failed to update user status:", err);
      showToast("Failed to update user status", "error");
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      showToast("User role updated successfully", "success");
    } catch (err) {
      console.error("Failed to update user role:", err);
      showToast("Failed to update user role", "error");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await adminApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setShowDeleteModal(null);
      showToast("User deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete user:", err);
      showToast("Failed to delete user", "error");
    }
  };

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      color: "text-white",
    },
    {
      label: "Active",
      value: users.filter((u) => u.status !== false && u.status !== "suspended")
        .length,
      color: "text-emerald-300",
    },
    {
      label: "Suspended",
      value: users.filter((u) => u.status === false || u.status === "suspended")
        .length,
      color: "text-red-300",
    },
    {
      label: "Students",
      value: users.filter((u) => u.role === "student").length,
      color: "text-blue-300",
    },
  ];

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
      >
        <AdminHeader title="People" description="User management" />
        <div className="text-center text-white/60 py-12">Loading users...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
    >
      <AdminHeader title="People" description="User management" />

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6 text-white">
        <SectionCard
          title="User Statistics"
          actions={
            <button
              onClick={() => alert("Bulk import feature coming soon")}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/60"
            >
              + Import Users
            </button>
          }
        >
          <div className="grid gap-4 text-sm sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                  {stat.label}
                </p>
                <p className={`mt-2 text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="User Management">
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                placeholder="Search by name or email…"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/40"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="staff">Staff</option>
                <option value="admin">Admins</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                {error}
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-6 border-b border-white/10 bg-black/30 px-4 py-3 text-xs font-semibold text-white/60">
                <span className="col-span-2">User</span>
                <span>Role</span>
                <span>Status</span>
                <span>Last Login</span>
                <span className="text-center">Actions</span>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="px-4 py-8 text-center text-white/60">
                    No users found
                  </div>
                ) : (
                  filteredUsers.map((u) => {
                    const isActive =
                      u.status !== false && u.status !== "suspended";
                    return (
                      <div
                        key={u.id}
                        className="grid grid-cols-6 items-center border-b border-white/5 bg-black/20 px-4 py-4 text-sm last:border-b-0 hover:bg-black/30 transition-colors"
                      >
                        <div className="col-span-2 flex items-center gap-3">
                          <div className="rounded-xl border border-white/10 bg-white/5 flex h-10 w-10 items-center justify-center text-xs font-bold">
                            {(u.name || u.email || "U")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {u.name ||
                                u.first_name + " " + u.last_name ||
                                "Unknown"}
                            </p>
                            <p className="text-xs text-white/50">{u.email}</p>
                          </div>
                        </div>
                        <select
                          value={u.role || "student"}
                          onChange={(e) => updateUserRole(u.id, e.target.value)}
                          className="rounded-xl border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-center text-xs font-semibold ${
                            isActive
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {isActive ? "active" : "suspended"}
                        </span>
                        <span className="text-xs text-white/60">
                          {u.last_login
                            ? new Date(u.last_login).toLocaleDateString()
                            : "Never"}
                        </span>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleUserStatus(u.id, u.status)}
                            className={`rounded-lg px-3 py-1 text-xs font-semibold transition hover:opacity-80 ${
                              isActive
                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {isActive ? "Suspend" : "Restore"}
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(u.id)}
                            className="rounded-lg border border-white/20 px-3 py-1 text-xs font-semibold text-red-300 hover:border-red-500/50 hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </SectionCard>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="rounded-3xl border border-white/20 bg-black/90 p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">
              Delete User
            </h3>
            <p className="text-white/80 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/40 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser(showDeleteModal)}
                className="flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
