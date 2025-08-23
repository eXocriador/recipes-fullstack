import { refreshUserSession } from '../../services/auth/sessions.js';
import { ONE_HOUR } from '../../constants/index.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_HOUR),
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.cookie('sessionId', session.sessionId, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_HOUR),
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
};

export const refreshUserSessionController = async (req, res) => {
  console.log('🍪 Refresh request cookies:', req.cookies);
  console.log('🔑 Session ID:', req.cookies.sessionId);
  console.log(
    '🔄 Refresh Token:',
    req.cookies.refreshToken
      ? req.cookies.refreshToken.substring(0, 10) + '...'
      : 'null',
  );

  const session = await refreshUserSession(
    req.cookies.sessionId,
    req.cookies.refreshToken,
  );

  setupSession(res, session);

  const User = (await import('../../db/models/auth/user.js')).default;
  const user = await User.findById(session.userId).select('_id name email');

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
      user,
    },
  });
};
