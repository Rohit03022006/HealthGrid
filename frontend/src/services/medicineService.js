import api from "./api";

export const searchMedicinesAPI = (query) =>
  api.get("/medicines/search", { params: { q: query } });
