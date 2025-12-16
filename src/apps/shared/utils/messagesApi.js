// API utility functions for messaging

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("uniconToken");
  
  const config = {
    ...options,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  // Don't set Content-Type for FormData, browser will set it with boundary
  if (!(options.body instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  } else if (options.body) {
    config.body = options.body;
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

export const messagesApi = {
  // Get all conversations
  getConversations: () => apiRequest("/messages"),

  // Get messages for a specific conversation
  getMessages: (otherUserId) => apiRequest(`/messages?other_user_id=${otherUserId}`),

  // Send a message
  sendMessage: (recipientId, content) =>
    apiRequest("/messages", {
      method: "POST",
      body: { recipient_id: recipientId, content },
    }),

  // Mark messages as read
  markAsRead: (messageIds) =>
    apiRequest("/messages/read", {
      method: "PUT",
      body: { message_ids: messageIds },
    }),

  // Search users for new chat
  searchUsers: (query) =>
    apiRequest(`/search?q=${encodeURIComponent(query)}&type=users`),
};

