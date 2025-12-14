// API utility functions for making authenticated requests

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("uniconToken");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export const adminApi = {
  // Users
  getUsers: () => apiRequest("/admin/users"),
  updateUserStatus: (userId, status) =>
    apiRequest("/admin/users", {
      method: "PUT",
      body: { user_id: userId, status },
    }),
  updateUserRole: (userId, role) =>
    apiRequest("/admin/users", {
      method: "PUT",
      body: { user_id: userId, role },
    }),
  deleteUser: (userId) =>
    apiRequest("/admin/users", {
      method: "DELETE",
      body: { user_id: userId },
    }),

  // Analytics
  getAnalytics: () => apiRequest("/admin/analytics"),

  // Posts (for announcements)
  getPosts: () => apiRequest("/posts"),
  createPost: (data) =>
    apiRequest("/posts", {
      method: "POST",
      body: data,
    }),
  updatePost: (postId, data) =>
    apiRequest("/posts", {
      method: "PUT",
      body: { post_id: postId, ...data },
    }),
  deletePost: (postId) =>
    apiRequest("/posts?id=" + postId, {
      method: "DELETE",
    }),

  // Events
  getEvents: () => apiRequest("/events"),
  createEvent: (data) =>
    apiRequest("/events", {
      method: "POST",
      body: data,
    }),
  updateEvent: (eventId, data) =>
    apiRequest("/events", {
      method: "PUT",
      body: { event_id: eventId, ...data },
    }),
  deleteEvent: (eventId) =>
    apiRequest("/events?id=" + eventId, {
      method: "DELETE",
    }),

  // Marketplace
  getMarketplace: () => apiRequest("/marketplace"),
  updateMarketplaceItem: (itemId, data) =>
    apiRequest("/marketplace", {
      method: "PUT",
      body: { item_id: itemId, ...data },
    }),
};

export const studentApi = {
  // Tasks
  getTasks: () => apiRequest("/tasks"),
  createTask: (data) =>
    apiRequest("/tasks", {
      method: "POST",
      body: data,
    }),
  updateTask: (taskId, data) =>
    apiRequest("/tasks", {
      method: "PUT",
      body: { task_id: taskId, ...data },
    }),
  deleteTask: (taskId) =>
    apiRequest("/tasks", {
      method: "DELETE",
      body: { task_id: taskId },
    }),

  // Notifications
  getNotifications: () => apiRequest("/notifications"),
  markNotificationRead: (notificationId) =>
    apiRequest("/notifications", {
      method: "PUT",
      body: { notification_id: notificationId },
    }),
  markAllNotificationsRead: () =>
    apiRequest("/notifications", {
      method: "PUT",
      body: { mark_all_read: true },
    }),

  // Events
  getEvents: () => apiRequest("/events"),
  rsvpEvent: (eventId, status) =>
    apiRequest("/events/rsvp", {
      method: "POST",
      body: { event_id: eventId, status },
    }),
  getEventAttendees: (eventId) => apiRequest(`/events/${eventId}/attendees`),
  getUserEventStatus: (eventId) => apiRequest(`/events/${eventId}/status`),
};
