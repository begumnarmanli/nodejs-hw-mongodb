import { Router } from 'express';
import { signUpSchema, signInSchema } from '#root/schemas/authSchema.js';
import validateBody from '#root/middlewares/validateBody.js';
import ctrlWrapper from '#root/utils/ctrlWrapper.js';
import {
  registerUserController,
  loginUserController,
  refreshSessionController,
  logOutUserController,
  requestResetEmailController,
  resetPasswordController,
} from '#root/controllers/auth.js';
import {
  requestResetEmailSchema,
  resetPasswordSchema,
} from '#root/schemas/authSchema.js';

const router = new Router();

router.post(
  '/register',
  validateBody(signUpSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(signInSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshSessionController));

router.post('/logout', ctrlWrapper(logOutUserController));

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
