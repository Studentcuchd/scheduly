import {
  addMinutes,
  format,
  isAfter,
  isBefore,
  isSameDay,
  parse,
  parseISO,
  startOfDay,
} from "date-fns";

export const parseTimeOnDate = (time24, date) => {
  const [hours, minutes] = time24.split(":").map(Number);
  const target = new Date(date);
  target.setHours(hours, minutes, 0, 0);
  return target;
};

export const formatMeetingDate = (isoDate) => format(parseISO(isoDate), "EEEE, MMMM d, yyyy");

export const formatDisplayTime = (time24) => format(parse(time24, "HH:mm", new Date()), "hh:mm a");

export const formatTimeRange = (startTime, endTime) =>
  `${formatDisplayTime(startTime)} - ${formatDisplayTime(endTime)}`;

export const formatBookingHeaderDate = (date) => format(date, "EEEE, MMMM d");

export const isPastDate = (date) => isBefore(startOfDay(date), startOfDay(new Date()));

export const isSlotInPast = (date, time24) => {
  const slotDateTime = parseTimeOnDate(time24, date);
  return isSameDay(date, new Date()) && isBefore(slotDateTime, new Date());
};

export const doesSlotOverlap = (slotStart, duration, bookingStart, bookingEnd) => {
  const slotEnd = addMinutes(slotStart, duration);
  return isBefore(slotStart, bookingEnd) && isAfter(slotEnd, bookingStart);
};
