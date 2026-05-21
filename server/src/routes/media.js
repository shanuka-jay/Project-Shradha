const express = require('express');
const router  = express.Router();
const { requireAdmin }      = require('../middleware/auth');
const { handleImageUpload } = require('../middleware/upload');
const prisma = require('../prismaClient');
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
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    const url = `/uploads/${publicId}`;

    // Remove any DB references to this file before deleting it
    if (publicId.startsWith('gallery/') || publicId.startsWith('temple-monks/')) {
      // Check temple mainImage, chiefMonkImage, galleryImages
      const temples = await prisma.temple.findMany();
      for (const t of temples) {
        const updates = {};
        if (t.mainImage === url)      updates.mainImage = null;
        if (t.chiefMonkImage === url) updates.chiefMonkImage = null;

        const gallery = JSON.parse(t.galleryImages || '[]');
        const newGallery = gallery.filter(u => u !== url);
        if (newGallery.length !== gallery.length)
          updates.galleryImages = JSON.stringify(newGallery);

        if (Object.keys(updates).length)
          await prisma.temple.update({ where: { id: t.id }, data: updates });
      }
    }

    if (publicId.startsWith('monks/')) {
      // Clear monk profilePhoto references
      await prisma.monk.updateMany({
        where: { profilePhoto: url },
        data:  { profilePhoto: null },
      });
    }

    await deleteImage(publicId);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
