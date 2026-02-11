import express from "express";
import {
  createUserWithQuota,
  getAllUsers,
  deleteUser,
  getAllMessages,
  updateMessageStatus,
  setUserQuota
} from "../controllers/admin.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";

const router = express.Router();

// CREATE user
router.post("/users", authMiddleware, adminOnly, createUserWithQuota);

// READ users
router.get("/users", authMiddleware, adminOnly, getAllUsers);

// DELETE user
router.delete("/users/:id", authMiddleware, adminOnly, deleteUser);

// Message management routes
router.get("/messages", authMiddleware, adminOnly, getAllMessages);
router.put("/messages/:messageId/status", authMiddleware, adminOnly, updateMessageStatus);

// Quota management
router.put("/users/:userId/quota", authMiddleware, adminOnly, setUserQuota);

export default router;
