import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const messageHandlers = useRef(new Map());
  const reconnectTimeoutRef = useRef(null);

  const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;

  const connect = useCallback(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[WebSocket] Connected");
        setIsConnected(true);
        setReconnectAttempts(0);

        // Send authentication
        const token = localStorage.getItem("uniconToken");
        if (token) {
          ws.send(
            JSON.stringify({
              type: "auth",
              token,
              user_id: user.id,
            })
          );
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Call all registered handlers for this message type
          const handlers = messageHandlers.current.get(data.type) || [];
          handlers.forEach((handler) => handler(data));
        } catch (err) {
          console.error("[WebSocket] Failed to parse message:", err);
        }
      };

      ws.onerror = (error) => {
        console.error("[WebSocket] Error:", error);
      };

      ws.onclose = () => {
        console.log("[WebSocket] Disconnected");
        setIsConnected(false);
        wsRef.current = null;

        // Attempt to reconnect
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && isAuthenticated) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connect();
          }, RECONNECT_DELAY);
        }
      };
    } catch (err) {
      console.error("[WebSocket] Failed to connect:", err);
      setIsConnected(false);
    }
  }, [isAuthenticated, user, WS_URL, reconnectAttempts]);

  useEffect(() => {
    if (isAuthenticated && user) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isAuthenticated, user, connect]);

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    console.warn("[WebSocket] Cannot send message - not connected");
    return false;
  }, []);

  const subscribe = useCallback((messageType, handler) => {
    if (!messageHandlers.current.has(messageType)) {
      messageHandlers.current.set(messageType, []);
    }
    messageHandlers.current.get(messageType).push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = messageHandlers.current.get(messageType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }, []);

  const value = {
    isConnected,
    sendMessage,
    subscribe,
    ws: wsRef.current,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    // Return a no-op implementation if WebSocket is not available
    return {
      isConnected: false,
      sendMessage: () => false,
      subscribe: () => () => {},
      ws: null,
    };
  }
  return context;
}
