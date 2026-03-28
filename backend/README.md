# Scheduly Backend API

Production-ready REST API for a Calendly clone scheduling application.

## Tech Stack

- Node.js + Express.js
- PostgreSQL + Prisma ORM
- Zod validation
- Nodemailer email notifications
- dotenv, cors, nodemon

## Project Structure

```txt
backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── email.js
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── validators/
│   ├── utils/
│   ├── constants/
│   └── app.js
├── .env
├── .env.example
├── .gitignore
└── package.json
```

## Setup

1. Install dependencies

```bash
cd backend
npm install
```

2. Initialize Prisma (if needed)

```bash
npx prisma init
```

3. Set `DATABASE_URL` in `.env`

4. Run migration

```bash
npx prisma migrate dev --name init
```

5. Seed database

```bash
node prisma/seed.js
```

6. Start dev server

```bash
npm run dev
```

7. Test health endpoint

```bash
GET http://localhost:5000/api/health
```

## API Endpoints

### Event Types
- `GET /api/event-types`
- `POST /api/event-types`
- `PUT /api/event-types/:id`
- `DELETE /api/event-types/:id`
- `PATCH /api/event-types/:id/toggle`

### Availability
- `GET /api/availability`
- `PUT /api/availability`

### Booking (Public)
- `GET /api/booking/:slug`
- `GET /api/booking/:slug/slots?date=YYYY-MM-DD`
- `POST /api/booking/:slug`

### Meetings
- `GET /api/meetings?status=upcoming|past|cancelled`
- `GET /api/meetings/:id`
- `PATCH /api/meetings/:id/cancel`

## Notes

- All async routes use `asyncHandler`
- Request validation via Zod middleware
- Business logic in service layer only
- Double-booking prevention is transactional
- Email sending is non-blocking and never breaks booking success
- Dates are stored as `YYYY-MM-DD` strings
