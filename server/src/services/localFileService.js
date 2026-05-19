const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const UPLOADS_DIR      = path.join(__dirname, '../../uploads');
const GALLERY_DIR      = path.join(UPLOADS_DIR, 'gallery');
const MONKS_DIR        = path.join(UPLOADS_DIR, 'monks');
const TEMPLE_MONKS_DIR = path.join(UPLOADS_DIR, 'temple-monks');

// Ensure all subdirectories exist
fs.mkdirSync(GALLERY_DIR,      { recursive: true });
fs.mkdirSync(MONKS_DIR,        { recursive: true });
fs.mkdirSync(TEMPLE_MONKS_DIR, { recursive: true });

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function ext(file) {
  return path.extname(file.originalname || '').toLowerCase() || '.jpg';
}

/**
 * Upload gallery images → stored in uploads/gallery/
 */
async function uploadImageFiles(files) {
  return files.map(file => {
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext(file)}`;
    fs.writeFileSync(path.join(GALLERY_DIR, filename), file.buffer);
    return { url: `/uploads/gallery/${filename}`, publicId: `gallery/${filename}`, size: file.size };
  });
}

/**
 * Upload a monk profile photo → stored in uploads/monks/
 */
async function uploadMonkPhoto(file) {
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext(file)}`;
  fs.writeFileSync(path.join(MONKS_DIR, filename), file.buffer);
  return { url: `/uploads/monks/${filename}`, publicId: `monks/${filename}`, size: file.size };
}

/**
 * Upload a temple chief-monk photo → stored in uploads/temple-monks/
 * Kept separate from gallery images so it never appears in the About page gallery.
 */
async function uploadTempleMonkPhoto(file) {
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext(file)}`;
  fs.writeFileSync(path.join(TEMPLE_MONKS_DIR, filename), file.buffer);
  return { url: `/uploads/temple-monks/${filename}`, publicId: `temple-monks/${filename}`, size: file.size };
}

/**
 * List temple chief-monk photos from uploads/temple-monks/
 */
async function listTempleMonkPhotos() {
  return fs.readdirSync(TEMPLE_MONKS_DIR)
    .filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
    .map(f => {
      const s = fs.statSync(path.join(TEMPLE_MONKS_DIR, f));
      return { url: `/uploads/temple-monks/${f}`, publicId: `temple-monks/${f}`, size: s.size, createdAt: s.birthtime };
    });
}

/**
 * List only gallery images — monk photos are intentionally excluded.
 */
async function listImages() {
  return fs.readdirSync(GALLERY_DIR)
    .filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
    .map(f => {
      const s = fs.statSync(path.join(GALLERY_DIR, f));
      return { url: `/uploads/gallery/${f}`, publicId: `gallery/${f}`, size: s.size, createdAt: s.birthtime };
    });
}

/**
 * List monk profile photos from uploads/monks/
 */
async function listMonkPhotos() {
  return fs.readdirSync(MONKS_DIR)
    .filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
    .map(f => {
      const s = fs.statSync(path.join(MONKS_DIR, f));
      return { url: `/uploads/monks/${f}`, publicId: `monks/${f}`, size: s.size, createdAt: s.birthtime };
    });
}

/**
 * Delete an image by its publicId (e.g. "gallery/abc.jpg" or "monks/xyz.png").
 * Supports both subdirectory paths and legacy flat filenames.
 */
async function deleteImage(publicId) {
  // publicId may be "gallery/filename.jpg", "monks/filename.jpg", or a legacy flat "filename.jpg"
  let fp;
  if (publicId.startsWith('gallery/') || publicId.startsWith('monks/') || publicId.startsWith('temple-monks/')) {
    fp = path.join(UPLOADS_DIR, publicId);
  } else {
    // Legacy: file was stored directly in uploads/ root — try there first, then gallery/
    fp = path.join(UPLOADS_DIR, path.basename(publicId));
    if (!fs.existsSync(fp)) {
      fp = path.join(GALLERY_DIR, path.basename(publicId));
    }
  }
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
  return { result: 'ok' };
}

module.exports = { uploadImageFiles, uploadMonkPhoto, uploadTempleMonkPhoto, listImages, listMonkPhotos, listTempleMonkPhotos, deleteImage };
