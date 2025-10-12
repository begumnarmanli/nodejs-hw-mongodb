import { Contact } from '../models/Contact.js';

export const getAllContacts = async (query) => {
  let {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    isFavourite,
    type,
  } = query;

  page = parseInt(page);
  perPage = parseInt(perPage);

  const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const filter = {};
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';
  if (type) filter.contactType = type;

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);

  const contacts = await Contact.find(filter)
    .sort(sortOptions)
    .skip((page - 1) * perPage)
    .limit(perPage);

  return {
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  };
};

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

export const updateContact = async (contactId, updatedData) => {
  return await Contact.findByIdAndUpdate(contactId, updatedData, { new: true });
};

export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
