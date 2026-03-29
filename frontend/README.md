# Scheduly Frontend

React + Vite frontend for the Scheduly scheduling app.

## Stack

- React
- React Router
- Axios
- Tailwind CSS
- date-fns

## Current Architecture

This frontend is connected to the real backend API (Express + Prisma + PostgreSQL).
It does not use mock data.

API base URL behavior:
- Reads `VITE_API_URL` when provided
- Falls back to `https://scheduly-backend-n6ey.onrender.com`
- Automatically normalizes `/api` suffix in the client

See `src/services/api.js`.

## Routes

Admin:
- `/admin/analytics`
- `/admin/event-types`
- `/admin/availability`
- `/admin/meetings`
- `/admin/settings`

Public booking:
- `/book/:slug`
- `/book/:slug/confirm`
- `/:username/:eventSlug`
- `/:username/:eventSlug/confirm`

## Development

```bash
cd frontend
npm install
npm run dev
```

## Production Build

```bash
cd frontend
npm run build
npm run preview
```

## Deployment (Vercel)

- `vercel.json` is configured for SPA routing fallback.
- Static files are served first via filesystem handling.
- Dynamic routes resolve to `index.html`.

## Environment

Example production env:

```env
VITE_API_URL=https://scheduly-backend-n6ey.onrender.com
```

Do not commit local `.env` files with secrets.
