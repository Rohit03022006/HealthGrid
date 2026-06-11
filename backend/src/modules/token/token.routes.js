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

const router = Router();

router.use(authMiddleware);

// Receptionist token assign karta hai
router.post(
  "/",
  validate("assignToken"),
  requireRole("RECEPTIONIST"),
  assignToken,
);

// Doctor + Receptionist queue dekhte hain
router.get("/queue", requireRole("DOCTOR", "RECEPTIONIST"), getQueueToday);

// Single token details
router.get("/:id", requireRole("DOCTOR", "RECEPTIONIST"), getTokenById);

// Doctor status update karta hai
router.patch(
  "/:id/status",
  validate("updateTokenStatus"),
  requireRole("DOCTOR"),
  updateTokenStatus,
);

export default router;
