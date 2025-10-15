import { Contact } from '../models/Contact.js';

export const getAllContacts = async (query, userId) => {
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

  const filter = { userId };
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

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (contactData, userId) => {
  return await Contact.create({ ...contactData, userId });
};

export const updateContact = async (contactId, updatedData, userId) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updatedData,
    { new: true },
  );
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
