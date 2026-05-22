# Saddha.org — Sri Lankan Buddhist Temple Directory

A full-stack web application that maps and connects every Sri Lankan Buddhist temple across all 50 US states. Built for Ven. Manthreethenne Saddhaloka Thero to help devotees find their nearest temple and explore the Buddhist community across America.

---

## Tech Stack

| Layer    | Technology                                          |
|----------|-----------------------------------------------------|
| Client   | React 18, React Router v6, Vite, CSS                |
| Admin    | React 18, React Router v6, Vite                     |
| Backend  | Node.js, Express.js                                 |
| ORM      | Prisma ORM                                          |
| Database | MongoDB Atlas                                       |
| Storage  | Local Storage                         |
| Geocoding| OpenCage API                                        |
| Auth     | JWT + bcryptjs                                      |

---

## Project Structure

```
Project-Shradha/
├── client/                        # Public-facing React app
│   ├── src/
│   │   ├── assets/                # Images and static files
│   │   ├── components/            # Navbar, Footer, AboutSection, TempleDetails
│   │   ├── pages/                 # Home, About, Contact, MapPage, MonkProfile
│   │   ├── data/                  # temples.js (static fallback data)
│   │   ├── utils/                 # temple.js helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js             # Dev proxy → http://localhost:5000
│   └── package.json
│
├── admin/                         # Admin dashboard (separate React app)
│   ├── src/
│   │   ├── components/            # Layout, Sidebar, Topbar
│   │   ├── context/               # AuthContext
│   │   └── pages/                 # Dashboard, Temples, TempleForm, Monks,
│   │                              # MonkForm, Events, EventForm, Massages,
│   │                              # MediaLibrary, MapManagement, Settings, Login
│   ├── vite.config.js             # Dev proxy → http://localhost:5000
│   └── package.json
│
├── server/                        # Express API
│   ├── prisma/
│   │   └── schema.prisma          # MongoDB models
│   ├── src/
│   │   ├── config/                # cloudinary.js, prisma.js
│   │   ├── middleware/            # auth.js (JWT), upload.js (Multer)
│   │   ├── routes/                # All API route files
│   │   ├── services/              # cloudinaryService.js
│   │   ├── utils/                 # imageUrls.js
│   │   └── index.js               # App entry point
│   ├── scripts/
│   │   ├── seedAdmin.js           # Seed first admin user
│   │   └── clearLocalImages.js
│   ├── .env.example               # Environment variable template
│   └── package.json
│
├── package.json                   # Root scripts (optional)
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A [Cloudinary](https://cloudinary.com) account
- An [OpenCage](https://opencagedata.com/api) API key

---

### 1. Clone the repository

```bash
git clone https://github.com/shanuka-jay/Project-Shradha.git
cd Project-Shradha
```

---

### 2. Set up the Backend

```bash
cd server
cp .env.example .env
```

Open `.env` and fill in all values (see [Environment Variables](#environment-variables) below).

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Server runs at **http://localhost:5000**

Seed the first admin account:
```bash
npm run seed:admin
```

---

### 3. Set up the Client

```bash
cd ../client
npm install
npm run dev
```

Client runs at **http://localhost:3000**

---

### 4. Set up the Admin Panel

```bash
cd ../admin
npm install
npm run dev
```

Admin panel runs at **http://localhost:5173**

---

## Environment Variables

Create `server/.env` from `server/.env.example`:

```env
# MongoDB Atlas connection string
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority"

# Server port (defaults to 5000)
PORT=5000

# OpenCage Geocoding API
OPENCAGE_KEY=your_opencage_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin password reset email (Brevo Transactional API)
ADMIN_APP_URL=http://localhost:5173
BREVO_API_KEY=xkeysib-your_brevo_api_key
BREVO_SENDER_EMAIL=no-reply@saddha.org
BREVO_SENDER_NAME=Saddha.org Admin
```

---

## API Reference

### Public Endpoints

| Method | Endpoint              | Description                   |
|--------|-----------------------|-------------------------------|
| GET    | /api/temples          | List all temples               |
| GET    | /api/temples/state/:state | Temples by US state        |
| GET    | /api/temples/:id      | Single temple detail           |
| GET    | /api/monks            | List all published monks       |
| GET    | /api/monks/:id        | Single monk profile            |
| GET    | /api/events           | List all events                |
| GET    | /api/media            | List all media (Cloudinary)    |
| POST   | /api/contact          | Submit contact form            |

### Admin Endpoints (JWT required)

| Method | Endpoint                              | Description                    |
|--------|---------------------------------------|--------------------------------|
| POST   | /api/admin/login                      | Admin login → returns JWT      |
| POST   | /api/admin/forgot-password            | Generate admin reset link      |
| POST   | /api/admin/reset-password             | Reset admin password by token  |
| GET    | /api/admin/me                         | Current admin profile          |
| GET    | /api/admin/stats                      | Dashboard stats                |
| GET    | /api/admin/temples                    | List temples                   |
| POST   | /api/admin/temples                    | Create temple                  |
| PUT    | /api/admin/temples/:id                | Update temple                  |
| PATCH  | /api/admin/temples/:id/gallery        | Update temple gallery          |
| PATCH  | /api/admin/temples/:id/main-image     | Update main image              |
| DELETE | /api/admin/temples/:id                | Delete temple                  |
| GET    | /api/admin/monks                      | List monks                     |
| POST   | /api/admin/monks                      | Create monk                    |
| PUT    | /api/admin/monks/:id                  | Update monk                    |
| PATCH  | /api/admin/monks/:id/photo            | Update monk photo              |
| DELETE | /api/admin/monks/:id                  | Delete monk                    |
| GET    | /api/admin/events                     | List events                    |
| POST   | /api/admin/events                     | Create event                   |
| PUT    | /api/admin/events/:id                 | Update event                   |
| DELETE | /api/admin/events/:id                 | Delete event                   |
| POST   | /api/admin/media/upload               | Upload images to Cloudinary    |
| GET    | /api/admin/media                      | List media files               |
| DELETE | /api/admin/media/:publicId            | Delete media from Cloudinary   |
| GET    | /api/admin/messages                   | List contact messages          |
| PATCH  | /api/admin/messages/:id/read          | Mark message as read           |
| PATCH  | /api/admin/messages/:id/archive       | Archive message                |
| DELETE | /api/admin/messages/:id               | Delete message                 |
| PUT    | /api/admin/change-password            | Change admin password          |

---

## Useful Scripts

Run inside the `server/` directory:

```bash
npm run dev           # Start server with nodemon (hot reload)
npm run start         # Start server in production
npm run db:push       # Sync Prisma schema to MongoDB
npm run db:studio     # Open Prisma Studio (visual DB browser)
npm run generate      # Regenerate Prisma client after schema changes
npm run seed:admin    # Create the first admin user
```

---

## Deployment Notes

- Set `NODE_ENV=production` in your hosting environment
- Configure `CORS` origins in `server/src/index.js` to match your production domain
- Run `npm run build` inside `client/` and `admin/` to generate production bundles
- Serve the built `dist/` folders via a static host (e.g. Vercel, Netlify) or Express static middleware
