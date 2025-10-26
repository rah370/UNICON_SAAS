import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";
import GoogleCalendar from "../components/GoogleCalendar";

function Calendar() {
  const { user } = useAuth();
  const { branding } = useBranding();
  const [selectedSemester, setSelectedSemester] = useState("first");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [personalTasks, setPersonalTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    type: "personal",
  });
  const [filterType, setFilterType] = useState("all"); // all, academic, personal, assignments
  const [isDashboardCollapsed, setIsDashboardCollapsed] = useState(true);
  const [calendarView, setCalendarView] = useState("month"); // month, week, day
  const [editingTask, setEditingTask] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [adminEvents, setAdminEvents] = useState([]);
  const [googleCalSynced, setGoogleCalSynced] = useState(false);

  // Google Calendar sync function
  const handleGoogleCalendarSync = async () => {
    try {
      // TODO: Implement actual Google Calendar API integration
      // For now, simulate fetching admin events
      const mockAdminEvents = [
        {
          id: "e1",
          title: "Midterm Exams",
          date: "2025-01-15",
          type: "exam",
          isAdminEvent: true,
          description: "Midterm examinations for all courses",
        },
        {
          id: "e2",
          title: "Spring Break",
          date: "2025-02-10",
          type: "holiday",
          isAdminEvent: true,
          description: "Spring break - no classes",
        },
        {
          id: "e3",
          title: "Course Registration Opens",
          date: "2025-03-01",
          type: "enrollment",
          isAdminEvent: true,
          description: "Fall semester course registration begins",
        },
      ];

      setAdminEvents(mockAdminEvents);
      setGoogleCalSynced(true);
      alert("Google Calendar synced successfully!");
    } catch (error) {
      console.error("Error syncing Google Calendar:", error);
      alert("Failed to sync Google Calendar");
    }
  };

  // Delete assignment function
  const deleteAssignment = (assignmentId) => {
    setAssignments((prev) =>
      prev.filter((assignment) => assignment.id !== assignmentId)
    );
  };

  // Delete personal task function
  const deletePersonalTask = (taskId) => {
    setPersonalTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  // Edit task function
  const editTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate,
      priority: task.priority || "medium",
      type: task.course ? "assignment" : "personal",
    });
    setShowTaskModal(true);
  };

  // Update task function
  const updateTask = () => {
    if (editingTask) {
      if (editingTask.course) {
        // Update assignment
        setAssignments((prev) =>
          prev.map((assignment) =>
            assignment.id === editingTask.id
              ? { ...assignment, ...newTask, dueDate: newTask.dueDate }
              : assignment
          )
        );
      } else {
        // Update personal task
        setPersonalTasks((prev) =>
          prev.map((task) =>
            task.id === editingTask.id
              ? { ...task, ...newTask, dueDate: newTask.dueDate }
              : task
          )
        );
      }
    }
    setEditingTask(null);
    setShowTaskModal(false);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      type: "personal",
    });
  };

  // Toggle task status
  const toggleTaskStatus = (taskId, isAssignment = false) => {
    const statusMap = {
      pending: "in_progress",
      in_progress: "completed",
      completed: "pending",
    };

    if (isAssignment) {
      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === taskId
            ? {
                ...assignment,
                status: statusMap[assignment.status] || "pending",
              }
            : assignment
        )
      );
    } else {
      setPersonalTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, status: statusMap[task.status] || "pending" }
            : task
        )
      );
    }
  };

  // Calendar utility functions
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return [...assignments, ...personalTasks].filter(
      (task) => task.dueDate === dateStr
    );
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Enhanced sample data
  const sampleAssignments = [
    {
      id: "a1",
      title: "Data Structures Project",
      course: "CS315",
      description: "Implement binary search tree with traversal methods",
      dueDate: "2025-01-15",
      priority: "high",
      status: "pending",
      estimatedHours: 8,
      attachments: ["project_requirements.pdf"],
      professor: "Prof. Sarah Johnson",
    },
    {
      id: "a2",
      title: "Calculus Problem Set 5",
      course: "MATH201",
      description: "Solve integration problems chapters 7-8",
      dueDate: "2025-01-18",
      priority: "medium",
      status: "in_progress",
      estimatedHours: 4,
      attachments: ["problem_set_5.pdf"],
      professor: "Dr. Michael Chen",
    },
    {
      id: "a3",
      title: "Literature Essay",
      course: "ENG101",
      description: "Write 1500-word essay on modern poetry",
      dueDate: "2025-01-20",
      priority: "medium",
      status: "pending",
      estimatedHours: 6,
      attachments: ["essay_guidelines.pdf"],
      professor: "Dr. Emily Rodriguez",
    },
  ];

  const samplePersonalTasks = [
    {
      id: "t1",
      title: "Study for CS315 Midterm",
      description: "Review binary trees and sorting algorithms",
      dueDate: "2025-01-12",
      priority: "high",
      status: "pending",
      estimatedHours: 5,
      type: "study",
    },
    {
      id: "t2",
      title: "Gym Workout",
      description: "Cardio and strength training",
      dueDate: "2025-01-10",
      priority: "low",
      status: "completed",
      estimatedHours: 1,
      type: "health",
    },
    {
      id: "t3",
      title: "Club Meeting Prep",
      description: "Prepare presentation for debate club",
      dueDate: "2025-01-14",
      priority: "medium",
      status: "pending",
      estimatedHours: 2,
      type: "extracurricular",
    },
  ];

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
    // Simulate loading data
    setTimeout(() => {
      setAssignments(sampleAssignments);
      setPersonalTasks(samplePersonalTasks);
      setLoading(false);
    }, 800);
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
      case "assignment":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "personal":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "holiday":
        return "🎉";
      case "exam":
        return "📝";
      case "enrollment":
        return "📋";
      case "academic":
        return "🎓";
      case "assignment":
        return "📚";
      case "personal":
        return "✅";
      default:
        return "📅";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Combine all events for calendar display
  const getAllEventsForMonth = (month, year) => {
    const semester = schoolCalendar.semesters[selectedSemester];
    const academicEvents = semester.events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });

    const assignmentEvents = assignments
      .map((assignment) => ({
        date: assignment.dueDate,
        title: assignment.title,
        type: "assignment",
        priority: assignment.priority,
        status: assignment.status,
        course: assignment.course,
        id: assignment.id,
      }))
      .filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getMonth() === month && eventDate.getFullYear() === year
        );
      });

    const personalEvents = personalTasks
      .map((task) => ({
        date: task.dueDate,
        title: task.title,
        type: "personal",
        priority: task.priority,
        status: task.status,
        id: task.id,
      }))
      .filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getMonth() === month && eventDate.getFullYear() === year
        );
      });

    const adminEventsList = adminEvents
      .map((event) => ({
        date: event.date,
        title: event.title,
        type: event.type,
        isAdminEvent: true,
        description: event.description,
        id: event.id,
      }))
      .filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getMonth() === month && eventDate.getFullYear() === year
        );
      });

    return [
      ...academicEvents,
      ...assignmentEvents,
      ...personalEvents,
      ...adminEventsList,
    ];
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
  const currentEvents = getAllEventsForMonth(selectedMonth, selectedYear);

  // Filter events based on selected filter
  const filteredEvents = useMemo(() => {
    if (filterType === "all") return currentEvents;
    if (filterType === "assignments")
      return currentEvents.filter((e) => e.type === "assignment");
    if (filterType === "personal")
      return currentEvents.filter((e) => e.type === "personal");
    if (filterType === "academic")
      return currentEvents.filter((e) =>
        ["holiday", "exam", "enrollment", "academic"].includes(e.type)
      );
    return currentEvents;
  }, [currentEvents, filterType]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.title.trim() && newTask.dueDate) {
      const task = {
        id: `task-${Date.now()}`,
        ...newTask,
        status: "pending",
        estimatedHours: 1,
      };

      if (newTask.type === "assignment") {
        setAssignments((prev) => [...prev, task]);
      } else {
        setPersonalTasks((prev) => [...prev, task]);
      }

      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        type: "personal",
      });
      setShowTaskModal(false);
    }
  };

  const handleTaskStatusChange = (taskId, newStatus, type) => {
    if (type === "assignment") {
      setAssignments((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } else {
      setPersonalTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    }
  };

  const getUpcomingDeadlines = () => {
    const allTasks = [...assignments, ...personalTasks];
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return allTasks
      .filter((task) => {
        const dueDate = new Date(task.dueDate);
        return (
          dueDate >= today && dueDate <= nextWeek && task.status !== "completed"
        );
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-5">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                Academic Calendar & Tasks
              </h1>
            </div>

            {/* Collapsible Dashboard Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsDashboardCollapsed(!isDashboardCollapsed)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${
                    isDashboardCollapsed ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dashboard Cards */}
              {!isDashboardCollapsed && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-5">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Assignments */}
                    <button
                      onClick={() => setFilterType("assignments")}
                      className={`bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 text-left transition-all hover:shadow-md border border-blue-100 ${
                        filterType === "assignments"
                          ? "ring-2 ring-blue-500 shadow-md"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <svg
                          className="w-8 h-8 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {assignments.length}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        Assignments
                      </div>
                    </button>

                    {/* Personal Tasks */}
                    <button
                      onClick={() => setFilterType("personal")}
                      className={`bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 text-left transition-all hover:shadow-md border border-green-100 ${
                        filterType === "personal"
                          ? "ring-2 ring-green-500 shadow-md"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <svg
                          className="w-8 h-8 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {personalTasks.length}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        Personal Tasks
                      </div>
                    </button>

                    {/* Due This Week */}
                    <button
                      onClick={() => setFilterType("due_this_week")}
                      className={`bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-4 text-left transition-all hover:shadow-md border border-red-100 ${
                        filterType === "due_this_week"
                          ? "ring-2 ring-red-500 shadow-md"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <svg
                          className="w-8 h-8 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {getUpcomingDeadlines().length}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        Due This Week
                      </div>
                    </button>

                    {/* Completed */}
                    <button
                      onClick={() => setFilterType("completed")}
                      className={`bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 text-left transition-all hover:shadow-md border border-blue-100 ${
                        filterType === "completed"
                          ? "ring-2 ring-blue-500 shadow-md"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <svg
                          className="w-8 h-8 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {Math.round(
                          ([...assignments, ...personalTasks].filter(
                            (t) => t.status === "completed"
                          ).length /
                            [...assignments, ...personalTasks].length) *
                            100
                        ) || 0}
                        %
                      </div>
                    </button>
                  </div>

                  {/* Reset Filter Button */}
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <button
                      onClick={() => setFilterType("all")}
                      className={`w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                        filterType === "all"
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Show All Tasks
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <main className="bg-slate-50 pb-20">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Calendar */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Calendar
                  </h2>
                  <div className="flex gap-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Events</option>
                      <option value="academic">Academic</option>
                      <option value="assignments">Assignments</option>
                      <option value="personal">Personal</option>
                      <option value="due_this_week">Due This Week</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      + Add Task
                    </button>
                  </div>
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

                {/* Calendar View Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCalendarView("month")}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        calendarView === "month"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Month
                    </button>
                    <button
                      onClick={() => setCalendarView("week")}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        calendarView === "week"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setCalendarView("day")}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        calendarView === "day"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Day
                    </button>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                    title="Toggle dark mode"
                  >
                    {darkMode ? "☀️" : "🌙"}
                  </button>
                </div>

                {/* Enhanced Calendar Grid */}
                <div
                  className={`${
                    darkMode ? "bg-slate-800" : "bg-white"
                  } rounded-xl border border-slate-200 p-4`}
                >
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className={`p-2 text-center text-sm font-medium ${
                            darkMode ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {day}
                        </div>
                      )
                    )}
                    {Array.from({
                      length: getFirstDayOfMonth(selectedMonth, selectedYear),
                    }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="p-2 min-h-[100px]"
                      ></div>
                    ))}
                    {Array.from({
                      length: getDaysInMonth(selectedMonth, selectedYear),
                    }).map((_, i) => {
                      const day = i + 1;
                      const currentDate = new Date(
                        selectedYear,
                        selectedMonth,
                        day
                      );
                      const dayEvents = getEventsForDate(currentDate);
                      const hasEvents = dayEvents.length > 0;
                      const isCurrentDay = isToday(currentDate);
                      const isSelectedDay = isSelected(currentDate);

                      return (
                        <div
                          key={day}
                          className={`p-2 min-h-[100px] border rounded-lg transition-all cursor-pointer ${
                            isCurrentDay
                              ? "bg-blue-50 border-blue-200 shadow-sm"
                              : isSelectedDay
                              ? "bg-blue-100 border-blue-300 shadow-md"
                              : hasEvents
                              ? "bg-emerald-50/40 border-emerald-200 shadow-sm"
                              : darkMode
                              ? "border-slate-700 hover:bg-slate-700"
                              : "border-slate-100 hover:bg-slate-50"
                          }`}
                          onClick={() => setSelectedDate(currentDate)}
                        >
                          <div
                            className={`text-sm font-medium mb-1 ${
                              isCurrentDay
                                ? "text-blue-700"
                                : darkMode
                                ? "text-slate-200"
                                : "text-slate-700"
                            }`}
                          >
                            {day}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map((event, idx) => (
                              <div
                                key={idx}
                                className={`text-xs p-1 rounded truncate ${
                                  event.course
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
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
                </div>

                {/* Enhanced Legend */}
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Legend:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
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
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-purple-100 border border-purple-200"></span>
                      <span>Assignment</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-indigo-100 border border-indigo-200"></span>
                      <span>Personal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Upcoming Deadlines
                  </h3>
                  <div className="space-y-3">
                    {getUpcomingDeadlines().map((task) => (
                      <div key={task.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              {task.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                            {task.course && (
                              <p className="text-xs text-blue-600">
                                {task.course}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                            <button
                              onClick={() =>
                                handleTaskStatusChange(
                                  task.id,
                                  "completed",
                                  task.type === "assignment"
                                    ? "assignment"
                                    : "personal"
                                )
                              }
                              className="text-green-600 hover:text-green-700"
                            >
                              ✓
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {getUpcomingDeadlines().length === 0 && (
                      <p className="text-sm text-slate-500 text-center py-4">
                        No upcoming deadlines this week! 🎉
                      </p>
                    )}
                  </div>
                </div>

                {/* Task Summary */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Task Summary
                    </h3>
                    {filterType !== "all" && (
                      <span className="text-sm text-blue-600 font-medium">
                        Filtered:{" "}
                        {filterType
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    )}
                  </div>

                  {/* Filtered Tasks Display */}
                  {filterType !== "all" && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">
                        {filterType === "assignments" && "📚 Assignments"}
                        {filterType === "personal" && "✅ Personal Tasks"}
                        {filterType === "due_this_week" && "⏰ Due This Week"}
                        {filterType === "completed" && "📊 Completed Tasks"}
                      </h4>
                      <div className="space-y-2">
                        {filterType === "assignments" &&
                          assignments.map((assignment) => (
                            <div
                              key={assignment.id}
                              className="flex items-center justify-between p-2 bg-white rounded border"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">
                                  {assignment.title}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {assignment.course}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    toggleTaskStatus(assignment.id, true)
                                  }
                                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                    assignment.status === "completed"
                                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                                      : assignment.status === "in_progress"
                                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                      : "bg-red-100 text-red-700 hover:bg-red-200"
                                  }`}
                                  title="Click to change status"
                                >
                                  {assignment.status}
                                </button>
                                <button
                                  onClick={() => editTask(assignment)}
                                  className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit assignment"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() =>
                                    deleteAssignment(assignment.id)
                                  }
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                  title="Delete assignment"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}

                        {filterType === "personal" &&
                          personalTasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between p-2 bg-white rounded border"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">
                                  {task.title}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {task.type}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    toggleTaskStatus(task.id, false)
                                  }
                                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                    task.status === "completed"
                                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                                      : task.status === "in_progress"
                                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                      : "bg-red-100 text-red-700 hover:bg-red-200"
                                  }`}
                                  title="Click to change status"
                                >
                                  {task.status}
                                </button>
                                <button
                                  onClick={() => editTask(task)}
                                  className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit personal task"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => deletePersonalTask(task.id)}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                  title="Delete personal task"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}

                        {filterType === "due_this_week" &&
                          getUpcomingDeadlines().map((deadline) => (
                            <div
                              key={deadline.id}
                              className="flex items-center justify-between p-2 bg-white rounded border"
                            >
                              <div>
                                <p className="text-sm font-medium text-slate-900">
                                  {deadline.title}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Due: {deadline.dueDate}
                                </p>
                              </div>
                              <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
                                Due Soon
                              </span>
                            </div>
                          ))}

                        {filterType === "completed" &&
                          [...assignments, ...personalTasks]
                            .filter((task) => task.status === "completed")
                            .map((task) => (
                              <div
                                key={task.id}
                                className="flex items-center justify-between p-2 bg-white rounded border"
                              >
                                <div>
                                  <p className="text-sm font-medium text-slate-900">
                                    {task.title}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {task.course || task.type}
                                  </p>
                                </div>
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                  Completed
                                </span>
                              </div>
                            ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        Assignments
                      </span>
                      <div className="flex gap-2">
                        <span className="text-sm font-medium text-slate-900">
                          {
                            assignments.filter((a) => a.status === "completed")
                              .length
                          }
                          /{assignments.length}
                        </span>
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${
                                assignments.length > 0
                                  ? (assignments.filter(
                                      (a) => a.status === "completed"
                                    ).length /
                                      assignments.length) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        Personal Tasks
                      </span>
                      <div className="flex gap-2">
                        <span className="text-sm font-medium text-slate-900">
                          {
                            personalTasks.filter(
                              (t) => t.status === "completed"
                            ).length
                          }
                          /{personalTasks.length}
                        </span>
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${
                                personalTasks.length > 0
                                  ? (personalTasks.filter(
                                      (t) => t.status === "completed"
                                    ).length /
                                      personalTasks.length) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      📝 Add Assignment
                    </button>
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      ✅ Add Personal Task
                    </button>
                    <button
                      onClick={handleGoogleCalendarSync}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors ${
                        googleCalSynced ? "bg-green-50 text-green-700" : ""
                      }`}
                    >
                      {googleCalSynced
                        ? "✓ Synced with Google Calendar"
                        : "📅 Sync with Google Calendar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {editingTask ? "Edit Task" : "Add New Task"}
            </h3>
            <form
              onSubmit={editingTask ? updateTask : handleAddTask}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newTask.type}
                    onChange={(e) =>
                      setNewTask({ ...newTask, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="personal">Personal</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTaskModal(false);
                    setEditingTask(null);
                    setNewTask({
                      title: "",
                      description: "",
                      dueDate: "",
                      priority: "medium",
                      type: "personal",
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingTask ? "Update Task" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Calendar;
