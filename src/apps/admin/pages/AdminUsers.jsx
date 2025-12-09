import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { adminApi } from "../../shared/utils/api";
import { AdminLayout, AdminCard } from "../components/AdminLayout";

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

// Using AdminCard from AdminLayout

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // table or grid

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin-login");
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminApi.getUsers();
        const usersData = (result.users || []).map((u) => ({
          id: u.id,
          name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email,
          email: u.email,
          role: u.role || "student",
          status: u.is_active ? "active" : "suspended",
          lastLogin: u.last_login_at || "Never",
        }));
        setUsers(usersData);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Using demo data.");
        setUsers(defaultUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated, user, navigate]);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Search filter
    if (userSearch.trim()) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
          u.email.toLowerCase().includes(userSearch.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "All Roles") {
      filtered = filtered.filter((u) => u.role === roleFilter.toLowerCase());
    }

    // Status filter
    if (statusFilter !== "All Status") {
      filtered = filtered.filter((u) => u.status === statusFilter.toLowerCase());
    }

    return filtered;
  }, [users, userSearch, roleFilter, statusFilter]);

  const toggleUserStatus = async (id) => {
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return;

    const newStatus = targetUser.status === "active" ? 0 : 1;
    
    try {
      await adminApi.updateUserStatus(id, newStatus);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                status: u.status === "active" ? "suspended" : "active",
              }
            : u
        )
      );
    } catch (err) {
      alert("Failed to update user status: " + err.message);
    }
  };

  const deleteUser = async (id) => {
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return;

    if (!confirm(`Are you sure you want to delete ${targetUser.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminApi.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  };

  const updateUserRole = async (id, newRole) => {
    try {
      await adminApi.updateUserRole(id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert("Failed to update user role: " + err.message);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const bulkUpdateStatus = async (status) => {
    if (selectedUsers.length === 0) return;
    
    const newStatus = status === "active" ? 1 : 0;
    try {
      await Promise.all(
        selectedUsers.map((id) => adminApi.updateUserStatus(id, newStatus))
      );
      setUsers((prev) =>
        prev.map((u) =>
          selectedUsers.includes(u.id)
            ? { ...u, status: status === "active" ? "active" : "suspended" }
            : u
        )
      );
      setSelectedUsers([]);
      setShowBulkActions(false);
      alert(`Successfully updated ${selectedUsers.length} users`);
    } catch (err) {
      alert("Failed to update users: " + err.message);
    }
  };

  const bulkDeleteUsers = async () => {
    if (selectedUsers.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`)) {
      return;
    }

    try {
      await Promise.all(
        selectedUsers.map((id) => adminApi.deleteUser(id))
      );
      setUsers((prev) => prev.filter((u) => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
      setShowBulkActions(false);
      alert(`Successfully deleted ${selectedUsers.length} users`);
    } catch (err) {
      alert("Failed to delete users: " + err.message);
    }
  };

  const exportUsers = () => {
    const csv = [
      ["Name", "Email", "Role", "Status", "Last Login"].join(","),
      ...filteredUsers.map((u) =>
        [u.name, u.email, u.role, u.status, u.lastLogin].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout
      title="User Management"
      subtitle="Manage users and permissions"
    >
        {loading && (
          <div className="text-center text-slate-600 py-12">
            Loading users...
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-700 mb-6">
            {error}
          </div>
        )}
        <AdminCard
          title="User Management"
          actions={
            <div className="flex gap-2">
              <button
                onClick={exportUsers}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Export CSV
              </button>
            <button
              onClick={() => alert("Bulk import feature coming soon")}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              + Import Users
            </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              <input
                placeholder="Search by name or email…"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="flex-1 min-w-[200px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
              >
                <option>All Roles</option>
                <option>student</option>
                <option>teacher</option>
                <option>staff</option>
                <option>admin</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
              >
                <option>All Status</option>
                <option>active</option>
                <option>suspended</option>
              </select>
              <button
                onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                {viewMode === "table" ? "Grid" : "Table"}
              </button>
            </div>

            {selectedUsers.length > 0 && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length}
                    onChange={selectAllUsers}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-900">
                    {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => bulkUpdateStatus("active")}
                    className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition"
                  >
                    Activate All
                  </button>
                  <button
                    onClick={() => bulkUpdateStatus("suspended")}
                    className="rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-yellow-600 transition"
                  >
                    Suspend All
                  </button>
                  <button
                    onClick={bulkDeleteUsers}
                    className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition"
                  >
                    Delete All
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUsers([]);
                      setShowBulkActions(false);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={selectAllUsers}
                    className="rounded"
                  />
                </span>
                <span className="col-span-2">User</span>
                <span>Role</span>
                <span>Status</span>
                <span>Last Login</span>
                <span className="text-center">Actions</span>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12 text-slate-600">
                    No users found matching your filters
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="grid grid-cols-7 items-center border-b border-slate-100 bg-white px-4 py-4 text-sm last:border-b-0 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(u.id)}
                        onChange={() => toggleUserSelection(u.id)}
                        className="rounded"
                      />
                    </div>
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="rounded-xl border border-slate-200 bg-slate-100 flex h-10 w-10 items-center justify-center text-xs font-bold text-slate-700">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                    <select
                      value={u.role}
                      onChange={(e) => updateUserRole(u.id, e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-center text-xs font-semibold ${
                        u.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.status}
                    </span>
                    <span className="text-xs text-slate-600">{u.lastLogin}</span>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                          u.status === "active"
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-emerald-500 text-white hover:bg-emerald-600"
                        }`}
                      >
                        {u.status === "active" ? "Suspend" : "Restore"}
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="User Statistics">
          <div className="grid gap-4 text-sm sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Total Users
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {users.length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Active
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {users.filter((u) => u.status === "active").length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Suspended
              </p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {users.filter((u) => u.status === "suspended").length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Students
              </p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {users.filter((u) => u.role === "student").length}
              </p>
            </div>
          </div>
        </AdminCard>
    </AdminLayout>
  );
}

