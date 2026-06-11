import api from "./api";

export const assignTokenAPI = (data) => api.post("/tokens", data);

export const getQueueTodayAPI = () => api.get("/tokens/queue");

export const getTokenByIdAPI = (id) => api.get(`/tokens/${id}`);

export const updateTokenStatusAPI = (id, status) =>
  api.patch(`/tokens/${id}/status`, { status });
