import { Router } from "express";
import {
  registerPatient,
  getPatients,
  getPatientById,
  getPatientByPhone,
  updatePatient,
} from "./patient.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

router.use(authMiddleware);

// Search by phone must come before /:id
router.get("/search", requireRole("RECEPTIONIST", "DOCTOR"), getPatientByPhone);

// Receptionist + Doctor + Admin can view patients
router.get("/", requireRole("RECEPTIONIST", "DOCTOR", "ADMIN"), getPatients);

router.get(
  "/:id",
  requireRole("RECEPTIONIST", "DOCTOR", "ADMIN"),
  getPatientById,
);

// Only receptionist can register
router.post(
  "/",
  validate("registerPatient"),
  requireRole("RECEPTIONIST"),
  registerPatient,
);

router.put("/:id", requireRole("RECEPTIONIST", "ADMIN"), updatePatient);

export default router;
