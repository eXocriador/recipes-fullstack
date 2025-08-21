import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { getEnvVar } from '../utils/getEnvVar.js';

cloudinary.config({
  cloud_name: getEnvVar('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvVar('CLOUDINARY_API_KEY'),
  api_secret: getEnvVar('CLOUDINARY_API_SECRET'),
});


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Only JPG, PNG, or WEBP images are allowed.'));
    } else {
      cb(null, true);
    }
  },
});

export const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'recipes' },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      },
    );
    uploadStream.end(file.buffer);
  });
};

export const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

export const uploadRecipeImage = [
  upload.single('thumb'),
  async (req, res, next) => {
    if (!req.file) return next();
    try {
      const { secure_url, public_id } = await uploadImage(req.file);
      req.body.thumb = secure_url;
      req.body.thumbPublicId = public_id;
      next();
    } catch (err) {
      next(err);
    }
  },
];