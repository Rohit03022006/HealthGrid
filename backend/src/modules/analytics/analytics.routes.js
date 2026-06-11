import { Router } from "express";
import {
  getDashboardStats,
  getDoctorLoad,
  getHourlyHeatmap,
  getTopMedicines,
} from "./analytics.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(requireRole("ADMIN"));

router.get("/dashboard",  getDashboardStats);
router.get("/doctor-load", getDoctorLoad);
router.get("/heatmap",    getHourlyHeatmap);
router.get("/medicines",  getTopMedicines);

export default router;