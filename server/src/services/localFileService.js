const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

function ext(file) {
  return path.extname(file.originalname || '').toLowerCase() || '.jpg';
}

async function uploadImageFiles(files) {
  return files.map(file => {
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext(file)}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, filename), file.buffer);
    return { url: `/uploads/${filename}`, publicId: filename, size: file.size };
  });
}

async function listImages() {
  const ok = new Set(['.jpg','.jpeg','.png','.webp','.gif']);
  return fs.readdirSync(UPLOADS_DIR)
    .filter(f => ok.has(path.extname(f).toLowerCase()))
    .map(f => {
      const s = fs.statSync(path.join(UPLOADS_DIR, f));
      return { url: `/uploads/${f}`, publicId: f, size: s.size, createdAt: s.birthtime };
    });
}

async function deleteImage(publicId) {
  const fp = path.join(UPLOADS_DIR, path.basename(publicId));
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
  return { result: 'ok' };
}

module.exports = { uploadImageFiles, listImages, deleteImage };
