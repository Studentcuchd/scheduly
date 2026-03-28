export const APP_NAME = "Scheduly";
export const COMPANY = "Scheduly";
export const PROJECT_TAGLINE = "Client-facing scheduling command center";
export const ASSIGNMENT_STAMP = "Built in-house by Parag";

export const ROUTES = {
  ROOT: "/",
  EVENT_TYPES: "/admin/event-types",
  AVAILABILITY: "/admin/availability",
  MEETINGS: "/admin/meetings",
  ANALYTICS: "/admin/analytics",
  SETTINGS: "/admin/settings",
  PUBLIC_BOOKING: (username = ":username", slug = ":slug") => `/${username}/${slug}`,
  PUBLIC_CONFIRM: (username = ":username", slug = ":slug") => `/${username}/${slug}/confirm`,
  BOOKING: (slug = ":slug") => `/book/${slug}`,
  CONFIRM: (slug = ":slug") => `/book/${slug}/confirm`,
};

export const USER = {
  name: "Parag",
  username: "parag",
  initials: "PJ",
  email: "parag@paragdigital.studio",
};

export const EVENT_COLORS = [
  "#0069ff",
  "#00a2ff",
  "#00a86b",
  "#7f56d9",
  "#f04438",
  "#f79009",
];

export const EVENT_COLOR_CLASS = {
  "#0069ff": "bg-[#0069ff] border-[#0069ff]",
  "#00a2ff": "bg-[#00a2ff] border-[#00a2ff]",
  "#00a86b": "bg-[#00a86b] border-[#00a86b]",
  "#7f56d9": "bg-[#7f56d9] border-[#7f56d9]",
  "#f04438": "bg-[#f04438] border-[#f04438]",
  "#f79009": "bg-[#f79009] border-[#f79009]",
};

export const DURATIONS = [15, 30, 45, 60, 90];

export const STATUS_VARIANTS = {
  upcoming: "upcoming",
  past: "past",
  cancelled: "cancelled",
};

export const NAV_ITEMS = [
  { key: "analytics", label: "Dashboard", href: ROUTES.ANALYTICS, icon: "Calendar" },
  { key: "event-types", label: "Events", href: ROUTES.EVENT_TYPES, icon: "Calendar" },
  { key: "availability", label: "Availability", href: ROUTES.AVAILABILITY, icon: "Clock3" },
  { key: "meetings", label: "Meetings", href: ROUTES.MEETINGS, icon: "Users" },
];

export const THEME = {
  primary: "#0069ff",
  primaryDark: "#003cc5",
  success: "#00a86b",
  danger: "#f04438",
  textPrimary: "#1a1a2e",
  textSecondary: "#667085",
  border: "#e4e7ec",
  background: "#f9fafb",
  card: "#ffffff",
};

export const TIMEZONES = [
  "Asia/Kolkata",
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Singapore",
  "Asia/Dubai",
  "Australia/Sydney",
];

export const DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABELS = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const STRINGS = {
  eventTypesTitle: "Event Types",
  availabilityTitle: "Availability",
  meetingsTitle: "Scheduled Events",
  newEventType: "New Event Type",
  duplicateEventType: "Duplicate",
  saveChanges: "Save Changes",
  noUpcomingMeetings: "No upcoming meetings",
  noPastMeetings: "No past meetings",
  noCancelledMeetings: "No cancelled meetings",
};
