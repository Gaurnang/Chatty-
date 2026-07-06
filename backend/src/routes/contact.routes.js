import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
  saveContact,
  getMyContacts,
  updateContact,
  deleteContact,
} from "../controllers/contact.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", saveContact);

router.get("/", getMyContacts);

router.patch("/:contactId", updateContact);

router.delete("/:contactId", deleteContact);

export default router;