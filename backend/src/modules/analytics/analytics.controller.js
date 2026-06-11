import {
  getDashboardStatsService,
  getDoctorLoadService,
  getHourlyHeatmapService,
  getTopMedicinesService,
} from "./analytics.service.js";
import { successResponse } from "../../utils/apiResponse.js";

export const getDashboardStats = async (req, res) => {
  const data = await getDashboardStatsService(req.query.date);
  return successResponse(res, 200, "Dashboard stats fetched", data);
};

export const getDoctorLoad = async (req, res) => {
  const data = await getDoctorLoadService(req.query.date);
  return successResponse(res, 200, "Doctor load fetched", data);
};

export const getHourlyHeatmap = async (req, res) => {
  const data = await getHourlyHeatmapService();
  return successResponse(res, 200, "Heatmap fetched", data);
};

export const getTopMedicines = async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const data = await getTopMedicinesService(days);
  return successResponse(res, 200, "Top medicines fetched", data);
};