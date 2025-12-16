import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { adminApi } from "../../shared/utils/api";
import { useToast } from "../../shared/components/Toast";
import { exportEvents } from "../../shared/utils/exportUtils";
import { CardSkeleton } from "../../shared/components/SkeletonLoader";

const defaultEvents = [
  {
    id: 1,
    title: "Leadership Summit",
    date: "2024-11-18",
    venue: "Auditorium",
    capacity: 400,
    rsvp: 312,
    moderated: true,
  },
  {
    id: 2,
    title: "Winter Career Expo",
    date: "2024-12-02",
    venue: "Innovation Hall",
    capacity: 250,
    rsvp: 127,
    moderated: false,
  },
];

function SectionCard({ title, children, actions }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <div className="ml-auto flex flex-wrap gap-2">{actions}</div>
      </div>
      {children}
    </div>
  );
}

export default function AdminEvents() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, showError } = useToast();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    capacity: 100,
    description: "",
    eventType: "general",
    requiresRSVP: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const result = await adminApi.getEvents();
        const eventsData = (result.events || []).map((event) => ({
          id: event.id,
          title: event.title,
          date: event.event_date,
          venue: event.location || "TBA",
          capacity: event.max_attendees || 100,
          rsvp: event.attendees_count || 0,
          moderated: true,
        }));
        setEvents(eventsData);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events. Using demo data.");
        setEvents(defaultEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [isAuthenticated, user, navigate]);

  const addEvent = async () => {
    if (!form.title || !form.date || !form.venue) return;

    try {
      const eventDateTime = form.time
        ? `${form.date}T${form.time}:00`
        : `${form.date}T12:00:00`;

      const result = await adminApi.createEvent({
        title: form.title,
        event_date: eventDateTime,
        location: form.venue,
        max_attendees: form.capacity,
        description: form.description || "",
        event_type: form.eventType,
        requires_rsvp: form.requiresRSVP,
      });

      if (result.success) {
        setEvents((prev) => [
          {
            id: result.event_id,
            ...form,
            date: form.date,
            time: form.time,
            rsvp: 0,
            moderated: true,
          },
          ...prev,
        ]);
        setForm({
          title: "",
          date: "",
          time: "",
          venue: "",
          capacity: 100,
          description: "",
          eventType: "general",
          requiresRSVP: true,
        });
      }
      success("Event created successfully");
    } catch (err) {
      showError("Failed to create event: " + err.message);
    }
  };

  const toggleModeration = async (id) => {
    try {
      const event = events.find((e) => e.id === id);
      await adminApi.updateEvent(id, { moderated: !event?.moderated });
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, moderated: !e.moderated } : e))
      );
      success("Event updated successfully");
    } catch (err) {
      showError("Failed to update event: " + err.message);
    }
  };

  const deleteEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await adminApi.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      success("Event deleted successfully");
    } catch (err) {
      showError("Failed to delete event: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#eef3f7] to-[#dce7ef] text-slate-900">
      <header className="border-b border-white/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Events</h1>
              <p className="text-sm text-slate-500">
                Schedule and manage events
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            <div className="h-8 w-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-xs font-bold text-slate-700">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        {loading && (
          <div className="space-y-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
            {error}
          </div>
        )}
        <SectionCard
          title="Schedule event"
          actions={
            <button
              onClick={addEvent}
              className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow hover:from-blue-500 hover:to-blue-600"
            >
              Save event
            </button>
          }
        >
          <div className="grid gap-3 text-sm text-slate-800 lg:grid-cols-3">
            <input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Event title"
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, date: e.target.value }))
              }
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
            />
            <input
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, time: e.target.value }))
              }
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
            />
            <input
              value={form.venue}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, venue: e.target.value }))
              }
              placeholder="Venue"
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
            />
            <input
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  capacity: Number(e.target.value),
                }))
              }
              placeholder="Capacity"
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
            />
            <select
              value={form.eventType}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, eventType: e.target.value }))
              }
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
            >
              <option value="general">General</option>
              <option value="academic">Academic</option>
              <option value="social">Social</option>
              <option value="sports">Sports</option>
              <option value="cultural">Cultural</option>
            </select>
          </div>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Event description (optional)"
            rows={3}
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          />
          <div className="mt-3 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.requiresRSVP}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    requiresRSVP: e.target.checked,
                  }))
                }
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Requires RSVP</span>
            </label>
          </div>
        </SectionCard>

        <div className="flex gap-3 mb-4">
          {["all", "upcoming", "past"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${
                filterType === type
                  ? "text-white shadow"
                  : "text-slate-600 hover:text-slate-800"
              }`}
              style={
                filterType === type
                  ? {
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    }
                  : { backgroundColor: "rgba(148, 163, 184, 0.2)" }
              }
            >
              {type}
            </button>
          ))}
        </div>

        <SectionCard
          title="Event Management"
          actions={
            <button
              onClick={() => {
                try {
                  exportEvents(events);
                  success("Events exported successfully");
                } catch (err) {
                  showError("Failed to export: " + err.message);
                }
              }}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              Export CSV
            </button>
          }
        >
          <div className="space-y-3 text-sm text-slate-700">
            {events
              .filter((event) => {
                if (filterType === "all") return true;
                const eventDate = new Date(event.date);
                const today = new Date();
                if (filterType === "upcoming") return eventDate >= today;
                if (filterType === "past") return eventDate < today;
                return true;
              })
              .map((event) => (
                <div
                  key={event.id}
                  className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{event.title}</p>
                    <p className="text-xs text-slate-500">
                      {event.date} {event.time ? `• ${event.time}` : ""} •{" "}
                      {event.venue}
                    </p>
                    {event.description && (
                      <p className="mt-1 text-xs text-slate-500">
                        {event.description.slice(0, 100)}...
                      </p>
                    )}
                  </div>
                  <div className="ml-auto flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-slate-600">
                        RSVP {event.rsvp}/{event.capacity}
                      </span>
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full bg-emerald-500"
                          style={{
                            width: `${Math.min(
                              (event.rsvp / event.capacity) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={event.moderated}
                        onChange={() => toggleModeration(event.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-700">Moderation</span>
                    </label>
                    <button
                      onClick={() => {
                        // View attendees - would open a modal
                        success(
                          `Viewing ${event.rsvp} attendee${
                            event.rsvp !== 1 ? "s" : ""
                          } for ${event.title}`
                        );
                      }}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                    >
                      View RSVPs
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </SectionCard>
      </main>
    </div>
  );
}
