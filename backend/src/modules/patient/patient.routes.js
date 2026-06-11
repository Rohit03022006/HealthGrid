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
import { ROLES } from "../../lib/constants.js";

const router = Router();

router.use(authMiddleware);

// Search by phone must come before /:id
router.get("/search", requireRole(ROLES.RECEPTIONIST, ROLES.DOCTOR), getPatientByPhone);

// Receptionist + Doctor + Admin can view patients
router.get("/", requireRole(ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.ADMIN), getPatients);

router.get(
  "/:id",
  requireRole(ROLES.RECEPTIONIST, ROLES.DOCTOR, ROLES.ADMIN),
  getPatientById,
);

// Only receptionist can register
router.post(
  "/",
  validate("registerPatient"),
  requireRole(ROLES.RECEPTIONIST),
  registerPatient,
);

router.put("/:id", requireRole(ROLES.RECEPTIONIST, ROLES.ADMIN), updatePatient);

export default router;
