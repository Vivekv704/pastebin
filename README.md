# Pastebin Lite

A simple pastebin application with TTL and view limits.

## Architecture

- **Frontend**: React + TypeScript + Vite (deployed on Vercel)
- **Backend**: Node.js + Express + TypeScript (deployed on Render)
- **Database**: PostgreSQL (NeonDB)

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