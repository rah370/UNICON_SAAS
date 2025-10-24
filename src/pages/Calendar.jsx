import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

function Calendar() {
  const { user } = useAuth();
  const { branding } = useBranding();
  const [selectedSemester, setSelectedSemester] = useState("first");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const schoolCalendar = {
    institution: "UNICON University",
    academicYear: "2025-2026",
    semesters: {
      first: {
        name: "First Semester",
        period: "July 2025 - December 2025",
        weeks: 22,
        days: 154,
        events: [
          { date: "2025-07-17", title: "Enrollment", type: "enrollment" },
          { date: "2025-07-20", title: "Enrollment Ends", type: "enrollment" },
          { date: "2025-07-21", title: "Start of Classes", type: "academic" },
          {
            date: "2025-07-22",
            title: "Late Enrollment Ends",
            type: "enrollment",
          },
          { date: "2025-07-28", title: "Holiday", type: "holiday" },
          { date: "2025-09-15", title: "Midterm Examinations", type: "exam" },
          { date: "2025-09-22", title: "Midterm Examinations", type: "exam" },
          { date: "2025-09-29", title: "Midterm Examinations", type: "exam" },
          { date: "2025-10-06", title: "Midterm Examinations", type: "exam" },
          { date: "2025-10-13", title: "Midterm Examinations", type: "exam" },
          { date: "2025-10-20", title: "Midterm Examinations", type: "exam" },
          { date: "2025-10-27", title: "Midterm Examinations", type: "exam" },
          { date: "2025-11-01", title: "All Saints Day", type: "holiday" },
          { date: "2025-11-02", title: "All Souls Day", type: "holiday" },
          { date: "2025-11-30", title: "Bonifacio Day", type: "holiday" },
          { date: "2025-12-01", title: "Final Examination", type: "exam" },
          {
            date: "2025-12-08",
            title: "Submission of Final Grades",
            type: "academic",
          },
          {
            date: "2025-12-15",
            title: "Christmas Break Starts",
            type: "holiday",
          },
          { date: "2025-12-25", title: "Christmas Day", type: "holiday" },
          { date: "2025-12-30", title: "Rizal Day", type: "holiday" },
          { date: "2025-12-31", title: "New Year's Eve", type: "holiday" },
        ],
      },
      second: {
        name: "Second Semester",
        period: "January 2026 - May 2026",
        weeks: 20,
        days: 140,
        events: [
          { date: "2026-01-01", title: "New Year's Day", type: "holiday" },
          { date: "2026-01-05", title: "Start of Classes", type: "academic" },
          {
            date: "2026-01-06",
            title: "Late Enrollment Ends",
            type: "enrollment",
          },
          { date: "2026-02-10", title: "Chinese New Year", type: "holiday" },
          {
            date: "2026-02-24",
            title: "Cebu City Charter Day",
            type: "holiday",
          },
          {
            date: "2026-02-25",
            title: "EDSA Revolution Anniversary",
            type: "holiday",
          },
          { date: "2026-03-02", title: "Midterm Examinations", type: "exam" },
          { date: "2026-03-09", title: "Midterm Examinations", type: "exam" },
          { date: "2026-03-16", title: "Midterm Examinations", type: "exam" },
          { date: "2026-03-23", title: "Midterm Examinations", type: "exam" },
          { date: "2026-03-30", title: "Midterm Examinations", type: "exam" },
          { date: "2026-04-09", title: "Araw ng Kagitingan", type: "holiday" },
          { date: "2026-04-10", title: "Good Friday", type: "holiday" },
          { date: "2026-04-11", title: "Black Saturday", type: "holiday" },
          { date: "2026-04-12", title: "Easter Sunday", type: "holiday" },
          { date: "2026-05-01", title: "Labor Day", type: "holiday" },
          { date: "2026-05-11", title: "Final Examinations", type: "exam" },
          { date: "2026-05-18", title: "Final Examinations", type: "exam" },
          { date: "2026-05-25", title: "Final Examinations", type: "exam" },
          {
            date: "2026-05-30",
            title: "Submission of Final Grades",
            type: "academic",
          },
        ],
      },
    },
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const getEventTypeColor = (type) => {
    switch (type) {
      case "holiday":
        return "bg-red-100 text-red-800 border-red-200";
      case "exam":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "enrollment":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "academic":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "holiday":
        return "C";
      case "exam":
        return "P";
      case "enrollment":
        return "E";
      case "academic":
        return "G";
      default:
        return "E";
    }
  };

  const getEventsForMonth = (month, year) => {
    const semester = schoolCalendar.semesters[selectedSemester];
    return semester.events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
  };

  const formatMonthYear = (month, year) => {
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
    return `${months[month]} ${year}`;
  };

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const currentEvents = getEventsForMonth(selectedMonth, selectedYear);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            School Calendar
          </h1>
          <p className="text-slate-600">
            Stay updated with important dates and events
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              School Calendar
            </h2>
            <p className="text-slate-600">{schoolCalendar.institution}</p>
            <p className="text-sm text-slate-500">
              Academic Year {schoolCalendar.academicYear}
            </p>
          </div>

          {/* Semester Selector */}
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              {Object.entries(schoolCalendar.semesters).map(
                ([key, semester]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSemester(key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSemester === key
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {semester.name}
                  </button>
                )
              )}
            </div>
            <div className="text-sm text-slate-600">
              <strong>
                {schoolCalendar.semesters[selectedSemester].name}:
              </strong>{" "}
              {schoolCalendar.semesters[selectedSemester].period} (
              {schoolCalendar.semesters[selectedSemester].weeks} weeks,{" "}
              {schoolCalendar.semesters[selectedSemester].days} days)
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              ←
            </button>
            <h3 className="text-lg font-semibold">
              {formatMonthYear(selectedMonth, selectedYear)}
            </h3>
            <button
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-slate-500"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${selectedYear}-${String(
                selectedMonth + 1
              ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayEvents = currentEvents.filter(
                (event) => event.date === dateStr
              );
              const isToday =
                new Date().toDateString() ===
                new Date(selectedYear, selectedMonth, day).toDateString();

              return (
                <div
                  key={day}
                  className={`p-2 min-h-[60px] border border-slate-100 ${
                    isToday ? "bg-blue-50 border-blue-200" : "hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`text-sm font-medium ${
                      isToday ? "text-blue-700" : "text-slate-700"
                    }`}
                  >
                    {day}
                  </div>
                  {dayEvents.map((event, idx) => (
                    <div
                      key={idx}
                      className={`text-xs px-1 py-0.5 rounded mt-1 truncate ${getEventTypeColor(
                        event.type
                      )}`}
                      title={event.title}
                    >
                      {getEventIcon(event.type)} {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Legend:</h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-red-100 border border-red-200"></span>
                <span>Holiday</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-orange-100 border border-orange-200"></span>
                <span>Exam</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></span>
                <span>Enrollment</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-green-100 border border-green-200"></span>
                <span>Academic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
