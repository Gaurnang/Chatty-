import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
  sendMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = Router();

// Protect all message routes
router.use(authenticate);

router.post("/", sendMessage);

router.get("/:conversationId", getMessages);

router.patch("/:messageId", updateMessage);

router.delete("/:messageId", deleteMessage);

export default router;