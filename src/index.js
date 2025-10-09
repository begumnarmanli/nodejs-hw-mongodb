import { setupServer } from './server.js';
import { initMongoDB } from './db/initMongoConnection.js';
import dotenv from 'dotenv';

dotenv.config();

const bootstrap = async () => {
  await initMongoDB();
  const app = setupServer();
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
