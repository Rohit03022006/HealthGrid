import api from "./api";

export const loginAPI = (email, password) =>
  api.post("/auth/login", { email, password });

export const getMeAPI = () => api.get("/auth/me");
