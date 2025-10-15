import { Router } from 'express';
import { signUpSchema } from '../schemas/authSchema.js';
import validateBody from '../middlewares/validateBody.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { registerUserController, loginUserController, refreshSessionController, logOutUserController } from '../controllers/auth.js';

const router = new Router();

router.post(
  '/register',
  validateBody(signUpSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(signUpSchema),
  ctrlWrapper(loginUserController),
);

router.post(
  '/refresh',
  ctrlWrapper(refreshSessionController),
);

router.post(
  '/logout',
  ctrlWrapper(logOutUserController),
);

export default router;
