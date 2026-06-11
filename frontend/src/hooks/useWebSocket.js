import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { getToken } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import { useQueueStore } from "@/store/queueStore";
import { ROLES } from "@/lib/constants";

let socketInstance = null; // Single socket instance

export const useWebSocket = () => {
  const user = useAuthStore((state) => state.user);

  const addToken = useQueueStore((state) => state.addToken);
  const updateTokenStatus = useQueueStore((state) => state.updateTokenStatus);
  const removeToken = useQueueStore((state) => state.removeToken);
  const setConnected = useQueueStore((state) => state.setConnected);

  const listenersRef = useRef({});

  useEffect(() => {
    if (!user) {
      socketInstance?.disconnect();
      socketInstance = null;
      setConnected(false);
      return;
    }

    // Agar already connected hai to dobara connection mat banao
    if (socketInstance?.connected) {
      setConnected(true);
      return;
    }

    socketInstance = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        auth: {
          token: getToken(),
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      },
    );

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setConnected(true);

      if (user.role === ROLES.DOCTOR) {
        socketInstance.emit("join:doctor", user.id);
      }

      if (user.role === ROLES.RECEPTIONIST) {
        socketInstance.emit("join:receptionist");
      }

      if (user.role === ROLES.ADMIN) {
        socketInstance.emit("join:admin");
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      setConnected(false);
    });

    // New token
    socketInstance.on("queue:new_token", (token) => {
      addToken(token);
      listenersRef.current["queue:new_token"]?.(token);
    });

    // Status update
    socketInstance.on("queue:status_update", ({ tokenId, status }) => {
      updateTokenStatus(tokenId, status);
      listenersRef.current["queue:status_update"]?.({ tokenId, status });
    });

    // Token completed
    socketInstance.on("queue:token_completed", ({ tokenId }) => {
      removeToken(tokenId);
      listenersRef.current["queue:token_completed"]?.({ tokenId });
    });

    return () => {
      if (socketInstance) {
        socketInstance.off("connect");
        socketInstance.off("disconnect");
        socketInstance.off("connect_error");

        socketInstance.off("queue:new_token");
        socketInstance.off("queue:status_update");
        socketInstance.off("queue:token_completed");

        socketInstance.disconnect();
        socketInstance = null;
      }

      setConnected(false);
    };
  }, [user, addToken, updateTokenStatus, removeToken, setConnected]);

  const on = useCallback((event, callback) => {
    listenersRef.current[event] = callback;
  }, []);

  const off = useCallback((event) => {
    delete listenersRef.current[event];
  }, []);

  return {
    on,
    off,
    socket: socketInstance,
  };
};
