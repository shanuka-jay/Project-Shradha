const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const { requireAdmin } = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Images only'));
    cb(null, true);
  },
});

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'saddha', resource_type: 'image' },
      (error, result) => { if (error) reject(error); else resolve(result); }
    );
    Readable.from(buffer).pipe(stream);
  });
}

// POST /api/admin/media/upload
// Returns array of { url, publicId } — frontend saves these URLs to the temple/monk record
router.post('/upload', requireAdmin, upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files received' });

    const results = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer)));

    const files = results.map(r => ({
      url:      r.secure_url,   // full https://res.cloudinary.com/... URL — save this in DB
      publicId: r.public_id,    // for deletion
    }));

    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/media — list all images from Cloudinary
router.get('/', requireAdmin, async (req, res) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'saddha/',
      max_results: 200,
      resource_type: 'image',
    });

    const files = result.resources.map(r => ({
      url:       r.secure_url,
      publicId:  r.public_id,
      size:      r.bytes,
      createdAt: r.created_at,
    }));

    res.json({ files, total: files.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/media/:publicId — delete from Cloudinary
router.delete('/:publicId(*)', requireAdmin, async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
