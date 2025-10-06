import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from './services/contactsService.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res
        .status(200)
        .json({
          status: 200,
          message: 'Successfully found contacts!',
          data: contacts,
        });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);
      if (!contact)
        return res.status(404).json({ message: 'Contact not found' });
      res
        .status(200)
        .json({
          status: 200,
          message: `Successfully found contact with id ${contactId}!`,
          data: contact,
        });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  app.post('/contacts', async (req, res) => {
    try {
      const contact = await createContact(req.body);
      res
        .status(201)
        .json({
          status: 201,
          message: 'Successfully created a contact!',
          data: contact,
        });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  app.put('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const updated = await updateContact(contactId, req.body);
      if (!updated)
        return res.status(404).json({ message: 'Contact not found' });
      res
        .status(200)
        .json({
          status: 200,
          message: 'Successfully updated contact!',
          data: updated,
        });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  app.delete('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const deleted = await deleteContact(contactId);
      if (!deleted)
        return res.status(404).json({ message: 'Contact not found' });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  app.use((req, res) => res.status(404).json({ message: 'Not found' }));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

  return app;
};
