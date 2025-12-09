import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { adminApi } from "../../shared/utils/api";

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
  const { user, isAuthenticated } = useAuth();
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
      navigate("/admin-login");
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
            moderated: true 
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
    } catch (err) {
      alert("Failed to create event: " + err.message);
    }
  };

  const toggleModeration = async (id) => {
    try {
      const event = events.find((e) => e.id === id);
      await adminApi.updateEvent(id, { moderated: !event?.moderated });
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, moderated: !e.moderated } : e))
      );
    } catch (err) {
      alert("Failed to update event: " + err.message);
    }
  };

  const deleteEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await adminApi.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert("Failed to delete event: " + err.message);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
    >
      <header className="border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15 transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold">Events</h1>
              <p className="text-sm text-white/60">
                Schedule and manage events
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

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6 text-white">
        {loading && (
          <div className="text-center text-white/60 py-12">
            Loading events...
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-300 mb-6">
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
          <div className="grid gap-3 text-sm text-white/80 lg:grid-cols-3">
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
              value={form.date}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, date: e.target.value }))
              }
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
            />
            <input
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, time: e.target.value }))
              }
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
            />
            <input
              value={form.venue}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, venue: e.target.value }))
              }
              placeholder="Venue"
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
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
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
            />
            <select
              value={form.eventType}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, eventType: e.target.value }))
              }
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
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
            className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
          />
          <div className="mt-3 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={form.requiresRSVP}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, requiresRSVP: e.target.checked }))
                }
                className="rounded"
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
                  ? "text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
              style={
                filterType === type
                  ? {
                      background:
                        "linear-gradient(135deg, #6b21a8 0%, #581c87 100%)",
                    }
                  : { backgroundColor: "rgba(255,255,255,0.05)" }
              }
            >
              {type}
            </button>
          ))}
        </div>

        <SectionCard title="Event Management">
          <div className="space-y-3 text-sm text-white/80">
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
                className="rounded-2xl border border-white/10 bg-black/30 p-4 flex flex-wrap gap-3"
              >
                <div className="flex-1">
                  <p className="text-white font-semibold">{event.title}</p>
                  <p className="text-xs text-white/60">
                    {event.date} {event.time ? `• ${event.time}` : ""} • {event.venue}
                  </p>
                  {event.description && (
                    <p className="text-xs text-white/50 mt-1">
                      {event.description.slice(0, 100)}...
                    </p>
                  )}
                </div>
                <div className="ml-auto flex items-center gap-3 text-xs flex-wrap">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-white/60">
                      RSVP {event.rsvp}/{event.capacity}
                    </span>
                    <div className="w-24 h-1.5 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400"
                        style={{
                          width: `${Math.min((event.rsvp / event.capacity) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={event.moderated}
                      onChange={() => toggleModeration(event.id)}
                    />
                    <span>Moderation</span>
                  </label>
                  <button
                    onClick={() => {
                      // View attendees - would open a modal
                      alert(`Viewing ${event.rsvp} attendees for ${event.title}`);
                    }}
                    className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 transition"
                  >
                    View RSVPs
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition"
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

