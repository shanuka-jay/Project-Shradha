// Run: npm run seed:admin
// Creates default admin user: admin@saddha.org / Admin@1234
const bcrypt = require('bcryptjs');
const prisma = require('../src/prismaClient');

async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@saddha.org';
  const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
  const name = 'Admin User';

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.create({ data: { name, email, passwordHash, role: 'superadmin' } });
  console.log(`✅ Admin created: ${admin.email}`);
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });

