import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { userRateLimiter } from "../middleware/rateLimit.middleware.js";
import { useQuota, getQuota } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/quota", authMiddleware, getQuota);

router.post(
  "/use-quota",
  authMiddleware,
  userRateLimiter,
  useQuota
);

export default router;
