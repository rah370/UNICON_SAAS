import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";
import GoogleCalendar from "../components/GoogleCalendar";
import { studentApi, adminApi } from "../apps/shared/utils/api";
import { useToast } from "../components/Toast";

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
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("school");
  const [googleCalSynced, setGoogleCalSynced] = useState(true);
  const [adminEvents, setAdminEvents] = useState([]);
  const [personalEvents, setPersonalEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [adminForm, setAdminForm] = useState({
    title: "",
    event_date: "",
    location: "",
    description: "",
    max_attendees: 100,
    is_public: true, // Admin can only create public events
    type: "academic", // Default event type
  });
  const [personalForm, setPersonalForm] = useState({
    title: "",
    event_date: "",
    description: "",
    is_public: false, // Students can only create private events
  });

  const personalStorageKey = user
    ? `unicon-personal-${user?.id || user?.email || "default"}`
    : null;

  useEffect(() => {
    fetchPublicEvents();
  }, []);

  const fetchPublicEvents = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getEvents();
      const events = response.events || response.data || [];
      // Filter only public events for school calendar
      const publicEvents = events.filter(
        (e) => e.is_public === true || e.is_public === 1
      );
      setAdminEvents(
        publicEvents.map((e) => ({
          id: e.id,
          title: e.title,
          date: e.event_date,
          type: e.category || "academic",
          description: e.description || "",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch public events:", err);
      // Fallback to cached events
      const cached = localStorage.getItem("uniconAdminSchedule");
      if (cached) {
        setAdminEvents(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!personalStorageKey) return;
    const cached = localStorage.getItem(personalStorageKey);
    if (cached) {
      setPersonalEvents(JSON.parse(cached));
      return;
    }
    const starter = templatePersonalEvents.map((item) => ({ ...item }));
    localStorage.setItem(personalStorageKey, JSON.stringify(starter));
    setPersonalEvents(starter);
  }, [personalStorageKey]);

  useEffect(() => {
    if (personalStorageKey) {
      localStorage.setItem(personalStorageKey, JSON.stringify(personalEvents));
    }
  }, [personalEvents, personalStorageKey]);

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

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminForm.title || !adminForm.event_date) {
      showToast("Please fill in title and date", "error");
      return;
    }

    // Only admin/moderator can create public events
    if (!isAdmin && user?.role !== "moderator") {
      showToast("Only admins and moderators can create public events", "error");
      return;
    }

    try {
      const response = await adminApi.createEvent({
        ...adminForm,
        is_public: true, // Force public for admin-created events
      });

      const newEvent = {
        id: response.event?.id || response.id || Date.now(),
        title: adminForm.title,
        date: adminForm.event_date,
        type: "academic",
        description: adminForm.description,
      };

      setAdminEvents((prev) => [newEvent, ...prev]);
      setAdminForm({
        title: "",
        event_date: "",
        location: "",
        description: "",
        max_attendees: 100,
        is_public: true,
      });
      setShowAdminModal(false);
      showToast("Public event created successfully", "success");
      fetchPublicEvents(); // Refresh events
    } catch (err) {
      console.error("Failed to create public event:", err);
      showToast("Failed to create public event", "error");
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    if (!personalForm.title || !personalForm.event_date) {
      showToast("Please fill in title and date", "error");
      return;
    }

    // Students can only create private events
    try {
      const response = await studentApi.getEvents(); // We'll need to add createEvent to studentApi
      // For now, store locally as private events
      const newEvent = {
        id: `personal-${Date.now()}`,
        title: personalForm.title,
        date: personalForm.event_date,
        type: "personal",
        description: personalForm.description,
        status: "pending",
        is_public: false, // Always private for students
      };

      setPersonalEvents((prev) => [newEvent, ...prev]);
      setPersonalForm({
        title: "",
        event_date: "",
        description: "",
        is_public: false,
      });
      setShowPersonalModal(false);
      showToast("Private event created successfully", "success");
    } catch (err) {
      console.error("Failed to create private event:", err);
      showToast("Failed to create private event", "error");
    }
  };

  const togglePersonalStatus = (taskId) => {
    setPersonalEvents((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status:
                task.status === "completed"
                  ? "pending"
                  : task.status === "in_progress"
                  ? "completed"
                  : "in_progress",
            }
          : task
      )
    );
  };

  const deletePersonalEvent = (taskId) => {
    setPersonalEvents((prev) => prev.filter((task) => task.id !== taskId));
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
                {(isAdmin || user?.role === "moderator") && (
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
                {(isAdmin || user?.role === "moderator") && (
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
            <p className="mt-3 text-sm text-slate-700">
              {selectedEvent.description || "No description provided."}
            </p>
            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
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
                value={adminForm.event_date}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, event_date: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                required
              />
              <input
                type="text"
                placeholder="Location (optional)"
                value={adminForm.location}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, location: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
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
                value={personalForm.event_date}
                onChange={(e) =>
                  setPersonalForm({
                    ...personalForm,
                    event_date: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                required
              />
              <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                Note: This is a private event visible only to you.
              </div>
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
