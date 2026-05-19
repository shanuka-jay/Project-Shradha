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

/**
 * Middleware for uploading multiple images (e.g. gallery).
 * Populates req.files[]
 */
function handleImageUpload(fieldName = 'images', maxCount = 20) {
  const middleware = imageUpload.array(fieldName, maxCount);
  return (req, res, next) => {
    middleware(req, res, (error) => {
      if (error) return res.status(400).json({ error: error.message });
      next();
    });
  };
}

/**
 * Middleware for uploading a single image (e.g. monk photo, temple monk photo).
 * Populates req.file (singular) AND puts it in req.files[0] for consistency.
 */
function handleSingleImageUpload(fieldName = 'image') {
  const middleware = imageUpload.single(fieldName);
  return (req, res, next) => {
    middleware(req, res, (error) => {
      if (error) return res.status(400).json({ error: error.message });
      // Normalise: make req.files available so route handlers can use req.files[0]
      if (req.file) req.files = [req.file];
      next();
    });
  };
}

module.exports = {
  imageUpload,
  handleImageUpload,
  handleSingleImageUpload,
};
