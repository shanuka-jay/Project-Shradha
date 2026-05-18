const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const prisma = require('./prismaClient');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files at GET /uploads/<filename>
app.use('/uploads', express.static(UPLOADS_DIR));

// Public routes
app.use('/api/temples',  require('./routes/temples'));
app.use('/api/contact',  require('./routes/contact'));
app.use('/api/events',   require('./routes/publicEvents'));
app.use('/api/monks',    require('./routes/publicMonks'));
app.use('/api/media',    require('./routes/publicMedia'));

// Admin routes
app.use('/api/admin',          require('./routes/admin'));
app.use('/api/admin/monks',    require('./routes/monks'));
app.use('/api/admin/events',   require('./routes/events'));
app.use('/api/admin/media',    require('./routes/media'));
app.use('/api/admin/settings', require('./routes/settings'));
app.use('/api/admin/map',      require('./routes/map'));

app.get('/', (req, res) => res.json({ message: 'Saddha API running (SQLite)', version: '2.2.0' }));

async function main() {
  await prisma.$connect();
  console.log('✅ Prisma connected to SQLite');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

main().catch(err => { console.error(err); process.exit(1); });

process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0); });
