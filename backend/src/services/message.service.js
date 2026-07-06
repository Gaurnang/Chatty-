import {
  createMessage,
  findMessagesByConversation,
  findMessageById,
  updateMessage,
  deleteMessage,
  isConversationParticipant,
} from "../repositories/message.repository.js";

/**
 * Send Message
 */
export const sendMessageService = async (
  senderId,
  conversationId,
  content
) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required.");
  }

  if (!content || !content.trim()) {
    throw new Error("Message cannot be empty.");
  }

  const participant = await isConversationParticipant(
    conversationId,
    senderId
  );

  if (!participant) {
    throw new Error(
      "You are not a participant of this conversation."
    );
  }

  return await createMessage(
    conversationId,
    senderId,
    content.trim()
  );
};

/**
 * Get Conversation Messages
 */
export const getMessagesService = async (
  userId,
  conversationId
) => {
  const participant = await isConversationParticipant(
    conversationId,
    userId
  );

  if (!participant) {
    throw new Error(
      "You are not a participant of this conversation."
    );
  }

  return await findMessagesByConversation(
    conversationId
  );
};

/**
 * Update Message
 */
export const updateMessageService = async (
  userId,
  messageId,
  content
) => {
  if (!content || !content.trim()) {
    throw new Error("Message cannot be empty.");
  }

  const message = await findMessageById(
    messageId
  );

  if (!message) {
    throw new Error("Message not found.");
  }

  if (message.sender_id !== userId) {
    throw new Error(
      "You can only edit your own messages."
    );
  }

  return await updateMessage(
    messageId,
    content.trim()
  );
};

/**
 * Delete Message
 */
export const deleteMessageService = async (
  userId,
  messageId
) => {
  const message = await findMessageById(
    messageId
  );

  if (!message) {
    throw new Error("Message not found.");
  }

  if (message.sender_id !== userId) {
    throw new Error(
      "You can only delete your own messages."
    );
  }

  await deleteMessage(messageId);
};