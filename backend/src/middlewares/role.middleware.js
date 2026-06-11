import { errorResponse } from "../utils/apiResponse.js";

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, "Access denied");
    }

    next();
  };
};
