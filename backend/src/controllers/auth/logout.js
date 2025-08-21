import { logoutUser } from '../../services/auth/logout.js';

export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await logoutUser(sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.json({
    status: 200,
    message: 'Successfully logged out!',
  });
};
