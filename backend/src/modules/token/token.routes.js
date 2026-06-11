import { Router } from "express";
import {
  assignToken,
  getQueueToday,
  updateTokenStatus,
  getTokenById,
} from "./token.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { ROLES } from "../../lib/constants.js";

const router = Router();

router.use(authMiddleware);

// Receptionist token assign karta hai
router.post(
  "/",
  validate("assignToken"),
  requireRole(ROLES.RECEPTIONIST),
  assignToken,
);

// Doctor + Receptionist queue dekhte hain
router.get("/queue", requireRole(ROLES.DOCTOR, ROLES.RECEPTIONIST), getQueueToday);

// Single token details
router.get("/:id", requireRole(ROLES.DOCTOR, ROLES.RECEPTIONIST), getTokenById);

// Doctor status update karta hai
router.patch(
  "/:id/status",
  validate("updateTokenStatus"),
  requireRole(ROLES.DOCTOR),
  updateTokenStatus,
);

export default router;
