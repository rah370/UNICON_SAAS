import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminHeader from "../../apps/admin/components/AdminHeader";
import { adminApi } from "../../apps/shared/utils/api";
import { useToast } from "../../components/Toast";
import GoogleCalendar from "../../components/GoogleCalendar";

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

export default function AdminCalendar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!eventForm.title || !eventForm.event_date) {
      showToast("Please fill in title and date", "error");
      return;
    }

    try {
      const response = await adminApi.createEvent({
        ...eventForm,
        is_public: true, // Force public for admin-created events
      });

      const newEvent = {
        id: response.event?.id || response.id || Date.now(),
        ...eventForm,
        attendees_count: 0,
        moderated: true,
      };

      setEvents([newEvent, ...events]);
      setEventForm({
        title: "",
        event_date: "",
        location: "",
        description: "",
        max_attendees: 100,
        is_public: true,
      });
      setShowEventModal(false);
      showToast("Event created successfully", "success");
    } catch (err) {
      console.error("Failed to create event:", err);
      showToast("Failed to create event", "error");
    }
  };

  const handleUpdateEvent = async (eventId, updates) => {
    try {
      await adminApi.updateEvent(eventId, updates);
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, ...updates } : e))
      );
      showToast("Event updated successfully", "success");
    } catch (err) {
      console.error("Failed to update event:", err);
      showToast("Failed to update event", "error");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await adminApi.deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      showToast("Event deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete event:", err);
      showToast("Failed to delete event", "error");
    }
  };

  const toggleModeration = (eventId, currentModerated) => {
    handleUpdateEvent(eventId, { moderated: !currentModerated });
  };

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return events
      .filter((e) => e.event_date >= today)
      .sort((a, b) => a.event_date.localeCompare(b.event_date))
      .slice(0, 5);
  }, [events]);

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
      >
        <AdminHeader title="Calendar" description="Manage school events" />
        <div className="text-center text-white/60 py-12">Loading events...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
    >
      <AdminHeader title="Calendar" description="Manage school events" />

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6 text-white">
        <SectionCard
          title="Create Public Event"
          actions={
            <button
              onClick={() => setShowEventModal(true)}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: "#6b21a8" }}
            >
              + New Event
            </button>
          }
        >
          <div className="text-sm text-white/80">
            <p className="mb-4">
              As an admin, you can create public school events that will be
              visible to all students.
            </p>
            <GoogleCalendar />
          </div>
        </SectionCard>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        <SectionCard title="Upcoming Events">
          <div className="space-y-3 text-sm text-white/80">
            {upcomingEvents.length === 0 ? (
              <div className="text-center text-white/60 py-8">
                No upcoming events
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 flex flex-wrap gap-3"
                >
                  <div className="flex-1">
                    <p className="text-white font-semibold">{event.title}</p>
                    <p className="text-xs text-white/60">
                      {event.event_date} • {event.location || "TBA"}
                    </p>
                    {event.description && (
                      <p className="text-xs text-white/50 mt-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-auto flex items-center gap-3 text-xs">
                    <span className="text-white/60">
                      RSVP {event.attendees_count || 0}/
                      {event.max_attendees || 100}
                    </span>
                    <label className="inline-flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={event.moderated !== false}
                        onChange={() =>
                          toggleModeration(event.id, event.moderated !== false)
                        }
                        className="rounded"
                      />
                      <span>Moderation</span>
                    </label>
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setEventForm({
                          title: event.title,
                          event_date: event.event_date,
                          location: event.location || "",
                          description: event.description || "",
                          max_attendees: event.max_attendees || 100,
                          is_public: true,
                        });
                        setShowEventModal(true);
                      }}
                      className="rounded-xl border border-white/20 px-3 py-1 text-white/80 hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete event "${event.title}"? This cannot be undone.`
                          )
                        ) {
                          handleDeleteEvent(event.id);
                        }
                      }}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1 text-red-300 hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard title="All Events">
          <div className="space-y-3 text-sm text-white/80">
            {events.length === 0 ? (
              <div className="text-center text-white/60 py-8">No events</div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 flex flex-wrap gap-3"
                >
                  <div className="flex-1">
                    <p className="text-white font-semibold">{event.title}</p>
                    <p className="text-xs text-white/60">
                      {event.event_date} • {event.location || "TBA"}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-xs">
                    <span
                      className={`rounded-full px-3 py-1 ${
                        event.is_public
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {event.is_public ? "Public" : "Private"}
                    </span>
                    <span className="text-white/60">
                      {event.attendees_count || 0} attendees
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </main>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="rounded-3xl border border-white/20 bg-black/90 p-6 max-w-2xl w-full">
            <h3 className="text-lg font-semibold text-white mb-4">
              {selectedEvent ? "Edit Event" : "Create Public Event"}
            </h3>
            <div className="space-y-4">
              <input
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Event title"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
              />
              <input
                type="date"
                value={eventForm.event_date}
                onChange={(e) =>
                  setEventForm((prev) => ({
                    ...prev,
                    event_date: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
              />
              <input
                value={eventForm.location}
                onChange={(e) =>
                  setEventForm((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                placeholder="Location/Venue"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
              />
              <textarea
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Description"
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
              />
              <input
                type="number"
                min={1}
                value={eventForm.max_attendees}
                onChange={(e) =>
                  setEventForm((prev) => ({
                    ...prev,
                    max_attendees: Number(e.target.value),
                  }))
                }
                placeholder="Max attendees"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
              />
              <div className="flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={eventForm.is_public}
                  disabled
                  className="rounded"
                />
                <span>Public event (visible to all students)</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                  setEventForm({
                    title: "",
                    event_date: "",
                    location: "",
                    description: "",
                    max_attendees: 100,
                    is_public: true,
                  });
                }}
                className="flex-1 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/40 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedEvent) {
                    handleUpdateEvent(selectedEvent.id, eventForm);
                    setShowEventModal(false);
                    setSelectedEvent(null);
                  } else {
                    handleCreateEvent();
                  }
                }}
                className="flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: "#6b21a8" }}
              >
                {selectedEvent ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
