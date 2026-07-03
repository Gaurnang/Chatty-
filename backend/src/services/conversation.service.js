import {
  findExistingPrivateConversation,
  createConversation,
  addParticipant,
  findUserConversations,
  findConversationById,
  isParticipant,
} from "../repositories/conversation.repository.js";

import { findUserById } from "../repositories/user.repository.js";

export const createPrivateConversationService = async (
  senderId,
  receiverId
) => {
  // Prevent chatting with yourself
  if (senderId === receiverId) {
    throw new Error("You cannot start a conversation with yourself.");
  }

  // Check receiver exists
  const receiver = await findUserById(receiverId);

  if (!receiver) {
    throw new Error("Receiver not found.");
  }

  // Check if conversation already exists
  const existingConversation =
    await findExistingPrivateConversation(senderId, receiverId);

  if (existingConversation) {
    return existingConversation;
  }

  // Create conversation
  const conversation = await createConversation(senderId);

  // Add sender
  await addParticipant(conversation.id, senderId);

  // Add receiver
  await addParticipant(conversation.id, receiverId);

  return conversation;
};

export const getUserConversationsService = async (userId) => {
  return await findUserConversations(userId);
};

export const getConversationByIdService = async (
  conversationId,
  userId
) => {
  const conversation = await findConversationById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  const participant = await isParticipant(
    conversationId,
    userId
  );

  if (!participant) {
    throw new Error("Access denied.");
  }

  return conversation;
};