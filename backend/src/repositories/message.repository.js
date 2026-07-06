import pool from "../db/db.js";

/**
 * Check whether a user belongs to a conversation
 */
export const isConversationParticipant = async (
  conversationId,
  userId
) => {
  const query = `
    SELECT *
    FROM participants
    WHERE
      conversation_id = $1
      AND user_id = $2;
  `;

  const { rows } = await pool.query(query, [
    conversationId,
    userId,
  ]);

  return rows[0] || null;
};

/**
 * Create Message
 */
export const createMessage = async (
  conversationId,
  senderId,
  content
) => {
  const query = `
    INSERT INTO messages (
      conversation_id,
      sender_id,
      content
    )
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [
    conversationId,
    senderId,
    content,
  ]);

  return rows[0];
};

/**
 * Get all messages of a conversation
 */
export const findMessagesByConversation = async (
  conversationId
) => {
  const query = `
    SELECT
      m.id,
      m.content,
      m.sender_id,
      u.display_name,
      m.created_at
    FROM messages m

    JOIN users u
      ON m.sender_id = u.id

    WHERE
      m.conversation_id = $1

    ORDER BY
      m.created_at ASC;
  `;

  const { rows } = await pool.query(query, [
    conversationId,
  ]);

  return rows;
};

/**
 * Find message by ID
 */
export const findMessageById = async (
  messageId
) => {
  const query = `
    SELECT *
    FROM messages
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [
    messageId,
  ]);

  return rows[0] || null;
};

/**
 * Update Message
 */
export const updateMessage = async (
  messageId,
  content
) => {
  const query = `
    UPDATE messages
    SET content = $1
    WHERE id = $2
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [
    content,
    messageId,
  ]);

  return rows[0];
};

/**
 * Delete Message
 */
export const deleteMessage = async (
  messageId
) => {
  const query = `
    DELETE FROM messages
    WHERE id = $1;
  `;

  await pool.query(query, [
    messageId,
  ]);
};