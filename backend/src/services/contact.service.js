import {
  saveContact,
  findContactByOwnerAndUser,
  findAllContacts,
  updateContactNickname,
  deleteContact,
  findContactById,
} from "../repositories/contact.repository.js";

import { findUserById } from "../repositories/user.repository.js";


export const saveContactService = async (
  ownerId,
  contactData
) => {
  const { contactId, nickname } = contactData;

  if (!contactId) {
    throw new Error("Contact ID is required.");
  }

  // Prevent saving yourself
  if (ownerId === Number(contactId)) {
    throw new Error("You cannot save yourself as a contact.");
  }

  const user = await findUserById(contactId);

  if (!user) {
    throw new Error("User not found.");
  }

  const existingContact =
    await findContactByOwnerAndUser(
      ownerId,
      contactId
    );

  if (existingContact) {
    throw new Error("Contact already exists.");
  }

  return await saveContact(
    ownerId,
    contactId,
    nickname || null
  );
};


export const getMyContactsService = async (
  ownerId
) => {
  return await findAllContacts(ownerId);
};


export const updateContactService = async (
  ownerId,
  contactRecordId,
  contactData
) => {
  const { nickname } = contactData;

  const contact = await findContactById(
    contactRecordId
  );

  if (!contact) {
    throw new Error("Contact not found.");
  }

  if (contact.owner_id !== ownerId) {
    throw new Error("Unauthorized.");
  }

  return await updateContactNickname(
    contactRecordId,
    nickname || null
  );
};


export const deleteContactService = async (
  ownerId,
  contactRecordId
) => {
  const contact = await findContactById(
    contactRecordId
  );

  if (!contact) {
    throw new Error("Contact not found.");
  }

  if (contact.owner_id !== ownerId) {
    throw new Error("Unauthorized.");
  }

  await deleteContact(contactRecordId);
};