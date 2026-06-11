import api from "./api";

export const createPrescriptionAPI = (data) => api.post("/prescriptions", data);

export const getPrescriptionByVisitAPI = (visitId) =>
  api.get(`/prescriptions/visit/${visitId}`);

export const getPrescriptionsByPatientAPI = (patientId) =>
  api.get(`/prescriptions/patient/${patientId}`);
