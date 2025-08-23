import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
import createHttpError from 'http-errors';
import Session from '../../db/models/auth/session.js';
import { THIRTY_SECONDS, ONE_HOUR } from '../../constants/index.js';

export const refreshUserSession = async (sessionId, refreshToken) => {
  const session = await Session.findById(sessionId);

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    await Session.findByIdAndDelete(sessionId);
    throw createHttpError(401, 'Refresh token expired');
  }

  const newAccessToken = jwt.sign(
    {
      userId: session.userId,
      email: 'user@example.com',
      name: 'User',
    },
    JWT_SECRET,
    { expiresIn: '30m' },
  );

  const newRefreshToken = jwt.sign(
    {
      userId: session.userId,
    },
    JWT_SECRET,
    { expiresIn: '7d' },
  );

  const updatedSession = await Session.findByIdAndUpdate(
    sessionId,
    {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + THIRTY_SECONDS),
      refreshTokenValidUntil: new Date(Date.now() + ONE_HOUR),
    },
    { new: true },
  );

  return {
    accessToken: updatedSession.accessToken,
    refreshToken: updatedSession.refreshToken,
    sessionId: updatedSession._id,
    userId: updatedSession.userId,
  };
};
