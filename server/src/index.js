const express = require('express');
const cors = require('cors');
require('dotenv').config();

const prisma = require('./prismaClient');
const templeRoutes = require('./routes/temples');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const monkRoutes = require('./routes/monks');
const eventRoutes = require('./routes/events');
const mediaRoutes = require('./routes/media');
const settingsRoutes = require('./routes/settings');
const mapRoutes = require('./routes/map');

const app = express();

app.use(cors());
app.use(express.json());

async function main() {
  try {
    await prisma.$connect();
    console.log('Prisma connected to MongoDB');
  } catch (err) {
    console.error('Prisma connection error:', err);
    process.exit(1);
  }
}

main();

// Public routes
app.use('/api/temples', templeRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/events', require('./routes/publicEvents'));

// Admin routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin/monks', monkRoutes);
app.use('/api/admin/events', eventRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admin/map', mapRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Saddha Temple Map API is running', version: '2.0.0' });
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 