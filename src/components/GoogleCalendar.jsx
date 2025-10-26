import React, { useState, useEffect } from "react";

function GoogleCalendar({ onEventSelect, googleCalSynced, adminEvents = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState("month"); // month, week, day
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState([]);

  // Simulate Google Calendar events
  useEffect(() => {
    if (googleCalSynced) {
      setEvents(adminEvents);
    }
  }, [googleCalSynced, adminEvents]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getEventColor = (event) => {
    const colorMap = {
      exam: "bg-red-500",
      holiday: "bg-green-500",
      enrollment: "bg-blue-500",
      academic: "bg-purple-500",
      assignment: "bg-orange-500",
      personal: "bg-indigo-500",
    };
    return colorMap[event.type] || "bg-slate-500";
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentMonth(new Date().getMonth())}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Today
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 min-w-[140px]">
            {months[currentMonth]} {currentYear}
          </h2>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              view === "month"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              view === "week"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView("day")}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              view === "day"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden">
        {/* Day Headers */}
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="bg-slate-50 p-2 text-center text-xs font-semibold text-slate-600"
          >
            {day}
          </div>
        ))}

        {/* Calendar Cells */}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="bg-white h-24"></div>;
          }

          const date = new Date(currentYear, currentMonth, day);
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected =
            selectedDate && date.toDateString() === selectedDate.toDateString();
          const dayEvents = getEventsForDate(date);

          return (
            <div
              key={day}
              className={`bg-white min-h-[96px] p-1 cursor-pointer hover:bg-slate-50 transition-colors ${
                isToday ? "bg-blue-50" : ""
              } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => setSelectedDate(date)}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isToday ? "text-blue-600" : "text-slate-900"
                }`}
              >
                {day}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event, idx) => (
                  <div
                    key={idx}
                    className={`${getEventColor(
                      event
                    )} text-white text-xs px-2 py-0.5 rounded truncate`}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-slate-500">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Details Modal */}
      {selectedDate && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedDate(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <div className="space-y-2">
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-slate-500 text-sm">No events scheduled</p>
              ) : (
                getEventsForDate(selectedDate).map((event, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <div
                      className={`${getEventColor(event)} w-1 h-full rounded`}
                    ></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-sm text-slate-600 mt-1">
                          {event.description}
                        </p>
                      )}
                      {event.time && (
                        <p className="text-xs text-slate-500 mt-1">
                          {event.time}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setShowEventModal(true);
                  setSelectedDate(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Add Event
              </button>
              <button
                onClick={() => setSelectedDate(null)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoogleCalendar;
