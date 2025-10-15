import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import {
  addContactSchema,
  updateContactSchema,
} from '../schemas/contactSchema.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js'

const router = express.Router();

router.get('/', authenticate, ctrlWrapper(getAllContactsController));

router.get('/:contactId',authenticate, isValidId, ctrlWrapper(getContactByIdController));

router.post(
  '/', authenticate,
  validateBody(addContactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:contactId', authenticate,
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

router.delete('/:contactId', authenticate, isValidId, ctrlWrapper(deleteContactController));

export default router;
