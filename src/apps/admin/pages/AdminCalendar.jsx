import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { adminApi } from "../../shared/utils/api";
import { AdminLayout, AdminCard } from "../components/AdminLayout";
import GoogleCalendar from "../../shared/components/GoogleCalendar";

export default function AdminCalendar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    max_attendees: "",
    event_type: "academic",
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin-login");
      return;
    }

    fetchEvents();
  }, [isAuthenticated, user, navigate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminApi.getEvents();
      const eventsData = (result.events || []).map((event) => ({
        id: event.id,
        title: event.title,
        date: event.event_date?.split("T")[0] || event.event_date,
        time: event.event_date?.includes("T") 
          ? event.event_date.split("T")[1]?.substring(0, 5) 
          : "",
        type: event.event_type || "academic",
        description: event.description || "",
        location: event.location || "",
        maxAttendees: event.max_attendees || null,
        createdBy: event.created_by,
      }));
      setEvents(eventsData);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to load calendar events.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setForm({
        title: event.title,
        description: event.description || "",
        event_date: event.date + (event.time ? `T${event.time}` : ""),
        location: event.location || "",
        max_attendees: event.maxAttendees || "",
        event_type: event.type || "academic",
      });
    } else {
      setSelectedEvent(null);
      setForm({
        title: "",
        description: "",
        event_date: "",
        location: "",
        max_attendees: "",
        event_type: "academic",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setForm({
      title: "",
      description: "",
      event_date: "",
      location: "",
      max_attendees: "",
      event_type: "academic",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.event_date) {
      alert("Please fill in required fields (Title and Date)");
      return;
    }

    try {
      const eventData = {
        title: form.title,
        description: form.description,
        event_date: form.event_date,
        location: form.location,
        max_attendees: form.max_attendees ? parseInt(form.max_attendees) : null,
        event_type: form.event_type,
      };

      if (selectedEvent) {
        // Update existing event
        await adminApi.updateEvent(selectedEvent.id, eventData);
      } else {
        // Create new event
        await adminApi.createEvent(eventData);
      }

      await fetchEvents();
      handleCloseModal();
    } catch (err) {
      alert("Failed to save event: " + err.message);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event? This will remove it for all users.")) {
      return;
    }

    try {
      await adminApi.deleteEvent(eventId);
      await fetchEvents();
    } catch (err) {
      alert("Failed to delete event: " + err.message);
    }
  };

  // Transform events for GoogleCalendar component
  const calendarEvents = events.map((event) => ({
    id: `admin-${event.id}`,
    title: event.title,
    date: event.date,
    type: event.type,
    description: event.description,
    location: event.location,
  }));

  return (
    <AdminLayout
      title="Calendar Management"
      subtitle="Manage campus-wide calendar events visible to all users"
    >
      {loading && (
        <div className="text-center text-slate-600 py-12">
          Loading calendar events...
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-600">
            Events you create here will be visible to all students and users in the campus calendar.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
          >
            + Add Event
          </button>
        </div>

        {/* Calendar View */}
        <AdminCard title="Calendar View">
          <GoogleCalendar 
            events={calendarEvents} 
            googleCalSynced={true}
            adminEvents={calendarEvents}
          />
        </AdminCard>

        {/* Events List */}
        <AdminCard 
          title="All Events"
          actions={
            <button
              onClick={() => handleOpenModal()}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              + Add New
            </button>
          }
        >
          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="text-center py-12 text-slate-600">
                No events yet. Create your first campus event!
              </div>
            ) : (
              events
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {event.title}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              event.type === "academic"
                                ? "bg-blue-100 text-blue-700"
                                : event.type === "holiday"
                                ? "bg-purple-100 text-purple-700"
                                : event.type === "exam"
                                ? "bg-red-100 text-red-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {event.type}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-slate-600">
                          <p>
                            <span className="font-semibold">Date:</span>{" "}
                            {new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                            {event.time && ` at ${event.time}`}
                          </p>
                          {event.location && (
                            <p>
                              <span className="font-semibold">Location:</span> {event.location}
                            </p>
                          )}
                          {event.description && (
                            <p className="mt-2">{event.description}</p>
                          )}
                          {event.maxAttendees && (
                            <p>
                              <span className="font-semibold">Capacity:</span> {event.maxAttendees} attendees
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(event)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </AdminCard>
      </div>

      {/* Add/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl mx-4 rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-2xl backdrop-blur">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {selectedEvent ? "Edit Event" : "Create New Event"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                  placeholder="e.g., Midterm Exams, Spring Festival"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={form.event_date}
                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Event Type
                  </label>
                  <select
                    value={form.event_type}
                    onChange={(e) => setForm({ ...form, event_type: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                  >
                    <option value="academic">Academic</option>
                    <option value="holiday">Holiday</option>
                    <option value="exam">Exam</option>
                    <option value="social">Social</option>
                    <option value="sports">Sports</option>
                    <option value="cultural">Cultural</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                  placeholder="e.g., Main Auditorium, Campus Quad"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                  placeholder="Add event details, requirements, or additional information..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Maximum Attendees (optional)
                </label>
                <input
                  type="number"
                  value={form.max_attendees}
                  onChange={(e) => setForm({ ...form, max_attendees: e.target.value })}
                  min="1"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
                >
                  {selectedEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

