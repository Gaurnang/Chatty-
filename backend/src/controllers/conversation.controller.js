import {
  createPrivateConversationService,
  createGroupConversationService,
  getMyConversationsService,
  getConversationByIdService,
  renameGroupService,
  addMembersService,
  removeMemberService,
  leaveGroupService,
} from "../services/conversation.service.js";

export const createPrivateConversation = async (req, res) => {
  try {
    const { userId } = req.body;

    const conversation = await createPrivateConversationService(
      req.user.id,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Conversation fetched successfully.",
      data: conversation,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyConversations = async (req, res) => {
  try {
    const conversations = await getMyConversationsService(
      req.user.id
    );

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

export const getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await getConversationByIdService(
      req.user.id,
      conversationId
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

export const createGroupConversation = async (req, res) => {
  try {
    const { groupName, members } = req.body;

    const conversation =
      await createGroupConversationService(
        req.user.id,
        groupName,
        members
      );

    return res.status(201).json({
      success: true,
      message: "Group created successfully.",
      data: conversation,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const renameGroup = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { groupName } = req.body;

    const conversation =
      await renameGroupService(
        req.user.id,
        conversationId,
        groupName
      );

    return res.status(200).json({
      success: true,
      message: "Group renamed successfully.",
      data: conversation,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const addMembers = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { members } = req.body;

    const result =
      await addMembersService(
        req.user.id,
        conversationId,
        members
      );

    return res.status(200).json({
      success: true,
      message: "Members added successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { conversationId, userId } = req.params;

    await removeMemberService(
      req.user.id,
      conversationId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Member removed successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { conversationId } = req.params;

    await leaveGroupService(
      req.user.id,
      conversationId
    );

    return res.status(200).json({
      success: true,
      message: "Left group successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};