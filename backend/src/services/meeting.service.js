import { prisma } from "../config/db.js";
import { DEFAULT_USER_ID } from "../constants/index.js";

export const getAllMeetings = async (status) => {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const currentTime = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}`;

  await prisma.meeting.updateMany({
    where: {
      userId: DEFAULT_USER_ID,
      status: "UPCOMING",
      OR: [
        { date: { lt: currentDate } },
        {
          date: currentDate,
          endTime: { lte: currentTime },
        },
      ],
    },
    data: { status: "PAST" },
  });

  const where = { userId: DEFAULT_USER_ID };

  if (status === "upcoming") {
    where.status = "UPCOMING";
  } else if (status === "past") {
    where.status = "PAST";
  } else if (status === "cancelled") {
    where.status = "CANCELLED";
  }

  return prisma.meeting.findMany({
    where,
    include: { eventType: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
};

export const getMeetingById = async (id) => {
  const meeting = await prisma.meeting.findUnique({
    where: { id },
    include: { eventType: true },
  });

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  return meeting;
};

export const cancelMeeting = async (id) => {
  const meeting = await prisma.meeting.findUnique({
    where: { id },
    include: { eventType: true },
  });

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  if (meeting.status !== "UPCOMING") {
    throw new Error("Only upcoming meetings can be cancelled.");
  }

  const updated = await prisma.meeting.update({
    where: { id },
    data: { status: "CANCELLED" },
    include: { eventType: true },
  });

  return updated;
};

export const deleteMeeting = async (id) => {
  const meeting = await prisma.meeting.findUnique({
    where: { id },
    include: { eventType: true },
  });

  if (!meeting) {
    throw new Error("Meeting not found.");
  }

  await prisma.meeting.delete({ where: { id } });
  return meeting;
};
