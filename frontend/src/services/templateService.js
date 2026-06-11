import api from "./api";

export const getTemplatesAPI = () => api.get("/templates");

export const createTemplateAPI = (data) => api.post("/templates", data);

export const updateTemplateAPI = (id, data) =>
  api.put(`/templates/${id}`, data);

export const deleteTemplateAPI = (id) => api.delete(`/templates/${id}`);
