import { Router } from "express";
import { searchMedicines } from "./medicine.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { ROLES } from "../../lib/constants.js";

const router = Router();

router.use(authMiddleware);

// Sirf doctor search kare
router.get("/search", requireRole(ROLES.DOCTOR), searchMedicines);

export default router;