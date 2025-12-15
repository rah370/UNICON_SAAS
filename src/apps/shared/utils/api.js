// API utility functions for making authenticated requests

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("uniconToken");
  const requestUrl = `${API_BASE_URL}${endpoint}`;

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
    const response = await fetch(requestUrl, config);
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
  createEvent: (data) =>
    apiRequest("/events", {
      method: "POST",
      body: { ...data, is_public: false }, // Students can only create private events
    }),
  rsvpEvent: (eventId, status) =>
    apiRequest("/events/rsvp", {
      method: "POST",
      body: { event_id: eventId, status },
    }),
  getEventAttendees: (eventId) => apiRequest(`/events/${eventId}/attendees`),
  getUserEventStatus: (eventId) => apiRequest(`/events/${eventId}/status`),

  // Authentication
  forgotPassword: (email) =>
    apiRequest("/auth/forgot-password", {
      method: "POST",
      body: { email },
    }),
  resetPassword: (token, password) =>
    apiRequest("/auth/reset-password", {
      method: "POST",
      body: { token, password },
    }),

  // Feed/Dashboard
  getFeed: () => apiRequest("/feed"),
  getDashboard: () => apiRequest("/dashboard"),

  // Community
  getClubs: () => apiRequest("/community/clubs"),
  getPosts: (params) => {
    const query = new URLSearchParams(params || {}).toString();
    return apiRequest(`/posts${query ? `?${query}` : ""}`);
  },
  createPost: (data) =>
    apiRequest("/posts", {
      method: "POST",
      body: data,
    }),
  reactToPost: (postId, reaction) =>
    apiRequest("/posts/react", {
      method: "POST",
      body: { post_id: postId, reaction },
    }),
  commentOnPost: (postId, content) =>
    apiRequest("/posts/comment", {
      method: "POST",
      body: { post_id: postId, content },
    }),

  // Marketplace
  getMarketplace: (params) => {
    const query = new URLSearchParams(params || {}).toString();
    return apiRequest(`/marketplace${query ? `?${query}` : ""}`);
  },
  createListing: (data) =>
    apiRequest("/marketplace", {
      method: "POST",
      body: data,
    }),
  updateListing: (itemId, data) =>
    apiRequest("/marketplace", {
      method: "PUT",
      body: { item_id: itemId, ...data },
    }),

  // Messages
  getConversations: () => apiRequest("/messages/conversations"),
  getMessages: (conversationId) =>
    apiRequest(`/messages/conversations/${conversationId}`),
  sendMessage: (conversationId, content) =>
    apiRequest("/messages", {
      method: "POST",
      body: { conversation_id: conversationId, content },
    }),
  createConversation: (userId) =>
    apiRequest("/messages/conversations", {
      method: "POST",
      body: { user_id: userId },
    }),

  // User Profile
  getProfile: (userId) =>
    apiRequest(`/user/profile${userId ? `?user_id=${userId}` : ""}`),
  updateProfile: (data) =>
    apiRequest("/user/profile", {
      method: "PUT",
      body: data,
    }),

  // Settings
  getSettings: () => apiRequest("/user/settings"),
  updateSettings: (data) =>
    apiRequest("/user/settings", {
      method: "PUT",
      body: data,
    }),

  // Search
  search: (query, type) => {
    const params = new URLSearchParams({ q: query });
    if (type) params.append("type", type);
    return apiRequest(`/search?${params.toString()}`);
  },
};
