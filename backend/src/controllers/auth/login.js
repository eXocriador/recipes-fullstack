import { ONE_HOUR } from '../../constants/index.js';
import { loginUser } from '../../services/auth/login.js';

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  const user = session.user || req.user || null;
  let userData = user;
  if (!userData) {
    const User = (await import('../../db/models/auth/user.js')).default;
    userData = await User.findById(session.userId).select('_id name email');
  }

  // Для same-origin запитів (через Vercel rewrites) куки мають бути Lax
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_HOUR),
    secure: true, // HTTPS
    sameSite: 'Lax', // Same-origin
    path: '/',
    // domain не потрібен для same-origin
  };

  res.cookie('refreshToken', session.refreshToken, cookieOptions);
  res.cookie('sessionId', session._id, cookieOptions);
  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
      user: userData,
    },
  });
};
