import { prisma } from "../config/db.js";
import { DEFAULT_USER_ID } from "../constants/index.js";

const logServiceError = (operation, error, context = {}) => {
  console.error("[eventType.service] Operation failed", {
    operation,
    context,
    message: error?.message,
    code: error?.code,
    meta: error?.meta,
  });
};

const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

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

export const getAllEventTypes = async () => {
  try {
    const eventTypes = await prisma.eventType.findMany({
      where: { userId: DEFAULT_USER_ID },
      include: {
        _count: {
          select: {
            meetings: {
              where: {
                status: "UPCOMING",
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return eventTypes.map(({ _count, ...eventType }) => ({
      ...eventType,
      bookingCount: _count.meetings,
    }));
  } catch (error) {
    logServiceError("getAllEventTypes", error, { userId: DEFAULT_USER_ID });
    throw error;
  }
};

export const getEventTypeBySlug = async (slug) => {
  try {
    const eventType = await prisma.eventType.findUnique({
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

    if (!eventType || !eventType.isActive) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    return {
      id: eventType.id,
      name: eventType.name,
      slug: eventType.slug,
      duration: eventType.duration,
      description: eventType.description,
      color: eventType.color,
      user: {
        id: eventType.user?.id,
        name: eventType.user?.name,
        username: eventType.user?.username,
        timezone: eventType.user?.timezone,
      },
      availability: mapAvailabilityForPublic(eventType.user?.availability),
    };
  } catch (error) {
    logServiceError("getEventTypeBySlug", error, { slug });
    throw error;
  }
};

export const createEventType = async (data) => {
  const { name, duration, slug, color, description } = data;

  try {
    const existing = await prisma.eventType.findUnique({ where: { slug } });
    if (existing) {
      const error = new Error("Slug already exists. Choose a different one.");
      error.statusCode = 409;
      throw error;
    }

    return prisma.eventType.create({
      data: {
        name,
        duration,
        slug,
        color,
        description,
        userId: DEFAULT_USER_ID,
      },
    });
  } catch (error) {
    logServiceError("createEventType", error, { slug, userId: DEFAULT_USER_ID });
    throw error;
  }
};

export const updateEventType = async (id, data) => {
  try {
    const current = await prisma.eventType.findUnique({ where: { id } });
    if (!current) {
      const error = new Error("Event type not found.");
      error.statusCode = 404;
      throw error;
    }

    if (data.slug) {
      const existing = await prisma.eventType.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (existing) {
        const error = new Error("Slug already exists.");
        error.statusCode = 409;
        throw error;
      }
    }

    return prisma.eventType.update({ where: { id }, data });
  } catch (error) {
    logServiceError("updateEventType", error, { id, slug: data?.slug });
    throw error;
  }
};

export const deleteEventType = async (id) => {
  try {
    const current = await prisma.eventType.findUnique({ where: { id } });
    if (!current) {
      const error = new Error("Event type not found.");
      error.statusCode = 404;
      throw error;
    }

    const meetings = await prisma.meeting.count({
      where: {
        eventTypeId: id,
        status: { not: "CANCELLED" },
      },
    });

    if (meetings > 0) {
      const error = new Error("Cannot delete event type with active meetings. Cancel related meetings first.");
      error.statusCode = 409;
      throw error;
    }

    // Remove cancelled meeting records first to satisfy FK constraints.
    await prisma.meeting.deleteMany({
      where: {
        eventTypeId: id,
        status: "CANCELLED",
      },
    });

    return prisma.eventType.delete({ where: { id } });
  } catch (error) {
    logServiceError("deleteEventType", error, { id });
    throw error;
  }
};

export const toggleEventType = async (id) => {
  try {
    const current = await prisma.eventType.findUnique({ where: { id } });
    if (!current) {
      const error = new Error("Event type not found.");
      error.statusCode = 404;
      throw error;
    }

    return prisma.eventType.update({
      where: { id },
      data: { isActive: !current.isActive },
    });
  } catch (error) {
    logServiceError("toggleEventType", error, { id });
    throw error;
  }
};
