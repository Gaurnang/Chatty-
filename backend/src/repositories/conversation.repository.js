import pool from "../db/db.js";

/**
 * Find an existing private conversation
 * between two users.
 */
export const findExistingPrivateConversation = async (
  senderId,
  receiverId
) => {
  const query = `
    SELECT c.id, c.conv_type, c.created_by, c.created_at
    FROM conversations c
    JOIN participants p1
      ON c.id = p1.conversation_id
    JOIN participants p2
      ON c.id = p2.conversation_id
    WHERE c.conv_type = 'private'
      AND p1.user_id = $1
      AND p2.user_id = $2
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [
    senderId,
    receiverId,
  ]);

  return rows[0] || null;
};

/**
 * Create a private conversation
 */
export const createConversation = async (createdBy) => {
  const query = `
    INSERT INTO conversations (
      conv_type,
      created_by
    )
    VALUES (
      'private',
      $1
    )
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [createdBy]);

  return rows[0];
};

/**
 * Add participant
 */
export const addParticipant = async (
  conversationId,
  userId
) => {
  const query = `
    INSERT INTO participants (
      conversation_id,
      user_id
    )
    VALUES ($1, $2);
  `;

  await pool.query(query, [conversationId, userId]);
};

/**
 * Get all conversations of a user
 */
export const findUserConversations = async (userId) => {
  const query = `
    SELECT
      c.id,
      c.conv_type,
      c.group_name,
      c.created_at
    FROM conversations c
    JOIN participants p
      ON c.id = p.conversation_id
    WHERE p.user_id = $1
    ORDER BY c.created_at DESC;
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows;
};

/**
 * Get conversation by ID
 */
export const findConversationById = async (
  conversationId
) => {
  const query = `
    SELECT *
    FROM conversations
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [
    conversationId,
  ]);

  return rows[0] || null;
};

/**
 * Check whether a user belongs
 * to a conversation.
 */
export const isParticipant = async (
  conversationId,
  userId
) => {
  const query = `
    SELECT id
    FROM participants
    WHERE conversation_id = $1
      AND user_id = $2;
  `;

  const { rows } = await pool.query(query, [
    conversationId,
    userId,
  ]);

  return rows[0] || null;
};