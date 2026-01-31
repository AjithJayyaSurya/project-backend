import express from "express";
import { register, login, getProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// CREATE user
router.post("/register", register);

// LOGIN
router.post("/login", login);

// READ logged-in user
router.get("/me", authMiddleware, getProfile);

export default router;
