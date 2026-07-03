import {
  createPrivateConversationService,
  getUserConversationsService,
  getConversationByIdService,
} from "../services/conversation.service.js";

/**
 * POST /api/conversations/private
 */
export const createPrivateConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    const conversation = await createPrivateConversationService(
      senderId,
      receiverId
    );

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully.",
      data: conversation,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/conversations
 */
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await getUserConversationsService(userId);

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/conversations/:conversationId
 */
export const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await getConversationByIdService(
      conversationId,
      userId
    );

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};