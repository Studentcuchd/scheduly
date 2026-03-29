# Scheduly Backend API

Backend service for Scheduly, a Calendly-style scheduling application.

This API handles:

- event type management
- weekly availability management
- public booking by username + slug
- slot generation with conflict prevention
- meetings listing and cancellation

## Tech Stack

- Node.js (ESM)
- Express
- Prisma ORM
- PostgreSQL
- Zod validation
- Jest + Supertest

## Features

- User-scoped data model (default seeded user)
- Event type CRUD with unique slug enforcement
- Public booking links based on username + event slug
- Slot generation from weekly availability
- Past-slot filtering for current day in target timezone
- Concurrency-safe booking flow using DB transaction + advisory lock
- Global API error handling and structured error responses
- CORS allowlist for local and production frontend domains

## Repository Structure

```txt
backend/
	prisma/
		schema.prisma
		seed.js
	src/
		app.js
		config/
			db.js
		constants/
			index.js
		controllers/
		middleware/
			asyncHandler.js
			errorHandler.js
			validate.js
		routes/
			eventType.routes.js
			availability.routes.js
			booking.routes.js
			meeting.routes.js
			publicBooking.routes.js
		services/
		utils/
		validators/
	tests/
		api.test.js
	.env.example
	package.json
```

## Environment Variables

Create a local .env file from .env.example.

Required:

- DATABASE_URL: PostgreSQL connection string

Optional:

- PORT: default 5000
- CORS_ORIGIN: comma-separated extra origins
- DEFAULT_USER_ID: default user id (seed + service scope)
- BOOKING_BUFFER_MINUTES: collision buffer between meetings
- NODE_ENV: development or production

Important production guard:

- localhost DATABASE_URL is blocked in production/Render runtime.

## Installation and Local Setup

1. Install dependencies

```bash
cd backend
npm install
```

2. Set environment variables

```bash
cp .env.example .env
```

3. Apply database schema

```bash
npm run db:migrate
```

4. Seed baseline data (default user, event types, availability, sample meeting)

```bash
npm run seed
```

5. Run development server

```bash
npm run dev
```

6. Health check

```bash
curl http://localhost:5000/api/health
```

## Available Scripts

- npm run dev: start server with nodemon
- npm start: start server in normal mode
- npm test: run backend test suite
- npm run db:migrate: run Prisma migration in dev
- npm run seed: run configured Prisma seed command
- npm run db:seed: run seed file directly
- npm run db:studio: open Prisma Studio

## API Overview

Base URL:

- local: http://localhost:5000
- production: Render URL

Response shape:

- success responses return success + data (+ optional message)
- errors return success false + message

### System

- GET /api
- GET /api/health

### Event Types

- GET /api/event-types
- GET /api/event-types/:slug
- POST /api/event-types
- PUT /api/event-types/:id
- DELETE /api/event-types/:id
- PATCH /api/event-types/:id/toggle

Alias routes:

- /api/events mirrors /api/event-types

Create/update payload fields:

- name
- duration (15, 30, 45, 60, 90)
- slug (lowercase letters, numbers, hyphens)
- color (hex)
- description

### Availability

- GET /api/availability
- POST /api/availability
- PUT /api/availability

Payload:

- timezone
- days array with dayOfWeek, isEnabled, startTime, endTime

### Booking (Admin-style + Slug-only)

- GET /api/booking/:username/:slug
- GET /api/booking/:username/:slug/slots?date=YYYY-MM-DD
- POST /api/booking/:username/:slug

- GET /api/booking/:slug
- GET /api/booking/:slug/slots?date=YYYY-MM-DD
- POST /api/booking/:slug

### Public Booking Endpoints

- GET /api/public/:username/:slug
- GET /api/slots/:username/:slug?date=YYYY-MM-DD
- POST /api/book
- POST /api/bookings

Public booking POST body:

- username
- slug
- inviteeName
- inviteeEmail
- date
- startTime
- optional endTime
- optional notes

### Meetings

- GET /api/meetings
- GET /api/meetings?status=upcoming|past|cancelled
- GET /api/meetings/:id
- PATCH /api/meetings/:id/cancel
- DELETE /api/meetings/:id

## Data Model Summary

- User has many EventType and Meeting
- User has one Availability
- Availability has many AvailabilityDay
- EventType has many Meeting
- Meeting references both EventType and User

Prisma source of truth: prisma/schema.prisma.

## Booking and Slot Logic

- Slots are generated from enabled day windows using event duration.
- Existing non-cancelled meetings remove overlapping slots.
- On current date, past times are filtered by timezone-aware clock.
- Booking creation validates requested slot against fresh availability.
- Final insert is protected by a serializable transaction and advisory lock.

## Error Handling

- Validation errors are rejected by Zod middleware.
- Service/controller errors flow to global errorHandler middleware.
- Error response format:

```json
{
	"success": false,
	"message": "Error message"
}
```

## CORS

Default allowlist includes:

- http://localhost:5173
- https://scheduly-gtir.vercel.app

Add extra origins with CORS_ORIGIN (comma-separated).

## Testing

Run:

```bash
npm test
```

Coverage focus includes:

- event type CRUD
- availability save/read
- public event fetch
- slot generation
- booking validation and double-booking protection
- meetings retrieval and cancellation

## Deployment Notes

Render deployment checklist:

1. Set DATABASE_URL to managed PostgreSQL
2. Set NODE_ENV=production
3. Set CORS_ORIGIN with frontend URL
4. Run migrations
5. Run seed command

Do not use localhost database URLs in production.

## Troubleshooting

Database connection fails on boot:

- verify DATABASE_URL
- verify database network access
- ensure URL is not localhost in production

CORS blocked in browser:

- verify frontend domain is included in allowlist or CORS_ORIGIN
- confirm backend redeployed after env updates

No slots visible:

- verify availability day is enabled
- verify selected date is not in the past
- verify timezone and existing bookings

## License

MIT
