import { refreshUserSession } from '../../services/auth/sessions.js';
import { THIRTY_MINUTES_FOR_TEST } from '../../constants/index.js'; // Оновити імпорт

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_MINUTES_FOR_TEST), // Оновити час
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.cookie('sessionId', session.sessionId, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_MINUTES_FOR_TEST), // Оновити час
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
};

export const refreshUserSessionController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  if (!refreshToken || !sessionId) {
    return res.status(401).json({
      message: 'Refresh token and session ID are required',
    });
  }

  try {
    const session = await refreshUserSession(sessionId, refreshToken);
    setupSession(res, session);

    res.json({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      sessionId: session.sessionId,
      userId: session.userId,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message || 'Failed to refresh session',
    });
  }
};
