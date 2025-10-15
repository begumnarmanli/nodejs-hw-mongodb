import createHttpError from 'http-errors';
import { Session } from '#root/models/session.js';
import { User } from '#root/models/user.js';

export const authenticate = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return next(createHttpError(401, 'Authorization header missing'));
  }

  const [bearer, accessToken] = authorizationHeader.split(' ');
  if (bearer !== 'Bearer' || !accessToken) {
    return next(createHttpError(401, 'Invalid authorization header format'));
  }

  const session = await Session.findOne({ accessToken });
  if (!session || new Date() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);
  if (!user) {
    return next(createHttpError(401, 'User not found for session'));
  }
  req.user = user;
  next();
};
