import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";

import {
  createPrivateConversation,
  getUserConversations,
  getConversationById,
} from "../controllers/conversation.controller.js";

const router = Router();

router.use(authenticate);

router.post("/private", createPrivateConversation);

router.get("/", getUserConversations);

router.get("/:conversationId", getConversationById);

export default router;