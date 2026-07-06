import {
  findPrivateConversation,
  createConversation,
  createGroupConversation,
  addParticipant,
  findConversationById,
  findConversationFeed,
  isGroupAdmin,
  updateGroupName,
  isParticipant,
  removeParticipant,
  getGroupParticipants,
  promoteAdmin,
  deleteConversation,
} from "../repositories/conversation.repository.js";

import { findUserById } from "../repositories/user.repository.js";

/**
 * Create or Get Private Conversation
 */
export const createPrivateConversationService = async (
  currentUserId,
  userId
) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  userId = Number(userId);

  if (currentUserId === userId) {
    throw new Error(
      "You cannot start a conversation with yourself."
    );
  }

  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  const existingConversation =
    await findPrivateConversation(
      currentUserId,
      userId
    );

  if (existingConversation) {
    return existingConversation;
  }

  const conversation = await createConversation(
    currentUserId
  );

  await addParticipant(
    conversation.id,
    currentUserId,
    "member"
  );

  await addParticipant(
    conversation.id,
    userId,
    "member"
  );

  return conversation;
};

/**
 * Create Group Conversation
 */
export const createGroupConversationService = async (
  currentUserId,
  groupName,
  members
) => {
  if (!groupName || !groupName.trim()) {
    throw new Error("Group name is required.");
  }

  if (!Array.isArray(members) || members.length < 2) {
    throw new Error(
      "A group must contain at least two members."
    );
  }

  members = [...new Set(members.map(Number))];

  members = members.filter(
    (id) => id !== currentUserId
  );

  for (const memberId of members) {
    const user = await findUserById(memberId);

    if (!user) {
      throw new Error(
        `User ${memberId} does not exist.`
      );
    }
  }

  const conversation =
    await createGroupConversation(
      currentUserId,
      groupName
    );

  await addParticipant(
    conversation.id,
    currentUserId,
    "admin"
  );

  for (const memberId of members) {
    await addParticipant(
      conversation.id,
      memberId,
      "member"
    );
  }

  return conversation;
};

/**
 * Get Conversation Feed
 */
export const getMyConversationsService = async (
  currentUserId
) => {
  return await findConversationFeed(currentUserId);
};

/**
 * Get Conversation Details
 */
export const getConversationByIdService = async (
  currentUserId,
  conversationId
) => {
  const conversation =
    await findConversationById(
      conversationId,
      currentUserId
    );

  if (!conversation) {
    throw new Error(
      "Conversation not found."
    );
  }

  return conversation;
};

/**
 * Rename Group
 */
export const renameGroupService = async (
  currentUserId,
  conversationId,
  groupName
) => {
  if (!groupName || !groupName.trim()) {
    throw new Error(
      "Group name is required."
    );
  }

  const conversation =
    await findConversationById(
      conversationId,
      currentUserId
    );

  if (!conversation) {
    throw new Error(
      "Conversation not found."
    );
  }

  if (conversation.conv_type !== "group") {
    throw new Error(
      "Only group conversations can be renamed."
    );
  }

  const admin = await isGroupAdmin(
    conversationId,
    currentUserId
  );

  if (!admin) {
    throw new Error(
      "Only admins can rename the group."
    );
  }

  return await updateGroupName(
    conversationId,
    groupName
  );
};

/**
 * Add Members
 */
export const addMembersService = async (
  currentUserId,
  conversationId,
  members
) => {
  const admin = await isGroupAdmin(
    conversationId,
    currentUserId
  );

  if (!admin) {
    throw new Error(
      "Only admins can add members."
    );
  }

  members = [...new Set(members.map(Number))];

  for (const memberId of members) {
    const user = await findUserById(memberId);

    if (!user) {
      throw new Error(
        `User ${memberId} does not exist.`
      );
    }

    const exists = await isParticipant(
      conversationId,
      memberId
    );

    if (!exists) {
      await addParticipant(
        conversationId,
        memberId,
        "member"
      );
    }
  }

  return {
    message: "Members added successfully."
  };
};

/**
 * Remove Member
 */
export const removeMemberService = async (
  currentUserId,
  conversationId,
  userId
) => {
  userId = Number(userId);

  const admin = await isGroupAdmin(
    conversationId,
    currentUserId
  );

  if (!admin) {
    throw new Error(
      "Only admins can remove members."
    );
  }

  if (currentUserId === userId) {
    throw new Error(
      "Use leave group instead."
    );
  }

  const exists = await isParticipant(
    conversationId,
    userId
  );

  if (!exists) {
    throw new Error(
      "Member not found."
    );
  }

  await removeParticipant(
    conversationId,
    userId
  );
};

/**
 * Leave Group
 */
export const leaveGroupService = async (
  currentUserId,
  conversationId
) => {
  const exists = await isParticipant(
    conversationId,
    currentUserId
  );

  if (!exists) {
    throw new Error(
      "You are not a participant."
    );
  }

  const admin = await isGroupAdmin(
    conversationId,
    currentUserId
  );

  await removeParticipant(
    conversationId,
    currentUserId
  );

  const participants =
    await getGroupParticipants(
      conversationId
    );

  if (participants.length === 0) {
    await deleteConversation(
      conversationId
    );
    return;
  }

  if (admin) {
    await promoteAdmin(
      conversationId,
      participants[0].user_id
    );
  }
};