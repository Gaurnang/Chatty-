import pool from "../db/db.js";

/**
 * Find existing private conversation
 * between two users.
 */
export const findPrivateConversation = async (
  currentUserId,
  otherUserId
) => {
  const query = `
    SELECT c.*
    FROM conversations c
    JOIN participants p1
      ON c.id = p1.conversation_id
    JOIN participants p2
      ON c.id = p2.conversation_id
    WHERE
      c.conv_type = 'private'
      AND p1.user_id = $1
      AND p2.user_id = $2
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [
    currentUserId,
    otherUserId,
  ]);

  return rows[0] || null;
};

/**
 * Create private conversation
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
  userId,
  role = "member"
) => {
  const query = `
    INSERT INTO participants (
      conversation_id,
      user_id,
      role
    )
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [
    conversationId,
    userId,
    role,
  ]);

  return rows[0];
};

/**
 * Conversation Feed
 */
export const findConversationFeed = async (
  currentUserId
) => {
  const query = `
    SELECT
        c.id,
        c.conv_type,

        CASE
            WHEN c.conv_type = 'group'
                THEN c.group_name
            ELSE
                COALESCE(ct.nickname, u.display_name)
        END AS title,

        u.id AS user_id,
        u.display_name,
        u.email,

        c.created_at

    FROM conversations c

    JOIN participants p
        ON c.id = p.conversation_id

    LEFT JOIN participants other_p
        ON c.id = other_p.conversation_id
        AND other_p.user_id <> $1

    LEFT JOIN users u
        ON other_p.user_id = u.id

    LEFT JOIN contacts ct
        ON ct.owner_id = $1
        AND ct.contact_id = u.id

    WHERE
        p.user_id = $1

    ORDER BY c.created_at DESC;
  `;

  const { rows } = await pool.query(query, [
    currentUserId,
  ]);

  return rows;
};

/**
 * Get conversation details
 */
export const findConversationById = async (
  conversationId,
  currentUserId
) => {
  const query = `
    SELECT
        c.id,
        c.conv_type,
        c.group_name,
        c.created_by,
        c.created_at
    FROM conversations c

    JOIN participants p
        ON c.id = p.conversation_id

    WHERE
        c.id = $1
        AND p.user_id = $2;
  `;

  const { rows } = await pool.query(query, [
    conversationId,
    currentUserId,
  ]);

  return rows[0] || null;
};

/**
 * Get participants of a conversation
 */
export const findParticipants = async (
  conversationId
) => {
  const query = `
    SELECT
        u.id,
        u.display_name,
        u.email,
        p.role,
        p.joined_at
    FROM participants p

    JOIN users u
        ON p.user_id = u.id

    WHERE
        p.conversation_id = $1

    ORDER BY
        u.display_name;
  `;

  const { rows } = await pool.query(query, [
    conversationId,
  ]);

  return rows;
};

/**
 * Create Group Conversation
 */
export const createGroupConversation = async (
  createdBy,
  groupName
) => {
  const query = `
    INSERT INTO conversations (
      conv_type,
      group_name,
      created_by
    )
    VALUES (
      'group',
      $1,
      $2
    )
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [
    groupName,
    createdBy,
  ]);

  return rows[0];
};

/**
 * Check if user is admin
 */
export const isGroupAdmin = async (
  conversationId,
  userId
) => {
  const query = `
    SELECT *
    FROM participants
    WHERE
      conversation_id = $1
      AND user_id = $2
      AND role = 'admin';
  `;

  const { rows } = await pool.query(query, [
    conversationId,
    userId,
  ]);

  return rows[0] || null;
};

/**
 * Update group name
 */
export const updateGroupName = async (
  conversationId,
  groupName
) => {
  const query = `
    UPDATE conversations
    SET group_name = $1
    WHERE id = $2
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [
    groupName,
    conversationId,
  ]);

  return rows[0];
};

/**
 * Check if user is already a participant
 */
export const isParticipant = async (
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
 * Remove participant
 */
export const removeParticipant = async (
  conversationId,
  userId
) => {
  const query = `
    DELETE FROM participants
    WHERE
      conversation_id = $1
      AND user_id = $2;
  `;

  await pool.query(query, [
    conversationId,
    userId,
  ]);
};

/**
 * Get all participants of a group
 */
export const getGroupParticipants = async (
  conversationId
) => {
  const query = `
    SELECT *
    FROM participants
    WHERE conversation_id = $1
    ORDER BY joined_at;
  `;

  const { rows } = await pool.query(query, [
    conversationId,
  ]);

  return rows;
};

/**
 * Promote member to admin
 */
export const promoteAdmin = async (
  conversationId,
  userId
) => {
  const query = `
    UPDATE participants
    SET role = 'admin'
    WHERE
      conversation_id = $1
      AND user_id = $2;
  `;

  await pool.query(query, [
    conversationId,
    userId,
  ]);
};

/**
 * Delete conversation
 */
export const deleteConversation = async (
  conversationId
) => {
  const query = `
    DELETE FROM conversations
    WHERE id = $1;
  `;

  await pool.query(query, [
    conversationId,
  ]);
};