import { prisma } from "../config/db.js";
import { generateSlots } from "../utils/slotGenerator.js";
import {
  getCurrentDateAndMinutesInTimeZone,
  getDayOfWeekFromDateString,
  isValidDateString,
  isValidTimeString,
  toMinutes,
  toTimeString,
} from "../utils/dateUtils.js";

const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const ensureUserMatchesUsername = (user, username) => {
  if (!username) {
    return;
  }

  const expected = String(user?.username || "").trim().toLowerCase();
  const actual = String(username || "").trim().toLowerCase();

  if (!expected || expected !== actual) {
    const error = new Error("Public booking link is invalid.");
    error.statusCode = 404;
    throw error;
  }
};

const mapAvailabilityForPublic = (availability) => {
  const days = DAY_KEYS.reduce((acc, key) => {
    acc[key] = { enabled: false, start: "09:00", end: "17:00" };
    return acc;
  }, {});

  for (const day of availability?.days || []) {
    const key = DAY_KEYS[day.dayOfWeek];
    if (!key) {
      continue;
    }

    days[key] = {
      enabled: day.isEnabled,
      start: day.startTime,
      end: day.endTime,
    };
  }

  return {
    timezone: availability?.timezone || "UTC",
    days,
  };
};

const getEventWithUser = async (slug) => {
  const event = await prisma.eventType.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          timezone: true,
          availability: {
            include: { days: true },
          },
        },
      },
    },
  });

  if (!event) {
    const error = new Error("Event type not found.");
    error.statusCode = 404;
    throw error;
  }

  if (!event.isActive) {
    const error = new Error("This event type is not active.");
    error.statusCode = 400;
    throw error;
  }

  return event;
};

export const getEventBySlug = async (slug, username) => {
  const event = await getEventWithUser(slug);
  ensureUserMatchesUsername(event.user, username);

  return {
    id: event.id,
    name: event.name,
    slug: event.slug,
    duration: event.duration,
    description: event.description,
    color: event.color,
    user: {
      name: event.user.name,
      username: event.user.username,
      timezone: event.user.timezone,
    },
    availability: mapAvailabilityForPublic(event.user.availability),
  };
};

export const getPublicEventByUsernameAndSlug = async (username, slug) => getEventBySlug(slug, username);

const getAvailableSlotsForEvent = async (event, date) => {
  const availability = await prisma.availability.findUnique({
    where: { userId: event.userId },
    include: { days: true },
  });

  if (!availability) {
    const error = new Error("Availability not configured.");
    error.statusCode = 400;
    throw error;
  }

  const { date: todayInTimezone } = getCurrentDateAndMinutesInTimeZone(availability.timezone || "UTC");
  if (date < todayInTimezone) {
    return [];
  }

  const dayOfWeek = getDayOfWeekFromDateString(date);
  const dayAvailability = availability.days.find((d) => d.dayOfWeek === dayOfWeek);

  if (!dayAvailability || !dayAvailability.isEnabled) {
    return [];
  }

  const bookedMeetings = await prisma.meeting.findMany({
    where: {
      userId: event.userId,
      date,
      status: { not: "CANCELLED" },
    },
    select: { startTime: true, endTime: true },
  });

  return generateSlots({
    startTime: dayAvailability.startTime,
    endTime: dayAvailability.endTime,
    duration: event.duration,
    bookedSlots: bookedMeetings,
    date,
    timezone: availability.timezone,
  });
};

export const getAvailableSlots = async (slug, date, username) => {
  if (!date || !isValidDateString(date)) {
    const error = new Error("Valid date query is required in YYYY-MM-DD format.");
    error.statusCode = 400;
    throw error;
  }

  const event = await getEventWithUser(slug);
  ensureUserMatchesUsername(event.user, username);

  return getAvailableSlotsForEvent(event, date);
};

export const getPublicSlotsByUsernameAndSlug = async (username, slug, date) =>
  getAvailableSlots(slug, date, username);

export const createBooking = async (slug, data, username) => {
  const { inviteeName, inviteeEmail, date, startTime, endTime: submittedEndTime, notes } = data;
  const bufferMinutes = Number(process.env.BOOKING_BUFFER_MINUTES || 0);

  if (!isValidDateString(date)) {
    const error = new Error("Date must be a valid YYYY-MM-DD value.");
    error.statusCode = 400;
    throw error;
  }

  if (!isValidTimeString(startTime)) {
    const error = new Error("startTime must be a valid HH:mm value.");
    error.statusCode = 400;
    throw error;
  }

  const event = await getEventWithUser(slug);
  ensureUserMatchesUsername(event.user, username);

  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + event.duration;
  const endTime = toTimeString(totalMinutes);

  if (submittedEndTime && submittedEndTime !== endTime) {
    const error = new Error("endTime does not match event duration.");
    error.statusCode = 400;
    throw error;
  }

  const allowedSlots = await getAvailableSlotsForEvent(event, date);
  if (!allowedSlots.includes(startTime)) {
    const error = new Error("Selected slot is not available.");
    error.statusCode = 409;
    throw error;
  }

  let meeting;
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt += 1) {
    try {
      meeting = await prisma.$transaction(
        async (tx) => {
          await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`${event.userId}:${date}`}))`;

          const existingMeetings = await tx.meeting.findMany({
            where: {
              userId: event.userId,
              date,
              status: { not: "CANCELLED" },
            },
            select: { startTime: true, endTime: true },
          });

          const newStart = toMinutes(startTime);
          const newEnd = toMinutes(endTime);

          const conflict = existingMeetings.find((existing) => {
            const existingStart = toMinutes(existing.startTime);
            const existingEnd = toMinutes(existing.endTime);

            return newStart < existingEnd + bufferMinutes && newEnd + bufferMinutes > existingStart;
          });

          if (conflict) {
            const error = new Error("This time slot is already booked. Please choose another.");
            error.statusCode = 409;
            throw error;
          }

          return tx.meeting.create({
            data: {
              inviteeName,
              inviteeEmail,
              date,
              startTime,
              endTime,
              notes,
              status: "UPCOMING",
              eventTypeId: event.id,
              userId: event.userId,
            },
            include: { eventType: true },
          });
        },
        { isolationLevel: "Serializable" }
      );

      break;
    } catch (error) {
      if (error?.code === "P2034" && attempt < maxRetries - 1) {
        continue;
      }
      throw error;
    }
  }

  return meeting;
};

export const createPublicBooking = async (data) => {
  const { username, slug, ...bookingData } = data;

  if (!username || !slug) {
    const error = new Error("username and slug are required.");
    error.statusCode = 400;
    throw error;
  }

  return createBooking(slug, bookingData, username);
};
