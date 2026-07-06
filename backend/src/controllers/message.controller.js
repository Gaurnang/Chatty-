import {
  sendMessageService,
  getMessagesService,
  updateMessageService,
  deleteMessageService,
} from "../services/message.service.js";

/**
 * @desc Send a message
 * @route POST /api/messages
 */
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    const message = await sendMessageService(
      req.user.id,
      conversationId,
      content
    );

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await getMessagesService(
      req.user.id,
      conversationId
    );

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Update a message
 * @route PATCH /api/messages/:messageId
 */
export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await updateMessageService(
      req.user.id,
      messageId,
      content
    );

    return res.status(200).json({
      success: true,
      message: "Message updated successfully.",
      data: message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    await deleteMessageService(
      req.user.id,
      messageId
    );

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};