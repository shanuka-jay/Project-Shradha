const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');
const { requireAdmin } = require('../middleware/auth');

// GET /api/admin/settings/users (superadmin only)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(admins);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/admin/settings/users
router.post('/users', requireAdmin, async (req, res) => {
  if (req.admin.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  const { name, email, password, role } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await prisma.admin.create({
      data: { name, email, passwordHash, role: role || 'editor' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.status(201).json(admin);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/settings/users/:id/role
router.put('/users/:id/role', requireAdmin, async (req, res) => {
  if (req.admin.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  try {
    const admin = await prisma.admin.update({
      where: { id: req.params.id },
      data: { role: req.body.role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(admin);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/admin/settings/users/:id
router.delete('/users/:id', requireAdmin, async (req, res) => {
  if (req.admin.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' });
  if (req.params.id === req.admin.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  try {
    await prisma.admin.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/admin/settings/site
router.get('/site', requireAdmin, async (req, res) => {
  try {
    const settings = await prisma.siteSettings.findMany();
    const obj = {};
    settings.forEach(s => { obj[s.key] = s.value; });
    res.json(obj);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/admin/settings/site
router.put('/site', requireAdmin, async (req, res) => {
  try {
    const entries = Object.entries(req.body);
    await Promise.all(entries.map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    ));
    res.json({ message: 'Settings saved' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
