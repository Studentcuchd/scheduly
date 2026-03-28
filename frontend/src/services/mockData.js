export const mockEventTypes = [
  {
    id: "1",
    name: "Founder Intro Call",
    duration: 30,
    slug: "founder-intro-call",
    color: "#0069ff",
    description: "Quick project-fit and requirement discovery call.",
    isActive: true,
  },
  {
    id: "2",
    name: "Product Strategy Session",
    duration: 60,
    slug: "product-strategy-session",
    color: "#00a2ff",
    description: "Deep-dive session for product planning and delivery roadmap.",
    isActive: true,
  },
];

export const mockAvailability = {
  timezone: "Asia/Kolkata",
  days: {
    monday: { enabled: true, start: "09:00", end: "17:00" },
    tuesday: { enabled: true, start: "09:00", end: "17:00" },
    wednesday: { enabled: true, start: "09:00", end: "17:00" },
    thursday: { enabled: true, start: "09:00", end: "17:00" },
    friday: { enabled: true, start: "09:00", end: "17:00" },
    saturday: { enabled: false, start: "09:00", end: "17:00" },
    sunday: { enabled: false, start: "09:00", end: "17:00" },
  },
};

export const mockMeetings = [
  {
    id: "1",
    eventTypeName: "Founder Intro Call",
    inviteeName: "Rahul Sharma",
    inviteeEmail: "rahul@example.com",
    date: "2026-04-02",
    startTime: "10:00",
    endTime: "10:30",
    status: "upcoming",
  },
  {
    id: "2",
    eventTypeName: "Product Strategy Session",
    inviteeName: "Priya Mehta",
    inviteeEmail: "priya@example.com",
    date: "2026-03-20",
    startTime: "14:00",
    endTime: "15:00",
    status: "past",
  },
];

export const mockBookedSlots = {
  "founder-intro-call": {
    "2026-04-02": ["10:00", "11:30"],
  },
  "product-strategy-session": {
    "2026-04-02": ["14:00"],
  },
};
