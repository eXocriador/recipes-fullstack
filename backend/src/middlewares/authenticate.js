import createHttpError from 'http-errors';
import Session from '../db/models/auth/session.js';
import User from '../db/models/auth/user.js';

export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Missing or invalid Authorization header');
    }

    const accessToken = authHeader.split(' ')[1];
    const session = await Session.findOne({ accessToken });

    if (!session) {
      throw createHttpError(401, 'Invalid access token');
    }

    if (new Date() > session.accessTokenValidUntil) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(session.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
};
