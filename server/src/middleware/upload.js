const multer = require('multer');

const allowedImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      cb(new Error('Only JPG, PNG, WEBP, and GIF images are allowed'));
      return;
    }
    cb(null, true);
  },
});

function handleImageUpload(fieldName = 'images', maxCount = 20) {
  const middleware = imageUpload.array(fieldName, maxCount);
  return (req, res, next) => {
    middleware(req, res, (error) => {
      if (error) return res.status(400).json({ error: error.message });
      next();
    });
  };
}

module.exports = {
  handleImageUpload,
};
