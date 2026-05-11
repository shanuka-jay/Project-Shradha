/**
 * clearLocalImages.js
 * Run ONCE to clean all broken image URLs from MongoDB.
 *
 * Fixes:
 *   - Corrupted: "http://localhost:5173https://res.cloudinary.com/..." → extracts the Cloudinary URL
 *   - Local paths: "/uploads/xxx.jpg" → removed (null / empty)
 *   - Any non-https URL → removed
 *
 * Usage:
 *   cd server
 *   node src/scripts/clearLocalImages.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function fixUrl(url) {
  if (!url || typeof url !== 'string') return null;
  // Extract Cloudinary URL if it got a localhost prefix prepended
  const match = url.match(/(https:\/\/res\.cloudinary\.com\/.+)/);
  if (match) return match[1];
  // Keep any other valid https URL
  if (url.startsWith('https://') || url.startsWith('http://')) return url;
  // Everything else (local paths, empty strings) → null
  return null;
}

function fixUrlArray(arr) {
  return (arr || []).map(fixUrl).filter(Boolean);
}

async function main() {
  console.log('🔍 Scanning database for broken image URLs...\n');

  // Fix temples
  const temples = await prisma.temple.findMany();
  let templesFixed = 0;

  for (const t of temples) {
    const mainImage      = fixUrl(t.mainImage);
    const chiefMonkImage = fixUrl(t.chiefMonkImage);
    const galleryImages  = fixUrlArray(t.galleryImages);
    const images         = fixUrlArray(t.images);

    const changed =
      mainImage      !== t.mainImage ||
      chiefMonkImage !== t.chiefMonkImage ||
      JSON.stringify(galleryImages) !== JSON.stringify(t.galleryImages || []) ||
      JSON.stringify(images)        !== JSON.stringify(t.images || []);

    if (changed) {
      await prisma.temple.update({
        where: { id: t.id },
        data: { mainImage, chiefMonkImage, galleryImages, images },
      });
      console.log(`  ✓ Fixed temple: ${t.name}`);
      templesFixed++;
    }
  }

  // Fix monks
  const monks = await prisma.monk.findMany();
  let monksFixed = 0;

  for (const m of monks) {
    const profilePhoto = fixUrl(m.profilePhoto);
    if (profilePhoto !== m.profilePhoto) {
      await prisma.monk.update({ where: { id: m.id }, data: { profilePhoto } });
      console.log(`  ✓ Fixed monk: ${m.legalName}`);
      monksFixed++;
    }
  }

  console.log(`\n✅ Done! Fixed ${templesFixed} temples, ${monksFixed} monks.`);
  console.log('Now upload new images via the admin panel — they will save as Cloudinary URLs.\n');
}

main()
  .catch(err => { console.error('❌ Error:', err.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
