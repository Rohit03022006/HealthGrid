import { Router } from "express";
import { getQueueStatus } from "./queue.controller.js";

const router = Router();

router.get("/status/:token", getQueueStatus);

export default router;
