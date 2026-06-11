import { Router } from "express";
import { register, login, getMe } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", validate("login"), login);
router.get("/me", authMiddleware, getMe);

export default router;