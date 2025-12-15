import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminHeader from "../../apps/admin/components/AdminHeader";
import { adminApi } from "../../apps/shared/utils/api";
import { useToast } from "../../components/Toast";

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
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.06] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-lg">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="ml-auto flex flex-wrap gap-2">{actions}</div>
      </div>
      {children}
    </div>
  );
}

export default function AdminEvents() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: "",
    event_date: "",
    location: "",
    description: "",
    max_attendees: 100,
    is_public: true, // Admin can only create public events
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getEvents();
      const eventsData = response.events || response.data || [];
      setEvents(eventsData);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError(err.message || "Failed to load events");
      showToast("Failed to load events", "error");
      // Fallback to default events
      setEvents(defaultEvents);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async () => {
    if (!form.title || !form.event_date || !form.location) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    try {
      const response = await adminApi.createEvent({
        ...form,
        is_public: true, // Force public for admin-created events
      });

      const newEvent = {
        id: response.event?.id || response.id || Date.now(),
        title: form.title,
        date: form.event_date,
        venue: form.location,
        capacity: form.max_attendees,
        rsvp: 0,
        moderated: true,
      };

      setEvents([newEvent, ...events]);
      setForm({
        title: "",
        event_date: "",
        location: "",
        description: "",
        max_attendees: 100,
        is_public: true,
      });
      showToast("Event created successfully", "success");
      fetchEvents(); // Refresh events
    } catch (err) {
      console.error("Failed to create event:", err);
      showToast("Failed to create event", "error");
    }
  };

  const toggleModeration = async (id, currentModerated) => {
    try {
      await adminApi.updateEvent(id, { moderated: !currentModerated });
      setEvents((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, moderated: !currentModerated } : e
        )
      );
      showToast("Event moderation updated", "success");
    } catch (err) {
      console.error("Failed to update event moderation:", err);
      showToast("Failed to update event", "error");
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
      >
        <AdminHeader title="Events" description="Schedule and manage events" />
        <div className="text-center text-white/60 py-12">Loading events...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
    >
      <AdminHeader title="Events" description="Schedule and manage events" />

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6 text-white">
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}
        <SectionCard
          title="Schedule event"
          actions={
            <button
              onClick={addEvent}
              className="rounded-full px-4 py-2 text-sm font-semibold"
              style={{ backgroundColor: "#6b21a8" }}
            >
              Save event
            </button>
          }
        >
          <div className="grid gap-3 text-sm text-white/80 lg:grid-cols-4">
            <input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Event title"
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
            />
            <input
              type="date"
              value={form.event_date}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, event_date: e.target.value }))
              }
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
            />
            <input
              value={form.location}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Venue"
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
            />
            <input
              type="number"
              min={1}
              value={form.max_attendees}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  max_attendees: Number(e.target.value),
                }))
              }
              placeholder="Max attendees"
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
            />
          </div>
        </SectionCard>

        <SectionCard title="Event approvals">
          <div className="space-y-3 text-sm text-white/80">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 flex flex-wrap gap-3"
              >
                <div>
                  <p className="text-white font-semibold">{event.title}</p>
                  <p className="text-xs text-white/60">
                    {event.event_date || event.date} •{" "}
                    {event.location || event.venue || "TBA"}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-3 text-xs">
                  <span className="text-white/60">
                    RSVP {event.attendees_count || event.rsvp || 0}/
                    {event.max_attendees || event.capacity || 100}
                  </span>
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={event.moderated !== false}
                      onChange={() =>
                        toggleModeration(event.id, event.moderated !== false)
                      }
                    />
                    <span>Moderation</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </main>
    </div>
  );
}
