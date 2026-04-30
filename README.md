# Project Shradha – Saddha Temple Map

An interactive web application to explore Buddhist temples across all U.S. states.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React (Vite), React Router, CSS     |
| Backend  | Node.js, Express.js                 |
| ORM      | Prisma ORM                          |
| Database | MongoDB Atlas                       |

## Project Structure

```
Project-Shradha/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Navbar
│   │   ├── pages/           # Home, About, Contact, MapPage
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                  # Node.js backend
│   ├── prisma/
│   │   └── schema.prisma    # Database models (Temple, Contact)
│   ├── src/
│   │   ├── routes/          # temples.js, contact.js
│   │   ├── prismaClient.js  # Prisma singleton
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/shanuka-jay/Project-Shradha.git
cd Project-Shradha
```

### 2. Setup the Backend
```bash
cd server
cp .env.example .env
# Open .env and paste your MongoDB connection string as DATABASE_URL
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Setup the Frontend
```bash
cd ../client
npm install
npm run dev
```

Frontend → http://localhost:3000  
Backend  → http://localhost:5000

## API Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | /api/temples              | Get all temples          |
| GET    | /api/temples/state/:state | Get temples by state     |
| GET    | /api/temples/:id          | Get single temple        |
| POST   | /api/temples              | Add a new temple         |
| POST   | /api/contact              | Submit contact form      |

## Prisma Commands (run inside /server)

```bash
npx prisma generate    # Regenerate client after schema changes
npx prisma db push     # Sync schema to MongoDB
npx prisma studio      # Open visual DB browser
```
