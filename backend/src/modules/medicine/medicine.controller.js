import { searchMedicinesService } from "./medicine.service.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const searchMedicines = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return errorResponse(res, 400, "Minimum 2 characters required");
  }

  const medicines = await searchMedicinesService(q.trim());
  return successResponse(res, 200, "Medicines fetched", medicines);
};