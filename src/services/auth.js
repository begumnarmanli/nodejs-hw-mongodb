import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '#root/models/user.js';
import { randomBytes } from 'crypto';
import { Session } from '#root/models/session.js';

const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000;
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000;

const createSession = async (userId) => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_LIFETIME);
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_LIFETIME);

  await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  return { accessToken, refreshToken };
};

export const registerUser = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await User.create({
    ...payload,
    password: encryptedPassword,
  });

  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = newUser.toObject();

  return userWithoutPassword;
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteOne({ userId: user._id });

  const { accessToken, refreshToken } = await createSession(user._id);
  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = user.toObject();
  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const refreshSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session || new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session invalid or expired');
  }

  const user = await User.findById(session.userId);
  if (!user) {
    throw createHttpError(401, 'User not found for session');
  }

  await Session.deleteOne({ _id: session._id });

  const { accessToken, refreshToken: newRefreshToken } = await createSession(
    user._id,
  );

  // eslint-disable-next-line no-unused-vars
  const { password: _, ...userWithoutPassword } = user.toObject();
  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const logOutUser = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Invalid session');
  }
  await Session.deleteOne({ _id: session._id });
};
