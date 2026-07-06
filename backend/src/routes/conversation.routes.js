import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
  createPrivateConversation,
  createGroupConversation,
  getMyConversations,
  getConversationById,
  renameGroup,
  addMembers,
  removeMember,
  leaveGroup,
} from "../controllers/conversation.controller.js";

const router = Router();

// Protect all conversation routes
router.use(authenticate);


router.post("/private", createPrivateConversation);

router.post("/group", createGroupConversation);

router.get("/", getMyConversations);

router.get("/:conversationId", getConversationById);

router.patch("/:conversationId", renameGroup);

router.post("/:conversationId/members", addMembers);

router.delete("/:conversationId/members/:userId", removeMember);

router.delete("/:conversationId/leave", leaveGroup);

export default router;