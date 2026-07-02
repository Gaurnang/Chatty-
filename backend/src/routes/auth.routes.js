import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get logged-in user
router.get("/me", authenticate, getCurrentUser);

export default router;