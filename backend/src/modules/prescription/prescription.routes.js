import { Router } from "express";
import {
  createPrescription,
  getPrescriptionByVisit,
  getPrescriptionsByPatient,
} from "./prescription.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

router.use(authMiddleware);

// Sirf doctor prescription likh sakta hai
router.post(
  "/",
  validate("createPrescription"),
  requireRole("DOCTOR"),
  createPrescription,
);

// Visit ke liye prescription
router.get(
  "/visit/:visitId",
  requireRole("DOCTOR", "RECEPTIONIST"),
  getPrescriptionByVisit,
);

// Patient ki poori history
router.get(
  "/patient/:patientId",
  requireRole("DOCTOR"),
  getPrescriptionsByPatient,
);

export default router;
