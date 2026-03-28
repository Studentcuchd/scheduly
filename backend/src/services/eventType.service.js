import { prisma } from "../config/db.js";
import { DEFAULT_USER_ID } from "../constants/index.js";

export const getAllEventTypes = async () => {
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
};

export const createEventType = async (data) => {
  const { name, duration, slug, color, description } = data;

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
};

export const updateEventType = async (id, data) => {
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
};

export const deleteEventType = async (id) => {
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
};

export const toggleEventType = async (id) => {
  const current = await prisma.eventType.findUnique({ where: { id } });
  if (!current) {
    throw new Error("Event type not found.");
  }

  return prisma.eventType.update({
    where: { id },
    data: { isActive: !current.isActive },
  });
};
