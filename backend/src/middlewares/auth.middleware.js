import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/apiResponse.js";

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return errorResponse(res, 401, "No token provided");
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, role }
    next();
  } catch {
    return errorResponse(res, 401, "Invalid or expired token");
  }
};