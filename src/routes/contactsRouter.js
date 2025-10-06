import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', getAllContactsController);

router.get('/:contactId', getContactByIdController);

router.post('/', createContactController);

router.put('/:contactId', patchContactController);

router.delete('/:contactId', deleteContactController);

export default router;
