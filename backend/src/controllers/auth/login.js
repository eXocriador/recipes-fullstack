import { ONE_HOUR } from '../../constants/index.js';
import { loginUser } from '../../services/auth/login.js';

export const loginUserController = async (req, res) => {
  console.log('🔐 Login request body:', req.body);
  const session = await loginUser(req.body);
  const user = session.user || req.user || null;
  let userData = user;
  if (!userData) {
    const User = (await import('../../db/models/auth/user.js')).default;
    userData = await User.findById(session.userId).select('_id name email');
  }
  console.log('🍪 Setting cookies - Session ID:', session._id);
  console.log(
    '🍪 Setting cookies - Refresh Token:',
    session.refreshToken.substring(0, 10) + '...',
  );
  console.log(
    '🍪 Cookie options - secure:',
    process.env.NODE_ENV === 'production',
    'sameSite:',
    process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  );

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_HOUR),
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_HOUR),
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
      user: userData,
    },
  });
};
