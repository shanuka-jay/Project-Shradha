const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { handleImageUpload } = require('../middleware/upload');
const {
  uploadImageFiles,
  listImages,
  deleteImage,
} = require('../services/cloudinaryService');

// POST /api/admin/media/upload
// Returns array of { url, publicId } — frontend saves these URLs to the temple/monk record
router.post('/upload', requireAdmin, handleImageUpload('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files received' });

    const files = await uploadImageFiles(req.files);
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/media — list all images from Cloudinary
router.get('/', requireAdmin, async (req, res) => {
  try {
    const files = await listImages();
    res.json({ files, total: files.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/media/:publicId — delete from Cloudinary
router.delete('/:publicId(*)', requireAdmin, async (req, res) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    await deleteImage(publicId);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
