import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { getEnvVar } from '../utils/getEnvVar.js';

// Ensure dotenv is loaded before configuring Cloudinary
dotenv.config();

console.log(
  'Cloudinary config - cloud_name:',
  getEnvVar('CLOUDINARY_CLOUD_NAME'),
);
console.log(
  'Cloudinary config - api_key:',
  getEnvVar('CLOUDINARY_API_KEY') ? 'Present' : 'Missing',
);
console.log(
  'Cloudinary config - api_secret:',
  getEnvVar('CLOUDINARY_API_SECRET') ? 'Present' : 'Missing',
);

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
            secureUrl: result.secure_url,
            publicId: result.public_id,
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
    console.log(
      'cloudinaryUpload middleware - req.file:',
      req.file ? 'File present' : 'No file',
    );
    console.log('cloudinaryUpload middleware - req.body before:', req.body);

    if (!req.file) {
      console.log('cloudinaryUpload middleware - no file, proceeding');
      return next();
    }

    try {
      console.log('cloudinaryUpload middleware - uploading file to Cloudinary');
      const { secureUrl, publicId } = await uploadImage(req.file);
      req.body.thumb = secureUrl;
      req.body.thumbPublicId = publicId;
      console.log(
        'cloudinaryUpload middleware - upload successful, thumb:',
        secureUrl,
      );
      next();
    } catch (err) {
      console.error('cloudinaryUpload middleware - upload failed:', err);
      next(err);
    }
  },
];
