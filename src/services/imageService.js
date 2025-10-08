import multer from 'multer';
import Images from '../models/Images.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});

const saveImage = async (file) => {
  try {
    const image = await Images.create({
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      data: file.buffer
    });
    return image;
  } catch (error) {
    throw new Error('Failed to save image: ' + error.message);
  }
};

const saveMultipleImages = async (files) => {
  try {
    const images = await Promise.all(
      files.map(file => saveImage(file))
    );
    return images;
  } catch (error) {
    throw new Error('Failed to save images: ' + error.message);
  }
};

const getImage = async (id) => {
  try {
    const image = await Images.findByPk(id);
    return image;
  } catch (error) {
    throw new Error('Failed to get image: ' + error.message);
  }
};

const deleteImage = async (id) => {
  try {
    const result = await Images.destroy({ where: { id } });
    return result;
  } catch (error) {
    throw new Error('Failed to delete image: ' + error.message);
  }
};

export {
  upload,
  saveImage,
  saveMultipleImages,
  getImage,
  deleteImage
};