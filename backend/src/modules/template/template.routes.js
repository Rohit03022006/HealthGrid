import { Router } from "express";
import {
  createTemplate,
  getMyTemplates,
  updateTemplate,
  deleteTemplate,
} from "./template.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { ROLES } from "../../lib/constants.js";

const router = Router();

router.use(authMiddleware);
router.use(requireRole(ROLES.DOCTOR)); // Sirf doctor

router.get("/", getMyTemplates);
router.post("/", validate("createTemplate"), createTemplate);
router.put("/:id", validate("updateTemplate"), updateTemplate);
router.delete("/:id", deleteTemplate);

export default router;
