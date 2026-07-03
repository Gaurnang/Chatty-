import {
  saveContactService,
  getMyContactsService,
  updateContactService,
  deleteContactService,
} from "../services/contact.service.js";


export const saveContact = async (req, res) => {
  try {
    const contact = await saveContactService(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Contact saved successfully.",
      data: contact,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMyContacts = async (req, res) => {
  try {
    const contacts = await getMyContactsService(req.user.id);

    return res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    const updatedContact = await updateContactService(
      req.user.id,
      contactId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Contact updated successfully.",
      data: updatedContact,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc Delete contact
 * @route DELETE /api/contacts/:contactId
 */
export const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    await deleteContactService(
      req.user.id,
      contactId
    );

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};