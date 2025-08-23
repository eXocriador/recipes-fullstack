import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
import createHttpError from 'http-errors';
import Session from '../../db/models/auth/session.js';
import User from '../../db/models/auth/user.js'; // Додай імпорт моделі User
import { TEN_SECONDS, THIRTY_MINUTES_FOR_TEST } from '../../constants/index.js'; // Онови імпорт констант
// Для продакшену використовуй:
// import { THIRTY_MINUTES, SEVEN_DAYS } from '../../constants/index.js';

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

  // Завантаж користувача, щоб отримати актуальні дані
  const user = await User.findById(session.userId);
  if (!user) {
    throw createHttpError(401, 'User associated with session not found');
  }

  // Створи новий accessToken з актуальними даними
  const newAccessToken = jwt.sign(
    {
      userId: user._id,
      email: user.email, // ВИПРАВЛЕНО: більше не хардкод
      name: user.name, // ВИПРАВЛЕНО: більше не хардкод
    },
    JWT_SECRET,
    { expiresIn: '10s' }, // Для тестування. Для продакшену: '30m'
  );

  const newRefreshToken = jwt.sign(
    {
      userId: session.userId,
    },
    JWT_SECRET,
    { expiresIn: '30m' }, // Для тестування. Для продакшену: '7d'
  );

  // Онови сесію з коректним часом
  const updatedSession = await Session.findByIdAndUpdate(
    sessionId,
    {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + TEN_SECONDS),
      refreshTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES_FOR_TEST),
      // Для продакшену:
      // accessTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES),
      // refreshTokenValidUntil: new Date(Date.now() + SEVEN_DAYS),
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
