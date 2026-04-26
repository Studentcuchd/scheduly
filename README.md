# Scheduly

Scheduly is a Calendly-style scheduling application with a React frontend and an Express + Prisma backend.

This repository is organized as a monorepo with separate frontend and backend apps.

## Repository Structure

```txt
scheduly/
	backend/   # Express API + Prisma + PostgreSQL
	frontend/  # React + Vite client
```

## Quick Start

1. Install backend dependencies

```bash
cd backend
npm install
```

2. Install frontend dependencies

```bash
cd ../frontend
npm install
```

3. Configure backend environment

```bash
cd ../backend
cp .env.example .env
```

4. Run Prisma migration and seed

```bash
npm run db:migrate
npm run seed
```

5. Start backend

```bash
npm run dev
```

6. Start frontend (new terminal)

```bash
cd ../frontend
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:5000` by default.

## App Features

- Event type management
- Weekly availability setup
- Public booking pages
- Time slot generation with conflict checks
- Meetings list and cancellation

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios
- Backend: Node.js, Express, Prisma, PostgreSQL, Zod
- Testing: Jest + Supertest (backend)

## Scripts

Backend (`backend/package.json`):

- `npm run dev`
- `npm start`
- `npm test`
- `npm run db:migrate`
- `npm run seed`

Frontend (`frontend/package.json`):

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Deployment

- Frontend: Vercel
- Backend: Render

Set CORS origins and environment variables for production before deploying.

## Additional Docs

- Backend documentation: `backend/README.md`
- Frontend documentation: `frontend/README.md`