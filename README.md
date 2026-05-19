# Saddha.org — Sri Lankan Buddhist Temple Directory

A full-stack web application that maps and connects every Sri Lankan Buddhist temple across all 50 US states. Built for Ven. Manthreethenne Saddhaloka Thero to help devotees find their nearest temple and explore the Buddhist community across America.

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Client   | React 18, React Router v6, Vite     |
| Admin    | React 18, React Router v6, Vite     |
| Backend  | Node.js, Express.js                 |
| ORM      | Prisma ORM                          |
| Database | SQLite (local file — `dev.db`)      |
| Storage  | Local disk (`server/uploads/`)      |
| Auth     | JWT + bcryptjs                      |

> **No MongoDB. No Cloudinary. No external accounts needed.**
> The database is a single file and images are saved to a local folder.

---

## Project Structure

```
Project-Shradha-main/
├── client/                        # Public-facing React app
│   ├── src/
│   │   ├── components/            # Navbar, Footer, TempleDetails, etc.
│   │   ├── pages/                 # Home, About, Contact, MapPage, MonkProfile
│   │   ├── data/                  # temples.js (static fallback data)
│   │   └── utils/                 # helper functions
│   └── package.json
│
├── admin/                         # Admin dashboard (separate React app)
│   ├── src/
│   │   ├── components/            # Layout, Sidebar, Topbar
│   │   ├── context/               # AuthContext (JWT)
│   │   └── pages/                 # Dashboard, Temples, Monks, Events,
│   │                              # MediaLibrary, Messages, Settings, Login
│   └── package.json
│
├── server/                        # Express API
│   ├── prisma/
│   │   ├── schema.prisma          # SQLite database schema
│   │   └── dev.db                 # SQLite database file (shared via Git)
│   ├── uploads/                   # Uploaded images (shared via Git)
│   ├── src/
│   │   ├── middleware/            # auth.js (JWT), upload.js (Multer)
│   │   ├── routes/                # All API route files
│   │   ├── services/
│   │   │   └── localFileService.js  # Saves images to uploads/ folder
│   │   ├── utils/
│   │   │   └── imageUrls.js       # URL helpers + JSON array helpers
│   │   └── index.js               # App entry point
│   ├── scripts/
│   │   └── seedAdmin.js           # Creates the first admin user
│   ├── .env                       # Environment variables (already configured)
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js v18+** — [Download here](https://nodejs.org)
- **Git** — [Download here](https://git-scm.com)
- That's it. No cloud accounts needed.

---

### For the first person (project owner)

**1. Clone and set up the server**
```bash
git clone <your-repo-url>
cd Project-Shradha-main/server
npm install
npx prisma db push
npm run seed:admin
npm run dev
```

**2. Set up the client**
```bash
cd ../client
npm install
npm run dev
```

**3. Set up the admin panel**
```bash
cd ../admin
npm install
npm run dev
```

**4. Push database and uploads to Git so teammates get your data**
```bash
cd ..
git add .
git commit -m "initial data and uploads"
git push
```

---

### For new team members (after cloning)

```bash
git clone <your-repo-url>
cd Project-Shradha-main
```

**Server**
```bash
cd server
npm install
npx prisma generate
npm run dev
```
> ⚠️ Do NOT run `prisma db push` or `seed:admin` — the `dev.db` with all data is already there from Git.

**Client** (new terminal)
```bash
cd client
npm install
npm run dev
```

**Admin panel** (new terminal)
```bash
cd admin
npm install
npm run dev
```

---

## Running URLs

| App         | URL                       |
|-------------|---------------------------|
| Public site | http://localhost:5173     |
| Admin panel | http://localhost:5174     |
| API server  | http://localhost:5000     |

---

## Admin Login

```
Email:    admin@saddha.org
Password: Admin@1234
```

> Change this password from the Settings page after first login.

---

## How Images Work

When you upload an image through the admin panel it is saved to `server/uploads/` on disk. The image URL stored in the database will be `/uploads/filename.jpg`. The server serves these files automatically at `GET /uploads/<filename>`.

To share images with teammates — commit and push the `uploads/` folder to Git:
```bash
git add server/uploads
git commit -m "add uploaded images"
git push
```

Teammates pull and the images appear immediately:
```bash
git pull
```

---

## Team Workflow Rule

> **Only one person should add or edit data at a time.**

Since `dev.db` is a single file, if two people change data simultaneously and both push — one person's changes will overwrite the other's. Coordinate with your team: agree on who is editing before pushing.

---

## Environment Variables

The `.env` file is already included and configured. No changes needed to get started.

If you need to customise:

```env
# SQLite database file path
DATABASE_URL="file:./prisma/dev.db"

# Server port
PORT=5000

# JWT secret key (change this in production)
JWT_SECRET=saddha-super-secret-key-change-in-production

# Admin panel URL (used in password reset emails)
ADMIN_APP_URL=http://localhost:5173

# Optional: email for password reset (Brevo)
# BREVO_API_KEY=
# BREVO_SENDER_EMAIL=
# BREVO_SENDER_NAME=
```

---

## Useful Scripts

Run inside the `server/` directory:

```bash
npm run dev          # Start server with hot reload
npm run start        # Start server (production)
npm run db:push      # Apply schema changes to dev.db
npm run db:studio    # Open Prisma Studio (visual database browser)
npm run generate     # Regenerate Prisma client after schema changes
npm run seed:admin   # Create the first admin user (run once only)
```

---

## API Reference

### Public Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /api/temples                | List all temples         |
| GET    | /api/temples/:id            | Single temple detail     |
| GET    | /api/monks                  | List all monks           |
| GET    | /api/monks/:id              | Single monk profile      |
| GET    | /api/events                 | List all events          |
| GET    | /api/media                  | List all uploaded images |
| POST   | /api/contact                | Submit contact form      |

### Admin Endpoints (JWT required)

| Method | Endpoint                              | Description                  |
|--------|---------------------------------------|------------------------------|
| POST   | /api/admin/login                      | Login → returns JWT token    |
| GET    | /api/admin/me                         | Current admin profile        |
| GET    | /api/admin/stats                      | Dashboard stats              |
| GET    | /api/admin/temples                    | List temples                 |
| POST   | /api/admin/temples                    | Create temple                |
| PUT    | /api/admin/temples/:id                | Update temple                |
| PATCH  | /api/admin/temples/:id/gallery        | Update gallery images        |
| PATCH  | /api/admin/temples/:id/main-image     | Update main image            |
| DELETE | /api/admin/temples/:id                | Delete temple                |
| GET    | /api/admin/monks                      | List monks                   |
| POST   | /api/admin/monks                      | Create monk                  |
| PUT    | /api/admin/monks/:id                  | Update monk                  |
| PATCH  | /api/admin/monks/:id/photo            | Update monk photo            |
| DELETE | /api/admin/monks/:id                  | Delete monk                  |
| GET    | /api/admin/events                     | List events                  |
| POST   | /api/admin/events                     | Create event                 |
| PUT    | /api/admin/events/:id                 | Update event                 |
| DELETE | /api/admin/events/:id                 | Delete event                 |
| POST   | /api/admin/media/upload               | Upload images to local disk  |
| GET    | /api/admin/media                      | List uploaded images         |
| DELETE | /api/admin/media/:publicId            | Delete image from disk       |
| GET    | /api/admin/messages                   | List contact messages        |
| PATCH  | /api/admin/messages/:id/read          | Mark message as read         |
| DELETE | /api/admin/messages/:id               | Delete message               |
| PUT    | /api/admin/change-password            | Change admin password        |
