import { beforeAll, beforeEach, afterAll, describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/config/db.js";
import { DEFAULT_USER_ID } from "../src/constants/index.js";

const TEST_USER = {
  id: DEFAULT_USER_ID,
  username: "testuser",
  name: "Test User",
  email: "test.user@scheduly.com",
  timezone: "Asia/Kolkata",
};

const DEFAULT_EVENT = {
  id: "test-event-001",
  name: "30 Minute Meeting",
  slug: "test-30-min",
  duration: 30,
  color: "#0069ff",
};

const nextDateForDay = (targetDay) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + 1);

  while (date.getDay() !== targetDay) {
    date.setDate(date.getDate() + 1);
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const yesterdayDate = () => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const clearDb = async () => {
  await prisma.meeting.deleteMany();
  await prisma.availabilityDay.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.eventType.deleteMany();
  await prisma.user.deleteMany();
};

const restoreDefaultData = async () => {
  const user = await prisma.user.create({
    data: {
      id: DEFAULT_USER_ID,
      username: "parag",
      name: "Default User",
      email: "admin@scheduly.com",
      timezone: "Asia/Kolkata",
    },
  });

  const event30 = await prisma.eventType.create({
    data: {
      name: "30 Minute Meeting",
      slug: "30-min-meeting",
      duration: 30,
      color: "#0069ff",
      description: "A quick 30-minute sync",
      userId: user.id,
    },
  });

  const event60 = await prisma.eventType.create({
    data: {
      name: "60 Minute Meeting",
      slug: "60-min-meeting",
      duration: 60,
      color: "#7c3aed",
      description: "A detailed 1-hour session",
      userId: user.id,
    },
  });

  await prisma.availability.create({
    data: {
      timezone: "Asia/Kolkata",
      userId: user.id,
      days: {
        create: [
          { dayOfWeek: 0, isEnabled: false, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 1, isEnabled: true, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 2, isEnabled: true, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 3, isEnabled: true, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 4, isEnabled: true, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 5, isEnabled: true, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 6, isEnabled: false, startTime: "09:00", endTime: "17:00" },
        ],
      },
    },
  });

  const today = new Date();
  const toDateString = (d) => d.toISOString().split("T")[0];
  const future1 = new Date(today);
  future1.setDate(today.getDate() + 5);
  const future2 = new Date(today);
  future2.setDate(today.getDate() + 10);

  await prisma.meeting.createMany({
    data: [
      {
        inviteeName: "Rahul Sharma",
        inviteeEmail: "rahul@example.com",
        date: toDateString(future1),
        startTime: "10:00",
        endTime: "10:30",
        notes: "Discuss project requirements",
        status: "UPCOMING",
        eventTypeId: event30.id,
        userId: user.id,
      },
      {
        inviteeName: "Priya Mehta",
        inviteeEmail: "priya@example.com",
        date: toDateString(future2),
        startTime: "14:00",
        endTime: "15:00",
        notes: "Strategy deep dive",
        status: "UPCOMING",
        eventTypeId: event60.id,
        userId: user.id,
      },
    ],
  });
};

const seedBase = async ({ duration = 30 } = {}) => {
  const user = await prisma.user.create({
    data: TEST_USER,
  });

  const event = await prisma.eventType.create({
    data: {
      ...DEFAULT_EVENT,
      duration,
      userId: user.id,
    },
  });

  await prisma.availability.create({
    data: {
      userId: user.id,
      timezone: user.timezone,
      days: {
        create: [
          { dayOfWeek: 0, isEnabled: false, startTime: "09:00", endTime: "11:00" },
          { dayOfWeek: 1, isEnabled: true, startTime: "09:00", endTime: "11:00" },
          { dayOfWeek: 2, isEnabled: true, startTime: "09:00", endTime: "11:00" },
          { dayOfWeek: 3, isEnabled: true, startTime: "09:00", endTime: "11:00" },
          { dayOfWeek: 4, isEnabled: true, startTime: "09:00", endTime: "11:00" },
          { dayOfWeek: 5, isEnabled: true, startTime: "09:00", endTime: "11:00" },
          { dayOfWeek: 6, isEnabled: false, startTime: "09:00", endTime: "11:00" },
        ],
      },
    },
  });

  return { user, event };
};

beforeAll(async () => {
  await clearDb();
});

beforeEach(async () => {
  await clearDb();
});

afterAll(async () => {
  await clearDb();
  await restoreDefaultData();
  await prisma.$disconnect();
});

describe("API Tests", () => {
  describe("Health API", () => {
    test("GET /api/health returns service status", async () => {
      const response = await request(app).get("/api/health");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("ok");
      expect(response.body.timestamp).toBeTruthy();
    });
  });

  describe("Event Types API", () => {
    test("GET /api/events returns existing event types", async () => {
      const { event } = await seedBase();

      const response = await request(app).get("/api/events");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].slug).toBe(event.slug);
    });

    test("POST /api/events creates a new event type", async () => {
      await seedBase();

      const payload = {
        name: "45 Minute Review",
        duration: 45,
        slug: "review-45",
        color: "#00a86b",
        description: "Portfolio review",
      };

      const response = await request(app).post("/api/events").send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe(payload.slug);
    });

    test("POST /api/events rejects duplicate slug", async () => {
      const { event } = await seedBase();

      const response = await request(app).post("/api/events").send({
        name: "Another",
        duration: 30,
        slug: event.slug,
      });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    test("PUT /api/events/:id updates event type", async () => {
      const { event } = await seedBase();

      const response = await request(app).put(`/api/events/${event.id}`).send({
        name: "Updated Name",
        duration: 60,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Updated Name");
      expect(response.body.data.duration).toBe(60);
    });

    test("PATCH /api/events/:id/toggle toggles active status", async () => {
      const { event } = await seedBase();

      const response = await request(app).patch(`/api/events/${event.id}/toggle`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isActive).toBe(false);
    });

    test("DELETE /api/events/:id rejects when active meetings exist", async () => {
      const { user, event } = await seedBase();
      const mondayDate = nextDateForDay(1);

      await prisma.meeting.create({
        data: {
          inviteeName: "Active Meeting",
          inviteeEmail: "active@scheduly.com",
          date: mondayDate,
          startTime: "09:00",
          endTime: "09:30",
          status: "UPCOMING",
          eventTypeId: event.id,
          userId: user.id,
        },
      });

      const response = await request(app).delete(`/api/events/${event.id}`);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    test("DELETE /api/events/:id succeeds after related meetings are cancelled", async () => {
      const { user, event } = await seedBase();
      const mondayDate = nextDateForDay(1);

      const meeting = await prisma.meeting.create({
        data: {
          inviteeName: "Cancelled Meeting",
          inviteeEmail: "cancelled@scheduly.com",
          date: mondayDate,
          startTime: "09:00",
          endTime: "09:30",
          status: "UPCOMING",
          eventTypeId: event.id,
          userId: user.id,
        },
      });

      await request(app).patch(`/api/meetings/${meeting.id}/cancel`);
      const response = await request(app).delete(`/api/events/${event.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("Availability API", () => {
    test("GET /api/availability returns saved availability", async () => {
      await seedBase();

      const response = await request(app).get("/api/availability");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.timezone).toBe(TEST_USER.timezone);
      expect(response.body.data.days).toHaveLength(7);
    });

    test("PUT /api/availability updates timezone and days", async () => {
      await seedBase();

      const payload = {
        timezone: "UTC",
        days: [
          { dayOfWeek: 0, isEnabled: false, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 1, isEnabled: true, startTime: "08:00", endTime: "12:00" },
          { dayOfWeek: 2, isEnabled: true, startTime: "08:00", endTime: "12:00" },
          { dayOfWeek: 3, isEnabled: true, startTime: "08:00", endTime: "12:00" },
          { dayOfWeek: 4, isEnabled: true, startTime: "08:00", endTime: "12:00" },
          { dayOfWeek: 5, isEnabled: true, startTime: "08:00", endTime: "12:00" },
          { dayOfWeek: 6, isEnabled: false, startTime: "09:00", endTime: "17:00" },
        ],
      };

      const response = await request(app).put("/api/availability").send(payload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.timezone).toBe("UTC");
      expect(response.body.data.days[1].startTime).toBe("08:00");
    });

    test("PUT /api/availability rejects invalid payload", async () => {
      await seedBase();

      const response = await request(app).put("/api/availability").send({
        timezone: "UTC",
        days: [{ dayOfWeek: 1, isEnabled: true, startTime: "09:00", endTime: "17:00" }],
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("Public API", () => {
    test("GET /api/public/:username/:slug returns event and availability", async () => {
      const { user, event } = await seedBase();

      const response = await request(app).get(`/api/public/${user.username}/${event.slug}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe(event.slug);
      expect(response.body.data.user.username).toBe(user.username);
      expect(response.body.data.availability.days.monday.enabled).toBe(true);
    });

    test("GET /api/public/:username/:slug returns 404 for invalid username", async () => {
      const { event } = await seedBase();

      const response = await request(app).get(`/api/public/wrong-user/${event.slug}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test("GET /api/public/:username/:slug returns 404 for invalid slug", async () => {
      const { user } = await seedBase();

      const response = await request(app).get(`/api/public/${user.username}/missing-slug`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test("GET /api/public/:username/:slug returns 400 for inactive event", async () => {
      const { user, event } = await seedBase();
      await prisma.eventType.update({ where: { id: event.id }, data: { isActive: false } });

      const response = await request(app).get(`/api/public/${user.username}/${event.slug}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("Slots API", () => {
    test("GET /api/slots/:username/:slug generates slots based on availability and duration", async () => {
      const { user, event } = await seedBase({ duration: 30 });
      const mondayDate = nextDateForDay(1);

      const response = await request(app).get(`/api/slots/${user.username}/${event.slug}`).query({ date: mondayDate });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(expect.arrayContaining(["09:00", "09:30", "10:00", "10:30"]));
    });

    test("GET /api/slots/:username/:slug does not include already booked slots", async () => {
      const { user, event } = await seedBase({ duration: 30 });
      const mondayDate = nextDateForDay(1);

      await prisma.meeting.create({
        data: {
          inviteeName: "Booked User",
          inviteeEmail: "booked@scheduly.com",
          date: mondayDate,
          startTime: "10:00",
          endTime: "10:30",
          status: "UPCOMING",
          eventTypeId: event.id,
          userId: user.id,
        },
      });

      const response = await request(app).get(`/api/slots/${user.username}/${event.slug}`).query({ date: mondayDate });

      expect(response.status).toBe(200);
      expect(response.body.data).not.toContain("10:00");
    });

    test("GET /api/slots/:username/:slug returns empty array for disabled day", async () => {
      const { user, event } = await seedBase({ duration: 30 });
      const sundayDate = nextDateForDay(0);

      const response = await request(app).get(`/api/slots/${user.username}/${event.slug}`).query({ date: sundayDate });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    test("GET /api/slots/:username/:slug rejects invalid date", async () => {
      const { user, event } = await seedBase({ duration: 30 });

      const response = await request(app).get(`/api/slots/${user.username}/${event.slug}`).query({ date: "2026-13-40" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("Booking API", () => {
    test("POST /api/book creates meeting and stores correct DB data", async () => {
      const { user, event } = await seedBase({ duration: 30 });
      const mondayDate = nextDateForDay(1);

      const payload = {
        username: user.username,
        slug: event.slug,
        date: mondayDate,
        startTime: "09:00",
        endTime: "09:30",
        inviteeName: "Alice",
        inviteeEmail: "alice@example.com",
      };

      const response = await request(app).post("/api/book").send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.inviteeEmail).toBe(payload.inviteeEmail);
      expect(response.body.data.endTime).toBe("09:30");

      const meeting = await prisma.meeting.findUnique({ where: { id: response.body.data.id } });
      expect(meeting).not.toBeNull();
      expect(meeting.userId).toBe(user.id);
      expect(meeting.eventTypeId).toBe(event.id);
      expect(meeting.date).toBe(mondayDate);
      expect(meeting.startTime).toBe("09:00");
    });

    test("POST /api/book rejects missing required fields", async () => {
      const { user, event } = await seedBase({ duration: 30 });
      const mondayDate = nextDateForDay(1);

      const response = await request(app).post("/api/book").send({
        username: user.username,
        slug: event.slug,
        date: mondayDate,
        startTime: "09:00",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("POST /api/book rejects booking in past date", async () => {
      const { user, event } = await seedBase({ duration: 30 });
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      const response = await request(app).post("/api/book").send({
        username: user.username,
        slug: event.slug,
        date: yesterday,
        startTime: "09:00",
        inviteeName: "Past User",
        inviteeEmail: "past@example.com",
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/not available/i);
    });

    test("POST /api/book prevents double booking for the same slot", async () => {
      const { user, event } = await seedBase({ duration: 30 });
      const mondayDate = nextDateForDay(1);

      const payload = {
        username: user.username,
        slug: event.slug,
        date: mondayDate,
        startTime: "09:00",
        inviteeName: "Bob",
        inviteeEmail: "bob@example.com",
      };

      const first = await request(app).post("/api/book").send(payload);
      const second = await request(app).post("/api/book").send(payload);

      expect(first.status).toBe(201);
      expect(second.status).toBe(409);
      expect(second.body.message).toMatch(/already booked|not available/i);
    });

    test("POST /api/book handles concurrency: only one request succeeds for same slot", async () => {
      const { user, event } = await seedBase({ duration: 30 });
      const mondayDate = nextDateForDay(1);

      const payload = {
        username: user.username,
        slug: event.slug,
        date: mondayDate,
        startTime: "09:30",
        inviteeName: "Concurrent",
        inviteeEmail: "concurrent@example.com",
      };

      const [r1, r2] = await Promise.all([
        request(app).post("/api/book").send(payload),
        request(app).post("/api/book").send(payload),
      ]);

      const statuses = [r1.status, r2.status].sort((a, b) => a - b);
      expect(statuses).toEqual([201, 409]);

      const count = await prisma.meeting.count({
        where: {
          userId: user.id,
          date: mondayDate,
          startTime: "09:30",
        },
      });

      expect(count).toBe(1);
    });

    test("POST /api/book rejects invalid username", async () => {
      const { event } = await seedBase({ duration: 30 });
      const mondayDate = nextDateForDay(1);

      const response = await request(app).post("/api/book").send({
        username: "wrong-user",
        slug: event.slug,
        date: mondayDate,
        startTime: "09:00",
        inviteeName: "Wrong User",
        inviteeEmail: "wrong@example.com",
      });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test("POST /api/book rejects mismatched endTime", async () => {
      const { user, event } = await seedBase({ duration: 30 });
      const mondayDate = nextDateForDay(1);

      const response = await request(app).post("/api/book").send({
        username: user.username,
        slug: event.slug,
        date: mondayDate,
        startTime: "09:00",
        endTime: "10:30",
        inviteeName: "End Mismatch",
        inviteeEmail: "mismatch@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("Meetings API", () => {
    test("GET /api/meetings returns meetings for default user", async () => {
      const { user, event } = await seedBase();
      const mondayDate = nextDateForDay(1);

      const created = await prisma.meeting.create({
        data: {
          inviteeName: "Meeting API",
          inviteeEmail: "meeting.api@scheduly.com",
          date: mondayDate,
          startTime: "10:00",
          endTime: "10:30",
          status: "UPCOMING",
          eventTypeId: event.id,
          userId: user.id,
        },
      });

      const response = await request(app).get("/api/meetings");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.some((m) => m.id === created.id)).toBe(true);
    });

    test("GET /api/meetings converts past upcoming meetings to past", async () => {
      const { user, event } = await seedBase();

      const meeting = await prisma.meeting.create({
        data: {
          inviteeName: "Past Convert",
          inviteeEmail: "past.convert@scheduly.com",
          date: yesterdayDate(),
          startTime: "09:00",
          endTime: "09:30",
          status: "UPCOMING",
          eventTypeId: event.id,
          userId: user.id,
        },
      });

      const response = await request(app).get("/api/meetings?status=past");

      expect(response.status).toBe(200);
      expect(response.body.data.some((m) => m.id === meeting.id && m.status === "PAST")).toBe(true);
    });

    test("GET /api/meetings/:id returns single meeting", async () => {
      const { user, event } = await seedBase();
      const mondayDate = nextDateForDay(1);

      const meeting = await prisma.meeting.create({
        data: {
          inviteeName: "Single Meeting",
          inviteeEmail: "single@scheduly.com",
          date: mondayDate,
          startTime: "11:00",
          endTime: "11:30",
          status: "UPCOMING",
          eventTypeId: event.id,
          userId: user.id,
        },
      });

      const response = await request(app).get(`/api/meetings/${meeting.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(meeting.id);
    });

    test("PATCH /api/meetings/:id/cancel cancels meeting", async () => {
      const { user, event } = await seedBase();
      const mondayDate = nextDateForDay(1);

      const meeting = await prisma.meeting.create({
        data: {
          inviteeName: "Cancel Meeting",
          inviteeEmail: "cancel@scheduly.com",
          date: mondayDate,
          startTime: "10:30",
          endTime: "11:00",
          status: "UPCOMING",
          eventTypeId: event.id,
          userId: user.id,
        },
      });

      const response = await request(app).patch(`/api/meetings/${meeting.id}/cancel`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe("CANCELLED");
    });
  });
});
