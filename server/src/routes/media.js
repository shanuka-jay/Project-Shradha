const express = require('express');
const router  = express.Router();
const { requireAdmin }      = require('../middleware/auth');
const { handleImageUpload } = require('../middleware/upload');
const { uploadImageFiles, listImages, deleteImage } = require('../services/localFileService');

router.post('/upload', requireAdmin, handleImageUpload('images', 20), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ error: 'No files received' });
    res.json({ files: await uploadImageFiles(req.files) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/', requireAdmin, async (req, res) => {
  try { const files = await listImages(); res.json({ files, total: files.length }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:publicId(*)', requireAdmin, async (req, res) => {
  try { await deleteImage(decodeURIComponent(req.params.publicId)); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
