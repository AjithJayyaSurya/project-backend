import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { userRateLimiter } from "../middleware/rateLimit.middleware.js";
import { 
  useQuota, 
  getQuota, 
  sendMessage, 
  getMyMessages, 
  deleteMessage 
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/quota", authMiddleware, getQuota);

router.post(
  "/use-quota",
  authMiddleware,
  userRateLimiter,
  useQuota
);

// Messaging routes
router.post("/messages", authMiddleware, userRateLimiter, sendMessage);
router.get("/messages", authMiddleware, getMyMessages);
router.delete("/messages/:messageId", authMiddleware, deleteMessage);

export default router;
