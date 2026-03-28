import { prisma } from "../config/db.js";
import { DEFAULT_USER_ID } from "../constants/index.js";

export const getAvailability = async () => {
  return prisma.availability.findUnique({
    where: { userId: DEFAULT_USER_ID },
    include: { days: { orderBy: { dayOfWeek: "asc" } } },
  });
};

export const saveAvailability = async (data) => {
  const { timezone, days } = data;

  const existing = await prisma.availability.findUnique({
    where: { userId: DEFAULT_USER_ID },
  });

  if (existing) {
    await prisma.availabilityDay.deleteMany({
      where: { availabilityId: existing.id },
    });

    return prisma.availability.update({
      where: { userId: DEFAULT_USER_ID },
      data: {
        timezone,
        days: { create: days },
      },
      include: { days: { orderBy: { dayOfWeek: "asc" } } },
    });
  }

  return prisma.availability.create({
    data: {
      timezone,
      userId: DEFAULT_USER_ID,
      days: { create: days },
    },
    include: { days: { orderBy: { dayOfWeek: "asc" } } },
  });
};
