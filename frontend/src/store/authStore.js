import { create } from "zustand";
import { getUser, getToken } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

// Install:
// npm install zustand

export const useAuthStore = create((set) => ({
  //  State
  user:  getUser(),   // JWT se initial user
  token: getToken(),  // localStorage se initial token

  // Actions 
  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  // Computed 
  isAuthenticated: () => !!getToken(),
  isDoctor:        () => getUser()?.role === ROLES.DOCTOR,
  isReceptionist:  () => getUser()?.role === ROLES.RECEPTIONIST,
  isAdmin:         () => getUser()?.role === ROLES.ADMIN,
}));