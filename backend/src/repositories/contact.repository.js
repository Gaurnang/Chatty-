import pool from "../db/db.js";


export const saveContact = async (
  ownerId,
  contactId,
  nickname
) => {
  const query = `
    INSERT INTO contacts (
      owner_id,
      contact_id,
      nickname
    )
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [
    ownerId,
    contactId,
    nickname,
  ]);

  return rows[0];
};


export const findContactByOwnerAndUser = async (
  ownerId,
  contactId
) => {
  const query = `
    SELECT *
    FROM contacts
    WHERE owner_id = $1
      AND contact_id = $2;
  `;

  const { rows } = await pool.query(query, [
    ownerId,
    contactId,
  ]);

  return rows[0] || null;
};


export const findAllContacts = async (ownerId) => {
  const query = `
    SELECT
      c.id,
      u.id AS contact_id,
      COALESCE(c.nickname, u.display_name) AS name,
      u.display_name,
      u.email,
      u.bio,
      u.last_seen,
      c.created_at
    FROM contacts c
    INNER JOIN users u
      ON c.contact_id = u.id
    WHERE c.owner_id = $1
    ORDER BY name;
  `;

  const { rows } = await pool.query(query, [ownerId]);

  return rows;
};


export const findContactById = async (
  contactRecordId
) => {
  const query = `
    SELECT *
    FROM contacts
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [
    contactRecordId,
  ]);

  return rows[0] || null;
};


export const updateContactNickname = async (
  contactRecordId,
  nickname
) => {
  const query = `
    UPDATE contacts
    SET nickname = $1
    WHERE id = $2
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [
    nickname,
    contactRecordId,
  ]);

  return rows[0];
};


export const deleteContact = async (
  contactRecordId
) => {
  const query = `
    DELETE FROM contacts
    WHERE id = $1;
  `;

  await pool.query(query, [contactRecordId]);
};