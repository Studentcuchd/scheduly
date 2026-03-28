# Scheduly — Modern Calendly Clone

A production-ready Calendly-style scheduling SaaS frontend built with React 19, Vite, and Tailwind CSS.

## ✨ Features

- **Event Types Management**: Create, edit, delete, and toggle event types with custom colors and descriptions
- **Availability Settings**: Set weekly availability with timezone support (26+ timezones)
- **Meeting Management**: Track upcoming and past meetings with cancellation capability
- **Public Booking**: Multi-step booking flow with calendar, time slot selection, and confirmation
- **Responsive Design**: Mobile-first UI with adaptive layouts for all screen sizes
- **Mock Data**: Fully functional demo with pre-populated data (ready for backend integration)

## Tech Stack

- **Frontend Framework**: React 19.2.4
- **Build Tool**: Vite 8.0.1 (HMR, fast development)
- **Styling**: Tailwind CSS 3.4.17 + PostCSS + Autoprefixer
- **Routing**: React Router DOM 7.13.2
- **Date/Time**: date-fns 4.1.0 (timezone, slot calculation)
- **Icons**: lucide-react 1.7.0
- **Notifications**: react-hot-toast 2.6.0 (success/error toasts)
- **HTTP**: Axios 1.14.0 (service layer structure)
- **Code Quality**: ESLint (react-hooks, react-refresh plugins)

## Project Structure

```
scheduly/
├── src/
│   ├── App.jsx                          # Root router setup (6 routes)
│   ├── main.jsx                         # Entry point (React 19 + Router + Context)
│   ├── index.css                        # Tailwind directives + global styles
│   ├── App.css                          # Component styles
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx               # Multi-variant button (primary/secondary/danger/ghost)
│   │   │   ├── Modal.jsx                # Accessible modal with Escape/click-outside close
│   │   │   ├── Badge.jsx                # Status badges (upcoming/past/cancelled)
│   │   │   ├── Loader.jsx               # Spinner + fullpage overlay
│   │   │   ├── Header.jsx               # Sticky header with title + actions
│   │   │   └── Sidebar.jsx              # Fixed sidebar (desktop) / bottom nav (mobile)
│   │   │
│   │   ├── event-types/
│   │   │   ├── EventTypeCard.jsx        # Event card with copy link + dropdown menu
│   │   │   ├── EventTypeForm.jsx        # Create/edit modal (name, duration, slug, color)
│   │   │   └── EventTypeList.jsx        # Grid layout of cards + empty state
│   │   │
│   │   ├── availability/
│   │   │   ├── AvailabilityForm.jsx     # Timezone + 7-day toggles + time ranges
│   │   │   ├── DayToggle.jsx            # Toggle switch for day enabled/disabled
│   │   │   └── TimeRangePicker.jsx      # 30-min interval dropdowns (start/end)
│   │   │
│   │   ├── meetings/
│   │   │   ├── MeetingCard.jsx          # Meeting info with status badge + cancel button
│   │   │   └── MeetingTabs.jsx          # Upcoming | Past tabs
│   │   │
│   │   └── booking/
│   │       ├── BookingCalendar.jsx      # Month view with availability/past filtering
│   │       ├── TimeSlotPicker.jsx       # Scrollable list of available slots
│   │       ├── BookingForm.jsx          # Name + email + notes + submit
│   │       └── BookingConfirmation.jsx  # Success card with details
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── EventTypesPage.jsx       # CRUD event types (+modal)
│   │   │   ├── AvailabilityPage.jsx     # Edit availability settings
│   │   │   └── MeetingsPage.jsx         # View & manage meetings
│   │   │
│   │   └── public/
│   │       ├── BookingPage.jsx          # 3-panel responsive booking (calendar + slots + form)
│   │       └── ConfirmationPage.jsx     # Protected route with success details
│   │
│   ├── context/
│   │   └── AppContext.jsx               # Global state (eventTypes, availability, meetings)
│   │
│   ├── hooks/
│   │   ├── useEventTypes.js             # CRUD operations (create/update/delete)
│   │   ├── useAvailability.js           # Fetch & save availability
│   │   ├── useMeetings.js               # Fetch meetings (sort upcoming/past)
│   │   └── useBooking.js                # Booking state (selectedDate, selectedSlot)
│   │
│   ├── services/
│   │   ├── mockData.js                  # Mock event types, availability, meetings, booked slots
│   │   └── api.js                       # Service layer structure (ready for backend)
│   │
│   ├── utils/
│   │   ├── slotUtils.js                 # generateTimeSlots() - slot math + filtering
│   │   └── dateUtils.js                 # Date formatting, time calculations, validation
│   │
│   ├── constants/
│   │   └── index.js                     # Theme colors, routes, timezones, UI labels
│   │
│   └── assets/                          # (Empty - favicon/images can go here)
│
├── public/                              # Static assets
├── dist/                                # Production build output (npm run build)
│
├── index.html                           # Vite HTML entry point
├── vite.config.js                       # Vite + React plugin config
├── eslint.config.js                     # ESLint setup (react-hooks, react-refresh)
├── tailwind.config.js                   # Custom theme colors
├── postcss.config.js                    # PostCSS with Tailwind
├── package.json                         # Dependencies & scripts
└── README.md                            # This file
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
cd f:\calendly\scheduly

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Routes

**Admin Routes:**
- `http://localhost:5173/admin/event-types` — Event types management
- `http://localhost:5173/admin/availability` — Availability settings
- `http://localhost:5173/admin/meetings` — Meetings list

**Public Routes:**
- `http://localhost:5173/book/:slug` — Public booking page 
- `http://localhost:5173/book/:slug/confirm` — Booking confirmation

### Scripts

```bash
npm run dev       # Start dev server with HMR
npm run build     # Production optimized build
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

## Architecture Highlights

### State Management
- **React Context API** for global state (eventTypes, availability, meetings)
- **Custom Hooks** for feature-specific logic (useEventTypes, useAvailability, useMeetings, useBooking)
- **Local useState** for UI state (modals, form inputs, date/slot selection)

### Key Utilities

**slotUtils.js — generateTimeSlots()**
- Validates day is available
- Generates time slots at duration intervals (every N minutes)
- Filters out overlapping booked slots
- Excludes past slots for today's date
- Returns time strings (HH:mm format)

**dateUtils.js**
- Format meeting dates (e.g., "Monday, Dec 20, 2024")
- Parse time on specific dates for comparison
- Validate no overlapping time ranges
- Check if slot is in the past

### Design System
- **Colors**: Primary #0069ff (blue), Success #00a86b (green), Danger #f04438 (red)
- **Spacing & typography** via Tailwind utilities
- **Responsive breakpoints**: base (mobile) → md (tablet) → lg (desktop)
- **Min tap target**: 44px for all interactive elements

## Mock Data

All data is pre-populated in `src/services/mockData.js`:

```javascript
mockEventTypes        // 2 sample event types
mockAvailability      // 9-5 schedule, Monday-Friday
mockMeetings          // 3 sample meetings
mockBookedSlots       // Sample booked time slots by event
```

To integrate with a backend API:
1. Update `src/services/api.js` with real endpoints
2. Modify hooks to make actual HTTP calls (replace mock setTimeout)
3. Remove mockData imports

## Design Specifications

- **Timezone Support**: 26+ timezones (Asia/Pacific, Europe, Americas, UTC)
- **Availability**: Weekly recurring; configurable per event type
- **Slot Duration**: 15min, 30min, 45min, 60min, 90min options
- **Slot Interval**: Automatically calculated (e.g., 30min duration = slots every 30min)
- **Color Coding**: 6 preset colors for event type differentiation
- **Responsive Design**: 
  - Desktop: 3-column layout (sidebar + main + details)
  - Tablet: 2-column layout
  - Mobile: Single column + bottom navigation

## Build & Deployment

```bash
# Production build
npm run build

# Output: dist/ folder
# - dist/index.html (entry point)
# - dist/assets/*.css (15.98 KB gzip)
# - dist/assets/*.js (324.65 KB gzip)
```

The build is production-ready and can be deployed to any static hosting:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- etc.

## Next Steps (Future Features)

- Backend API integration (replace mockData)
- User authentication (login/signup)
- Payment integration (Stripe, etc.)
- Calendar sync (Google Calendar, Outlook)
- Email notifications & reminders
- SMS notifications  
- Advanced availability rules (blackout dates, blocked time)
- Meeting video/phone links

## License

MIT
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── package.json
```

## Pages

| Route           | Description                          |
| --------------- | ------------------------------------ |
| `/dashboard`    | Event types grid, create/edit/delete |
| `/availability` | Day toggles + time range pickers     |
| `/meetings`     | Upcoming & past meetings with tabs   |
| `/book/[slug]`  | Multi-step public booking flow       |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

The app auto-redirects from `/` to `/dashboard`.

## Features

### Dashboard (`/dashboard`)

- Grid of event type cards with color indicators
- Create, edit, delete event types
- Copy booking link per event type
- Empty state + loading skeleton
- Delete confirmation modal

### Availability (`/availability`)

- Toggle days on/off with animated switches
- Time range pickers per day
- Timezone dropdown
- Save confirmation feedback

### Meetings (`/meetings`)

- Tab navigation: Upcoming / Past
- Cancel upcoming meetings
- Guest avatar initials
- Empty state per tab

### Public Booking (`/book/[slug]`)

- Step 1: Calendar date picker
- Step 2: Available time slots grid
- Step 3: Name + email form with validation
- Step 4: Booking confirmation screen

## Component API

### `<Button>`

```tsx
<Button variant="primary" size="md" loading={false} icon={<Icon />}>
  Click me
</Button>
```

Variants: `primary | secondary | ghost | danger | outline`

### `<Input>`

```tsx
<Input label="Email" type="email" error="Required" hint="We'll never share this" />
```

### `<Modal>`

```tsx
<Modal isOpen={true} onClose={fn} title="Edit" size="md" footer={<Buttons />}>
  Content
</Modal>
```

### `<Calendar>`

```tsx
<Calendar selectedDate={date} onSelectDate={(d) => setDate(d)} />
```

## Design System

- **Primary**: Blue 600 (`#2563EB`)
- **Background**: Slate 50 (`#F8FAFC`)
- **Surface**: White with `border-slate-200`
- **Radius**: `rounded-xl` (12px), `rounded-2xl` (16px)
- **Shadows**: Soft, layered (`shadow-sm` → `shadow-md` on hover)
- **Transitions**: 150–200ms ease-in-out on all interactive elements
