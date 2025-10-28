import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

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
  const [events, setEvents] = useState(defaultEvents);
  const [form, setForm] = useState({
    title: "",
    date: "",
    venue: "",
    capacity: 100,
  });

  const addEvent = () => {
    if (!form.title || !form.date || !form.venue) return;
    setEvents((prev) => [
      { id: Date.now(), ...form, rsvp: 0, moderated: true },
      ...prev,
    ]);
    setForm({ title: "", date: "", venue: "", capacity: 100 });
  };

  const toggleModeration = (id) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, moderated: !e.moderated } : e))
    );
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
              onClick={() => navigate("/admin-dashboard")}
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
              value={form.date}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, date: e.target.value }))
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
                    {event.date} • {event.venue}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-3 text-xs">
                  <span className="text-white/60">
                    RSVP {event.rsvp}/{event.capacity}
                  </span>
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={event.moderated}
                      onChange={() => toggleModeration(event.id)}
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

