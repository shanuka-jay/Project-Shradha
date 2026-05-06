const express = require('express');
const cors = require('cors');
require('dotenv').config();

const prisma = require('./prismaClient');
const templeRoutes = require('./routes/temples');
const contactRoutes = require('./routes/contact');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test DB connection on startup
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

// Routes
app.use('/api/temples', templeRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ Saddha Temple Map API is running!' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
