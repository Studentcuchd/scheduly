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
