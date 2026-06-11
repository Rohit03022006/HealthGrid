import api from "./api";

export const getDashboardStatsAPI = (date) =>
  api.get("/analytics/dashboard", { params: { date } });

export const getDoctorLoadAPI = (date) =>
  api.get("/analytics/doctor-load", { params: { date } });

export const getHourlyHeatmapAPI = () => api.get("/analytics/heatmap");

export const getTopMedicinesAPI = (days = 30) =>
  api.get("/analytics/medicines", { params: { days } });
