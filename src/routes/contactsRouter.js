import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from '#root/controllers/contactsController.js';
import ctrlWrapper from '#root/utils/ctrlWrapper.js';
import validateBody from '#root/middlewares/validateBody.js';
import {
  addContactSchema,
  updateContactSchema,
} from '#root/schemas/contactSchema.js';
import { isValidId } from '#root/middlewares/isValidId.js';
import { authenticate } from '#root/middlewares/authenticate.js';

const router = express.Router();

router.get('/', authenticate, ctrlWrapper(getAllContactsController));

router.get(
  '/:contactId',
  authenticate,
  isValidId,
  ctrlWrapper(getContactByIdController),
);

router.post(
  '/',
  authenticate,
  validateBody(addContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:contactId',
  authenticate,
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

router.delete(
  '/:contactId',
  authenticate,
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default router;
