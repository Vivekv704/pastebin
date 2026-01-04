# Pastebin Lite

Pastebin-Lite is a lightweight full-stack web application that allows users to create and share text pastes via a unique URL. Each paste can optionally expire based on time (TTL) or a maximum number of views, after which it becomes unavailable. The application is built with a clean, production-ready architecture, supports deterministic time-based testing, and uses persistent storage to ensure reliability across requests.

## Architecture

- **Frontend**: React + TypeScript + Vite (deployed on Vercel)
- **Backend**: Node.js + Express + TypeScript (deployed on Render)
- **Database**: PostgreSQL (NeonDB)

┌─────────────┐        HTTP        ┌────────────────────┐
│   Browser   │ ────────────────▶ │ Next.js App Router  │
│ (React UI)  │                   │  (API + UI)        │
└─────────────┘                   └─────────┬──────────┘
                                              │
                                              │ SQL over TCP
                                              ▼
                                      ┌─────────────────┐
                                      │ PostgreSQL DB   │
                                      │ (persistent)   │
                                      └─────────────────┘



## Deployment

### Backend (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm ci && npm run build && npx prisma generate && npx prisma migrate deploy`
4. Set start command: `npm start`
5. Set environment variables:
   - `NODE_ENV=production`
   - `DATABASE_URL` (from NeonDB)
   - `FRONTEND_BASE_URL` (your Vercel URL)

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set framework preset to "Vite"
3. Set root directory to `frontend`
4. Set environment variable:
   - `VITE_API_BASE_URL` (your Render backend URL)

### Database (NeonDB)

1. Create a NeonDB PostgreSQL database
2. Copy the connection string
3. Set as `DATABASE_URL` in Render

## Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your database URL
npm run migrate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Update .env with backend URL
npm run dev
```

## API Endpoints

- `POST /api/pastes` - Create a new paste
- `GET /api/pastes/:id` - Retrieve a paste
- `GET /api/healthz` - Health check

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `FRONTEND_BASE_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)

### Frontend
- `VITE_API_BASE_URL` - Backend API URL