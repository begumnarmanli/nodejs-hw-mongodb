import mongoose from 'mongoose';

export const isValidId = (req, res, next) =>
  mongoose.Types.ObjectId.isValid(req.params.contactId)
    ? next()
    : res.status(404).send({ message: 'Not found' });
