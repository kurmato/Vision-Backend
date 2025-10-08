const { getImage } = require('../services/imageService');

const getImageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await getImage(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    res.set({
      'Content-Type': image.mimeType,
      'Content-Length': image.size,
      'Cache-Control': 'public, max-age=31536000',
      'ETag': `"${image.id}-${image.createdAt.getTime()}"`
    });

    res.send(image.data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getImageById
};
