import pool from "../db/db.js";


export const findUserByEmail = async (
  currentUserId,
  email
) => {
  const query = `
    SELECT
      u.id,
      COALESCE(c.nickname, u.display_name) AS name,
      u.display_name,
      u.email,
      u.bio,
      u.last_seen,
      (c.id IS NOT NULL) AS is_contact
    FROM users u
    LEFT JOIN contacts c
      ON c.contact_id = u.id
      AND c.owner_id = $1
    WHERE u.email = $2;
  `;

  const { rows } = await pool.query(query, [
    currentUserId,
    email,
  ]);

  return rows[0] || null;
};

export const findUserById = async (userId) => {
  const query = `
    SELECT
      id,
      display_name,
      email,
      bio,
      created_at,
      last_seen
    FROM users
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows[0] || null;
};


export const updateUserProfile = async (
  userId,
  { displayName, bio }
) => {
  const query = `
    UPDATE users
    SET
      display_name = $1,
      bio = $2
    WHERE id = $3
    RETURNING
      id,
      display_name,
      email,
      bio,
      created_at,
      last_seen;
  `;

  const values = [
    displayName,
    bio,
    userId,
  ];

  const { rows } = await pool.query(
    query,
    values
  );

  return rows[0];
};