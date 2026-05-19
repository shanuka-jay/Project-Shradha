const express = require('express');
const router  = express.Router();
const { requireAdmin }      = require('../middleware/auth');
const { handleImageUpload } = require('../middleware/upload');
const {
  uploadImageFiles, listImages,
  listMonkPhotos, listTempleMonkPhotos,
  deleteImage
} = require('../services/localFileService');

// POST /api/admin/media/upload — upload gallery images (About page)
router.post('/upload', requireAdmin, handleImageUpload('images', 20), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ error: 'No files received' });
    res.json({ files: await uploadImageFiles(req.files) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/media — list gallery images only
router.get('/', requireAdmin, async (req, res) => {
  try { const files = await listImages(); res.json({ files, total: files.length }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/media/monks — list monk profile photos
router.get('/monks', requireAdmin, async (req, res) => {
  try { const files = await listMonkPhotos(); res.json({ files, total: files.length }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/media/temple-monks — list temple chief-monk photos
router.get('/temple-monks', requireAdmin, async (req, res) => {
  try { const files = await listTempleMonkPhotos(); res.json({ files, total: files.length }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/admin/media/:publicId — works for gallery/*, monks/*, temple-monks/*
router.delete('/:publicId(*)', requireAdmin, async (req, res) => {
  try { await deleteImage(decodeURIComponent(req.params.publicId)); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
