import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { getCurrentUserInfo } from '../controllers/users/userController.js';

const usersRouter = Router();

usersRouter.get('/', authenticate, ctrlWrapper(getCurrentUserInfo));

usersRouter.get(
  '/profile',
  authenticate,
  ctrlWrapper(async (req, res) => {
    res.json({
      status: 200,
      message: 'Profile retrieved successfully!',
      data: {
        user: req.user,
      },
    });
  }),
);

usersRouter.get(
  '/session',
  authenticate,
  ctrlWrapper(async (req, res) => {
    res.json({
      status: 200,
      message: 'Session retrieved successfully!',
      data: {
        session: {
          id: req.session._id,
          accessTokenValidUntil: req.session.accessTokenValidUntil,
          refreshTokenValidUntil: req.session.refreshTokenValidUntil,
        },
      },
    });
  }),
);

export default usersRouter;
