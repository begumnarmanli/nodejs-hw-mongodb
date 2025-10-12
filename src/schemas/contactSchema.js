import Joi from 'joi';

export const addContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  isFavorite: Joi.boolean(),
  email: Joi.string().email(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  isFavorite: Joi.boolean(),
  email: Joi.string().email(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
}).min(1);
