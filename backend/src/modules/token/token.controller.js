import {
  assignTokenService,
  getQueueTodayService,
  getTokenByIdService,
  updateTokenStatusService,
} from "./token.service.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";
import { ROLES, TOKEN_STATUS } from "../../lib/constants.js";

export const assignToken = async (req, res) => {
  const { patientId, reason, doctorId, offlineUuid } = req.body;

  if (!patientId) {
    return errorResponse(res, 400, "Patient ID required");
  }

  try {
    const token = await assignTokenService(
      patientId,
      reason,
      doctorId,
      offlineUuid,
    );
    return successResponse(res, 201, "Token assigned", token);
  } catch (err) {
    if (err.message === "PATIENT_NOT_FOUND")
      return errorResponse(res, 404, "Patient not found");
    if (err.message === "ALREADY_SYNCED")
      return errorResponse(res, 409, "Token already synced");
    throw err;
  }
};

export const getQueueToday = async (req, res) => {
  // Doctor sirf apni queue dekhe
  const doctorId = req.user.role === ROLES.DOCTOR ? req.user.id : null;
  const result = await getQueueTodayService(doctorId);
  return successResponse(res, 200, "Today Queue fetched", result);
};

export const getTokenById = async (req, res) => {
  try {
    const token = await getTokenByIdService(req.params.id);
    return successResponse(res, 200, "Token fetched", token);
  } catch (err) {
    if (err.message === "TOKEN_NOT_FOUND")
      return errorResponse(res, 404, "Token not found");
    throw err;
  }
};

export const updateTokenStatus = async (req, res) => {
  const { status } = req.body;

  const VALID = [
    TOKEN_STATUS.IN_PROGRESS,
    TOKEN_STATUS.COMPLETED,
    TOKEN_STATUS.CANCELLED,
  ];
  if (!VALID.includes(status)) {
    return errorResponse(res, 400, "Invalid status");
  }

  try {
    const token = await updateTokenStatusService(
      req.params.id,
      status,
      req.user.id,
    );
    return successResponse(res, 200, "Token status updated", token);
  } catch (err) {
    if (err.message === "TOKEN_NOT_FOUND")
      return errorResponse(res, 404, "Token not found");
    if (err.message === "INVALID_TRANSITION")
      return errorResponse(res, 400, "Invalid status transition");
    throw err;
  }
};
