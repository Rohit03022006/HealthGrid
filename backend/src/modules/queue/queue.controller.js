import { getQueueStatusService } from "./queue.service.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";

export const getQueueStatus = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return errorResponse(res, 400, "Token required");
  }

  try {
    const result = await getQueueStatusService(token);

    return successResponse(res, 200, "Queue status fetched", result);
  } catch (err) {
    if (err.message === "TOKEN_NOT_FOUND") {
      return errorResponse(res, 404, "Token not found");
    }

    throw err;
  }
};
