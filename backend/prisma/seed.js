import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_USER_ID = "user-001";

const SAMPLE_MEETING_ID = "seed-meeting-001";
const EVENT_30_SLUG = "30-min-meeting";
const EVENT_60_SLUG = "60-min-meeting";

const toDateString = (d) => d.toISOString().split("T")[0];

const nextBusinessDay = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  return d;
};

const seed = async () => {
  const user = await prisma.user.upsert({
    where: { id: DEFAULT_USER_ID },
    update: {
      username: "parag",
      name: "Default User",
      email: "admin@scheduly.com",
      timezone: "Asia/Kolkata",
    },
    create: {
      id: DEFAULT_USER_ID,
      username: "parag",
      name: "Default User",
      email: "admin@scheduly.com",
      timezone: "Asia/Kolkata",
    },
  });

  const event30 = await prisma.eventType.upsert({
    where: { slug: EVENT_30_SLUG },
    update: {
      name: "30 Minute Meeting",
      duration: 30,
      color: "#0069ff",
      description: "A quick 30-minute sync",
      userId: user.id,
      isActive: true,
    },
    create: {
      name: "30 Minute Meeting",
      slug: EVENT_30_SLUG,
      duration: 30,
      color: "#0069ff",
      description: "A quick 30-minute sync",
      userId: user.id,
    },
  });

  await prisma.eventType.upsert({
    where: { slug: EVENT_60_SLUG },
    update: {
      name: "60 Minute Meeting",
      duration: 60,
      color: "#7c3aed",
      description: "A detailed 1-hour session",
      userId: user.id,
      isActive: true,
    },
    create: {
      name: "60 Minute Meeting",
      slug: EVENT_60_SLUG,
      duration: 60,
      color: "#7c3aed",
      description: "A detailed 1-hour session",
      userId: user.id,
    },
  });

  const sampleDate = toDateString(nextBusinessDay());

  await prisma.meeting.upsert({
    where: { id: SAMPLE_MEETING_ID },
    update: {
      inviteeName: "Sample Invitee",
      inviteeEmail: "sample.invitee@scheduly.com",
      date: sampleDate,
      startTime: "10:00",
      endTime: "10:30",
      notes: "Seeded sample meeting",
      status: "UPCOMING",
      eventTypeId: event30.id,
      userId: user.id,
    },
    create: {
      id: SAMPLE_MEETING_ID,
      inviteeName: "Sample Invitee",
      inviteeEmail: "sample.invitee@scheduly.com",
      date: sampleDate,
      startTime: "10:00",
      endTime: "10:30",
      notes: "Seeded sample meeting",
      status: "UPCOMING",
      eventTypeId: event30.id,
      userId: user.id,
    },
  });

  console.log("Seed data inserted successfully");
};

seed()
  .catch((error) => {
    console.error("Failed to seed database", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
    });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
