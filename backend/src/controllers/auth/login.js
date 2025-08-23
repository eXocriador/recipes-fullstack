import { loginUser } from '../../services/auth/login.js';
import { THIRTY_MINUTES_FOR_TEST } from '../../constants/index.js'; // Оновити імпорт

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_MINUTES_FOR_TEST), // Оновити час
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_MINUTES_FOR_TEST), // Оновити час
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    sessionId: session._id,
    userId: session.userId,
  });
};
