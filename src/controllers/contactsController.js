import {
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  getAllContacts,
} from '#root/services/contactsService.js';
import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '#root/utils/saveFileToCloudinary.js';

export const getAllContactsController = async (req, res) => {
  const userId = req.user._id;
  const result = await getAllContacts(req.query, userId);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result.data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }

  const contact = await createContact(
    {
      ...req.body,
      photo: photoUrl,
    },
    userId,
  );

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const photo = req.file;
  let photoUrl;
  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }
  const result = await updateContact(
    contactId,
    {
      ...req.body,
      photo: photoUrl,
    },
    userId,
  );
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact',
    data: result,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
