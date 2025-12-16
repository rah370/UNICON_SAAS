// API utility functions for making authenticated requests

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log("API Configuration:", {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    API_BASE_URL: API_BASE_URL,
    currentURL: window.location.origin,
  });
}

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

  const fullUrl = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(fullUrl, config);

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      // Provide helpful error for 404 on API routes (likely missing backend)
      if (response.status === 404 && API_BASE_URL === "/api") {
        console.error(
          "⚠️ API endpoint not found. This usually means:\n" +
          "1. Backend API is not deployed or accessible\n" +
          "2. VITE_API_BASE_URL environment variable is not set in Vercel\n" +
          "3. Set VITE_API_BASE_URL in Vercel Dashboard → Settings → Environment Variables\n" +
          `   Current API URL: ${fullUrl}`
        );
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API request failed:", {
      url: fullUrl,
      endpoint,
      error: error.message,
      API_BASE_URL,
    });
    
    // Re-throw with more context if it's a network error
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      const helpfulMessage = API_BASE_URL === "/api" 
        ? "Network error: Backend API not accessible. Please ensure VITE_API_BASE_URL is set in Vercel environment variables."
        : "Network error: Unable to connect to the server. Please check your connection.";
      throw new Error(helpfulMessage);
    }
    throw error;
  }
}

export const brandingApi = {
  // Get branding for current user's school
  getBranding: () => apiRequest("/branding"),

  // Get branding for specific school (admin only)
  getSchoolBranding: (schoolId) => apiRequest(`/schools/${schoolId}/branding`),

  // Update branding (admin only)
  updateBranding: (brandingData) =>
    apiRequest("/branding", {
      method: "PUT",
      body: brandingData,
    }),

  // Update specific school branding (admin only)
  updateSchoolBranding: (schoolId, brandingData) =>
    apiRequest(`/schools/${schoolId}/branding`, {
      method: "PUT",
      body: brandingData,
    }),

  // Upload logo (admin only)
  uploadLogo: (schoolId, file) => {
    const formData = new FormData();
    formData.append("logo", file);

    const token = localStorage.getItem("uniconToken");
    return fetch(`${API_BASE_URL}/schools/${schoolId}/branding/logo`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error("Logo upload failed:", err);
        throw err;
      });
  },

  // Get approved fonts list
  getApprovedFonts: () => apiRequest("/branding/fonts"),
};

export const adminApi = {
  // Users
  getUsers: () => apiRequest("/admin/users"),
  createUser: (payload) =>
    apiRequest("/admin/users", {
      method: "POST",
      body: payload,
    }),
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
  bulkImportUsers: (users) =>
    apiRequest("/admin/users", {
      method: "POST",
      body: { bulk_import: true, users },
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

  // Settings
  getSettings: () => apiRequest("/admin/settings"),
  updateSettings: (settings) =>
    apiRequest("/admin/settings", {
      method: "PUT",
      body: settings,
    }),

  // Activity Logs
  getActivityLogs: (limit = 50, offset = 0) =>
    apiRequest(`/admin/activity-logs?limit=${limit}&offset=${offset}`),

  // Ops snapshot and approvals
  getOpsSnapshot: () => apiRequest("/admin/ops-snapshot"),
  getApprovals: () => apiRequest("/admin/approvals"),
  getAlerts: () => apiRequest("/admin/alerts"),
};

export const studentApi = {
  // Search
  search: (query, type = null) => {
    const params = new URLSearchParams({ q: query });
    if (type) params.append("type", type);
    return apiRequest(`/search?${params.toString()}`);
  },

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

  // Posts
  getPosts: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.channel) queryParams.append("channel", params.channel);
    const queryString = queryParams.toString();
    return apiRequest(`/posts${queryString ? `?${queryString}` : ""}`);
  },
  createPost: (data) =>
    apiRequest("/posts", {
      method: "POST",
      body: data,
    }),
  reactToPost: (postId, reactionType = "like") =>
    apiRequest("/reactions", {
      method: "POST",
      body: {
        target_type: "post",
        target_id: postId,
        reaction_type: reactionType,
      },
    }),

  // Channels/Clubs
  getClubs: () => apiRequest("/channels"),

  // Profile
  getProfile: (userId = null) => {
    if (userId) {
      return apiRequest(`/profile?user_id=${userId}`);
    }
    return apiRequest("/profile");
  },
  updateProfile: (data) =>
    apiRequest("/profile", {
      method: "PUT",
      body: data,
    }),

  // Settings
  getSettings: () => apiRequest("/admin/settings"),
  updateSettings: (settings) =>
    apiRequest("/admin/settings", {
      method: "PUT",
      body: settings,
    }),

  // Marketplace
  getMarketplace: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append("category", params.category);
    if (params.search) queryParams.append("search", params.search);
    const queryString = queryParams.toString();
    return apiRequest(`/marketplace${queryString ? `?${queryString}` : ""}`);
  },
  createListing: (data) =>
    apiRequest("/marketplace", {
      method: "POST",
      body: data,
    }),
};
