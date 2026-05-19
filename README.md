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

> No MongoDB. No Cloudinary. No external accounts needed. The database is a single file and images are saved to a local folder.

---

## Project Structure

```
Project-Shradha-2/
├── admin/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── data/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── dev.db
│   ├── uploads/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── scripts/
│   ├── package.json
│   └── .env
├── package.json
└── README.md
```

---

## Prerequisites

- Node.js v18+ installed
- Git installed

---

## Developer Setup

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd Project-Shradha

```

### 2. Install dependencies for all apps

```bash
npm install --prefix server
npm install --prefix client
npm install --prefix admin
```

### 3. Start the server

```bash
cd server
npm run dev
```

### 4. Start the public client

In a new terminal:

```bash
cd client
npm run dev
```

### 5. Start the admin panel

In another terminal:

```bash
cd admin
npm run dev
```

---

## Shared Dev DB + Uploads Workflow

This project is configured so the shared SQLite file and local upload folder are part of Git:
- `server/prisma/dev.db`
- `server/prisma/dev.db-journal`
- `server/uploads/`

That means teammates get the same data and uploaded images after pulling the repo.

### If you are adding or editing content

1. Make your changes through the admin dashboard.
2. Commit the updated DB and uploads together:

```bash
git add server/prisma/dev.db server/prisma/dev.db-journal server/uploads
git commit -m "update shared dev db and uploads"
git push
```

### If you're a teammate cloning/pulling the repo

```bash
git pull
cd server
npm install
npx prisma generate
npm run dev
```

Then start the frontends separately:

```bash
cd ../client
npm install
npm run dev
```

```bash
cd ../admin
npm install
npm run dev
```

> Do not run `npx prisma db push` or `npm run seed:admin` unless you need to recreate or reset the shared database.

---

## Root Helper Scripts

From the repository root, these shortcuts are available:

```bash
npm install --prefix server
npm install --prefix client
npm install --prefix admin
npm run dev:server
npm run dev:client
npm run dev:admin
npm run db:push
npm run db:studio
npm run seed:admin
```

---

## Running URLs

| App         | URL                       |
|-------------|---------------------------|
| Public site | http://localhost:3000     |
| Admin panel | http://localhost:5173     |
| API server  | http://localhost:5001     |

---

## Admin Login

```
Email:    admin@saddha.org
Password: Admin@1234
```

> Update this password from the Settings page after first login.

---

## Team Coordination Note

Since `server/prisma/dev.db` is a single shared file, only one person should make database edits at a time. If two people edit and push at once, one person's changes can overwrite the other's.

---

## Environment Variables

The server already includes the required `.env` configuration. Local development should work without extra setup.

If you need to customize values, keep these keys:

```env
DATABASE_URL="file:./dev.db"
PORT=5001
JWT_SECRET=saddha-super-secret-key-change-in-production
ADMIN_APP_URL=http://localhost:5173
```

---

## Server Scripts

Run inside `server/`:

```bash
npm run dev          # Start server with nodemon
npm run start        # Start server normally
npm run db:push      # Apply Prisma schema changes to dev.db
npm run db:studio    # Open Prisma Studio
npm run generate     # Regenerate Prisma client
npm run seed:admin   # Create first admin user (run only if needed)
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

#### Authentication

| Method | Endpoint                         | Description                          |
|--------|----------------------------------|--------------------------------------|
| POST   | /api/admin/login                 | Login → returns JWT token            |
| POST   | /api/admin/forgot-password       | Request admin password reset link    |
| POST   | /api/admin/reset-password        | Reset password with token            |
| GET    | /api/admin/me                    | Current admin profile                |
| GET    | /api/admin/stats                 | Dashboard summary stats              |
| PUT    | /api/admin/change-password       | Update current admin password        |

#### Temple Management

| Method | Endpoint                                 | Description                           |
|--------|------------------------------------------|---------------------------------------|
| GET    | /api/admin/temples                       | List temples                          |
| GET    | /api/admin/temples/:id                   | Get temple detail                     |
| POST   | /api/admin/temples                       | Create temple                         |
| PUT    | /api/admin/temples/:id                   | Update temple                         |
| PATCH  | /api/admin/temples/:id/overview          | Update temple overview                |
| PATCH  | /api/admin/temples/:id/history           | Update temple history                 |
| PATCH  | /api/admin/temples/:id/main-image        | Update main temple image              |
| PATCH  | /api/admin/temples/:id/chief-monk-image  | Update temple chief monk image        |
| PATCH  | /api/admin/temples/:id/gallery           | Update temple gallery images          |
| PATCH  | /api/admin/temples/:id/services          | Update temple services list           |
| DELETE | /api/admin/temples/:id                   | Delete temple                         |
| POST   | /api/admin/temples/upload-monk-photo     | Upload temple chief monk photo        |

#### Monk Management

| Method | Endpoint                         | Description                         |
|--------|----------------------------------|-------------------------------------|
| GET    | /api/admin/monks                 | List monks                          |
| GET    | /api/admin/monks/:id             | Get monk profile                    |
| POST   | /api/admin/monks                 | Create monk                         |
| PUT    | /api/admin/monks/:id             | Update monk                         |
| PATCH  | /api/admin/monks/:id/photo       | Update monk profile photo           |
| DELETE | /api/admin/monks/:id             | Delete monk                         |
| POST   | /api/admin/monks/upload-photo    | Upload monk profile photo           |

#### Event Management

| Method | Endpoint                         | Description                         |
|--------|----------------------------------|-------------------------------------|
| GET    | /api/admin/events                | List events                         |
| GET    | /api/admin/events/:id            | Get event detail                    |
| POST   | /api/admin/events                | Create event                        |
| PUT    | /api/admin/events/:id            | Update event                        |
| DELETE | /api/admin/events/:id            | Delete event                        |

#### Media Management

| Method | Endpoint                         | Description                           |
|--------|----------------------------------|---------------------------------------|
| POST   | /api/admin/media/upload          | Upload media gallery images           |
| GET    | /api/admin/media                 | List gallery images                   |
| GET    | /api/admin/media/monks           | List monk profile photos              |
| GET    | /api/admin/media/temple-monks    | List temple chief monk photos         |
| DELETE | /api/admin/media/:publicId       | Delete an uploaded image              |

#### Map Management

| Method | Endpoint                         | Description                         |
|--------|----------------------------------|-------------------------------------|
| GET    | /api/admin/map/overview          | Temple map overview                 |
| GET    | /api/admin/map/missing           | Temples missing coordinates         |
| PATCH  | /api/admin/map/:id/visibility    | Toggle temple map visibility        |
| PATCH  | /api/admin/map/:id/coords        | Update temple coordinates           |
| POST   | /api/admin/map/geocode           | Geocode single address              |
| POST   | /api/admin/map/bulk-geocode      | Bulk geocode missing temples        |
| GET    | /api/admin/map/duplicates        | Find duplicate coordinates          |

#### Settings

| Method | Endpoint                                 | Description                          |
|--------|------------------------------------------|--------------------------------------|
| GET    | /api/admin/settings/users                | List admin users                     |
| POST   | /api/admin/settings/users                | Create admin user                    |
| PUT    | /api/admin/settings/users/:id            | Update admin user                    |
| PUT    | /api/admin/settings/users/:id/role       | Update admin user role               |
| DELETE | /api/admin/settings/users/:id            | Delete admin user                    |
| GET    | /api/admin/settings/site                 | Get site settings                    |
| PUT    | /api/admin/settings/site                 | Update site settings                 |

#### Messages

| Method | Endpoint                         | Description                         |
|--------|----------------------------------|-------------------------------------|
| GET    | /api/admin/messages              | List contact messages               |
| PATCH  | /api/admin/messages/:id/read     | Mark message read                   |
| PATCH  | /api/admin/messages/:id/archive  | Archive a message                   |
| PATCH  | /api/admin/messages/:id/unarchive| Unarchive a message                 |
| DELETE | /api/admin/messages/:id          | Delete a message                    |
