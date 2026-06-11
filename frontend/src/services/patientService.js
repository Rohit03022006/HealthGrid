import api from "./api";

export const registerPatientAPI = (data) => api.post("/patients", data);

export const getPatientsAPI = (page = 1, limit = 20, search = "") =>
  api.get("/patients", { params: { page, limit, search } });

export const getPatientByIdAPI = (id) => api.get(`/patients/${id}`);

export const getPatientByPhoneAPI = (phone) =>
  api.get("/patients/search", { params: { phone } });

export const updatePatientAPI = (id, data) => api.put(`/patients/${id}`, data);
