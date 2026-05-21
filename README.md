# 🪷 Saddha.org — Sri Lankan Buddhist Temple Directory

> A full-stack web application mapping every Sri Lankan Buddhist temple across all 50 US states. Built for **Ven. Manthreethenne Saddhaloka Thero** to help devotees find their nearest temple and explore the Buddhist community across America.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Running the Apps](#-running-the-apps)
- [Admin Login](#-admin-login)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)

---

## 🛠 Tech Stack

| Layer    | Technology                      |
|----------|---------------------------------|
| Client   | React 18, React Router v6, Vite |
| Admin    | React 18, React Router v6, Vite |
| Backend  | Node.js, Express.js             |
| ORM      | Prisma ORM                      |
| Database | SQLite (`server/prisma/dev.db`) |
| Storage  | Local disk (`server/uploads/`)  |
| Auth     | JWT + bcryptjs                  |

> The database is a single local file and images are saved to a local folder — no cloud services required.

---

## 📁 Project Structure

```
Project-Shradha-2/
├── admin/               ← Admin panel (React + Vite)
│   └── src/
│       ├── components/
│       ├── context/
│       └── pages/
│
├── client/              ← Public-facing site (React + Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── data/
│       └── utils/
│
├── server/              ← Express API server
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── dev.db       ← SQLite database file
│   ├── uploads/         ← Uploaded images
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── utils/
│
└── package.json         ← Root scripts (shortcuts)
```

---

## ✅ Prerequisites

Make sure you have both of these installed before continuing:

- **Node.js v18 or higher** — [Download](https://nodejs.org)
- **Git** — [Download](https://git-scm.com)

---

## 🚀 Getting Started

Follow these steps **in order** — every step is required for a working system.

### Step 1 — Clone the repository

```bash
git clone <your-repo-url>
cd Project-Shradha-2
```

### Step 2 — Install dependencies

Install dependencies for all three apps:

```bash
npm install --prefix server
npm install --prefix client
npm install --prefix admin
```

### Step 3 — Generate the Prisma client

```bash
cd server
npx prisma generate
```

### Step 4 — Create the database tables

```bash
npm run db:push
```

> This creates all the required tables in `dev.db`. **You must run this before seeding** — skipping it will cause the next step to fail with a "table does not exist" error.

### Step 5 — Seed the admin user

```bash
npm run seed:admin
```

> Creates the first admin account (`admin@saddha.org`). Only run this once.

### Step 6 — (Optional) Seed temple data

```bash
node prisma/seed.js
```

> Populates the database with 73 Sri Lankan Buddhist temples across the US (no images). Skip this if you prefer to add temples manually through the admin panel.

---

## ▶️ Running the Apps

You need **three separate terminals** — one for each app.

### Terminal 1 — API Server

```bash
cd server
npm run dev
```

### Terminal 2 — Public Client

```bash
cd client
npm run dev
```

### Terminal 3 — Admin Panel

```bash
cd admin
npm run dev
```

Once all three are running, open:

| App          | URL                        |
|--------------|----------------------------|
| 🌐 Public site | http://localhost:3000    |
| 🔧 Admin panel | http://localhost:5173    |
| ⚙️ API server  | http://localhost:5001    |

---

## 🔑 Admin Login

```
Email:    admin@saddha.org
Password: Admin@1234
```

> **Important:** Change this password immediately after your first login via the Settings page.

---

## ⚙️ Environment Variables

The server ships with a `.env` file that works out of the box for local development. No changes are needed to get started.

If you need to customize, edit `server/.env` with these keys:

```env
DATABASE_URL="file:./dev.db"
PORT=5001
JWT_SECRET=saddha-super-secret-key-change-in-production
ADMIN_APP_URL=http://localhost:5173
```

> **Production note:** Always replace `JWT_SECRET` with a strong random string before deploying.

---

## 🗄️ Database & Server Scripts

Run these from inside the `server/` directory:

| Command              | Description                                  |
|----------------------|----------------------------------------------|
| `npm run dev`        | Start server with hot-reload (nodemon)       |
| `npm run start`      | Start server normally (production)           |
| `npm run db:push`    | Apply Prisma schema changes to `dev.db`      |
| `npm run db:studio`  | Open Prisma Studio (visual DB browser)       |
| `npm run generate`   | Regenerate the Prisma client                 |
| `npm run seed:admin` | Create the first admin user (run only once)  |

> ⚠️ Do **not** re-run `db:push` or `seed:admin` after initial setup — `db:push` will wipe data on schema conflicts and `seed:admin` will attempt to create a duplicate admin.

### Root-level shortcuts

These can also be run from the project root:

```bash
npm run dev:server
npm run dev:client
npm run dev:admin
npm run db:push
npm run db:studio
npm run seed:admin
```

---

## 📡 API Reference

### Public Endpoints

No authentication required.

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | /api/temples      | List all temples         |
| GET    | /api/temples/:id  | Single temple detail     |
| GET    | /api/monks        | List all monks           |
| GET    | /api/monks/:id    | Single monk profile      |
| GET    | /api/events       | List all events          |
| GET    | /api/media        | List all uploaded images |
| POST   | /api/contact      | Submit contact form      |

---

### Admin Endpoints

All admin endpoints require a valid **JWT token** in the request header.

#### 🔐 Authentication

| Method | Endpoint                       | Description                        |
|--------|--------------------------------|------------------------------------|
| POST   | /api/admin/login               | Login and receive JWT token        |
| POST   | /api/admin/forgot-password     | Request a password reset link      |
| POST   | /api/admin/reset-password      | Reset password using token         |
| GET    | /api/admin/me                  | Get current admin profile          |
| GET    | /api/admin/stats               | Get dashboard summary stats        |
| PUT    | /api/admin/change-password     | Update current admin password      |

#### 🏛️ Temple Management

| Method | Endpoint                                  | Description                          |
|--------|-------------------------------------------|--------------------------------------|
| GET    | /api/admin/temples                        | List all temples                     |
| GET    | /api/admin/temples/:id                    | Get temple detail                    |
| POST   | /api/admin/temples                        | Create a new temple                  |
| PUT    | /api/admin/temples/:id                    | Update temple                        |
| PATCH  | /api/admin/temples/:id/overview           | Update temple overview               |
| PATCH  | /api/admin/temples/:id/history            | Update temple history                |
| PATCH  | /api/admin/temples/:id/main-image         | Update main temple image             |
| PATCH  | /api/admin/temples/:id/chief-monk-image   | Update chief monk image              |
| PATCH  | /api/admin/temples/:id/gallery            | Update gallery images                |
| PATCH  | /api/admin/temples/:id/services           | Update services list                 |
| DELETE | /api/admin/temples/:id                    | Delete temple                        |
| POST   | /api/admin/temples/upload-monk-photo      | Upload chief monk photo              |

#### 🧘 Monk Management

| Method | Endpoint                      | Description                     |
|--------|-------------------------------|---------------------------------|
| GET    | /api/admin/monks              | List all monks                  |
| GET    | /api/admin/monks/:id          | Get monk profile                |
| POST   | /api/admin/monks              | Create a monk                   |
| PUT    | /api/admin/monks/:id          | Update monk                     |
| PATCH  | /api/admin/monks/:id/photo    | Update monk profile photo       |
| DELETE | /api/admin/monks/:id          | Delete monk                     |
| POST   | /api/admin/monks/upload-photo | Upload monk profile photo       |

#### 📅 Event Management

| Method | Endpoint                | Description          |
|--------|-------------------------|----------------------|
| GET    | /api/admin/events       | List all events      |
| GET    | /api/admin/events/:id   | Get event detail     |
| POST   | /api/admin/events       | Create an event      |
| PUT    | /api/admin/events/:id   | Update event         |
| DELETE | /api/admin/events/:id   | Delete event         |

#### 🖼️ Media Management

| Method | Endpoint                         | Description                        |
|--------|----------------------------------|------------------------------------|
| POST   | /api/admin/media/upload          | Upload gallery images              |
| GET    | /api/admin/media                 | List gallery images                |
| GET    | /api/admin/media/monks           | List monk profile photos           |
| GET    | /api/admin/media/temple-monks    | List temple chief monk photos      |
| DELETE | /api/admin/media/:publicId       | Delete an uploaded image           |

#### 🗺️ Map Management

| Method | Endpoint                          | Description                          |
|--------|-----------------------------------|--------------------------------------|
| GET    | /api/admin/map/overview           | Temple map overview                  |
| GET    | /api/admin/map/missing            | Temples missing coordinates          |
| PATCH  | /api/admin/map/:id/visibility     | Toggle map visibility for a temple   |
| PATCH  | /api/admin/map/:id/coords         | Update temple coordinates            |
| POST   | /api/admin/map/geocode            | Geocode a single address             |
| POST   | /api/admin/map/bulk-geocode       | Bulk geocode all missing temples     |
| GET    | /api/admin/map/duplicates         | Find duplicate coordinates           |

#### ⚙️ Settings

| Method | Endpoint                            | Description               |
|--------|-------------------------------------|---------------------------|
| GET    | /api/admin/settings/users           | List admin users          |
| POST   | /api/admin/settings/users           | Create admin user         |
| PUT    | /api/admin/settings/users/:id       | Update admin user         |
| PUT    | /api/admin/settings/users/:id/role  | Update admin user role    |
| DELETE | /api/admin/settings/users/:id       | Delete admin user         |
| GET    | /api/admin/settings/site            | Get site settings         |
| PUT    | /api/admin/settings/site            | Update site settings      |

#### 💬 Messages

| Method | Endpoint                              | Description             |
|--------|---------------------------------------|-------------------------|
| GET    | /api/admin/messages                   | List contact messages   |
| PATCH  | /api/admin/messages/:id/read          | Mark message as read    |
| PATCH  | /api/admin/messages/:id/archive       | Archive a message       |
| PATCH  | /api/admin/messages/:id/unarchive     | Unarchive a message     |
| DELETE | /api/admin/messages/:id               | Delete a message        |

---

*Built with 🙏 for the Sri Lankan Buddhist community across America.*
