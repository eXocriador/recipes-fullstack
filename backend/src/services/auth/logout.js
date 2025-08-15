import Session from '../../db/models/auth/session.js';
import createHttpError from 'http-errors';

export const logoutUser = async (sessionId) => {
  const session = await Session.findById(sessionId);

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  await Session.findByIdAndDelete(sessionId);

  return { message: 'Successfully logged out' };
};
