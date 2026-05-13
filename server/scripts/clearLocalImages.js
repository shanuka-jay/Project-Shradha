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
const { normalizeImageUrl, normalizeImageUrlArray } = require('../src/utils/imageUrls');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Scanning database for broken image URLs...\n');

  // Fix temples
  const temples = await prisma.temple.findMany();
  let templesFixed = 0;

  for (const t of temples) {
    const mainImage      = normalizeImageUrl(t.mainImage);
    const chiefMonkImage = normalizeImageUrl(t.chiefMonkImage);
    const galleryImages  = normalizeImageUrlArray(t.galleryImages);
    const images         = normalizeImageUrlArray(t.images);

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
    const profilePhoto = normalizeImageUrl(m.profilePhoto);
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
