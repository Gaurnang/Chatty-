import pool from "../db/db.js";

/**
 * Find user by email
 */
export const findUserByEmail = async (email) => {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1
  `;

  const { rows } = await pool.query(query, [email]);

  return rows[0] || null;
};

/**
 * Find user by username
 */
export const findUserByUsername = async (username) => {
  const query = `
    SELECT *
    FROM users
    WHERE username = $1
  `;

  const { rows } = await pool.query(query, [username]);

  return rows[0] || null;
};

/**
 * Create a new user
 */
export const createUser = async ({ username, email, password }) => {
  const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING
      id,
      username,
      email,
      bio,
      created_at,
      last_seen
  `;

  const values = [username, email, password];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

/**
 * Find user by ID
 */
export const findUserById = async (id) => {
  const query = `
    SELECT
      id,
      username,
      email,
      bio,
      created_at,
      last_seen
    FROM users
    WHERE id = $1
  `;

  const { rows } = await pool.query(query, [id]);

  return rows[0] || null;
};