
import { create } from "zustand";

export const useSyncStore = create((set, get) => ({
  //  State 
  isOnline:  navigator.onLine,
  pending:   0,
  syncing:   false,
  lastSync:  null,

  //  Actions 
  setOnline:  (val) => set({ isOnline: val }),
  setSyncing: (val) => set({ syncing: val }),

  incrementPending: () =>
    set((state) => ({ pending: state.pending + 1 })),

  decrementPending: () =>
    set((state) => ({ pending: Math.max(0, state.pending - 1) })),

  setPending: (count) => set({ pending: count }),

  setLastSync: () => set({ lastSync: new Date().toISOString() }),

  // Computed 
  hasPending: () => get().pending > 0,
  isOffline:  () => !get().isOnline,
}));