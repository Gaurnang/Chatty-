import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
  searchUserByEmail,
  getUserById,
  updateProfile,
} from "../controllers/user.controller.js";

const router = Router();

router.use(authenticate);

router.get("/search", searchUserByEmail);

router.patch("/profile", updateProfile);

router.get("/:id", getUserById);

export default router;