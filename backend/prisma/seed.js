import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_USER_ID = "user-001";

const today = new Date();
const future1 = new Date(today);
future1.setDate(today.getDate() + 5);
const future2 = new Date(today);
future2.setDate(today.getDate() + 10);
const past1 = new Date(today);
past1.setDate(today.getDate() - 7);
const cancelledDate = new Date(today);
cancelledDate.setDate(today.getDate() + 3);

const toDateString = (d) => d.toISOString().split("T")[0];

const seed = async () => {
  await prisma.meeting.deleteMany();
  await prisma.availabilityDay.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.eventType.deleteMany();
  await prisma.user.deleteMany();

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
      {
        inviteeName: "Aman Verma",
        inviteeEmail: "aman@example.com",
        date: toDateString(past1),
        startTime: "11:00",
        endTime: "11:30",
        notes: "Retrospective",
        status: "PAST",
        eventTypeId: event30.id,
        userId: user.id,
      },
      {
        inviteeName: "Neha Singh",
        inviteeEmail: "neha@example.com",
        date: toDateString(cancelledDate),
        startTime: "16:00",
        endTime: "16:30",
        notes: "Cancelled by host",
        status: "CANCELLED",
        eventTypeId: event30.id,
        userId: user.id,
      },
    ],
  });

  console.log("Database seeded successfully");
};

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
