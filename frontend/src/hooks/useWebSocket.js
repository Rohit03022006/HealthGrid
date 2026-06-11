import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { getToken } from "@/lib/auth";
import { useAuth } from "./useAuth";

let socketInstance = null; // Single instance — prevent multiple connections

export const useWebSocket = () => {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [queue, setQueue] = useState([]);
  const listenersRef = useRef({});

  // Connect
  useEffect(() => {
    if (!user) return;

    // Already connected hai?
    if (socketInstance?.connected) {
      setConnected(true);
      return;
    }

    socketInstance = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        auth: { token: getToken() },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      },
    );

    // Connection events
    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setConnected(true);

      // Role ke hisaab se room join karo
      if (user.role === "DOCTOR") {
        socketInstance.emit("join:doctor", user.id);
      } else if (user.role === "RECEPTIONIST") {
        socketInstance.emit("join:receptionist");
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    //  Queue Events

    // Naya token aaya
    socketInstance.on("queue:new_token", (token) => {
      setQueue((prev) => {
        // Already exist karta hai? Skip
        if (prev.find((t) => t.id === token.id)) return prev;

        // Priority order mein insert karo
        const updated = [...prev, token].sort((a, b) => {
          if (a.priority !== b.priority) return a.priority - b.priority;
          return new Date(a.issued_at) - new Date(b.issued_at);
        });

        return updated;
      });

      // Custom listener fire karo
      listenersRef.current["queue:new_token"]?.(token);
    });

    // Status update
    socketInstance.on("queue:status_update", ({ tokenId, status }) => {
      setQueue((prev) =>
        prev
          .map((t) => (t.id === tokenId ? { ...t, status } : t))
          .filter((t) => !["COMPLETED", "CANCELLED"].includes(t.status)),
      );

      listenersRef.current["queue:status_update"]?.({ tokenId, status });
    });

    // Token complete — queue se remove
    socketInstance.on("queue:token_completed", ({ tokenId }) => {
      setQueue((prev) => prev.filter((t) => t.id !== tokenId));
      listenersRef.current["queue:token_completed"]?.({ tokenId });
    });

    return () => {
      socketInstance?.disconnect();
      socketInstance = null;
    };
  }, [user]);

  //  Custom Event Listener
  const on = useCallback((event, callback) => {
    listenersRef.current[event] = callback;
  }, []);

  //  Remove Listener
  const off = useCallback((event) => {
    delete listenersRef.current[event];
  }, []);

  return {
    connected,
    queue,
    setQueue,
    on,
    off,
    socket: socketInstance,
  };
};
