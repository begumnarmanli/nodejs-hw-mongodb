import { setupServer } from './server.js';
import { initMongoDB } from './db/initMongoConnection.js';
import dotenv from 'dotenv';
dotenv.config();
const bootstrap = async () => {
  await initMongoDB();
  setupServer();
};
bootstrap();
