import {
  loginUser,
  registerUser,
  refreshSession,
  logOutUser,
  requestResetToken,
} from '#root/services/auth.js';
import ctrlWrapper from '#root/utils/ctrlWrapper.js';
import { resetPassword } from '#root/services/auth.js';

export const registerUserController = ctrlWrapper(async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
});

export const loginUserController = ctrlWrapper(async (req, res) => {
  const { accessToken, refreshToken } = await loginUser(req.body);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: 'User logged in successfully',
    status: 200,
    data: {
      accessToken: accessToken,
    },
  });
});

export const refreshSessionController = ctrlWrapper(async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken, refreshToken: newRefreshToken } = await refreshSession(
    refreshToken,
  );

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed session!',
    data: {
      accessToken,
    },
  });
});

export const logOutUserController = ctrlWrapper(async (req, res) => {
  const { refreshToken } = req.cookies;
  await logOutUser(refreshToken);
  res.clearCookie('refreshToken');
  res.status(204).send({});
});

export const resetPasswordController = ctrlWrapper(async (req, res) => {
  const payload = req.body;
  await resetPassword(payload);
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
});

export const requestResetEmailController = ctrlWrapper(async (req, res) => {
  const { email } = req.body;
  await requestResetToken(email);
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
});
