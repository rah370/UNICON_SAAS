import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useBranding } from "../../shared/contexts/BrandingContext";
import { useToast } from "../../shared/components/Toast";
import { studentApi } from "../../shared/utils/api";
import GoogleCalendar from "../../shared/components/GoogleCalendar";

const sampleAdminEvents = [
  {
    id: "campus-1",
    title: "Start of Classes",
    date: "2025-07-21",
    type: "academic",
    description: "Opening week for all colleges.",
  },
  {
    id: "campus-2",
    title: "Midterm Exams",
    date: "2025-09-15",
    type: "exam",
    description: "Centralized exam week.",
  },
  {
    id: "campus-3",
    title: "Bonifacio Day",
    date: "2025-11-30",
    type: "holiday",
    description: "Regular holiday – no classes.",
  },
];

const templatePersonalEvents = [
  {
    id: "personal-1",
    title: "Review for CS315",
    date: "2025-01-12",
    type: "personal",
    description: "Binary trees + graphs",
    status: "in_progress",
  },
  {
    id: "personal-2",
    title: "Club meetup",
    date: "2025-01-14",
    type: "personal",
    description: "Prep debate slides",
    status: "pending",
  },
];

function Calendar() {
  const { user, isAdmin } = useAuth();
  const { branding } = useBranding();
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState("school");
  const [googleCalSynced, setGoogleCalSynced] = useState(true);
  const [adminEvents, setAdminEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [personalEvents, setPersonalEvents] = useState([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [adminForm, setAdminForm] = useState({
    title: "",
    date: "",
    type: "academic",
    description: "",
  });
  const [personalForm, setPersonalForm] = useState({
    title: "",
    date: "",
    description: "",
  });

  const personalStorageKey = user
    ? `unicon-personal-${user?.id || user?.email || "default"}`
    : null;

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const result = await studentApi.getEvents();
        const formatted = (result.events || []).map((event) => ({
          id: event.id.toString(),
          title: event.title,
          date: event.event_date.split(" ")[0], // Extract date part
          type: event.type || "academic",
          description: event.description || "",
          location: event.location || "",
          maxAttendees: event.max_attendees,
          attendingCount: event.attending_count || 0,
          userRsvpStatus: event.user_rsvp_status,
        }));
        setAdminEvents(formatted);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        showError("Failed to load events. Using sample data.");
        setAdminEvents(sampleAdminEvents);
      } finally {
        setLoadingEvents(false);
      }
    };

    if (user) {
      fetchEvents();
    }
  }, [user, showError]);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      try {
        const result = await studentApi.getTasks();
        const formatted = (result.tasks || []).map((task) => ({
          id: task.id.toString(),
          title: task.title,
          date: task.due_date
            ? task.due_date.split(" ")[0]
            : new Date().toISOString().split("T")[0],
          type: "personal",
          description: task.description || "",
          status: task.is_completed
            ? "completed"
            : task.priority === "high"
            ? "in_progress"
            : "pending",
          priority: task.priority || "medium",
        }));
        setPersonalEvents(formatted);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        showError("Failed to load tasks. Using local storage.");
        // Fallback to localStorage
        if (personalStorageKey) {
          const cached = localStorage.getItem(personalStorageKey);
          if (cached) {
            setPersonalEvents(JSON.parse(cached));
          } else {
            setPersonalEvents(
              templatePersonalEvents.map((item) => ({ ...item }))
            );
          }
        }
      }
    };

    fetchTasks();
  }, [user, showError]);

  const upcomingSchoolEvents = useMemo(() => {
    const now = new Date();
    return adminEvents
      .map((event) => ({ ...event, dateObj: new Date(event.date) }))
      .filter((event) => event.dateObj >= now)
      .sort((a, b) => a.dateObj - b.dateObj)
      .slice(0, 5);
  }, [adminEvents]);

  const upcomingPersonal = useMemo(() => {
    const now = new Date();
    return personalEvents
      .map((event) => ({ ...event, dateObj: new Date(event.date) }))
      .filter((event) => event.dateObj >= now)
      .sort((a, b) => a.dateObj - b.dateObj)
      .slice(0, 5);
  }, [personalEvents]);

  const completionRate = useMemo(() => {
    if (!personalEvents.length) return 0;
    const completed = personalEvents.filter(
      (event) => event.status === "completed"
    ).length;
    return Math.round((completed / personalEvents.length) * 100);
  }, [personalEvents]);

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (!adminForm.title || !adminForm.date) return;
    setAdminEvents((prev) => [
      ...prev,
      { id: `admin-${Date.now()}`, ...adminForm },
    ]);
    setAdminForm({ title: "", date: "", type: "academic", description: "" });
    setShowAdminModal(false);
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    if (!personalForm.title || !personalForm.date) return;

    try {
      const result = await studentApi.createTask({
        title: personalForm.title,
        description: personalForm.description,
        due_date: personalForm.date,
        priority: "medium",
        category: "personal",
      });

      if (result.success) {
        // Refresh tasks
        const tasksResult = await studentApi.getTasks();
        const formatted = (tasksResult.tasks || []).map((task) => ({
          id: task.id.toString(),
          title: task.title,
          date: task.due_date
            ? task.due_date.split(" ")[0]
            : new Date().toISOString().split("T")[0],
          type: "personal",
          description: task.description || "",
          status: task.is_completed
            ? "completed"
            : task.priority === "high"
            ? "in_progress"
            : "pending",
          priority: task.priority || "medium",
        }));
        setPersonalEvents(formatted);
        success("Task created successfully!");
        setPersonalForm({ title: "", date: "", description: "" });
        setShowPersonalModal(false);
      }
    } catch (err) {
      console.error("Failed to create task:", err);
      showError("Failed to create task. Please try again.");
    }
  };

  const togglePersonalStatus = async (taskId) => {
    const task = personalEvents.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus =
      task.status === "completed"
        ? "pending"
        : task.status === "in_progress"
        ? "completed"
        : "in_progress";

    try {
      await studentApi.updateTask(taskId, {
        is_completed: newStatus === "completed",
        priority: newStatus === "in_progress" ? "high" : "medium",
      });

      // Update local state
      setPersonalEvents((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: newStatus,
              }
            : t
        )
      );
    } catch (err) {
      console.error("Failed to update task:", err);
      showError("Failed to update task. Please try again.");
    }
  };

  const deletePersonalEvent = async (taskId) => {
    try {
      await studentApi.deleteTask(taskId);
      setPersonalEvents((prev) => prev.filter((task) => task.id !== taskId));
      success("Task deleted successfully!");
    } catch (err) {
      console.error("Failed to delete task:", err);
      showError("Failed to delete task. Please try again.");
    }
  };

  const handleRSVP = async (eventId, status) => {
    try {
      const result = await studentApi.rsvpEvent(eventId, status);
      if (result.success) {
        // Update local state
        setAdminEvents((prev) =>
          prev.map((event) => {
            if (event.id === eventId) {
              const wasAttending = event.userRsvpStatus === "attending";
              const nowAttending = status === "attending";
              return {
                ...event,
                userRsvpStatus: status,
                attendingCount:
                  wasAttending && !nowAttending
                    ? Math.max(event.attendingCount - 1, 0)
                    : !wasAttending && nowAttending
                    ? event.attendingCount + 1
                    : event.attendingCount,
              };
            }
            return event;
          })
        );
        success(
          `RSVP updated: ${
            status === "attending"
              ? "Attending"
              : status === "maybe"
              ? "Maybe"
              : "Not attending"
          }`
        );
      }
    } catch (err) {
      console.error("Failed to RSVP:", err);
      showError("Failed to update RSVP. Please try again.");
    }
  };

  const greetingName =
    user?.first_name || user?.name?.split(" ")?.[0] || "there";

  return (
    <div className="min-h-screen bg-[#eef3f8] pb-16">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#0d1c24] text-white pb-24">
        <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/70">
                {branding?.name || "UNICON"} Schedule
              </p>
              <h1 className="text-3xl font-bold">
                Ready for the week, {greetingName}?
              </h1>
              <p className="text-sm text-white/80 max-w-2xl">
                School-wide events are synced with our Google Calendar. Add your
                private reminders without cluttering the campus feed.
              </p>
              <div className="flex flex-wrap gap-3">
                {isAdmin && (
                  <button
                    onClick={() => setShowAdminModal(true)}
                    className="rounded-2xl border border-white/40 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5"
                  >
                    + Post school schedule
                  </button>
                )}
                <button
                  onClick={() => setShowPersonalModal(true)}
                  className="rounded-2xl bg-[#708090]/20 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5"
                >
                  ✎ Add private task
                </button>
                <button
                  onClick={() => setGoogleCalSynced(true)}
                  className="rounded-2xl border border-white/30 px-4 py-2 text-sm font-semibold text-white/90 hover:text-white transition"
                >
                  {googleCalSynced
                    ? "✓ Google calendar live"
                    : "Sync Google calendar"}
                </button>
              </div>
            </div>
            <div className="grid flex-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                  School events
                </p>
                <p className="text-3xl font-bold">{adminEvents.length}</p>
                <p className="text-xs text-white/70">Visible to everyone</p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                  Private tasks
                </p>
                <p className="text-3xl font-bold">{personalEvents.length}</p>
                <p className="text-xs text-white/70">Only you can see</p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                  Personal progress
                </p>
                <p className="text-3xl font-bold">{completionRate}%</p>
                <p className="text-xs text-white/70">Completed this term</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-16 max-w-6xl px-4">
        <div className="rounded-3xl border border-white/80 bg-white/95 p-3 shadow-xl backdrop-blur">
          <div className="flex flex-wrap gap-2 p-1">
            {[
              { id: "school", label: "School schedule" },
              { id: "personal", label: "My planner" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[#708090] text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 flex max-w-6xl flex-col gap-6 px-4 lg:flex-row">
        {activeTab === "school" ? (
          <>
            <div className="flex-1 space-y-6">
              <div className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Google Calendar view
                  </h2>
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                    Campus wide
                  </span>
                </div>
                <div className="mt-4">
                  <GoogleCalendar
                    googleCalSynced={googleCalSynced}
                    adminEvents={adminEvents}
                    onEventSelect={setSelectedEvent}
                  />
                </div>
              </div>
            </div>
            <aside className="w-full lg:w-80 space-y-6">
              <div className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-lg">
                <h3 className="text-base font-semibold text-slate-900">
                  Upcoming school events
                </h3>
                <div className="mt-4 space-y-3">
                  {upcomingSchoolEvents.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No upcoming events. Check back later!
                    </p>
                  )}
                  {upcomingSchoolEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-slate-500">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setShowAdminModal(true)}
                    className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                  >
                    + Add campus event
                  </button>
                )}
              </div>
            </aside>
          </>
        ) : (
          <>
            <div className="flex-1 space-y-6">
              <div className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    My private tasks
                  </h2>
                  <button
                    onClick={() => setShowPersonalModal(true)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                  >
                    + Add
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {personalEvents.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No personal reminders yet.
                    </p>
                  )}
                  {personalEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {event.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(event.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-slate-500">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePersonalStatus(event.id)}
                          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                        >
                          {event.status || "pending"}
                        </button>
                        <button
                          onClick={() => deletePersonalEvent(event.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <aside className="w-full space-y-6 lg:w-80">
              <div className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-lg">
                <h3 className="text-base font-semibold text-slate-900">
                  Upcoming
                </h3>
                <div className="mt-4 space-y-3">
                  {upcomingPersonal.length === 0 && (
                    <p className="text-sm text-slate-500">
                      Nothing scheduled! 🎉
                    </p>
                  )}
                  {upcomingPersonal.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(event.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-lg">
                <h3 className="text-base font-semibold text-slate-900">
                  Progress
                </h3>
                <p className="text-3xl font-bold text-slate-900">
                  {completionRate}%
                </p>
                <p className="text-xs text-slate-500">Tasks completed</p>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#708090] transition-all"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            </aside>
          </>
        )}
      </section>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">
              {selectedEvent.title}
            </h3>
            <p className="text-sm text-slate-500">
              {new Date(selectedEvent.date).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            {selectedEvent.location && (
              <p className="text-sm text-slate-500 mt-1">
                📍 {selectedEvent.location}
              </p>
            )}
            {selectedEvent.maxAttendees && (
              <p className="text-sm text-slate-500 mt-1">
                {selectedEvent.attendingCount || 0}/{selectedEvent.maxAttendees}{" "}
                attending
              </p>
            )}
            <p className="mt-3 text-sm text-slate-700">
              {selectedEvent.description || "No description provided."}
            </p>
            {selectedEvent.id && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    handleRSVP(selectedEvent.id, "attending");
                    setSelectedEvent(null);
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    selectedEvent.userRsvpStatus === "attending"
                      ? "bg-emerald-500 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50"
                  }`}
                >
                  ✓ Going
                </button>
                <button
                  onClick={() => {
                    handleRSVP(selectedEvent.id, "maybe");
                    setSelectedEvent(null);
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    selectedEvent.userRsvpStatus === "maybe"
                      ? "bg-amber-500 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-amber-50"
                  }`}
                >
                  ? Maybe
                </button>
                <button
                  onClick={() => {
                    handleRSVP(selectedEvent.id, "not_attending");
                    setSelectedEvent(null);
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    selectedEvent.userRsvpStatus === "not_attending"
                      ? "bg-red-500 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-red-50"
                  }`}
                >
                  ✕ Can't
                </button>
              </div>
            )}
            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">
              New campus event
            </h3>
            <form onSubmit={handleAdminSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={adminForm.title}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, title: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                required
              />
              <input
                type="date"
                value={adminForm.date}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, date: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                required
              />
              <select
                value={adminForm.type}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, type: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              >
                <option value="academic">Academic</option>
                <option value="exam">Exam</option>
                <option value="holiday">Holiday</option>
                <option value="enrollment">Enrollment</option>
              </select>
              <textarea
                placeholder="Description"
                value={adminForm.description}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, description: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                rows={3}
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#708090] px-4 py-2 text-sm font-semibold text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPersonalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">
              Private reminder
            </h3>
            <form onSubmit={handlePersonalSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={personalForm.title}
                onChange={(e) =>
                  setPersonalForm({ ...personalForm, title: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                required
              />
              <input
                type="date"
                value={personalForm.date}
                onChange={(e) =>
                  setPersonalForm({ ...personalForm, date: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                required
              />
              <textarea
                placeholder="Notes"
                value={personalForm.description}
                onChange={(e) =>
                  setPersonalForm({
                    ...personalForm,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                rows={3}
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPersonalModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#708090] px-4 py-2 text-sm font-semibold text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
