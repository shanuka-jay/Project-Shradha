# Project Shradha – Saddha Temple Map

An interactive web application to explore Buddhist temples across all U.S. states.

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React (Vite), React Router, CSS   |
| Backend  | Node.js, Express.js               |
| Database | MongoDB (Mongoose)                |

## Project Structure

```
Project-Shradha/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Navbar, etc.
│   │   ├── pages/        # Home, About, Contact, MapPage
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/          # Node.js backend
│   ├── src/
│   │   ├── models/       # Temple.js, Contact.js
│   │   ├── routes/       # temples.js, contact.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
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
cp .env.example .env        # Fill in your MongoDB URI
npm install
npm run dev
```

### 3. Setup the Frontend
```bash
cd ../client
npm install
npm run dev
```

Frontend runs on: http://localhost:3000  
Backend runs on: http://localhost:5000

## API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /api/temples                | Get all temples          |
| GET    | /api/temples/state/:state   | Get temples by state     |
| GET    | /api/temples/:id            | Get single temple        |
| POST   | /api/contact                | Submit contact form      |

## Team

- **Shanuka** – GitHub & MongoDB account management
