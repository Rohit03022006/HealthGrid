import { create } from "zustand";
import { REMOVE_FROM_QUEUE, TOKEN_STATUS } from "@/lib/constants";

export const useQueueStore = create((set, get) => ({
  //  State 
  queue:        [],
  connected:    false,
  activeToken:  null, // Doctor ka current patient

  //  Set Full Queue
  setQueue: (queue) => set({ queue }),

  //  Add New Token
  addToken: (token) => {
    set((state) => {
      // Already exist karta hai?
      if (state.queue.find((t) => t.id === token.id)) return state;

      // Priority order mein insert
      const updated = [...state.queue, token].sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return new Date(a.issued_at) - new Date(b.issued_at);
      });

      return { queue: updated };
    });
  },

  // Update Token Status 
  updateTokenStatus: (tokenId, status) => {
    set((state) => ({
      queue: state.queue
        .map((t) => t.id === tokenId ? { ...t, status } : t)
        .filter((t) => !REMOVE_FROM_QUEUE.includes(t.status)),
    }));
  },

  //  Remove Token
  removeToken: (tokenId) => {
    set((state) => ({
      queue: state.queue.filter((t) => t.id !== tokenId),
    }));
  },

  // Set Active Token (Doctor) 
  setActiveToken: (token) => set({ activeToken: token }),

  clearActiveToken: () => set({ activeToken: null }),

  //  Connection Status 
  setConnected: (connected) => set({ connected }),

  //  Computed
  getWaiting: () =>
    get().queue.filter((t) => t.status === TOKEN_STATUS.WAITING),

  getInProgress: () =>
    get().queue.filter((t) => t.status === TOKEN_STATUS.IN_PROGRESS),

  getTotalCount: () => get().queue.length,
}));