import createHttpError from 'http-errors';
import User from '../../db/models/auth/user.js';
import { THIRTY_SECONDS, ONE_HOUR } from '../../constants/index.js';
import Session from '../../db/models/auth/session.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
  const accessToken = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '30m' },
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
    },
    JWT_SECRET,
    { expiresIn: '7d' },
  );

  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + THIRTY_SECONDS),
    refreshTokenValidUntil: new Date(Date.now() + ONE_HOUR),
  });
};
