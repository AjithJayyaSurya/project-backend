import express from "express";
import {
  createUserWithQuota,
  getAllUsers,
  deleteUser
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

export default router;
