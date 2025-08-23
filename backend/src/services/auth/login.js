import createHttpError from 'http-errors';
import User from '../../db/models/auth/user.js';
import Session from '../../db/models/auth/session.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TEN_SECONDS, THIRTY_MINUTES_FOR_TEST } from '../../constants/index.js';
// Для продакшену використовуй:
// import { THIRTY_MINUTES, SEVEN_DAYS } from '../../constants/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }
  await Session.deleteOne({ userId: user._id });

  // Онови accessToken
  const accessToken = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '10s' }, // Для тестування. Для продакшену: '30m'
  );

  // Онови refreshToken
  const refreshToken = jwt.sign(
    {
      userId: user._id,
    },
    JWT_SECRET,
    { expiresIn: '30m' }, // Для тестування. Для продакшену: '7d'
  );

  // Створи сесію з коректним часом
  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + TEN_SECONDS), // Синхронізовано з JWT
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES_FOR_TEST), // Синхронізовано з JWT
    // Для продакшену:
    // accessTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES),
    // refreshTokenValidUntil: new Date(Date.now() + SEVEN_DAYS),
  });
};
