import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const { schoolBranding, updateSchoolBranding } = useBranding();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    announcements: 23,
    events: 15,
    marketplaceItems: 45,
    messages: 156,
  });

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Welcome Back to School",
      content: "Welcome to the new academic year...",
      created: "2024-01-15",
      views: 892,
    },
    {
      id: 2,
      title: "Library Hours Update",
      content: "New library hours starting Monday...",
      created: "2024-01-14",
      views: 456,
    },
    {
      id: 3,
      title: "Sports Day Registration",
      content: "Register for the annual sports day...",
      created: "2024-01-13",
      views: 234,
    },
  ]);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Graduation Ceremony",
      date: "2024-06-15",
      attendees: 450,
      maxAttendees: 500,
    },
    {
      id: 2,
      title: "Science Fair",
      date: "2024-03-20",
      attendees: 120,
      maxAttendees: 200,
    },
    {
      id: 3,
      title: "Career Day",
      date: "2024-04-10",
      attendees: 89,
      maxAttendees: 150,
    },
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@school.edu",
      role: "student",
      status: "active",
      lastLogin: "2024-01-15",
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria@school.edu",
      role: "teacher",
      status: "active",
      lastLogin: "2024-01-14",
    },
    {
      id: 3,
      name: "John Smith",
      email: "john@school.edu",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15",
    },
  ]);

  const [marketplaceItems, setMarketplaceItems] = useState([
    {
      id: 1,
      title: "Calculus Textbook",
      seller: "Alex Johnson",
      price: 45,
      status: "active",
      category: "textbooks",
    },
    {
      id: 2,
      title: "Laptop Stand",
      seller: "Maria Garcia",
      price: 25,
      status: "sold",
      category: "electronics",
    },
    {
      id: 3,
      title: "Chemistry Lab Kit",
      seller: "John Smith",
      price: 80,
      status: "active",
      category: "supplies",
    },
  ]);

  const [schoolSettings, setSchoolSettings] = useState({
    name: schoolBranding.name || "UNICON University",
    primaryColor: schoolBranding.color || "#1a237e",
    logo: schoolBranding.logoData || null,
    plan: schoolBranding.plan || "Pro",
    domain: "school.edu",
    timezone: "UTC-5",
    language: "English",
  });

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = e.target.result;
        updateSchoolBranding({ logoData });
        setSchoolSettings((prev) => ({ ...prev, logo: logoData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSettingsUpdate = (field, value) => {
    setSchoolSettings((prev) => ({ ...prev, [field]: value }));
    if (field === "name" || field === "primaryColor" || field === "logo") {
      updateSchoolBranding({ [field]: value });
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "Dashboard" },
    { id: "announcements", label: "Announcements", icon: "Announce" },
    { id: "events", label: "Events", icon: "Calendar" },
    { id: "users", label: "Users", icon: "Users" },
    { id: "marketplace", label: "Marketplace", icon: "Store" },
    { id: "analytics", label: "Analytics", icon: "Chart" },
    { id: "settings", label: "Settings", icon: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="w-full px-6 lg:px-10">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              {schoolBranding.logoData ? (
                <img
                  src={schoolBranding.logoData}
                  alt={schoolBranding.name}
                  className="h-10 w-10 rounded-2xl border border-slate-200 bg-white/95 p-1 shadow-sm object-contain"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-white font-bold text-lg shadow-sm"
                  style={{ backgroundColor: schoolBranding.color }}
                >
                  U
                </div>
              )}
              <div>
                <h1
                  className="text-xl font-bold"
                  style={{ color: schoolBranding.color }}
                >
                  {schoolBranding.name} Admin
                </h1>
                <p className="text-sm text-slate-500">
                  Administrative Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-6 lg:px-10 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "text-white shadow-lg"
                      : "text-slate-600 hover:bg-white hover:shadow-sm"
                  }`}
                  style={{
                    backgroundColor:
                      activeTab === tab.id
                        ? schoolBranding.color
                        : "transparent",
                  }}
                >
                  <span className="text-sm font-medium">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Dashboard Overview
                  </h2>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Total Users
                          </p>
                          <p
                            className="text-3xl font-bold"
                            style={{ color: schoolBranding.color }}
                          >
                            {stats.totalUsers.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">
                            Users
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Active Users
                          </p>
                          <p
                            className="text-3xl font-bold"
                            style={{ color: schoolBranding.color }}
                          >
                            {stats.activeUsers.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-green-600">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Announcements
                          </p>
                          <p
                            className="text-3xl font-bold"
                            style={{ color: schoolBranding.color }}
                          >
                            {stats.announcements}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-purple-600">
                            Announce
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Events
                          </p>
                          <p
                            className="text-3xl font-bold"
                            style={{ color: schoolBranding.color }}
                          >
                            {stats.events}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-orange-600">
                            Events
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Marketplace Items
                          </p>
                          <p
                            className="text-3xl font-bold"
                            style={{ color: schoolBranding.color }}
                          >
                            {stats.marketplaceItems}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-yellow-600">
                            Store
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">
                            Messages
                          </p>
                          <p
                            className="text-3xl font-bold"
                            style={{ color: schoolBranding.color }}
                          >
                            {stats.messages}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-indigo-600">
                            Messages
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-semibold">
                            A
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">
                            New announcement published
                          </p>
                          <p className="text-xs text-slate-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm font-semibold">
                            U
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">
                            New user registered
                          </p>
                          <p className="text-xs text-slate-500">4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 text-sm font-semibold">
                            E
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">
                            Event created
                          </p>
                          <p className="text-xs text-slate-500">6 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Announcements Tab */}
            {activeTab === "announcements" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Announcements
                  </h2>
                  <button
                    className="px-4 py-2 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: schoolBranding.color }}
                  >
                    + Create Announcement
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Views
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {announcements.map((announcement) => (
                          <tr key={announcement.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-slate-900">
                                {announcement.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {announcement.created}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {announcement.views}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                Edit
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Events</h2>
                  <button
                    className="px-4 py-2 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: schoolBranding.color }}
                  >
                    + Create Event
                  </button>
                </div>

                <div className="grid gap-6">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-xl shadow-sm border p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {event.title}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Date: {event.date}
                          </p>
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full"
                                  style={{
                                    width: `${
                                      (event.attendees / event.maxAttendees) *
                                      100
                                    }%`,
                                    backgroundColor: schoolBranding.color,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-slate-600">
                                {event.attendees}/{event.maxAttendees}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-900 border border-blue-300 rounded-lg hover:bg-blue-50">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-sm text-red-600 hover:text-red-900 border border-red-300 rounded-lg hover:bg-red-50">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Users</h2>
                  <button
                    className="px-4 py-2 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: schoolBranding.color }}
                  >
                    + Add User
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Last Login
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-slate-900">
                                {user.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  user.role === "admin"
                                    ? "bg-red-100 text-red-800"
                                    : user.role === "teacher"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  user.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {user.lastLogin}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                Edit
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                Suspend
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Marketplace Tab */}
            {activeTab === "marketplace" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Marketplace
                  </h2>
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                      <option>All Categories</option>
                      <option>Textbooks</option>
                      <option>Electronics</option>
                      <option>Supplies</option>
                    </select>
                    <button
                      className="px-4 py-2 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                      style={{ backgroundColor: schoolBranding.color }}
                    >
                      Manage Items
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Seller
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {marketplaceItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-slate-900">
                                {item.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {item.seller}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              ${item.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {item.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  item.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                View
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      User Engagement
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Daily Active Users
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: schoolBranding.color }}
                        >
                          892
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Weekly Active Users
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: schoolBranding.color }}
                        >
                          1,156
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Monthly Active Users
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: schoolBranding.color }}
                        >
                          1,247
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Content Performance
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Announcement Views
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: schoolBranding.color }}
                        >
                          2,456
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Event RSVPs
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: schoolBranding.color }}
                        >
                          659
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Messages Sent
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: schoolBranding.color }}
                        >
                          1,234
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Growth Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        +12%
                      </div>
                      <div className="text-sm text-slate-600">User Growth</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        +8%
                      </div>
                      <div className="text-sm text-slate-600">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        +15%
                      </div>
                      <div className="text-sm text-slate-600">
                        Content Views
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  School Settings
                </h2>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">
                    Branding & Appearance
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          School Name
                        </label>
                        <input
                          type="text"
                          value={schoolSettings.name}
                          onChange={(e) =>
                            handleSettingsUpdate("name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={schoolSettings.primaryColor}
                            onChange={(e) =>
                              handleSettingsUpdate(
                                "primaryColor",
                                e.target.value
                              )
                            }
                            className="w-12 h-10 border border-slate-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={schoolSettings.primaryColor}
                            onChange={(e) =>
                              handleSettingsUpdate(
                                "primaryColor",
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          School Logo
                        </label>
                        <div className="flex items-center gap-4">
                          {schoolSettings.logo ? (
                            <img
                              src={schoolSettings.logo}
                              alt="School Logo"
                              className="w-16 h-16 rounded-lg object-contain border border-slate-300"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                              <span className="text-slate-400 text-sm">
                                No logo
                              </span>
                            </div>
                          )}
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                              id="logo-upload"
                            />
                            <label
                              htmlFor="logo-upload"
                              className="px-4 py-2 text-sm font-medium text-white rounded-lg cursor-pointer hover:shadow-lg transition-all"
                              style={{ backgroundColor: schoolBranding.color }}
                            >
                              Upload Logo
                            </label>
                            <p className="text-xs text-slate-500 mt-1">
                              PNG, JPG up to 2MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          School Domain
                        </label>
                        <input
                          type="text"
                          value={schoolSettings.domain}
                          onChange={(e) =>
                            handleSettingsUpdate("domain", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={schoolSettings.timezone}
                          onChange={(e) =>
                            handleSettingsUpdate("timezone", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="UTC-5">UTC-5 (Eastern)</option>
                          <option value="UTC-6">UTC-6 (Central)</option>
                          <option value="UTC-7">UTC-7 (Mountain)</option>
                          <option value="UTC-8">UTC-8 (Pacific)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Language
                        </label>
                        <select
                          value={schoolSettings.language}
                          onChange={(e) =>
                            handleSettingsUpdate("language", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">
                          Current Plan
                        </h4>
                        <p className="text-sm text-slate-500">
                          {schoolSettings.plan} Plan
                        </p>
                      </div>
                      <button
                        className="px-4 py-2 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                        style={{ backgroundColor: schoolBranding.color }}
                      >
                        Upgrade Plan
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Security Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">
                          Two-Factor Authentication
                        </h4>
                        <p className="text-sm text-slate-500">
                          Add an extra layer of security
                        </p>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">
                          Password Policy
                        </h4>
                        <p className="text-sm text-slate-500">
                          Configure password requirements
                        </p>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
