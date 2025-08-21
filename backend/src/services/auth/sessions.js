import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import Session from '../../db/models/auth/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../../constants/index.js';

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

  const newAccessToken = randomBytes(30).toString('base64');
  const newRefreshToken = randomBytes(30).toString('base64');

  const updatedSession = await Session.findByIdAndUpdate(
    sessionId,
    {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
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
