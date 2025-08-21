import User from '../../db/models/auth/user.js';

export const getCurrentUserInfo = async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: 200,
    message: 'User information retrieved successfully',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      favorites: user.favorites,
    },
  });
};
